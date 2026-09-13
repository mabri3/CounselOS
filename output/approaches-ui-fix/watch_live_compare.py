import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright,expect
OUT=Path(__file__).parent
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  page.on('pageerror',lambda e:print('PAGE ERROR',e,flush=True))
  await page.goto('http://localhost:3000/experimental/chat?matter=MAT-20260909-d89ad8')
  history=page.locator('details').filter(has=page.locator(':scope > summary',has_text='History'))
  await history.locator('summary').click()
  await history.get_by_role('button').click()
  await expect(page.get_by_role('textbox',name='Message Themis')).to_be_enabled()
  print('Loaded conversation',flush=True)
  for i in range(50):
   status=await page.get_by_role('status').all_text_contents()
   print('Status',status,flush=True)
   if await page.get_by_role('button',name='Stop work',exact=True).count()==0: break
   await asyncio.sleep(5)
  text=await page.locator('article').last.inner_text()
  (OUT/'live-compare-recovery-answer.md').write_text(text)
  await page.locator('article').last.evaluate('(el)=>el.scrollIntoView({block:"start",behavior:"instant"})')
  await page.screenshot(path=str(OUT/'live-compare-recovery.png'))
  print('Answer',text,flush=True)
  await browser.close()
asyncio.run(main())
