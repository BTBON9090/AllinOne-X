import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../shared/component-demos-host.js', import.meta.url), 'utf8');
const createDemo = vm.runInNewContext(source + '\ncreateComponentDemo');

function scene(platform) {
  let serial = 0;
  const host = { failAt: null, history: 0 };
  class Node {
    constructor(type) {
      this.id = String(++serial);
      this.type = type;
      this.children = [];
      this.x = this.y = 0;
      this.resize(100, 20);
    }
    resize(width, height) { Object.assign(this, { width, height }); }
    appendChild(node) {
      if (node.parent) node.parent.children.splice(node.parent.children.indexOf(node), 1);
      node.parent = this;
      this.children.push(node);
    }
    remove() {
      for (const child of [...this.children]) child.remove();
      this.parent.children.splice(this.parent.children.indexOf(this), 1);
      this.removed = true;
    }
    setRangeFontName() {}
    setRangeFontSize() {}
    get absoluteBoundingBox() {
      return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
  }
  const page = new Node('PAGE');
  page.selection = [];
  Object.assign(host, {
    viewport: { center: { x: 0, y: 0 }, zoom: 1, scrollAndZoomIntoView(nodes) {
      this.focus = nodes;
      if (host.failAt === 'focus') throw new Error('focus');
    } },
    loadFontAsync: async font => host.failAt !== 'font' || font.family === 'Roboto',
    listAvailableFontsAsync: async () => [{ fontName: { family: 'Roboto', style: 'Regular' } }],
    commitUndo() { this.history++; },
    combineAsVariants(nodes, parent) {
      assert.equal(arguments.length, platform === 'figma' ? 2 : 1);
      const set = new Node('COMPONENT_SET');
      (parent || nodes[0].parent).appendChild(set);
      set.componentPropertyValues = [{ type: 'VARIANT', name: 'Property 1' }];
      set.createVariantProperties = names => names.forEach(name => set.componentPropertyValues.push({ type:'VARIANT', name }));
      set.deleteVariantProperty = name => { set.componentPropertyValues = set.componentPropertyValues.filter(p => p.name !== name); };
      for (const node of nodes) {
        set.appendChild(node);
        node.setVariantPropertyValues = values => {
          if (host.failAt === 'schema') throw new Error('schema');
          node.name = Object.entries(values).map(([k, v]) => k + '=' + v).join(', ');
        };
      }
      return set;
    }
  });
  if (platform === 'figma') host.currentPage = page;
  else host.document = { currentPage: page };
  for (const type of ['Frame', 'Text', 'Component', 'Rectangle', 'Ellipse']) {
    host['create' + type] = () => {
      if (type === host.failAt) throw new Error(type);
      const node = new Node(type.toUpperCase());
      page.appendChild(node);
      return node;
    };
  }
  return { host, page };
}

for (const platform of ['figma', 'mastergo']) {
  const { host, page } = scene(platform);
  const original = host.createFrame();
  original.name = 'Existing artwork';
  original.x = original.y = -100;
  original.resize(200, 200);
  page.selection = [original];
  const run = kind => createDemo(host, platform, { kind, uiLanguage: 'en' });
  const expected = { lint: 3, find: 3, translate: 3, compkit: 1, build: 4, naming: 3, duplicate: 2 };
  for (const [kind, count] of Object.entries(expected)) {
    const before = [...page.children], history = host.history;
    assert.equal((await run(kind)).count, count);
    const board = page.children.at(-1);
    assert.equal(page.children.length, before.length + 1);
    assert.deepEqual(page.children.slice(0, -1), before);
    assert.equal(board.name.startsWith('AllinOne example'), true);
    assert.equal(board.clipsContent, false);
    assert.equal(host.viewport.focus[0], board);
    assert.equal(host.history, history + 2);
    assert(before.every(node => node.x + node.width <= board.x));
    const selected = Array.from(page.selection);
    assert.equal(selected.length, count);
    assert(selected.every(node => node.parent === board));
    if (['lint', 'find', 'translate'].includes(kind)) assert(selected.every(node => node.type === 'COMPONENT'));
    if (kind === 'lint') assert(selected.every(node => /__|--|  /.test(node.name)));
    if (kind === 'find') assert(selected.every(node => node.name.startsWith('Legacy / ')));
    if (kind === 'translate') assert(selected.every(node => /状态标签/.test(node.name)));
    if (kind === 'build') assert(selected.every(node => node.type === 'FRAME' && node.children.some(child => child.type === 'TEXT')));
    if (kind === 'naming') assert.deepEqual(selected.map(node => [node.name, node.children.length]), [['Frame 01', 2], ['Frame 02', 3], ['Frame 03', 3]]);
    if (kind === 'duplicate') {
      const [left, right] = selected;
      assert(left.type === 'FRAME' && right.type === 'FRAME');
      assert(left.children.some(n => n.name === 'Status / Verified'));
      assert(right.children.some(n => n.name === 'Status / Verified'));
      assert.notEqual(left.children.at(-1).name, right.children.at(-1).name);
    }
    if (kind === 'compkit') {
      const [set] = selected;
      assert.equal(set.type, 'COMPONENT_SET');
      assert.equal(set.children.length, 8);
      const names = set.children.map(n => n.name);
      assert.equal(new Set(names).size, 8);
      assert(names.every(name => /^Size=(Small|Large), State=(Default|Disabled), Tone=(Primary|Secondary)$/.test(name)));
      if (platform === 'mastergo') assert.deepEqual(set.componentPropertyValues.map(p => p.name), ['Size', 'State', 'Tone']);
    }
  }

  const before = [...page.children];
  const selected = [...page.selection];
  for (const failure of ['Text', 'focus', ...(platform === 'mastergo' ? ['schema'] : [])]) {
    host.failAt = failure;
    await assert.rejects(run('compkit'), new RegExp(failure));
    assert.deepEqual(page.children, before);
    assert.deepEqual(Array.from(page.selection), selected);
  }
  await assert.rejects(run('unknown'), /Unknown example/);
  host.failAt = 'font';
  assert.equal((await run('naming')).count, 3);
  assert.equal(original.name, 'Existing artwork');
  assert.deepEqual(original.children, []);
  console.log(platform + ': all seven editable examples, tool selections, variant axes, placement and rollback passed.');
}
