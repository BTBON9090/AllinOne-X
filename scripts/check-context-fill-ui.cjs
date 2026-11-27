const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

(async () => {
  const browser = await chromium.launch({
    headless:true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH} : {})
  });
  try {
    for (const platform of ['figma','mastergo']) {
      const page = await browser.newPage({viewport:{width:440,height:600}});
      try {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.context().setOffline(true);
        await page.addInitScript(() => {
          window.sentToHost = [];
          window.parent.postMessage = packet => {
            if (packet.pluginMessage) window.sentToHost.push(packet.pluginMessage);
          };
        });
        const pathname = path.join(__dirname,'..',platform,'ui.html');
        await page.goto(pathToFileURL(pathname).href);
        await page.waitForFunction(() => window.PluginWorkspace && window.ContextFillWorkspace);
        await page.evaluate(() => { changeLanguage('en'); PluginWorkspace.navigate('smartFill'); });
        const tab = page.getByRole('button',{name:'Context Fill',exact:true});
        await tab.click();
        assert.equal(await tab.getAttribute('aria-pressed'),'true');
        assert(await page.locator('#smartBasic').isHidden());
        const generate = page.locator('#contextFillGenerate');
        const apply = page.locator('#contextFillApply');
        await page.getByRole('button',{name:'Orders',exact:true}).click();
        assert(await generate.isDisabled(),'Canvas selection is required');
        const emit = message => page.evaluate(data => window.dispatchEvent(new MessageEvent('message',{
          data:{pluginMessage:data}
        })), message);
        const frame = {id:'5:23',name:'Orders',width:400,height:240};
        const read = {
          type:'context-fill-response',ok:true,token:'frame-token',frame,groups:[['g1','frame','Row 1','FRAME']],
          fields:[
            {id:'t1',name:'Title',before:'Orders',parent:'frame'},
            {id:'t2',name:'Amount',before:'¥0.00',parent:'g1'},
            {id:'t3',name:'Button',before:'Details',parent:'g1'}
          ],
          skipped:1
        };
        const request = async type => {
          await page.waitForFunction(type => window.sentToHost.some(item => item.type === type), type);
          return page.evaluate(type => {
            const recent = window.sentToHost.filter(item => item.type === type).at(-1);
            window.sentToHost = window.sentToHost.filter(item => item.type !== type);
            return recent;
          },type);
        };
        await page.evaluate(() => {
          window.LayerWorkspace.requestJSON = async (system, payload, job, validate) => {
            const data = JSON.parse(payload);
            if (!data.goal.includes('café') || data.board.groups[0][2] !== 'Row 1') throw Error('Missing design context');
            return validate({fields:[
              {id:'t2',role:'price',text:'¥32.00'},
              {id:'t3',role:'action',keep:true},
              {id:'t1',role:'title',text:'Café orders'}
            ]});
          };
        });
        await emit({type:'context-fill-selection',frame});
        await generate.click();
        const first = await request('context-fill-read');
        await emit({...read,requestId:first.requestId});
        await apply.waitFor({state:'visible'});
        assert.deepEqual(await page.locator('.context-fill-after').allTextContents(),['Café orders','¥32.00']);
        assert.match(await page.locator('#contextFillPreviewSummary').textContent(),/2 replacements.*1 protected/);
        await emit({type:'context-fill-selection',frame:{id:'9:23',name:'Another frame'}});
        assert(await apply.isHidden(),'Changing frames invalidates the preview');
        await emit({type:'context-fill-selection',frame});
        await generate.click();
        const second = await request('context-fill-read');
        await emit({...read,requestId:second.requestId});
        await apply.click();
        const applied = await request('context-fill-apply');
        assert.equal(applied.token,'frame-token');
        assert.deepEqual(applied.edits,[{id:'t1',text:'Café orders'},{id:'t2',text:'¥32.00'}]);
        await emit({type:'context-fill-response',requestId:applied.requestId,ok:true,count:2});
        assert.match(await page.locator('#contextFillFeedback').textContent(),/Replaced 2/);
        const table={id:'table',type:'INSTANCE',name:'Orders table',width:640,height:600};
        const groups=[['head','frame','Table header','FRAME']];
        const values=[],readOnly=[];
        const columns=['Order ID','Customer','Amount','Actions'];
        function cell(id,name,before,parent,x,y) {return {id,name,before,parent,box:[x,y,95,18]};}
        columns.forEach((name,c)=>values.push(cell('h'+c,name,name,'head',32+c*120,0)));
        readOnly.push(cell(null,'Select all','☐','head',0,0));
        for(let r=0;r<12;r++) {
          groups.push(['r'+r,'frame','Data row','INSTANCE']);
          ['ORD-000','Example','¥0','Details'].forEach((value,c)=>values.push(cell('t'+r+'-'+c,columns[c],value,'r'+r,32+c*120,40+r*32)));
          readOnly.push(cell(null,'Checkbox','☐','r'+r,0,40+r*32));
        }
        const tableRead={type:'context-fill-response',ok:true,token:'table-token',frame:table,groups,fields:values,readOnly,skipped:13};
        await page.evaluate(()=>{
          window.tableCalls=[];window.rejectedHeaderOnly=false;
          window.LayerWorkspace.requestJSON=async(system,raw,job,validate)=>{
            const p=JSON.parse(raw);
            // A model cannot waive all data fields by quoting the entire generic brief.
            if(!p.requested)return validate({plan:'Create independent recent order records in CNY.',fillRecords:false,limitedTo:p.goal});
            if(p.board.tables[0].records.length!==12)throw Error('Missing table body rows');
            window.tableCalls.push(p);
            const headersOnly=p.requested.map(id=>({id,role:'label',keep:true}));
            try{validate({fields:headersOnly});}catch{window.rejectedHeaderOnly=true;}
            return validate({fields:p.requested.map(id=>p.requiredRecordValues.includes(id)
              ?{id,role:'value',text:'Order data '+id}:{id,role:'action',keep:true})});
          };
        });
        await emit({type:'context-fill-selection',frame:table});
        assert.match(await page.locator('#contextFillSelection').textContent(),/Selected instance/);
        await generate.click();
        const tableRequest=await request('context-fill-read');await emit({...tableRead,requestId:tableRequest.requestId});
        await apply.waitFor({state:'visible'});
        assert.equal(await page.locator('.context-fill-after').count(),36);
        const calls=await page.evaluate(()=>window.tableCalls);
        assert(calls.length>=2);
        assert.deepEqual(calls.flatMap(c=>c.requested),values.map(v=>v.id),'Each field across every row is requested exactly once');
        assert.equal(await page.evaluate(()=>window.rejectedHeaderOnly),true,'The provider cannot skip all editable records');
        await apply.click();
        const tableApply=await request('context-fill-apply');
        assert.equal(tableApply.edits.length,36);assert(tableApply.edits.every(e=>/^t\d+-[012]$/.test(e.id)));
        await emit({type:'context-fill-response',requestId:tableApply.requestId,ok:true,count:36});
        // An explicit restricted brief can keep body fields; the generated rows must not override it.
        await page.locator('#contextFillPrompt').fill('Only rename the Amount header.');
        await page.evaluate(()=>{
          window.LayerWorkspace.requestJSON=async(system,raw,job,validate)=>{
            const p=JSON.parse(raw);
            if(!p.requested)return validate({plan:'Update the requested header.',fillRecords:false,limitedTo:'Only rename the Amount header'});
            if(p.requiredRecordValues.length)throw Error('Forced data into a targeted edit');
            return validate({fields:p.requested.map(id=>id==='h2'?{id,text:'Total',role:'heading'}:{id,role:'other',keep:true})});
          };
        });
        await generate.click();
        const limited=await request('context-fill-read');await emit({...tableRead,requestId:limited.requestId});
        await apply.waitFor({state:'visible'});
        assert.deepEqual(await page.locator('.context-fill-after').allTextContents(),['Total']);
        // Two aligned label/input lines should continue through ordinary form filling.
        const formFields=[
          cell('f1','Label','Name','form',0,0),cell('f2','Input','John','form',130,0),
          cell('f3','Label','Phone','form',0,40),cell('f4','Input','555','form',130,40)
        ];
        await page.evaluate(()=>{
          window.LayerWorkspace.requestJSON=async(system,raw,job,validate)=>{
            const p=JSON.parse(raw);
            if(p.board.tables.length||!p.requested)throw Error('Form was treated as a table');
            return validate({fields:p.requested.map(id=>id==='f2'?{id,text:'Tim',role:'value'}:{id,role:'label',keep:true})});
          };
        });
        await page.locator('#contextFillPrompt').fill('Fill out the person details.');
        await generate.click();
        const formRead=await request('context-fill-read');await emit({...tableRead,fields:formFields,groups:[],readOnly:[],requestId:formRead.requestId});
        await apply.waitFor({state:'visible'});
        assert.deepEqual(await page.locator('.context-fill-after').allTextContents(),['Tim']);
        assert.deepEqual(errors,[]);
        console.log(platform + ': Context Fill navigation, prompt examples, mapped preview, stale frame and bulk apply passed.');
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
