import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from '../figma/node_modules/typescript/lib/typescript.js';
const core = fs.readFileSync('shared/window-host.js','utf8');
for (const platform of ['figma','mastergo']) {
  const source = fs.readFileSync(platform === 'figma' ? 'figma/code.ts' : 'mastergo/main.ts','utf8');
  const position = { x:500,y:200 };
  const bounds = { x:-200,y:-100,width:2400,height:1800 };
  const messages = [], sizes = [];
  const host = {
    viewport:{ zoom:0.5, bounds, bound:bounds },
    ui:{
      getPosition:() => ({ canvasSpace:{ x:bounds.x + position.x / 0.5, y:bounds.y + position.y / 0.5 } }),
      reposition:(x,y) => { position.x = (x - bounds.x) * 0.5; position.y = (y - bounds.y) * 0.5; },
      get viewport() { return { ...position, width:440,height:600,headerHeight:32 }; },
      moveTo:(x,y) => Object.assign(position,{ x,y }),
      resize:(...args) => sizes.push(args),
      postMessage(payload) {
        // Figma supplies the envelope. MasterGo delivers the payload verbatim.
        const data = platform === 'figma' ? { pluginMessage:payload } : payload;
        assert(data.pluginMessage?.type, platform + ' must deliver event.data.pluginMessage to the iframe');
        messages.push(data.pluginMessage);
      }
    }
  };
  const context = vm.createContext({ figma:host,mg:host,console });
  if (platform === 'mastergo') {
    const sender = source.split('\n').find(line => line.startsWith('const sendToUI ='));
    assert(sender, 'Use the production MasterGo iframe sender');
    vm.runInContext(ts.transpileModule(sender, {}).outputText,context);
  }
  vm.runInContext(core + '\n' + fs.readFileSync('shared/window-adapters.js','utf8').replaceAll('__PLUGIN_PLATFORM__',JSON.stringify(platform)),context);
  const handle = vm.runInContext('handlePluginWindowMessage',context);
  handle({ type:'window-init' }); assert.equal(messages.at(-1).canMove,true);
  handle({ type:'window-collapse', width:440,height:600 });
  assert.equal(messages.at(-1).collapsed,true); assert.deepEqual(sizes.at(-1).slice(0,2),[70,48]);
  assert.equal(position.x,1122);
  handle({ type:'window-drag-start' }); handle({ type:'window-drag-end',dx:-1000,dy:600 });
  assert.equal(position.x,8); assert(position.y <= 812); assert.equal(messages.at(-1).edge,'left');
  handle({ type:'resize-window',width:70,height:48 });
  handle({ type:'window-expand' }); assert.deepEqual(sizes.at(-1).slice(0,2),[440,600]); assert.equal(position.x,8);
  assert(position.y <= 268); // Includes the host title bar, without modifying canvas zoom/center.
  handle({ type:'window-drag-start',width:360,height:520 });
  handle({ type:'window-drag-move',dx:500,dy:-100 });
  const moved = { ...position }; assert.equal(moved.x,508);
  handle({ type:'window-drag-cancel' }); assert.equal(position.x,8);
  handle({ type:'window-drag-start',width:360,height:520 });
  handle({ type:'window-drag-end',dx:500,dy:0 }); assert.equal(messages.at(-1).collapsed,false);
  handle({ type:'window-drag-start',width:360,height:520 });
  handle({ type:'window-drag-end',dx:1000,dy:0 }); assert.equal(messages.at(-1).collapsed,true);
  handle({ type:'window-expand' }); assert.deepEqual(sizes.at(-1).slice(0,2),[360,520]);
  handle({ type:'window-nudge',dx:-16,dy:-16 }); assert.equal(position.x,816);
  assert.equal(host.viewport.zoom,0.5); assert.deepEqual(bounds,{ x:-200,y:-100,width:2400,height:1800 });
  for (const width of [210,170]) {
    handle({ type:'resize-drag',width,height:520 });
    handle({ type:'window-collapse',width,height:520 });
    handle({ type:'window-expand' });
    assert.deepEqual(sizes.at(-1).slice(0,2),[width,520],'A manually narrowed window survives bubble collapse / expand');
  }
  delete host.ui.getPosition; delete host.ui.moveTo;
  handle({ type:'window-init' }); assert.equal(messages.at(-1).canMove,false);
  const previousPosition = { ...position };
  handle({ type:'window-collapse',width:360,height:520 });
  assert.equal(messages.at(-1).collapsed,true); assert.equal(messages.at(-1).error,false);
  assert.deepEqual(sizes.at(-1).slice(0,2),[70,48]);
  handle({ type:'window-expand' });
  assert.equal(messages.at(-1).collapsed,false); assert.equal(messages.at(-1).canMove,false);
  assert.deepEqual(sizes.at(-1).slice(0,2),[360,520]);
  assert.deepEqual(position,previousPosition);

  let stored = [{ id:'a',name:'中文 <svg>',zoom:0.25,selectionIds:['layer'],pageId:'one' },{ id:'b',name:'Other',centerX:42 }];
  const begin = source.indexOf("    case 'jb-reorder':"), end = source.indexOf("    case 'jb-save':",begin);
  host.root = { getPluginData:() => JSON.stringify(stored),setPluginData:(_,data) => { stored = JSON.parse(data); } };
  context.loadJumpbackSpots = async () => stored;
  context.saveJumpbackSpots = async data => { stored = data; };
  vm.runInContext(ts.transpileModule('async function reorderMessage(msg) { switch(msg.type) {\n' + source.slice(begin,end) + '\n} }', { compilerOptions:{ target:ts.ScriptTarget.ES2020 } }).outputText,context);
  const original = JSON.stringify(stored);
  await context.reorderMessage({ type:'jb-reorder',ids:['b','a'],requestId:7 });
  assert.deepEqual(Array.from(stored,s=>s.id),['b','a']); assert.equal(stored[1].zoom,0.25); assert.equal(stored[1].name,'中文 <svg>');
  const ordered = JSON.stringify(stored);
  for (const ids of [['a','a'],['a','unknown'],['a'],null]) {
    await context.reorderMessage({ type:'jb-reorder',ids,requestId:8 });
    assert.equal(messages.at(-1).error,true); assert.equal(JSON.stringify(stored),ordered);
  }
  assert.notEqual(original,ordered);
  console.log(`${platform}: coordinate conversion, edge snap, drag/cancel, size restoration, old-host fallback and validated bookmark persistence passed.`);

  // The native bridge registers a listener through a setter without returning it on read.
  const startupMessages = [], settings = new Map();
  let receive, registrations = 0;
  const page = { id:'page', selection:[{ id:'text', type:'TEXT', name:'Sample text' }] };
  const runtime = {
    currentPage:page,
    document:{ currentPage:page },
    showUI() {},
    on() {},
    clientStorage:{
      async setAsync(key, value) { settings.set(key, value); },
      async getAsync(key) { return settings.get(key); }
    },
    ui:{
      set onmessage(handler) { receive = handler; registrations += 1; },
      postMessage(payload) {
        startupMessages.push(platform === 'mastergo' ? payload.pluginMessage : payload);
      }
    }
  };
  const builtPath = platform === 'figma' ? 'figma/code.js' : 'mastergo/main.js';
  const sandbox = {
    figma:runtime, mg:runtime, __html__:'<html></html>', console, fetch,
    setTimeout() {}, setInterval() {}
  };
  vm.runInNewContext(fs.readFileSync(builtPath, 'utf8'), sandbox, { filename:builtPath });
  assert.equal(registrations, 1);
  const send = message => receive(platform === 'mastergo' ? { pluginMessage:message } : message);
  await send({ type:'window-init' });
  assert.equal(startupMessages.at(-1).type, 'window-state');
  await send({ type:'get-selection-count' });
  assert.equal(startupMessages.at(-1).type, 'selection-count-res');
  assert.equal(startupMessages.at(-1).count, 1);
  await send({ type:'get-iconfont-selection' });
  assert.equal(startupMessages.at(-1).type, 'iconfont-selection');
  assert.equal(startupMessages.at(-1).targets.selection[0].id, 'text');
  await send({ type:'save-storage', key:'test', value:'saved' });
  assert.equal(startupMessages.at(-1).type, 'storage-saved');
  await send({ type:'load-storage', key:'test' });
  assert.equal(startupMessages.at(-1).value, 'saved');
  console.log(`${platform}: built plugin registers once and handles canvas and settings requests on a setter-only host.`);
}
const queueContext = vm.createContext({ console }); vm.runInContext(core,queueContext);
const order = [];
const dispatch = queueContext.queuePluginBookmarkMessages(async message => {
  const { type } = message.pluginMessage || message;
  order.push('start-' + type);
  await Promise.resolve();
  order.push('end-' + type);
});
await Promise.all([dispatch({ pluginMessage:{ type:'jb-reorder' } }), dispatch({ type:'jb-delete' }), dispatch({ type:'window-init' })]);
assert.deepEqual(order,['start-window-init','start-jb-reorder','end-window-init','end-jb-reorder','start-jb-delete','end-jb-delete']);
console.log('Bookmark writes are serialized; concurrent mutations cannot overwrite a saved order.');
