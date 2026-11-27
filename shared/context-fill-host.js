/* Snapshot one frame locally. The model sees temporary field IDs; only this
 * host can resolve them to writable text layers. */
let contextFillSnapshot = null;
let contextFillApplying = false;
const contextFillLimit = 400;

function contextFillSelectedFrame() {
  const selection = layerPage().selection;
  return selection.length === 1 && ['FRAME','INSTANCE'].includes(selection[0].type) ? selection[0] : null;
}

function sendContextFillSelection() {
  const frame = contextFillSelectedFrame();
  layerSend({type:'context-fill-selection', frame:frame && {id:frame.id, name:frame.name, type:frame.type}});
}

function contextFillProtected(node) {
  for (let current = node; current && current.type !== 'PAGE'; current = current.parent) {
    if (current.removed || current.visible === false || current.isVisible === false || current.opacity === 0 ||
        current.locked || current.isLocked || current.type === 'COMPONENT' || current.type === 'COMPONENT_SET') return true;
  }
  const glyph=/^[\s\uE000-\uF8FF☐☑☒✓✔]+$/u.test(node.characters) && node.characters.trim();
  return Boolean(glyph || node.boundVariables?.characters ||
    (layerPlatform === 'mastergo' && typeof getNodeI18nBinding === 'function' && getNodeI18nBinding(node)));
}

function contextFillBinding(node, frame, instances) {
  let reference = node.componentPropertyReferences?.characters;
  const outer = frame.parent, path = [];
  for (let child=node, owner=node.parent; owner && owner.id !== outer?.id; child=owner, owner=owner.parent) {
    path.unshift(child);
    if (owner.type !== 'INSTANCE') continue;
    if (!instances.has(owner.id)) {
      let properties={};
      try { properties=owner.componentProperties || {}; } catch (_) {}
      // MasterGo's map for setProperties is keyed by property ID, even though
      // the instance getter returns an array of named records.
      const entries=Array.isArray(properties) ? properties.filter(p=>p.id).map(p=>[p.id,p]) : Object.entries(properties);
      let main;
      if (layerPlatform==='mastergo') { try { main=owner.mainComponent; } catch (_) {} }
      const definitions=[...(main?.componentPropertyValues||[]),...(main?.parent?.componentPropertyValues||[])];
      instances.set(owner.id,{properties:new Map(entries),main,definitions});
    }
    const {properties,main,definitions}=instances.get(owner.id);
    if (!reference && main) {
      // Some MasterGo instances expose the reference only on the matching
      // main-component layer. It is inspected solely to resolve the property ID.
      let original=main;
      for (const step of path) {
        original=original.children?.[step.parent.children.findIndex(n=>n.id===step.id)];
        if (!original || original.type!==step.type) { original=null;break; }
      }
      reference=original?.componentPropertyReferences?.characters;
    }
    if (!reference) return null;
    const property=properties.get(reference);
    if (property) {
      const blocked=property.type!=='TEXT' || typeof property.value!=='string' || property.value!==node.characters ||
        typeof owner.setProperties!=='function' || property.boundVariables?.value || property.variableId ||
        (Array.isArray(definitions) && definitions.some(p=>p.id===reference && p.variableId));
      return {owner,key:reference,blocked:!!blocked};
    }
  }
  return reference ? {blocked:true} : null;
}

