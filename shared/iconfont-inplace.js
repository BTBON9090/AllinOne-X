// Geometry is prepared in an axis-aligned viewport. Rebase every point before
// writing editor paths so rotation, reflection and the artboard inset survive.
function iconfontMatrixProduct(a, b) {
  return a.map(row => [
    row[0] * b[0][0] + row[1] * b[1][0],
    row[0] * b[0][1] + row[1] * b[1][1],
    row[0] * b[0][2] + row[1] * b[1][2] + row[2]
  ]);
}

function iconfontInverseTransform(m) {
  const [[a, c, x], [b, d, y]] = m;
  const det = a * d - b * c;
  if (!Number.isFinite(det) || Math.abs(det) < 1e-12) {
    throw iconfontError('iconfont-inplace-layout', '图层变换不可逆，已保留原图标');
  }
  return [[d / det, -c / det, (c * y - d * x) / det], [-b / det, a / det, (b * x - a * y) / det]];
}

function iconfontLocalPaths(node, prepared) {
  const viewport = [[1, 0, prepared.left], [0, 1, prepared.top]];
  return iconfontTransformPaths(prepared.paths, iconfontMatrixProduct(iconfontInverseTransform(node.absoluteTransform), viewport));
}

function iconfontCloseBox(a, b) {
  return !!a && !!b && ['x', 'y', 'width', 'height'].every(k => Math.abs(a[k] - b[k]) <= 0.01);
}

