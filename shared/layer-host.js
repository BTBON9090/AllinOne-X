/* Host adapter: snapshot reads and transactional component construction. */
const layerHost = __PLUGIN_HOST__;
const layerPlatform = __PLUGIN_PLATFORM__;
const layerPage = () => layerPlatform === 'figma' ? layerHost.currentPage : layerHost.document.currentPage;
const layerSend = message => layerHost.ui.postMessage(layerPlatform === 'figma' ? message : { pluginMessage: message });
const layerGet = id => layerPlatform === 'figma' ? layerHost.getNodeByIdAsync(id) : Promise.resolve(layerHost.getNodeById(id));
let layerSeed = [], layerResultIds = '', layerSeedPage = '', layerBusy = false, layerSearchWriting = false;
const layerSnapshots = new Map();
const layerCancelled = new Set();
const layerIds = nodes => nodes.map(n => n.id).sort().join('|');
function layerSearchRoots() {
  const page = layerPage(), selected = [...page.selection];
  if (page.id !== layerSeedPage || layerIds(selected) !== layerResultIds) { layerSeed = selected; layerSeedPage = page.id; }
  return layerSeed.filter(n => !n.removed);
}
function layerRememberSearch(nodes) { layerResultIds = layerIds(nodes); }
function layerSelectSearch(nodes) {
  layerSearchWriting=true;
  try { layerPage().selection=nodes; layerResultIds=layerIds([...layerPage().selection]); }
  finally { layerSearchWriting=false; }
}
function installLayerTools() {
  if (layerPlatform === 'figma') layerHost.skipInvisibleInstanceChildren = false;
  layerHost.on('selectionchange', () => {
    try {
    const nodes = [...layerPage().selection], valid = nodes.filter(n => ['FRAME','RECTANGLE'].includes(n.type));
    if (!layerSearchWriting && layerIds(nodes) !== layerResultIds) { layerSeed=nodes; layerSeedPage=layerPage().id; }
    layerSend({ type:'size-assistant-selection', validCount:valid.length, invalidCount:nodes.length-valid.length, width:valid.length===1?valid[0].width:0, height:valid.length===1?valid[0].height:0 });
    }catch(error){console.warn('Layer selection refresh deferred:',String(error));}
  });
}
function layerRead(root) {
  const layers=[], stack=[{node:root,path:[]}];
  while (stack.length) {
    const {node,path}=stack.pop();
    if (layers.length >= 5000) throw new Error('图层树超过 5,000 层，请拆分后分析；本次未截断读取');
    const record={id:node.id,path,name:node.name,type:node.type,width:node.width,height:node.height,visible:node.visible ?? node.isVisible,locked:node.locked ?? node.isLocked};
    for (const key of ['x','y','opacity','characters','layoutMode','itemSpacing','cornerRadius','fills','strokes','effects','componentPropertyReferences','componentProperties','componentPropertyDefinitions','vectorPaths','fontName','fontSize','flexMode','rotation','relativeTransform','strokeWeight','strokeAlign','strokeCap','strokeJoin','dashPattern','cornerSmoothing','topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius','clipsContent','blendMode','isMask','vectorNetwork','textCase','textDecoration','textAlignHorizontal','textAlignVertical','lineHeight','letterSpacing','textAutoResize','paddingLeft','paddingRight','paddingTop','paddingBottom','primaryAxisSizingMode','counterAxisSizingMode','primaryAxisAlignItems','counterAxisAlignItems','layoutSizingHorizontal','layoutSizingVertical']) {
      try { const value=node[key]; if (value!==undefined && typeof value!=='symbol') record[key]=value; } catch (_) {}
    }
    try { if (node.type==='INSTANCE') record.mainComponentId=node.mainComponent?.id || node.componentId; } catch (_) {}
    if(node.type==='TEXT'&&typeof node.getStyledTextSegments==='function')try{record.textSegments=node.getStyledTextSegments(['fontName','fontSize','fills','textCase','textDecoration','letterSpacing','lineHeight']);}catch(_){}
    layers.push(record);
    if ('children' in node) for (let i=node.children.length-1;i>=0;i--) stack.push({node:node.children[i],path:[...path,i]});
  }
  return {id:root.id,name:root.name,type:root.type,layers};
}
function layerHash(value) {
  const text=JSON.stringify(value);let a=2166136261,b=5381;
  for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i);}
  return `${text.length}:${a>>>0}:${b>>>0}`;
}
function layerStamp(roots) { return roots.map(n=>layerHash(layerRead(n))).join('|'); }
function layerAppearance(root) {
  return layerRead(root).layers.map((record,index)=>{
    const {id,name,path,componentPropertyReferences,componentPropertyDefinitions,componentProperties,...visual}=record;
    if(!index){delete visual.x;delete visual.y;delete visual.relativeTransform;visual.type='ROOT';}
    return visual;
  });
}
function layerAssertAppearance(expected,actual,name) {
  if(expected!==layerHash(layerAppearance(actual)))throw new Error(`“${name}”的外观或尺寸在构建中发生变化，已撤销生成内容并保留原 Frame`);
}
function layerAt(root,path) {
  if (!Array.isArray(path) || path.length>100 || path.some(i=>!Number.isInteger(i)||i<0)) throw new Error('AI 返回无效图层路径');
  let node=root;
  for (const index of path) { node=node?.children?.[index]; if (!node) throw new Error('图层结构已变化，请重新分析'); }
  return node;
}
function layerBase64(bytes) {
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', parts=[];
  for(let i=0;i<bytes.length;i+=3){const a=bytes[i],b=bytes[i+1],c=bytes[i+2];parts.push(alphabet[a>>2]+alphabet[((a&3)<<4)|((b||0)>>4)]+(i+1<bytes.length?alphabet[((b&15)<<2)|((c||0)>>6)]:'=')+(i+2<bytes.length?alphabet[c&63]:'='));}
  return parts.join('');
}
function layerClean(value) { return String(value||'').replace(/[,=\n\r]/g,' ').trim().slice(0,100); }
// Analysis reads selected roots only. Descendant appearance checks are local to construction.
function layerSummary(root) {
  const result={id:root.id,name:root.name,type:root.type,width:root.width,height:root.height,parentId:root.parent?.id};
  for(const key of ['cornerRadius','opacity','rotation','visible','isVisible','fills','strokes'])try{const value=root[key];if(value!==undefined&&typeof value!=='symbol')result[key]=value;}catch(_){}
  if(root.type==='COMPONENT')result.values=layerVariantValues(root);
  return result;
}
function layerVariantValues(node) {
  try{const properties=node.variantProperties;if(Array.isArray(properties))return Object.fromEntries(properties.map(p=>[p.property,String(p.value)]));if(properties&&typeof properties==='object')return Object.fromEntries(Object.entries(properties).map(([k,v])=>[k,String(v)]));}catch(_){}
  return Object.fromEntries(String(node.name).split(',').map(p=>p.split('=').map(s=>s.trim())).filter(p=>p.length===2));
}
function layerApplyVariantValues(owner,components,variants) {
  if(layerPlatform!=='mastergo'||owner.type!=='COMPONENT_SET')return;
  components.forEach((node,i)=>{if(typeof node.setVariantPropertyValues==='function')node.setVariantPropertyValues(variants[i].values||{});});
  const expected=new Set(Object.keys(variants[0]?.values||{}));
  if(expected.size&&Array.isArray(owner.componentPropertyValues)&&typeof owner.deleteVariantProperty==='function')for(const p of owner.componentPropertyValues.filter(p=>p.type==='VARIANT'&&!expected.has(p.name)))owner.deleteVariantProperty(p.name);
}
async function layerSnapshot(msg) {
  const selected=[...layerPage().selection];
  let roots=selected, limit=800,consolidate=false; const sides=new Map(),destinations=[],sourceSets=[];
  if (msg.purpose==='build') {
    if(selected.some(n=>!['FRAME','COMPONENT','COMPONENT_SET'].includes(n.type)))throw new Error('请选择 Frame、独立组件，或组件集与待补入对象');
    const sets=selected.filter(n=>n.type==='COMPONENT_SET');
    consolidate=msg.consolidate===true&&sets.length>0;
    roots=selected.filter(n=>n.type!=='COMPONENT_SET'&&!sets.includes(n.parent));
    if(roots.some(n=>n.parent?.type==='COMPONENT_SET'))throw new Error('请选中整个组件集和待补入的独立对象');
    for(const set of sets)(consolidate?sourceSets:destinations).push({id:set.id,name:set.name,parentId:set.parent?.id,appendSupported:typeof set.appendChild==='function'&&typeof set.insertChild==='function',variants:set.children.filter(n=>n.type==='COMPONENT').map(n=>({...layerSummary(n),values:layerVariantValues(n)}))});
    if(consolidate){
      if(new Set([...sets,...roots].map(n=>n.parent?.id)).size!==1)throw new Error('整合的组件集与 Frame 需要位于同一父级，请先移至同一容器');
      roots=[...sets.flatMap(n=>n.children.filter(c=>c.type==='COMPONENT')),...roots];
    }else{limit-=destinations.reduce((n,d)=>n+d.variants.length,0);if(!roots.length)throw new Error('请同时选中组件集及待补入的 Frame 或独立组件，或开启整合模式');}
  }
  if (msg.purpose==='translate') {
    roots=LayerRules.walk(selected).filter(n=>n.type==='COMPONENT_SET'||(n.type==='COMPONENT'&&n.parent?.type!=='COMPONENT_SET'));
  }
  if (msg.purpose==='duplicate') {
    if (selected.length!==2 || selected.some(n=>!('children' in n))) throw new Error('请选择两个画板或容器');
    for(let p=selected[0].parent;p;p=p.parent)if(p.id===selected[1].id)throw new Error('请选择两个互不嵌套的容器');
    for(let p=selected[1].parent;p;p=p.parent)if(p.id===selected[0].id)throw new Error('请选择两个互不嵌套的容器');
    const excluded=new Set((msg.exclude||[]).map(s=>String(s).toLowerCase()));
    // Generic words are removed from names; unnamed/generic layers still have useful visuals.
    roots=[];
    for (const parent of selected) for (const node of parent.children) {
      if ((node.visible ?? node.isVisible)===false || node.width<=0 || node.height<=0 || !node.exportAsync) continue;
      const tokens=String(node.name).toLowerCase().split(/[\s/_\-]+/).filter(t=>!excluded.has(t)&&!(excluded.has('number')&&/^\d+$/.test(t)));
      if (tokens.length) { roots.push(node); sides.set(node.id,selected.indexOf(parent)); if(roots.length>800)throw new Error('可比较图层超过 800 个，请调整范围后重试'); }
    }
    limit=800;
  }
  if(msg.purpose==='matrix') {
    const sets=roots.flatMap(n=>n.type==='COMPONENT_SET'?[n]:n.type==='FRAME'&&n.getPluginData?.('isShowcaseBoard')==='true'?LayerRules.walk(n.children).filter(c=>c.type==='COMPONENT_SET'):[]);
    if(!sets.length)throw new Error('请选择组件集或组件说明书');
    roots=[...new Map(sets.flatMap(n=>n.children.filter(c=>c.type==='COMPONENT')).map(n=>[n.id,n])).values()];
  }
  if (!roots.length) throw new Error('请先选择需要处理的图层');
  if (roots.length>limit) throw new Error(`本次有 ${roots.length} 个对象，单次上限 ${limit} 个，请缩小选区后重试。普通功能仍可使用`);
  const context=[], stamps=[];let total=0;
  const paged=msg.paged===true||roots.length>20;
  for(let i=0;i<roots.length;i++) {
    if(layerCancelled.has(msg.requestId))throw new Error('已取消');
    const root=roots[i],target=layerSummary(root);total++;stamps.push(layerHash(target));
    if(consolidate){const set=sourceSets.find(s=>s.id===root.parent?.id);target.sourceSetId=set?.id;target.buildParentId=sourceSets[0].parentId;}
    if(msg.purpose==='duplicate')target.side=sides.get(root.id);
    context.push(target);
    if(i%8===0||i===roots.length-1){layerSend({type:'layer-ai-progress',requestId:msg.requestId,done:i+1,total:roots.length,layers:total});await new Promise(r=>setTimeout(r,0));}
  }
  const token=msg.requestId;
  layerSnapshots.set(token,{roots:roots.map(n=>n.id),page:layerPage().id,stamps,purpose:msg.purpose,sides,destinations,sourceSets,consolidate,buildParentId:sourceSets[0]?.parentId});
  while(layerSnapshots.size>8)layerSnapshots.delete(layerSnapshots.keys().next().value);
  if(!paged&&msg.images){const records=await layerChunk({token,offset:0,limit:20,images:true,requestId:msg.requestId});return {token,targets:records.targets,totalLayers:total,destinations,sourceSets,consolidate,paged:false};}
  return {token,targets:context,totalLayers:total,destinations,sourceSets,consolidate,paged};
}
async function layerChunk(msg) {
  const snapshot=layerSnapshots.get(msg.token);
  if(!snapshot||snapshot.page!==layerPage().id)throw new Error('读取记录已失效，请重新分析');
  const offset=Math.max(0,Number(msg.offset)||0),limit=Math.min(20,Math.max(1,Number(msg.limit)||8));
  const targets=[];let bytesUsed=0,imageBytes=0;
  for(let i=offset;i<Math.min(offset+limit,snapshot.roots.length);i++) {
    if(layerCancelled.has(msg.requestId))throw new Error('已取消');
    const root=await layerGet(snapshot.roots[i]);
    if(!root||root.removed)throw new Error('图层已删除，请重新分析');
    const record=layerSummary(root);
    if(layerHash(record)!==snapshot.stamps[i])throw new Error('图层在分析后发生变化，请重新读取');
    const length=JSON.stringify(record).length;
    if(length>1500000)throw new Error(`“${root.name}”单个图层树数据过大，请拆分此 Frame 后重试`);
    if(targets.length&&bytesUsed+length>1500000)break;
    bytesUsed+=length;record.parentId=root.parent?.id;
    if(snapshot.consolidate){record.sourceSetId=snapshot.sourceSets.find(s=>s.id===root.parent?.id)?.id;record.buildParentId=snapshot.buildParentId;}
    if(snapshot.purpose==='duplicate')record.side=snapshot.sides.get(root.id);
    if(msg.images){try{const bytes=await root.exportAsync({format:'PNG',constraint:{type:'SCALE',value:Math.min(1,384/Math.max(root.width,root.height,1))}});if(bytes.length>600000)throw new Error('预览图片过大');if(targets.length&&imageBytes+bytes.length>6*1024*1024)break;imageBytes+=bytes.length;record.image='data:image/png;base64,'+layerBase64(bytes);}catch(error){record.imageError=String(error.message||error);}}
    targets.push(record);await new Promise(r=>setTimeout(r,0));
    layerSend({type:'layer-ai-progress',requestId:msg.requestId,done:i+1,total:snapshot.roots.length,layers:0});
  }
  return {targets,nextOffset:offset+targets.length};
}

