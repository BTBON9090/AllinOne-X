const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

(async () => {
  const browser = await chromium.launch({
    headless:true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {})
  });
  try {
    for (const platform of ['figma', 'mastergo']) {
      const page = await browser.newPage({ viewport:{ width:440, height:600 } });
      await page.route('https://**/*', route => route.abort());
      await page.addInitScript(() => {
        window.__sent = [];
        const original = window.postMessage.bind(window);
        window.parent.postMessage = (message, ...args) => {
          if (message?.pluginMessage) window.__sent.push(message.pluginMessage);
          else original(message, ...args); // JSZip schedules work with postMessage.
        };
      });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(pathToFileURL(path.resolve(__dirname, '..', platform, 'ui.html')).href);
      const emit = message => page.evaluate(pluginMessage => {
        dispatchEvent(new MessageEvent('message', { data:{ pluginMessage } }));
      }, message);
      await page.locator('[data-nav="iconfont"]').press('Enter');
      assert.equal(await page.evaluate(() => __sent.at(-1).type), 'get-iconfont-selection');
      const copy = page.getByRole('button', { name:'创建副本后修复', exact:true });
      const inplace = page.getByRole('button', { name:'仅修复', exact:true });
      await emit({ type:'iconfont-selection', count:0, childCount:0, targets:{ selection:[], children:[] } });
      assert(await copy.isDisabled());
      assert(await inplace.isDisabled());
      const large = Array.from({ length:83 }, (_, index) => ({ id:'icon-' + index, name:'Icon ' + index }));
      large[42].name = '<img src=x onerror=alert(1)>';
      const selection = { type:'iconfont-selection', count:1, childCount:83, targets:{ selection:[{id:'frame',name:'Icons'}], children:large } };
      await emit(selection);
      await page.locator('#iconfontMode input[value="children"]').check();
      assert.match(await page.locator('#iconfontSelection').textContent(), /83 \/ 83/);
      assert.equal(await page.locator('#iconfontTargetList input').count(), 40);
      await page.locator('#iconfontAll').uncheck();
      assert(await inplace.isDisabled());
      await page.locator('#iconfontTargetList input[value="icon-0"]').check();
      await page.locator('#iconfontNext').click();
      const checked = page.locator('#iconfontTargetList input[value="icon-42"]');
      await checked.check();
      assert.equal(await page.locator('#iconfontTargetList img').count(), 0);
      await emit(selection);
      assert(await checked.isChecked(), 'Host refresh preserves explicit checks and the current page');
      await page.locator('#iconfontMode input[value="selection"]').check();
      await page.locator('#iconfontMode input[value="children"]').check();
      assert.match(await page.locator('#iconfontSelection').textContent(), /2 \/ 83/);
      await inplace.click();
      const originalRequest = await page.evaluate(() => __sent.at(-1));
      assert.equal(originalRequest.action, 'inplace');
      assert.deepEqual(originalRequest.targetIds, ['icon-0','icon-42']);
      await emit({ type:'iconfont-repair-progress', requestId:originalRequest.requestId, done:1, total:2 });
      assert.match(await page.locator('#iconfontStatus').textContent(), /原图层.*1 \/ 2/);
      assert(await copy.isDisabled());
      await emit({ type:'iconfont-repair-result', requestId:originalRequest.requestId, items:[
        { name:'Edited layer',status:'fixed' }, { name:'Unsupported',status:'skipped',reason:'效果' }
      ] });
      assert.match(await page.locator('#iconfontStatus').textContent(), /已修复 1 个.*跳过 1 个/);
      assert.equal(await page.locator('#iconfontResults button').count(), 0);
      assert(await page.locator('#iconfontZip').isHidden());
      await page.locator('#iconfontTargetList input[value="icon-1"]').check();
      await copy.click();
      const message = await page.evaluate(() => __sent.at(-1));
      assert.equal(message.type, 'iconfont-repair-run');
      assert.equal(message.mode, 'children');
      assert.equal(message.action, 'copy');
      assert.deepEqual(message.targetIds, ['icon-0','icon-1','icon-42']);
      await emit({ type:'iconfont-repair-progress', requestId:message.requestId, done:2, total:3 });
      assert.match(await page.locator('#iconfontStatus').textContent(), /副本.*2 \/ 3/);
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 0h20v20z"/></svg>';
      await emit({ type:'iconfont-repair-result', requestId:'obsolete', items:[] });
      assert(await page.locator('#iconfontRun').isDisabled());
      await emit({
        type:'iconfont-repair-result', requestId:message.requestId, items:[
          { name:'icon/arrow', svg, status:'fixed' }, { name:'Icon/Arrow', svg, status:'fixed' },
          { name:'<b>Mask</b>', status:'skipped', reason:'包含蒙版' }
        ]
      });
      assert.equal(await page.locator('#iconfontResults li').count(), 3);
      assert.equal(await page.locator('#iconfontResults b').count(), 0);
      assert.equal(await page.locator('#iconfontResults strong').last().textContent(), '<b>Mask</b>');
      const [single] = await Promise.all([
        page.waitForEvent('download'), page.locator('#iconfontResults button').first().click()
      ]);
      assert.equal(single.suggestedFilename(), 'icon-arrow.svg');
      assert.equal(await fs.readFile(await single.path(), 'utf8'), svg);
      const [zip] = await Promise.all([page.waitForEvent('download'), page.locator('#iconfontZip').click()]);
      const bytes = await fs.readFile(await zip.path());
      const entries = await page.evaluate(async bytes => {
        const archive = await JSZip.loadAsync(new Uint8Array(bytes));
        return Promise.all(Object.values(archive.files).map(async file => [file.name, await file.async('string')]));
      }, Array.from(bytes));
      assert.deepEqual(entries, [['icon-arrow.svg', svg], ['Icon-Arrow-2.svg', svg]]);
      await page.locator('[data-report="inplace"]').click();
      assert.deepEqual(await page.locator('#iconfontResults strong').allTextContents(), ['Edited layer','Unsupported']);
      assert(await page.locator('#iconfontZip').isHidden());
      await page.locator('[data-report="copy"]').click();
      await page.setViewportSize({ width:340, height:440 });
      await page.evaluate(() => { setCompactMode(true); changeTheme('dark'); changeLanguage('en'); });
      assert.equal(await page.locator('#iconfontZip').innerText(), 'Download ZIP (2 SVGs)');
      assert(await page.locator('#iconfontPanel').evaluate(panel => panel.scrollWidth <= panel.clientWidth));
      const buttons = await page.locator('.iconfont-actions button').evaluateAll(buttons => buttons.map(button => {
        const rect = button.getBoundingClientRect();
        return [rect.y, rect.x, rect.right];
      }));
      assert.equal(buttons[0][0], buttons[1][0], 'Both actions remain adjacent in compact English mode');
      assert(buttons[1][1] >= buttons[0][2]);
      assert.deepEqual(errors, []);
      await page.close();
      console.log(platform + ' iconfont panel passed selection, batch results, individual SVG and offline ZIP downloads.');
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
