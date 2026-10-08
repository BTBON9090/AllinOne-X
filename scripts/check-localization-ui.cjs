const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = path.resolve(__dirname, '..');
const output = process.env.UI_REVIEW_DIR || fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'allinone-localization-'));
fs.mkdirSync(output, { recursive:true });
(async () => {
  const browser = await chromium.launch({ headless:true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
  try {
    for (const platform of ['figma','mastergo']) {
      const page = await browser.newPage({ viewport:{ width:440,height:600 }, timezoneId:'Asia/Shanghai' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('https://**/*', route => route.abort());
      await page.addInitScript(() => {
        window.__sent = [];
        window.parent.postMessage = message => { if (message.pluginMessage) window.__sent.push(message.pluginMessage); };
      });
      await page.goto(pathToFileURL(path.join(root,platform,'ui.html')).href);
      await page.waitForFunction(() => window.TheoryWorkspace && window.PluginLocalization);
      if (platform === 'mastergo') await page.evaluate(() => {
        // MasterGo uses a UI-thread fetch adapter; mock the transport, not the composer.
        window.runMasterGoFetch = data => { window.__sent.push({ type:'do-fetch',...data }); };
      });
      const screenshot = name => page.screenshot({ path:path.join(output,platform + '-' + name + '.png'), animations:'disabled' });
      const noChinese = async selector => {
        const leaked = await page.locator(selector).evaluate(element => {
          const result = [];
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const text = walker.currentNode, parent = text.parentElement;
            if (parent.closest('script,style,svg')) continue;
            if (parent.getClientRects().length && /[\u3400-\u9fff]/.test(text.nodeValue)) result.push(text.nodeValue.trim());
          }
          for (const target of [element,...element.querySelectorAll('[title],[placeholder],[aria-label],optgroup')]) {
            if (!target.getClientRects().length) continue;
            if (target.id === 'settingsLang' || target.id === 'showcasePresetSelect') continue;
            for (const name of ['title','placeholder','aria-label','label']) {
              const text = target.getAttribute(name);
              if (text && /[\u3400-\u9fff]/.test(text)) result.push(name + ': ' + text);
            }
          }
          return [...new Set(result)].filter(Boolean);
        });
        assert.deepEqual(leaked, [], platform + '/' + selector + ': English UI has untranslated Chinese');
      };
      await page.evaluate(() => changeLanguage('en'));
      const routes = await page.locator('.nav-item').evaluateAll(items => items.map(item => item.dataset.nav));
      for (const key of [...routes,'settings']) {
        await page.evaluate(key => PluginWorkspace.navigate(key), key);
        await noChinese('#contentScroll');
      }
      const enKeys = await page.evaluate(() => Object.entries(i18n.en).filter(([key,value]) => /[\u3400-\u9fff]/.test(JSON.stringify(value))).map(([key]) => key));
      assert.deepEqual(enKeys, [], 'Reviewed English dictionary has no untranslated Chinese entries');
      await page.evaluate(() => { PluginWorkspace.navigate('select'); addPropRow(); });
      assert(await page.locator('#propList option, #propList optgroup').evaluateAll(options => options.every(option =>
        !/[\u3400-\u9fff]/.test(option.label || option.textContent)
      )), 'All advanced properties and group names are translated');
      await page.evaluate(() => PluginWorkspace.navigate('size'));
      const targetBefore = await page.locator('#sizeWidth').inputValue();
      for (const category of ['mobile','tablet','desktop','wearable','ratio']) {
        await page.evaluate(category => setSizeCategory(category,document.querySelector('[data-size-category="' + category + '"]')),category);
        await noChinese('#sizePanel');
      }
      await page.evaluate(() => changeLanguage('zh'));
      await page.evaluate(() => changeLanguage('en'));
      assert.equal(await page.locator('#sizeWidth').inputValue(),targetBefore,'Changing language does not apply a size preset');
      await page.evaluate(() => PluginWorkspace.navigate('smartFill'));
      for (const key of ['number','date','time']) {
        await page.evaluate(key => openBasicSetting(key,new Event('click')),key);
        if (key !== 'date') {
          await page.locator('input[name="' + (key === 'number' ? 'numGeneration' : 'timeGeneration') + '"][value="sequence"]').check();
        }
        await noChinese('#pageBasicSetting');
        await page.evaluate(() => closeSubPage('pageBasicSetting'));
      }
      await page.evaluate(() => {
        smartSettings.time.start = '01:02:03'; smartSettings.time.end = '23:45:56';
        openBasicSetting('time',new Event('click'));
      });
      assert.equal(await page.locator('#timeStart').inputValue(),'01:02:03');
      assert.equal(await page.locator('#timeEnd').inputValue(),'23:45:56');
      await page.evaluate(() => closeSubPage('pageBasicSetting'));
      await page.evaluate(() => switchSmartTab('ai'));
      await noChinese('#smartAI');
      // UI words used as actual data must stay unchanged.
      await page.evaluate(() => {
        customDataLists = [{ title:'设置',list:['查找配置'] }]; renderCustomList();
        document.getElementById('aiResultArea').textContent = '查找配置';
        const fixture = document.createElement('div'); fixture.id = 'locale-data-fixture';
        for (const name of ['sel-result-name','comp-info','dup-pair-name','txt-old','txt-new']) {
          const element = document.createElement('span'); element.className = name; element.textContent = '设置'; fixture.append(element);
        }
        document.body.append(fixture);
        const option = document.createElement('option'); option.value = '设置'; option.textContent = '设置';
        document.getElementById('compkitXSelect').append(option);
        PluginLocalization.refresh();
      });
      assert.equal(await page.locator('#smartCustomList .smart-label').innerText(),'设置');
      assert.equal(await page.locator('#aiResultArea').innerText(),'查找配置');
      assert(await page.locator('#locale-data-fixture > span').evaluateAll(items => items.every(item => item.textContent === '设置')));
      assert.equal(await page.locator('#compkitXSelect option[value="设置"]').textContent(),'设置');
      await page.evaluate(() => { document.getElementById('locale-data-fixture').remove(); PluginWorkspace.navigate('theory'); });
      const ids = await page.evaluate(() => theoryDB.map(item => item.id));
      for (const id of ids) {
        await page.evaluate(id => openTheoryDetail(id),id);
        await noChinese('#theoryDetailView');
        assert.equal(await page.locator('.theory-principle').count(),await page.evaluate(id => theoryDB.find(item => item.id === id).subItems.length,id));
      }
      await page.evaluate(() => openTheoryDetail('nielsen'));
      await screenshot('theory-detail-en');
      await page.locator('#theorySectionSelect').selectOption('9');
      assert(await page.locator('.theory-article-scroll').evaluate(element => element.scrollTop > 0),'Chapter navigation scrolls the article');
      await page.evaluate(() => changeLanguage('zh'));
      assert((await page.locator('#detailTitle').innerText()).includes('尼尔森'));
      await page.locator('.theory-article-scroll').evaluate(element => { element.scrollTop = 0; });
      await screenshot('theory-detail-zh');
      await page.evaluate(() => { closeTheoryDetail(); changeLanguage('en'); });
      await screenshot('theory-library-en');
      await page.evaluate(() => { aiConfig = { provider:'custom',baseUrl:'',model:'',key:'' }; });
      const beforeKeyboard = await page.evaluate(() => __sent.length);
      await page.locator('#theoryQuestionInput').fill('Explain proximity.');
      await page.locator('#theoryQuestionInput').press('Shift+Enter');
      assert(await page.locator('#theoryHomeView').isVisible());
      await page.locator('#theoryQuestionInput').dispatchEvent('keydown',{ key:'Enter',isComposing:true });
      assert.equal(await page.evaluate(() => __sent.length),beforeKeyboard,'IME confirmation and newlines do not submit');
      await page.locator('#theoryQuestionInput').press('Enter');
      assert(await page.locator('#theoryChatView').isVisible());
      assert((await page.locator('#theoryChatMessages').innerText()).includes('Configure an AI service'));
      await page.evaluate(() => {
        closeTheoryChat(); aiConfig = { baseUrl:'https://example.test/v1',model:'test-model',key:'test-key' };
        openTheoryDetail('fitts');
      });
      await page.locator('#theoryDetailInput').fill('How does this apply to a toolbar?');
      await page.locator('#theoryDetailInput').press('Enter');
      const request = await page.evaluate(() => __sent.filter(message => message.type === 'do-fetch' && message.reqId.startsWith('theory-')).at(-1));
      assert(request);
      assert(JSON.parse(request.options.body).messages[0].content.includes('fitts'),'Detail questions include the current principle as context');
      await page.locator('#theoryChatInput').fill('Keep this follow-up draft.');
      await page.locator('#theoryChatInput').press('Enter');
      assert.equal(await page.locator('#theoryChatInput').inputValue(),'Keep this follow-up draft.','Busy submission does not lose the next draft');
      await page.evaluate(reqId => window.dispatchEvent(new MessageEvent('message',{ data:{ pluginMessage:{ type:'api-response',reqId,data:{ choices:[{ message:{ content:'Use larger targets for frequent actions and keep related controls close together.' } }] } } } })),request.reqId);
      await screenshot('theory-chat-en');
      await page.evaluate(() => closeTheoryChat());
      assert(await page.locator('#theoryDetailView').isVisible(),'Back returns to the principle that started the conversation');
      for (const [width,height,lang,theme] of [[360,520,'zh','light'],[340,440,'en','dark']]) {
        await page.setViewportSize({ width,height });
        await page.evaluate(({lang,theme}) => { setCompactMode(true); changeLanguage(lang); changeTheme(theme); openTheoryDetail('gestalt'); },{lang,theme});
        await screenshot('theory-detail-' + lang + '-' + width);
        const action = await page.locator('#theoryDetailSend').boundingBox();
        assert(action.x + action.width <= width && action.y + action.height <= height,'Compact send button stays visible');
        assert.equal(action.width,28);
        const side = await page.locator('.sidebar').boundingBox();
        await page.locator('.theory-article-scroll').evaluate(element => { element.scrollTop = element.scrollHeight; });
        assert.deepEqual(await page.locator('.sidebar').boundingBox(),side,'Reading scroll does not move navigation');
      }
      assert.deepEqual(errors, [],platform + ': runtime errors');
      await page.close();
      console.log(platform + ': English UI, 18 theory details, data preservation, language round trips, IME, keyboard, contextual questions and compact layouts passed.');
    }
  } finally { await browser.close(); }
  console.log('Review screenshots: ' + output);
})().catch(error => { console.error(error); process.exitCode = 1; });
