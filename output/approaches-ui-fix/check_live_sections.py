import asyncio
from pathlib import Path
from playwright.async_api import async_playwright,expect
OUT=Path(__file__).parent
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  await page.goto('http://localhost:3000/experimental/chat?matter=MAT-20260909-d89ad8')
  history=page.locator('details').filter(has=page.locator(':scope > summary',has_text='History'))
  await history.locator('summary').click()
  await expect(history.get_by_role('button')).to_have_count(1)
  await history.get_by_role('button').click()
  answer=page.locator('article').filter(has_text='Mosaic must confirm its authority in each state.').last
  await expect(answer).to_be_visible(timeout=30000)
  for label in ['Bank-held funds structure','Working view','Next step']:
   heading=answer.get_by_text(label,exact=True)
   await expect(heading).to_have_count(1)
   assert await heading.evaluate('(el)=>el.closest("li")===null'),label
  await answer.get_by_text('Bank-held funds structure',exact=True).evaluate('(el)=>el.scrollIntoView({block:"start",behavior:"instant"})')
  await page.screenshot(path=str(OUT/'fixed-live-sections.png'))
  print('Saved Harbor response: section labels are outside bullet lists.')
  await browser.close()
asyncio.run(main())
