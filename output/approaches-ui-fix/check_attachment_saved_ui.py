import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright,expect
out=Path('output/approaches-ui-fix')
async def main():
 before=json.loads((out/'attachment-before.json').read_text())
 after=json.loads((out/'attachment-after.json').read_text())
 new=[p for p in after['paths'] if p['scenario_id'] not in {x['scenario_id'] for x in before['paths']}]
 assert len(new)==1, new
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  expect.set_options(timeout=60000)
  await page.goto('http://localhost:3000/experimental/chat?matter=MAT-20260909-d89ad8')
  await expect(page.get_by_role('textbox',name='Message Themis')).to_be_enabled()
  panel=page.locator('details').filter(has=page.locator(':scope > summary',has_text='Approaches'))
  await panel.locator(':scope > summary').click()
  await panel.get_by_role('button',name='Details for '+new[0]['title'],exact=True).click()
  await panel.get_by_text('More options',exact=True).click()
  await panel.get_by_role('button',name='View saved working note',exact=True).click()
  note=panel.get_by_role('region',name='Saved working note')
  await expect(note).to_contain_text('December')
  await page.screenshot(path=str(out/'attachment-note-ui.png'))
  await panel.get_by_text('Read saved evidence',exact=True).click()
  select=panel.get_by_label('Saved source',exact=True)
  await page.wait_for_timeout(2000)
  print(await panel.inner_text(),flush=True)
  await page.screenshot(path=str(out/'attachment-evidence-ui.png'))
  await expect(select.locator('option').filter(has_text='harbor-bank-option-test')).to_have_count(1)
  option=select.locator('option').filter(has_text='harbor-bank-option-test')
  await select.select_option(await option.get_attribute('value'))
  await panel.get_by_role('button',name='Read passage',exact=True).click()
  await expect(panel.locator('pre')).to_contain_text('FICTIONAL TEST DOCUMENT')
  print('New approach, saved note, and attachment passage are visible in the live UI.')
  await browser.close()
asyncio.run(main())
