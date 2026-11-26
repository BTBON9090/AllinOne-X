const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const vm = require('node:vm');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = path.resolve(__dirname,'..');
const output = process.env.UI_REVIEW_DIR || fs.mkdtempSync(path.join(require('node:os').tmpdir(),'allinone-window-'));
fs.mkdirSync(output,{ recursive:true });
const logoFile = path.join(root, 'mastergo', 'assets', 'all-in-one-logo.png');
const originalLogo = 'data:image/png;base64,' + fs.readFileSync(logoFile).toString('base64');
const hostSource = fs.readFileSync(path.join(root,'shared/window-host.js'),'utf8');
const createWindowController = vm.runInNewContext(hostSource + '\ncreatePluginWindowController');

async function checkBrandImage(locator) {
  assert(await locator.isVisible(), 'Brand artwork is visible');
  const result = await locator.evaluate(async (image, referenceSource) => {
    const reference = new Image();
    reference.src = referenceSource;
    await Promise.all([image.decode(), reference.decode()]);
    const canvas = document.createElement('canvas');
    canvas.width = reference.naturalWidth;
    canvas.height = reference.naturalHeight;
    const context = canvas.getContext('2d', {willReadFrequently:true});
    function rgba(source) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      return context.getImageData(0, 0, canvas.width, canvas.height).data;
    }
    const source = rgba(reference), displayed = rgba(image);
    const box = image.getBoundingClientRect();
    const style = getComputedStyle(image);
    return {
      samePixels:source.every((value, i) => value === displayed[i]),
      cornerAlpha:displayed[3], square:box.width === box.height && box.width > 0,
      background:style.backgroundColor, filter:style.filter, transform:style.transform, clipPath:style.clipPath,
      padded:['paddingTop','paddingRight','paddingBottom','paddingLeft'].some(key => parseFloat(style[key]) !== 0)
    };
  }, originalLogo);
  assert(result.samePixels, 'Displayed RGBA pixels match the original logo, including white tiles and transparent corners');
  assert.equal(result.cornerAlpha, 0);
  assert(result.square && !result.padded, 'Logo keeps its square proportions without inset padding');
  assert.equal(result.filter, 'none');
  assert.equal(result.transform, 'none', 'Original artwork stays upright');
  assert.equal(result.clipPath, 'none');
  assert.equal(result.background, 'rgba(0, 0, 0, 0)', 'No extra background behind the logo');
}

