import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const context=vm.createContext({setTimeout,clearTimeout,AbortController,Date,console});
vm.runInContext(read('shared/layer-ai-core.js')+';globalThis.ai=LayerAI;'+read('shared/ai-transport.js'),context);
const {ai}=context;
assert.equal(ai.LIMIT,800);
assert.equal(ai.parse('```json\n{"name":"escaped \\\" } brace"}\n```').name,'escaped " } brace');
assert.equal(ai.parse('<think>reasoning { invalid }</think> result {"groups":[]} trailing text').groups.length,0);
assert.equal(ai.parse([{type:'text',text:'{"ok":true}'}]).ok,true);
assert.throws(()=>ai.parse('{"groups":['));
assert.throws(()=>ai.parse('{"groups":[{"name":"nested"}]'));
assert.equal(ai.parse('Note {invalid} then {"ok":true}').ok,true);
assert.equal(ai.semanticName('蓝色线性搜索'),'搜索');assert.equal(ai.semanticName('Purple filled User'),'User');assert.equal(ai.semanticName('Arrow up'),'Arrow up');
const targets=[{id:'1',parentId:'p'},{id:'2',parentId:'p'}];
const plan={groups:[{name:'Avatar',variants:[{id:'1',values:{Size:'L'}},{id:'2',values:{Size:'S'}}]}]};
assert.equal(ai.validate(plan,targets),plan);assert.throws(()=>ai.validate({...plan,groups:[{...plan.groups[0],variants:[{id:'1',values:{Size:'L'}}]}]},targets));
assert.throws(()=>ai.validate({groups:[{name:'Avatar',variants:[{id:'1',values:{Size:'L'}},{id:'1',values:{Size:'S'}}]}]},targets));
assert.equal(ai.merge(targets.map((t,i)=>({groups:[{name:'Avatar',variants:[{id:t.id,values:{Size:i?'S':'L'}}],properties:[]}]})),targets).groups.length,1);
assert.equal(ai.BATCH_SIZE,20);ai.checkImages(Array.from({length:20},()=>({type:'image_url'})));assert.throws(()=>ai.checkImages(Array.from({length:21},()=>({type:'image_url'}))));
assert.throws(()=>ai.validate({groups:[{name:'Bad',variants:[{id:'1',values:'invalid'}]}]},[targets[0]]));
const draftPlans=[{groups:[{name:'Avatar',variants:[{id:'1',values:{Size:'L'}}]}]},{groups:[{name:'头像',variants:[{id:'2',values:{尺寸:'小'}}]}]}];
const finalRecipe={reviewedCount:2,summary:'Unify across batches',groups:[{name:'头像',parts:[{group:0,propertyMap:{Size:'尺寸'},valueMap:{Size:{L:'大'}}},{group:1}]}]};
const combined=ai.synthesizeBuild(finalRecipe,draftPlans,targets);assert.equal(combined.groups.length,1);assert.equal(combined.groups[0].variants[0].values.尺寸,'大');assert.equal(combined.groups[0].variants[1].values.尺寸,'小');
assert.throws(()=>ai.synthesizeBuild({...finalRecipe,reviewedCount:1},draftPlans,targets));
assert.throws(()=>ai.synthesizeBuild({...finalRecipe,groups:[{name:'Lost',parts:[{group:0}]}]},draftPlans,targets));
assert.throws(()=>ai.synthesizeBuild({...finalRecipe,groups:[{name:'Duplicate',parts:[{group:0},{group:0}]}]},draftPlans,targets));
assert.throws(()=>ai.synthesizeBuild({...finalRecipe,groups:[{name:'Bad',parts:[{group:99}]}]},draftPlans,targets));
const split=ai.synthesizeBuild({reviewedCount:2,summary:'Separate observed meanings',groups:[{name:'First',parts:[{group:0,ids:['1']}]},{name:'Second',parts:[{group:0,ids:['2']}]}]},[plan],targets);assert.equal(split.groups.length,2);
// Draft classification collisions must never discard recognized source objects or
// cause the next click on Continue to request the same successful batch forever.
const collision={groups:[{name:'Avatar',variants:targets.map(t=>({id:t.id,values:{Size:'32'}})),properties:[]}]};
assert.throws(()=>ai.validate(collision,targets),/重复变体/);
assert.equal(ai.validate(collision,targets,{draft:true}),collision);
for(const variants of [[collision.groups[0].variants[0]],[collision.groups[0].variants[0],collision.groups[0].variants[0]],[{id:'unknown',values:{Size:'32'}},collision.groups[0].variants[0]]])assert.throws(()=>ai.validate({groups:[{name:'Bad',variants}]},targets,{draft:true}),/遗漏|未知或重复/);
const snapshot=JSON.stringify(collision),resolved=ai.finalizeBuild(collision,targets);
assert.equal(JSON.stringify(collision),snapshot,'finalizing never mutates saved drafts');
assert.equal(resolved.groups.length,2);assert.equal(resolved.standaloneIds.length,2,'both ambiguous members remain standalone');assert.equal(resolved.conflicts[0].reason,'duplicate');
for(const group of resolved.groups){assert.equal(group.variants.length,1);assert.deepEqual(Object.keys(group.variants[0].values),[]);assert.equal(group.destinationId,undefined);}
assert.equal(new Set(resolved.groups.flatMap(g=>g.variants.map(v=>v.id))).size,2);
const observed=ai.synthesizeBuild({reviewedCount:2,summary:'Observed root colors distinguish avatars',groups:[{name:'Avatar',parts:[{group:0}],overrides:[{id:'1',values:{Size:'32',Theme:'Blue'}},{id:'2',values:{Size:'32',Theme:'Gray'}}]}]},[collision],targets,{draft:true});
assert.equal(ai.finalizeBuild(observed,targets).standaloneIds.length,0,'real evidence can resolve the collision');
for(const values of [[{State:'On, hover'},{State:'On= hover'}],[{'State,':'On'},{'State,':'On'}],[{State:'x'.repeat(100)+'a'},{State:'x'.repeat(100)+'b'}]]){
 const candidate={groups:[{name:'Cleaned',variants:targets.map((t,i)=>({id:t.id,values:values[i]}))}]};
 assert.equal(ai.finalizeBuild(candidate,targets).standaloneIds.length,2,'host normalization cannot reintroduce duplicate tuples');
}
const duplicateKeys={groups:[{name:'Keys',variants:targets.map((t,i)=>({id:t.id,values:{'State,':'On','State=':String(i)}}))}]};
assert.equal(ai.finalizeBuild(duplicateKeys,targets).standaloneIds.length,2,'normalization must not silently erase a property');
const destinations=[{id:'set',variants:[{values:{Size:'32'}}]}];
const occupied={groups:targets.map(t=>({name:'Avatar',destinationId:'set',variants:[{id:t.id,values:{Size:'32'}}]}))};
assert.equal(ai.finalizeBuild(occupied,targets,destinations).conflicts[0].reason,'occupied');
assert.equal(ai.finalizeBuild(occupied,targets,destinations).standaloneIds.length,2,'occupied destination checked across all incoming groups');
assert.equal(ai.finalizeBuild(occupied,targets,[{id:'set',variants:[{values:{Size:'16'}}]}]).standaloneIds.length,2,'incoming collisions across separate groups are all isolated');
const incompatible={groups:targets.map(t=>({name:'Avatar',destinationId:'set',variants:[{id:t.id,values:{Width:'32'}}]}))};
assert.equal(ai.finalizeBuild(incompatible,targets,destinations).standaloneIds.length,2);
assert.throws(()=>ai.finalizeBuild(occupied,targets,[]),/未知目标/);
const crossBatch=ai.synthesizeBuild({reviewedCount:2,summary:'Merge two batches',groups:[{name:'Avatar',parts:[{group:0},{group:1}]}]},targets.map(t=>({groups:[{name:'Avatar',variants:[{id:t.id,values:{Size:'32'}}]}]})),targets,{draft:true});
assert.equal(ai.finalizeBuild(crossBatch,targets).standaloneIds.length,2,'final merge collisions are isolated too');
const suggested=[{id:'1',name:'搜索'},{id:'2',name:'搜索'}];
const unified=ai.synthesizeNames({reviewedCount:2,summary:'Canonical terms',renames:[{from:'搜索',to:'蓝色查找'}],overrides:[{id:'2',name:'返回'}]},suggested);assert.equal(unified[0].name,'查找');assert.equal(unified[1].name,'返回');
assert.throws(()=>ai.synthesizeNames({reviewedCount:2,summary:'Wrong ID',renames:[],overrides:[{id:'3',name:'未知'}]},suggested));
assert.throws(()=>ai.synthesizeNames({reviewedCount:2,summary:'Bad term',renames:[{from:'搜索',to:'蓝色'}],overrides:[]},suggested));
const units=[{id:'first',pairs:[1,2]},{id:'second',pairs:[3]}];assert.equal(ai.synthesizePairs({reviewedCount:2,summary:'Remove false match',rejected:['second']},units).length,2);assert.throws(()=>ai.synthesizePairs({reviewedCount:2,summary:'Unknown',rejected:['unknown']},units));
// The final recipe stays compact with 800 objects and still proves exact source coverage.
const manyTargets=Array.from({length:800},(_,i)=>({id:String(i)})),manyPlans=Array.from({length:40},(_,i)=>({groups:[{name:'Icon',variants:manyTargets.slice(i*20,i*20+20).map(t=>({id:t.id,values:{Content:t.id}}))}]}));
const manyFinal=ai.synthesizeBuild({reviewedCount:800,summary:'All batches reviewed',groups:[{name:'Icon',parts:manyPlans.map((_,group)=>({group}))}]},manyPlans,manyTargets);assert.equal(manyFinal.groups[0].variants.length,800);
// Output truncation reduces only the failed range; HTTP 429 never triggers automatic splitting/retries.
assert.throws(()=>ai.responseText({choices:[{finish_reason:'length',message:{content:'{"ok":true}'}}]}),e=>e.code==='AI_OUTPUT_TRUNCATED'&&e.output==='{"ok":true}');
assert.throws(()=>ai.responseText({stop_reason:'max_tokens',content:[{type:'text',text:'{'}]}),e=>e.code==='AI_OUTPUT_TRUNCATED');
assert.equal(ai.responseText({choices:[{message:{content:[{type:'text',text:'ok'}]}}]}),'ok');
const adaptiveState={offset:0},committed=[],attempts=[];let limitedOnce=false;
const work=async items=>{attempts.push(items.length);if(items.length>5)throw Object.assign(new Error('truncated'),{code:'AI_OUTPUT_TRUNCATED'});if(items[0]===5&&!limitedOnce){limitedOnce=true;throw Object.assign(new Error('429'),{status:429});}return items;};
const commit=(result,items)=>{committed.push(...result);adaptiveState.offset+=items.length;};
await assert.rejects(ai.adaptive(adaptiveState,Array.from({length:20},(_,i)=>i),work,commit),e=>e.status===429);assert.equal(adaptiveState.offset,5);assert.equal(adaptiveState.batchSize,5);assert.deepEqual(attempts,[20,10,5,5]);
await ai.adaptive(adaptiveState,Array.from({length:15},(_,i)=>i+5),work,commit);assert.equal(adaptiveState.offset,20);assert.equal(new Set(committed).size,20);
let singleCalls=0;await assert.rejects(ai.adaptive({},[1],async()=>{singleCalls++;throw Object.assign(new Error('cut'),{code:'AI_OUTPUT_TRUNCATED'});},()=>{}));assert.equal(singleCalls,1);
const pending=[[[1,2,3],[4,5,6,7]]],covered=new Set();while(pending.length){const pair=pending.shift();if(pair[0].length+pair[1].length>3)pending.push(...ai.splitComparison(pair));else for(const a of pair[0])for(const b of pair[1])covered.add(a+':'+b);}assert.equal(covered.size,12,'comparison splitting preserves every cross-side pair');
const messages=[];let active=0,max=0,calls=0;
const transport=context.createAITransport(m=>messages.push(m),async()=>{
 active++;max=Math.max(max,active);await new Promise(r=>setTimeout(r,2));active--;calls++;
 const limited=calls===1;return {ok:!limited,status:limited?429:200,headers:{get:()=>limited?'0':null},text:async()=>JSON.stringify(limited?{error:{message:'Rate limited'}}:{choices:[{message:{content:'{"ok":true}'}}]})};
});
const first=transport.request({reqId:'first',url:'https://example.test/v1',options:{}});
const second=transport.request({reqId:'second',url:'https://example.test/v1',options:{}});
const skipped=transport.request({reqId:'cancelled',url:'https://example.test/v1',options:{}});transport.cancel('cancelled');
await Promise.all([first,second,skipped]);assert.equal(max,1);assert.equal(calls,1,'429 stops queued requests instead of replaying');assert.equal(messages.find(m=>m.reqId==='cancelled'&&m.type==='api-response').error,'已取消');
for(const id of ['first','second']){const result=messages.find(m=>m.reqId===id&&m.type==='api-response');assert.equal(result.status,429);assert(result.retryAt>Date.now());}
await new Promise(r=>setTimeout(r,1050));await transport.request({reqId:'continue',url:'https://example.test/v1',options:{}});assert.equal(calls,2);assert(messages.find(m=>m.reqId==='continue'&&m.type==='api-response').data.choices);
let headerCalls=0;const headers=[];await context.createAITransport(m=>headers.push(m),async()=>({ok:false,status:429,headersObject:{'Retry-After':'120'},text:async()=>{headerCalls++;return '{"ok":true}'}})).request({reqId:'figma-headers',url:'https://example.test/v1'});assert.equal(headerCalls,1);assert(headers.at(-1).retryAt>Date.now()+119000);
const errors=[];await context.createAITransport(m=>errors.push(m),async()=>({ok:false,status:401,headers:{get:()=>null},text:async()=>'<html>unauthorized</html>'})).request({reqId:'auth',url:'https://example.test/v1'});assert.match(errors.at(-1).error,/HTTP 401/);
let wrappedCalls=0;const wrappedMessages=[];const wrapped=context.createAITransport(m=>wrappedMessages.push(m),async()=>{wrappedCalls++;return {ok:true,status:200,headers:{get:()=>null},text:async()=>JSON.stringify({error:{code:429,message:'limited'}})}});await wrapped.request({reqId:'wrapped',url:'https://example.test/wrapped'});await wrapped.request({reqId:'wrapped-queued',url:'https://example.test/wrapped/'});assert.equal(wrappedCalls,1);assert.equal(wrappedMessages.at(-1).status,429);
console.log('AI contracts passed: adaptive truncation recovery, cross-product coverage, wrapped 429,  20-image hard cap, compact holistic synthesis of 800 objects, missing/duplicate source rejection, semantic global corrections, candidate reconciliation, exact Frame coverage, no invented variants, safe plan merging, semantic names, JSON envelopes, serialized requests, 429 cooldown without replay, queued cancellation and non-JSON HTTP failures.');
