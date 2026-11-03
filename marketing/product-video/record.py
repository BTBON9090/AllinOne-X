from playwright.sync_api import sync_playwright
import pathlib, shutil
out=pathlib.Path('marketing/product-video/rec')
if out.exists(): shutil.rmtree(out)
out.mkdir(parents=True)
with sync_playwright() as p:
    b=p.chromium.launch(headless=True, args=['--force-prefers-reduced-motion'])
    ctx=b.new_context(viewport={'width':1080,'height':1920}, record_video_dir=str(out), record_video_size={'width':1080,'height':1920}, device_scale_factor=1)
    page=ctx.new_page()
    page.goto(pathlib.Path('marketing/product-video/index.html').resolve().as_uri())
    page.wait_for_timeout(49000)
    page.close(); ctx.close(); b.close()
print('recorded', list(out.glob('*')))
