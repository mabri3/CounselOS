import asyncio
from pathlib import Path
from playwright.async_api import async_playwright,expect
async def main():
 expect.set_options(timeout=60000)
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  await page.goto('http://localhost:3000/experimental/chat?matter=MAT-20260909-d89ad8')
  history=page.locator('details').filter(has=page.locator(':scope > summary',has_text='History'))
  await expect(history.get_by_role('button',include_hidden=True)).to_have_count(2)
  await history.locator(':scope > summary').click()
  await history.get_by_role('button').first.click()
  fields=page.get_by_role('group',name='What sources should I use?').last
  await expect(fields).to_be_visible()
  await fields.get_by_role('checkbox',name='External sources',exact=True).check()
  await fields.get_by_role('checkbox',name='Other matters',exact=True).uncheck()
  page.on('request', lambda r: print('REQUEST',r.method,r.url,flush=True) if r.method=='POST' else None)
  page.on('console', lambda m: print('CONSOLE',m.text,flush=True) if m.type=='error' else None)
  async with page.expect_response(lambda r: '/chat-runs' in r.url and r.request.method == 'POST') as submitted:
   await fields.locator('..').get_by_role('button',name='Continue',exact=True).click()
  response=await submitted.value
  data=await response.json()
  import json
  print(json.dumps(data),flush=True)
  Path('output/approaches-ui-fix/live-source-confirmation.json').write_text(json.dumps(data,indent=2))
  await expect(page.get_by_text('Research is queued or running with its saved source choices.',exact=False)).to_be_visible()
  await page.screenshot(path='output/approaches-ui-fix/research-started.png')
  print('Live Continue accepted and research status shown.',flush=True)
  await browser.close()
asyncio.run(main())
