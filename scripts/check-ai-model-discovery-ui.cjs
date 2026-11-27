const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

async function check(browser, platform) {
  const page = await browser.newPage({viewport:{width:440,height:600}});
  await page.context().setOffline(true);
  await page.addInitScript(() => { window.parent.postMessage = () => {}; });
  try {
    const html = path.resolve(process.env.PLUGIN_TEST_ROOT || path.resolve(__dirname,'..'),platform,'ui.html');
    await page.goto(pathToFileURL(html).href);
    await page.waitForFunction(() => window.AiModelDiscovery);
    await page.locator('.sidebar-footer button').click();
    await page.evaluate(() => {
      window.__modelRequests = [];
      const send = postMsg;
      postMsg = (type, data = {}) => {
        if (['do-fetch','cancel-fetch','save-ai-config'].includes(type)) {
          __modelRequests.push({type,...data}); return;
        }
        send(type,data);
      };
    });
    const button = page.locator('#settingsModelDiscover'), results = page.locator('#settingsModelResults');
    const status = page.locator('#settingsModelDiscoveryStatus'), provider = page.locator('#settingsAiProvider');
    const base = page.locator('#settingsAiBaseUrl'), model = page.locator('#settingsAiModelName'), key = page.locator('#settingsAiKey');
    const requests = () => page.evaluate(() => __modelRequests.filter(m => m.type === 'do-fetch'));
    const last = async () => (await requests()).at(-1);
    const respond = (reqId, data, error) => page.evaluate(({reqId,data,error}) =>
      dispatchEvent(new MessageEvent('message',{data:{pluginMessage:{type:'api-response',reqId,data,...error}}})),
    {reqId,data,error});
    const values = () => results.locator('option').evaluateAll(options => options.slice(1).map(o => o.value));

    await provider.selectOption('glm');
    await button.click();
    assert.match(await status.innerText(),/内置通道.*glm-4.7-flash/);
    assert.equal((await requests()).length,0);
    await provider.selectOption('openai');
    await key.fill('fixture-key');
    await base.fill('https://example.test/relay/v1/chat/completions');
    const before = await model.inputValue();
    await button.click();
    let msg = await last();
    assert.equal(msg.url,'https://example.test/relay/v1/models');
    assert.equal(msg.options.method,'GET'); assert.equal(msg.options.body,undefined);
    assert.equal(msg.options.redirect,'error');
    assert.deepEqual(msg.options.headers,{Authorization:'Bearer fixture-key'});
    await respond(msg.reqId,{data:[{id:'release/A-001'},{id:'Vision.v2'},{id:'release/A-001'}]});
    assert.deepEqual(await values(),['release/A-001','Vision.v2']);
    assert.equal(await model.inputValue(),before);
    await results.selectOption('release/A-001');
    assert.equal(await model.inputValue(),'release/A-001');
    assert.equal(await page.evaluate(() => __modelRequests.some(m => m.type === 'save-ai-config')),false);
    await page.evaluate(() => changeLanguage('en'));
    assert.match(await status.innerText(),/provider lists 2 models/);
    assert(!(await status.innerText()).includes('fixture-key'));

    await provider.selectOption('anthropic');
    await base.fill('https://example.test/claude/v1/messages');
    await button.click(); msg = await last();
    assert.match(msg.url,/\/claude\/v1\/models\?limit=1000$/);
    assert.deepEqual(msg.options.headers,{'x-api-key':'fixture-key','anthropic-version':'2023-06-01'});
    await respond(msg.reqId,{data:[{id:'claude-A'}],has_more:true,last_id:'a/b'});
    await page.waitForFunction(() => __modelRequests.at(-1).url?.includes('after_id='));
    msg = await last(); assert.equal(new URL(msg.url).searchParams.get('after_id'),'a/b');
    await respond(msg.reqId,{data:[{id:'claude-B'}],has_more:false});
    assert.deepEqual(await values(),['claude-A','claude-B']);

    await provider.selectOption('gemini');
    await button.click(); msg = await last();
    assert.equal(new URL(msg.url).pathname,'/v1beta/models');
    assert.deepEqual(msg.options.headers,{'x-goog-api-key':'fixture-key'});
    await respond(msg.reqId,{models:[{name:'models/Model-002'}],nextPageToken:'opaque/2'});
    await page.waitForFunction(() => __modelRequests.at(-1).url?.includes('pageToken='));
    await respond((await last()).reqId,{models:[{name:'models/Model-003'}]});
    await results.selectOption('Model-002'); assert.equal(await model.inputValue(),'Model-002');

    await provider.selectOption('aliyun');
    await base.fill('https://workspace.cn-beijing.maas.aliyuncs.com/compatible-mode/v1');
    await button.click(); msg = await last();
    assert.equal(new URL(msg.url).pathname,'/api/v1/models');
    await respond(msg.reqId,{output:{page_no:1,page_size:100,total:1,models:[{model:'qwen-exact',name:'Descriptive name'}]}});
    assert.deepEqual(await values(),['qwen-exact']);

    await provider.selectOption('deepseek');
    await button.click(); msg = await last();
    await base.fill('https://changed.test/v1');
    assert.equal(await page.evaluate(() => __modelRequests.at(-1).type),'cancel-fetch');
    await respond(msg.reqId,{data:[{id:'stale'}]});
    assert(await results.isHidden());
    await button.click(); msg = await last();
    await respond(msg.reqId,null,{status:403,error:'Permission denied; fixture-key'});
    assert.match(await status.innerText(),/permission/);
    assert(!(await status.innerText()).includes('fixture-key'));
    await button.click(); await respond((await last()).reqId,{data:[]});
    assert.match(await status.innerText(),/empty list/);
    await button.click(); await respond((await last()).reqId,{data:null});
    assert.match(await status.innerText(),/compatible model list/);
    const count = (await requests()).length;
    await base.fill('http://example.test'); await button.click();
    assert.equal((await requests()).length,count); assert.match(await status.innerText(),/HTTPS/);
    console.log(platform + ': draft model listings, native pagination, exact IDs, cancellation, errors and both languages passed.');
  } finally { await page.close(); }
}

(async () => {
  const browser = await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH} : {})});
  try { for (const platform of ['figma','mastergo']) await check(browser,platform); }
  finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
