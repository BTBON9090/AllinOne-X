import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read = file => fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const core=read('shared/layer-core.js');
const ctx=vm.createContext({});vm.runInContext(core+';globalThis.rules=LayerRules',ctx);const rules=ctx.rules;
function node(id,type,children=[],extra={}){const n={id,type,name:id,visible:true,locked:false,children,...extra};children.forEach(c=>c.parent=n);return n;}
const a=node('a','FRAME',[node('text','TEXT',[],{fills:[]}),node('slot','SLOT',[node('nested','RECTANGLE',[],{locked:true})])],{visible:false,layoutMode:'HORIZONTAL'});
const b=node('b','COMPONENT',[node('label','TEXT'),node('other','RECTANGLE')],{layoutMode:'VERTICAL'});
const page=node('p','PAGE',[a,b]);
const ids=arr=>Array.from(arr,n=>n.id);
assert.deepEqual(ids(rules.pool(page,[a],'inside')),['text','slot','nested']);
assert.deepEqual(ids(rules.pool(page,[a],'descendants')),['a','text','slot','nested']);
assert.deepEqual(ids(rules.pool(page,[a],'children')),['text','slot']);
assert.deepEqual(ids(rules.pool(page,[a.children[0],b.children[0]],'sibling')),['slot','other']);
assert.equal(rules.pool(page,[a,a.children[1]],'descendants').length,4);
assert.equal(rules.pool(page,[],'page').length,7);assert.equal(rules.pool(page,[],'descendants').length,0);
for(const scope of ['page','inside','descendants','children','sibling'])for(const types of ['include','exclude'])for(const states of ['include','exclude']){
 const pool=rules.pool(page,[a.children[0],b.children[0]],scope);
 const result=pool.filter(n=>rules.matches(n,{vals:['TEXT','SLOT'],logic:types},{vals:['hidden','locked'],logic:states}));
 const expected=pool.filter(n=>{const t=['TEXT','SLOT'].includes(n.type);let hidden=false,locked=false;for(let p=n;p&&p.type!=='PAGE';p=p.parent){hidden||=p.visible===false;locked||=p.locked===true}const s=hidden||locked;return (types==='include'?t:!t)&&(states==='include'?s:!s)});
 assert.deepEqual(ids(result),ids(expected),`${scope}/${types}/${states}`);
}
assert(rules.matches(b,{vals:['AUTOLAYOUT'],logic:'include'}));
assert(rules.matches({type:'FRAME',componentPropertyReferences:{slotContentId:'slot#1'}},{vals:['SLOT'],logic:'include'}));
assert(rules.matches({type:'FRAME',isVisible:false,flexMode:'HORIZONTAL'},{vals:['AUTOLAYOUT']},{vals:['hidden']}));
const variants=[];let id=0;for(const size of ['L','S'])for(const state of ['On','Off'])for(const shape of ['Round','Square'])variants.push({id:String(++id),name:`Size=${size}, State=${state}, Shape=${shape}`,width:size==='L'?80:40,height:60});
for(const axesY of [[],['State'],['State','Shape']]){
 const layout=rules.matrix(variants,{axesX:['Size'],axesY,padding:0,gapX:0,gapY:0,groupGap:0});
 for(const p of layout.placements){assert(p.x>=0&&p.y>=0);assert(p.x+p.node.width<=layout.width);assert(p.y+p.node.height<=layout.height);}
 for(const p of layout.placements)for(const q of layout.placements)if(p!==q)assert(p.x+p.node.width<=q.x||q.x+q.node.width<=p.x||p.y+p.node.height<=q.y||q.y+q.node.height<=p.y,'no overlapping multi-axis/grouped variants');
}
const duplicates=rules.matrix([variants[0],{...variants[0],id:'duplicate'}],{axesX:['Size'],axesY:[]});assert.notEqual(duplicates.placements[0].y,duplicates.placements[1].y);
assert.throws(()=>rules.matrix(variants,{axesX:['Size'],axesY:['Size']}));
// Host mocks throw on access to removed Frames, reproducing the reported get_parent failure.
for(const platform of ['figma','mastergo']){
 let sequence=0,failCombine=false;const registry=new Map(),messages=[],listeners={};
 function make(type,name,children=[]){const data={id:'n'+(++sequence),type,name,width:80,height:40,x:0,y:0,visible:true,isVisible:true,locked:false,removed:false,children,parent:null,componentPropertyDefinitions:{}};
 const n=new Proxy(data,{get(target,key){if(target.removed&&key!=='removed')throw new Error('get_parent: node does not exist');return target[key]}});
 data.appendChild=c=>{if(c.parent)c.parent.children.splice(c.parent.children.indexOf(c),1);data.children.push(c);c.parent=n;};
 data.insertChild=(i,c)=>{data.appendChild(c);data.children.splice(data.children.indexOf(c),1);data.children.splice(i,0,c);};
 data.remove=()=>{if(data.parent)data.parent.children.splice(data.parent.children.indexOf(n),1);data.removed=true;};
 data.resize=(w,h)=>{data.width=w;data.height=h;};
 data.clone=()=>{const c=make(type,data.name,data.children.map(n=>n.clone()));data.parent?.appendChild(c);return c;};
 data.getPluginData=()=>'';
 data.addComponentProperty=(name,type,value)=>{data.componentPropertyDefinitions[name]={type,defaultValue:value};return name};
 data.deleteComponentProperty=name=>delete data.componentPropertyDefinitions[name];
 children.forEach(c=>data.appendChild(c));registry.set(data.id,n);return n;}
 const page=make('PAGE','Page'),a=make('FRAME','Button One',[make('TEXT','Label')]),b=make('FRAME','Button Two',[make('TEXT','Label')]);page.appendChild(a);page.appendChild(b);page.selection=[a,b];
 const convert=frame=>{const parent=frame.parent,children=[...frame.children],component=make('COMPONENT',frame.name);children.forEach(c=>component.appendChild(c));parent.appendChild(component);frame.remove();return component};
 const host={currentPage:page,document:{currentPage:page},on:(name,cb)=>{listeners[name]=cb},ui:{postMessage:m=>{if(platform==='mastergo')assert(m.pluginMessage,'MasterGo requires a pluginMessage envelope');messages.push(m.pluginMessage||m)}},getNodeById:id=>registry.get(id),getNodeByIdAsync:async id=>registry.get(id),createComponentFromNode:convert,
 combineAsVariants:(nodes,parent=page)=>{if(failCombine)throw new Error('combine failed');const set=make('COMPONENT_SET','Set');parent.appendChild(set);nodes.forEach(n=>set.appendChild(n));return set},viewport:{scrollAndZoomIntoView(){}},commitUndo(){}};
 const context=vm.createContext({host,console,setTimeout,clearTimeout,transferFrameToComponent:convert,exposeBuilderProperties:()=>({warnings:[]}),exposeBuilderPropertiesForSet:()=>({warnings:[]}),commonNamePrefix:()=> 'Buttons'});
 vm.runInContext(core+'\n'+read('shared/layer-host.js').replaceAll('__PLUGIN_HOST__','host').replaceAll('__PLUGIN_PLATFORM__',JSON.stringify(platform)),context);
 const call=(fn,arg)=>{context.arg=arg;return vm.runInContext(`${fn}(arg)`,context)};
 vm.runInContext('installLayerTools()',context);
 const seed=vm.runInContext('layerSearchRoots()',context);assert.equal(seed.length,2);
 context.results=[a.children[0]];vm.runInContext('layerRememberSearch(results)',context);page.selection=context.results;listeners.selectionchange();assert.equal(vm.runInContext('layerSearchRoots().length',context),2,'filter scope retains seed');
 page.selection=[a,b];listeners.selectionchange();assert.equal(messages.at(-1).validCount,2,'size refresh on selection');
 failCombine=true;await call('layerBuildManual',{mode:'set'});assert.equal(a.removed,false);assert.equal(b.removed,false);assert.equal(page.children.length,2,'failed build cleans all drafts');assert.equal(messages.at(-1).ok,false);
 failCombine=false;await call('layerBuildManual',{mode:'set'});assert.equal(a.removed,true);assert.equal(b.removed,true);assert.equal(page.children.length,1);assert.equal(page.children[0].type,'COMPONENT_SET');assert.equal(messages.at(-1).ok,true);
 const live=page.children[0];page.selection=[live];
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'naming',requestId:'read'});assert.equal(messages.at(-1).ok,true);
 live.name='edited since analysis';await call('handleLayerToolsMessage',{type:'layer-ai-rename',token:'read',purpose:'naming',names:[{id:live.id,name:'stale name'}],requestId:'write'});assert.equal(messages.at(-1).ok,false);assert.equal(live.name,'edited since analysis');
}
console.log('Layer workflows passed: 20 scope/filter intersections, inherited states and Slots, grouped matrices, both-host transaction rollback, selection updates and stale AI snapshots.');
// Run the actual selector handlers: dynamic-page mainComponent getters must not
// break unrelated instance filters, and a failed zoom must still return matches.
const ts=await import('../figma/node_modules/typescript/lib/typescript.js');
for(const platform of ['figma','mastergo']){
 const source=read(platform==='figma'?'figma/code.ts':'mastergo/main.ts');
 const start=source.indexOf("    case 'find-and-select': {");
 const end=source.indexOf("        case 'focus-layers':",start);
 const slice=source.slice(start,end);
 const page={id:'page',children:[],selection:[]},messages=[];
 const instance={id:'instance',name:'Icon',type:'INSTANCE',width:24,height:24,visible:true,locked:false,layoutMode:'HORIZONTAL',flexMode:'HORIZONTAL',children:[],parent:page,getMainComponentAsync:async()=>({id:'main'})};
 Object.defineProperty(instance,'mainComponent',{get(){throw new Error('Use getMainComponentAsync with dynamic-page')}});
 page.children=[instance];page.selection=[instance];
 const host={currentPage:page,document:{currentPage:page},ui:{postMessage:m=>messages.push(m)},viewport:{scrollAndZoomIntoView(){throw new Error('no bounds')}}};
 const context=vm.createContext({console:{log(){}},figma:host,mg:host,layerSearchRoots:()=>[instance],layerSelectSearch:n=>{page.selection=n},notifyInUiLanguage(){},sendToUI:m=>messages.push(m),safeMainComponentId:()=> 'main'});
 const handler='async function handle(msg){switch(msg.type){'+slice+'}}';
 vm.runInContext(core+'\n'+ts.default.transpileModule(handler,{compilerOptions:{target:ts.default.ScriptTarget.ES2020}}).outputText,context);
 await context.handle({type:'find-and-select',filters:{scope:'page',types:{vals:['INSTANCE'],logic:'include'},props:[{key:'width',op:'=',val:24}]}});
 assert.equal(messages.at(-1).count,1,'unrelated property never touches mainComponent');
 await context.handle({type:'find-and-select',filters:{scope:'page',props:[{key:'mainComponentId',op:'=',val:'main'}]}});assert.equal(messages.at(-1).count,1);
 await context.handle({type:'find-and-select',filters:{scope:'page',props:[{key:'name',op:'>',val:2}]}});assert.equal(messages.at(-1).count,0,'non-numeric comparisons cannot pass through NaN');assert.equal(page.selection.length,0);
}
console.log('Actual selector handlers passed: async instance property reads, nonnumeric conditions, empty selection, and hidden-result viewport errors.');
