const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

const root = path.resolve(__dirname,'..');
const hostSource = fs.readFileSync(path.join(root,'shared/media-host.js'),'utf8');

async function testPlatform(browser,platform) {
  const context = await browser.newContext({viewport:{width:440,height:600}});
  try {
    const page = await context.newPage();
    const url='http://localhost:34891/shadow';
    await page.route(url,route=>route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(root,platform,'ui.html'),'utf8')}));
    await page.route('https://**/*',route=>route.abort());
    await page.goto(url);
    await page.evaluate(({hostSource,platform})=>{
      const node={id:'sample',name:'Sample',type:'RECTANGLE',fills:[],effects:[{type:'LAYER_BLUR',radius:2}]};
      window.testShadowNode=node;
      const deliver=message=>window.dispatchEvent(new MessageEvent('message',{data:{pluginMessage:message}}));
      const handle=Function('layerPlatform','layerPage','layerHost','layerSend',hostSource+'\nreturn handleMediaMessage;')(
        platform,()=>({selection:[node]}),{commitUndo(){}},deliver);
      postMsg=(type,data={})=>handle({type,...data});
      PluginWorkspace.navigate('shadow');
    },{hostSource,platform});
    const category=key=>page.locator('[data-preset-category="'+key+'"]');
    const card=key=>page.locator('[data-shadow-preset="'+key+'"]');
    const group=key=>page.locator('[data-preset-group="'+key+'"]');
    const edit=page.locator('#mediaShadowCustomTab'),presets=page.locator('#mediaShadowPresetsTab');
    const apply=async()=>{
      await page.locator('#shadowPanel .media-apply').click();
      return page.evaluate(()=>testShadowNode.effects);
    };
    await category('DROP_SHADOW').press('ArrowRight');
    assert(await group('INNER_SHADOW').isVisible());
    assert.equal(await group('INNER_SHADOW').locator('button:visible').count(),10);
    assert(await group('DROP_SHADOW').isHidden());
    await category('INNER_SHADOW').press('ArrowRight');
    assert.equal(await category('GLITCH').getAttribute('aria-selected'),'true');
    assert.equal(await card('ambient').getAttribute('aria-pressed'),'true','Browsing must retain the active recipe');
    assert(await group('INNER_SHADOW').isHidden());
    for (const key of ['rgbSplit','signalShift','duotone','echo']) {
      await card(key).click();
      const effects=await apply();
      assert.equal(effects.filter(effect=>effect.type==='LAYER_BLUR').length,1);
      const stack=effects.filter(effect=>effect.type==='DROP_SHADOW');
      assert.equal(stack.length,key==='echo'?4:2);
      // The visible result is made from two actual offset native shadows.
      const ordered=platform==='figma'?stack.slice().reverse():stack;
      const [a,b]=ordered;
      assert(a.offset.x*b.offset.x+a.offset.y*b.offset.y<0);
      assert(Math.abs(a.offset.x+b.offset.x)<.02 && Math.abs(a.offset.y+b.offset.y)<.02);
      assert(new Set(ordered.map(s=>JSON.stringify(s.color))).size>=2);
      assert(ordered.every(s=>s.color.a>.4));
      // Clear the editor's recipe before reading the persisted native effects.
      await category('DROP_SHADOW').click();
      await card('ambient').click();
      await edit.click();
      await page.locator('#mediaShadowPick').click();
      assert.deepEqual(await apply(),effects,'A pick/apply cycle preserves native order, offsets, color and opacity');
      await presets.click();
      assert.equal(await category('GLITCH').getAttribute('aria-selected'),'true');
      assert.equal(await card(key).getAttribute('aria-pressed'),'true');
    }
    await card('rgbSplit').click();
    await edit.click();
    await page.fill('#mediaShadowDistance','12');
    await page.locator('[data-lock=Distance]').click();
    await presets.click();
    await card('duotone').click();
    assert.equal(await page.inputValue('#mediaQuickDistance'),'12');
    await edit.click();
    await page.fill('#mediaShadowAngle','90');
    await page.fill('#mediaShadowLayers','3');
    const firstStop=page.locator('.media-stops input[type=color]').first();
    await firstStop.fill('#00ff00');
    const custom=await apply();
    const odd=custom.filter(e=>e.type==='DROP_SHADOW');
    assert.equal(odd.length,3);
    assert.deepEqual(odd.map(s=>s.offset.y).sort((a,b)=>a-b),[-12,-6,12]);
    assert(odd.some(s=>s.color.g===1 && s.color.r===0 && s.color.b===0));
    await page.locator('[data-lock=Distance]').click();
    await page.locator('#mediaShadowPick').click();
    assert.deepEqual(await apply(),custom);
    await page.fill('#mediaShadowLayers','8');
    const eight=(await apply()).filter(s=>s.type==='DROP_SHADOW');
    assert.equal(eight.length,8);
    assert.equal(eight.filter(s=>s.offset.y<0).length,4);
    assert.equal(eight.filter(s=>s.offset.y>0).length,4);
    await page.fill('#mediaShadowLayers','9');
    assert(await page.locator('#shadowPanel .media-apply').isDisabled());
    await page.fill('#mediaShadowLayers','2');
    await page.evaluate(()=>{changeLanguage('en');changeTheme('dark');});
    await presets.click();
    assert.equal(await category('GLITCH').innerText(),'Glitch');
    await page.setViewportSize({width:340,height:440});
    const positions=await page.locator('[data-preset-category]').evaluateAll(items=>items.map(el=>{
      const r=el.getBoundingClientRect();return [r.x,r.y,r.width];
    }));
    assert(positions.every(([x,y,w],i)=>y===positions[0][1] && w>0 && (i===0 || x>positions[i-1][0])));
    await category('GLITCH').press('Home');
    assert(await group('DROP_SHADOW').isVisible());
    console.log(platform+' glitch preset navigation, editing and native shadow round-trip passed.');
  } finally {
    await context.close();
  }
}

(async()=>{
  const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
  try {
    for(const platform of ['figma','mastergo']) await testPlatform(browser,platform);
  } finally {
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
