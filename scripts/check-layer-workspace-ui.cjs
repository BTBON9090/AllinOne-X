const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
try{for(const platform of ['figma','mastergo']){
const page=await browser.newPage({viewport:{width:440,height:600}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());
await page.addInitScript(()=>{window.__sent=[];window.parent.postMessage=m=>{if(m.pluginMessage)window.__sent.push(m.pluginMessage)};});
await page.goto('file://'+path.resolve(platform,'ui.html'));await page.waitForFunction(()=>!!window.PluginWorkspace);
const emit=msg=>page.evaluate(m=>window.dispatchEvent(new MessageEvent('message',{data:{pluginMessage:m}})),msg);
const route=key=>page.evaluate(key=>PluginWorkspace.navigate(key),key);
assert.equal(await page.locator('.nav-item').count(),15);assert.equal(await page.locator('#modeBtn').count(),0);assert.equal(await page.locator('#moveWindow').count(),0);
await route('smartFill');await page.locator('#sfPrefix').check();await page.locator('#sfSuffix').check();assert.equal(await page.evaluate(()=>getSmartFillMode()),'both');
await route('size');await emit({type:'size-assistant-selection',validCount:0,invalidCount:0});assert(await page.locator('#sizeApplyBtn').isDisabled());await emit({type:'size-assistant-selection',validCount:2,invalidCount:0});assert(await page.locator('#sizeApplyBtn').isEnabled());await page.locator('#sizeApplyBtn').click();assert.equal(await page.evaluate(()=>__sent.at(-1).type),'size-assistant-apply');
await route('jumpback');const spots=Array.from({length:5},(_,i)=>({id:String(i),name:'位置 '+(i+1),pageName:'产品设计'}));await emit({type:'jb-render-spots',data:spots});
assert.equal(await page.locator('.spot-item').count(),5);assert.equal(await page.locator('.btn-spot-jump').count(),0);assert(await page.locator('.spot-item').last().evaluate(n=>n.getBoundingClientRect().bottom<=innerHeight));
await page.locator('.spot-page-title').first().click();assert.equal(await page.evaluate(()=>__sent.at(-1).type),'jb-jump');
const before=await page.evaluate(()=>__sent.filter(m=>m.type==='jb-jump').length);await page.locator('.spot-name-input').first().fill('编辑名称');await page.locator('.spot-name-input').first().press('Tab');assert.equal(await page.evaluate(()=>__sent.filter(m=>m.type==='jb-jump').length),before);
await page.locator('.bookmark-handle').first().press('End');assert.deepEqual(await page.evaluate(()=>__sent.filter(m=>m.type==='jb-reorder').at(-1).ids),['1','2','3','4','0']);
await page.screenshot({path:`/tmp/${platform}-locations-review.png`});
await route('refiner');await page.getByText('AI 名称翻译',{exact:true}).first().click();assert(await page.locator('#refinerTranslation').isVisible());await page.locator('[data-key="ref_tab_lint"]').click();assert(!(await page.locator('#refinerTranslation').isVisible()));assert.match(await page.locator('[data-key="ref_tab_find"]').getAttribute('title'),/名称/);
await route('duplicate');assert(await page.locator('#dupSemanticSwitch').isVisible());assert.equal(await page.locator('#dupSemanticSwitch').getAttribute('role'),'switch');await page.locator('#dupVisualSwitch').check();await page.evaluate(()=>{aiConfig={provider:'deepseek',model:'deepseek-chat',baseUrl:'https://example.invalid/v1',key:'fixture'};runDupCheck()});await page.waitForFunction(()=>document.querySelector('#duplicatePanel').textContent.includes('仅支持文本'));await page.locator('#dupVisualSwitch').uncheck();await page.evaluate(()=>runDupCheck());assert.equal(await page.evaluate(()=>__sent.at(-1).type),'dup-check');
await route('componentBuilder');assert.equal(await page.locator('[data-builder-mode]').count(),3);assert(await page.locator('#builderAiCard').isVisible());await page.screenshot({path:`/tmp/${platform}-builder-review.png`});
await route('layerNaming');await page.locator('#manualLayerName').fill('Icon');await page.getByRole('button',{name:'生成名称预览',exact:true}).click();let msg=await page.evaluate(()=>__sent.at(-1));assert.equal(msg.type,'layer-ai-read');assert.equal(msg.images,false);
await emit({type:'layer-ai-response',requestId:msg.requestId,ok:true,context:{token:'fixture',targets:[{id:'n1',name:'Old 1'},{id:'n2',name:'Old 2'}]}});await page.waitForFunction(()=>document.querySelectorAll('.layer-name-row').length===2);await page.getByRole('button',{name:'应用勾选名称'}).click();msg=await page.evaluate(()=>__sent.at(-1));assert.deepEqual(msg.names,[{id:'n1',name:'Icon 01'},{id:'n2',name:'Icon 02'}]);await emit({type:'layer-ai-response',requestId:msg.requestId,ok:true,message:'已命名 2 个图层'});
await page.screenshot({path:`/tmp/${platform}-naming-review.png`});
// Exercise actual request assembly, analysis preview, and explicit application with a mock transport.
if(platform==='mastergo')await page.evaluate(()=>{window.runMasterGoFetch=data=>__sent.push({type:'do-fetch',...data})});
await route('componentBuilder');await page.locator('#builderAiVision').uncheck();await page.getByRole('button',{name:'AI 读取并建议',exact:true}).click();
msg=await page.evaluate(()=>__sent.at(-1));assert.equal(msg.type,'layer-ai-read');assert.equal(msg.purpose,'build');
const plan={summary:'Two states of one button',suggestions:['Expose the label'],groups:[{name:'Button',variants:[{id:'f1',values:{State:'Default'}},{id:'f2',values:{State:'Disabled'}}],properties:[]}]};
await emit({type:'layer-ai-response',requestId:msg.requestId,ok:true,context:{token:'build-fixture',targets:[{id:'f1',name:'Frame 1',layers:[{id:'t1',type:'TEXT',path:[0]}]},{id:'f2',name:'Frame 2',layers:[{id:'t2',type:'TEXT',path:[0]}]}],totalLayers:4}});
await page.waitForFunction(()=>__sent.at(-1).type==='do-fetch');msg=await page.evaluate(()=>__sent.at(-1));const body=JSON.parse(msg.options.body);assert.match(body.messages[0].content,/root screenshots/);assert(!body.messages[1].content.includes('t1'));assert(!body.messages[1].content.includes('layers'));assert.equal(body.model,'deepseek-chat');
await emit({type:'api-response',reqId:msg.reqId,data:{choices:[{message:{content:JSON.stringify(plan)}}]}});
await page.waitForFunction(id=>__sent.at(-1).type==='do-fetch'&&__sent.at(-1).reqId!==id,msg.reqId);assert(await page.locator('#builderAiCard .primary-btn').isDisabled());msg=await page.evaluate(()=>__sent.at(-1));assert.equal(JSON.parse(JSON.parse(msg.options.body).messages[1].content).stage,'family-schema');
await emit({type:'api-response',reqId:msg.reqId,data:{choices:[{message:{content:JSON.stringify({reviewedCount:2,summary:'One button role',families:[{key:'button',name:'Button',sourceGroups:[0],dimensions:['State']}]})}}]}});
await page.waitForFunction(id=>__sent.at(-1).type==='do-fetch'&&__sent.at(-1).reqId!==id,msg.reqId);msg=await page.evaluate(()=>__sent.at(-1));assert.equal(JSON.parse(JSON.parse(msg.options.body).messages[1].content).stage,'synthesis');
await emit({type:'api-response',reqId:msg.reqId,data:{choices:[{message:{content:JSON.stringify({reviewedCount:2,summary:'Global plan',groups:[{name:'Button',parts:[{group:0}]}]})}}]}});await page.waitForFunction(()=>!document.querySelector('#builderAiCard .primary-btn').disabled);
assert.match(await page.locator('#builderAiCard .layer-plan-results').innerText(),/State=Default/);await page.getByRole('button',{name:'按方案构建',exact:true}).click();msg=await page.evaluate(()=>__sent.at(-1));assert.equal(msg.type,'layer-ai-build');assert.deepEqual(msg.plan.groups,plan.groups.map(g=>({...g,familyKey:'button'})));await emit({type:'layer-ai-response',requestId:msg.requestId,ok:true,message:'已构建组件集'});
// Workflows send actual screenshots directly: no synthetic capability request.
await page.evaluate(()=>{aiConfig={provider:'deepseek',model:'deepseek-v4-flash',baseUrl:'https://example.invalid/v1',key:'fixture'}});
await route('layerNaming');await page.getByRole('button',{name:'AI 识图命名',exact:true}).click();await page.waitForFunction(()=>__sent.at(-1).type==='layer-ai-read');msg=await page.evaluate(()=>__sent.at(-1));assert.equal(msg.images,false);
const tiny=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=24;return c.toDataURL('image/png')});
await emit({type:'layer-ai-response',requestId:msg.requestId,ok:true,context:{token:'vision-fixture',targets:[{id:'icon1',name:'Vector 01',image:tiny,layers:[]}],totalLayers:1}});await page.waitForFunction(()=>__sent.at(-1).type==='do-fetch');msg=await page.evaluate(()=>__sent.at(-1));assert(JSON.parse(msg.options.body).messages[1].content.some(p=>p.image_url?.url.startsWith('data:image/jpeg')));
await emit({type:'api-response',reqId:msg.reqId,data:{choices:[{message:{content:JSON.stringify({names:[{id:'icon1',name:'确认',meanings:['通过']},{id:'invented',name:'Wrong'}]})}}]}});await page.waitForFunction(()=>document.querySelectorAll('.layer-name-row').length===1);assert.equal(await page.locator('.layer-name-row input:not([type=checkbox])').inputValue(),'确认','Default uses one name and rejects invented IDs');
await page.waitForFunction(id=>__sent.at(-1).type==='do-fetch'&&__sent.at(-1).reqId!==id,msg.reqId);msg=await page.evaluate(()=>__sent.at(-1));assert(await page.getByRole('button',{name:'应用勾选名称'}).isDisabled());await emit({type:'api-response',reqId:msg.reqId,data:{choices:[{message:{content:JSON.stringify({reviewedCount:1,summary:'Confirmed',renames:[],overrides:[]})}}]}});await page.waitForFunction(()=>!document.querySelector('#layerNamingCard .primary-btn').disabled);
await route('compkit');await emit({type:'compkit-props',targetId:'set1',properties:['Size','State','Shape','Theme'],componentName:'Button',propertyValues:{},variantsCount:32});assert(await page.locator('#matrixAxes').isVisible());assert.equal(await page.locator('#matrixAxes select').count(),4);await page.locator('#matrixAxes select').nth(2).selectOption('y');await page.locator('#btnCompKitShowcase').click();msg=await page.evaluate(()=>__sent.at(-1));assert.equal(msg.type,'layer-matrix');assert.deepEqual(msg.axesY,['State','Shape']);await emit({type:'layer-ai-response',requestId:msg.requestId,ok:true,message:'已排列'});await page.screenshot({path:`/tmp/${platform}-matrix-review.png`});
// CompKit consumes measured, actual combinations and offers distinct validated layouts.
await page.getByRole('button',{name:'AI 建议排列',exact:true}).click();msg=await page.evaluate(()=>__sent.at(-1));
assert.equal(msg.purpose,'matrix');
await emit({type:'layer-ai-response',requestId:msg.requestId,ok:true,context:{token:'matrix-fixture',paged:false,totalLayers:2,targets:[{id:'v1',image:tiny,name:'Size=L, State=On, Shape=Round, Theme=Light',width:80,height:40},{id:'v2',image:tiny,name:'Size=S, State=Off, Shape=Square, Theme=Dark',width:40,height:40}]}});
await page.waitForFunction(()=>__sent.at(-1).type==='do-fetch');msg=await page.evaluate(()=>__sent.at(-1));const matrixRequest=JSON.parse(JSON.parse(msg.options.body).messages[1].content[0].text);assert.equal(matrixRequest.dimensions.length,4);assert.equal(matrixRequest.bounds.maxWidth,80);assert.equal(matrixRequest.observedCombinations.length,2);
await emit({type:'api-response',reqId:msg.reqId,data:{choices:[{message:{content:JSON.stringify({options:[{name:'均衡',summary:'按大小比较状态',axesX:['Size'],axesY:['State'],groups:['Shape','Theme'],reasons:[{property:'Size',reason:'两种实际宽度'}]},{name:'紧凑',summary:'以主题分列',axesX:['Theme'],axesY:['State','Shape'],groups:['Size'],reasons:[{property:'Theme',reason:'两个主题'}]}]})}}]}});
await page.waitForFunction(id=>__sent.at(-1).type==='do-fetch'&&__sent.at(-1).reqId!==id,msg.reqId);msg=await page.evaluate(()=>__sent.at(-1));const globalMatrix=JSON.parse(JSON.parse(msg.options.body).messages[1].content);assert.equal(globalMatrix.batchReports.length,1);assert(await page.locator('#btnCompKitShowcase').isDisabled());await emit({type:'api-response',reqId:msg.reqId,data:{choices:[{message:{content:JSON.stringify({...globalMatrix.batchReports[0],reviewedCount:2,summary:'Final layouts'})}}]}});
await page.getByRole('button',{name:'紧凑',exact:true}).click();assert.equal(await page.locator('#matrixAxes select').nth(0).inputValue(),'group');assert.equal(await page.locator('#matrixAxes select').nth(3).inputValue(),'x');assert.match(await page.locator('.matrix-plan-detail').innerText(),/两个主题/);
// All 800 names: repair, 429 pause, automatic batches beyond eight calls, then resumable synthesis.
await route('layerNaming');
await page.evaluate(tiny=>{
 window.__originalLayerPost=postMsg;window.__chunks=[];window.__modelCalls=0;window.__applied800=[];window.__namingCalls=[];window.__finalCalls=0;window.__maxImages=0;
 const reply=message=>setTimeout(()=>window.dispatchEvent(new MessageEvent('message',{data:{pluginMessage:message}})),0);
 const targets=Array.from({length:800},(_,i)=>({id:'large-'+i,name:'Vector '+i}));
 postMsg=function(type,data={}){
  if(type==='layer-ai-read'){reply({type:'layer-ai-response',requestId:data.requestId,ok:true,context:{token:'800',paged:true,targets,totalLayers:800}});return;}
  if(type==='layer-ai-chunk'){__chunks.push(data.offset);const batch=targets.slice(data.offset,data.offset+data.limit).map(t=>({...t,image:tiny,layers:[]}));reply({type:'layer-ai-response',requestId:data.requestId,ok:true,targets:batch,nextOffset:data.offset+batch.length});return;}
  if(type==='do-fetch'){
   const body=JSON.parse(data.options.body),input=body.messages[1].content;__modelCalls++;
   if(typeof input==='string'){
    const all=JSON.parse(input);if(all.stage!=='synthesis'||all.batchResults.length!==800)throw new Error('Final synthesis must cover all 800 names');__finalCalls++;
    if(__finalCalls===1){reply({type:'api-response',reqId:data.reqId,error:'HTTP 429 统筹暂停',status:429,retryAt:Date.now()});return;}
    reply({type:'api-response',reqId:data.reqId,data:{choices:[{message:{content:JSON.stringify({reviewedCount:800,summary:'统一全部批次用词',renames:[{from:'搜索',to:'查找'}],overrides:[]})}}]}});return;
   }
   if(!body.messages[0].content.includes('NEVER include color names'))throw new Error('Semantic naming prompt missing');
   const count=input.filter(p=>p.type==='image_url').length;__maxImages=Math.max(__maxImages,count);if(count>20)throw new Error('More than 20 images');
   const records=input.filter(p=>p.type==='text').map(p=>JSON.parse(p.text));__namingCalls.push(records.map(r=>r.id));
   if(__modelCalls===3){reply({type:'api-response',reqId:data.reqId,error:'HTTP 429 已暂停',status:429,retryAt:Date.now()});return;}
   const content=__modelCalls===1?'incomplete {':JSON.stringify({names:records.map(r=>({id:r.id,name:'蓝色线性搜索',meanings:[]}))});
   reply({type:'api-response',reqId:data.reqId,data:{choices:[{message:{content}}]}});return;
  }
  if(type==='layer-ai-rename'){__applied800.push(...data.names);reply({type:'layer-ai-response',requestId:data.requestId,ok:true,message:'已命名 '+data.names.length+' 个图层'});return;}
  return __originalLayerPost(type,data);
 };
},tiny);
await page.getByRole('button',{name:'AI 识图命名',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&document.querySelector('#layerNamingCard .layer-feedback').textContent.includes('429'));
assert.equal(await page.locator('.layer-name-row').count(),20);assert.equal(await page.evaluate(()=>__modelCalls),3);assert(await page.getByRole('button',{name:'应用勾选名称'}).isDisabled());
await page.locator('.layer-name-row .layer-locate').first().click();msg=await page.evaluate(()=>__sent.at(-1));assert.equal(msg.type,'layer-focus');assert.equal(msg.id,'large-0');await emit({type:'layer-ai-response',requestId:msg.requestId,ok:true});
await page.locator('#namingContinue').click();await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&__finalCalls===1,{},{timeout:60000});
assert.equal(await page.locator('.layer-name-row').count(),800);assert.equal(await page.evaluate(()=>__modelCalls),43,'40 batches + repair + failed batch + failed synthesis');assert(await page.getByRole('button',{name:'应用勾选名称'}).isDisabled());
assert.equal(await page.evaluate(()=>__namingCalls.slice(3).some(ids=>ids.includes('large-0'))),false);await page.screenshot({path:`/tmp/${platform}-naming-synthesis-paused-443.png`});
const chunksBefore=await page.evaluate(()=>__chunks.length);await page.locator('#namingContinue').click();await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&document.querySelector('#namingContinue').hidden);
assert.equal(await page.evaluate(()=>__modelCalls),44);assert.equal(await page.evaluate(()=>__maxImages),20);assert.equal(await page.evaluate(()=>__chunks.length),chunksBefore,'synthesis retry does not re-export images');assert.equal(await page.locator('.layer-name-row input:not([type=checkbox])').last().inputValue(),'查找');
await page.getByRole('button',{name:'应用勾选名称'}).click();await page.waitForFunction(()=>__applied800.length===800&&document.querySelectorAll('.layer-name-row').length===0);assert.equal(await page.evaluate(()=>new Set(__applied800.map(n=>n.id)).size),800);
await page.evaluate(()=>{postMsg=__originalLayerPost;document.querySelector('.layer-completion')?.remove()});
// The other workflows preserve drafts and require holistic synthesis; reference images have their own <=20 batch.
await page.evaluate(tiny=>{
 window.__resumeMode='build';window.__resumeCalls=0;window.__builtPlans=[];window.__synthesisRequests=[];window.__seenImageCounts=[];window.__referenceCount=20;window.__cancelledIds=[];
 const reply=m=>setTimeout(()=>dispatchEvent(new MessageEvent('message',{data:{pluginMessage:m}})),0);
 const targets=Array.from({length:800},(_,i)=>({id:'resume-'+i,name:'Size='+i+', State=On, Shape=Round, Theme=Light',width:80,height:40,side:i<12?0:1,image:tiny}));
 postMsg=function(type,data={}){
  if(type==='layer-ai-read'){const list=targets.slice(0,data.purpose==='duplicate'?(window.__largeDup?800:24):48).map((t,i)=>({...t,side:i<(window.__largeDup?400:12)?0:1}));reply({type:'layer-ai-response',requestId:data.requestId,ok:true,context:{token:'resume-'+data.purpose,targets:list,totalLayers:list.length,destinations:data.purpose==='build'?[{id:'existing',name:'Other',variants:[],appendSupported:true}]:[]}});return;}
  if(type==='cancel-fetch'){__cancelledIds.push(data.reqId);return __originalLayerPost(type,data);}
  if(type==='layer-ai-references'){reply({type:'layer-ai-response',requestId:data.requestId,ok:true,targets:targets.slice(0,__referenceCount).map(t=>({...t,referenceOnly:true,destinationId:'existing'}))});return;}
  if(type==='do-fetch'){
   const request=JSON.parse(data.options.body),input=request.messages[1].content;__resumeCalls++;
   const isFinal=typeof input==='string'&&JSON.parse(input).stage==='synthesis';
   if((__resumeMode==='build'?__resumeCalls===3:__resumeCalls===2)&&!window.__largeDup&&!window.__skipPause){reply({type:'api-response',reqId:data.reqId,error:'HTTP 429 暂停',status:429,retryAt:Date.now()});return;}
   if(typeof input==='string'&&JSON.parse(input).stage==='family-schema'){const all=JSON.parse(input);reply({type:'api-response',reqId:data.reqId,data:{choices:[{message:{content:JSON.stringify({reviewedCount:all.total,summary:'One avatar role',families:[{key:'avatar',name:'Avatar',sourceGroups:all.sources.map(g=>g.index),dimensions:['Variant']}]})}}]}});return;}
   let result;
   if(isFinal){const all=JSON.parse(input);__synthesisRequests.push(all);if(window.__holdSynthesis){window.__heldSynthesis=data.reqId;return;}
    if(__resumeMode==='build')result={reviewedCount:48,summary:'跨批次统一头像分组',groups:[{name:'Avatar',parts:all.sources.map(g=>({group:g.index}))}]};
    else if(__resumeMode==='matrix')result={reviewedCount:48,summary:'统筹三批',options:[{name:'最终布局',summary:'全局多属性建议',axesX:['Theme','Size'],axesY:['State'],groups:['Shape'],reasons:[]}]};
    else result={reviewedCount:all.numberOfCandidateUnits,summary:'已统筹全部查重批次',rejected:[]};
   }else{
    const count=input.filter(p=>p.type==='image_url').length;__seenImageCounts.push(count);if(count>20||!count)throw new Error('Invalid image batch size');if(JSON.stringify(input).includes('"layers"'))throw new Error('Descendant payload leaked');
    const records=input.filter(p=>p.type==='text').map(p=>JSON.parse(p.text)).filter(p=>p.id);
    if(request.messages[0].content.includes('reference-only'))result={summary:'Existing references',sets:[{id:'existing',appearance:'Other components',dimensions:[]}]};
    else if(__resumeMode==='build')result={summary:'Draft batch',groups:[{name:'Avatar',variants:records.map(t=>({id:t.id,values:{Variant:t.id}})),properties:[]}]};
    else if(__resumeMode==='matrix')result={summary:'Draft matrix',options:[{name:'截图布局',summary:'批次建议',axesX:['Size'],axesY:['State'],groups:['Shape','Theme'],reasons:{unexpected:'optional explanation'}}]};
    else result={pairs:[{aId:records.find(t=>t.side===0).id,bId:records.find(t=>t.side===1).id,similarity:'similar',reason:'same shape'}]};
   }
   reply({type:'api-response',reqId:data.reqId,data:{choices:[{message:{content:JSON.stringify(result)}}]}});return;
  }
  if(type==='layer-ai-build'){__builtPlans.push(data.plan);reply({type:'layer-ai-response',requestId:data.requestId,ok:true,message:'已构建'});return;}
  return __originalLayerPost(type,data);
 };
},tiny);
await route('componentBuilder');await page.locator('#builderAiVision').check();await page.getByRole('button',{name:'AI 读取并建议',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&document.querySelector('#builderAiCard .layer-feedback').textContent.includes('429'));
assert.equal(await page.evaluate(()=>__resumeCalls),3);assert.equal(await page.locator('#builderAiCard .layer-locate').count(),20);assert(await page.getByRole('button',{name:'按方案构建',exact:true}).isDisabled());await page.screenshot({path:`/tmp/${platform}-builder-paused-443.png`});
await page.locator('#builderContinue').click();await page.waitForFunction(()=>document.querySelector('#builderContinue').hidden&&!document.querySelector('.layer-job-banner'));
assert.equal(await page.evaluate(()=>__resumeCalls),7);assert.equal(await page.locator('#builderAiCard .layer-locate').count(),48);assert.equal(await page.evaluate(()=>__synthesisRequests[0].sources.length),3);assert.equal(await page.evaluate(()=>Math.max(...__seenImageCounts)),20);
await page.getByRole('button',{name:'按方案构建',exact:true}).click();await page.waitForFunction(()=>__builtPlans.length===1&&!document.querySelector('.layer-job-banner'));assert.equal(await page.evaluate(()=>__builtPlans[0].groups.length),1);assert.equal(await page.evaluate(()=>__builtPlans[0].groups[0].variants.length),48);
// Explicit cancellation at the final stage keeps all successful batches and retries only synthesis.
await page.evaluate(()=>{__resumeCalls=0;__skipPause=true;__holdSynthesis=true;__heldSynthesis=null});await page.getByRole('button',{name:'AI 读取并建议',exact:true}).click();await page.waitForFunction(()=>!!__heldSynthesis);
assert.equal(await page.evaluate(()=>__resumeCalls),6);assert(await page.getByRole('button',{name:'按方案构建',exact:true}).isDisabled());await page.locator('#builderAiCard').getByRole('button',{name:'取消',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.layer-job-banner'));assert.match(await page.locator('#builderAiCard .layer-feedback').innerText(),/已暂停/);assert.equal(await page.locator('#builderAiCard .layer-locate').count(),48);
assert.equal(await page.evaluate(()=>__cancelledIds.at(-1)),await page.evaluate(()=>__heldSynthesis));await page.evaluate(()=>__holdSynthesis=false);await page.locator('#builderContinue').click();await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&document.querySelector('#builderContinue').hidden);assert.equal(await page.evaluate(()=>__resumeCalls),7,'cancelled synthesis resumes without any image batches');await page.evaluate(()=>__skipPause=false);
await page.evaluate(()=>{__resumeMode='matrix';__resumeCalls=0;__synthesisRequests=[]});await route('compkit');const previousAxis=await page.locator('#matrixAxes select').nth(0).inputValue();await page.getByRole('button',{name:'AI 建议排列',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&!document.querySelector('#matrixContinue').hidden);
assert.equal(await page.evaluate(()=>__resumeCalls),2);assert.equal(await page.locator('#matrixAxes select').nth(0).inputValue(),previousAxis);assert(await page.locator('#btnCompKitShowcase').isDisabled());await page.screenshot({path:`/tmp/${platform}-matrix-paused-443.png`});
await page.locator('#matrixContinue').click();await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&document.querySelector('#matrixContinue').hidden);assert.equal(await page.evaluate(()=>__resumeCalls),5);assert.equal(await page.evaluate(()=>__synthesisRequests[0].batchReports.length),3);assert.match(await page.locator('.matrix-plan-detail').innerText(),/全局多属性建议/);assert(await page.locator('#btnCompKitShowcase').isEnabled());
await page.evaluate(()=>{__resumeMode='duplicate';__resumeCalls=0;__synthesisRequests=[]});await route('duplicate');await page.locator('#dupVisualSwitch').check();await page.evaluate(()=>runDupCheck());await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&!document.querySelector('#duplicateContinue').hidden);
assert.equal(await page.evaluate(()=>__resumeCalls),2);assert.equal(await page.locator('.dup-pair-item').count(),0,'draft pairs cannot be applied before final synthesis');assert.match(await page.locator('.layer-dup-progress').innerText(),/暂存 1 对/);await page.screenshot({path:`/tmp/${platform}-duplicate-paused-443.png`});
await page.locator('#duplicateContinue').click();await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&document.querySelector('#duplicateContinue').hidden);assert.equal(await page.evaluate(()=>__resumeCalls),6);assert.equal(await page.locator('.dup-pair-item').count(),4);assert.equal(await page.evaluate(()=>__synthesisRequests[0].batchReports.length),4);
await page.locator('.dup-pair-name').first().click();assert.equal(await page.evaluate(()=>__sent.at(-1).type),'focus-layers');assert.deepEqual(await page.evaluate(()=>__sent.at(-1).ids),['resume-0']);
await page.evaluate(()=>{__largeDup=true;__resumeCalls=0;__synthesisRequests=[];runDupCheck()});await page.waitForFunction(()=>!document.querySelector('.layer-job-banner')&&document.querySelectorAll('.dup-pair-item').length===200,{},{timeout:60000});
assert.equal(await page.evaluate(()=>__resumeCalls),1,'local exact groups still receive one final AI synthesis');assert.equal(await page.evaluate(()=>__synthesisRequests[0].candidates.length),1,'160000 pairs use one compact exact group');assert.match(await page.locator('#dupAIResultHint').innerText(),/160000/);
await page.locator('.dup-pair-item').first().locator('input').first().check();await page.locator('.layer-dup-progress').getByRole('button',{name:'下一页',exact:true}).click();assert.equal(await page.locator('.dup-pair-item').count(),200);assert(await page.locator('.dup-pair-item').first().locator('input').first().isChecked());
await page.locator('.dup-pair-name').nth(1).click();assert.deepEqual(await page.evaluate(()=>__sent.at(-1).ids),['resume-600']);
await page.evaluate(()=>{postMsg=__originalLayerPost;document.querySelector('.layer-completion')?.remove()});
// Navigation survives language changes and repeated routing; buttons stay compact.
for(const language of ['en','zh','en','zh']){await page.evaluate(lang=>changeLanguage(lang),language);await route('layerNaming');assert.equal(await page.locator('[data-nav=layerNaming]').count(),1);assert(await page.locator('[data-nav=layerNaming]').isVisible());}
await route('componentBuilder');for(const action of await page.locator('#builderAiCard .layer-actions button:visible').all()){assert((await action.boundingBox()).height<=29,'AI action uses compact height');}
await page.screenshot({path:`/tmp/${platform}-ai-compact.png`});
for(const key of ['select','componentBuilder','layerNaming','refiner','compkit','jumpback']){await route(key);for(const width of [440,340]){await page.setViewportSize({width,height:600});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,key+' overflow');}}
assert.deepEqual(errors,[],platform+' runtime errors');await page.close();
}console.log('Layer UI passed on both platforms: 800-name automatic 20-image batches and final synthesis, 429 resume in batch and synthesis stages, deferred application in all four vision workflows, compact 160000-pair synthesis, clickable layer titles, root-only image requests, multi-axis suggestions, navigation and narrow layouts.');}
finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
