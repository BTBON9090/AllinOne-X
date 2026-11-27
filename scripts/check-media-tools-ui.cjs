const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {})
  });
  try {
    for (const platform of ['figma','mastergo']) {
      // The browser handles text clipboard permissions on this local secure origin.
      const context = await browser.newContext({ viewport: { width: 440, height: 600 }, permissions: ['clipboard-read','clipboard-write'] });
      const page = await context.newPage();
      const local = 'http://localhost:34891/media-tools';
      await page.route(local, route => route.fulfill({
        contentType:'text/html', body:fs.readFileSync(path.resolve(__dirname,'..',platform,'ui.html'),'utf8')
      }));
      await page.route('https://**/*', route => route.abort());
      await page.goto(local);
      await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width=96; canvas.height=72;
        const ctx=canvas.getContext('2d');
        const pixels=ctx.createImageData(canvas.width,canvas.height);
        for(let i=0;i<pixels.data.length;i+=4) {
          pixels.data[i]=i%251; pixels.data[i+1]=(i*13)%253;
          pixels.data[i+2]=(i*31)%255; pixels.data[i+3]=i%16?255:0;
        }
        ctx.putImageData(pixels,0,0);
        window.testMediaCalls=[];
        window.testMediaSend=message=>window.dispatchEvent(new MessageEvent('message',{data:{pluginMessage:message}}));
        const image=canvas.toDataURL('image/png');
        ctx.fillStyle='#f4c432';ctx.fillRect(8,8,72,44);
        const alternative=canvas.toDataURL('image/png');
        const selection={type:'media-selection',items:[{id:'sample',name:'Layer.png',renderable:true,shadowable:true,imageFills:[{index:1,name:'Source'}]}]};
        window.testImageSelection=selection;
        const pickedShadows=[
          {x:0.25,y:2.5,blur:4,spread:-1,color:{r:0.1,g:0.2,b:0.9,a:0.45},blendMode:'MULTIPLY'},
          {x:-16.5,y:1.82,blur:11.15,spread:-2,color:{r:0.96,g:0.7,b:0.14,a:0.2},blendMode:'NORMAL'}
        ];
        postMsg=(type,data={})=>{
          testMediaCalls.push({type,...data});
          if(type==='media-inspect')testMediaSend(selection);
          if(type==='media-image-read')queueMicrotask(()=>testMediaSend({type:'media-image-result',requestId:data.requestId,
            dataUrl:data.nodeId==='card' && data.source==='fill'?alternative:image}));
          if(type==='media-image-sources')queueMicrotask(()=>testMediaSend({type:'media-image-sources-result',requestId:data.requestId,nodeId:data.nodeId,
            imageFills:data.nodeId==='card'?[{index:2,sourceNodeId:'nested',name:'Child / Cover'}]:[]}));
          if(type==='media-shadow-apply')queueMicrotask(()=>testMediaSend({type:'media-shadow-result',requestId:data.requestId,applied:1,issues:[]}));
          if(type==='media-shadow-clear')queueMicrotask(()=>testMediaSend({type:'media-shadow-clear-result',requestId:data.requestId,applied:1,removed:2,unchanged:0,issues:[]}));
          if(type==='media-shadow-read')queueMicrotask(()=>testMediaSend({type:'media-shadow-read-result',requestId:data.requestId,
            name:'Native sample',kind:'DROP_SHADOW',shadows:pickedShadows}));
        };
        PluginWorkspace.navigate('imageExport');
      });
      const ready=()=>page.waitForFunction(()=>!document.querySelector('#imageExportPanel [data-action="webp"]').disabled);
      await ready();
      const high=await page.locator('.media-image-meta').innerText();
      assert.match(high,/WebP [\d.,]+ MB$/);
      await page.selectOption('#mediaImageSource','fill-1');
      await ready();
      assert.equal(await page.evaluate(()=>testMediaCalls.at(-1).fillIndex),1);
      await page.fill('#mediaImageQuality','20');
      await ready();
      assert.notEqual(await page.locator('.media-image-meta').innerText(),high);
      const download=async action=>{
        const file=page.waitForEvent('download');
        await page.locator('#imageExportPanel [data-action="'+action+'"]').click();
        return fs.readFileSync(await (await file).path());
      };
      const image=await download('webp');
      assert.equal(image.toString('ascii',0,4),'RIFF');
      assert.equal(image.toString('ascii',8,12),'WEBP');
      const url='data:image/webp;base64,'+image.toString('base64');
      assert.equal((await download('base64')).toString(),url);
      await page.locator('#imageExportPanel [data-action="copy"]').click();
      assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),url);
      assert.equal(await page.locator('[data-action="copy-image"]').count(),0);
      await page.evaluate(()=>{
        testMediaSend({type:'media-selection',items:[testImageSelection.items[0],
          {id:'card',name:'layer.webp',renderable:true,imageFills:[],hasChildren:true},
          {id:'vector',name:'/Cover',renderable:true,imageFills:[]}]});
      });
      assert(await page.locator('#imageExportPanel [data-action="copy"]').isHidden());
      await page.selectOption('#mediaImageTarget','card');
      await page.waitForFunction(()=>Array.from(document.querySelector('#mediaImageSource').options).some(o=>o.value==='fill-2:nested'));
      assert.match(await page.locator('#mediaImageSource').innerText(),/Child \/ Cover/);
      await page.selectOption('#mediaImageSource','fill-2:nested');
      await page.selectOption('#mediaImageTarget','vector');
      assert.match(await page.locator('#mediaImageSourceHint').innerText(),/没有原始图片/);
      assert.equal(await page.locator('#mediaImageSource option').count(),1);
      await page.selectOption('#mediaImageTarget','card');
      assert.equal(await page.inputValue('#mediaImageSource'),'fill-2:nested','Per-layer source choice is retained');
      const packed=await download('webp');
      const packedText=await download('base64');
      const unzip=async bytes=>page.evaluate(async base64=>{
        const zip=await JSZip.loadAsync(base64,{base64:true}), entries={};
        for(const name of Object.keys(zip.files))entries[name]=await zip.file(name).async('base64');
        return entries;
      },bytes.toString('base64'));
      const webps=await unzip(packed), texts=await unzip(packedText);
      assert.deepEqual(Object.keys(webps),['Layer.webp','layer-2.webp','-Cover.webp']);
      assert.deepEqual(Object.keys(texts),['Layer.base64.txt','layer-2.base64.txt','-Cover.base64.txt']);
      for(const [name,encoded] of Object.entries(webps)){
        assert.equal(Buffer.from(encoded,'base64').toString('ascii',8,12),'WEBP');
        assert.equal(Buffer.from(texts[name.replace(/\.webp$/,'.base64.txt')],'base64').toString(),'data:image/webp;base64,'+encoded);
      }
      assert.notEqual(webps['Layer.webp'],webps['layer-2.webp'],'Chosen nested original is used for its layer');
      assert(await page.evaluate(()=>testMediaCalls.some(m=>m.nodeId==='card'&&m.sourceNodeId==='nested'&&m.fillIndex===2)));
      await page.evaluate(()=>testMediaSend(testImageSelection));
      await page.evaluate(()=>PluginWorkspace.navigate('shadow'));
      const clear=page.locator('.media-clear'),applyButton=page.locator('.media-apply');
      assert(await clear.isEnabled());
      const clearBox=await clear.boundingBox(), applyBox=await applyButton.boundingBox();
      assert(clearBox.x+clearBox.width<=applyBox.x && Math.abs(clearBox.y-applyBox.y)<1,'Clear and Apply are adjacent');
      await clear.click();
      const clearRequest=await page.evaluate(()=>testMediaCalls.at(-1));
      assert.equal(clearRequest.type,'media-shadow-clear');
      assert.deepEqual(clearRequest.nodeIds,['sample']);
      await page.waitForFunction(()=>document.querySelector('.media-shadow-status').textContent.includes('已清除'));
      const presets=page.locator('#mediaShadowPresetsTab'),custom=page.locator('#mediaShadowCustomTab');
      const card=key=>page.locator('[data-shadow-preset="'+key+'"]');
      const selectPreset=async key=>{await presets.click();await card(key).click();await custom.click();};
      assert.equal(await presets.getAttribute('aria-selected'),'true');
      assert.equal(await page.locator('[data-shadow-preset]').count(),34);
      assert.equal(await page.locator('[data-preset-group=DROP_SHADOW] .media-preset-card').count(),20);
      assert.equal(await page.locator('[data-preset-group=INNER_SHADOW] .media-preset-card').count(),10);
      assert.notEqual(await card('ambient').locator('.media-preset-stage > span').evaluate(el=>getComputedStyle(el).boxShadow),'none');
      assert.equal(await page.locator('#mediaShadowLayers').getAttribute('max'),'8');
      await selectPreset('long');
      assert.equal(await page.inputValue('#mediaShadowLayers'),'8');
      await presets.click();await card('glow').click();
      assert.equal(await page.inputValue('#mediaQuickDistance'),'24');
      await page.fill('#mediaQuickDistance','28');
      await presets.press('ArrowRight');
      assert.equal(await custom.getAttribute('aria-selected'),'true');
      assert.equal(await page.inputValue('#mediaShadowDistance'),'28','Preset quick adjustments carry into Customize');
      assert.equal(await page.locator('[data-palette]').count(),6);
      assert.equal(await page.locator('[data-palette=dusk]').getAttribute('aria-pressed'),'true');
      assert.match(await page.locator('[data-palette=dusk] .media-gradient-swatch').evaluate(el=>getComputedStyle(el).backgroundImage),/linear-gradient/);
      await page.locator('.media-add-stop').click();
      assert.equal(await page.locator('.media-stop-row').count(),4);
      const first=page.locator('.media-depth [data-point="0"]');
      const before=await first.getAttribute('cy');
      await first.focus(); await first.press('ArrowUp');
      assert.notEqual(await first.getAttribute('cy'),before);
      const graph=page.locator('.media-depth .media-curve-viewport > svg');
      const grid=await graph.locator('.media-curve-grid').getAttribute('d');
      assert.equal((grid.match(/H/g)||[]).length,5);
      assert.equal((grid.match(/V/g)||[]).length,5);
      const size=async () => graph.evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));
      assert.deepEqual(await size(),{width:220,height:100});
      await page.setViewportSize({width:770,height:620});
      assert.deepEqual(await size(),{width:220,height:100});
      const circle=await first.boundingBox();
      assert(Math.abs(circle.width-circle.height)<0.1,'Curve handle stays round');
      await page.setViewportSize({width:440,height:600});
      for (const [id,value] of [['Angle',-30],['Distance',38],['Blur',35],['Spread',3],['Layers',8]]) {
        await page.fill('#mediaShadow'+id+'Slider',String(value));
        assert.equal(await page.inputValue('#mediaShadow'+id),String(value));
      }
      await page.fill('#mediaShadowBlur','180');
      assert.equal(await page.inputValue('#mediaShadowBlurSlider'),'180');
      await page.locator('#mediaShadowReverse').click();
      assert.equal(await page.inputValue('#mediaShadowAngle'),'30');
      await page.locator('[data-lock=Angle]').click();
      assert(await page.locator('#mediaShadowReverse').isDisabled());
      await page.locator('[data-lock=Angle]').click();
      await page.locator('[data-kind=INNER_SHADOW]').click();
      assert.equal(await page.locator('[data-kind=INNER_SHADOW]').getAttribute('aria-pressed'),'true');
      await page.locator('.media-apply').click();
      const result=await page.evaluate(()=>testMediaCalls.at(-1));
      assert.equal(result.kind,'INNER_SHADOW');
      assert.deepEqual(result.nodeIds,['sample']);
      assert.equal(result.shadows.length,8);
      assert.equal(result.shadows.at(-1).blur,180);
      assert.notDeepEqual(result.shadows[0].color,result.shadows.at(-1).color);
      await page.fill('#mediaShadowLayers','9');
      assert(await page.locator('.media-apply').isDisabled(),'Out-of-range typed count cannot apply');
      await page.fill('#mediaShadowLayers','8');
      for (const key of ['Kind','Angle','Distance','Blur','Spread','Layers','Curve','Gradient']) {
        assert.equal(await page.locator('[data-lock='+key+']').count(),1);
      }
      for (const key of ['Blur','Kind','Curve','Gradient']) await page.locator('[data-lock='+key+']').click();
      assert(await page.locator('#mediaShadowBlur').isDisabled());
      assert(await page.locator('[data-palette=iris]').isDisabled());
      const lockedCurve=await first.getAttribute('cy');
      await selectPreset('crisp');
      assert.equal(await page.inputValue('#mediaShadowBlur'),'180');
      assert.equal(await page.inputValue('#mediaShadowDistance'),'5');
      assert.equal(await page.locator('[data-kind=INNER_SHADOW]').getAttribute('aria-pressed'),'true');
      assert.equal(await first.getAttribute('cy'),lockedCurve);
      assert.equal(await page.locator('.media-stop-row').count(),4);
      await page.locator('#mediaShadowPick').click();
      assert.equal(await page.inputValue('#mediaShadowBlur'),'180','Picking honors locks');
      assert.equal(await page.inputValue('#mediaShadowLayers'),'2');
      assert.match(await page.locator('.media-shadow-status').innerText(),/Native sample/);
      for (const key of ['Blur','Kind','Curve','Gradient']) await page.locator('[data-lock='+key+']').click();
      await page.locator('#mediaShadowPick').click();
      assert.equal(await page.locator('[data-kind=DROP_SHADOW]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.inputValue('#mediaShadowBlur'),'11.15');
      assert.equal(await page.locator('[data-palette=custom]').getAttribute('aria-pressed'),'true');
      await page.locator('.media-apply').click();
      const copied=await page.evaluate(()=>testMediaCalls.at(-1));
      assert.deepEqual(copied.shadows.map(s=>[s.x,s.y,s.blur,s.spread,s.blendMode]),
        [[0.25,2.5,4,-1,'MULTIPLY'],[-16.5,1.82,11.15,-2,'NORMAL']]);
      await page.locator('#mediaShadowReverse').click();
      await page.locator('.media-apply').click();
      const mirrored=await page.evaluate(()=>testMediaCalls.at(-1));
      assert.deepEqual(mirrored.shadows.map(s=>[s.x,s.y]),copied.shadows.map(s=>[s.x,-s.y]));
      await page.locator('#mediaShadowReverse').click();
      await page.locator('[data-palette=blue]').click();
      await page.locator('.media-apply').click();
      const recolored=await page.evaluate(()=>testMediaCalls.at(-1));
      assert.deepEqual(recolored.shadows.map(s=>[s.x,s.y,s.blur,s.spread]),copied.shadows.map(s=>[s.x,s.y,s.blur,s.spread]));
      assert.notDeepEqual(recolored.shadows.map(s=>s.color),copied.shadows.map(s=>s.color));
      await page.evaluate(()=>{changeLanguage('en');changeTheme('dark');});
      await page.setViewportSize({width:340,height:440});
      assert.match(await page.locator('.media-shadow-status').innerText(),/Applied/);
      assert(await page.locator('#shadowPanel').evaluate(el=>el.scrollWidth<=el.clientWidth));
      await context.close();
      console.log(platform+' WebP downloads, clipboard and shadow UI passed.');
    }
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
