/* Keep the iframe alive while collapsed: drafts, results and scroll stay intact. */
(() => {
  const l = (zh, en) => curLang === 'en' ? en : zh;
  let collapsed = false, moving = null, frame = 0, suppressClick = false, previousFocus = null, canMove = true, hasError = false;
  const row = document.createElement('div');
  row.className = 'window-actions';
  row.innerHTML = '<button id="collapseWindow" class="footer-btn"><span class="btn-icon" data-smart-icon="circle"></span><span class="btn-text"></span></button><button id="moveWindow" class="window-move"><span data-smart-icon="arrows-move"></span></button>';
  document.querySelector('.sidebar-footer').append(row);
  const collapseButton = row.querySelector('#collapseWindow');
  const moveButton = row.querySelector('#moveWindow');
  moveButton.remove();
  const bubble = document.createElement('button');
  bubble.id = 'pluginBubble';
  // Reuse the original purple four-tile identity, not a new icon or emoji.
  bubble.innerHTML = '<span class="bubble-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
  document.body.append(bubble);
  const status = document.createElement('span');
  status.id = 'windowStatus'; status.className = 'sr-only'; status.setAttribute('aria-live','polite');
  row.append(status);
  const send = (type, data = {}) => postMsg(type, data);
  const fullSize = () => ({ width:innerWidth, height:innerHeight });
  let scrollSnapshot = [];
  function rememberScroll() {
    if (collapsed) return;
    scrollSnapshot = [...document.querySelectorAll('.app-container *')].filter(el => el.clientHeight > 0 && el.scrollHeight > el.clientHeight).map(el => [el,el.scrollTop,el.scrollLeft]);
  }
  function restoreScroll() {
    requestAnimationFrame(() => {
      if (collapsed || innerWidth <= 70) return;
      for (const [el,top,left] of scrollSnapshot) { el.scrollTop = top; el.scrollLeft = left; }
      scrollSnapshot = [];
    });
  }
  window.addEventListener('resize',restoreScroll);
  function refresh() {
    status.textContent = hasError ? l('窗口移动不可用，可使用宿主标题栏拖动。', 'Window movement is unavailable. Drag the host title bar instead.') : '';
    collapseButton.querySelector('.btn-text').textContent = l('收起', 'Collapse');
    for (const [button, label] of [
      [collapseButton, l('点击收起为贴边气泡；拖拽移动面板', 'Click to collapse to an edge bubble; drag to move the panel.')],
      [moveButton, l('拖拽移动面板，靠近左右边缘时收起；方向键移动', 'Drag panel to move; release near an edge to collapse. Arrow keys move it.')],
      [bubble, canMove ? l('点击展开，拖拽移动气泡；方向键移动', 'Click to expand; drag to move the bubble. Arrow keys move it.') : l('点击展开；使用宿主标题栏拖动', 'Click to expand; drag the host title bar to move.')]
    ]) { button.title = label; button.setAttribute('aria-label',label); }
    bubble.setAttribute('aria-expanded', String(!collapsed));
    collapseButton.setAttribute('aria-expanded', String(!collapsed));
  }
  collapseButton.onclick = () => {
    if (suppressClick) { suppressClick = false; return; }
    rememberScroll();
    send('window-collapse', fullSize());
  };
  bubble.onclick = () => { if (suppressClick) { suppressClick = false; return; } send('window-expand'); };
  function down(e) {
    if (e.button !== 0 || moving || !canMove) return;
    suppressClick = false;
    moving = { el:e.currentTarget, id:e.pointerId, x:e.screenX, y:e.screenY, dx:0, dy:0, started:false };
    moving.el.setPointerCapture(e.pointerId);
  }
  function move(e) {
    if (!moving || moving.id !== e.pointerId) return;
    moving.dx = e.screenX - moving.x; moving.dy = e.screenY - moving.y;
    if (!moving.started && Math.hypot(moving.dx, moving.dy) < 5) return;
    if (!moving.started) {
      moving.started = true;
      moving.el.classList.add('is-dragging');
      send('window-drag-start', fullSize());
    }
    e.preventDefault();
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      if (moving) send('window-drag-move', { dx:moving.dx, dy:moving.dy });
    });
  }
  function finish(e) {
    if (!moving || moving.id !== e.pointerId) return;
    cancelAnimationFrame(frame); frame = 0;
    const old = moving; moving = null;
    old.el.classList.remove('is-dragging');
    if (old.el.hasPointerCapture(old.id)) old.el.releasePointerCapture(old.id);
    if (old.started) {
      if (!collapsed) rememberScroll();
      suppressClick = e.type !== 'pointercancel' && old.el !== moveButton;
      if (suppressClick) setTimeout(() => { suppressClick = false; },0);
      send(e.type === 'pointercancel' ? 'window-drag-cancel' : 'window-drag-end', { dx:e.screenX - old.x, dy:e.screenY - old.y });
    }
  }
  for (const el of [bubble, moveButton, collapseButton]) {
    el.addEventListener('pointerdown',down);
    el.addEventListener('pointermove',move);
    el.addEventListener('pointerup',finish);
    el.addEventListener('pointercancel',finish);
    el.addEventListener('keydown',e => {
      const directions = { ArrowLeft:[-16,0], ArrowRight:[16,0], ArrowUp:[0,-16], ArrowDown:[0,16] };
      if (directions[e.key]) {
        e.preventDefault();
        const [dx,dy] = directions[e.key];
        send('window-nudge', { dx, dy });
      }
      if (e.key === 'Escape' && moving) {
        finish({ type:'pointercancel', pointerId:moving.id, screenX:moving.x, screenY:moving.y });
      }
    });
  }
  window.addEventListener('message',event => {
    const msg = event.data.pluginMessage;
    if (msg?.type !== 'window-state') return;
    const wasCollapsed = collapsed;
    collapsed = Boolean(msg.collapsed);
    if (!collapsed && !wasCollapsed) scrollSnapshot = [];
    if (!wasCollapsed && collapsed) previousFocus = document.activeElement;
    document.body.classList.toggle('bubble-mode',collapsed);
    document.body.dataset.bubbleEdge = msg.edge === 'left' ? 'left' : 'right';
    canMove = Boolean(msg.canMove);
    hasError = Boolean(msg.error);
    moveButton.disabled = !canMove;
    if (collapsed && !wasCollapsed) bubble.focus({ preventScroll:true });
    if (!collapsed && wasCollapsed) {
      (previousFocus?.isConnected ? previousFocus : collapseButton).focus({ preventScroll:true });
      restoreScroll();
    }
    refresh();
  });
  window.PluginWindow = { refresh };
  refresh();
  send('window-init');
})();