async function layerResolveSnapshot(token,purpose) {
  const snapshot=layerSnapshots.get(token);
  if (!snapshot || snapshot.purpose!==purpose || snapshot.page!==layerPage().id) throw new Error('读取记录已失效，请重新分析');
  const roots=await Promise.all(snapshot.roots.map(layerGet));
  for(let i=0;i<roots.length;i++){if(!roots[i]||roots[i].removed||layerHash(layerSummary(roots[i]))!==snapshot.stamps[i])throw new Error('图层在分析后发生变化，请重新读取，避免套用旧方案');if(i%8===0)await new Promise(r=>setTimeout(r,0));}
  if(snapshot.page!==layerPage().id)throw new Error('当前页面已变化，请重新分析');
  return roots;
}
function layerValidatePlan(plan,frames) {
  if (!Array.isArray(plan?.groups)||!plan.groups.length||plan.groups.length>frames.length) throw new Error('AI 未返回有效构建分组');
  const byId=new Map(frames.map(n=>[n.id,n])), used=new Set();
  for (const frame of frames) for (let parent=frame.parent;parent&&parent.type!=='PAGE';parent=parent.parent) if(byId.has(parent.id)) throw new Error('所选 Frame 存在父子嵌套，请只选择需要构建的独立 Frame');
  for (const group of plan.groups) {
    if (!layerClean(group.name) || !Array.isArray(group.variants)||!group.variants.length) throw new Error('构建分组缺少名称或 Frame');
    let keys=null; const tuples=new Set();
    for (const variant of group.variants) {
      if (!byId.has(variant.id)||used.has(variant.id)) throw new Error('AI 返回了未知或重复的 Frame');
      used.add(variant.id);
      if ((group.variants.length>1 || group.kind==='set') && group.kind!=='single') {
        const entries=Object.entries(variant.values||{});
        if (!entries.length || entries.length>12 || entries.some(([k,v])=>!layerClean(k)||!layerClean(v))) throw new Error('变体属性和值不能为空');
        const current=entries.map(([k])=>layerClean(k)).sort().join('|');
        if (keys!==null && keys!==current) throw new Error('同组变体的属性不一致，请重新分析'); keys=current;
        const tuple=entries.map(([k,v])=>[layerClean(k),layerClean(v)]).sort().map(p=>p.join('=')).join(',');
        if (tuples.has(tuple)) throw new Error('AI 给出了重复的变体组合，请重新分析'); tuples.add(tuple);
      }
    }
    const groupFrames=group.variants.map(v=>byId.get(v.id));
    if (!group.destinationId && groupFrames.length>1 && groupFrames.some(n=>n.parent!==groupFrames[0].parent)) throw new Error('同组 Frame 必须位于同一父级');
    const propertyNames=new Set(),propertyBindings=new Set();
    if(!Array.isArray(group.properties||[]))throw new Error('属性列表无效');
    for (const property of group.properties||[]) {
      if (!['TEXT','BOOLEAN','INSTANCE_SWAP','SLOT'].includes(property.type)||!layerClean(property.name)) throw new Error('AI 属性类型或名称无效');
      const propertyKey=layerClean(property.name).toLowerCase();if(propertyNames.has(propertyKey))throw new Error('AI 返回了重复的属性名');propertyNames.add(propertyKey);
      if (!Array.isArray(property.bindings)||!property.bindings.length) throw new Error('AI 属性缺少图层绑定');
      for (const binding of property.bindings) {
        if (!group.variants.some(v=>v.id===binding.frameId)) throw new Error('属性绑定不属于当前分组');
        const bindingKey=binding.frameId+'|'+JSON.stringify(binding.path)+'|'+property.type; if(propertyBindings.has(bindingKey))throw new Error('同一图层字段被重复绑定');propertyBindings.add(bindingKey);
        const n=layerAt(byId.get(binding.frameId),binding.path);
        if (!binding.path.length) throw new Error('属性必须绑定内部图层');
        if (property.type==='TEXT'&&n.type!=='TEXT'||property.type==='INSTANCE_SWAP'&&n.type!=='INSTANCE'||property.type==='SLOT'&&!['FRAME','SLOT'].includes(n.type)) throw new Error('AI 属性与目标图层类型不匹配');
      }
    }
  }
  if (used.size!==frames.length) throw new Error('AI 方案未覆盖全部 Frame，请重新分析');
}
async function layerConsolidate(plan,roots,snapshot) {
  if(plan.groups?.some(g=>g.destinationId))throw new Error('整合副本不能写入原有组件集');
  const parent=await layerGet(snapshot.buildParentId),sourcePage=layerPage();
  if(!parent||parent.removed||typeof parent.appendChild!=='function')throw new Error('整合目标容器已失效，请重新分析');
  for(const saved of snapshot.sourceSets){const set=await layerGet(saved.id);
    if(!set||set.removed||set.type!=='COMPONENT_SET'||set.parent?.id!==saved.parentId||set.name!==saved.name||JSON.stringify(set.children.filter(n=>n.type==='COMPONENT').map(n=>({...layerSummary(n),values:layerVariantValues(n)})))!==JSON.stringify(saved.variants))throw new Error('原组件集在分析后发生变化，请重新分析');
  }
  const copies=[],sourceIds=new Map(),appearance=new Map(),originalSelection=[...sourcePage.selection];let result;
  try {
    if(sourcePage.id!==snapshot.page||layerPage().id!==snapshot.page)throw new Error('当前页面已变化，请重新分析');
    for(const root of roots){appearance.set(root.id,layerHash(layerAppearance(root)));const copy=root.clone();copies.push(copy);parent.appendChild(copy);layerAssertAppearance(appearance.get(root.id),copy,root.name);sourceIds.set(root.id,copy.id);}
    const mapped={...plan,groups:plan.groups.map(g=>({...g,variants:g.variants.map(v=>({...v,id:sourceIds.get(v.id)||v.id}))}))};
    result=await layerConstruct(mapped,copies,undefined,[],false);
    for(const root of roots)layerAssertAppearance(appearance.get(root.id),root,root.name);
    // Keep output away from the source sets without altering their layout or names.
    const sets=await Promise.all(snapshot.sourceSets.map(s=>layerGet(s.id))),edge=Math.max(...sets.map(n=>n.x+n.width))+64;
    let y=Math.min(...sets.map(n=>n.y));
    const owners=await Promise.all([...new Set(result.mapping.map(m=>m.ownerId))].map(layerGet));
    for(const owner of owners){owner.x=edge;owner.y=y;y+=owner.height+48;}
    const reverse=new Map([...sourceIds].map(([id,copyId])=>[copyId,id]));
    for(const mapping of result.mapping)layerAssertAppearance(appearance.get(reverse.get(mapping.id)),await layerGet(mapping.newId),reverse.get(mapping.id));
    try{layerHost.viewport.scrollAndZoomIntoView(owners)}catch(_){}
    try{layerHost.commitUndo()}catch(_){}
    return {...result,mapping:result.mapping.map(m=>({...m,id:reverse.get(m.id)})),message:`已创建 ${result.created} 组整合副本，包含 ${roots.length} 个原有变体；原组件集与已有实例关联保留${result.warnings.length?'；'+result.warnings.join('；'):''}`};
  }catch(error){
    if(result)for(const id of new Set(result.mapping.map(m=>m.ownerId)))try{const owner=await layerGet(id);if(owner&&!owner.removed)owner.remove()}catch(_){}
    for(const copy of copies)try{if(!copy.removed)copy.remove()}catch(_){}
    try{sourcePage.selection=originalSelection.filter(n=>!n.removed)}catch(_){}
    throw error;
  }
}
async function layerConstruct(plan,frames,manual,destinations=[],finish=true) {
  const unavailable=destinations.filter(d=>d.appendSupported===false),warnings=[];
  if(unavailable.length)plan={...plan,groups:plan.groups.flatMap(g=>{
    if(!unavailable.some(d=>d.id===g.destinationId))return [g];
    warnings.push(`${g.name}：当前宿主未开放直接补入接口，${g.variants.length} 个对象已保留为独立组件；已有组件集未改动`);
    return g.variants.map(v=>({name:frames.find(n=>n.id===v.id)?.name||g.name,variants:[{id:v.id,values:{}}],properties:[]}));
  })};
  layerValidatePlan(plan,frames);
  if(!manual&&plan.groups.some(g=>g.kind))throw new Error('AI 只能按原对象创建变体，不能重组内部内容');
  if (frames.some(n=>{try{return n.attachedConnectors?.length>0}catch(_){return false}})) throw new Error('选中 Frame 连接了连线，请先移除连接后构建');
  const sourcePage=layerPage();
  const byId=new Map(frames.map(n=>[n.id,n])), trash=[], targets=[],mapping=[],moved=[];
  const owners=new Map();
  for(const group of plan.groups.filter(g=>g.destinationId)) {
    const known=destinations.find(d=>d.id===group.destinationId),owner=known&&await layerGet(known.id);
    if(!owner||owner.removed||owner.type!=='COMPONENT_SET'||owner.parent?.id!==known.parentId)throw new Error('目标组件集已变化，请重新分析');
    const actual=owner.children.filter(n=>n.type==='COMPONENT');
    if(JSON.stringify(actual.map(n=>({...layerSummary(n),values:layerVariantValues(n)})))!==JSON.stringify(known.variants))throw new Error('目标组件集的变体已变化，请重新分析');
    if(group.variants.some(v=>byId.get(v.id).parent!==owner.parent))throw new Error('待补入对象须与目标组件集位于同一父级');
    if(!owners.has(owner.id))owners.set(owner.id,{owner,children:[...owner.children],width:owner.width,height:owner.height,appearance:new Map(actual.map(n=>[n.id,layerHash(layerAppearance(n))])),tuples:new Set(actual.map(n=>JSON.stringify(Object.entries(layerVariantValues(n)).sort()))),keys:Object.keys(layerVariantValues(actual[0]||{})).sort().join('|')});
    const state=owners.get(owner.id);
    for(const v of group.variants){const values=Object.fromEntries(Object.entries(v.values||{}).map(([k,x])=>[layerClean(k),layerClean(x)]));if(Object.keys(values).sort().join('|')!==state.keys)throw new Error('补入变体的属性必须与已有组件集一致');const tuple=JSON.stringify(Object.entries(values).sort());if(state.tuples.has(tuple))throw new Error('补入变体与已有属性组合重复，请核对方案');state.tuples.add(tuple);}
    if(group.properties?.length)throw new Error('补入组件集时不能改动已有内容属性');
  }
  const sourceAppearance=new Map();
  for(let i=0;i<frames.length;i++){sourceAppearance.set(frames[i].id,layerHash(layerAppearance(frames[i])));if(i%8===0)await new Promise(r=>setTimeout(r,0));}
  try {
    for (const group of plan.groups) {
      const originals=group.variants.map(v=>byId.get(v.id));
      const parent=originals[0].parent; // Capture before conversion invalidates the Frame handle.
      const index=parent.children.indexOf(originals[0]);
      const appearances=originals.map(n=>sourceAppearance.get(n.id));
      const clones=originals.map(frame=>{const clone=frame.clone();trash.push(clone);return clone;});
      const convert=frame=>frame.type==='COMPONENT'?frame:layerPlatform==='figma'?layerHost.createComponentFromNode(frame):transferFrameToComponent(frame,frame.name,warnings);
      let components, owner;
      if (group.kind==='single'&&clones.length>1) { owner=wrapFramesAsOneComponent(clones,group.name);trash.push(owner);components=[owner]; }
      else {
        components=clones.map((clone,i)=>{const c=convert(clone);trash.push(c);const v=group.variants[i];c.name=(originals.length>1||group.kind==='set'||group.destinationId)?Object.entries(v.values).map(([k,val])=>`${layerClean(k)}=${layerClean(val)}`).join(', '):group.name;return c;});
        owner=group.destinationId?owners.get(group.destinationId).owner:(components.length>1||group.kind==='set')?(layerPlatform==='figma'?layerHost.combineAsVariants(components,parent):layerHost.combineAsVariants(components)):components[0];
        if(!group.destinationId)trash.push(owner);
      }
      if(group.destinationId) {
        const state=owners.get(group.destinationId),bottom=Math.max(0,...owner.children.map(n=>n.y+n.height));
        components.forEach((n,i)=>{owner.appendChild(n);n.x=24+i*(Math.max(...components.map(c=>c.width))+24);n.y=bottom+24;});
        // Preserve existing constraints and layout. Figma can grow the set without scaling children.
        if(typeof owner.resizeWithoutConstraints==='function')owner.resizeWithoutConstraints(Math.max(owner.width,...components.map(n=>n.x+n.width+24)),Math.max(owner.height,...components.map(n=>n.y+n.height+24)));
        for(const n of state.children)if(state.appearance.has(n.id))layerAssertAppearance(state.appearance.get(n.id),n,n.name);
      } else {
      owner.name=String(group.name).trim().slice(0,120); parent.insertChild(index,owner);
      if (owner.type==='COMPONENT_SET') {
        const columns=Math.ceil(Math.sqrt(components.length)), w=Math.max(...components.map(n=>n.width)),h=Math.max(...components.map(n=>n.height));
        owner[layerPlatform==='figma'?'layoutMode':'flexMode']='NONE';components.forEach((n,i)=>{n.x=24+(i%columns)*(w+24);n.y=24+Math.floor(i/columns)*(h+24);});owner.resize(48+columns*w+(columns-1)*24,48+Math.ceil(components.length/columns)*h+(Math.ceil(components.length/columns)-1)*24);
      }
      }
      if(!group.destinationId)layerApplyVariantValues(owner,components,group.variants);
      const contentRoots=group.kind==='single'&&originals.length>1?[...owner.children]:components;
      const mapped=new Map(group.variants.map((v,i)=>[v.id,contentRoots[i]]));
      let properties=group.properties||[];
      if(manual) {
        const candidates=new Map();
        for(const variant of group.variants)for(const record of layerRead(mapped.get(variant.id)).layers){
          const type=record.type==='TEXT'&&manual.exposeText?'TEXT':record.type==='INSTANCE'&&manual.exposeInstances?'INSTANCE_SWAP':null;
          if(!type||!record.path.length)continue;
          // Keep each source path independent; don't unify unlike text/instance defaults.
          const key=type+':'+record.path.join('.')+':'+record.name;
          const property=candidates.get(key)||{name:record.name||type,type,bindings:[]};property.bindings.push({frameId:variant.id,path:record.path});candidates.set(key,property);
        }
        properties=[...candidates.values()];
      }
      for (const property of properties) {
        const nodes=property.bindings.map(b=>layerAt(mapped.get(b.frameId),b.path));
        const first=nodes[0];
        // A shared default can overwrite instance overrides, text or visibility.
        // Native swap/slot exposure is advisory until a host can preserve all overrides.
        if(['INSTANCE_SWAP','SLOT'].includes(property.type)){warnings.push(`${property.name}：保留为属性建议，未替换原实例或内容`);continue;}
        const values=nodes.map(n=>property.type==='TEXT'?n.characters:(n.visible??n.isVisible));
        if(values.some(value=>value!==values[0])){warnings.push(`${property.name}：各变体默认值不同，保留原内容，未合并绑定`);continue;}
        if (typeof owner.addComponentProperty!=='function') { warnings.push(`${property.name}：宿主未提供原生属性 API`);continue; }
        const value=property.type==='TEXT'?first.characters:(first.visible??first.isVisible);
        const key=property.type==='TEXT'?'characters':layerPlatform==='figma'?'visible':'isVisible';
        let id;
        try {
          id=owner.addComponentProperty(layerClean(property.name),property.type,value);
          nodes.forEach(n=>{n.componentPropertyReferences={...(n.componentPropertyReferences||{}),[key]:id};});
        } catch(error) {
          // An unsupported property must not leave a half-bound definition.
          for (const n of nodes) {try {const refs={...n.componentPropertyReferences};delete refs[key];n.componentPropertyReferences=refs;}catch(_){}}
          if(id)try{owner.deleteComponentProperty(id)}catch(_){}
          warnings.push(`${property.name} (${property.type})：未创建，${String(error.message||error)}`);
        }
      }
      contentRoots.forEach((component,i)=>layerAssertAppearance(appearances[i],component,originals[i].name));
      if(!targets.includes(owner))targets.push(owner);
      group.variants.forEach((v,i)=>mapping.push({id:v.id,newId:contentRoots[i].id,ownerId:owner.id}));
      await new Promise(r=>setTimeout(r,0));
    }
    // Commit only after every group exists. Failures above leave original Frames intact.
    if(layerPage().id!==sourcePage.id)throw new Error('构建期间页面已切换，已保留原 Frame，请返回原页重试');
    frames.forEach(frame=>layerAssertAppearance(sourceAppearance.get(frame.id),frame,frame.name));
    // Reuse existing component IDs so instances continue to reference their masters.
    // MasterGo exposes combineAsVariants but not insertChild on component sets.
    // Recombine a newly created draft with the real standalone masters at commit.
    const committedComponents=new Set();
    for(let ti=0;ti<targets.length;ti++) {
      const draftOwner=targets[ti];if(draftOwner.type!=='COMPONENT_SET'||typeof draftOwner.insertChild==='function')continue;
      const members=mapping.filter(m=>m.ownerId===draftOwner.id),originalComponents=members.filter(m=>byId.get(m.id).type==='COMPONENT');
      if(!originalComponents.length)continue;
      const ownerName=draftOwner.name,ownerParent=draftOwner.parent,ownerIndex=ownerParent.children.indexOf(draftOwner),ownerX=draftOwner.x,ownerY=draftOwner.y;
      const entries=[];
      for(const map of members){const draft=await layerGet(map.newId),source=byId.get(map.id);let node=draft;
        if(source.type==='COMPONENT'){moved.push({node:source,parent:source.parent,index:source.parent.children.indexOf(source),name:source.name,x:source.x,y:source.y,width:source.width,height:source.height});source.name=draft.name;node=source;}
        entries.push({map,draft,node,x:draft.x,y:draft.y});
      }
      const owner=layerHost.combineAsVariants(entries.map(e=>e.node));trash.push(owner);ownerParent.insertChild(ownerIndex,owner);owner.name=ownerName;owner.flexMode='NONE';owner.x=ownerX;owner.y=ownerY;
      for(const entry of entries){entry.node.x=entry.x;entry.node.y=entry.y;layerAssertAppearance(sourceAppearance.get(entry.map.id),entry.node,entry.node.name);if(entry.node!==entry.draft){committedComponents.add(entry.node.id);entry.map.newId=entry.node.id;}entry.map.ownerId=owner.id;}
      layerApplyVariantValues(owner,entries.map(e=>e.node),entries.map(e=>plan.groups.flatMap(g=>g.variants).find(v=>v.id===e.map.id)));
      if(typeof owner.resizeToFit==='function')owner.resizeToFit();
      for(const entry of entries)layerAssertAppearance(sourceAppearance.get(entry.map.id),entry.node,entry.node.name);
      targets[ti]=owner;if(!draftOwner.removed)draftOwner.remove();
    }
    for(const original of frames.filter(n=>n.type==='COMPONENT'&&!committedComponents.has(n.id))) {
      const map=mapping.find(m=>m.id===original.id),draft=await layerGet(map.newId);
      const previous={node:original,parent:original.parent,index:original.parent.children.indexOf(original),name:original.name,x:original.x,y:original.y,width:original.width,height:original.height};moved.push(previous);
      const targetParent=draft.parent,at=targetParent.children.indexOf(draft),draftId=draft.id;
      targetParent.insertChild(at,original);original.name=draft.name;original.x=draft.x;original.y=draft.y;
      layerAssertAppearance(sourceAppearance.get(original.id),original,previous.name);
      const ownerIndex=targets.indexOf(draft);if(ownerIndex>=0)targets[ownerIndex]=original;
      map.newId=original.id;if(map.ownerId===draftId)map.ownerId=original.id;
      draft.remove();
    }
    frames.filter(frame=>frame.type!=='COMPONENT').forEach(frame=>frame.remove());
  } catch(error) {
    for(const previous of moved.reverse())try{previous.parent.insertChild(previous.index,previous.node);previous.node.name=previous.name;previous.node.x=previous.x;previous.node.y=previous.y;if(previous.node.width!==previous.width||previous.node.height!==previous.height)previous.node.resize(previous.width,previous.height);}catch(_){}
    for(const node of trash.reverse())try{if(!node.removed)node.remove()}catch(_){}
    for(const {owner,width,height} of owners.values())try{if(typeof owner.resizeWithoutConstraints==='function')owner.resizeWithoutConstraints(width,height)}catch(_){}
    throw error;
  }
  sourcePage.selection=targets;
  if(finish){try{layerHost.viewport.scrollAndZoomIntoView(targets)}catch(_){}try{layerHost.commitUndo()}catch(_){}}
  return {created:targets.length,mapping,warnings,message:`已构建 ${targets.length} 组组件${warnings.length?'；'+warnings.slice(0,12).join('；')+(warnings.length>12?`；另有 ${warnings.length-12} 项属性建议未自动应用`:''):''}`};
}
async function layerBuildManual(msg) {
  if(layerBusy){layerSend({type:'component-builder-result',ok:false,message:'正在构建，请稍候'});return;}
  layerBusy=true;
  try {
    const frames=[...layerPage().selection];
    if(!frames.length||frames.some(n=>n.type!=='FRAME'))throw new Error('请选择一个或多个 Frame');
    const mode=['single','set'].includes(msg.mode)?msg.mode:'multiple', name=String(msg.componentName||'').trim();
    const groups=mode==='multiple'?frames.map(n=>({name:name?(frames.length===1?name:`${name}/${n.name}`):n.name,variants:[{id:n.id}]})):
      [{name:name||commonNamePrefix(frames.map(n=>n.name)),kind:mode,variants:frames.map((n,i)=>({id:n.id,values:{[layerClean(msg.variantProperty)||'Variant']:`${layerClean(n.name)} ${i+1}`}}))}];
    layerSend({type:'component-builder-result',ok:true,...await layerConstruct({groups},frames,msg)});
  }catch(error){layerSend({type:'component-builder-result',ok:false,message:`创建失败，原 Frame 已保留：${String(error.message||error)}`});}
  finally{layerBusy=false;}
}
async function handleLayerToolsMessage(msg) {
  if(msg.type==='layer-job-state'){if(layerPlatform==='mastergo')try{layerHost.ui.setCloseConfirm({enabled:!!msg.busy,message:'AI 分析尚未完成，关闭插件将中断当前任务。'})}catch(_){}return true;}
  if(msg.type==='layer-ai-cancel'){layerCancelled.add(msg.requestId);if(layerCancelled.size>100)layerCancelled.delete(layerCancelled.values().next().value);return true;}
  if(!['layer-ai-read','layer-ai-chunk','layer-ai-rename','layer-ai-build','layer-ai-references','layer-focus','layer-matrix'].includes(msg.type))return false;
  const reply={type:'layer-ai-response',requestId:msg.requestId};
  try {
    if(msg.type==='layer-focus') {
      const node=await layerGet(msg.id);if(!node||node.removed)throw new Error('图层已删除');
      let page=node;while(page&&page.type!=='PAGE')page=page.parent;
      if(page?.id!==layerPage().id)throw new Error('请返回该图层所在页面后定位');
      layerPage().selection=[node];layerHost.viewport.scrollAndZoomIntoView([node]);layerSend({...reply,ok:true});
    }else if(msg.type==='layer-ai-references') {
      const snapshot=layerSnapshots.get(msg.token);if(!snapshot||snapshot.page!==layerPage().id)throw new Error('读取记录已失效');
      const targets=[];
      // Representative screenshots anchor existing sets; exact property values for every variant remain in metadata.
      for(const set of snapshot.destinations)for(const item of set.variants.filter((_,i)=>i%Math.max(1,Math.ceil(set.variants.length/4))===0).slice(0,4)) {
        if(targets.length>=20)break;
        const root=await layerGet(item.id);if(!root||root.removed)throw new Error('参考组件已删除');
        const bytes=await root.exportAsync({format:'PNG',constraint:{type:'SCALE',value:Math.min(1,384/Math.max(root.width,root.height,1))}});
        if(bytes.length<=600000)targets.push({...item,referenceOnly:true,destinationId:set.id,image:'data:image/png;base64,'+layerBase64(bytes)});
      }
      layerSend({...reply,ok:true,targets});
    }else if(msg.type==='layer-ai-read') layerSend({...reply,ok:true,context:await layerSnapshot(msg)});
    else if(msg.type==='layer-ai-chunk')layerSend({...reply,ok:true,...await layerChunk(msg)});
    else if(msg.type==='layer-ai-rename') {
      const roots=await layerResolveSnapshot(msg.token,msg.purpose), allowed=new Map(roots.map(n=>[n.id,n]));
      const names=msg.names;
      if(!Array.isArray(names)||names.length>800||new Set(names.map(n=>n.id)).size!==names.length||names.some(n=>!allowed.has(n.id)||!String(n.name||'').trim())) throw new Error('命名结果无效，请重新分析');
      const previous=names.map(n=>({node:allowed.get(n.id),name:allowed.get(n.id).name}));
      try{names.forEach(n=>{allowed.get(n.id).name=String(n.name).trim().slice(0,180);});}catch(error){previous.forEach(n=>{try{n.node.name=n.name}catch(_){}});throw error;}
      const snapshot=layerSnapshots.get(msg.token);snapshot.stamps=roots.map(n=>layerHash(layerSummary(n)));
      try{layerHost.commitUndo()}catch(_){}
      try{layerHost.notify(`已命名 ${names.length} 个图层`)}catch(_){}
      layerSend({...reply,ok:true,message:`已命名 ${names.length} 个图层`});
    }else if(msg.type==='layer-ai-build') {
      if(layerBusy)throw new Error('正在构建，请稍候');layerBusy=true;
      try{const frames=await layerResolveSnapshot(msg.token,'build'),snapshot=layerSnapshots.get(msg.token);const result=snapshot.consolidate?await layerConsolidate(msg.plan,frames,snapshot):await layerConstruct(msg.plan,frames,undefined,snapshot.destinations);layerSnapshots.delete(msg.token);layerSend({...reply,ok:true,...result});}finally{layerBusy=false;}
    }else if(msg.type==='layer-matrix') {
      const selection=[...layerPage().selection];
      const sets=selection.flatMap(n=>n.type==='COMPONENT_SET'?[n]:n.type==='FRAME'&&n.getPluginData('isShowcaseBoard')==='true'?LayerRules.walk(n.children).filter(c=>c.type==='COMPONENT_SET'):[]);
      if(!sets.length)throw new Error('请选择组件集');
      const plans=sets.map(set=>({set,layout:LayerRules.matrix(set.children.filter(n=>n.type==='COMPONENT'),msg)}));
      plans.forEach(({set,layout})=>{set[layerPlatform==='figma'?'layoutMode':'flexMode']='NONE';layout.placements.forEach(p=>{p.node.x=p.x;p.node.y=p.y;});set.resize(layout.width,layout.height);});
      try{layerHost.commitUndo()}catch(_){}layerSend({...reply,ok:true,message:`已排列 ${plans.length} 个组件集；剩余属性自动分组`});
    }
  }catch(error){layerSend({...reply,ok:false,message:String(error.message||error)});}
  return true;
}
