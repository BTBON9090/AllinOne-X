/* Shared serial queue. A rate limit pauses the endpoint instead of replaying work. */
function createAITransport(send, fetcher) {
  let tail=Promise.resolve(),lastStart=0;
  const cancelled=new Set(),controllers=new Map(),cooldowns=new Map();
  const limited=(until)=>Object.assign(new Error(`AI 请求受限，已暂停。请在 ${Math.max(1,Math.ceil((until-Date.now())/1000))} 秒后点击继续解析；已完成结果会保留。`),{status:429,retryAt:until});
  const pause=(ms,id)=>new Promise((resolve,reject)=>{
    const end=Date.now()+ms;const tick=()=>{if(cancelled.has(id))return reject(new Error('已取消'));if(Date.now()>=end)return resolve();setTimeout(tick,Math.min(250,end-Date.now()));};tick();
  });
  async function execute({reqId,url,options}) {
    if(!/^https:\/\//i.test(url||''))throw new Error('AI 请求仅允许 HTTPS 地址');
    if(cancelled.has(reqId))throw new Error('已取消');
    const endpoint=url.replace(/\/+$/,'');
    if((cooldowns.get(endpoint)||0)>Date.now())throw limited(cooldowns.get(endpoint));
    await pause(Math.max(0,1000-(Date.now()-lastStart)),reqId);
    if(cancelled.has(reqId))throw new Error('已取消');
    lastStart=Date.now();
    const controller=typeof AbortController==='function'?new AbortController():null;
    if(controller)controllers.set(reqId,controller);
    let timer,response,data;
    try {
      const result=await Promise.race([(async()=>{const response=await fetcher(url,{...options,...(controller?{signal:controller.signal}:{})});return {response,raw:await response.text()};})(),new Promise((_,reject)=>{timer=setTimeout(()=>{controller?.abort();reject(new Error('AI 响应超时，已完成结果会保留，可继续解析'))},120000)})]);
      response=result.response;try{data=JSON.parse(result.raw)}catch(_){data=result.raw;}
    } finally {clearTimeout(timer);controllers.delete(reqId);}
    if(cancelled.has(reqId))throw new Error('已取消');
    const reportedStatus=Number(data?.error?.status||data?.error?.code||data?.statusCode);
    if(response.status===429||reportedStatus===429){
      const header=typeof response.headers?.get==='function'?response.headers.get('retry-after'):Object.entries(response.headersObject||response.headers||{}).find(([key])=>key.toLowerCase()==='retry-after')?.[1];
      const wait=header?(Number.isFinite(Number(header))?Number(header)*1000:Date.parse(header)-Date.now()):30000;
      const until=Date.now()+Math.max(1000,Number.isFinite(wait)?wait:30000);cooldowns.set(endpoint,until);throw limited(until);
    }
    if(response.ok)return data;
    const detail=typeof data==='string'?data:data?.error?.message||data?.message||'';
    throw Object.assign(new Error(`HTTP ${response.status}${detail?' · '+String(detail).slice(0,240):''}`),{status:response.status});
  }
  return {
    request(message){
      send({type:'api-progress',reqId:message.reqId,message:'AI 请求已排队，请保持插件打开。'});
      tail=tail.then(()=>execute(message)).then(data=>send({type:'api-response',reqId:message.reqId,data}),error=>send({type:'api-response',reqId:message.reqId,error:String(error.message||error),status:error.status,retryAt:error.retryAt})).finally(()=>cancelled.delete(message.reqId));
      return tail;
    },
    cancel(id){cancelled.add(id);controllers.get(id)?.abort();if(cancelled.size>1000)cancelled.delete(cancelled.values().next().value);}
  };
}
