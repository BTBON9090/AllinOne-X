const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
try{for(const platform of ['figma','mastergo']){
 const page=await browser.newPage({viewport:{width:440,height:650}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());
 await page.addInitScript(()=>{window.__sent=[];window.parent.postMessage=m=>{if(m.pluginMessage)__sent.push(m.pluginMessage)};});
 await page.goto('file://'+path.resolve(platform,'ui.html'));await page.waitForFunction(()=>!!window.LayerWorkspace);
 await page.evaluate(()=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=24;const image=canvas.toDataURL('image/png');
  aiConfig={provider:'deepseek',model:'deepseek-v4-flash',baseUrl:'https://example.test/v1',key:'fixture'};
  window.__mode='build';window.__calls=[];window.__successful=[];window.__finals=[];window.__applied=[];window.__limited=false;window.__finalCut=false;
  const original=postMsg,reply=m=>setTimeout(()=>dispatchEvent(new MessageEvent('message',{data:{pluginMessage:m}})),0);
  postMsg=(type,data={})=>{
   if(type==='layer-ai-read'){
    const count=__mode==='build'?150:__mode==='duplicate'?24:__mode==='single'?1:45;
    const targets=Array.from({length:count},(_,i)=>({id:'object-'+i,name:'Size='+i+', State=On',width:48,height:48,parentId:'parent',side:i<12?0:1,image,values:{Size:String(i),State:'On'}}));
    reply({type:'layer-ai-response',requestId:data.requestId,ok:true,context:{token:'recovery-'+__mode,targets,totalLayers:count}});return;
   }
   if(type==='do-fetch'){
    const body=JSON.parse(data.options.body),content=body.messages[1].content;
    if(body.thinking?.type!=='disabled')throw new Error('Known thinking model must use documented direct-output option');
    const final=typeof content==='string'&&JSON.parse(content).stage==='synthesis';
    const records=Array.isArray(content)?content.filter(p=>p.type==='text').map(p=>JSON.parse(p.text)).filter(p=>p.id):[];
    const imageCount=Array.isArray(content)?content.filter(p=>p.type==='image_url').length:0;if(imageCount>20)throw new Error('Image cap violated');
    __calls.push({mode:__mode,ids:records.map(t=>t.id),imageCount,final});
    const send=(value,cut=false)=>reply({type:'api-response',reqId:data.reqId,data:{choices:[{finish_reason:cut?'length':'stop',message:{content:typeof value==='string'?value:JSON.stringify(value)}}]}});
    if(typeof content==='string'&&JSON.parse(content).stage==='family-schema'){const input=JSON.parse(content);send({reviewedCount:input.total,summary:'Global family',families:[{key:'avatar',name:'Avatar',sourceGroups:input.sources.map(g=>g.index),dimensions:['Size']}]});return;}
    if(final){const input=JSON.parse(content);__finals.push(input);
     if(__mode==='naming'&&!__finalCut){__finalCut=true;send('{"summary":',true);return;}
     if(__mode==='build')send({reviewedCount:150,summary:'All 150 objects unified',groups:[{name:'Avatar',parts:input.sources.map(g=>({group:g.index}))}]});
     else if(__mode==='naming')send({reviewedCount:45,summary:'Names unified',renames:[],overrides:[]});
     else if(__mode==='matrix')send({reviewedCount:45,summary:'Matrix unified',options:[{name:'Final',axesX:['Size'],axesY:['State'],groups:[],reasons:[]}]});
     else send({reviewedCount:input.numberOfCandidateUnits,summary:'No visual matches',rejected:[]});return;
    }
    if(__mode==='single'||records.length>(__mode==='build'?5:10)){send('{"incomplete":',true);return;}
    if(__mode==='build'&&records[0]?.id==='object-5'&&!__limited){__limited=true;reply({type:'api-response',reqId:data.reqId,error:'HTTP 429 暂停',status:429,retryAt:Date.now()});return;}
    __successful.push({mode:__mode,ids:records.map(t=>t.id),sides:records.map(t=>t.side)});
    if(__mode==='build')send({summary:'Draft',groups:[{name:'Avatar',variants:records.map(t=>({id:t.id,values:{Size:t.id}})),properties:[]}]},true); // Complete JSON with length is valid after schema checks.
    else if(__mode==='naming')send({names:records.map(t=>({id:t.id,name:'搜索'}))},true);
    else if(__mode==='matrix')send({summary:'Draft',options:[{name:'Draft',axesX:['Size'],axesY:['State'],groups:[],reasons:[]}]});
    else send({pairs:[]});return;
   }
   if(type==='layer-ai-build'||type==='layer-ai-rename'){__applied.push(data);reply({type:'layer-ai-response',requestId:data.requestId,ok:true,message:'Applied'});return;}
   return original(type,data);
  };
 });
 const route=key=>page.evaluate(key=>PluginWorkspace.navigate(key),key),idle=()=>page.waitForFunction(()=>!document.querySelector('.layer-job-banner'));
 await route('componentBuilder');await page.getByRole('button',{name:'AI 读取并建议',exact:true}).click();await idle();
 assert.match(await page.locator('#builderAiCard .layer-feedback').innerText(),/429/);assert.equal(await page.locator('#builderAiCard .layer-locate').count(),5);assert(await page.getByRole('button',{name:'按方案构建',exact:true}).isDisabled());
 assert.deepEqual(await page.evaluate(()=>__calls.map(c=>c.imageCount)),[20,10,5,5]);
 await page.locator('#builderContinue').click();await idle();assert(await page.locator('#builderContinue').isHidden());assert.equal(await page.locator('#builderAiCard .layer-locate').count(),150);
 const successful=await page.evaluate(()=>__successful.flatMap(c=>c.ids));assert.equal(successful.length,150);assert.equal(new Set(successful).size,150);assert.equal(await page.evaluate(()=>__finals[0].total),150);
 await page.getByRole('button',{name:'按方案构建',exact:true}).click();await idle();assert.equal(await page.evaluate(()=>__applied[0].plan.groups[0].variants.length),150);
 await page.evaluate(()=>{__mode='naming';__calls=[];__successful=[];__finals=[]});await route('layerNaming');await page.getByRole('button',{name:'AI 识图命名',exact:true}).click();await idle();
 assert.equal(await page.locator('.layer-name-row').count(),45);assert(await page.getByRole('button',{name:'应用勾选名称'}).isEnabled());assert.equal(await page.evaluate(()=>__finals.length),2,'one compact synthesis retry');assert.equal(await page.evaluate(()=>__successful.flatMap(c=>c.ids).length),45);
 await page.evaluate(()=>{__mode='matrix';__calls=[];__successful=[];__finals=[];dispatchEvent(new MessageEvent('message',{data:{pluginMessage:{type:'compkit-props',targetId:'set',properties:['Size','State'],componentName:'Avatar',propertyValues:{},variantsCount:45}}}))});await route('compkit');await page.getByRole('button',{name:'AI 建议排列',exact:true}).click();await idle();
 assert(await page.locator('#matrixContinue').isHidden());assert(await page.locator('#btnCompKitShowcase').isEnabled());assert.equal(await page.evaluate(()=>__successful.flatMap(c=>c.ids).length),45);assert.equal(await page.evaluate(()=>__finals[0].batchReports.length),5);
 await page.evaluate(()=>{__mode='duplicate';__calls=[];__successful=[];__finals=[]});await route('duplicate');await page.locator('#dupVisualSwitch').check();await page.evaluate(()=>runDupCheck());await idle();assert(await page.locator('#duplicateContinue').isHidden());
 const coverage=await page.evaluate(()=>{const pairs=new Set();for(const run of __successful){const left=run.ids.filter((_,i)=>run.sides[i]===0),right=run.ids.filter((_,i)=>run.sides[i]===1);for(const a of left)for(const b of right)pairs.add(a+'|'+b);}return pairs.size;});assert.equal(coverage,144,'adaptive duplicate requests keep every original cross-side comparison');
 await page.evaluate(()=>{__mode='single';__calls=[]});await route('componentBuilder');await page.getByRole('button',{name:'AI 读取并建议',exact:true}).click();await idle();assert.equal(await page.evaluate(()=>__calls.length),1);assert.match(await page.locator('#builderAiCard .layer-feedback').innerText(),/单个对象/);assert(await page.getByRole('button',{name:'按方案构建',exact:true}).isDisabled());
 await page.screenshot({path:`/tmp/${platform}-ai-recovery-444.png`});assert.deepEqual(errors,[]);await page.close();console.log(platform+': 150-object 20→10→5 recovery, partial checkpoint + 429, complete length-marked JSON, final compact retry, matrix splitting, exhaustive duplicate split and bounded single-object failure passed.');
}}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
