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
          assert(await page.locator('#contentScroll > [role="region"]:visible').getAttribute('aria-label'));
          const bounds = await page.evaluate(() => ({
            rootX:document.documentElement.scrollWidth > innerWidth,
            rootY:document.documentElement.scrollHeight > innerHeight,
            panels:[...document.querySelectorAll('#contentScroll > [id$="Panel"]')].filter(el => getComputedStyle(el).display !== 'none').map(el => { const box = el.getBoundingClientRect(); return { id:el.id, right:box.right, bottom:box.bottom }; }),
            width:innerWidth, height:innerHeight
          }));
          assert(!bounds.rootX && !bounds.rootY, `${platform}/${mode}/${key}: document overflow`);
          assert.equal(bounds.panels.length, 1, `${key}: exactly one panel`);
          for (const box of bounds.panels) assert(box.right <= bounds.width + 1 && box.bottom <= bounds.height + 1, `${mode}/${key}: panel overflow`);
          const controlIssues = await page.locator('#contentScroll button:visible, #contentScroll [role="button"]:visible').evaluateAll(elements => elements.flatMap(el => {
            const s = getComputedStyle(el);
            if (el.id === 'dashGreeting') return [];
            return s.borderTopLeftRadius !== '4px' || s.lineHeight !== '16px' ? [el.id || el.className] : [];
          }));
          assert.deepEqual(controlIssues, [], `${platform}/${mode}/${key}: control radius and line height`);
          if (key === 'simple') {
            assert.equal(await page.locator('#toolGrid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 3);
            if (mode !== 'small-english-dark') assert(await page.locator('.tool-card').last().evaluate(el => el.getBoundingClientRect().bottom <= innerHeight), 'All quick tools fit in the normal and compact Chinese first screen');
          }
          if (key === 'i18n') {
            const help = await page.locator('#i18nModeDesc').innerText();
            assert(help.startsWith(mode === 'small-english-dark' ? 'Replace:' : '直接替换：'), 'Help matches the active mode and UI language');
            assert(!help.includes('<b>'), 'No literal markup in translated help');
          }
          if (key === 'smartFill') {
            assert(await page.locator('.smart-basic-tile').evaluateAll(tiles => tiles.every(tile => {
              const box = tile.getBoundingClientRect();
              const title = tile.querySelector('.smart-fill-trigger');
              return tile.getAttribute('aria-labelledby') === title.id && getComputedStyle(tile).borderTopWidth === '0px'
                && [...tile.querySelectorAll('button')].every(button => {
                  const b = button.getBoundingClientRect();
                  return b.left >= box.left && b.right <= box.right + 1 && b.top >= box.top && b.bottom <= box.bottom + 1;
                });
            })), 'Every title, setting and option stays inside one borderless group');
            assert.equal(await page.locator('.smart-basic-tile > .row-tags').count(), 0, 'Options belong to the same heading flow');
            if (mode === 'normal') assert(await page.locator('.smart-basic-tile').last().evaluate(el =>
              el.getBoundingClientRect().bottom <= document.getElementById('smartAffixBar').getBoundingClientRect().top
            ), 'All basic types fit above the fixed affix bar');
            await screenshot({ path:path.join(output, `${platform}-fill-${mode}.png`) });
          }
          if (key === 'select') {
            assert.equal(await page.locator('.selector-card').first().evaluate(el => getComputedStyle(el).padding), '0px');
            assert.equal(await page.locator('.selector-card').first().evaluate(el => getComputedStyle(el).borderTopWidth), '0px');
          }
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
      assert.equal(await page.locator('#workspaceTitle, .workspace-brand, #toolSearch, #toolFilters, #workspaceCommands').count(), 0, 'No redundant header, categories or search');
      assert.equal(await page.locator('.tool-card:visible').count(), 22);
      const grid = await page.locator('#toolGrid').evaluate(el => {
        const cards = [...el.children];
        return { columns:getComputedStyle(el).gridTemplateColumns.split(' ').length,
          visible:cards.every(card => { const b=card.getBoundingClientRect(); return b.top >= 0 && b.bottom <= innerHeight; }) };
      });
      assert.equal(grid.columns, 3);
      assert(grid.visible, 'All 22 quick tools fit in the default first screen');
      await page.locator('[data-nav="size"]').focus();
      await page.keyboard.press('Enter');
      assert(await page.locator('#sizePanel').isVisible(), 'Keyboard navigation works without a command palette');
      const scroll = page.locator('.size-scroll');
      await scroll.evaluate(el => { el.scrollTop = 150; });
      await page.evaluate(() => { PluginWorkspace.navigate('text'); PluginWorkspace.navigate('size'); });
      assert.equal(await scroll.evaluate(el => el.scrollTop), 150, 'Remember panel scroll');
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
      await page.evaluate(() => openSettings());
      assert(await page.locator('#settingsPanel > .sub-header').isVisible(), 'Settings keeps its local back action');
      await screenshot({ path:path.join(output, `${platform}-settings.png`) });
      await page.locator('#settingsPanel .btn-back-sub').click();
      assert(await page.locator('#sizePanel').isVisible(), 'Settings returns to the prior task');
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
      // Dense fill layout and one shared affix transaction path for all sources.
      const replyCount = async () => {
        await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { data:{ pluginMessage:{ type:'selection-count-res', count:2, nodeIds:['first','second'] } } })));
        return page.evaluate(() => __sent.filter(message => message.type === 'smart-fill-exec').at(-1));
      };
      const finishFill = () => page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { data:{ pluginMessage:{ type:'smart-fill-result', count:2, errors:[], message:'已填充 2 个文本' } } })));
      await page.evaluate(() => switchSmartTab('basic'));
      assert.equal(await page.locator('#smartBasicList .smart-basic-tile').count(), await page.evaluate(() => basicDataTypes.length));
      assert.equal(await page.locator('#smartBasicList .btn-to-ai').count(), 0);
      assert.equal(await page.locator('#smartBasicList').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 2);
      assert(await page.locator('.smart-basic-heading').evaluateAll(rows => rows.every(row => {
        const setting = row.querySelector('.smart-setting-btn');
        if (!setting) return true;
        const a = row.querySelector('.smart-fill-trigger').getBoundingClientRect(), b = setting.getBoundingClientRect();
        return Math.abs(a.y + a.height / 2 - b.y - b.height / 2) < 1;
      })), 'Names and settings share the same line');
      const beforeTag = await page.evaluate(() => __sent.length);
      await page.locator('#smartBasicList .tag-btn').first().click();
      assert.equal(await page.evaluate(() => __sent.length), beforeTag, 'Tag changes never fill the canvas');
      await page.locator('[data-fill-type="name"] .smart-fill-trigger').click();
      const chineseNames = await replyCount();
      assert(await page.evaluate(names => {
        const entries = new Map(ChineseNameLibrary.entries.map(entry => [entry.name, entry]));
        return names.every(name => entries.has(name)) && entries.get(names[0]).gender !== entries.get(names[1]).gender;
      }, chineseNames.dataList), 'Chinese name fill uses curated full names with gender variety');
      await finishFill();
      await page.locator('[data-fill-type="name"] .tag-btn').first().click();
      await page.locator('[data-fill-type="name"] .tag-btn').last().click();
      await page.locator('[data-fill-type="name"] .smart-fill-trigger').click();
      const englishNames = await replyCount();
      assert(englishNames.dataList.every(name => /^[A-Za-z]+ [A-Za-z]+$/.test(name)), 'English names keep their existing behavior');
      await finishFill();
      await page.locator('#sfPrefix').check();
      await page.locator('[data-fill-type="number"] .smart-fill-trigger').click();
      await page.locator('#sfSuffix').check();
      assert(!(await page.locator('#sfPrefix').isChecked()), 'Affix modes remain exclusive');
      const basicAffix = await replyCount();
      assert.equal(basicAffix.mode, 'prefix', 'Fill mode is captured at click time');
      assert.deepEqual(basicAffix.dataList, ['2','2']);
      await finishFill();
      await page.evaluate(() => { switchSmartTab('ai'); document.getElementById('aiResultArea').textContent = '甲\n乙'; });
      assert(await page.locator('#smartAffixBar').isVisible());
      await page.locator('[onclick="applyAiFill(\'random\')"]').click();
      const aiAffix = await replyCount();
      assert.equal(aiAffix.mode, 'suffix');
      assert.equal(aiAffix.distribution, 'random');
      assert.deepEqual(aiAffix.nodeIds, ['first','second']);
      assert.deepEqual(aiAffix.dataList, ['甲','乙']);
      await finishFill();
      await page.evaluate(() => {
        customDataLists = [{ title:'部门列表', list:['设计','产品'] }, { title:'一个很长的自定义字段标题用于验证单行省略与完整提示', list:['内容'] }];
        switchSmartTab('custom');
      });
      assert.equal(await page.locator('#smartCustomList .smart-custom-count, #smartCustomList .smart-fill-trigger').count(), 0);
      await page.locator('#sfPrefix').check();
      await page.locator('.smart-custom-fill').first().click();
      await page.evaluate(() => { customDataLists[0].list[0] = '已变更'; });
      const customAffix = await replyCount();
      assert.equal(customAffix.mode, 'prefix');
      assert.equal(customAffix.distribution, 'order');
      assert.deepEqual(customAffix.dataList, ['设计','产品'], 'List data is captured before edits');
      await finishFill();
      for (const compact of [false,true]) {
        await page.setViewportSize(compact ? { width:340,height:440 } : { width:440,height:600 });
        await page.evaluate(compact => { setCompactMode(compact); changeLanguage(compact ? 'en' : 'zh'); switchSmartTab('custom'); }, compact);
        await screenshot({ path:path.join(output, `${platform}-custom-${compact ? 'compact' : 'normal'}.png`) });
        assert(await page.locator('.smart-custom-row').evaluateAll(rows => rows.every(row => {
          const a = row.querySelector('.smart-label').getBoundingClientRect(), b = row.querySelector('.smart-custom-actions').getBoundingClientRect();
          return Math.abs(a.y + a.height / 2 - b.y - b.height / 2) < 1 && b.right <= innerWidth;
        })), 'Custom titles and all four actions stay on one line');
        const bar = await page.locator('#smartAffixBar').boundingBox(), add = await page.locator('#sfAffixApply').boundingBox();
        assert(bar.y + bar.height <= (compact ? 440 : 600) && add.x + add.width <= (compact ? 340 : 440), 'Affix actions remain inside the viewport');
      }
      await page.locator('#sfSuffix').check();
      await page.locator('#sfAffixText').fill('， ');
      await page.locator('#sfAffixText').press('Enter');
      const chars = await replyCount();
      assert.equal(chars.mode, 'suffix');
      assert.deepEqual(chars.dataList, ['， '], 'Literal punctuation and spaces are preserved');
      await finishFill();
      await page.setViewportSize({ width:440,height:600 });
      await page.evaluate(() => { setCompactMode(false); changeLanguage('zh'); });

      await page.evaluate(() => PluginWorkspace.navigate('simple'));
      assert(await page.locator('#dashGreeting').isVisible());
      assert(await page.locator('#dashGreeting').innerText());
      await page.evaluate(() => { aiConfig = { baseUrl:'https://example.test/v1', model:'test-model', key:'test-key' }; updateGreeting(); });
      const greetingRequest = await page.evaluate(() => __sent.filter(message => message.type === 'do-fetch' && message.reqId?.startsWith('greeting-')).at(-1));
      assert(greetingRequest);
      await page.evaluate(reqId => window.dispatchEvent(new MessageEvent('message', { data:{ pluginMessage:{ type:'api-response', reqId, data:{ choices:[{ message:{ content:'🌈 愿今天的设计，多一点好灵感。' } }] } } } })), greetingRequest.reqId);
      assert.equal(await page.locator('#dashGreeting').innerText(), '🌈 愿今天的设计，多一点好灵感。');
      assert.equal(await page.locator('#dashGreeting svg').count(), 0, 'Greeting emoji remain expressive text');
      const greetingCount = await page.evaluate(() => __sent.filter(message => message.type === 'do-fetch').length);
      await page.evaluate(() => updateGreeting());
      assert.equal(await page.evaluate(() => __sent.filter(message => message.type === 'do-fetch').length), greetingCount, 'Daily greeting is cached');
      await page.locator('#dashGreeting').click();
      const retry = await page.evaluate(() => __sent.filter(message => message.type === 'do-fetch').at(-1));
      assert.notEqual(retry.reqId, greetingRequest.reqId);
      await page.evaluate(reqId => window.dispatchEvent(new MessageEvent('message', { data:{ pluginMessage:{ type:'api-response', reqId, error:'offline' } } })), retry.reqId);
      assert(!(await page.locator('#dashGreeting').isDisabled()), 'Greeting failure releases the refresh button');
      assert.equal(await page.locator('.tool-card:visible').count(), 22, 'Greeting failure does not hide tools');
      await page.evaluate(() => { aiConfig.key = ''; });
      await page.locator('.tool-card').first().focus();
      assert(await page.locator('.tool-card').first().getAttribute('aria-describedby'));
      await page.evaluate(() => changeLanguage('en'));
      assert.equal(await page.locator('.tool-card:visible').count(), 22);
      await page.evaluate(() => PluginWorkspace.navigate('i18n'));
      await page.locator('[data-key="i18n_action_update"]').click();
      assert((await page.locator('#i18nModeDesc').innerText()).startsWith('Update Mode:'));
      await page.evaluate(() => changeLanguage('zh'));
      assert((await page.locator('#i18nModeDesc').innerText()).startsWith('更新 Mode：'), 'Changing UI language preserves the current action explanation');
      assert.deepEqual(errors, [], `${platform}: browser errors`);
      console.log(`${platform}: 14 routes × 3 sizes, shared affixes (basic/AI/custom/characters), dense layouts, greeting cache/fallback, keyboard, scrolling, size actions, fill preview and safe titles passed.`);
      await page.close();
    }
  } finally { await browser.close(); }
  console.log('Review screenshots: ' + output);
})().catch(error => { console.error(error); process.exitCode = 1; });