async function iconfontApplyFigma(source, prepared, host) {
  const container = n => ['FRAME', 'GROUP', 'COMPONENT'].includes(n.type);
  const visiblePaint = p => p.visible !== false && p.opacity !== 0;
  const hasPaint = n => [n.fills, n.strokes].some(p => Array.isArray(p) && p.some(visiblePaint));
  const visible = n => n.visible !== false && n.opacity !== 0;
  const reject = message => { throw iconfontError('iconfont-inplace', message); };
  const layoutError = () => iconfontError('iconfont-inplace-layout', '轮廓化会改变原布局尺寸或位置，已保留原图标');
  const identity = [[1, 0, 0], [0, 1, 0]];
  const stacking = n => n && n.layoutMode && n.layoutMode !== 'NONE';
  const abs = n => n.type === 'PAGE' ? identity : n.absoluteTransform;
  const transformTo = (n, dest) => {
    n.relativeTransform = iconfontMatrixProduct(iconfontInverseTransform(abs(n.parent)), dest);
  };
  const ancestors = [];
  for (let n = source; n && n.type !== 'PAGE'; n = n.parent) {
    ancestors.push(n);
    if (n.locked || n.type === 'INSTANCE') reject('锁定图层或组件实例无法安全改写原始路径');
  }
  // Preserve a single-vector icon's layer ID even under several nested frames.
  let target = source;
  while (container(target) && !hasPaint(target)) {
    const visibleChildren = target.children.filter(visible);
    if (visibleChildren.length !== 1) break;
    const child = visibleChildren[0];
    if (!(container(child) || child.type === 'VECTOR')) break;
    if (child.locked || child.type === 'COMPONENT') reject('图标内含受保护的组件或锁定图层');
    target = child;
  }
  const direct = target.type === 'VECTOR';
  const wrapper = container(source);
  if (!direct) target = source;
  if (!direct && wrapper && hasPaint(source)) reject('画板自身带有填充或描边，请先将其外观转换为普通矢量图层');
  if (!direct && (ancestors.some(n => n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') ||
      (wrapper ? stacking(source) : stacking(source.parent)))) {
    reject('替换子层会改变组件关系或自动布局，已保留图层结构');
  }

  const parent = wrapper && !direct ? source : target.parent;
  const affected = direct ? [target] : wrapper ? source.children.filter(visible) : [source];
  if (!parent || !affected.length) reject('没有可以就地修改的矢量图层');
  const color = prepared.paint;
  if (!color || color.type !== 'SOLID') reject('无法保留原图标的纯色填充');
  const styles = new Set();
  const paintBindings = new Set();
  function inspect(node, contributes = true) {
    if (!direct && (node.locked || !visible(node) || ['INSTANCE', 'COMPONENT', 'COMPONENT_SET'].includes(node.type) ||
        node.reactions?.length || node.annotations?.length || node.getPluginDataKeys?.().length ||
        Object.keys(node.componentPropertyReferences || {}).length ||
        Object.keys(node.boundVariables || {}).some(k => k !== 'fills' && k !== 'strokes') ||
        (node !== source && node.exportSettings?.length) || Object.keys(node.explicitVariableModes || {}).length)) {
      reject('子图层带有锁定、隐藏、导出设置或组件关系，无法在保留结构的同时拼合');
    }
    const entries = [[node.fills, node.fillStyleId], [node.strokes, node.strokeStyleId]];
    if (node.type === 'VECTOR') {
      for (const region of node.vectorNetwork?.regions || []) entries.push([region.fills, region.fillStyleId || node.fillStyleId]);
    }
    for (const [paints, styleId] of contributes ? entries : []) {
      if (!Array.isArray(paints)) continue;
      for (const paint of paints.filter(visiblePaint)) {
        styles.add(styleId || '');
        paintBindings.add(JSON.stringify(paint.boundVariables || {}));
      }
    }
    if (!direct) {
      for (const child of node.children || []) inspect(child, contributes && node.type !== 'BOOLEAN_OPERATION');
    }
  }
  for (const n of affected) inspect(n);
  const style = styles.size === 1 ? Array.from(styles)[0] : '';
  if (styles.size > 1 || paintBindings.size > 1 || typeof style !== 'string') reject('图标含有不同的颜色样式或变量绑定，已保留原连接');
  if (affected.length > 1 && new Set(affected.map(n => JSON.stringify(n.constraints))).size > 1) {
    reject('子图层的缩放约束不同，无法合并为一个矢量');
  }

  // Keep group geometry stable, including any ancestor group that tightly fits
  // its children. Frames retain layout settings on their original wrapper.
  const fixed = new Map();
  for (let n = direct ? target : source; n && n.type !== 'PAGE'; n = n.parent) {
    if (container(n) || stacking(n.parent)) fixed.set(n, n.absoluteBoundingBox);
  }
  const assertLayout = (node, intended) => {
    for (const [n, box] of fixed) if (!iconfontCloseBox(box, n.absoluteBoundingBox)) throw layoutError();
    const actual = node.absoluteTransform;
    if (!intended.every((row, i) => row.every((v, j) => Math.abs(v - actual[i][j]) <= 0.01))) throw layoutError();
  };

  const basis = target.absoluteTransform;
  const paths = iconfontLocalPaths(target, prepared);
  const stage = host.createVector();
  let keepStage = false;
  try {
    stage.x = 0;
    stage.y = 0;
    stage.vectorPaths = paths;
    stage.fills = [color];
    stage.strokes = [];
    if (style && !direct) await stage.setFillStyleIdAsync(style);
    // Figma rebases vectorPaths onto their curve bounds and updates the origin.
    const placed = iconfontMatrixProduct(basis, stage.relativeTransform);
    if (direct) {
      const previous = {
        paths: target.vectorPaths, network: target.vectorNetwork, transform: target.absoluteTransform,
        fills: target.fills, strokes: target.strokes, fillStyle: target.fillStyleId, strokeStyle: target.strokeStyleId,
        radius: target.cornerRadius
      };
      if (!Array.isArray(previous.fills) || !Array.isArray(previous.strokes)) reject('矢量含有无法还原的混合区域样式');
      try {
        // Rebase the canonical winding into the staged bounds without asking
        // the editor to serialize and interpret the full path a second time.
        target.vectorPaths = iconfontTransformPaths(paths, iconfontInverseTransform(stage.relativeTransform));
        if (target.cornerRadius) target.cornerRadius = 0;
        if (previous.strokes.some(visiblePaint)) target.strokes = previous.strokes.filter(p => !visiblePaint(p));
        // Keep a linked fill style attached unless the original was stroke-only.
        if (style && style !== target.fillStyleId) await target.setFillStyleIdAsync(style);
        else if (!style) target.fills = previous.fills.some(visiblePaint) ? previous.fills : [color];
        transformTo(target, placed);
        assertLayout(target, placed);
      } catch (error) {
        if (previous.network && target.setVectorNetworkAsync) await target.setVectorNetworkAsync(previous.network);
        else target.vectorPaths = previous.paths;
        if (typeof previous.radius === 'number') target.cornerRadius = previous.radius;
        target.fills = previous.fills;
        target.strokes = previous.strokes;
        if (previous.fillStyle) await target.setFillStyleIdAsync(previous.fillStyle);
        if (previous.strokeStyle) await target.setStrokeStyleIdAsync(previous.strokeStyle);
        transformTo(target, previous.transform);
        throw error;
      }
      return {node: source};
    }

    // Move the originals to a temporary container until layout validation
    // succeeds. Rollback restores the actual objects, IDs and stacking order.
    const order = Array.from(parent.children);
    const originals = affected.map(n => ({n, index: order.indexOf(n), transform: n.absoluteTransform}));
    stage.name = affected.length === 1 ? affected[0].name : source.name;
    if (!wrapper) stage.exportSettings = source.exportSettings;
    const backup = host.createFrame();
    try {
      backup.clipsContent = false;
      backup.fills = [];
      parent.insertChild(originals[0].index, stage);
      transformTo(stage, placed);
      if (affected[0].constraints && 'constraints' in stage) stage.constraints = affected[0].constraints;
      for (const {n} of originals) backup.appendChild(n);
      assertLayout(stage, placed);
      keepStage = true;
    } catch (error) {
      // Restore before removing the temporary vector: Figma deletes empty groups.
      for (const {n, index, transform} of originals.slice().reverse()) {
        if (n.parent !== backup) continue;
        const next = order.slice(index + 1).find(node => node.parent === parent);
        parent.insertChild(next ? parent.children.indexOf(next) : parent.children.length, n);
        transformTo(n, transform);
      }
      throw error;
    } finally {
      if (!backup.children.length || keepStage) backup.remove();
    }
    return {node: wrapper ? source : stage};
  } finally {
    if (!keepStage && !stage.removed) stage.remove();
  }
}
