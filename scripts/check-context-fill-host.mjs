import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../shared/context-fill-host.js', import.meta.url), 'utf8');
for (const platform of ['figma', 'mastergo']) {
  let undo = 0;
  const messages = [];
  const page = {id:'page',type:'PAGE',selection:[]};
  const frame = {id:'42:0',type:'FRAME',name:'Orders',width:600,height:280,parent:page,
    absoluteBoundingBox:{x:80,y:80},children:[]};
  const row = {id:'42:1',type:'FRAME',name:'Row 1',parent:frame,x:16,y:56,width:560,height:32,children:[]};
  frame.children.push(row);
  const title = field('42:2','Heading','Orders',frame,16,16);
  const amount = field('42:3','Amount','¥00',row,272,56);
  const state = field('42:4','Status','Pending',row,432,56);
  const bound = field('42:5','Bound text','Variable value',row,208,84);
  if (platform === 'figma') bound.boundVariables = {characters:{id:'variable'}};
  else bound.masterGoI18nBinding = true;
  const locked = field('42:6','Locked','Do not overwrite',row,440,84);
  locked[platform === 'figma' ? 'locked' : 'isLocked'] = true;
  const nodes = new Map([title,amount,state,bound,locked].map(node => [node.id,node]));
  function field(id,name,characters,parent,x,y) {
    const item = {id,name,characters,parent,x,y,type:'TEXT',fontSize:12,
      absoluteBoundingBox:{x:80+x,y:80+y,width:100,height:28},
      fontName:{family:'Inter',style:'Regular'},
      getStyledTextSegments() { return [{start:0,end:this.characters.length}]; },
      insertCharacters(start,text) {
        if (this.failWrite) throw new Error('Simulated write failure');
        this.characters = this.characters.slice(0,start) + text + this.characters.slice(start);
      },
      deleteCharacters(start,end) { this.characters = this.characters.slice(0,start) + this.characters.slice(end); }
    };
    parent.children.push(item);
    return item;
  }
  const sandbox = {
    layerHost:{commitUndo:() => undo++}, layerPage:() => page, layerPlatform:platform,
    layerGet:async id => nodes.get(id), layerSend:msg => messages.push(msg), console,
    getNodeI18nBinding:node => node.masterGoI18nBinding,
    loadSmartFillFonts: async (node,fonts) => {
      if (node.failFont) throw new Error('Missing font');
      fonts.set(node.fontName.family,true);
    }
  };
  vm.createContext(sandbox);
  const handle = vm.runInContext(source + '\nhandleContextFillMessage;',sandbox);
  const send = async (type,data = {}) => {
    await handle({type, requestId:'x', uiLanguage:'en', ...data});
    return messages.at(-1);
  };
  assert.equal((await send('context-fill-read')).ok,false);
  page.selection = [frame];
  const context = await send('context-fill-read');
  assert.equal(context.ok,true);
  assert.equal(context.skipped,2);
  assert.equal(JSON.stringify(context.fields.map(f => [f.id,f.name,f.parent,f.box[0],f.box[1]])),
    JSON.stringify([['t1','Heading','frame',16,16],['t2','Amount','g1',272,56],['t3','Status','g1',432,56]]));
  assert.equal(context.groups[0][2],'Row 1');
  assert.equal(context.fields.some(f => f.id.startsWith('42:')),false);
  const token = context.token;
  const edits = [{id:'t3',text:'Paid'},{id:'t1',text:'Café orders'},{id:'t2',text:'¥28.00'}];
  assert.equal((await send('context-fill-apply',{token,edits:[...edits,{id:'bad',text:'Invalid'}]})).ok,false);
  amount.characters = 'Edited in the meantime';
  assert.equal((await send('context-fill-apply',{token,edits})).ok,false);
  assert.equal(title.characters,'Orders','Stale previews do not partially apply');
  amount.characters = '¥00';
  row.name = 'Different row';
  assert.equal((await send('context-fill-apply',{token,edits})).ok,false);
  row.name = 'Row 1';
  amount.failFont = true;
  assert.equal((await send('context-fill-apply',{token,edits})).ok,false);
  assert.equal(title.characters,'Orders','Font preflight stops all writes');
  amount.failFont = false;
  amount.failWrite = true;
  assert.equal((await send('context-fill-apply',{token,edits})).ok,false);
  assert.equal(title.characters,'Orders','Successful earlier write was rolled back');
  assert.equal(state.characters,'Pending');
  amount.failWrite = false;
  const result = await send('context-fill-apply',{token,edits});
  assert.equal(result.ok,true);
  assert.equal(result.count,3);
  assert.equal(title.characters,'Café orders');
  assert.equal(amount.characters,'¥28.00');
  assert.equal(state.characters,'Paid');
  assert.equal(bound.characters,'Variable value');
  assert.equal(undo,1);
  assert.equal((await send('context-fill-apply',{token,edits})).ok,false);
  let checkpoint, nativeRollbacks = 0;
  sandbox.layerHost.commitUndo = () => { checkpoint = [...nodes.values()].map(node => [node,node.characters]); };
  sandbox.layerHost.triggerUndo = () => {
    nativeRollbacks++;
    for (const [node,value] of checkpoint) node.characters = value;
  };
  const undoContext = await send('context-fill-read');
  amount.failWrite = true;
  assert.equal((await send('context-fill-apply',{token:undoContext.token,
    edits:[{id:'t1',text:'Test'},{id:'t2',text:'¥33.00'}]})).ok,false);
  assert.equal(nativeRollbacks,1,'Native undo preserves object styles on a partial failure');
  assert.equal(title.characters,'Café orders');
  delete sandbox.layerHost.triggerUndo;
  sandbox.layerHost.commitUndo=()=>undo++;

  // The selected table itself is an instance. Each body row repeats the same
  // component, but its editable text property values belong to that row alone.
  const table={id:'table',type:'INSTANCE',name:'订单管理',width:640,height:460,children:[],parent:page};
  const header={id:'head',type:'FRAME',name:'表头',children:[],parent:table};table.children.push(header);
  const captions=['订单号','客户','金额','操作'];
  captions.forEach((text,i)=>field('h'+i,text,text,header,i*130,10));
  const master={id:'row-master',type:'COMPONENT',name:'Table row',children:[],componentPropertyValues:[]};
  const propertyIds=['number#1','customer#2','price#3'];
  propertyIds.forEach((key,i)=>{
    const n=field('main'+i,captions[i],['ORD-000','示例客户','¥0.00'][i],master,i*130,0);
    n.componentPropertyReferences={characters:key};
    master.componentPropertyValues.push({id:key,type:'TEXT',name:captions[i]});
  });
  const rows=[];
  for(let r=0;r<12;r++) {
    const owner={id:'row'+r,type:'INSTANCE',name:'数据行',children:[],parent:table,x:0,y:40+r*32,width:640,height:32,mainComponent:master};
    const values=Object.fromEntries(propertyIds.map((k,i)=>[k,master.children[i].characters]));
    const property=k=>({id:k,name:k,type:'TEXT',value:values[k],...(owner.boundKey===k?{boundVariables:{value:{id:'v'}}}:{})});
    Object.defineProperty(owner,'componentProperties',{get:()=>platform==='figma'?Object.fromEntries(propertyIds.map(k=>[k,property(k)])):propertyIds.map(property)});
    owner.setProperties=overrides=>{
      if(owner.reject && Object.values(overrides).some(v=>String(v).includes('fail')))throw new Error('Failed row override');
      for(const key of Object.keys(overrides)){assert(propertyIds.includes(key),'Uses the native property key');values[key]=overrides[key];}
    };
    table.children.push(owner);rows.push(owner);
    propertyIds.forEach((key,i)=>{
      const n=field('row'+r+'text'+i,captions[i],values[key],owner,i*130,40+r*32);
      Object.defineProperty(n,'characters',{get:()=>values[key],set(){throw new Error('Bound text was written directly');}});
      n.insertCharacters=()=>{throw new Error('Bound text was written directly');};
      // MasterGo may expose the characters reference only on the corresponding main layer.
      if(platform==='figma'||i!==1)n.componentPropertyReferences={characters:key};
    });
    owner.children.push({id:'toggle'+r,type:'VECTOR',name:'Checkbox',parent:owner});
    const control=field('check'+r,'Checkbox glyph','☐',owner,392,40+r*32);
    const action=field('action'+r,'Menu','详情',owner,520,40+r*32);
    if(r===0) {
      const alias=field('mirror','Repeated amount',values[propertyIds[2]],owner,260,62);
      Object.defineProperty(alias,'characters',{get:()=>values[propertyIds[2]]});
      alias.componentPropertyReferences={characters:propertyIds[2]};
    }
    assert.equal(control.characters,'☐');assert.equal(action.characters,'详情');
  }
  page.selection=[table];
  const selected=(await send('context-fill-selection-request')).frame;
  assert.equal(selected.type,'INSTANCE');
  const tablePlan=await send('context-fill-read');
  assert.equal(tablePlan.ok,true,tablePlan.message);
  assert.equal(tablePlan.fields.length,4+12*4,'12 rows, three editable data fields and one editable menu each');
  assert.equal(tablePlan.skipped,12,'Non-content glyph controls are preserved');
  assert.equal(tablePlan.readOnly.length,12);
  assert.equal(JSON.stringify(tablePlan.fields).includes('customer#2'),false,'Native property keys are host-only');
  const byRow=new Map(tablePlan.groups.map(([id,,name,type,box])=>[id,{name,type,y:box[1]}]));
  const bodyEdits=Array.from(tablePlan.fields).filter(f=>byRow.get(f.parent)?.type==='INSTANCE'&&f.name!=='Menu').map(f=>({
    id:f.id,text:f.name+'-'+byRow.get(f.parent).y
  }));
  assert.equal(bodyEdits.length,36);
  rows[7].reject=true;
  const failed=await send('context-fill-apply',{token:tablePlan.token,edits:bodyEdits.map((e,i)=>i===21?{...e,text:'fail'}:e)});
  assert.equal(failed.ok,false);
  assert(rows.every(r=>r.children[0].characters==='ORD-000'),'Earlier row overrides roll back on a later failure');
  assert.equal((await send('context-fill-apply',{token:tablePlan.token,edits:bodyEdits})).count,36);
  assert.equal(rows[0].children[0].characters,'订单号-40');assert.equal(rows[11].children[0].characters,'订单号-392');
  assert.equal(rows[11].children[1].characters,'客户-392');
  assert.equal(rows[0].children.at(-1).characters,rows[0].children[2].characters,'Shared property mirrors update together');
  assert.deepEqual(master.children.map(n=>n.characters),['ORD-000','示例客户','¥0.00']);
  assert.deepEqual(header.children.map(n=>n.characters),captions);
  assert(rows.every(r=>r.children.find(n=>n.name==='Checkbox glyph').characters==='☐'));
  page.selection=[rows[2]];
  const oneInstance=await send('context-fill-read');
  const actionField=oneInstance.fields.find(f=>f.name==='Menu');
  assert.equal((await send('context-fill-apply',{token:oneInstance.token,edits:[{id:actionField.id,text:'查看订单'}]})).count,1);
  assert.equal(rows[2].children.find(n=>n.name==='Menu').characters,'查看订单','Ordinary text in a selected instance can be overridden');
  assert.equal(rows[3].children.find(n=>n.name==='Menu').characters,'详情','A sibling instance is independent');
  // Editing a selected ordinary frame may update nested instances, never a component definition.
  const wrapper={...frame,children:[table,master]};table.parent=wrapper;master.parent=wrapper;page.selection=[wrapper];
  if(platform==='mastergo')master.componentPropertyValues[0].variableId='var';
  else rows[0].boundKey=propertyIds[0];
  const wrapperPlan=await send('context-fill-read');
  assert.equal(wrapperPlan.ok,true,wrapperPlan.message);
  assert(!wrapperPlan.fields.some(f=>f.before==='ORD-000'),'The main component cannot become a write target');
  if(platform==='mastergo')assert(!wrapperPlan.fields.some(f=>f.name==='订单号'&&f.before.startsWith('订单号-')),'Variable-bound instance property is protected');
  else assert(!wrapperPlan.fields.some(f=>f.before==='订单号-40'),'Variable-bound instance property is protected');
  console.log(platform + ': Context Fill snapshot IDs, stale inputs, font preflight, rollback and batch apply passed.');
}
