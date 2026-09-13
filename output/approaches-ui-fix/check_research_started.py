import asyncio
from playwright.async_api import async_playwright,expect
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch()
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  await page.goto('http://localhost:3000/experimental/chat?matter=MAT-20260909-d89ad8')
  await page.wait_for_timeout(2000)
  history=page.locator('details').filter(has=page.locator(':scope > summary',has_text='History'))
  await history.locator(':scope > summary').click()
  await page.get_by_role('button',name='Start intake for this matter.',exact=False).first.click()
  reply=page.get_by_text('Research is queued or running with its saved source choices.',exact=False).last
  await expect(reply).to_be_visible(timeout=60000)
  await page.screenshot(path='output/approaches-ui-fix/research-started.png')
  print('Live saved research confirmation and progress card visible.')
  await browser.close()
asyncio.run(main())
