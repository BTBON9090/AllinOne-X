import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../shared/media-host.js', import.meta.url), 'utf8');
const sample = { x: 2, y: 4, blur: 12, spread: 0, color: { r: .2, g: .1, b: .6, a: .4 } };
for (const platform of ['figma','mastergo']) {
  const responses = [];
  const stored = [];
  const fillBytes = Uint8Array.of(11,22);
  const renderBytes = Uint8Array.of(33,44);
  const image = { getBytesAsync: async () => fillBytes };
  const blur = { type:'LAYER_BLUR', radius:3, visible:true };
  const inner = { type:'INNER_SHADOW', color:{ r:0,g:0,b:0,a:.23 } };
  const node = {
    id:'source', name:'Image', type:'RECTANGLE',
    fills:[{ type:'IMAGE', [platform === 'figma' ? 'imageHash' : 'imageRef']:'original', name:'Door' }],
    effects:[blur,{ type:'DROP_SHADOW' },inner],
    exportAsync:async opts => { assert.equal(opts.format, 'PNG'); assert.equal(opts.constraint.value,1); return renderBytes; }
  };
  const locked = { id:'locked', name:'Locked', effects:[], parent:{ type:'FRAME', isLocked:true } };
  const page = { selection:[node,locked] };
  let undo = 0;
  const host = {
    [platform==='figma'?'getImageByHash':'getImageByHref'](key) { stored.push(key); return image; },
    commitUndo() { undo++; }
  };
  const nestedNodes=new Map();
  const ctx = vm.createContext({ layerPlatform:platform, layerPage:()=>page, layerGet:async id=>nestedNodes.get(id), setTimeout,
    layerSend:message=>responses.push(message), layerHost:host });
  vm.runInContext(source,ctx);
  const call = async (type,data={})=>{
    assert(await ctx.handleMediaMessage({ type, requestId:'check', uiLanguage:'en', ...data }));
    return responses.at(-1);
  };
  const selected = await call('media-inspect');
  assert.equal(selected.items[0].imageFills[0].index,0);
  assert.equal(selected.items[0].renderable,true);
  assert.equal((await call('media-image-read',{nodeId:'source',source:'fill',fillIndex:0})).bytes,fillBytes);
  assert.deepEqual(stored,['original']);
  assert.equal((await call('media-image-read',{nodeId:'source',source:'render'})).bytes,renderBytes);
  assert((await call('media-image-read',{nodeId:'deleted',source:'render'})).error);
  const imageKey=platform==='figma'?'imageHash':'imageRef';
  const frame={id:'frame',name:'Card',type:'FRAME',children:[],fills:[],exportAsync:async()=>renderBytes};
  const group={id:'group',name:'Content',type:'GROUP',children:[],parent:frame};frame.children.push(group);
  const photo={id:'photo',name:'Photo',type:'RECTANGLE',parent:group,fills:[{type:'SOLID'},{type:'IMAGE',[imageKey]:'nested-original'}]};
  const invisible={...photo,id:'hidden-photo',visible:false,isVisible:false};
  group.children.push(photo,invisible);
  const foreign={...photo,id:'outside',parent:null};
  for(const n of [photo,invisible,foreign])nestedNodes.set(n.id,n);
  page.selection=[frame];
  const available=await call('media-image-sources',{nodeId:frame.id});
  assert.equal(available.type,'media-image-sources-result');
  assert.deepEqual(Array.from(available.imageFills,f=>[f.sourceNodeId,f.index,f.name]),[['photo',1,'Content / Photo']]);
  const originalRequest={nodeId:frame.id,source:'fill',sourceNodeId:photo.id,fillIndex:1};
  assert.equal((await call('media-image-read',originalRequest)).bytes,fillBytes);
  assert.equal(stored.at(-1),'nested-original');
  assert((await call('media-image-read',{...originalRequest,sourceNodeId:'outside'})).error);
  assert((await call('media-image-read',{...originalRequest,sourceNodeId:'hidden-photo'})).error);
  group[platform==='figma'?'visible':'isVisible']=false;
  assert((await call('media-image-read',originalRequest)).error);
  assert.equal((await call('media-image-sources',{nodeId:frame.id})).imageFills.length,0);
  page.selection=[node,locked];
  const data = { nodeIds:['source','locked'], kind:'DROP_SHADOW',shadows:[sample,sample] };
  const shadow = await call('media-shadow-apply',data);
  assert.equal(shadow.applied,1);
  assert.equal(shadow.issues.length,1);
  assert.equal(node.effects[0],blur);
  assert.equal(node.effects[3],inner);
  assert.equal(node.effects[1].offset.y,4);
  assert.equal(node.effects[1][platform==='figma'?'visible':'isVisible'],true);
  assert.equal(undo,1);
  await call('media-shadow-apply',data);
  assert.equal(node.effects.length,4,'Applying again replaces the editable shadow stack');
  const stable = node.effects;
  assert((await call('media-shadow-apply',{...data,nodeIds:['source']})).error);
  assert((await call('media-shadow-apply',{...data,shadows:[{...sample,blur:NaN}]})).error);
  assert.equal(node.effects,stable);
  assert.match((await call('media-shadow-read')).error, /exactly one layer/);
  page.selection = [];
  assert.match((await call('media-shadow-read')).error, /exactly one layer/);

  // Three arbitrary offsets, deliberately out of distance order. Picking and
  // applying must retain the compositing order, not sort by distance or blur.
  const visibility = platform === 'figma' ? 'visible' : 'isVisible';
  function nativeShadow(radius, overrides = {}) {
    return {
      type:'DROP_SHADOW', offset:{x:-radius / 3,y:radius * 2.1}, radius,
      spread:-0.123456789, color:{r:1/3,g:1/7,b:.83234567,a:.123456789123},
      blendMode:'MULTIPLY', showShadowBehindNode:true, [visibility]:true,
      ...(platform === 'mastergo' ? {isEffectShow:true} : {}), ...overrides
    };
  }
  const outerA = nativeShadow(1 / 3);
  if (platform === 'figma') outerA.boundVariables = {radius:{type:'VARIABLE_ALIAS',id:'VariableID:1:3'}};
  const outerB = nativeShadow(17.5678, {offset:{x:-4200.125, y:2.5}});
  const outerC = nativeShadow(3.75, {showShadowBehindNode:false, blendMode:'SCREEN'});
  const hiddenDrop = nativeShadow(0, {[visibility]:false});
  const hiddenInner = nativeShadow(81, {type:'INNER_SHADOW', [visibility]:false});
  const visibleInner = nativeShadow(9, {type:'INNER_SHADOW'});
  const shadowFixture = [outerA, blur, outerB, hiddenInner, hiddenDrop, visibleInner, outerC];
  node.effects = shadowFixture;
  page.selection = [node];
  assert.match((await call('media-shadow-read',{nodeId:'old-selection'})).error, /selection changed/);
  node.removed = true;
  assert((await call('media-shadow-read')).error);
  node.removed = false;
  const read = await call('media-shadow-read',{nodeId:node.id});
  assert.equal(read.type, 'media-shadow-read-result');
  assert.equal(read.requestId, 'check');
  assert.equal(read.name, node.name);
  assert.equal(read.kind, 'DROP_SHADOW');
  assert.deepEqual(Array.from(read.kinds), ['DROP_SHADOW','INNER_SHADOW']);
  const nativeOrder = platform === 'figma' ? [outerC,outerB,outerA] : [outerA,outerB,outerC];
  assert.deepEqual(Array.from(read.shadows, item => item.blur), nativeOrder.map(item => item.radius));
  read.shadows.forEach((item,i) => {
    const original = nativeOrder[i];
    assert.equal(item.x, original.offset.x);
    assert.equal(item.spread, original.spread);
    assert.deepEqual({...item.color}, original.color);
    assert.equal(item.blendMode, original.blendMode);
    assert.equal(item.showShadowBehindNode, original.showShadowBehindNode);
  });
  const pickInner = await call('media-shadow-read',{kind:'INNER_SHADOW'});
  assert.equal(pickInner.kind, 'INNER_SHADOW');
  assert.equal(pickInner.shadows.length,1);
  assert.equal(pickInner.shadows[0].blur,visibleInner.radius);
  assert.equal(node.effects, shadowFixture, 'Picking does not write to the canvas');
  const reapplied = await call('media-shadow-apply',{kind:read.kind,nodeIds:[node.id],shadows:read.shadows});
  assert.equal(reapplied.applied,1);
  // Same-type shadows are replaced, including the formerly disabled drop shadow.
  // Effects that were not targeted keep their positions between matched slots.
  assert.deepEqual(JSON.parse(JSON.stringify(node.effects)), [outerA, blur, outerB, hiddenInner, visibleInner, outerC]);
  assert.equal(node.effects[0], outerA, 'Unchanged native metadata and variable links survive reapplying to the source');
  assert.equal(node.effects[1], blur);
  assert.equal(node.effects[3], hiddenInner);
  assert.equal(node.effects[4], visibleInner);

  node.effects = [hiddenDrop,visibleInner,blur];
  const fallback = await call('media-shadow-read',{kind:'DROP_SHADOW'});
  assert.equal(fallback.kind, 'INNER_SHADOW');
  assert.deepEqual(Array.from(fallback.kinds), ['INNER_SHADOW']);
  node.effects = [hiddenDrop,hiddenInner,blur];
  assert.match((await call('media-shadow-read')).error, /no visible shadows/);
  page.selection = [{id:'unsupported', name:'Unsupported'}];
  assert.match((await call('media-shadow-read')).error, /does not support/);
  page.selection = [node];
  // Figma's budget is per kind. Existing opposite shadows and blurs do not
  // consume it, even if an opposite shadow is hidden.
  const opposite = Array.from({length:8}, (_,i) => nativeShadow(i, {type:'INNER_SHADOW',[visibility]:i !== 0}));
  node.effects = [blur,...opposite];
  const eight = Array.from({length:8}, (_,i) => ({...sample,x:i}));
  const applyEight = {kind:'DROP_SHADOW',nodeIds:[node.id],shadows:eight};
  assert.equal((await call('media-shadow-apply',applyEight)).applied,1);
  assert.equal(node.effects.length,17);
  assert.deepEqual(Array.from(node.effects.slice(9), effect => effect.offset.x), platform === 'figma' ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7]);
  opposite.forEach((effect,i) => assert.equal(node.effects[i+1], effect));
  const eightStable = node.effects;
  const overflow = {...applyEight,shadows:[...eight,sample]};
  assert.match((await call('media-shadow-apply',overflow)).error, /8 drop shadows and 8 inner shadows/);
  assert.match((await call('media-shadow-apply',{...overflow,uiLanguage:'zh'})).error, /8 层外阴影和 8 层内阴影/);
  assert.equal(node.effects,eightStable);
  node.effects = Array.from({length:9},(_,i) => nativeShadow(i));
  assert.match((await call('media-shadow-read')).error, /8 drop shadows/);
  const glass = {type:'GLASS',refraction:1.2,visible:false};
  const background = {type:'BACKGROUND_BLUR',radius:4,[visibility]:false};
  node.effects = [outerA,blur,hiddenInner,glass,visibleInner,background,hiddenDrop];
  const onlyShadow = {id:'single',name:'One shadow',effects:[hiddenInner]};
  const clean = {id:'clean',name:'No shadows',effects:[glass]};
  const mixed = {id:'mixed',name:'Mixed',effects:Symbol('mixed')};
  const refused = {id:'unwritable',name:'Read-only',get effects(){return [outerC];},set effects(_){throw Error('Read-only effect list');}};
  const nested = {id:'not-selected',name:'An unselected child',effects:[outerC]};
  node.children = [nested];
  locked.effects = [hiddenDrop];
  const targets = [node,onlyShadow,locked,mixed,refused,clean];
  const nodeIds = targets.map(n=>n.id);
  const original = node.effects, cleanEffects = clean.effects, undoBefore = undo;
  page.selection = targets;
  const clear = (ids, options={}) => call('media-shadow-clear',{nodeIds:ids,...options});
  assert((await clear(nodeIds.slice(1))).error);
  assert((await clear([...nodeIds,node.id])).error);
  assert((await clear(['unrelated',...nodeIds.slice(1)])).error);
  assert.equal(node.effects,original,'A stale or malformed selection must not clear anything');
  const cleared = await clear([...nodeIds].reverse());
  assert.equal(cleared.type,'media-shadow-clear-result');
  assert.equal(cleared.requestId,'check');
  assert.deepEqual([cleared.applied,cleared.removed,cleared.unchanged,cleared.issues.length],[2,5,1,3]);
  assert.deepEqual(Array.from(cleared.results,r=>[r.id,r.status,r.removed]),[
    [node.id,'cleared',4],[onlyShadow.id,'cleared',1],[locked.id,'skipped',0],
    [mixed.id,'skipped',0],[refused.id,'skipped',0],[clean.id,'unchanged',0]
  ]);
  assert.match(cleared.results[2].reason,/locked/);
  assert.match(cleared.results[3].reason,/does not support/);
  assert.match(cleared.results[4].reason,/Read-only/);
  assert.equal(node.effects.length,3);
  [blur,glass,background].forEach((effect,i)=>assert.equal(node.effects[i],effect,'Keep other effects in their original order'));
  assert.equal(onlyShadow.effects.length,0);
  assert.equal(locked.effects[0],hiddenDrop);assert.equal(refused.effects[0],outerC);
  assert.equal(nested.effects[0],outerC,'Only selected layers are cleared');
  assert.equal(clean.effects,cleanEffects,'A clean layer is not rewritten');
  assert.equal(undo,undoBefore+1,'All successful clears share one undo checkpoint');
  const repeat = await clear(nodeIds,{uiLanguage:'zh'});
  assert.deepEqual([repeat.applied,repeat.removed,repeat.unchanged],[0,0,3]);
  assert.match(repeat.issues[0].reason,/锁定/);
  assert.equal(undo,undoBefore+1,'Repeated clears do not create empty undo checkpoints');
  page.selection = [];
  assert((await clear([])).error);
  assert.equal(await ctx.handleMediaMessage({type:'unrelated'}),false);
  console.log(platform+' WebP selection, native shadow order, pick/apply, selective clearing and undo passed.');
}
