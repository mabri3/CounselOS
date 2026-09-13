import asyncio
from playwright.async_api import async_playwright,expect

async def main():
 expect.set_options(timeout=60000)
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  url='http://localhost:3000/experimental/chat?matter=MAT-20260909-d89ad8'
  await page.goto(url)
  await expect(page.get_by_role('textbox',name='Message Themis')).to_be_enabled()
  panel=page.locator('details').filter(has=page.locator(':scope > summary',has_text='Approaches'))
  await panel.locator(':scope > summary').click()
  await panel.get_by_role('button',name='Details for Original plan',exact=True).click()
  await panel.get_by_role('button',name='Rename approach',exact=True).click()
  await panel.get_by_label('Approach name',exact=True).fill('Mosaic-operated migration')
  async with page.expect_response(lambda r:'/paths/actions' in r.url and r.request.method=='POST') as result:
   await panel.get_by_role('button',name='Save name',exact=True).click()
  assert (await result.value).status==200
  await expect(panel.get_by_role('heading',name='Mosaic-operated migration',exact=True)).to_be_visible()
  await page.reload()
  await expect(page.get_by_role('textbox',name='Message Themis')).to_be_enabled()
  await panel.locator(':scope > summary').click()
  await expect(panel.get_by_role('button',name='Details for Mosaic-operated migration',exact=True)).to_be_visible()
  bank=panel.locator('label').filter(has_text='Bank-held funds structure')
  await expect(bank).to_contain_text('Current approach')
  original=panel.locator('label').filter(has_text='Mosaic-operated migration')
  await expect(original).to_contain_text('Alternative')
  await page.screenshot(path='output/approaches-ui-fix/approach-names.png')
  print('Live rename saved and survived reload. Bank remains current; original remains an alternative.')
  await browser.close()

asyncio.run(main())
