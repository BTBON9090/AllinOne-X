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
      const report = (request, items, extra = {}) => emit({
        type:'iconfont-repair-result', requestId:request.requestId, action:request.action,
        reportId:request.retryOf || request.requestId, items, ...extra
      });
      const last = () => page.evaluate(() => __sent.at(-1));
      const issues = page.locator('#iconfontResults li');
      const issueBox = id => issues.locator('input[value="' + id + '"]');
      const issueName = id => issues.locator('button[data-source-id="' + id + '"]');
      const issueIds = () => issues.locator('input[type=checkbox]').evaluateAll(inputs => inputs.map(input => input.value));
      const selectedIssues = () => issues.locator('input:checked').evaluateAll(inputs => inputs.map(input => input.value));
      const retry = page.locator('#iconfontRetry'), issueAll = page.locator('#iconfontIssueAll');
      const zipButton = page.locator('#iconfontZip'), fileSelect = page.locator('#iconfontFile');
      await report(originalRequest, [
        { sourceId:'icon-0', name:'Edited layer', status:'fixed' },
        { sourceId:'icon-42', name:'Unsupported', status:'skipped', reason:'效果' }
      ]);
      assert.match(await page.locator('#iconfontStatus').textContent(), /已修复 1 个.*跳过 1 个/);
      assert.deepEqual(await issueIds(), ['icon-42']);
      assert(await zipButton.isHidden());

      await page.locator('#iconfontTargetList input[value="icon-1"]').check();
      await page.locator('#iconfontTargetList input[value="icon-2"]').check();
      await copy.click();
      const batch = await last();
      assert.equal(batch.type, 'iconfont-repair-run');
      assert.equal(batch.mode, 'children');
      assert.equal(batch.action, 'copy');
      assert.deepEqual(batch.targetIds, ['icon-0','icon-1','icon-2','icon-42']);
      await emit({ type:'iconfont-repair-progress', requestId:batch.requestId, done:2, total:4 });
      assert.match(await page.locator('#iconfontStatus').textContent(), /副本.*2 \/ 4/);
      await emit({ type:'iconfont-repair-result', requestId:'obsolete', items:[] });
      assert(await page.locator('#iconfontRun').isDisabled(), 'A stale reply cannot finish the active run');
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 0h20v20z"/></svg>';
      const svg2 = svg.replace('v20z', 'v10z'), svg3 = svg.replace('h20v20z', 'h12v5z');
      const ready = (sourceId, name, svg) => ({ sourceId, name, svg, status:'fixed' });
      const issue = (sourceId, name, status, reason) => ({ sourceId, name, status, reason });
      await report(batch, [
        ready('icon-0', 'icon/arrow', svg),
        issue('icon-1', 'Icon/Arrow', 'skipped', '包含效果'),
        issue('icon-2', 'Broken', 'failed', '无法写入轮廓'),
        issue('icon-42', '<b>Mask</b>', 'skipped', '包含蒙版')
      ]);
      assert.deepEqual(await issueIds(), ['icon-1','icon-2','icon-42'], 'Successes are only present in exports');
      assert.deepEqual(await selectedIssues(), []);
      assert(await retry.isDisabled());
      assert.equal(await page.locator('#iconfontResults b').count(), 0);
      assert.match(await issueName('icon-42').textContent(), /<b>Mask<\/b>/);
      await issueBox('icon-2').check();
      await issueName('icon-42').click();
      const locate = await last();
      assert.equal(locate.type, 'iconfont-locate-source');
      assert.equal(locate.sourceId, 'icon-42');
      assert.deepEqual(await selectedIssues(), ['icon-2'], 'Locating a name leaves existing checks intact');
      await emit({ type:'iconfont-locate-result', requestId:locate.requestId, sourceId:'icon-42', ok:true });
      const row = issues.filter({ has:page.locator('input[value="icon-1"]') });
      const rowSize = await row.boundingBox();
      await row.click({ position:{ x:Math.floor(rowSize.width - 3), y:Math.floor(rowSize.height / 2) } });
      const rowLocate = await last();
      assert.equal(rowLocate.type, 'iconfont-locate-source');
      assert.equal(rowLocate.sourceId, 'icon-1', 'The whole result row can locate the original');
      assert.deepEqual(await selectedIssues(), ['icon-2']);
      await emit({ type:'iconfont-locate-result', requestId:rowLocate.requestId, sourceId:'icon-1', ok:false, error:'原图层已删除' });
      assert.match(await page.locator('#iconfontPanel').innerText(), /原图层已删除/);
      assert.deepEqual(await issueIds(), ['icon-1','icon-2','icon-42']);

      // A locate or a manual selection may replace the canvas selection completely.
      await emit({ type:'iconfont-selection', count:0, childCount:0, targets:{selection:[],children:[]} });
      assert(await copy.isDisabled());
      assert.deepEqual(await selectedIssues(), ['icon-2']);
      await issueBox('icon-1').check();
      await retry.click();
      const round2 = await last();
      assert.equal(round2.type, 'iconfont-repair-run');
      assert.equal(round2.action, batch.action);
      assert.equal(round2.retryOf, batch.requestId);
      assert.notEqual(round2.requestId, batch.requestId);
      assert.deepEqual(round2.targetIds.slice().sort(), ['icon-1','icon-2']);
      assert(await retry.isDisabled());
      await report(round2, [
        ready('icon-1','Icon/Arrow', svg2), issue('icon-2','Broken','failed','仍无法闭合路径')
      ]);
      assert.deepEqual(await issueIds(), ['icon-2','icon-42'], 'Failed and unattempted originals survive a partial retry');
      assert.match(await issues.first().innerText(), /仍无法闭合路径/);
      assert.match(await issues.last().innerText(), /包含蒙版/);
      await issueAll.check();
      assert.deepEqual(await selectedIssues(), ['icon-2','icon-42']);
      await retry.click();
      const round3 = await last();
      assert.equal(round3.retryOf, batch.requestId);
      assert.notEqual(round3.requestId, round2.requestId);
      assert.deepEqual(round3.targetIds.slice().sort(), ['icon-2','icon-42']);
      await report(round3, [
        ready('icon-2','repaired', svg3), issue('icon-42','<b>Mask</b>','skipped','原图层已删除')
      ]);
      assert.deepEqual(await issueIds(), ['icon-42']);
      const files = [['icon-arrow.svg',svg], ['Icon-Arrow-2.svg',svg2], ['repaired.svg',svg3]];
      await page.locator('#iconfontIndividual summary').click();
      assert.equal(await fileSelect.locator('option').count(), files.length);
      for (let index = 0; index < files.length; index++) {
        await fileSelect.selectOption({ index });
        const [single] = await Promise.all([page.waitForEvent('download'), page.locator('#iconfontDownload').click()]);
        assert.equal(single.suggestedFilename(), files[index][0]);
        assert.equal(await fs.readFile(await single.path(), 'utf8'), files[index][1]);
      }
      const [zip] = await Promise.all([page.waitForEvent('download'), zipButton.click()]);
      const bytes = await fs.readFile(await zip.path());
      const entries = await page.evaluate(async bytes => {
        const archive = await JSZip.loadAsync(new Uint8Array(bytes));
        return Promise.all(Object.values(archive.files).map(async file => [file.name, await file.async('string')]));
      }, Array.from(bytes));
      assert.deepEqual(entries, files, 'Offline ZIP includes successful copies from every round exactly once');

      // A new run rejected before touching any layers leaves the prior report actionable.
      await issueBox('icon-42').check();
      await fileSelect.selectOption('icon-1');
      await emit(selection);
      await copy.click();
      const rejected = await last();
      await report(rejected, [], {error:'选区已变化'});
      assert.deepEqual(await selectedIssues(), ['icon-42']);
      assert.equal(await fileSelect.inputValue(), 'icon-1');
      assert(await fileSelect.isVisible());
      await retry.click();
      const preserved = await last();
      assert.equal(preserved.retryOf, batch.requestId);
      await report(preserved, [issue('icon-42','<b>Mask</b>','skipped','原图层已删除')]);
      await page.locator('[data-report="inplace"]').click();
      assert.deepEqual(await issueIds(), ['icon-42']);
      assert.match(await issues.first().innerText(), /Unsupported/);
      assert(await zipButton.isHidden());

      // Select all includes unchecked pages, and duplicate layer names keep their own IDs.
      await emit(selection);
      await page.locator('#iconfontAll').check();
      await inplace.click();
      const many = await last();
      assert.equal(many.targetIds.length, large.length);
      await report(many, large.map(item => issue(item.id, 'Same layer name', 'failed', '需手动调整')));
      assert.equal((await issueIds()).length, 40);
      await issueAll.check();
      await page.locator('#iconfontIssueNext').click();
      assert.equal((await selectedIssues()).length, 40);
      await issueBox('icon-41').uncheck();
      assert(await issueAll.evaluate(el => el.indeterminate));
      await page.locator('#iconfontIssueNext').click();
      assert.deepEqual(await selectedIssues(), ['icon-80','icon-81','icon-82']);
      await retry.click();
      const bulk = await last();
      assert.equal(bulk.retryOf, many.requestId);
      assert.equal(bulk.action, 'inplace');
      assert.deepEqual(bulk.targetIds.slice().sort(), large.filter(item => item.id !== 'icon-41').map(item => item.id).sort());
      await report(bulk, bulk.targetIds.map(sourceId => ({sourceId,name:'Same layer name',status:'fixed'})));
      assert.deepEqual(await issueIds(), ['icon-41']);
      await issueAll.check();
      await retry.click();
      const finalOriginal = await last();
      assert.equal(finalOriginal.retryOf, many.requestId);
      await report(finalOriginal, [{sourceId:'icon-41',name:'Same layer name',status:'fixed'}]);
      assert.equal(await issues.count(), 0);
      assert(await retry.isHidden(), 'Resolved reports have no exception actions');
      assert(await zipButton.isHidden());
      await page.locator('[data-report="copy"]').click();
      assert.deepEqual(await issueIds(), ['icon-42']);
      await page.setViewportSize({ width:340, height:440 });
      await page.evaluate(() => { setCompactMode(true); changeTheme('dark'); changeLanguage('en'); });
      assert.match(await zipButton.innerText(), /ZIP.*3/);
      assert(await page.locator('#iconfontPanel').evaluate(panel => panel.scrollWidth <= panel.clientWidth));
      const buttons = await page.locator('.iconfont-actions button').evaluateAll(buttons => buttons.map(button => {
        const rect = button.getBoundingClientRect();
        return [rect.y, rect.x, rect.right];
      }));
      assert.equal(buttons[0][0], buttons[1][0], 'Both actions remain adjacent in compact English mode');
      assert(buttons[1][1] >= buttons[0][2]);
      assert.deepEqual(errors, []);
      await page.close();
      console.log(platform + ' iconfont panel passed exception-only reports, original location, paged retries, and multi-round SVG and ZIP downloads.');
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
