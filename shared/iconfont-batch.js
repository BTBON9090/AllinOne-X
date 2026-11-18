// Each batch snapshots its page and icon roots before the first canvas write.
let iconfontRunning = false;
let iconfontWatchingSelection = false;
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

async function handleIconfontMessage(msg) {
  if (msg.type === 'get-iconfont-selection') {
    iconfontWatchingSelection = true;
    sendIconfontSelection();
    return;
  }
  const en = msg.uiLanguage === 'en';
  const action = msg.action === undefined ? 'copy' : msg.action;
  const items = [];
  const reply = error => layerSend({ type: 'iconfont-repair-result', requestId: msg.requestId, action, items, error });
  if (iconfontRunning) { reply(en ? 'A batch is already running.' : '上一批图标正在处理。'); return; }
  if (!['copy','inplace'].includes(action)) { reply(en ? 'Unknown repair operation.' : '修复操作无效。'); return; }
  const requested = Array.isArray(msg.targetIds) ? new Set(msg.targetIds) : null;
  if ((action === 'inplace' && !requested) || requested?.size === 0) {
    reply(en ? 'Check the icons to repair.' : '请勾选要修复的图标。'); return;
  }
  iconfontRunning = true;
  try {
    const page = layerPage();
    const originalSelection = Array.from(page.selection);
    const roots = iconfontRoots(originalSelection);
    const candidates = msg.mode === 'children' ? iconfontChildren(roots) : roots;
    const icons = requested ? candidates.filter(node => requested.has(node.id)) : candidates;
    if (requested && icons.length !== requested.size) {
      reply(en ? 'The selection changed. Check the current targets and try again.' : '选区已变化，请核对勾选目标后重试。');
      sendIconfontSelection();
      return;
    }
    if (!icons.length) { reply(en ? 'Select icons or a board with visible children.' : '请选择图标，或选择含有可见子图层的画板。'); return; }
    const position = action === 'copy' ? iconfontGrid(page, roots, icons) : null;
    const previousIds = layerIds(originalSelection);
    const outputs = [];
    const names = icons.map(icon => icon.name);
    for (let index = 0; index < icons.length; index++) {
      if (layerPage().id !== page.id) { reply(en ? 'Page changed. The batch stopped.' : '当前页面已切换，批量处理已停止。'); return; }
      const icon = icons[index], name = names[index];
      try {
        const dest = position ? position(outputs.length) : null;
        const output = await iconfontRepair(icon, dest, layerHost, layerPlatform === 'mastergo', action);
        outputs.push(output.node);
        const item = { name, status: 'fixed' };
        if (action === 'copy') item.svg = output.svg;
        items.push(item);
      } catch (error) {
        items.push({ name, status: error?.code ? 'skipped' : 'failed', reason: iconfontReason(error, en) });
      }
      layerSend({ type: 'iconfont-repair-progress', requestId: msg.requestId, done: index + 1, total: icons.length });
      if ((index + 1) % 8 === 0) await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (outputs.length && layerPage().id === page.id) {
      const selectedIds = layerIds(page.selection);
      if (selectedIds === previousIds || selectedIds === layerIds(originalSelection.filter(node => !node.removed))) {
        page.selection = outputs.filter(node => !node.removed);
      }
      if (typeof layerHost.commitUndo === 'function') layerHost.commitUndo();
    }
    reply();
  } catch (error) {
    reply(en ? 'The editor stopped the batch.' : '宿主中断了本批处理：' + String(error?.message || error));
  } finally {
    iconfontRunning = false;
  }
}
