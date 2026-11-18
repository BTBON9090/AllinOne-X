/* Keep the iframe alive while collapsed: drafts, results and scroll stay intact. */
(() => {
  const l = (zh, en) => curLang === 'en' ? en : zh;
  let collapsed = false, moving = null, frame = 0, suppressClick = false, previousFocus = null, canMove = true, hasError = false;
  const bubble = document.createElement('button');
  bubble.id = 'pluginBubble';
  bubble.innerHTML = '<img class="bubble-logo" alt="" draggable="false">';
  bubble.firstElementChild.src = pluginLogoUrl;
  document.body.append(bubble);
  const status = document.createElement('span');
  status.id = 'windowStatus'; status.className = 'sr-only'; status.setAttribute('aria-live','polite');
  document.body.append(status);
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
      if (previousFocus) {
        const brand = document.querySelector('.workbench-brand');
        const fallback = brand?.getClientRects().length ? brand : document.querySelector('.workbench-menu');
        const target = previousFocus !== document.body && previousFocus.getClientRects().length ? previousFocus : fallback;
        target?.focus({ preventScroll:true });
        previousFocus = null;
      }
    });
  }
  window.addEventListener('resize',restoreScroll);
  function refresh() {
    status.textContent = hasError ? l('窗口移动不可用，可使用宿主标题栏拖动。', 'Window movement is unavailable. Drag the host title bar instead.') : '';
    bubble.title = canMove ? l('点击展开，拖拽移动气泡；方向键移动', 'Click to expand; drag to move the bubble. Arrow keys move it.') : l('点击展开；使用宿主标题栏拖动', 'Click to expand; drag the host title bar to move.');
    bubble.setAttribute('aria-label', bubble.title);
    bubble.setAttribute('aria-expanded', String(!collapsed));
  }
  function minimize() {
    rememberScroll();
    send('window-collapse', fullSize());
  }
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
      suppressClick = e.type !== 'pointercancel';
      if (suppressClick) setTimeout(() => { suppressClick = false; },0);
      send(e.type === 'pointercancel' ? 'window-drag-cancel' : 'window-drag-end', { dx:e.screenX - old.x, dy:e.screenY - old.y });
    }
  }
  function bindControl(el, activate) {
    el.addEventListener('click', e => {
      if (suppressClick) { suppressClick = false; return; }
      if (el !== bubble && e.shiftKey) minimize();
      else activate();
    });
    el.addEventListener('pointerdown',down);
    el.addEventListener('pointermove',move);
    el.addEventListener('pointerup',finish);
    el.addEventListener('pointercancel',finish);
    el.addEventListener('keydown',e => {
      if (el !== bubble && e.shiftKey && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        if (!e.repeat) minimize();
        return;
      }
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
  bindControl(bubble, () => send('window-expand'));
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
    if (collapsed && !wasCollapsed) bubble.focus({ preventScroll:true });
    if (!collapsed && wasCollapsed) restoreScroll();
    refresh();
  });
  window.PluginWindow = { refresh, bindBrand:bindControl };
  refresh();
  send('window-init');
})();
