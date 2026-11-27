const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');

async function checkContacts(browser, platform) {
  const page = await browser.newPage({ viewport:{ width:440, height:600 } });
  try {
    await page.context().setOffline(true);
    await page.addInitScript(() => { window.parent.postMessage = () => {}; });
    await page.goto(pathToFileURL(path.resolve(__dirname, '..', platform, 'ui.html')).href);
    await page.waitForFunction(() => window.PluginWorkspace);
    await page.locator('.sidebar-footer button').click();
    const settings = page.locator('#settingsPanel');
    const site = settings.locator('a[href="https://www.btbon.cn/appbox"]');
    const open = settings.locator('#aboutWechatOpen');
    const dialog = page.locator('dialog#aboutWechatDialog');

    for (const [lang, qrLabel] of [['zh', '微信二维码'], ['en', 'WeChat QR code']]) {
      if (lang === 'en') await page.setViewportSize({ width:340, height:440 });
      await page.evaluate(value => changeLanguage(value), lang);
      assert(await settings.isVisible(), platform + ': settings must be open');
      assert.equal(await site.count(), 1, platform + ': author website URL');
      assert(await site.isVisible());
      assert.doesNotMatch(await settings.textContent(), /QQ\s*(群|group)|376556413/i);
      assert(await dialog.isHidden());

      await open.click();
      await dialog.waitFor({ state:'visible' });
      assert(await dialog.evaluate(el => el.open && el.matches(':modal')), platform + ': QR is a native modal');
      const contactText = await page.locator('#settingsPanel, #aboutWechatDialog').allInnerTexts();
      assert(contactText.some(text => text.includes(qrLabel)), platform + ': ' + qrLabel);
      const image = dialog.locator('img#aboutWechatImage');
      assert.match(await image.getAttribute('src'), /^data:image\//i);
      assert(await image.isVisible());
      await image.evaluate(async img => {
        await img.decode();
        if (!img.naturalWidth || !img.naturalHeight) throw new Error('Empty embedded QR image');
      });
      const rect = await image.boundingBox();
      const { width, height } = page.viewportSize();
      const modalRect = await dialog.boundingBox();
      assert(modalRect && Math.abs(modalRect.x + modalRect.width / 2 - width / 2) <= 1 &&
        Math.abs(modalRect.y + modalRect.height / 2 - height / 2) <= 1,
      platform + ': the dialog is centered in the plugin viewport');
      assert(rect && rect.width > 0 && rect.height > 0 && rect.x >= 0 && rect.y >= 0 &&
        rect.x + rect.width <= width + 1 && rect.y + rect.height <= height + 1,
      platform + ': the complete QR fits in the plugin viewport');

      await page.keyboard.press('Escape');
      await dialog.waitFor({ state:'hidden' });
      assert(await open.evaluate(el => document.activeElement === el), platform + ': Escape restores focus to the trigger');
      await open.press('Enter');
      await dialog.locator('#aboutWechatClose').click();
      await dialog.waitFor({ state:'hidden' });
      assert(await open.evaluate(el => document.activeElement === el), platform + ': close button restores focus');
    }
    console.log(platform + ': author link and offline WeChat QR passed in Chinese and English.');
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({
    headless:true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {})
  });
  try {
    for (const platform of ['figma', 'mastergo']) await checkContacts(browser, platform);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
