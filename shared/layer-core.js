/* Pure layer rules shared by both hosts and behavioral regression tests. */
const LayerRules = (() => {
  function walk(roots, includeRoots = true) {
    const result = [], seen = new Set(), stack = [...roots].reverse();
    const rootIds = new Set(roots.map(n => n.id));
    while (stack.length) {
      const node = stack.pop();
      if (!node || node.removed || seen.has(node.id)) continue;
      seen.add(node.id);
      if (includeRoots || !rootIds.has(node.id)) result.push(node);
      if ('children' in node) for (let i = node.children.length - 1; i >= 0; i--) stack.push(node.children[i]);
    }
    return result;
  }
  function pool(page, selection, scope) {
    let nodes;
    if (scope === 'page') nodes = walk(page.children);
    else if (!selection.length) nodes = [];
    else if (scope === 'inside') nodes = walk(selection, false);
    else if (scope === 'descendants') nodes = walk(selection, true);
    else if (scope === 'children') nodes = selection.flatMap(n => n.children || []);
    else if (scope === 'sibling') {
      const ids = new Set(selection.map(n => n.id));
      nodes = selection.flatMap(n => n.parent?.children || []).filter(n => !ids.has(n.id));
    } else nodes = [];
    return [...new Map(nodes.filter(n => n && !n.removed).map(n => [n.id, n])).values()];
  }
  function inherited(node, key, value) {
    for (let n = node; n && n.type !== 'PAGE' && n.type !== 'DOCUMENT'; n = n.parent) if ((n[key] ?? n[{visible:'isVisible',locked:'isLocked'}[key]]) === value) return true;
    return false;
  }
  function matches(node, types, states) {
    const visiblePaint = paints => Array.isArray(paints) && paints.some(p => p.visible !== false && p.isVisible !== false && p.opacity !== 0);
    const typeHit = value => value === node.type
      || (value === 'SLOT' && Boolean(node.componentPropertyReferences?.slotContentId))
      || (value === 'AUTOLAYOUT' && typeof (node.layoutMode ?? node.flexMode) === 'string' && (node.layoutMode ?? node.flexMode) !== 'NONE')
      || (value === 'IMAGE' && Array.isArray(node.fills) && node.fills.some(p => p.type === 'IMAGE' && p.visible !== false));
    const stateHit = value => ({
      hidden: () => inherited(node, 'visible', false), locked: () => inherited(node, 'locked', true),
      mask: () => node.isMask === true, export: () => Boolean(node.exportSettings?.length),
      'no-fill': () => Array.isArray(node.fills) && !visiblePaint(node.fills),
      'no-stroke': () => Array.isArray(node.strokes) && !visiblePaint(node.strokes),
      clip: () => node.clipsContent === true, 'no-children': () => Array.isArray(node.children) && node.children.length === 0
    }[value]?.() || false);
    const group = (filter, test) => !filter?.vals?.length || (filter.logic === 'exclude' ? !filter.vals.some(test) : filter.vals.some(test));
    return group(types, typeHit) && group(states, stateHit);
  }
  const props = name => Object.fromEntries(String(name).split(',').flatMap(part => {
    const eq = part.indexOf('='); return eq > 0 ? [[part.slice(0, eq).trim(), part.slice(eq + 1).trim()]] : [];
  }));
  function matrix(nodes, config = {}) {
    if (!nodes.length) throw new Error('组件集为空');
    const dimensions = [...new Set(nodes.flatMap(n => Object.keys(props(n.name))))];
    const x = Array.isArray(config.axesX) && config.axesX.length ? config.axesX : [config.propX || dimensions[0]].filter(Boolean);
    const y = Array.isArray(config.axesY) ? config.axesY : [config.propY || ''].filter(Boolean);
    if (!x.length || [...x,...y].some(p => !dimensions.includes(p)) || new Set([...x,...y]).size !== x.length + y.length) throw new Error('行列属性无效或重复，请重新读取组件集');
    const group = dimensions.filter(p => !x.includes(p) && !y.includes(p));
    const key = (p, keys) => JSON.stringify(keys.map(k => p[k] ?? '—'));
    const values = nodes.map(n => props(n.name));
    const xs = [...new Set(values.map(p => key(p,x)))], ys = [...new Set(values.map(p => key(p,y)))], groups = [...new Set(values.map(p => key(p,group)))];
    const num = (key, fallback) => Number.isFinite(Number(config[key])) ? Math.max(0, Math.min(4096, Number(config[key]))) : fallback;
    const gapX = num('gapX',16), gapY = num('gapY',16), padding = num('padding',20), groupGap = num('groupGap',32);
    const maxW = Math.max(...nodes.map(n => n.width)), maxH = Math.max(...nodes.map(n => n.height));
    const occupancy = new Map();
    values.forEach(p => { const k = key(p,[...x,...y,...group]); occupancy.set(k,(occupancy.get(k)||0)+1); });
    const lanes = Math.max(...occupancy.values()); // Duplicate variant tuples get separate lanes, never overlap.
    const columnWidths = xs.map(k => Math.max(...nodes.filter((n,i)=>key(values[i],x)===k).map(n=>n.width)));
    const rowHeights = ys.map(k => Math.max(...nodes.filter((n,i)=>key(values[i],y)===k).map(n=>n.height)));
    const columnOffsets = columnWidths.map((w,i)=>columnWidths.slice(0,i).reduce((a,b)=>a+b,0)+i*gapX);
    const rowOffsets = rowHeights.map((h,i)=>rowHeights.slice(0,i).reduce((a,b)=>a+lanes*b+(lanes-1)*gapY,0)+i*gapY);
    const groupH = rowHeights.reduce((a,h)=>a+lanes*h,0)+(ys.length*lanes-1)*gapY;
    const used = new Map();
    const placements = nodes.map((node,i) => {
      const p=values[i], k=key(p,[...x,...y,...group]), lane=used.get(k)||0; used.set(k,lane+1);
      const col=xs.indexOf(key(p,x)),row=ys.indexOf(key(p,y));
      return { node, x:padding+columnOffsets[col], y:padding+groups.indexOf(key(p,group))*(groupH+groupGap)+rowOffsets[row]+lane*(rowHeights[row]+gapY) };
    });
    return { placements, width:padding*2+columnWidths.reduce((a,b)=>a+b,0)+(xs.length-1)*gapX, height:padding*2+groups.length*groupH+(groups.length-1)*groupGap, xs, ys, groups, group, x, y, maxW,maxH,gapX,gapY,padding,groupGap,groupH,lanes,columnWidths,columnOffsets,rowHeights,rowOffsets };
  }
  return { walk, pool, matches, props, matrix };
})();