(async () => {
  const browser = await chromium.launch({ headless:true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
  try {
    for (const platform of ['figma','mastergo']) {
      const page = await browser.newPage({ viewport:{ width:440,height:600 } });
      const errors = [];
      page.on('pageerror',e => errors.push(e.message));
      await page.route('https://**/*',route => route.abort());
      await page.addInitScript(() => { window.__sent = []; parent.postMessage = message => { if (message.pluginMessage) window.__sent.push(message.pluginMessage); }; });
      await page.goto(pathToFileURL(path.join(root,platform,'ui.html')).href);
      await page.waitForFunction(() => window.PluginWindow && window.PluginBookmarks && window.PluginWorkspace);
      const emit = msg => page.evaluate(msg => window.dispatchEvent(new MessageEvent('message',{ data:{ pluginMessage:msg } })),msg);
      await page.evaluate(() => changeTheme('light'));
      const brand = page.locator('.sidebar button.workbench-brand');
      const mark = brand.locator('img.workbench-mark');
      const menu = page.locator('.workbench-menu');
      assert(await menu.isHidden(), 'The full-width sidebar needs no directory launcher');
      await checkBrandImage(mark);
      assert.equal(await brand.innerText(), 'AllinOne');
      assert.equal(await page.locator('#collapseWindow, .workbench-location > span').count(), 0);
      const markSource = await mark.getAttribute('src');
      assert.match(markSource, /^data:image\/png;base64,/, 'Logo is available offline');
      const colors = await page.evaluate(() => {
        const color = selector => getComputedStyle(document.querySelector(selector)).backgroundColor;
        const swatch = document.createElement('span');
        swatch.style.color = 'var(--primary)';
        document.body.append(swatch);
        const primary = getComputedStyle(swatch).color;
        swatch.remove();
        return {sidebar:color('.sidebar'), main:color('.main-content'), primary};
      });
      assert.deepEqual(colors, {sidebar:'rgb(243, 239, 250)', main:'rgb(255, 255, 255)', primary:'rgb(96, 16, 203)'});
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => changeTheme(theme), theme);
        const ratios = await page.evaluate(() => {
          const resolve = expr => {
            const probe = document.createElement('span');
            probe.style.color = expr;
            document.body.append(probe);
            const rgb = getComputedStyle(probe).color.match(/\d+/g).map(Number);
            probe.remove();
            return rgb;
          };
          const lum = ([r, g, b]) => [r, g, b].map(v => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          }).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
          const ratio = (fg, bg) => {
            const [a, b] = [lum(resolve(fg)), lum(resolve(bg))].sort((x, y) => y - x);
            return (a + 0.05) / (b + 0.05);
          };
          return {
            secondaryOnSurface: ratio('var(--text-secondary)', 'var(--bg-surface)'),
            tertiaryOnRail: ratio('var(--text-tertiary)', 'var(--bg-rail)'),
            tertiaryOnSurface: ratio('var(--text-tertiary)', 'var(--bg-surface)'),
            tertiaryOnWell: ratio('var(--text-tertiary)', 'var(--bg-well)'),
            primaryOnHover: ratio('var(--primary)', 'var(--bg-hover)'),
            primaryOnLight: ratio('var(--primary)', 'var(--primary-light)'),
            onPrimary: ratio('var(--on-primary)', 'var(--primary)'),
            actionText: ratio('var(--action-text)', 'var(--action-fill)')
          };
        });
        for (const [pair, value] of Object.entries(ratios)) {
          assert(value >= 4.5, `${platform}/${theme} contrast ${pair} (${value.toFixed(2)}:1) must meet WCAG AA >= 4.5:1`);
        }
        // Verify actual hovered control computed colors on #sfAffixApply and .ppt-action-btn
        await page.evaluate(() => PluginWorkspace.navigate('smartFill'));
        await page.locator('#sfAffixApply').hover();
        const affixHover = await page.locator('#sfAffixApply').evaluate(el => {
          const s = getComputedStyle(el);
          const parse = v => v.match(/\d+/g).map(Number);
          const lum = ([r, g, b]) => [r, g, b].map(v => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
          const [a, b] = [lum(parse(s.color)), lum(parse(s.backgroundColor) || [96, 16, 203])].sort((x, y) => y - x);
          return (a + 0.05) / (b + 0.05);
        });
        assert(affixHover >= 4.5, `${platform}/${theme} #sfAffixApply:hover contrast (${affixHover.toFixed(2)}:1) must be >= 4.5:1`);
        await page.evaluate(() => PluginWorkspace.navigate('ppt'));
        await page.locator('#pptActionBtn').hover();
        const pptHover = await page.locator('#pptActionBtn').evaluate(el => {
          const s = getComputedStyle(el);
          const parse = v => v.match(/\d+/g).map(Number);
          const lum = ([r, g, b]) => [r, g, b].map(v => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
          const [a, b] = [lum(parse(s.color)), lum(parse(s.backgroundColor))].sort((x, y) => y - x);
          return (a + 0.05) / (b + 0.05);
        });
        assert(pptHover >= 4.5, `${platform}/${theme} #pptActionBtn:hover contrast (${pptHover.toFixed(2)}:1) must be >= 4.5:1`);
        await page.evaluate(() => PluginWorkspace.navigate('simple'));
      }
      await page.evaluate(() => changeTheme('light'));
      assert.equal(await page.locator('.nav-group').count(),3);
      assert.equal(await page.locator('.nav-item').count(),16);
      assert(await page.locator('.nav-item').last().evaluate(el => {
        const box = el.getBoundingClientRect(), rail = el.closest('.nav-scroll').getBoundingClientRect();
        return box.bottom <= rail.bottom;
      }),'All 16 Chinese tools fit at the regular window size');
      await page.screenshot({ path:path.join(output,`${platform}-groups.png`),animations:'disabled' });
      await page.setViewportSize({width:440,height:380});
      assert(await page.locator('.nav-scroll').evaluate(el => {
        el.scrollTop = el.scrollHeight;
        const reachedBottom = el.scrollTop > 0 && Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 1;
        el.scrollTop = 0;
        return reachedBottom && getComputedStyle(el).scrollbarWidth === 'none';
      }), 'Short windows keep all tools reachable without showing a scrollbar');
      await page.setViewportSize({width:440,height:600});
      await page.evaluate(() => PluginWorkspace.navigate('jumpback'));
      const spots = ['a','b','c'].map((id,index) => ({ id,name:`位置 ${index+1} <svg onload=alert(1)>`,pageName:'中文 页面 ⚡',zoom:index + 0.5,centerX:42 }));
      await emit({ type:'jb-render-spots',data:spots });
      assert.equal(await page.locator('.spot-item').count(),3);
      assert.equal(await page.locator('.spot-page-title svg').count(),0,'Document names are literal text, never markup or icons');
      assert(await page.locator('.spot-item').evaluateAll(items => items.every(item => {
        const style = getComputedStyle(item), box = item.getBoundingClientRect();
        const edges = ['Top','Right','Bottom','Left'].map(side =>
          style['border' + side + 'Color'] === 'rgba(0, 0, 0, 0)' ? 0 : parseFloat(style['border' + side + 'Width']));
        return style.flexDirection === 'row' && box.height <= 70 && edges.every(width => width === edges[0] && width <= 1);
      })), 'Bookmark rows keep compact whole-card targets and at most a light, even outline');
      assert.equal(await page.locator('.spot-name-input').first().inputValue(),spots[0].name);
      const handle = page.locator('.spot-item[data-spot-id="a"] .bookmark-handle');
      const from = await handle.boundingBox(), to = await page.locator('.spot-item[data-spot-id="c"]').boundingBox();
      await page.mouse.move(from.x+11,from.y+14); await page.mouse.down();
      await page.mouse.move(to.x+11,to.y+to.height-2,{ steps:8 }); await page.mouse.up();
      let message = await page.evaluate(() => __sent.filter(m => m.type === 'jb-reorder').at(-1));
      assert.deepEqual(message.ids,['b','c','a']);
      await emit({ type:'jb-render-spots',data:message.ids.map(id=>spots.find(s=>s.id===id)),requestId:message.requestId });
      await page.locator('.spot-item[data-spot-id="a"] .bookmark-handle').press('Home');
      message = await page.evaluate(() => __sent.filter(m => m.type === 'jb-reorder').at(-1));
      assert.deepEqual(message.ids,['a','b','c']);
      await emit({ type:'jb-render-spots',data:spots,requestId:message.requestId,error:true });
      assert.match(await page.locator('.bookmark-status').innerText(),/重试/);
      await page.locator('.spot-name-input').first().fill('尚未提交的中文草稿');
      await page.evaluate(() => changeLanguage('en'));
      assert.equal(await page.locator('.spot-name-input').first().inputValue(),'尚未提交的中文草稿');
      assert.equal(await page.locator('.spot-page-title').first().innerText(),'中文 页面 ⚡');
      assert.equal(await page.locator('.nav-group-label').first().innerText(),'Productivity');
      assert.match(await page.locator('.bookmark-handle').first().getAttribute('aria-label'),/Sort/);
      // Cancel restores the original order and does not commit any mutation.
      const before = await page.evaluate(() => __sent.filter(m=>m.type==='jb-reorder').length);
      const start = await page.locator('.bookmark-handle').first().boundingBox();
      await page.mouse.move(start.x+11,start.y+14); await page.mouse.down();
      await page.mouse.move(start.x+11,start.y+95,{ steps:5 });
      await page.keyboard.press('Escape'); await page.mouse.up();
      assert.equal(await page.evaluate(() => __sent.filter(m=>m.type==='jb-reorder').length),before);
      assert.deepEqual(await page.locator('.spot-item').evaluateAll(items=>items.map(el=>el.dataset.spotId)),['a','b','c']);
      await emit({ type:'jb-render-spots',data:spots.map((spot,i) => ({ ...spot,name:['首页总览','组件细节','交付检查'][i],pageName:'产品设计 · 工作区' })),requestId:message.requestId,error:false });
      await page.evaluate(() => changeLanguage('zh'));
      await page.screenshot({ path:path.join(output,`${platform}-bookmarks.png`),animations:'disabled' });
      await page.evaluate(() => PluginWorkspace.navigate('text'));
      const input = page.locator('#textPanel input[type="text"]').first(); await input.fill('保留搜索草稿');
      await page.evaluate(() => { changeLanguage('en'); const nav = document.querySelector('.nav-scroll'); nav.scrollTop = 70; window.__navScroll = nav.scrollTop; });
      await emit({ type:'window-state',collapsed:false,canMove:true,edge:'right' });
      // Drive the shared host controller with the real message from each user
      // action. Its adapter resizes the browser viewport and replies to the UI.
      let nextSize, nextState, resizeFirst = true;
      const hostWindow = createWindowController({
        canMove:() => true, metrics:() => ({x:800,y:240,width:1600,height:1000,header:32}),
        move:() => {}, resize:(width,height) => { nextSize = {width,height}; },
        send:state => { nextState = state; }
      });
      async function sendAndApply(activate, expectedType) {
        const beforeCount = await page.evaluate(() => __sent.length);
        await activate();
        const requests = await page.evaluate(start => __sent.slice(start).filter(message =>
          message.type === 'window-collapse' || message.type === 'window-expand'), beforeCount);
        assert.deepEqual(requests.map(request => request.type), [expectedType], 'One window request per activation');
        nextSize = null; nextState = null;
        assert(hostWindow(requests[0]));
        assert.equal(nextState.collapsed, expectedType === 'window-collapse');
        // Viewport changes and window-state messages can reach the iframe in either order.
        if (resizeFirst) await page.setViewportSize(nextSize);
        await emit(nextState);
        if (!resizeFirst) await page.setViewportSize(nextSize);
        if (expectedType === 'window-expand') resizeFirst = !resizeFirst;
      }
      const bubbleButton = page.locator('#pluginBubble');
      const bubble = bubbleButton.locator('img.bubble-logo');
      async function checkCollapseRestore(activate, expectedFocus, inspectBubble = false) {
        const expandedSize = page.viewportSize();
        await sendAndApply(activate, 'window-collapse');
        assert.deepEqual(page.viewportSize(), {width:70,height:48});
        assert(await page.locator('.app-container').isHidden());
        assert(await bubbleButton.isVisible());
        assert.equal(await page.evaluate(() => document.activeElement.id), 'pluginBubble');
        if (inspectBubble) {
          await checkBrandImage(bubble);
          assert.equal(await bubble.getAttribute('src'), markSource, 'Expanded and collapsed windows share the same artwork');
          await page.waitForFunction(() => [document.documentElement, document.body, document.getElementById('pluginBubble')]
            .every(node => getComputedStyle(node).backgroundColor === 'rgba(0, 0, 0, 0)'), null, {timeout:2000});
          await page.screenshot({path:path.join(output, `${platform}-bubble.png`), animations:'disabled'});
          const beforeDrag = await page.evaluate(() => __sent.length);
          await page.mouse.move(35,24); await page.mouse.down(); await page.mouse.move(60,35,{steps:6}); await page.mouse.up();
          assert.equal(await page.evaluate(() => __sent.at(-1).type), 'window-drag-end');
          assert.equal(await page.evaluate(start => __sent.slice(start).some(m => m.type === 'window-expand'), beforeDrag), false,
            'Dragging the bubble does not expand it');
        }
        await sendAndApply(() => bubbleButton.click(), 'window-expand');
        assert.deepEqual(page.viewportSize(), expandedSize);
        await page.waitForFunction(el => document.activeElement === el, await expectedFocus.elementHandle(), {timeout:2000});
        assert(await page.locator('.app-container').isVisible());
        assert(await bubbleButton.isHidden());
      }
      const brandBox = await brand.boundingBox();
      const beforeDrag = await page.evaluate(() => __sent.length);
      await page.mouse.move(brandBox.x+20, brandBox.y+12);
      await page.mouse.down(); await page.mouse.move(brandBox.x+46, brandBox.y+18,{steps:6}); await page.mouse.up();
      const dragMessages = await page.evaluate(start => __sent.slice(start).map(message => message.type), beforeDrag);
      assert(dragMessages.includes('window-drag-start') && dragMessages.includes('window-drag-end'));
      assert(!dragMessages.includes('window-collapse'), 'Dragging the expanded brand does not count as a click');
      for (const [index, activate] of [
        () => mark.click(), () => brand.locator('strong').click(), () => brand.press('Enter'), () => brand.press('Space')
      ].entries()) {
        await checkCollapseRestore(activate, brand, index === 0);
        await page.waitForFunction(() => document.querySelector('.nav-scroll').scrollTop === window.__navScroll, null, {timeout:3000});
        assert.equal(await input.inputValue(), '保留搜索草稿');
        assert.equal(await page.locator('.nav-item.active').getAttribute('data-nav'), 'text');
      }
      await brand.press('ArrowLeft');
      assert.deepEqual(await page.evaluate(() => { const m = __sent.at(-1); return [m.type,m.dx,m.dy]; }),['window-nudge',-16,0]);
      await page.evaluate(() => { setCompactMode(true); changeLanguage('en'); changeTheme('dark'); });
      await page.setViewportSize({ width:360,height:520 });
      await checkBrandImage(mark);
      assert(await page.locator('.nav-item').last().evaluate(el => el.getBoundingClientRect().bottom <= el.closest('.nav-scroll').getBoundingClientRect().bottom),'All compact icons fit at 360 × 520');
      await page.screenshot({ path:path.join(output,`${platform}-groups-compact.png`),animations:'disabled' });
      assert(await brand.isVisible());
      const beforeDirectory = await page.evaluate(() => __sent.filter(m => m.type === 'window-collapse').length);
      await menu.click();
      assert.equal(await menu.getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'),'false');
      assert(await menu.evaluate(el => document.activeElement === el));
      assert.equal(await page.evaluate(() => __sent.filter(m => m.type === 'window-collapse').length), beforeDirectory);
      await page.setViewportSize({width:440,height:520});
      assert(await menu.isVisible(), 'Compact mode keeps an independent directory control at regular widths');
      await page.evaluate(() => setCompactMode(false));
      await page.setViewportSize({width:399,height:520});
      assert(await menu.isVisible(), 'The narrow directory is available at the breakpoint in regular mode');
      await page.setViewportSize({width:400,height:520});
      assert(await menu.isHidden());
      assert.equal(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight || document.documentElement.scrollWidth > innerWidth),false);
      for (const [compact,width] of [[false,210],[true,170]]) {
        await page.evaluate(compact => { setCompactMode(compact); PluginWorkspace.navigate('simple'); },compact);
        await page.setViewportSize({ width:compact ? 360 : 440,height:520 });
        const corner = await page.locator('#resizeHandle').boundingBox();
        await page.mouse.move(corner.x+8,corner.y+8); await page.mouse.down();
        await page.mouse.move(0,0,{ steps:6 }); await page.mouse.up();
        const resize = await page.evaluate(() => __sent.filter(m => m.type === 'resize-drag').at(-1));
        assert.deepEqual([resize.width,resize.height],[width,400],'Corner drag uses the halved width floor and keeps the height floor');
        await page.setViewportSize({ width,height:520 });
        assert(await menu.isVisible());
        const headerBrand = page.locator('button.workbench-brand-header');
        await checkBrandImage(headerBrand.locator('img.workbench-mark'));
        await checkCollapseRestore(() => headerBrand.click(), headerBrand);
        assert.equal(await page.locator('.tool-home-commands').first().evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length),1);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
        await page.screenshot({ path:path.join(output,`${platform}-narrow-${width}.png`),animations:'disabled' });
        await page.evaluate(() => PluginWorkspace.navigate('size'));
        assert(await page.locator('.main-content').evaluate(el => el.scrollWidth > el.clientWidth),'Complex controls remain available in a local horizontal scroll region');
        await page.locator('.main-content').evaluate(el => { el.scrollLeft = el.scrollWidth; });
        assert(await page.locator('.main-content').evaluate(el => el.scrollLeft > 0));
        assert.equal(await page.locator('#resizeHandle').isVisible(),true);
        await page.locator('.workbench-menu').click();
        assert.equal(await page.locator('.nav-item').first().isVisible(), true);
        await page.locator('.nav-item[data-nav="simple"]').press('Enter');
        assert.equal(await page.locator('.workbench-menu').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
      }
      assert.deepEqual(errors,[]);
      await page.close();
      console.log(`${platform}: grouped navigation, safe names, pointer/keyboard sorting, cancel/error recovery, bubble dragging, state preservation, English and compact dark layout passed.`);
    }
  } finally { await browser.close(); }
  console.log(`Screenshots: ${output}`);
})().catch(error => { console.error(error); process.exitCode = 1; });
