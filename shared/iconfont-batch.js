// Each batch snapshots its page and icon roots before the first canvas write.
let iconfontRunning = false;
let iconfontWatchingSelection = false;
// Keep only the two reports shown by the UI. Retain IDs and names, never live
// scene nodes: a user can edit, rename, reparent or delete an icon between runs.
const iconfontReports = new Map();
function iconfontRoots(selection) {
  const selected = new Set(selection.map(node => node.id));
  return selection.filter(node => {
    for (let parent = node.parent; parent && parent.type !== 'PAGE'; parent = parent.parent) {
      if (selected.has(parent.id)) return false;
    }
    return true;
  });
}

function iconfontChildren(roots) {
  const children = [];
  for (const root of roots) {
    if (!('children' in root)) continue;
    for (const child of root.children) {
      if ((layerPlatform === 'figma' ? child.visible : child.isVisible) !== false) children.push(child);
    }
  }
  return children;
}

function sendIconfontSelection() {
  if (!iconfontWatchingSelection) return;
  const roots = iconfontRoots(Array.from(layerPage().selection));
  const children = iconfontChildren(roots);
  const describe = node => ({ id: node.id, name: node.name });
  layerSend({ type: 'iconfont-selection', count: roots.length, childCount: children.length,
    targets: { selection: roots.map(describe), children: children.map(describe) } });
}

// Reserve a grid beside the selection and move it past any top-level artwork in its way.
function iconfontGrid(page, roots, icons) {
  const bounds = node => node.absoluteBoundingBox || node.absoluteRenderBounds;
  const boxes = roots.map(bounds).filter(Boolean);
  const cols = Math.ceil(Math.sqrt(icons.length));
  let stepX = 1, stepY = 1;
  for (const node of icons) {
    const box = bounds(node);
    const ink = node.absoluteRenderBounds;
    stepX = Math.max(stepX, node.width || 0, box?.width || 0, ink?.width || 0);
    stepY = Math.max(stepY, node.height || 0, box?.height || 0, ink?.height || 0);
  }
  stepX += 16;
  stepY += 16;
  const y = boxes.reduce((min, box) => Math.min(min, box.y), boxes[0]?.y || 0);
  let x = boxes.reduce((right, box) => Math.max(right, box.x + box.width), boxes[0]?.x || 0) + 32;
  const width = cols * stepX, height = Math.ceil(icons.length / cols) * stepY;
  const obstacles = page.children.map(bounds).filter(box => box && box.y < y + height && box.y + box.height > y)
    .sort((a, b) => a.x - b.x);
  for (const box of obstacles) {
    if (box.x < x + width && box.x + box.width > x) x = box.x + box.width + 32;
  }
  return index => ({ x: x + (index % cols) * stepX, y: y + Math.floor(index / cols) * stepY });
}

function iconfontReason(error, en) {
  if (!en) return String(error?.message || error);
  const reasons = {
    'iconfont-source-missing': 'The original layer no longer exists.',
    'iconfont-source-page': 'Open the original layer’s page and try again.',
    'iconfont-inplace': 'This structure cannot be repaired in place. Use a repaired copy.',
    'iconfont-inplace-layout': 'Repairing in place would change the layout. Use a repaired copy.',
    'iconfont-paint': 'Use opaque solid fills and strokes.',
    'iconfont-color': 'The icon contains multiple colors.',
    'iconfont-effect': 'Remove transparency, effects or blending before converting.',
    'iconfont-mask': 'Resolve the mask or clipping before converting.',
    'iconfont-type': 'This layer type cannot be converted to an icon.',
    'iconfont-empty': 'The layer contains no visible filled outline.',
    'iconfont-geometry': 'The outline could not be safely converted.'
  };
  return reasons[error?.code] || (String(error?.code || '').startsWith('geometry-')
    ? 'The path could not be safely converted. Check for intersecting or degenerate contours.'
    : 'The editor could not create this icon.');
}

async function iconfontSource(sourceId, en) {
  let node, page;
  try {
    node = await layerGet(sourceId);
    if (node && !node.removed && node.id === sourceId && node.type !== 'PAGE' && node.type !== 'DOCUMENT') {
      page = node.parent;
      while (page && page.type !== 'PAGE') page = page.parent;
      if (page && !page.removed) return { node, page };
    }
  } catch (_) {
    return { error: en ? 'The editor could not read the original layer.' : '编辑器无法读取原图层。' };
  }
  return { error: en ? 'The original layer no longer exists.' : '原图层已不存在。' };
}

async function iconfontOpenPage(page) {
  if (layerPage().id === page.id) return;
  try {
    if (layerPlatform === 'mastergo') layerHost.document.currentPage = page;
    else await layerHost.setCurrentPageAsync(page);
    if (layerPage().id === page.id) return;
  } catch (_) { /* The editor may not permit switching to this page. */ }
  throw iconfontError('iconfont-source-page', '请打开原图层所在页面后重试。');
}

async function iconfontLocate(msg, en) {
  const reply = { type: 'iconfont-locate-result', requestId: msg.requestId, sourceId: msg.sourceId };
  if (iconfontRunning) {
    layerSend({ ...reply, ok: false, error: en ? 'Wait for the current operation to finish.' : '请等待当前操作结束。' });
    return;
  }
  iconfontRunning = true;
  try {
    const source = await iconfontSource(msg.sourceId, en);
    if (source.error) throw new Error(source.error);
    await iconfontOpenPage(source.page);
    try {
      source.page.selection = [source.node];
      if (!source.page.selection.some(item => item.id === source.node.id)) throw new Error();
      layerHost.viewport.scrollAndZoomIntoView([source.node]);
    } catch (_) {
      throw new Error(en ? 'The editor could not select and zoom to this layer.' : '编辑器无法选中并缩放至此图层。');
    }
    layerSend({ ...reply, ok: true });
  } catch (error) {
    layerSend({ ...reply, ok: false, error: error.code ? iconfontReason(error, en) : error.message });
  } finally {
    iconfontRunning = false;
  }
}

