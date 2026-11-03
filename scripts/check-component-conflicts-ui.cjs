const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');

(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
 try{for(const platform of ['figma','mastergo']){
  const page=await browser.newPage({viewport:{width:440,height:650}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));await page.route('https://**/*',route=>route.abort());
  await page.addInitScript(()=>{window.parent.postMessage=()=>{};});
  await page.goto('file://'+path.resolve(platform,'ui.html'));await page.waitForFunction(()=>!!window.LayerWorkspace);
  await page.evaluate(()=>{
   aiConfig={provider:'deepseek',model:'deepseek-v4-flash',baseUrl:'https://example.test/v1',key:'fixture'};
   const canvas=document.createElement('canvas');canvas.width=canvas.height=32;const image=canvas.toDataURL('image/png');
   const targets=Array.from({length:150},(_,i)=>({id:'frame-'+i,name:'Avatar '+i,type:'FRAME',width:32,height:32,parentId:'page',image}));
   window.__requests=[];window.__accepted=[];window.__finalInputs=[];window.__applied=[];window.__focused=[];
   const limited=new Set(),original=postMsg,reply=message=>setTimeout(()=>dispatchEvent(new MessageEvent('message',{data:{pluginMessage:message}})),0);
   postMsg=(type,data={})=>{
    const success=extra=>reply({type:'layer-ai-response',requestId:data.requestId,ok:true,...extra});
    if(type==='layer-ai-read'){success({context:{token:'collision-150',targets,paged:true}});return;}
    if(type==='layer-ai-chunk'){success({targets:targets.slice(data.offset,data.offset+data.limit),nextOffset:Math.min(150,data.offset+data.limit)});return;}
    if(type==='layer-focus'){__focused.push(data.id);success({});return;}
    if(type==='layer-ai-build'){__applied.push(data.plan);success({message:'Applied all 150'});return;}
    if(type==='do-fetch'){
     const body=JSON.parse(data.options.body),content=body.messages[1].content;
     const send=value=>reply({type:'api-response',reqId:data.reqId,data:{choices:[{finish_reason:'stop',message:{content:JSON.stringify(value)}}]}});
     if(typeof content==='string'){
      const input=JSON.parse(content);if(input.stage==='family-schema'){send({reviewedCount:150,summary:'One family',families:[{key:'avatar',name:'Avatar',sourceGroups:input.sources.map(g=>g.index),dimensions:['Size']}]});return;}__finalInputs.push(input);
      // Model leaves the duplicate combinations unresolved, including a collision
      // introduced by merging two individually valid batches (frames 0 and 120).
      send({reviewedCount:150,summary:'All batches reviewed',groups:[{name:'Avatar',parts:input.sources.map(source=>({group:source.index}))}]});return;
     }
     const records=content.filter(part=>part.type==='text').map(part=>JSON.parse(part.text)).filter(target=>target.id);
     const images=content.filter(part=>part.type==='image_url').length;if(images>20)throw new Error('More than 20 images');
     __requests.push(records.map(target=>target.id));
     const first=records[0].id;
     if(['frame-80','frame-100'].includes(first)&&!limited.has(first)){
      limited.add(first);reply({type:'api-response',reqId:data.reqId,error:'HTTP 429 fixture pause',status:429,retryAt:Date.now()});return;
     }
     __accepted.push(...records.map(target=>target.id));
     send({summary:'Observed avatars; two objects need final property review',suggestions:['Preserve both source IDs even if their current property tuples are identical.'],groups:[{name:'Avatar',variants:records.map(target=>({id:target.id,values:{Size:target.id==='frame-81'?'frame-80':target.id==='frame-120'?'frame-0':target.id}})),properties:[]}]});return;
    }
    return original(type,data);
   };
   PluginWorkspace.navigate('componentBuilder');
  });
  const idle=()=>page.waitForFunction(()=>!document.querySelector('.layer-job-banner'));
  const feedback=page.locator('#builderAiCard .layer-feedback'),apply=page.getByRole('button',{name:'按方案构建',exact:true});
  await page.getByRole('button',{name:'AI 读取并建议',exact:true}).click();await idle();
  assert.match(await feedback.innerText(),/80\/150/);assert(await apply.isDisabled());
  await page.locator('#builderContinue').click();await idle();
  assert.match(await feedback.innerText(),/100\/150/,'duplicate draft must commit instead of pausing at 80');
  assert.equal(await page.locator('#builderAiCard .layer-locate').count(),100);assert(await apply.isDisabled());
  assert.match(await page.locator('[data-component-conflicts]').innerText(),/2 个对象.*已暂存/);
  await page.locator('#builderAiCard .layer-locate').nth(80).click();assert.equal(await page.evaluate(()=>__focused.at(-1)),'frame-80');
  await page.locator('#builderContinue').click();await idle();
  assert(await page.locator('#builderContinue').isHidden());assert(await apply.isEnabled());
  assert.match(await feedback.innerText(),/150\/150/);
  assert.equal(await page.locator('#builderAiCard .layer-locate').count(),150);
  assert.match(await page.locator('[data-component-conflicts]').innerText(),/4 个对象.*独立组件/);
  assert.equal(await page.evaluate(()=>__accepted.length),150);assert.equal(await page.evaluate(()=>new Set(__accepted).size),150);
  assert.equal(await page.evaluate(()=>__requests.filter(ids=>Number(ids[0].split('-')[1])<80).length),4,'completed first 80 must never be re-uploaded');
  assert.equal(await page.evaluate(()=>__requests.filter(ids=>ids[0]==='frame-80').length),2,'one rate limit plus one accepted collision draft, no format-repair loop');
  assert.equal(await page.evaluate(()=>__finalInputs.length),1,'unresolved final tuples need no repeated model call');
  assert.equal(await page.evaluate(()=>__finalInputs[0].total),150);
  assert.deepEqual(await page.evaluate(()=>__finalInputs[0].conflicts.flatMap(conflict=>conflict.ids)),['frame-80','frame-81']);
  assert.equal(await page.evaluate(()=>JSON.stringify(__finalInputs[0]).includes('data:image/')),false,'synthesis must not re-upload images');
  await page.screenshot({path:`/tmp/${platform}-component-conflicts-445.png`});
  await apply.click();await idle();
  assert.match(await feedback.innerText(),/4 个对象因属性组合冲突保留为独立组件/);
  const plan=await page.evaluate(()=>__applied[0]);
  assert.equal(plan.groups.length,5);assert.equal(plan.groups[0].variants.length,146);
  assert.deepEqual([...plan.standaloneIds].sort(),['frame-0','frame-120','frame-80','frame-81']);
  const ids=plan.groups.flatMap(group=>group.variants.map(variant=>variant.id));assert.equal(ids.length,150);assert.equal(new Set(ids).size,150);
  for(const group of plan.groups.slice(1)){assert.equal(group.variants.length,1);assert.deepEqual(group.variants[0].values,{});assert.equal(group.destinationId,undefined);}
  assert.deepEqual(errors,[]);await page.close();
  console.log(platform+': 80 → 100 → 150 resumes through duplicate draft tuples; one synthesis, 146 variants + all 4 ambiguous objects standalone, no repeated completed requests, image cap and clickable titles passed.');
 }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
