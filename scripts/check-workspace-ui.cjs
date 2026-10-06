/* Optional browser regression. npm install --no-save playwright, or provide
   PLAYWRIGHT_MODULE_PATH; PLAYWRIGHT_EXECUTABLE_PATH selects an installed browser. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = path.resolve(__dirname, '..');
const output = process.env.UI_REVIEW_DIR || fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'allinone-review-'));
fs.mkdirSync(output, { recursive:true });
(async () => {
  const browser = await chromium.launch({ headless:true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
  try {
    for (const platform of ['figma','mastergo']) {
      const page = await browser.newPage({ viewport:{ width:440, height:600 } });
      // Capture final visual states, not transient fading between panels.
      const screenshot = options => page.screenshot({ animations:'disabled', ...options });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('https://**/*', route => route.abort());
      await page.addInitScript(() => { window.__sent = []; window.parent.postMessage = message => { if (message.pluginMessage) window.__sent.push(message.pluginMessage); }; });
      await page.goto(pathToFileURL(path.join(root, platform, 'ui.html')).href);
      await page.waitForFunction(() => window.PluginWorkspace && document.querySelectorAll('#smartBasicList .smart-fill-trigger').length > 0);
      await screenshot({ path:path.join(output, `${platform}-tools.png`) });
      const routes = await page.locator('.nav-item').evaluateAll(items => items.map(item => item.dataset.nav));
      assert.equal(routes.length, 14);
      for (const mode of ['normal','compact','small-english-dark']) {
        await page.setViewportSize(mode === 'normal' ? { width:440,height:600 } : mode === 'compact' ? { width:360,height:520 } : { width:340,height:440 });
        await page.evaluate(mode => {
          setCompactMode(mode !== 'normal');
          changeLanguage(mode === 'small-english-dark' ? 'en' : 'zh');
          changeTheme(mode === 'small-english-dark' ? 'dark' : 'light');
        }, mode);
        for (const key of routes) {
          await page.locator(`.nav-item[data-nav="${key}"]`).click();
          assert.equal(await page.locator('.nav-item.active').count(), 1, `${mode} ${key}: active navigation`);
          assert.equal(await page.locator(`.nav-item[data-nav="${key}"]`).getAttribute('aria-current'), 'page');
          assert(await page.locator('#workspaceTitle').innerText());
          const bounds = await page.evaluate(() => ({
            rootX:document.documentElement.scrollWidth > innerWidth,
            rootY:document.documentElement.scrollHeight > innerHeight,
            panels:[...document.querySelectorAll('#contentScroll > [id$="Panel"]')].filter(el => getComputedStyle(el).display !== 'none').map(el => { const box = el.getBoundingClientRect(); return { id:el.id, right:box.right, bottom:box.bottom }; }),
            width:innerWidth, height:innerHeight
          }));
          assert(!bounds.rootX && !bounds.rootY, `${platform}/${mode}/${key}: document overflow`);
          assert.equal(bounds.panels.length, 1, `${key}: exactly one panel`);
          for (const box of bounds.panels) assert(box.right <= bounds.width + 1 && box.bottom <= bounds.height + 1, `${mode}/${key}: panel overflow`);
          if (key === 'size') {
            const before = await page.locator('.sidebar').boundingBox();
            await page.locator('.size-scroll').evaluate(el => { el.scrollTop = el.scrollHeight; });
            assert.deepEqual(await page.locator('.sidebar').boundingBox(), before);
            const action = await page.locator('#sizeApplyBtn').boundingBox();
            assert(action.y + action.height <= bounds.height, 'Size action remains visible');
          }
          if (mode === 'normal') await screenshot({ path:path.join(output, `${platform}-panel-${key}.png`) });
        }
        await page.evaluate(() => PluginWorkspace.navigate('simple'));
        await screenshot({ path:path.join(output, `${platform}-${mode}.png`) });
      }
      await page.setViewportSize({ width:440,height:600 });
      await page.evaluate(() => { setCompactMode(false); changeLanguage('zh'); changeTheme('light'); PluginWorkspace.navigate('simple'); });
      await page.locator('#toolSearch').fill('不存在的功能 xyz');
      assert(await page.locator('#toolEmptyState').isVisible());
      await page.locator('.workspace-reset').click();
      assert.equal(await page.locator('.tool-card:visible').count(), 22);
      await page.locator('#toolSearch').fill('auto layout');
      assert.equal(await page.locator('.tool-card:visible').count(), 2);
      await page.locator('#toolSearch').press('Escape');
      await page.locator('.tool-filter').filter({ hasText:/^文字$/ }).click();
      assert.equal(await page.locator('.tool-card:visible').count(), 2);
      await page.locator('.tool-filter').filter({ hasText:/^全部$/ }).click();
      const scroll = page.locator('#toolGrid').locator('..');
      await scroll.evaluate(el => { el.scrollTop = 150; });
      await page.evaluate(() => { PluginWorkspace.navigate('text'); PluginWorkspace.navigate('simple'); });
      assert.equal(await scroll.evaluate(el => el.scrollTop), 150, 'Remember panel scroll');
      await page.locator('#workspaceSearchButton').click();
      await page.locator('#commandQuery').fill('尺寸');
      assert.equal(await page.locator('.command-result').first().locator('span').innerText(), '尺寸助手');
      await page.locator('#commandQuery').press('Enter');
      assert.equal(await page.locator('#workspaceTitle').innerText(), '尺寸助手');
      assert.equal(await page.locator('#workspaceCommands').evaluate(el => el.open), false);
      const size = await page.locator('#sizeWidth').inputValue();
      assert((await page.locator('#sizeTargetSummary').innerText()).startsWith(size));
      await page.locator('.size-scroll').evaluate(el => { el.scrollTop = 0; });
      await screenshot({ path:path.join(output, `${platform}-size.png`) });
      await page.locator('#sizeWidth').fill('500');
      await page.locator('[data-size-category="tablet"]').click();
      assert.equal(await page.locator('#sizeWidth').inputValue(), '500', 'Browsing presets does not change the target');
      assert.equal(await page.locator('.size-preset.active').count(), 0, 'Custom dimensions are not falsely marked as a preset');
      await page.locator('#sizePresetMode').selectOption('native');
      assert.equal(await page.locator('#sizeWidth').inputValue(), '500');
      await page.locator('.size-preset').first().click();
      assert.equal(await page.locator('#sizeWidth').inputValue(), '2064');
      await page.evaluate(() => { openSettings(); closeSettings(); });
      assert.equal(await page.locator('#workspaceTitle').innerText(), '尺寸助手', 'Settings returns to the prior task');
      await page.evaluate(() => { PluginWorkspace.navigate('compkit'); switchCompKitTab('showcase'); PluginWorkspace.navigate('refiner'); switchRefinerTab('find'); PluginWorkspace.navigate('compkit'); });
      assert(await page.locator('#tabCompKitShowcase').isVisible(), 'Refiner tabs must not hide CompKit tabs');
      await page.locator('[data-nav="smartFill"]').click();
      await page.evaluate(() => openBasicSetting('number', new Event('click')));
      await page.locator('input[name="numGeneration"][value="sequence"]').check();
      assert.equal(await page.locator('input[name="numGeneration"][value="sequence"]').evaluate(el => el.parentElement.classList.contains('active')), true);
      await page.locator('#numSeqStart').fill('2');
      await page.locator('#numSeqStep').fill('0');
      assert.equal(await page.locator('#smartSequencePreview').innerText(), '前 5 项：2 · 2 · 2 · 2 · 2');
      assert(!(await page.locator('#numSeqSecond').isVisible()));
      await screenshot({ path:path.join(output, `${platform}-sequence.png`) });
      await page.evaluate(() => {
        saveAndFill();
        window.dispatchEvent(new MessageEvent('message', { data:{ pluginMessage:{ type:'selection-count-res', count:3, nodeIds:['1','2','3'] } } }));
      });
      const fill = await page.evaluate(() => __sent.filter(message => message.type === 'smart-fill-exec').at(-1));
      assert.deepEqual(fill.dataList, ['2','2','2']);
      assert.deepEqual(fill.nodeIds, ['1','2','3']);
      await page.evaluate(() => {
        window.dispatchEvent(new MessageEvent('message', { data:{ pluginMessage:{ type:'smart-fill-result', count:3, errors:[], message:'已填充 3 个文本' } } }));
        closeSubPage('pageBasicSetting');
        customDataLists = [{ title:'<img src=x onerror="window.__injected=true">', list:['A'] }];
        switchSmartTab('custom');
      });
      assert.equal(await page.locator('#smartCustomList img').count(), 0);
      assert(!(await page.evaluate(() => window.__injected)));
      assert.equal(await page.locator('#smartFillPanel').getAttribute('aria-busy'), 'false');
      await page.evaluate(() => { openBasicSetting('date', new Event('click')); });
      await page.locator('#dateStart').fill('2026-01-01');
      await page.evaluate(() => closeSubPage('pageBasicSetting'));
      // Command palette search never executes the mutation it finds.
      const prior = await page.evaluate(() => __sent.length);
      await page.keyboard.press('Control+k');
      await page.locator('#commandQuery').fill('删除隐藏图层');
      await page.locator('#commandQuery').press('Enter');
      assert.equal(await page.evaluate(() => __sent.length), prior);
      assert.equal(await page.locator(':focus').getAttribute('data-key'), 'remove_hidden');
      await page.keyboard.press('Control+k');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#workspaceCommands').evaluate(el => el.open), false);
      await page.evaluate(() => changeLanguage('en'));
      await page.keyboard.press('Control+k');
      await page.locator('#commandQuery').fill('组件构建');
      assert(await page.locator('.command-result').count() > 0, 'Chinese lookup remains available in English UI');
      await page.keyboard.press('Escape');
      assert.deepEqual(errors, [], `${platform}: browser errors`);
      console.log(`${platform}: 14 routes × 3 sizes, both themes/languages, search, keyboard, scrolling, size actions, fill preview/flow and safe custom titles passed.`);
      await page.close();
    }
  } finally { await browser.close(); }
  console.log('Review screenshots: ' + output);
})().catch(error => { console.error(error); process.exitCode = 1; });