function contextFillCollect(frame, l, live = new Map()) {
  const transform = frame.absoluteTransform;
  const origin = frame.absoluteBoundingBox || (transform && {x:transform[0][2],y:transform[1][2]}) || frame.absoluteRenderBounds;
  const groups = new Map();
  const targets = [], instances=new Map(), shared=new Map(), readOnly=[];
  let skipped = 0;
  function number(value) { return Number.isFinite(value) ? Math.round(value * 10) / 10 : null; }
  function box(node) {
    const bounds = node.absoluteBoundingBox;
    const transform = node.absoluteTransform;
    const x = bounds?.x ?? transform?.[0]?.[2], y = bounds?.y ?? transform?.[1]?.[2];
    if(origin && Number.isFinite(x) && Number.isFinite(y))return [number(x-origin.x),number(y-origin.y),number(bounds?.width??node.width),number(bounds?.height??node.height)];
    let left=0,top=0;
    for(let p=node;p&&p.id!==frame.id;p=p.parent){left+=p.x||0;top+=p.y||0;}
    return [number(left),number(top),number(node.width),number(node.height)];
  }
  function group(node) {
    if (!node || node.id === frame.id) return 'frame';
    if (groups.has(node.id)) return groups.get(node.id)[0];
    const parent = group(node.parent);
    const tag = 'g' + (groups.size + 1);
    groups.set(node.id, [tag, parent, String(node.name || '').slice(0,100), node.type, box(node), node.layoutMode || node.flexMode || null]);
    return tag;
  }
  let visited = 0;
  const stack = [...frame.children].reverse();
  while (stack.length) {
    const node = stack.pop();
    if (++visited > 12000) throw new Error(l('画板层级过大，请拆分后填充。','Split this frame into smaller sections to fill it.'));
    if (node.type !== 'TEXT') {
      if (node.children) for (let i = node.children.length - 1; i >= 0; i--) stack.push(node.children[i]);
      continue;
    }
    const binding=contextFillBinding(node,frame,instances);
    const key=binding?.owner ? JSON.stringify([binding.owner.id,binding.key]) : node.id;
    const protectedText=contextFillProtected(node) || node.hasMissingFont || binding?.blocked;
    if (protectedText) {
      skipped++;
      if (binding?.owner) shared.set(key,false);
      let visible=true;
      for(let p=node;p&&p.type!=='PAGE';p=p.parent)if(p.visible===false||p.isVisible===false||p.opacity===0){visible=false;break;}
      if (visible && readOnly.length<400)readOnly.push({name:String(node.name||'').slice(0,100),before:node.characters.slice(0,120),parent:group(node.parent),box:box(node)});
      continue;
    }
    if (shared.has(key)) {
      const linked=live.get(key);
      if(linked)linked.nodes.push(node);
      continue;
    }
    const font = node.fontName?.style || node.textStyles?.[0]?.textStyle?.fontName?.style || '';
    shared.set(key,true);
    live.set(key,{nodes:[node],binding});
    targets.push({key,nodeId:node.id, name:String(node.name || '').slice(0,100), before:node.characters,
      parent:group(node.parent), box:box(node), size:number(node.fontSize ?? node.textStyles?.[0]?.textStyle?.fontSize),
      style:font, align:node.textAlignHorizontal, resize:node.textAutoResize});
  }
  const editable=targets.filter(target=>shared.get(target.key));
  skipped+=targets.length-editable.length;
  if (editable.length>contextFillLimit)throw new Error(l('选区中超过 400 个可编辑字段，请按区域填充。','This selection has over 400 editable fields. Fill it by section.'));
  if (!editable.length) throw new Error(l('选区里没有可编辑的可见文本。','This selection has no visible, editable text fields.'));
  editable.sort((a,b) => a.box[1] - b.box[1] || a.box[0] - b.box[0]);
  for (const target of editable)target.linkedIds=live.get(target.key).nodes.map(n=>n.id);
  return {targets:editable, groups:[...groups.entries()],readOnly, skipped, geometry:[frame.name,frame.width,frame.height]};
}

function contextFillRead(message) {
  const frame = contextFillSelectedFrame();
  const l = (zh, en) => message.uiLanguage === 'en' ? en : zh;
  if (!frame) throw new Error(l('请选择一个画板或组件实例。','Select one frame or component instance on the canvas.'));
  const data = contextFillCollect(frame,l);
  const {targets, groups, skipped} = data;
  const fields = targets.map(({nodeId,key,linkedIds, ...data}, index) => ({...data, id:'t' + (index + 1)}));
  const token = 'context-fill-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  contextFillSnapshot = {token, frameId:frame.id, pageId:layerPage().id,
    shape:JSON.stringify(data), targets:new Map(fields.map((field,i) => [field.id, targets[i]]))};
  return {token, frame:{id:frame.id,name:frame.name,type:frame.type,width:frame.width,height:frame.height},
    groups:groups.map(([,group]) => group), fields,readOnly:data.readOnly, skipped};
}

function contextFillRuns(node, before) {
  if (!before.length) return [];
  if (layerPlatform === 'mastergo') return node.textStyles || [];
  if (typeof node.getStyledTextSegments !== 'function') return [];
  return node.getStyledTextSegments(['fontName','fontSize','fills','textCase','textDecoration',
    'letterSpacing','lineHeight','textStyleId','fillStyleId','hyperlink']);
}

function contextFillWriteText(node, before, after, runs, markWritten = () => {}) {
  // Insert before removing the original characters to keep native range styles.
  if (!before.length || typeof node.insertCharacters !== 'function' || typeof node.deleteCharacters !== 'function') {
    node.characters = after;
    markWritten();
    return;
  }
  const chars = Array.from(after);
  const ranges = runs.length && runs[0].start === 0 && runs[runs.length - 1].end === before.length
    ? runs : [{start:0,end:before.length}];
  for (let i = ranges.length - 1; i >= 0; i--) {
    const {start, end} = ranges[i];
    const value = chars.slice(Math.round(start / before.length * chars.length),
      Math.round(end / before.length * chars.length)).join('');
    if (value) { node.insertCharacters(end, value); markWritten(); }
    try { node.deleteCharacters(start, end); markWritten(); }
    catch (error) {
      if (value) node.deleteCharacters(end, end + value.length);
      throw error;
    }
  }
}

