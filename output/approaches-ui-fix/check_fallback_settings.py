import asyncio
from playwright.async_api import async_playwright, expect
async def main():
 async with async_playwright() as p:
  browser = await p.chromium.launch()
  page = await browser.new_page(viewport={'width':1050,'height':1006})
  await page.goto('http://localhost:3000/settings')
  await page.get_by_role('button', name='Research', exact=True).click()
  await expect(page.get_by_text('Use model-only fallback', exact=True)).to_have_count(0)
  await expect(page.get_by_text('Research runs in the background.', exact=False)).to_be_visible()
  if not await page.get_by_text('Collection model provider', exact=True).is_visible():
   await page.get_by_text('Advanced / Technical details', exact=True).click()
  await expect(page.get_by_text('Collection model provider', exact=True)).to_be_visible()
  await page.screenshot(path='output/approaches-ui-fix/fallback-settings.png')
  await browser.close()
asyncio.run(main())
