// MasterGo has a native PEN node. Keep the selected wrapper/pen whenever
// possible and stage any layer replacement until layout and ink checks pass.
function iconfontApplyMasterGo(source, prepared, host) {
  const refuse = reason => { throw iconfontError('iconfont-inplace', reason); };
  const identity = [[1, 0, 0], [0, 1, 0]];
  const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  const matrixOf = node => node?.type === 'PAGE' ? identity : node?.absoluteTransform;
  const near = (one, two) => Number.isFinite(one) && Number.isFinite(two) &&
    Math.abs(one - two) <= Math.max(0.01, Math.abs(one) * 1e-7);
  const sameMatrix = (a, b) => a && b && a.every((row, i) => row.every((n, j) => near(n, b[i][j])));
  const protectedNode = node => node.isLocked || node.isMask || node.type === 'INSTANCE' ||
    node.type === 'COMPONENT_SET' || node.slotInfo || Object.keys(node.componentPropertyReferences || {}).length;
  const isComponent = node => node.type === 'COMPONENT' || node.type === 'COMPONENT_SET';
  const flex = node => node?.flexMode && node.flexMode !== 'NONE';
  const shown = node => node.isVisible !== false && node.opacity !== 0;

  for (let n = source; n && n.type !== 'PAGE'; n = n.parent) {
    if (protectedNode(n) || n.isVisible === false) refuse('图层被锁定、隐藏或属于实例，无法原位修改。');
  }

  function paintVisible(list) {
    return (list || []).some(p => p.isVisible !== false && (p.color?.a ?? p.alpha ?? 1) > 0);
  }

  function savedLayout(node) {
    return {world: copy(matrixOf(node)), width: node.width, height: node.height};
  }
  function checkLayout(node, before) {
    if (!sameMatrix(matrixOf(node), before.world) || !near(node.width, before.width) || !near(node.height, before.height)) {
      refuse('写入会改变原图标的位置或布局尺寸。');
    }
  }

  function pathsOf(node) {
    const value = node.penPaths;
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  function controlBounds(paths) {
    let x = Infinity, y = Infinity, right = -Infinity, bottom = -Infinity;
    for (const path of paths) {
      const data = IconfontGeometry.canonicalize(path.data);
      const numbers = data.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g) || [];
      for (let i = 0; i < numbers.length; i += 2) {
        const u = Number(numbers[i]), v = Number(numbers[i + 1]);
        x = Math.min(x, u); y = Math.min(y, v);
        right = Math.max(right, u); bottom = Math.max(bottom, v);
      }
    }
    return {x, y, width: right - x, height: bottom - y};
  }

  function setWorld(node, world) {
    const parentWorld = matrixOf(node.parent);
    if (!parentWorld) refuse('无法定位原图层父级。');
    if (!sameMatrix(matrixOf(node), world)) node.relativeTransform = iconfontMatrixProduct(iconfontInverseTransform(parentWorld), world);
    if (!sameMatrix(matrixOf(node), world)) refuse('父级布局限制了图形的位置。');
  }

  let fillStyle;
  function write(pen, paths, originalWorld) {
    const originalFills = pen.fills;
    const keepFill = originalFills?.some(p => p.type === 'SOLID' && p.isVisible !== false &&
      (p.color?.a ?? p.alpha ?? 1) === 1 && ['r', 'g', 'b'].every(k => p.color[k] === prepared.paint.color[k]));
    pen.penPaths = paths.map(p => ({windingRule: 'Nonzero', data: p.data}));
    if (!keepFill) pen.fills = [prepared.paint];
    if (fillStyle && pen.fillStyleId !== fillStyle) pen.fillStyleId = fillStyle;
    pen.strokes = [];

    // Some hosts rebase pen coordinates to their visual origin on assignment.
    // Recover that translation from the readback before applying the original
    // transformation, so padding, rotated parents and mirrored icons survive.
    const actual = pathsOf(pen);
    if (!actual.length || actual.some(p => String(p.windingRule).toUpperCase() !== 'NONZERO')) refuse('宿主未保留修复后的路径填充规则。');
    const before = controlBounds(paths), after = controlBounds(actual);
    if (!near(before.width, after.width) || !near(before.height, after.height)) refuse('宿主改变了写入轮廓的尺寸。');
    const offset = [[1, 0, before.x - after.x], [0, 1, before.y - after.y]];
    setWorld(pen, iconfontMatrixProduct(originalWorld, offset));
  }

  const parent = source.parent;
  if (!parent) refuse('图层已不在画布中。');
  const sourceLayout = savedLayout(source);
  const priorInk = copy(source.absoluteRenderBounds);
  const wrappers = ['FRAME', 'COMPONENT', 'GROUP'];
  const wrapper = wrappers.includes(source.type);
  const children = wrapper ? Array.from(source.children) : [];
  const visible = children.filter(shown);
  let target = source;
  while (wrappers.includes(target.type) && !paintVisible(target.fills) && !paintVisible(target.strokes)) {
    const ink = target.children.filter(shown);
    if (ink.length !== 1 || (!wrappers.includes(ink[0].type) && ink[0].type !== 'PEN')) break;
    if (protectedNode(ink[0]) || isComponent(ink[0])) refuse('内部图层受保护，无法原位修复。');
    target = ink[0];
  }
  const existing = target.type === 'PEN' ? target : null;
  const guarded = new Map();
  for (let n = existing || source; n && n.type !== 'PAGE'; n = n.parent) {
    if (wrappers.includes(n.type) || flex(n.parent)) guarded.set(n, savedLayout(n));
  }
  function guardLayout() {
    for (const [node, before] of guarded) checkLayout(node, before);
  }
  const affected = existing ? [existing] : wrapper ? visible : [source];
  const styles = new Set();
  function collectStyles(node) {
    if (paintVisible(node.fills)) styles.add(node.fillStyleId || '');
    if (paintVisible(node.strokes)) styles.add(node.strokeFillStyleId || '');
    if (!existing && node.type !== 'BOOLEAN_OPERATION') for (const child of node.children || []) if (shown(child)) collectStyles(child);
  }
  affected.forEach(collectStyles);
  if (styles.size > 1) refuse('图标包含不同的颜色样式，合并会丢失样式连接。');
  [fillStyle] = styles;
  if (!prepared.paint || prepared.paint.type !== 'SOLID') refuse('无法还原图标的纯色填充。');

  if (existing) {
    if (protectedNode(existing)) refuse('目标路径包含锁定或组件属性绑定。');
    if (existing.cornerRadiusStyleId || (typeof existing.cornerRadius === 'number' && existing.cornerRadius > 0)) {
      refuse('圆角路径需要先转换为实际轮廓。');
    }
    const paths = iconfontLocalPaths(existing, prepared);
    const old = {paths: copy(pathsOf(existing)), network: copy(existing.penNetwork), relative: copy(existing.relativeTransform),
      fills: copy(existing.fills), strokes: copy(existing.strokes), fillStyleId: existing.fillStyleId, strokeFillStyleId: existing.strokeFillStyleId};
    const world = copy(matrixOf(existing));
    try {
      write(existing, paths, world);
      guardLayout();
      if (priorInk && !iconfontCloseBox(priorInk, source.absoluteRenderBounds)) refuse('写入会改变原图标的可见边界。');
      return {node: source};
    } catch (error) {
      if (old.network) existing.penNetwork = old.network;
      else existing.penPaths = old.paths;
      existing.fills = old.fills;
      existing.strokes = old.strokes;
      if (old.fillStyleId) existing.fillStyleId = old.fillStyleId;
      if (old.strokeFillStyleId) existing.strokeFillStyleId = old.strokeFillStyleId;
      if (old.relative) existing.relativeTransform = old.relative;
      throw error;
    }
  }

  if (wrapper && (paintVisible(source.fills) || paintVisible(source.strokes))) refuse('请先将容器自身的填充或描边转换为矢量。');
  if (wrapper && (source.type === 'COMPONENT' || flex(source))) refuse('组件或自动布局容器需要保留其内部图层。');
  const owner = wrapper ? source : parent;
  if (!wrapper && flex(parent)) refuse('自动布局中的图层需要保留原有身份和尺寸。');
  if (typeof owner.insertChild !== 'function') refuse('父级不允许替换图层。');
  const replaced = wrapper ? visible : [source];
  function checkRemoval(node) {
    if (!shown(node) || protectedNode(node) || isComponent(node) || node.attachedConnectors?.length ||
        node.reactions?.length || node.getPluginDataKeys?.().length || (wrapper && node.exportSettings?.length)) {
      refuse('替换会影响隐藏图层、组件绑定、导出设置或交互关系。');
    }
    for (const child of node.children || []) checkRemoval(child);
  }
  replaced.forEach(checkRemoval);
  for (let n = parent; n && n.type !== 'PAGE'; n = n.parent) {
    if (isComponent(n)) refuse('组件内部需要保留此图层的身份。');
  }
  if (affected.length > 1 && new Set(affected.map(n => JSON.stringify(n.constraints))).size > 1) {
    refuse('子图层的缩放约束不同，无法合并为一个路径。');
  }
  const order = Array.from(owner.children);
  const entries = replaced.map(node => ({node, index: order.indexOf(node), world: copy(matrixOf(node))}));
  const index = entries.length ? entries[0].index : 0;
  const paths = iconfontLocalPaths(source, prepared);
  let backup, pen;
  try {
    backup = host.createFrame();
    backup.fills = [];
    pen = host.createPen();
    owner.insertChild(index, pen);
    pen.name = wrapper ? (visible.length === 1 ? visible[0].name : source.name) : source.name;
    if (wrapper && affected[0]?.constraints) pen.constraints = copy(affected[0].constraints);
    if (!wrapper) {
      pen.exportSettings = copy(source.exportSettings || []);
      for (const key of ['constraints', 'constrainProportions', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight']) {
        if (source[key] !== undefined) pen[key] = copy(source[key]);
      }
    }
    for (const entry of entries) backup.appendChild(entry.node);
    write(pen, paths, sourceLayout.world);
    const output = wrapper ? source : pen;
    guardLayout();
    checkLayout(output, sourceLayout);
    if (priorInk && !iconfontCloseBox(priorInk, output.absoluteRenderBounds)) refuse('替换会改变原图标的可见边界。');
    backup.remove();
    return {node: output};
  } catch (error) {
    // Keep a populated group alive while moving its original children back.
    for (const entry of entries.slice().reverse()) {
      if (backup && entry.node.parent === backup) {
        const next = order.slice(entry.index + 1).find(node => node.parent === owner);
        owner.insertChild(next ? owner.children.indexOf(next) : owner.children.length, entry.node);
      }
    }
    if (pen && !pen.removed) pen.remove();
    for (const entry of entries) {
      if (entry.node.parent === owner && !sameMatrix(matrixOf(entry.node), entry.world)) {
        entry.node.relativeTransform = iconfontMatrixProduct(iconfontInverseTransform(matrixOf(owner)), entry.world);
      }
    }
    if (backup && !backup.removed && !backup.children.length) backup.remove();
    throw error;
  }
}
