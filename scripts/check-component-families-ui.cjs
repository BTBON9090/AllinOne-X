const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
try{for(const platform of ['figma','mastergo']){
 const page=await browser.newPage({viewport:{width:440,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());
 await page.addInitScript(()=>{window.parent.postMessage=()=>{};});await page.goto('file://'+path.resolve(platform,'ui.html'));await page.waitForFunction(()=>!!window.LayerWorkspace);
 await page.evaluate(()=>{
  aiConfig={provider:'deepseek',model:'deepseek-v4-flash',baseUrl:'https://example.test/v1',key:'fixture'};
  const canvas=document.createElement('canvas');canvas.width=canvas.height=32;const image=canvas.toDataURL('image/png'),targets=[],values=new Map();
  const dimensions=['Size','Shape','Content','Palette','Edit'];
  for(const shape of ['Circle','Rounded square'])for(const [content,palette] of [['Person','Blue'],['Person','Neutral'],['Initial','Neutral'],['Photo','Photo'],['Brand','Brand']])for(const size of [16,24,32,40,64])for(const edit of ['None','Corner badge','Dimmed camera overlay']){
   const id='avatar-'+targets.length,sourceSetId=shape==='Circle'?'round':'square';
   targets.push({id,name:`Avatar ${shape} ${content}`,type:'COMPONENT',parentId:sourceSetId,sourceSetId,buildParentId:'page',width:size,height:size,image});values.set(id,{Size:String(size),Shape:shape,Content:content,Palette:palette,Edit:edit});
  }
  window.__images=[];window.__schemaCalls=0;window.__finalCalls=0;window.__applied=null;window.__read=null;window.__chunkCalls=[];
  const original=postMsg,reply=m=>setTimeout(()=>dispatchEvent(new MessageEvent('message',{data:{pluginMessage:m}})),0);
  postMsg=(type,data={})=>{
   const success=extra=>reply({type:'layer-ai-response',requestId:data.requestId,ok:true,...extra});
   if(type==='layer-ai-read'){__read=data;success({context:{token:'families',consolidate:true,targets,paged:true,destinations:[],sourceSets:[{id:'round'},{id:'square'}]}});return;}
   if(type==='layer-ai-chunk'){__chunkCalls.push(data.offset);success({targets:targets.slice(data.offset,data.offset+data.limit),nextOffset:Math.min(150,data.offset+data.limit)});return;}
   if(type==='layer-ai-build'){__applied=data.plan;success({message:'Created consolidated copy; original instances retained'});return;}
   if(type==='do-fetch'){
    const body=JSON.parse(data.options.body),content=body.messages[1].content;
    if(!body.messages[0].content.includes('Component family synthesis'))throw new Error('Embedded skill missing from an AI stage');
    const send=result=>reply({type:'api-response',reqId:data.reqId,data:{choices:[{message:{content:JSON.stringify(result)}}]}});
    const pause=()=>reply({type:'api-response',reqId:data.reqId,error:'HTTP 429 fixture pause',status:429,retryAt:Date.now()});
    if(typeof content==='string'){
     const input=JSON.parse(content);if(content.includes('data:image/'))throw new Error('Global steps should not re-upload images');
     if(input.stage==='family-schema'){
      __schemaCalls++;if(__schemaCalls===1){pause();return;}
      send({reviewedCount:150,summary:'同一头像用途，以属性表示外观差异',families:[{key:'avatar',name:'Avatar',sourceGroups:input.sources.map(s=>s.index),dimensions,reason:'形状和编辑装饰不改变头像用途'}]});return;
     }
     __finalCalls++;if(__finalCalls===1){pause();return;}
     if(input.familySchema.families[0].ids.length!==150)throw new Error('Global schema lost sources');
     // Even if the model repeats fragment names, the approved functional family
     // and shared dimensions control the final set boundaries.
     send({reviewedCount:150,summary:'150 个头像，统一五个实际属性，保留全部原始外观',groups:input.sources.map(s=>({name:s.name,parts:[{group:s.index}]}))});return;
    }
    const records=content.filter(p=>p.type==='text').map(p=>JSON.parse(p.text)).filter(p=>p.id),count=content.filter(p=>p.type==='image_url').length;
    if(count>20||records.some(t=>t.parentId!=='page'))throw new Error('Invalid root image batch');__images.push(count);
    const groups=new Map();for(const t of records){const value=values.get(t.id),name='Avatar-'+value.Shape+'-'+value.Content+'-'+value.Palette;if(!groups.has(name))groups.set(name,{name,family:'Avatar',variants:[],properties:[]});groups.get(name).variants.push({id:t.id,values:value,evidence:'Base content retained under independent editing affordance'});}
    send({summary:'Observed all root differences',groups:[...groups.values()]});return;
   }
   return original(type,data);
  };
  PluginWorkspace.navigate('componentBuilder');
 });
 const idle=()=>page.waitForFunction(()=>!document.querySelector('.layer-job-banner')),apply=page.getByRole('button',{name:'按方案构建',exact:true}),feedback=page.locator('#builderAiCard .layer-feedback');
 await page.getByRole('button',{name:'AI 读取并建议',exact:true}).click();await idle();assert.equal(await page.evaluate(()=>__read.consolidate),true);assert.equal(await page.evaluate(()=>__schemaCalls),1);assert.equal(await page.evaluate(()=>__images.length),8);assert(await apply.isDisabled());assert.match(await feedback.innerText(),/全局属性规划/);
 await page.locator('#builderContinue').click();await idle();assert.equal(await page.evaluate(()=>__schemaCalls),2);assert.equal(await page.evaluate(()=>__finalCalls),1);assert.equal(await page.evaluate(()=>__images.length),8);assert(await apply.isDisabled());assert.match(await feedback.innerText(),/统筹分析/);
 await page.locator('#builderContinue').click();await idle();assert.equal(await page.evaluate(()=>__schemaCalls),2,'synthesis resume must reuse the approved schema');assert.equal(await page.evaluate(()=>__finalCalls),2);assert.equal(await page.evaluate(()=>__images.length),8,'no re-upload after either interruption');assert.deepEqual(await page.evaluate(()=>__chunkCalls),[0,20,40,60,80,100,120,140]);
 assert.match(await feedback.innerText(),/150\/150/);assert.equal(await page.locator('#builderAiCard .layer-plan-group').count(),1);assert.equal(await page.locator('#builderAiCard .layer-locate').count(),150);assert(await apply.isEnabled());assert(await page.locator('[data-component-conflicts]').isHidden());
 await page.screenshot({path:`/tmp/${platform}-component-families-446.png`});await apply.click();await idle();
 const plan=await page.evaluate(()=>__applied);assert.equal(plan.groups.length,1);assert.equal(plan.groups[0].name,'Avatar');assert.equal(plan.groups[0].variants.length,150);assert.equal(new Set(plan.groups[0].variants.map(v=>JSON.stringify(Object.entries(v.values).sort()))).size,150);assert.equal(plan.standaloneIds.length,0);assert.deepEqual(errors,[]);await page.close();
 console.log(platform+': 150 avatars from multiple sets → one family; all five dimensions and source IDs retained, eight ≤20-image batches, schema/synthesis pauses resume independently, embedded skill used in all stages.');
}}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
