// Figma supplies absolute M/L/Q/C/Z commands. Bake the matrix into the points
// so the downloaded glyph also works with importers that discard transforms.
function iconfontError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function iconfontTransformPaths(paths, matrix) {
  return paths.map(path => ({
    windingRule: path.windingRule,
    data: IconfontGeometry.canonicalize(path.data, matrix)
  }));
}

function iconfontSvg(paths, width, height) {
  if (!(width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height))) {
    throw iconfontError('iconfont-empty', '图标没有可导出的尺寸');
  }
  const data = paths.map(path => path.data).join(' ');
  if (!data || /[^MLCQZ0-9eE\s,\.\-+]/.test(data)) throw iconfontError('iconfont-geometry', '导出的轮廓无效');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path fill="#000" fill-rule="nonzero" d="${data}"/></svg>`;
}

function iconfontPrepare(source, host, mastergo) {
  const frameTypes = ['FRAME', 'COMPONENT', 'INSTANCE'];
  const shapeTypes = ['VECTOR', 'PEN', 'RECTANGLE', 'LINE', 'ELLIPSE', 'POLYGON', 'STAR', 'BOOLEAN_OPERATION'];
  const black = [{ type: 'SOLID', color: mastergo ? { r: 0, g: 0, b: 0, a: 1 } : { r: 0, g: 0, b: 0 } }];
  const shown = item => mastergo ? item.isVisible !== false : item.visible !== false;
  const cleanup = [];
  let scratch, color, originalPaint;

  function track(node) {
    if (!node) throw iconfontError('iconfont-geometry', '编辑器未能创建矢量轮廓');
    cleanup.push(node);
    return node;
  }

  function workFrame() {
    if (!scratch) {
      scratch = track(host.createFrame());
      scratch.fills = [];
      scratch.clipsContent = false;
      scratch.x = 0;
      scratch.y = 0;
    }
    return scratch;
  }

  function paints(list) {
    if (list === undefined) return false;
    if (!Array.isArray(list)) throw iconfontError('iconfont-paint', '图层包含混合填色，请先整理为单色图形');
    const alpha = p => mastergo ? (p.color?.a ?? p.alpha ?? 1) : (p.opacity ?? 1);
    const visible = list.filter(p => shown(p) && alpha(p) !== 0);
    for (const paint of visible) {
      if (paint.type !== 'SOLID' || alpha(paint) !== 1 ||
          (paint.blendMode && paint.blendMode !== 'NORMAL')) {
        throw iconfontError('iconfont-paint', '图标包含渐变、图像、混合模式或半透明填色，请先整理为不透明纯色');
      }
      const rgb = [paint.color.r, paint.color.g, paint.color.b].join(',');
      if (color && color !== rgb) throw iconfontError('iconfont-color', '图标包含多种颜色，请检查背景或将留白改成镂空');
      color = rgb;
      if (!originalPaint) originalPaint = paint;
    }
    return visible.length > 0;
  }

  // absoluteBoundingBox retains transparent artboard padding. A bare stroke
  // can extend outside its layout box, or have a zero-height centerline.
  const layout = source.absoluteBoundingBox;
  const ink = source.absoluteRenderBounds;
  if (!layout) throw iconfontError('iconfont-empty', '图标没有可用边界');
  const left = ink ? Math.min(layout.x, ink.x) : layout.x;
  const top = ink ? Math.min(layout.y, ink.y) : layout.y;
  const width = Math.max(layout.x + layout.width, ink ? ink.x + ink.width : left) - left;
  const height = Math.max(layout.y + layout.height, ink ? ink.y + ink.height : top) - top;

  function localMatrix(node) {
    const m = node.absoluteTransform;
    return [[m[0][0], m[0][1], m[0][2] - left], [m[1][0], m[1][1], m[1][2] - top]];
  }

  function makeVector(paths) {
    const frame = workFrame();
    const node = track(mastergo ? host.createPen() : host.createVector());
    frame.appendChild(node);
    node.x = 0;
    node.y = 0;
    if (mastergo) node.penPaths = paths.map(p => ({ data: p.data, windingRule: p.windingRule === 'EVENODD' ? 'Evenodd' : 'Nonzero' }));
    else node.vectorPaths = paths;
    node.fills = black;
    node.strokes = [];
    return node;
  }

  // Inputs have already been transformed to viewport coordinates. Figma
  // automatically moves a vector's origin to its curve bounds on assignment.
  function booleanPaths(shapes, operation) {
    const nodes = shapes.map(makeVector);
    const frame = workFrame();
    const combined = track(mastergo ? host[operation](nodes) : host[operation](nodes, frame));
    const result = mastergo ? track(host.flatten([combined])) : combined;
    const paths = mastergo ? penPaths(result) : result.fillGeometry;
    if (!paths || !paths.length) return [];
    return iconfontTransformPaths(paths, result.relativeTransform);
  }

  function project(paths, matrix) {
    const filled = (paths || []).filter(p => p.windingRule !== 'NONE' && p.data);
    return filled.length ? [iconfontTransformPaths(filled, matrix)] : [];
  }

  function penPaths(node) {
    const raw = node.penPaths;
    return (Array.isArray(raw) ? raw : raw ? [raw] : []).map(p => ({
      data: p.data, windingRule: String(p.windingRule).toUpperCase()
    }));
  }

  function rectangleFor(node) {
    const rect = track(host.createRectangle());
    workFrame().appendChild(rect);
    rect.resize(node.width, node.height);
    rect.fills = black;
    rect.strokes = [];
    for (const key of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', mastergo ? 'cornerSmooth' : 'cornerSmoothing']) {
      if (typeof node[key] === 'number') rect[key] = node[key];
    }
    return rect;
  }

  function filledShapes(node, matrix) {
    if (!mastergo) return project(node.fillGeometry, matrix);
    if (node.type === 'PEN') return project(penPaths(node), matrix);
    // MasterGo exposes penPaths on flattened shapes. Work on isolated copies.
    // A frame's own fill is a rectangle independent of its child content.
    const primitive = frameTypes.includes(node.type) ? rectangleFor(node) : track(node.clone());
    workFrame().appendChild(primitive);
    primitive.relativeTransform = matrix;
    primitive.strokes = [];
    const pen = track(host.flatten([primitive]));
    return project(penPaths(pen), pen.relativeTransform);
  }

  function outline(node, matrix) {
    if (!mastergo && node.strokeAlign === 'CENTER') {
      const center = project(node.strokeGeometry, matrix);
      if (center.length) return center;
    }
    // strokeGeometry is always centered in Figma. Outline on a disposable
    // clone to retain the actual inside/outside alignment.
    const frame = workFrame();
    const clone = track(node.clone());
    frame.appendChild(clone);
    clone.relativeTransform = matrix;
    clone.fills = [];
    const expanded = track(clone.outlineStroke());
    const result = filledShapes(expanded, expanded.relativeTransform);
    if (!result.length) throw iconfontError('iconfont-geometry', '描边未能转换为封闭轮廓');
    return result;
  }

  function clipChildren(node, children) {
    if (!children.length || !node.clipsContent) return children;
    const matrix = node.absoluteTransform;
    const bounds = node.absoluteBoundingBox;
    const rounded = node.cornerRadius !== undefined && node.cornerRadius !== 0;
    const axisAligned = matrix[0][1] === 0 && matrix[1][0] === 0;
    // For a rectangular clip that encloses all ink, keep the original paths.
    // This also preserves precise curves on padded single-vector icon frames.
    if (!rounded && axisAligned && bounds && node.children.every(child => {
      if (!shown(child) || child.opacity === 0) return true;
      const b = child.absoluteRenderBounds;
      return b && b.x >= bounds.x && b.y >= bounds.y &&
        b.x + b.width <= bounds.x + bounds.width && b.y + b.height <= bounds.y + bounds.height;
    })) return children;

    const rect = rectangleFor(node);
    const boundary = filledShapes(rect, localMatrix(node))[0];
    if (!boundary) throw iconfontError('iconfont-mask', '无法读取裁剪边界');
    const contents = children.length === 1 ? children[0] : booleanPaths(children, 'union');
    if (!contents.length) return [];
    const clipped = booleanPaths([contents, boundary], 'intersect');
    return clipped.length ? [clipped] : [];
  }

  function read(node) {
    if (!shown(node) || node.opacity === 0) return [];
    if (node.isMask) throw iconfontError('iconfont-mask', '图标使用了蒙版，请先将蒙版转换为布尔图形');
    if ((node.effects || []).some(e => shown(e)) ||
        (node.opacity !== undefined && node.opacity !== 1) ||
        (node.blendMode && node.blendMode !== 'NORMAL' && node.blendMode !== 'PASS_THROUGH')) {
      throw iconfontError('iconfont-effect', '图标包含效果、混合模式或半透明图层，请先整理外观');
    }
    const isFrame = frameTypes.includes(node.type);
    const isGroup = node.type === 'GROUP' || node.type === 'TRANSFORM_GROUP';
    if (!isFrame && !isGroup && !shapeTypes.includes(node.type)) {
      throw iconfontError('iconfont-type', `图层类型 ${node.type} 需要先转换为矢量`);
    }
    const matrix = localMatrix(node);
    const shapes = [];
    if (!isGroup) {
      let filled = paints(node.fills);
      if (node.type === 'VECTOR') {
        // Vector regions may override the layer paint independently.
        const regions = node.vectorNetwork?.regions;
        const regionVisibility = (regions || []).map(region =>
          region.fills === undefined ? filled : paints(region.fills));
        if (regionVisibility.length) {
          filled = regionVisibility.some(Boolean);
          if (filled && regionVisibility.some(visible => !visible)) {
            throw iconfontError('iconfont-paint', '图标内存在透明填充区域，请先整理为单色轮廓');
          }
        }
      }
      if (filled) shapes.push(...filledShapes(node, matrix));
      if (paints(node.strokes)) shapes.push(...outline(node, matrix));
    }
    if (isFrame || isGroup) {
      const descendants = [];
      for (const child of node.children) for (const shape of read(child)) descendants.push(shape);
      for (const shape of clipChildren(node, descendants)) shapes.push(shape);
    }
    return shapes;
  }

  try {
    const shapes = read(source);
    if (!shapes.length) throw iconfontError('iconfont-empty', '没有可见的填充或描边轮廓');
    const paths = shapes.length === 1 ? shapes[0] : booleanPaths(shapes, 'union');
    let normalized;
    try {
      normalized = IconfontGeometry.normalize(paths);
    } catch (error) {
      if (error.code !== 'geometry-ambiguous') throw error;
      // Resolve self-intersections and touching subpaths using the editor's
      // native filled-region boolean engine before attempting winding again.
      normalized = IconfontGeometry.normalize(booleanPaths([paths, paths], 'union'));
    }
    return { paths: normalized, left, top, width, height, paint: originalPaint };
  } finally {
    for (let i = cleanup.length - 1; i >= 0; i--) {
      if (!cleanup[i].removed) cleanup[i].remove();
    }
  }
}

async function iconfontRepair(source, position, host, mastergo, action) {
  const apply = mastergo ? iconfontApplyMasterGo : iconfontApplyFigma;
  if (action === 'inplace') {
    const prepared = iconfontPrepare(source, host, mastergo);
    return apply(source, prepared, host);
  }

  // Clone before running any editing operation. Moving the clone to the page
  // also keeps it outside the source's auto layout, group or component.
  const page = mastergo ? host.document.currentPage : host.currentPage;
  const transform = source.absoluteTransform;
  const name = source.name;
  let draft, result;
  try {
    draft = source.clone();
    if (draft.parent !== page) page.appendChild(draft);
    draft.relativeTransform = transform;
    const prepared = iconfontPrepare(draft, host, mastergo);
    const svg = iconfontSvg(prepared.paths, prepared.width, prepared.height);
    // A native export-sized frame retains its padding, name and export presets.
    // For other roots use an export-sized wrapper around the repaired silhouette.
    if (draft.type === 'FRAME') {
      try {
        result = (await apply(draft, prepared, host)).node;
      } catch (error) {
        // Copies can safely be materialized as a single flat graphic even when
        // the original kind of container cannot accept an in-place write.
        if (!String(error?.code || '').startsWith('iconfont-inplace')) throw error;
      }
    }
    if (result) {
      const m = result.relativeTransform;
      result.relativeTransform = [[m[0][0], m[0][1], m[0][2] + position.x - prepared.left],
        [m[1][0], m[1][1], m[1][2] + position.y - prepared.top]];
    } else {
      result = mastergo ? await host.createNodeFromSvgAsync(svg) : host.createNodeFromSvg(svg);
      if (result.parent !== page) page.appendChild(result);
      result.x = position.x;
      result.y = position.y;
      if (draft.exportSettings?.length) result.exportSettings = draft.exportSettings;
    }
    result.name = name + ' · Iconfont';
    return { node: result, svg };
  } catch (error) {
    if (result && !result.removed) result.remove();
    throw error;
  } finally {
    if (draft && draft !== result && !draft.removed) draft.remove();
  }
}
