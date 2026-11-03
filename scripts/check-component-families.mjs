import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../shared/layer-ai-core.js',import.meta.url),'utf8')+';globalThis.ai=LayerAI',context);const {ai}=context;
const contents=[['Person','Blue'],['Person','Neutral'],['Initial','Neutral'],['Photo','Photo'],['Brand','Brand']];
const plans=[],targets=[],constants=[];
for(const shape of ['Circle','Rounded square'])for(const [content,palette] of contents){
 const variants=[];
 for(const size of [16,24,32,40,64])for(const edit of ['None','Corner badge','Dimmed camera overlay']){
  const id=String(targets.length);targets.push({id,parentId:'page',width:size,height:size});variants.push({id,values:{Size:String(size),Edit:edit},evidence:`${shape}; ${content}; ${palette}; border ${content==='Brand'?'White':'None'}`});
 }
 constants.push({Shape:shape,Content:content,Palette:palette,Border:content==='Brand'?'White':'None'});
 plans.push({groups:[{name:`Avatar-${shape}-${content}-${palette}`,family:'Avatar',variants,properties:[]}]});
}
assert.equal(targets.length,150);
const schemaResponse={reviewedCount:150,summary:'One interchangeable Avatar family',families:[{key:'avatar',name:'Avatar',sourceGroups:plans.map((_,index)=>index),dimensions:['Size','Shape','Content','Palette','Edit','Border'],reason:'Shape, imagery, palette and editing affordance are properties of the same avatar role.'}]};
const schema=ai.familySchema(schemaResponse,plans,targets);
const recipe={reviewedCount:150,summary:'Preserve observed constants',groups:plans.map((p,index)=>({name:p.groups[0].name,parts:[{group:index,constants:constants[index]}]}))};
const expanded=ai.synthesizeBuild(recipe,plans,targets,{draft:true});assert.equal(expanded.groups.length,10);
const unified=ai.consolidateFamilies(expanded,schema,targets),final=ai.finalizeBuild(unified,targets);
assert.equal(final.groups.length,1,'ten appearance-specific groups must collapse into one functional family');assert.equal(final.groups[0].name,'Avatar');assert.equal(final.groups[0].variants.length,150);assert.equal(final.standaloneIds.length,0);
const tuples=new Set(final.groups[0].variants.map(v=>JSON.stringify(Object.entries(v.values).sort())));assert.equal(tuples.size,150);
assert.equal(new Set(final.groups.flatMap(g=>g.variants.map(v=>v.id))).size,150);
const redundant=plans.map(p=>({groups:p.groups.map(g=>({...g,variants:g.variants.map(v=>({...v,values:{...v.values,OldState:'Default'}}))}))}));
const compactRecipe={...recipe,groups:recipe.groups.map(g=>({...g,parts:g.parts.map(p=>({...p,omitProperties:['OldState']}))}))};
assert.equal(ai.consolidateFamilies(ai.synthesizeBuild(compactRecipe,redundant,targets,{draft:true}),schema,targets).groups[0].variants.length,150,'dropping a redundant old dimension does not require 150 verbose overrides');
assert.throws(()=>ai.synthesizeBuild({...recipe,groups:[{name:'Bad',parts:[{group:0,omitProperties:['Unknown']}]}]},plans,targets,{draft:true}),/属性无效/);
for(const v of final.groups[0].variants){assert.equal(v.values.Size,String(targets[Number(v.id)].width));assert.equal(Object.keys(v.values).length,6);assert(!Object.keys(v.values).includes('Variant'));}
assert.throws(()=>ai.familySchema({...schemaResponse,families:[{...schemaResponse.families[0],sourceGroups:[0]}]},plans,targets),/遗漏/);
assert.throws(()=>ai.familySchema({...schemaResponse,families:[{...schemaResponse.families[0],sourceGroups:[0,0]}]},plans,targets),/重复/);
assert.throws(()=>ai.consolidateFamilies(ai.synthesizeBuild({...recipe,groups:plans.map((p,index)=>({name:p.groups[0].name,parts:[{group:index}]}))},plans,targets,{draft:true}),schema,targets),/统一属性/,'missing constants require correction, never guessed absence');
const mixedTargets=[...targets,{id:'action',parentId:'page'}],mixedPlans=[...plans,{groups:[{name:'Camera action',variants:[{id:'action',values:{Size:'32',State:'Default'}}]}]}];
const mixedSchema=ai.familySchema({reviewedCount:151,summary:'Two distinct UI roles',families:[schemaResponse.families[0],{key:'button',name:'Camera button',sourceGroups:[10],dimensions:['Size','State']}]},mixedPlans,mixedTargets);
const mixed=ai.synthesizeBuild({reviewedCount:151,summary:'Separate camera action from avatar editing',groups:[...recipe.groups,{name:'Camera action',parts:[{group:10}]}]},mixedPlans,mixedTargets,{draft:true});
assert.equal(ai.consolidateFamilies(mixed,mixedSchema,mixedTargets).groups.length,2,'a camera action button is not forced into Avatar');
console.log('Component families passed: 150 observed avatars in 10 fragments → one family, six independent properties, 150 unique existing variants; missing constants rejected, source coverage checked, and unrelated action button kept separate.');
