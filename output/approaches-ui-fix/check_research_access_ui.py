import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright,expect
async def main():
 expect.set_options(timeout=60000)
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  await page.goto('http://localhost:3000/experimental/chat?matter=MAT-20260909-d89ad8')
  history=page.locator('details').filter(has=page.locator(':scope > summary',has_text='History'))
  await history.locator(':scope > summary').click()
  await history.get_by_role('button').first.click()
  button=page.get_by_role('button',name='Start research',exact=True).last
  await expect(button).to_be_enabled()
  fields=page.get_by_role('group',name='Where should I look?').last
  await expect(fields.get_by_role('checkbox',name='External sources',exact=True)).to_be_checked()
  await expect(fields.get_by_role('checkbox',name='External sources',exact=True)).to_be_enabled()
  await expect(fields.get_by_role('checkbox',name='Search other active matters',exact=True)).not_to_be_checked()
  result=json.loads(Path('output/approaches-ui-fix/research-access-result.json').read_text())
  proposal=next(x['proposal'] for x in result['response']['operation_results'] if x['operation']=='run_research')
  assert await fields.locator('textarea').input_value()==proposal['public_query']
  details=fields.locator('details')
  assert await details.get_attribute('open') is None
  await button.scroll_into_view_if_needed()
  await page.screenshot(path='output/approaches-ui-fix/research-access-ui.png')
  print('Live source question visible; external sources checked and enabled; Start research enabled; technical options collapsed. No search submitted.')
  await browser.close()
asyncio.run(main())
