import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from '../figma/node_modules/typescript/lib/typescript.js';

// Execute the shipped handlers against font-aware nodes, not regex source assertions.
for (const platform of ['figma', 'mastergo']) {
  const source = fs.readFileSync(platform === 'figma' ? 'figma/code.ts' : 'mastergo/main.ts', 'utf8');
  const ast = ts.createSourceFile('plugin.ts', source, ts.ScriptTarget.Latest, true);
  const helperNames = new Set(['collectSmartFillTextNodes', 'loadSmartFillFonts']);
  const helpers = ast.statements.filter(statement => ts.isVariableStatement(statement) &&
    statement.declarationList.declarations.some(d => helperNames.has(d.name.getText(ast)))).map(n => n.getText(ast)).join('\n');
  const start = source.indexOf("    case 'get-selection-count':");
  const end = source.indexOf('    // 3. 存储/读取配置', start);
  const handler = 'async function handle(msg) { switch(msg.type) {\n' + source.slice(start, end) + '\n} }';
  const mixed = Symbol('mixed');
  const loaded = new Set();
  const calls = [];
  const messages = [];
  const fontA = { family: 'Example', style: 'Regular' };
  const fontB = { family: 'Example', style: 'Bold' };
  const page = { selection: [] };
  const nodes = new Map();
  const host = {
    mixed, currentPage: page, document: { currentPage: page },
    loadFontAsync: async font => {
      assert.equal(typeof font.family, 'string', 'mixed sentinels must not be loaded as fonts');
      calls.push(font.style);
      if (font.family === 'Missing') throw new Error('Font not found');
      loaded.add(JSON.stringify(font));
    },
    getNodeById: async id => nodes.get(id), getNodeByIdAsync: async id => nodes.get(id),
    notify: () => {}, ui: { postMessage: message => messages.push(message) }
  };
  const context = vm.createContext({ figma: host, mg: host, sendToUI: m => messages.push(m), console: { error: () => {} } });
  vm.runInContext(ts.transpileModule(helpers + '\n' + handler, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText, context);
  const text = (id, fonts, content = 'Before', x = 0) => {
    let characters = content;
    const checkFonts = () => fonts.forEach(font => assert(loaded.has(JSON.stringify(font)), 'every used font must be loaded before writing'));
    const node = {
      id, name: id, type: 'TEXT', visible: true, isVisible: true, removed: false, x, y: 0,
      fontName: fonts.length > 1 ? mixed : fonts[0],
      textStyles: fonts.map(fontName => ({ textStyle: { fontName } })),
      getRangeAllFontNames: () => fonts,
      get characters() { return characters; },
      set characters(value) { checkFonts(); assert.equal(typeof value, 'string'); characters = value; },
      insertCharacters(index, value) { checkFonts(); characters = characters.slice(0,index) + value + characters.slice(index); }
    };
    nodes.set(id, node); return node;
  };
  const a = text('a', [fontA, fontB]);
  const b = text('b', [fontA], '', 100);
  const hidden = text('hidden', [fontA]);
  const frame = { id:'frame', type:'FRAME', children:[a,b,{id:'hidden-parent', visible:false, isVisible:false, children:[hidden]}] };
  page.selection = [frame,a]; // Overlapping selection must not count/write twice.
  await context.handle({ type:'get-selection-count' });
  const snapshot = messages.at(-1);
  assert.equal(snapshot.count, 2);
  page.selection = [hidden]; // Selection can change during frontend data generation.
  await context.handle({ type:'smart-fill-exec', nodeIds:snapshot.nodeIds, dataList:[0,42], mode:'replace' });
  assert.equal(a.characters, '0'); assert.equal(b.characters, '42'); assert.equal(hidden.characters, 'Before');
  assert.equal(messages.at(-1).count, 2); assert.deepEqual(calls, ['Regular','Bold']);
  await context.handle({ type:'smart-fill-exec', nodeIds:['a'], dataList:['P'], mode:'prefix' });
  await context.handle({ type:'smart-fill-exec', nodeIds:['a'], dataList:['S'], mode:'suffix' });
  assert.equal(a.characters, 'P0S');
  // Force a deterministic random draw to verify the random path actually selects that item.
  vm.runInContext('Math.random = () => 0.99', context);
  await context.handle({ type:'smart-fill-exec', nodeIds:['b'], dataList:['first','last'], distribution:'random' });
  assert.equal(b.characters, 'last');
  const missing = text('missing', [{ family:'Missing', style:'Regular' }]);
  await context.handle({ type:'smart-fill-exec', nodeIds:['missing','b'], dataList:['New'], mode:'replace' });
  assert.equal(missing.characters, 'Before'); assert.equal(b.characters, 'New');
  assert.equal(messages.at(-1).count, 1); assert.equal(messages.at(-1).errors.length, 1);
  assert.match(messages.at(-1).errors[0], /Missing/);
  page.selection = [];
  await context.handle({ type:'get-selection-count' });
  assert.equal(messages.at(-1).count, 0);
  await context.handle({ type:'smart-fill-exec', dataList:[] });
  assert.equal(messages.at(-1).count, 0);
  console.log(platform + ': mixed fonts, empty text, numeric input, deduplication, selection snapshot, prefix/suffix, partial failure and empty selection passed.');
}
