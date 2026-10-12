/* Safe bookmark rendering, pointer sorting and keyboard sorting share one commit
   path. Only IDs are sent; the host owns saved locations and their metadata. */
(() => {
  const list = document.getElementById('spotList');
  const save = document.getElementById('btnSaveSpot');
  const l = (zh, en) => curLang === 'en' ? en : zh;
  let spots = [], drag = null, pending = false, requestId = 0, scrollFrame = 0, statusKey = '';
  const hint = document.createElement('div');
  hint.className = 'bookmark-sort-hint';
  document.querySelector('.jumpback-header').append(hint);
  const status = document.createElement('div');
  status.className = 'bookmark-status'; status.setAttribute('aria-live','polite');
  document.querySelector('.jumpback-header').append(status);
  function setStatus(key) {
    statusKey = key;
    const copy = { saving:['正在保存顺序…','Saving order…'], timeout:['顺序未保存，请重试。','Order was not saved. Try again.'], changed:['列表已变化，已恢复最新顺序，请重试。','The list changed. Latest order restored; try again.'], saved:['顺序已保存','Order saved'] };
    status.textContent = copy[key] ? l(...copy[key]) : '';
  }
  const ids = () => [...list.querySelectorAll('.spot-item')].map(el => el.dataset.spotId);
  function button(icon, title, action) {
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'bookmark-icon';
    el.title = title; el.setAttribute('aria-label',title);
    el.dataset.action = action;
    PluginIcons.put(el, icon);
    return el;
  }
  function draw(focusId, action = 'sort') {
    list.replaceChildren();
    const t = i18n[curLang];
    save.disabled = spots.length >= 5;
    save.style.opacity = save.disabled ? '0.5' : '1';
    save.replaceChildren();
    const icon = document.createElement('span'); PluginIcons.put(icon, 'device-floppy');
    const text = document.createElement('span'); text.dataset.key = save.disabled ? 'wb_slot_full' : 'wb_btn_save_spot'; text.textContent = t[text.dataset.key];
    save.append(icon,text);
    hint.textContent = l('拖拽左侧手柄排序；聚焦手柄后按 ↑ ↓ 调整', 'Drag a handle to sort, or focus it and press ↑ / ↓.');
    if (!spots.length) {
      const empty = document.createElement('div'); empty.className = 'jumpback-empty';
      const title = document.createElement('div'); title.className = 'jumpback-empty-title'; title.textContent = t.wb_empty_title;
      const desc = document.createElement('div'); desc.className = 'jumpback-empty-desc'; desc.textContent = t.wb_empty_desc;
      empty.append(title,desc); list.append(empty);
    }
    spots.forEach(spot => {
      const item = document.createElement('div'); item.className = 'spot-item'; item.dataset.spotId = spot.id;
      const handle = button('grip-vertical',l('排序：方向键上下移动，Home / End 移到首尾', 'Sort: Up / Down to move; Home / End for first / last.'),'sort');
      handle.classList.add('bookmark-handle'); handle.disabled = spots.length < 2;
      handle.setAttribute('aria-disabled',String(pending || spots.length < 2));
      const content = document.createElement('div'); content.className = 'bookmark-content';
      const page = document.createElement('div'); page.className = 'spot-page-title'; page.dataset.userContent = ''; page.textContent = String(spot.pageName || '');
      const name = document.createElement('input'); name.className = 'spot-name-input'; name.value = String(spot.name || ''); name.maxLength = 20;
      name.title = t.wb_rename; name.setAttribute('aria-label',t.wb_rename); name.dataset.action = 'rename';
      name.addEventListener('change', () => {
        if (name.value.trim()) spot.name = name.value.substring(0,20);
        jbRename(spot.id,name.value);
      });
      content.append(page,name);
      const actions = document.createElement('div'); actions.className = 'spot-actions';
      const jump = button('player-play',t.wb_btn_jump,'jump'); jump.addEventListener('click', () => jbJump(spot.id));
      const remove = button('trash',t.wb_delete,'delete'); remove.classList.add('btn-spot-del'); remove.addEventListener('click', () => jbDelete(spot.id));
      actions.append(jump,remove);
      item.append(handle,content,actions); list.append(item);
      handle.addEventListener('pointerdown', e => start(e,item));
      handle.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drag) { cancel(e); return; }
        if (pending || !['ArrowUp','ArrowDown','Home','End'].includes(e.key)) return;
        e.preventDefault();
        const order = ids(), index = order.indexOf(spot.id);
        const target = e.key === 'Home' ? 0 : e.key === 'End' ? order.length - 1 : Math.max(0,Math.min(order.length - 1,index + (e.key === 'ArrowUp' ? -1 : 1)));
        if (target === index) return;
        order.splice(index,1); order.splice(target,0,spot.id);
        commit(order,spot.id);
      });
    });
    if (focusId) [...list.querySelectorAll('.spot-item')].find(el => el.dataset.spotId === focusId)?.querySelector(`[data-action="${action}"]`)?.focus({ preventScroll:true });
  }
  function commit(order, focusId) {
    if (pending || JSON.stringify(order) === JSON.stringify(spots.map(s => s.id))) return;
    pending = true;
    const byId = new Map(spots.map(s => [s.id,s]));
    const previous = spots;
    spots = order.map(id => byId.get(id));
    draw(focusId);
    setStatus('saving');
    const req = ++requestId;
    postMsg('jb-reorder', { ids:order, requestId:req });
    // Do not strand the list if an older host does not acknowledge this message.
    setTimeout(() => {
      if (pending && requestId === req) {
        pending = false; spots = previous; draw(focusId);
        setStatus('timeout');
        postMsg('jb-init');
      }
    },5000);
  }
  function start(e,item) {
    if (e.button !== 0 || pending || spots.length < 2) return;
    e.preventDefault();
    e.currentTarget.focus({ preventScroll:true });
    e.currentTarget.setPointerCapture(e.pointerId);
    drag = { item, handle:e.currentTarget, id:e.pointerId, y:e.clientY, active:false, before:ids() };
  }
  function reorderAt(y) {
    if (!drag?.active) return;
    const other = [...list.querySelectorAll('.spot-item')].filter(el => el !== drag.item);
    const target = other.find(el => { const b = el.getBoundingClientRect(); return y < b.top + b.height / 2; });
    if (target && drag.item.nextElementSibling !== target) list.insertBefore(drag.item,target);
    else if (!target && list.lastElementChild !== drag.item) list.append(drag.item);
    // Reparenting may release capture in Chromium; re-acquire after the DOM move.
    if (drag.handle.isConnected) drag.handle.setPointerCapture(drag.id);
  }
  function autoScroll() {
    scrollFrame = 0;
    if (!drag?.active) return;
    const b = list.getBoundingClientRect();
    const dy = drag.y < b.top + 28 ? -5 : drag.y > b.bottom - 28 ? 5 : 0;
    if (dy) { list.scrollTop += dy; reorderAt(drag.y); }
    scrollFrame = requestAnimationFrame(autoScroll);
  }
  function move(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.active && Math.abs(e.clientY - drag.y) < 4) return;
    drag.active = true; drag.y = e.clientY;
    drag.item.classList.add('is-sorting');
    e.preventDefault(); reorderAt(e.clientY);
    if (!scrollFrame) scrollFrame = requestAnimationFrame(autoScroll);
  }
  function release() {
    cancelAnimationFrame(scrollFrame); scrollFrame = 0;
    const old = drag; drag = null;
    if (old) {
      old.item.classList.remove('is-sorting');
      if (old.handle.hasPointerCapture(old.id)) old.handle.releasePointerCapture(old.id);
    }
    return old;
  }
  function end(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const old = release();
    if (old.active) commit(ids(),old.item.dataset.spotId);
  }
  function cancel() {
    const old = release();
    if (old) draw(old.item.dataset.spotId);
  }
  window.addEventListener('pointermove',move);
  window.addEventListener('pointerup',end);
  window.addEventListener('pointercancel',() => { if (drag) cancel(); });
  window.addEventListener('keydown',e => {
    if (e.key === 'Escape' && drag) { e.preventDefault(); cancel(); }
  });
  function render(data, message = {}) {
    if (message.requestId && message.requestId < requestId) return;
    const active = document.activeElement?.closest('.spot-item');
    const focusId = active?.dataset.spotId, action = document.activeElement?.dataset.action;
    if (drag) release();
    spots = Array.isArray(data) ? data : [];
    if (message.requestId === requestId) {
      pending = false;
      setStatus(message.error ? 'changed' : 'saved');
    }
    draw(focusId,action);
  }
  function refresh() {
    setStatus(statusKey);
    const t = i18n[curLang];
    hint.textContent = l('拖拽左侧手柄排序；聚焦手柄后按 ↑ ↓ 调整', 'Drag a handle to sort, or focus it and press ↑ / ↓.');
    const saveLabel = save.querySelector('[data-key]');
    if (saveLabel) saveLabel.textContent = t[saveLabel.dataset.key];
    for (const input of list.querySelectorAll('.spot-name-input')) { input.title = t.wb_rename; input.setAttribute('aria-label',t.wb_rename); }
    for (const el of list.querySelectorAll('[data-action]:not(input)')) {
      const title = el.dataset.action === 'jump' ? t.wb_btn_jump : el.dataset.action === 'delete' ? t.wb_delete : l('排序：方向键上下移动，Home / End 移到首尾', 'Sort: Up / Down to move; Home / End for first / last.');
      el.title = title; el.setAttribute('aria-label',title);
    }
    const title = list.querySelector('.jumpback-empty-title'), desc = list.querySelector('.jumpback-empty-desc');
    if (title) title.textContent = t.wb_empty_title;
    if (desc) desc.textContent = t.wb_empty_desc;
  }
  window.PluginBookmarks = { render, refresh };
  const initial = window.__bookmarkInitial;
  render(initial?.data || [],initial || {});
  postMsg('jb-init');
})();
