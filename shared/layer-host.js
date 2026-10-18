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
    const nodes = [...layerPage().selection], valid = nodes.filter(n => ['FRAME','RECTANGLE'].includes(n.type));
    if (!layerSearchWriting && layerIds(nodes) !== layerResultIds) { layerSeed=nodes; layerSeedPage=layerPage().id; }
    layerSend({ type:'size-assistant-selection', validCount:valid.length, invalidCount:nodes.length-valid.length, width:valid.length===1?valid[0].width:0, height:valid.length===1?valid[0].height:0 });
  });
}
function layerRead(root) {
  const layers=[], stack=[{node:root,path:[]}];
  while (stack.length) {
    const {node,path}=stack.pop();
    if (layers.length >= 5000) throw new Error('图层树超过 5,000 层，请拆分后分析；本次未截断读取');
    const record={id:node.id,path,name:node.name,type:node.type,width:node.width,height:node.height,visible:node.visible ?? node.isVisible,locked:node.locked ?? node.isLocked};
    for (const key of ['x','y','opacity','characters','layoutMode','itemSpacing','cornerRadius','fills','strokes','effects','componentPropertyReferences','componentProperties','componentPropertyDefinitions','vectorPaths','fontName','fontSize','flexMode']) {
      try { const value=node[key]; if (value!==undefined && typeof value!=='symbol') record[key]=value; } catch (_) {}
    }
    try { if (node.type==='INSTANCE') record.mainComponentId=node.mainComponent?.id || node.componentId; } catch (_) {}
    layers.push(record);
    if ('children' in node) for (let i=node.children.length-1;i>=0;i--) stack.push({node:node.children[i],path:[...path,i]});
  }
  return {id:root.id,name:root.name,type:root.type,layers};
}
function layerStamp(roots) { return JSON.stringify(roots.map(layerRead)); }
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
async function layerSnapshot(msg) {
  const selected=[...layerPage().selection];
  let roots=selected, limit=50; const sides=new Map();
  if (msg.purpose==='build') { limit=30; if (roots.some(n=>n.type!=='FRAME')) throw new Error('请选择 Frame，再分析组件结构'); }
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
    for (const parent of selected) for (const node of LayerRules.walk(parent.children)) {
      if ((node.visible ?? node.isVisible)===false || node.width<=0 || node.height<=0 || !node.exportAsync) continue;
      const tokens=String(node.name).toLowerCase().split(/[\s/_\-]+/).filter(t=>!excluded.has(t)&&!(excluded.has('number')&&/^\d+$/.test(t)));
      if (tokens.length) { roots.push(node); sides.set(node.id,selected.indexOf(parent)); if(roots.length>60)throw new Error('可比较图层超过 60 个，请缩小两个容器的范围后重试，或使用普通名称查重'); }
    }
    limit=60;
  }
  if (!roots.length) throw new Error('请先选择需要处理的图层');
  if (roots.length>limit) throw new Error(`本次有 ${roots.length} 个对象，单次上限 ${limit} 个，请缩小选区后重试。普通功能仍可使用`);
  const context=[]; let total=0,imageBytes=0;
  for (let i=0;i<roots.length;i++) {
    if (layerCancelled.has(msg.requestId)) throw new Error('已取消');
    const root=roots[i], record=layerRead(root); total+=record.layers.length;
    if (total>5000) throw new Error('总图层数超过 5,000，请拆分选区后分析');
    if (msg.purpose==='duplicate') record.side=sides.get(root.id);
    if (msg.images===true) {
      try {
        const bytes=await root.exportAsync({format:'PNG',constraint:{type:'SCALE',value:Math.min(1,384/Math.max(root.width,root.height,1))}});
        if (bytes.length>600000) throw new Error('预览图片过大');
        imageBytes+=bytes.length;record.image='data:image/png;base64,'+layerBase64(bytes);
      } catch (error) { record.imageError=String(error.message||error); }
    }
    if(imageBytes>6*1024*1024)throw new Error('图片总量超过 6 MB，请缩小选区后重试');
    context.push(record);
    layerSend({type:'layer-ai-progress',requestId:msg.requestId,done:i+1,total:roots.length,layers:total});
    await new Promise(resolve=>setTimeout(resolve,0));
  }
  const token=msg.requestId;
  if(layerStamp(roots).length>1500000)throw new Error('图层数据超过 1.5 MB，请缩小选区后重试');
  layerSnapshots.set(token,{roots:roots.map(n=>n.id),page:layerPage().id,stamp:layerStamp(roots),purpose:msg.purpose});
  while (layerSnapshots.size>8) layerSnapshots.delete(layerSnapshots.keys().next().value);
  return {token,targets:context,totalLayers:total};
}
async function layerResolveSnapshot(token,purpose) {
  const snapshot=layerSnapshots.get(token);
  if (!snapshot || snapshot.purpose!==purpose || snapshot.page!==layerPage().id) throw new Error('读取记录已失效，请重新分析');
  const roots=await Promise.all(snapshot.roots.map(layerGet));
  if (roots.some(n=>!n||n.removed) || layerStamp(roots)!==snapshot.stamp) throw new Error('图层在分析后发生变化，请重新读取，避免套用旧方案');
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
    if (groupFrames.length>1 && groupFrames.some(n=>n.parent!==groupFrames[0].parent)) throw new Error('同组 Frame 必须位于同一父级');
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
async function layerConstruct(plan,frames,manual) {
  layerValidatePlan(plan,frames);
  if (frames.some(n=>{try{return n.attachedConnectors?.length>0}catch(_){return false}})) throw new Error('选中 Frame 连接了连线，请先移除连接后构建');
  const byId=new Map(frames.map(n=>[n.id,n])), trash=[], targets=[], warnings=[];
  try {
    for (const group of plan.groups) {
      const originals=group.variants.map(v=>byId.get(v.id));
      const parent=originals[0].parent; // Capture before conversion invalidates the Frame handle.
      const index=parent.children.indexOf(originals[0]);
      const clones=originals.map(frame=>{const clone=frame.clone();trash.push(clone);return clone;});
      const convert=frame=>layerPlatform==='figma'?layerHost.createComponentFromNode(frame):transferFrameToComponent(frame,frame.name,warnings);
      let components, owner;
      if (group.kind==='single'&&clones.length>1) { owner=wrapFramesAsOneComponent(clones,group.name);trash.push(owner);components=[owner]; }
      else {
        components=clones.map((clone,i)=>{const c=convert(clone);trash.push(c);const v=group.variants[i];c.name=(originals.length>1||group.kind==='set')?Object.entries(v.values).map(([k,val])=>`${layerClean(k)}=${layerClean(val)}`).join(', '):group.name;return c;});
        owner=(components.length>1||group.kind==='set')?(layerPlatform==='figma'?layerHost.combineAsVariants(components,parent):layerHost.combineAsVariants(components)):components[0];
        trash.push(owner);
      }
      owner.name=String(group.name).trim().slice(0,120); parent.insertChild(index,owner);
      if (owner.type==='COMPONENT_SET') {
        const columns=Math.ceil(Math.sqrt(components.length)), w=Math.max(...components.map(n=>n.width)),h=Math.max(...components.map(n=>n.height));
        owner[layerPlatform==='figma'?'layoutMode':'flexMode']='NONE';components.forEach((n,i)=>{n.x=24+(i%columns)*(w+24);n.y=24+Math.floor(i/columns)*(h+24);});owner.resize(48+columns*w+(columns-1)*24,48+Math.ceil(components.length/columns)*h+(Math.ceil(components.length/columns)-1)*24);
      }
      if (manual) {
        const exposed=layerPlatform==='figma'?await exposeBuilderProperties(owner,components,manual.exposeText,manual.exposeInstances)
          :owner.type==='COMPONENT_SET'?exposeBuilderPropertiesForSet(owner,manual.exposeText,manual.exposeInstances):exposeBuilderProperties(owner,manual.exposeText,manual.exposeInstances);
        warnings.push(...exposed.warnings);
      }
      const mapped=new Map(group.variants.map((v,i)=>[v.id,components[i]]));
      for (const property of group.properties||[]) {
        const nodes=property.bindings.map(b=>layerAt(mapped.get(b.frameId),b.path));
        const first=nodes[0];
        if (typeof owner.addComponentProperty!=='function') { warnings.push(`${property.name}：宿主未提供原生属性 API`);continue; }
        if (property.type==='SLOT' && layerPlatform!=='figma') {warnings.push(`${property.name}：当前宿主不支持原生 Slot，已保留容器`);continue;}
        let value=property.type==='TEXT'?first.characters:property.type==='BOOLEAN'?(first.visible ?? first.isVisible):property.type==='SLOT'?'':null;
        if (property.type==='INSTANCE_SWAP') { const main=first.getMainComponentAsync?await first.getMainComponentAsync():first.mainComponent; value=main?.id||first.componentId; if(!value)throw new Error('无法读取实例主组件'); }
        const key={TEXT:'characters',BOOLEAN:layerPlatform==='figma'?'visible':'isVisible',INSTANCE_SWAP:'mainComponent',SLOT:'slotContentId'}[property.type];
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
      targets.push(owner);
    }
    // Commit only after every group exists. Failures above leave original Frames intact.
    frames.forEach(frame=>frame.remove());
  } catch(error) {
    for(const node of trash.reverse())try{if(!node.removed)node.remove()}catch(_){}
    throw error;
  }
  layerPage().selection=targets;
  layerHost.viewport.scrollAndZoomIntoView(targets);
  try{layerHost.commitUndo()}catch(_){}
  return {created:targets.length,warnings,message:`已构建 ${targets.length} 组组件${warnings.length?'；'+warnings.join('；'):''}`};
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
  if(msg.type==='layer-ai-cancel'){layerCancelled.add(msg.requestId);if(layerCancelled.size>100)layerCancelled.delete(layerCancelled.values().next().value);return true;}
  if(!['layer-ai-read','layer-ai-rename','layer-ai-build','layer-matrix'].includes(msg.type))return false;
  const reply={type:'layer-ai-response',requestId:msg.requestId};
  try {
    if(msg.type==='layer-ai-read') layerSend({...reply,ok:true,context:await layerSnapshot(msg)});
    else if(msg.type==='layer-ai-rename') {
      const roots=await layerResolveSnapshot(msg.token,msg.purpose), allowed=new Map(roots.map(n=>[n.id,n]));
      const names=msg.names;
      if(!Array.isArray(names)||names.length>50||new Set(names.map(n=>n.id)).size!==names.length||names.some(n=>!allowed.has(n.id)||!String(n.name||'').trim())) throw new Error('命名结果无效，请重新分析');
      const previous=names.map(n=>({node:allowed.get(n.id),name:allowed.get(n.id).name}));
      try{names.forEach(n=>{allowed.get(n.id).name=String(n.name).trim().slice(0,180);});}catch(error){previous.forEach(n=>{try{n.node.name=n.name}catch(_){}});throw error;}
      layerSnapshots.delete(msg.token);try{layerHost.commitUndo()}catch(_){}
      layerSend({...reply,ok:true,message:`已命名 ${names.length} 个图层`});
    }else if(msg.type==='layer-ai-build') {
      if(layerBusy)throw new Error('正在构建，请稍候');layerBusy=true;
      try{const frames=await layerResolveSnapshot(msg.token,'build');const result=await layerConstruct(msg.plan,frames);layerSnapshots.delete(msg.token);layerSend({...reply,ok:true,...result});}finally{layerBusy=false;}
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
