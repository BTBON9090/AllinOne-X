import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

for (const platform of ['figma', 'mastergo']) {
  const main = platform === 'figma' ? 'code.js' : 'main.js';
  const compiled = fs.readFileSync(new URL('../' + platform + '/' + main, import.meta.url), 'utf8');
  const shared = compiled.split('// shared-host-locale:end')[0];
  const page = { id: 'page', type: 'PAGE', children: [], selection: [] };
  const messages = [];
  const host = {
    currentPage: page, document: { currentPage: page },
    ui: { postMessage(event) { messages.push(event.pluginMessage || event); } }
  };
  const context = vm.createContext({ [platform === 'figma' ? 'figma' : 'mg']: host, console, setTimeout });
  vm.runInContext(shared, context);
  const message = async (type, data = {}) => {
    await context.handleIconfontMessage({ type, mode: 'children', requestId: 'test', ...data });
    return messages.at(-1);
  };
  const box = { x: 24, y: 0, width: 48, height: 48 };
  const frame = { id: 'frame', type: 'FRAME', name: 'Icons', parent: page, fills: [], strokes: [],
    absoluteBoundingBox: box, absoluteRenderBounds: box, width: 48, height: 48, absoluteTransform: [[1,0,24],[0,1,0]], children: [] };
  const path = { data: 'm 1 1 h 20 v 20 h -20 z m 4 4 h 12 v 12 h -12 z', windingRule: 'EVENODD' };
  const fill = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 } }];
  const icon = { ...frame, id: 'check', parent: frame, name: 'Check', fills: fill,
    type: platform === 'figma' ? 'VECTOR' : 'PEN', penPaths: { ...path, windingRule: 'Evenodd' }, fillGeometry: [path] };
  delete icon.children;
  const mask = { ...icon, id: 'mask', isMask: true };
  const hidden = { ...icon, id: 'hidden', visible: false, isVisible: false };
  const skipped = { ...icon, id: 'skipped', fills: [{ type: 'IMAGE' }] };
  frame.children.push(icon, hidden, mask, skipped);
  page.children.push(frame);
  page.selection = [frame, icon];
  const identity = [[1,0,0],[0,1,0]];
  const attach = (target, child) => {
    if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1);
    target.children.push(child);
    child.parent = target;
    return child;
  };
  page.appendChild = node => attach(page, node);
  function temporary(props) {
    const node = { ...props, parent: null, remove() {
      this.parent.children.splice(this.parent.children.indexOf(this), 1);
      this.removed = true;
    } };
    return page.appendChild(node);
  }
  for (const node of frame.children) {
    node.vectorPaths = [path];
    node.relativeTransform = identity;
    node.exportSettings = [{format: 'SVG'}];
    node.clone = () => temporary({ ...node, id: node.id + '-clone' });
  }
  const create = () => temporary({ id: 'copy' });
  host.createVector = () => temporary({ relativeTransform: identity });
  host.createPen = () => temporary({ relativeTransform: identity, penNetwork: {} });
  host.createNodeFromSvg = create;
  host.createNodeFromSvgAsync = async () => create();
  const selection = await message('get-iconfont-selection');
  assert.equal(selection.count, 1);
  assert.equal(selection.childCount, 3);
  assert.equal(selection.targets.children.map(node => node.id).join(','), 'check,mask,skipped');
  const res = await message('iconfont-repair-run', { action:'copy', targetIds:['check','mask','skipped'] });
  assert.equal(res.error, undefined);
  assert.equal(res.items.map(x => x.status).join(','), 'fixed,skipped,skipped');
  assert.match(res.items[0].svg, /viewBox="0 0 48 48"/);
  assert.match(res.items[0].svg, /M 1 1 L 21 1 L 21 21 L 1 21 Z M 5 5 L 5 17 L 17 17 L 17 5 Z/);
  assert.equal(page.children.length, 2);
  assert.equal(page.selection[0].name, 'Check · Iconfont');
  assert.equal(icon.fillGeometry[0].windingRule, 'EVENODD');
  assert.equal(icon.parent, frame);
  page.selection = [frame];
  const baseline = page.children.length;
  const stale = await message('iconfont-repair-run', {action:'inplace', targetIds:['check','deleted']});
  assert(stale.error || messages.at(-2).error);
  assert((await message('iconfont-repair-run', {action:'inplace', targetIds:[]})).error);
  host.createNodeFromSvg = host.createNodeFromSvgAsync = () => { throw new Error('Native repair serialized an SVG'); };
  vm.runInContext('iconfontSvg = () => { throw new Error("Unexpected SVG serialization") }', context);
  const inPlace = await message('iconfont-repair-run', {action:'inplace', targetIds:['check']});
  assert.equal(inPlace.items.length, 1);
  assert.equal(inPlace.items[0].status, 'fixed', inPlace.items[0].reason);
  assert.equal('svg' in inPlace.items[0], false);
  assert.equal(page.children.length, baseline);
  assert.equal(page.selection[0], icon);
  assert.equal(icon.parent, frame);
  assert.equal(icon.fills[0].color.r, 1);
  const repaired = platform === 'figma' ? icon.vectorPaths : icon.penPaths;
  assert.equal(repaired[0].windingRule.toUpperCase(), 'NONZERO');
  assert.equal(frame.children[1], hidden);
  page.selection = [];
  assert((await message('iconfont-repair-run')).error);
  console.log(platform + ' iconfont batch checks passed.');
}