async function handleIconfontMessage(msg) {
  if (msg.type === 'get-iconfont-selection') {
    iconfontWatchingSelection = true;
    sendIconfontSelection();
    return;
  }
  const en = msg.uiLanguage === 'en';
  if (msg.type === 'iconfont-locate-source') return iconfontLocate(msg, en);
  const retry = msg.retryOf !== undefined;
  const action = !retry && msg.action === undefined ? 'copy' : msg.action;
  const reportId = retry ? msg.retryOf : msg.requestId;
  const items = [], targets = [];
  const reply = error => layerSend({ type: 'iconfont-repair-result', requestId: msg.requestId, reportId, action, items, error });
  if (iconfontRunning) { reply(en ? 'A batch is already running.' : '上一批图标正在处理。'); return; }
  if (!['copy','inplace'].includes(action)) { reply(en ? 'Unknown repair operation.' : '修复操作无效。'); return; }
  const requested = Array.isArray(msg.targetIds) ? new Set(msg.targetIds) : null;
  if (((retry || action === 'inplace') && !requested) || requested?.size === 0) {
    reply(en ? 'Check the icons to repair.' : '请勾选要修复的图标。'); return;
  }
  let report, batchError;
  if (retry) {
    report = iconfontReports.get(action);
    if (!report || report.id !== reportId || !Array.from(requested).every(id => report.exceptions.has(id))) {
      reply(en ? 'These icons are no longer exceptions in this report.' : '这些图标已不在该报告的异常清单中。');
      return;
    }
  }
  iconfontRunning = true;
  function record(target, status, detail) {
    const { sourceId, name } = target;
    if (status === 'fixed') report.exceptions.delete(sourceId);
    else report.exceptions.set(sourceId, name);
    items.push({ sourceId, name, status, ...detail });
  }
  try {
    let activePage = layerPage();
    const originalSelection = retry ? [] : Array.from(activePage.selection);
    const previousIds = layerIds(originalSelection);
    let roots;
    if (retry) {
      for (const sourceId of requested) {
        const source = await iconfontSource(sourceId, en);
        targets.push({ sourceId, name: source.node?.name || report.exceptions.get(sourceId), ...source });
      }
    } else {
      roots = iconfontRoots(originalSelection);
      const candidates = msg.mode === 'children' ? iconfontChildren(roots) : roots;
      const icons = requested ? candidates.filter(node => requested.has(node.id)) : candidates;
      if (requested && icons.length !== requested.size) {
        reply(en ? 'The selection changed. Check the current targets and try again.' : '选区已变化，请核对勾选目标后重试。');
        sendIconfontSelection();
        return;
      }
      if (!icons.length) { reply(en ? 'Select icons or a board with visible children.' : '请选择图标，或选择含有可见子图层的画板。'); return; }
      for (const node of icons) targets.push({ sourceId: node.id, name: node.name, node, page: activePage });
      report = { id: reportId, exceptions: new Map() };
      iconfontReports.set(action, report);
    }
    const outputs = [], grids = new Map();
    for (const target of targets) {
      if (layerPage().id !== activePage.id) throw new Error(en ? 'Page changed. The batch stopped.' : '当前页面已切换，批量处理已停止。');
      try {
        if (target.error || target.node.removed) {
          throw iconfontError('iconfont-source-missing', target.error || '原图层已不存在。');
        }
        if (target.page.id !== activePage.id) await iconfontOpenPage(target.page);
        activePage = target.page;
        let grid;
        if (action === 'copy') {
          grid = grids.get(activePage.id);
          if (!grid) {
            const icons = targets.filter(t => t.page?.id === activePage.id && !t.node.removed).map(t => t.node);
            grid = { position: iconfontGrid(activePage, roots || icons, icons), count: 0 };
            grids.set(activePage.id, grid);
          }
        }
        const output = await iconfontRepair(target.node, grid ? grid.position(grid.count) : null, layerHost, layerPlatform === 'mastergo', action);
        if (grid) grid.count++;
        outputs.push(output.node);
        record(target, 'fixed', action === 'copy' ? { svg: output.svg } : {});
      } catch (error) {
        record(target, error?.code ? 'skipped' : 'failed', { reason: target.error || iconfontReason(error, en) });
      }
      layerSend({ type: 'iconfont-repair-progress', requestId: msg.requestId, done: items.length, total: targets.length });
      if (items.length % 8 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (outputs.length && !retry && layerPage().id === activePage.id) {
      const selectedIds = layerIds(activePage.selection);
      if (selectedIds === previousIds || selectedIds === layerIds(originalSelection.filter(node => !node.removed))) {
        activePage.selection = outputs.filter(node => !node.removed);
      }
    }
  } catch (error) {
    batchError = String(error?.message || (en ? 'The editor stopped the batch.' : '宿主中断了本批处理。'));
    if (report) {
      for (const target of targets.slice(items.length)) record(target, 'failed', { reason: batchError });
    }
  } finally {
    iconfontRunning = false;
  }
  if (typeof layerHost.commitUndo === 'function' && items.some(item => item.status === 'fixed')) {
    try { layerHost.commitUndo(); } catch (_) { /* The changes are already on the canvas. */ }
  }
  reply(batchError);
}