async function contextFillApply(message) {
  const l = (zh, en) => message.uiLanguage === 'en' ? en : zh;
  const stale = l('画板内容或选区已变化，请重新生成预览。','The frame or its content changed. Generate a new preview.');
  const snapshot = contextFillSnapshot;
  const frame = contextFillSelectedFrame();
  if (!snapshot || snapshot.token !== message.token || snapshot.frameId !== frame?.id ||
      snapshot.pageId !== layerPage().id) throw new Error(stale);
  const edits = message.edits;
  if (!Array.isArray(edits) || !edits.length || edits.length > snapshot.targets.size) throw new Error(stale);

  const ids = new Set(), prepared = [], fonts = new Map(), live=new Map();
  // Resolve through this selected subtree, including virtual instance text nodes.
  // Some hosts cannot look up an instance sublayer by a document-global ID.
  if(JSON.stringify(contextFillCollect(frame,l,live))!==snapshot.shape)throw new Error(stale);
  for (const edit of edits) {
    const target = snapshot.targets.get(edit?.id);
    if (!target || ids.has(edit.id) || typeof edit.text !== 'string' || !edit.text.trim() ||
        edit.text.length > Math.max(4000, target.before.length * 2)) throw new Error(stale);
    ids.add(edit.id);
    const group=live.get(target.key);
    if(!group)throw new Error(stale);
    for(const node of group.nodes)await loadSmartFillFonts(node,fonts);
    prepared.push({key:target.key,before:target.before,after:edit.text});
  }

  // Loading fonts can yield; check every target again before the first edit.
  live.clear();
  if (contextFillSnapshot !== snapshot || contextFillSelectedFrame()?.id !== frame.id ||
      layerPage().id !== snapshot.pageId || JSON.stringify(contextFillCollect(frame,l,live)) !== snapshot.shape) throw new Error(stale);
  const changes = prepared.filter(item => item.before !== item.after);
  const applied = [];
  const hasNativeUndo = typeof layerHost.commitUndo === 'function' && typeof layerHost.triggerUndo === 'function';
  let wrote = false;
  if (changes.length && hasNativeUndo) layerHost.commitUndo();
  try {
    for (const item of changes) {
      const {nodes,binding}=live.get(item.key);
      const node=nodes[0];
      if(binding) {
        applied.push({...item,binding});
        const current=()=>{
          const props=binding.owner.componentProperties;
          return (Array.isArray(props)?props.find(p=>p.id===binding.key):props[binding.key])?.value;
        };
        try { binding.owner.setProperties({[binding.key]:item.after}); }
        finally { if(current()!==item.before)wrote=true; }
        if(current()!==item.after)throw new Error(l('实例文本属性未能写入。','The instance text override could not be applied.'));
      } else {
        const runs = contextFillRuns(node, item.before);
        applied.push({...item,node,autoRename:node.autoRename,name:node.name});
        contextFillWriteText(node, item.before, item.after, runs, () => { wrote = true; });
      }
    }
  } catch (error) {
    if (wrote && hasNativeUndo) {
      try { layerHost.triggerUndo(); contextFillSnapshot = null; }
      catch (undoError) { console.warn('Context Fill native rollback failed:', String(undoError)); }
      if (!contextFillSnapshot) throw error;
    }
    for (const item of applied.reverse()) {
      try {
        if(item.binding){item.binding.owner.setProperties({[item.binding.key]:item.before});continue;}
        const current = item.node.characters;
        if (current !== item.before) contextFillWriteText(item.node, current, item.before, contextFillRuns(item.node, current));
        if (!item.autoRename && item.node.name !== item.name) item.node.name = item.name;
      } catch (rollbackError) { console.warn('Context Fill rollback failed:', String(rollbackError)); }
    }
    throw error;
  }
  if (changes.length) {
    try { layerHost.commitUndo?.(); }
    catch (error) { console.warn('Context Fill undo checkpoint unavailable:', String(error)); }
  }
  contextFillSnapshot = null;
  return {count:changes.length};
}

async function handleContextFillMessage(message) {
  if (message.type === 'context-fill-selection-request') { sendContextFillSelection(); return true; }
  if (!['context-fill-read','context-fill-apply'].includes(message.type)) return false;
  const reply = {type:'context-fill-response', requestId:message.requestId};
  if (contextFillApplying) {
    layerSend({...reply,ok:false,message:message.uiLanguage === 'en' ? 'A fill is being applied.' : '正在应用填充。'});
    return true;
  }
  const applying = message.type === 'context-fill-apply';
  if (applying) contextFillApplying = true;
  try {
    const result = applying ? await contextFillApply(message) : contextFillRead(message);
    layerSend({...reply,ok:true,...result});
  } catch (error) {
    layerSend({...reply,ok:false,message:String(error?.message || error)});
  } finally {
    if (applying) contextFillApplying = false;
  }
  return true;
}
