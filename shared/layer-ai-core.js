/* Pure AI contracts: model output is data, never an instruction to redraw a design. */
const LayerAI = (() => {
  const LIMIT = 800;
  function parse(value) {
    if (Array.isArray(value)) value=value.map(p=>typeof p==='string'?p:p?.text||'').join('');
    if (value && typeof value==='object') return value;
    const text=String(value||'').replace(/<think>[\s\S]*?<\/think>/gi,'').trim();
    try { return JSON.parse(text); } catch (_) {}
    // Find a balanced object, respecting escaped quotes and braces in strings.
    let start=text.indexOf('{');
    while(start>=0) {
      let depth=0,quoted=false,escaped=false,end=-1;
      for(let i=start;i<text.length;i++) {
        const c=text[i];
        if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;continue;}
        if(c==='"')quoted=true;else if(c==='{')depth++;else if(c==='}'&&!--depth){end=i;break;}
      }
      if(end<0)break; // Never accept a nested fragment of a truncated root object.
      try{return JSON.parse(text.slice(start,end+1))}catch(_){}
      start=text.indexOf('{',end+1);
    }
    throw new Error('AI 返回内容不完整或不是有效 JSON，请重试当前分析');
  }
  function validate(plan,targets,{draft=false}={}) {
    const ids=new Set(targets.map(t=>t.id)),used=new Set();
    if(!Array.isArray(plan?.groups)||!plan.groups.length)throw new Error('AI 未返回构建分组');
    for(const group of plan.groups) {
      if(typeof group.name!=='string'||!group.name.trim()||!Array.isArray(group.variants)||!group.variants.length)throw new Error('AI 构建分组不完整');
      let keys;const tuples=new Set();
      for(const v of group.variants){
        if(v.values!==undefined&&(!v.values||typeof v.values!=='object'||Array.isArray(v.values)))throw new Error('AI 变体属性必须是键值对象');
        if(!ids.has(v.id)||used.has(v.id))throw new Error('AI 返回了未知或重复 Frame，方案未应用');used.add(v.id);
        const entries=Object.entries(v.values||{}).sort(([a],[b])=>a.localeCompare(b));
        if(entries.some(([k,x])=>!k.trim()||typeof x!=='string'||!x.trim()))throw new Error('AI 变体属性和值必须是非空文本');
        if(group.variants.length>1){const signature=JSON.stringify(entries.map(([k])=>k));if(!entries.length||entries.some(([k,x])=>!k.trim()||typeof x!=='string'||!x.trim())||(keys&&keys!==signature))throw new Error('AI 变体属性不一致');keys=signature;const tuple=JSON.stringify(entries);if(!draft&&tuples.has(tuple))throw new Error('AI 生成了重复变体组合');tuples.add(tuple);}
      }
    }
    if(used.size!==ids.size)throw new Error('AI 方案遗漏了 Frame，请重试；原图层未修改');
    return plan;
  }
  // Match native variant-name normalization before checking collisions. Never invent a
  // numbered dimension to force distinct objects into the same component set.
  const cleanVariant=value=>String(value||'').replace(/[,=\n\r]/g,' ').trim().slice(0,100);
  const variantEntries=values=>Object.entries(values||{}).map(([key,value])=>[cleanVariant(key),cleanVariant(value)]).sort();
  function buildConflicts(plan,destinations=[]) {
    const owners=new Map(),conflicts=[];
    for(const [index,group] of plan.groups.entries()) {
      const destination=group.destinationId?destinations.find(d=>d.id===group.destinationId):null;
      if(group.destinationId&&!destination)throw new Error('AI 返回未知目标组件集');
      if(group.variants.length===1&&!destination)continue;
      const ownerKey=destination?'destination:'+destination.id:'group:'+index;
      if(!owners.has(ownerKey))owners.set(ownerKey,{tuples:new Map(),occupied:new Set((destination?.variants||[]).map(v=>JSON.stringify(Object.entries(v.values||{}).sort())))});
      const owner=owners.get(ownerKey),expected=destination?JSON.stringify(Object.keys(destination.variants[0]?.values||{}).sort()):null;
      for(const variant of group.variants) {
        const entries=variantEntries(variant.values),keys=entries.map(([key])=>key);
        if(!entries.length||entries.length>12||entries.some(([key,value])=>!key||!value)||new Set(keys).size!==keys.length||(destination&&JSON.stringify(keys)!==expected)) {
          conflicts.push({reason:'properties',ids:[variant.id],groupName:group.name,...(destination?{destinationId:destination.id}:{})});continue;
        }
        const tuple=JSON.stringify(entries);
        if(!owner.tuples.has(tuple))owner.tuples.set(tuple,{ids:[],groupName:group.name,...(destination?{destinationId:destination.id}:{})});
        owner.tuples.get(tuple).ids.push(variant.id);
      }
    }
    for(const owner of owners.values())for(const [tuple,record] of owner.tuples) {
      if(owner.occupied.has(tuple)||record.ids.length>1)conflicts.push({...record,reason:owner.occupied.has(tuple)?'occupied':'duplicate'});
    }
    return conflicts;
  }
  function finalizeBuild(plan,targets,destinations=[]) {
    validate(plan,targets,{draft:true});
    const conflicts=buildConflicts(plan,destinations),standaloneIds=new Set(conflicts.flatMap(c=>c.ids)),sources=new Map(targets.map(t=>[t.id,t]));
    const groups=[];
    for(const group of plan.groups) {
      const variants=group.variants.filter(v=>!standaloneIds.has(v.id)).map(v=>({id:v.id,values:group.variants.length>1||group.destinationId?Object.fromEntries(variantEntries(v.values)):{...v.values}}));
      if(variants.length)groups.push({...group,variants});
      // Keep ALL ambiguous members, not just an arbitrary first match. Copies are
      // converted by the native appearance-preserving path only after user review.
      for(const variant of group.variants.filter(v=>standaloneIds.has(v.id)))groups.push({name:cleanVariant(sources.get(variant.id)?.name)||cleanVariant(group.name),variants:[{id:variant.id,values:{}}],properties:[]});
    }
    const result={...plan,groups,conflicts,standaloneIds:[...standaloneIds]};
    validate(result,targets);
    if(buildConflicts(result,destinations).length)throw new Error('组件属性冲突未能安全隔离');
    return result;
  }
  function merge(plans,targets) {
    if(plans.length===1)return validate(plans[0],targets);
    // Only merge fully compatible groups. Do not invent missing cross-product variants.
    const groups=[],byKey=new Map(),source=new Map(targets.map(t=>[t.id,t]));
    for(const plan of plans)for(const g of plan.groups){
      const key=JSON.stringify([g.name,g.destinationId,source.get(g.variants[0].id)?.parentId,Object.keys(g.variants[0].values||{}).sort()]);
      const previous=byKey.get(key);const tuple=v=>JSON.stringify(Object.entries(v.values||{}).sort());
      if(previous&&g.variants.every(v=>!previous.variants.some(p=>tuple(p)===tuple(v)))){
        previous.variants.push(...g.variants);
        for(const p of g.properties||[]){const existing=previous.properties.find(q=>q.name===p.name&&q.type===p.type);if(existing)existing.bindings.push(...p.bindings);else if(!previous.properties.some(q=>q.name===p.name))previous.properties.push(p);}
      }else{const next=JSON.parse(JSON.stringify({...g,properties:g.properties||[]}));groups.push(next);byKey.set(key,next);}
    }
    return validate({summary:`已分批分析 ${targets.length} 个 Frame；只合并属性兼容且无重复组合的分组。`,suggestions:[...new Set(plans.flatMap(p=>p.suggestions||[]))],groups},targets);
  }
  function semanticName(value) {
    return String(value||'').replace(/(?:黑|白|灰|红|橙|黄|绿|青|蓝|紫|粉|棕|金|银)色|彩色|多色|单色|线性|线框|描边|填充|实心|空心|渐变|扁平|立体|圆角|风格|样式/g,'')
      .replace(/\b(?:black|white|gr[ae]y|red|orange|yellow|green|cyan|blue|purple|pink|brown|gold|silver|colou?rful|multicolou?r|monochrome|outline|outlined|linear|filled|solid|gradient|flat|rounded|style)\b/gi,'')
      .replace(/^[\s/_\-、]+|[\s/_\-、]+$/g,'').replace(/\s{2,}/g,' ').trim();
  }
  const BATCH_SIZE=20;
  function checkImages(content) {
    if(Array.isArray(content)&&content.filter(p=>p.type==='image_url'||p.type==='image').length>BATCH_SIZE)throw new Error('每批最多分析 20 张图片（包含参考图）');
  }
  function reviewed(value,total) {
    if(value?.reviewedCount!==total||typeof value.summary!=='string'||!value.summary.trim())throw new Error('AI 统筹结果未确认全部分析项，请继续解析');
    return value;
  }
  function familySchema(value,plans,targets) {
    reviewed(value,targets.length);
    const sources=plans.flatMap(p=>p.groups),used=new Set(),keys=new Set();
    if(!Array.isArray(value.families)||!value.families.length)throw new Error('AI 未返回全局组件族与属性规划');
    const families=value.families.map(f=>{
      if(typeof f.key!=='string'||!f.key.trim()||keys.has(f.key)||typeof f.name!=='string'||!f.name.trim()||!Array.isArray(f.sourceGroups)||!f.sourceGroups.length||!Array.isArray(f.dimensions)||!f.dimensions.length||f.dimensions.length>12)throw new Error('组件族规划格式不完整或重复');
      keys.add(f.key);const dimensions=f.dimensions.map(d=>typeof d==='string'?cleanVariant(d):'');
      if(dimensions.some(d=>!d)||new Set(dimensions).size!==dimensions.length)throw new Error('全局属性名称无效或重复');
      const ids=[];for(const index of f.sourceGroups){if(!Number.isInteger(index)||!sources[index]||used.has(index))throw new Error('全局规划引用了未知或重复分组');used.add(index);ids.push(...sources[index].variants.map(v=>v.id));}
      return {key:f.key,name:f.name,dimensions,sourceGroups:[...f.sourceGroups],ids,reason:String(f.reason||'')};
    });
    if(used.size!==sources.length)throw new Error('全局规划遗漏了批次分组');
    return {summary:value.summary,families};
  }
  function consolidateFamilies(plan,schema,targets) {
    validate(plan,targets,{draft:true});
    const byId=new Map(targets.map(t=>[t.id,t])),familyById=new Map(schema.families.flatMap(f=>f.ids.map(id=>[id,f]))),groups=new Map();
    for(const group of plan.groups)for(const variant of group.variants){
      const family=familyById.get(variant.id);if(!family)throw new Error('全局规划遗漏了来源对象');
      const entries=variantEntries(variant.values),actual=entries.map(([key])=>key).sort(),expected=[...family.dimensions].sort();
      if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error(`最终方案必须补齐组件族 ${family.name} 的统一属性：${family.dimensions.join('、')}`);
      const target=byId.get(variant.id),key=JSON.stringify([family.key,target.buildParentId||target.parentId,group.destinationId||'']);
      if(!groups.has(key))groups.set(key,{name:family.name,familyKey:family.key,...(group.destinationId?{destinationId:group.destinationId}:{}),variants:[],properties:[]});
      groups.get(key).variants.push({id:variant.id,values:Object.fromEntries(entries)});
    }
    return validate({...plan,groups:[...groups.values()]},targets,{draft:true});
  }
  // A compact recipe lets the final model reconcile 800 objects without repeating every variant.
  // Parts may select IDs to split a preliminary group; every original ID must still occur once.
  function synthesizeBuild(value,plans,targets,options) {
    reviewed(value,targets.length);
    if(!Array.isArray(value.groups)||!value.groups.length)throw new Error('AI 统筹未返回构建分组');
    const sources=plans.flatMap(p=>p.groups),groups=value.groups.map(g=>{
      if(!Array.isArray(g.parts)||!g.parts.length)throw new Error('AI 统筹分组缺少来源');
      const variants=[];
      for(const part of g.parts){
        const source=Number.isInteger(part.group)?sources[part.group]:null;if(!source)throw new Error('AI 统筹引用了未知批次分组');
        const records=part.ids===undefined?source.variants:source.variants.filter(v=>part.ids.includes(v.id));
        if(!records.length||(part.ids!==undefined&&(!Array.isArray(part.ids)||new Set(part.ids).size!==part.ids.length||records.length!==part.ids.length)))throw new Error('AI 统筹分组引用不完整');
        const omitted=part.omitProperties||[];
        if(!Array.isArray(omitted)||new Set(omitted).size!==omitted.length||omitted.some(key=>typeof key!=='string'||!records.some(v=>Object.hasOwn(v.values||{},key))))throw new Error('AI 统筹移除的属性无效');
        for(const v of records){const values={};for(const [key,original] of Object.entries(v.values||{})){
          if(omitted.includes(key))continue;
          const renamed=part.propertyMap?.[key]??key;if(Object.hasOwn(values,renamed))throw new Error('AI 统筹属性名称冲突');
          values[renamed]=part.valueMap?.[key]?.[original]??original;
        }
          for(const [key,constant] of Object.entries(part.constants||{})){if(Object.hasOwn(values,key)&&values[key]!==constant)throw new Error('AI 统筹常量与已有属性冲突');values[key]=constant;}
          variants.push({id:v.id,values});
        }
      }
      const used=new Set();for(const override of g.overrides||[]){const v=variants.find(v=>v.id===override.id);if(!v||used.has(v.id)||!override.values||Array.isArray(override.values))throw new Error('AI 统筹属性修正无效');used.add(v.id);v.values=override.values;}
      return {name:g.name,...(g.destinationId?{destinationId:g.destinationId}:{}),variants,properties:[]};
    });
    return validate({summary:value.summary,suggestions:Array.isArray(value.suggestions)?value.suggestions.map(String):[],groups},targets,options);
  }
  function synthesizeNames(value,names) {
    reviewed(value,names.length);
    if(!Array.isArray(value.renames)||!Array.isArray(value.overrides))throw new Error('AI 命名统筹格式不完整');
    const replacements=new Map(),overrides=new Map(),known=new Set(names.map(n=>n.name)),ids=new Set(names.map(n=>n.id));
    for(const change of value.renames){const name=typeof change.to==='string'?semanticName(change.to):'';if(!known.has(change.from)||replacements.has(change.from)||!name)throw new Error('AI 命名统筹包含无效术语');replacements.set(change.from,name.slice(0,180));}
    for(const change of value.overrides){const name=typeof change.name==='string'?semanticName(change.name):'';if(!ids.has(change.id)||overrides.has(change.id)||!name)throw new Error('AI 命名统筹包含无效对象');overrides.set(change.id,name.slice(0,180));}
    return names.map(n=>({id:n.id,name:overrides.get(n.id)||replacements.get(n.name)||n.name}));
  }
  function synthesizePairs(value,units) {
    reviewed(value,units.length);
    if(!Array.isArray(value.rejected))throw new Error('AI 查重统筹格式不完整');
    const known=new Set(units.map(u=>u.id)),rejected=new Set();for(const id of value.rejected){if(!known.has(id)||rejected.has(id))throw new Error('AI 查重统筹引用了未知或重复候选');rejected.add(id);}
    return units.filter(u=>!rejected.has(u.id)).flatMap(u=>u.pairs);
  }
  function responseText(data) {
    const raw=data?.choices?.[0]?.message?.content||data?.content?.filter(p=>p.type==='text').map(p=>p.text).join('');
    const text=Array.isArray(raw)?raw.map(p=>typeof p==='string'?p:p.text||'').join(''):raw||'';
    if(data?.choices?.[0]?.finish_reason==='length'||data?.stop_reason==='max_tokens')throw Object.assign(new Error('模型本次输出不完整，已保留此前结果'),{code:'AI_OUTPUT_TRUNCATED',output:text});
    if(!text)throw new Error('模型未返回可用内容');return text;
  }
  async function adaptive(state,items,work,commit,onSplit=()=>{}) {
    const limit=state.batchSize||BATCH_SIZE;
    if(items.length>limit){for(let i=0;i<items.length;i+=limit)await adaptive(state,items.slice(i,i+limit),work,commit,onSplit);return;}
    let result;
    try {result=await work(items);}catch(error){
      if(error.code!=='AI_OUTPUT_TRUNCATED')throw error;
      if(items.length<=1){error.message='单个对象的输出仍不完整，已暂停。请检查模型输出能力或更换模型后继续；已完成结果会保留。';throw error;}
      state.batchSize=Math.max(1,Math.floor(items.length/2));onSplit(state.batchSize);
      await adaptive(state,items,work,commit,onSplit);return;
    }
    await commit(result,items);
  }
  function splitComparison([left,right]) {
    if(left.length<=1&&right.length<=1)return [];
    if(left.length>=right.length){const mid=Math.floor(left.length/2);return [[left.slice(0,mid),right],[left.slice(mid),right]];}
    const mid=Math.floor(right.length/2);return [[left,right.slice(0,mid)],[left,right.slice(mid)]];
  }
  return {LIMIT,BATCH_SIZE,responseText,adaptive,splitComparison,parse,validate,buildConflicts,finalizeBuild,merge,semanticName,checkImages,reviewed,familySchema,consolidateFamilies,synthesizeBuild,synthesizeNames,synthesizePairs};
})();
