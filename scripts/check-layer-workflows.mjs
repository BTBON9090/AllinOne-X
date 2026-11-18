import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read = file => fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const core=read('shared/layer-core.js');
const ctx=vm.createContext({});vm.runInContext(core+';globalThis.rules=LayerRules',ctx);const rules=ctx.rules;
vm.runInContext(read('shared/layer-ai-core.js')+';globalThis.ai=LayerAI',ctx);
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
 let sequence=0,failCombine=false,corruptBinding=false;const registry=new Map(),messages=[],listeners={};
 function make(type,name,children=[]){const data={id:'n'+(++sequence),type,name,width:80,height:40,x:0,y:0,visible:true,isVisible:true,locked:false,removed:false,children:[],parent:null,componentPropertyDefinitions:{}};
 const n=new Proxy(data,{get(target,key){if(target.removed&&key!=='removed')throw new Error('get_parent: node does not exist');return target[key]},set(target,key,value){if(['layoutSizingVertical','layoutSizingHorizontal'].includes(key)&&!['FIXED','HUG','FILL'].includes(value))throw new Error('Invalid sizing value');target[key]=value;if(corruptBinding&&key==='componentPropertyReferences'){target.fills=[{type:'SOLID',color:{r:0.5,g:0,b:1}}];target.width+=5;}return true;}});
 data.appendChild=c=>{if(c.parent)c.parent.children.splice(c.parent.children.indexOf(c),1);data.children.push(c);c.parent=n;};
 data.insertChild=(i,c)=>{data.appendChild(c);data.children.splice(data.children.indexOf(c),1);data.children.splice(i,0,c);};
 data.remove=()=>{if(data.parent)data.parent.children.splice(data.parent.children.indexOf(n),1);data.removed=true;};
 data.resize=(w,h)=>{data.width=w;data.height=h;};data.resizeWithoutConstraints=data.resize;data.exportAsync=async()=>new Uint8Array([1,2,3]);
 data.clone=()=>{const c=make(type,data.name,data.children.map(n=>n.clone()));for(const key of ['width','height','x','y','fills','strokes','characters','cornerRadius','visible','isVisible','componentId'])if(data[key]!==undefined)c[key]=JSON.parse(JSON.stringify(data[key]));(['COMPONENT','COMPONENT_SET'].includes(type)?page:data.parent)?.appendChild(c);return c;};
 data.getPluginData=()=>'';
 data.addComponentProperty=(name,type,value)=>{data.componentPropertyDefinitions[name]={type,defaultValue:value};return name};
 data.deleteComponentProperty=name=>delete data.componentPropertyDefinitions[name];
 children.forEach(c=>data.appendChild(c));registry.set(data.id,n);return n;}
 const page=make('PAGE','Page'),a=make('FRAME','Button One',[make('TEXT','Label')]),b=make('FRAME','Button Two',[make('TEXT','Label')]);page.appendChild(a);page.appendChild(b);page.selection=[a,b];
 const convert=frame=>{const parent=frame.parent,children=[...frame.children],component=make('COMPONENT',frame.name);children.forEach(c=>component.appendChild(c));parent.appendChild(component);for(const key of ['width','height','x','y','fills','strokes','characters','cornerRadius','visible','isVisible'])if(frame[key]!==undefined)component[key]=JSON.parse(JSON.stringify(frame[key]));frame.remove();return component};
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
 // 800 targets are a real accepted batch; metadata does not carry trees or images.
 const many=Array.from({length:800},(_,i)=>make('FRAME','Frame '+i));many.forEach(n=>page.appendChild(n));page.selection=many;
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',paged:true,requestId:'800-build'});
 assert.equal(messages.at(-1).ok,true);const snapshot=messages.at(-1).context;assert.equal(snapshot.targets.length,800);assert(snapshot.targets.every(t=>!t.layers&&!t.image));
 await call('handleLayerToolsMessage',{type:'layer-ai-chunk',token:'800-build',offset:0,limit:800,images:true,requestId:'capped-chunk'});assert.equal(messages.at(-1).targets.length,20);assert.equal(messages.at(-1).nextOffset,20);
 await call('handleLayerToolsMessage',{type:'layer-ai-chunk',token:'800-build',offset:792,limit:8,images:false,requestId:'chunk'});assert.equal(messages.at(-1).targets.length,8);assert.equal(messages.at(-1).nextOffset,800);
 page.selection=[...many,make('FRAME','Overflow')];await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',paged:true,requestId:'801'});assert.equal(messages.at(-1).ok,false);assert.match(messages.at(-1).message,/800/);
 page.selection=many;await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'naming',paged:true,requestId:'800-names'});
 await call('handleLayerToolsMessage',{type:'layer-ai-rename',purpose:'naming',token:'800-names',names:many.map((n,i)=>({id:n.id,name:'Renamed '+i})),requestId:'rename-800'});assert.equal(messages.at(-1).ok,true);assert.equal(many[799].name,'Renamed 799');
 await call('layerBuildManual',{mode:'set'});assert.equal(messages.at(-1).ok,true,messages.at(-1).message);assert.equal(page.selection[0].children.length,800);assert.equal(page.selection[0][platform==='figma'?'layoutMode':'flexMode'],'NONE');assert(many.every(n=>n.removed));
 // A binding that changes colors or geometry is rolled back before source deletion.
 const text=make('TEXT','Label');text.characters='Hello';text.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];
 const original=make('FRAME','Avatar',[text]);original.width=128;original.height=128;original.cornerRadius=64;page.appendChild(original);page.selection=[original];
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',requestId:'appearance'});const before=page.children.length;
 corruptBinding=true;await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'appearance',requestId:'corrupt',plan:{groups:[{name:'Avatar',variants:[{id:original.id,values:{}}],properties:[{name:'Label',type:'TEXT',bindings:[{frameId:original.id,path:[0]}]}]}]}});
 assert.equal(messages.at(-1).ok,false);assert.match(messages.at(-1).message,/外观或尺寸/);assert.equal(original.removed,false);assert.equal(page.children.length,before);assert.equal(text.width,80);assert.equal(text.fills[0].color.r,1);corruptBinding=false;
 // Different text defaults must remain different; instance swaps remain advisory.
 const two=make('FRAME','Avatar Two',[make('TEXT','Label'),make('INSTANCE','Icon')]);two.children[0].characters='B';two.children[1].componentId='main-b';original.appendChild(make('INSTANCE','Icon'));original.children[1].componentId='main-a';page.appendChild(two);page.selection=[original,two];
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',requestId:'safe'});
 await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'safe',requestId:'safe-build',plan:{groups:[{name:'Avatar',variants:[{id:original.id,values:{Size:'L'}},{id:two.id,values:{Size:'S'}}],properties:[{name:'Label',type:'TEXT',bindings:[{frameId:original.id,path:[0]},{frameId:two.id,path:[0]}]},{name:'Icon',type:'INSTANCE_SWAP',bindings:[{frameId:original.id,path:[1]},{frameId:two.id,path:[1]}]}]}]}});
 assert.equal(messages.at(-1).ok,true,messages.at(-1).message);assert.equal(messages.at(-1).warnings.length,2);const built=page.selection[0];assert.equal(built.children[0].children[0].characters,'Hello');assert.equal(built.children[1].children[0].characters,'B');assert.equal(built.children[0].width,128);assert.equal(built.children[0].cornerRadius,64);assert.equal(built.children[1].children[1].componentId,'main-b');

 // Final collision isolation still goes through the real host transaction path:
 // ambiguous colors/shapes remain separate, with every source appearance intact.
 const avatars=Array.from({length:4},(_,i)=>{const child=make('TEXT','Badge');child.characters=String(i);child.width=8+i;child.height=9+i;const frame=make('FRAME','Avatar '+i,[child]);frame.width=i<2?32:16*i;frame.height=frame.width;frame.cornerRadius=i%2?4:frame.width/2;frame.fills=[{type:'SOLID',color:{r:i/4,g:0.5,b:1}}];page.appendChild(frame);return frame;});
 const appearances=new Map(avatars.map(n=>[n.id,JSON.stringify({width:n.width,height:n.height,cornerRadius:n.cornerRadius,fills:n.fills,childWidth:n.children[0].width,text:n.children[0].characters})]));
 const safeCollision=ctx.ai.finalizeBuild({groups:[{name:'Avatars',variants:avatars.map((n,i)=>({id:n.id,values:{Size:i<2?'32':String(i)}})),properties:[]}]},avatars.map(n=>({id:n.id,name:n.name})));
 page.selection=avatars;await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',requestId:'collision-safe',paged:true});
 await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'collision-safe',requestId:'collision-apply',plan:safeCollision});
 assert.equal(messages.at(-1).ok,true,messages.at(-1).message);assert.equal(messages.at(-1).mapping.length,4);assert.equal(page.selection.length,3);
 for(const mapping of messages.at(-1).mapping){const n=registry.get(mapping.newId);assert.equal(JSON.stringify({width:n.width,height:n.height,cornerRadius:n.cornerRadius,fills:n.fills,childWidth:n.children[0].width,text:n.children[0].characters}),appearances.get(mapping.id));if(safeCollision.standaloneIds.includes(mapping.id))assert.equal(n.parent,page);else assert.equal(n.parent.type,'COMPONENT_SET');}
 assert(avatars.every(n=>n.removed));
 // Partial rename is a checkpoint: applying one batch keeps the token valid for the rest.
 const firstName=make('FRAME','First'),secondName=make('FRAME','Second');page.appendChild(firstName);page.appendChild(secondName);page.selection=[firstName,secondName];
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'naming',paged:true,requestId:'partial-names'});
 for(const [i,n] of [firstName,secondName].entries()){await call('handleLayerToolsMessage',{type:'layer-ai-rename',purpose:'naming',token:'partial-names',requestId:'partial-'+i,names:[{id:n.id,name:'Done '+i}]});assert.equal(messages.at(-1).ok,true,messages.at(-1).message);}
 assert.equal(firstName.name,'Done 0');assert.equal(secondName.name,'Done 1');
 // A selected root can have arbitrarily deep content: analysis must not read its children.
 const shallow=make('FRAME','Shallow only');page.appendChild(shallow);Object.defineProperty(shallow,'children',{get(){throw new Error('Descendant traversal forbidden during AI read')}});page.selection=[shallow];
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',paged:true,requestId:'shallow'});assert.equal(messages.at(-1).ok,true,messages.at(-1).message);
 await call('handleLayerToolsMessage',{type:'layer-ai-chunk',token:'shallow',images:true,requestId:'shallow-image'});assert.equal(messages.at(-1).ok,true,messages.at(-1).message);assert(messages.at(-1).targets[0].image);assert(!messages.at(-1).targets[0].layers);
 // Append a Frame and an existing component without replacing the set or master IDs.
 const existing=make('COMPONENT','Size=L'),set=make('COMPONENT_SET','Avatars',[existing]),fresh=make('FRAME','Small'),standalone=make('COMPONENT','Medium');page.appendChild(set);page.appendChild(fresh);page.appendChild(standalone);page.selection=[set,fresh,standalone];const masterId=standalone.id,setId=set.id,existingId=existing.id;
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',paged:true,requestId:'append'});assert.equal(messages.at(-1).ok,true);assert.equal(messages.at(-1).context.targets.length,2);assert.equal(messages.at(-1).context.destinations[0].id,setId);
 await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'append',requestId:'append-build',plan:{groups:[{name:'Avatars',destinationId:setId,variants:[{id:fresh.id,values:{Size:'S'}},{id:standalone.id,values:{Size:'M'}}],properties:[]}]}});
 assert.equal(messages.at(-1).ok,true,messages.at(-1).message);assert.equal(set.id,setId);assert.equal(set.children[0].id,existingId);assert.equal(set.children.length,3);assert.equal(standalone.id,masterId);assert.equal(standalone.parent,set);assert.equal(standalone.name,'Size=M');assert.equal(standalone.removed,false);assert.equal(fresh.removed,true);
 // Duplicate combinations are rejected without affecting an existing set.
 const duplicate=make('FRAME','Duplicate');page.appendChild(duplicate);page.selection=[set,duplicate];
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',requestId:'duplicate-append',paged:true});
 await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'duplicate-append',requestId:'duplicate-build',plan:{groups:[{name:'Avatars',destinationId:setId,variants:[{id:duplicate.id,values:{Size:'L'}}],properties:[]}]}});assert.equal(messages.at(-1).ok,false);assert.equal(set.children.length,3);assert.equal(duplicate.removed,false);
 // A later group failing rolls back additions and set bounds while keeping all sources.
 const tailA=make('FRAME','Tail A'),tailB=make('FRAME','Tail B');page.appendChild(tailA);page.appendChild(tailB);page.selection=[set,duplicate,tailA,tailB];const oldBounds=[set.width,set.height];
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',requestId:'rollback-append',paged:true});failCombine=true;
 await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'rollback-append',requestId:'rollback-build',plan:{groups:[{name:'Avatars',destinationId:setId,variants:[{id:duplicate.id,values:{Size:'XL'}}],properties:[]},{name:'Other',variants:[{id:tailA.id,values:{State:'A'}},{id:tailB.id,values:{State:'B'}}],properties:[]}]}});failCombine=false;
 assert.equal(messages.at(-1).ok,false);assert.equal(set.children.length,3);assert.deepEqual([set.width,set.height],oldBounds);assert([duplicate,tailA,tailB].every(n=>!n.removed));
 // MasterGo's published ComponentSet API omits appendChild/insertChild.
 if(platform==='mastergo') {
   const realCombine=host.combineAsVariants;
   host.combineAsVariants=(nodes,parent=page)=>{const result=realCombine(nodes,parent);result.appendChild=undefined;result.insertChild=undefined;return result;};
   set.appendChild=undefined;set.insertChild=undefined;page.selection=[set,duplicate];
   await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',requestId:'unsupported-append',paged:true});assert.equal(messages.at(-1).context.destinations[0].appendSupported,false);
   await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'unsupported-append',requestId:'unsupported-build',plan:{groups:[{name:'Avatars',destinationId:set.id,variants:[{id:duplicate.id,values:{Size:'XXL'}}],properties:[]}]}});
   assert.equal(messages.at(-1).ok,true,messages.at(-1).message);assert.match(messages.at(-1).message,/独立组件/);assert.equal(set.children.length,3);
   // New sets can still use combineAsVariants and retain standalone master IDs.
   const master=make('COMPONENT','Master'),frame=make('FRAME','Frame');page.appendChild(master);page.appendChild(frame);page.selection=[master,frame];const retainedId=master.id;
   await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',requestId:'native-mg-set',paged:true});
   await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'native-mg-set',requestId:'native-mg-build',plan:{groups:[{name:'New set',variants:[{id:master.id,values:{State:'On'}},{id:frame.id,values:{State:'Off'}}],properties:[]}]}});
   assert.equal(messages.at(-1).ok,true,messages.at(-1).message);assert.equal(master.id,retainedId);assert.equal(master.removed,false);assert.equal(master.parent.type,'COMPONENT_SET');assert.equal(master.parent.children.length,2);assert.equal(frame.removed,true);
 }
 // Consolidating existing sets creates a new 150-variant copy, including on a
 // MasterGo host whose component sets have no insertion API. Originals remain live.
 const sourceMembers=Array.from({length:150},(_,i)=>{const n=make('COMPONENT','Old='+i,[make('TEXT','Label')]);n.width=n.height=[16,24,32,40,64][i%5];n.children[0].characters=String(i);n.fills=[{type:'SOLID',color:{r:i/150,g:0.5,b:1}}];return n;});
 const sourceSets=[make('COMPONENT_SET','Old round',sourceMembers.slice(0,75)),make('COMPONENT_SET','Old square',sourceMembers.slice(75))];sourceSets.forEach(n=>page.appendChild(n));page.selection=sourceSets;
 const sourceState=sourceSets.map(n=>({id:n.id,name:n.name,ids:n.children.map(c=>c.id)})),beforeCopies=page.children.length;
 const copyPlan={groups:[{name:'Avatar',variants:sourceMembers.map((n,i)=>({id:n.id,values:{Content:String(i)}})),properties:[]}]};
 await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',consolidate:true,paged:true,requestId:'family-copy'});
 assert.equal(messages.at(-1).ok,true,messages.at(-1).message);assert.equal(messages.at(-1).context.targets.length,150);assert.equal(messages.at(-1).context.destinations.length,0);assert.equal(messages.at(-1).context.sourceSets.length,2);assert.equal(messages.at(-1).context.targets[0].buildParentId,page.id);
 await call('handleLayerToolsMessage',{type:'layer-ai-chunk',token:'family-copy',offset:70,limit:20,images:true,requestId:'family-chunk'});assert.equal(messages.at(-1).targets.length,20);assert.equal(messages.at(-1).targets[5].sourceSetId,sourceSets[1].id);
 failCombine=true;await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'family-copy',requestId:'family-fail',plan:copyPlan});failCombine=false;
 assert.equal(messages.at(-1).ok,false);assert.equal(page.children.length,beforeCopies,'failed consolidation cleans all copies');assert(sourceMembers.every(n=>!n.removed));
 await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'family-copy',requestId:'family-built',plan:copyPlan});
 assert.equal(messages.at(-1).ok,true,messages.at(-1).message);assert.equal(messages.at(-1).mapping.length,150);assert.equal(page.selection.length,1);assert.equal(page.selection[0].children.length,150);assert.match(messages.at(-1).message,/原组件集与已有实例关联保留/);
 assert.deepEqual(sourceSets.map(n=>({id:n.id,name:n.name,ids:n.children.map(c=>c.id)})),sourceState);assert.equal(page.children.length,beforeCopies+1);
 for(const m of messages.at(-1).mapping){const original=registry.get(m.id),copy=registry.get(m.newId);assert.notEqual(copy.id,original.id);assert.equal(copy.width,original.width);assert.deepEqual(copy.fills,original.fills);assert.equal(copy.children[0].characters,original.children[0].characters);assert(sourceSets.includes(original.parent));}
 page.selection=sourceSets;await call('handleLayerToolsMessage',{type:'layer-ai-read',purpose:'build',consolidate:true,paged:true,requestId:'family-stale'});sourceSets[0].appendChild(make('COMPONENT','Added after analysis'));
 await call('handleLayerToolsMessage',{type:'layer-ai-build',token:'family-stale',requestId:'family-stale-build',plan:copyPlan});assert.equal(messages.at(-1).ok,false);assert.match(messages.at(-1).message,/原组件集在分析后发生变化/);
 await call('handleLayerToolsMessage',{type:'layer-focus',id:standalone.id,requestId:'focus'});assert.equal(messages.at(-1).ok,true);assert.equal(page.selection[0],standalone);

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
