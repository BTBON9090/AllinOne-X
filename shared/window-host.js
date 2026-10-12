/* Window geometry is in canvas-viewport pixels. Platform adapters perform the
   coordinate conversion; moving the plugin never moves the document viewport. */
function createPluginWindowController(adapter) {
  let collapsed = false;
  let fullSize = { width:440, height:600 };
  let size = { ...fullSize };
  let drag = null;
  let edge = 'right';
  const bubble = { width:70, height:48 };
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(Math.max(lo, hi), n));
  const dimensions = msg => ({
    width:clamp(Number(msg.width) || fullSize.width, 170, 1600),
    height:clamp(Number(msg.height) || fullSize.height, 400, 1600)
  });
  function metrics() {
    const m = adapter.metrics();
    if (![m.x,m.y,m.width,m.height,m.header].every(Number.isFinite) || m.width <= 0 || m.height <= 0) throw new Error('Window geometry unavailable');
    return m;
  }
  function keepVisible(x, y, m) {
    return { x:clamp(x, 8, m.width - size.width - 8), y:clamp(y, 8, m.height - size.height - m.header - 8) };
  }
  function position(x, y, m) {
    const next = keepVisible(x, y, m);
    adapter.move(next.x, next.y);
    return next;
  }
  function snap(m, y) {
    position(edge === 'left' ? 8 : m.width - size.width - 8, y, m);
  }
  function state(error = false) {
    adapter.send({ type:'window-state', collapsed, edge, canMove:adapter.canMove(), error });
  }
  function collapse(msg) {
    if (collapsed) return;
    fullSize = dimensions(msg);
    let m;
    try { m = metrics(); } catch (_) { /* Old hosts still support compact resize. */ }
    if (m) edge = m.x + size.width / 2 < m.width / 2 ? 'left' : 'right';
    adapter.resize(bubble.width, bubble.height);
    size = { ...bubble };
    collapsed = true;
    if (m && adapter.canMove()) snap(m, m.y);
    state();
  }
  function expand() {
    if (!collapsed) return;
    let m;
    try { m = metrics(); } catch (_) {}
    adapter.resize(fullSize.width, fullSize.height);
    size = { ...fullSize };
    collapsed = false;
    if (m && adapter.canMove()) snap(m, m.y);
    state();
  }
  function handle(msg) {
    if (msg.type === 'resize-window' || msg.type === 'resize-drag') {
      if (collapsed) return true; // Never replace the saved dimensions with bubble dimensions.
      size = dimensions(msg);
      fullSize = { ...size };
      return false; // Keep existing resize/cache behavior.
    }
    if (!['window-init','window-collapse','window-expand','window-drag-start','window-drag-move','window-drag-end','window-drag-cancel','window-nudge'].includes(msg.type)) return false;
    try {
      if (msg.type === 'window-init') state();
      if (msg.type === 'window-collapse') collapse(msg);
      if (msg.type === 'window-expand') expand();
      if (msg.type === 'window-drag-start') {
        if (!adapter.canMove()) { state(true); return true; }
        if (!collapsed) { fullSize = dimensions(msg); size = { ...fullSize }; }
        const m = metrics();
        drag = { x:m.x, y:m.y };
      }
      if ((msg.type === 'window-drag-move' || msg.type === 'window-drag-end') && drag) {
        const m = metrics();
        const dx = Number(msg.dx), dy = Number(msg.dy);
        if (!Number.isFinite(dx) || !Number.isFinite(dy)) return true;
        const next = position(drag.x + dx, drag.y + dy, m);
        if (msg.type === 'window-drag-end') {
          drag = null;
          edge = next.x + size.width / 2 < m.width / 2 ? 'left' : 'right';
          if (collapsed) { snap(m, next.y); state(); }
          else if (next.x <= 32 || next.x + size.width >= m.width - 32) collapse({ ...fullSize });
          else state();
        }
      }
      if (msg.type === 'window-drag-cancel' && drag) {
        position(drag.x, drag.y, metrics());
        drag = null;
      }
      if (msg.type === 'window-nudge' && adapter.canMove()) {
        const m = metrics();
        const dx = clamp(Number(msg.dx) || 0, -48, 48), dy = clamp(Number(msg.dy) || 0, -48, 48);
        position(m.x + dx, m.y + dy, m);
      }
    } catch (error) {
      drag = null;
      state(true);
      console.warn('Plugin window operation failed:', error);
    }
    return true;
  }
  return handle;
}

function reorderPluginBookmarks(spots, ids) {
  if (!Array.isArray(spots) || !Array.isArray(ids) || ids.length !== spots.length || new Set(ids).size !== ids.length) return null;
  const byId = new Map(spots.map(spot => [spot.id, spot]));
  if (ids.some(id => typeof id !== 'string' || !byId.has(id))) return null;
  return ids.map(id => byId.get(id)); // Retain all metadata, never trust UI-supplied objects.
}

function installPluginBookmarkQueue(ui) {
  const dispatch = ui.onmessage;
  let queue = Promise.resolve();
  ui.onmessage = message => {
    const msg = message?.pluginMessage || message;
    if (!String(msg?.type || '').startsWith('jb-')) return dispatch(message);
    const pending = queue.then(() => dispatch(message));
    queue = pending.catch(error => console.warn('Bookmark operation failed:', error));
    return pending;
  };
}
