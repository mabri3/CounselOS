import asyncio,json,re
from pathlib import Path
from playwright.async_api import async_playwright, expect
ROOT=Path(__file__).resolve().parent
async def main():
 data=json.loads((ROOT/'browser-fixture.json').read_text())
 async with async_playwright() as p:
  browser=await p.chromium.launch()
  page=await browser.new_page(viewport={'width':1440,'height':1050})
  errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
  results=[]
  for state,mid in data['cases'].items():
   await page.goto('http://localhost:3136/matters/'+mid)
   panel=page.locator('details[aria-label="Problem breakdown"]')
   await panel.wait_for(timeout=60000)
   await panel.locator('summary').first.focus();await page.keyboard.press('Enter')
   await page.wait_for_timeout(300)
   text=await panel.inner_text()
   assert {'saved':'Saved analysis','partial':'Partial analysis','stale':'Needs review','no-map':'Not yet analyzed'}[state] in text,text
   if state!='no-map':assert 'New issue to assess' in text and 'Business objective' in text
   assert '"schema_version"' not in text
   await page.screenshot(path=str(ROOT/f'browser-normal-{state}.png'),full_page=True)
   if state=='saved':
    await panel.get_by_role('button',name='Open earlier breakdown',exact=True).click()
    await page.get_by_text('Earlier analysis',exact=False).first.wait_for()
    await page.screenshot(path=str(ROOT/'browser-history.png'),full_page=True)
    await panel.get_by_role('button',name='Return to current breakdown').click()
    await panel.get_by_role('button',name='Discuss this question').first.click()
    await page.wait_for_timeout(500)
    assert 'Discuss this question:' in await page.locator('body').inner_text() or 'Discuss this question:' in '\n'.join(await page.locator('textarea').evaluate_all('(nodes)=>nodes.map(n=>n.value)'))
   results.append({'surface':'normal','state':state,'pass':True})
  for state,mid in data['cases'].items():
   await page.goto('http://localhost:3136/experimental/chat?matter='+mid)
   panel=page.locator('details[aria-label="Problem breakdown"]')
   await panel.wait_for(timeout=60000)
   await expect(panel).to_contain_text({'saved':'Saved analysis','partial':'Partial analysis','stale':'Needs review','no-map':'Not yet analyzed'}[state])
   composer=page.get_by_role('textbox',name='Message Themis')
   await composer.fill('Keep this unsent draft.')
   await panel.locator('summary').first.focus();await page.keyboard.press('Enter')
   assert {'saved':'Saved analysis','partial':'Partial analysis','stale':'Needs review','no-map':'Not yet analyzed'}[state] in await panel.inner_text()
   if state!='no-map':
    await panel.get_by_role('button',name='Discuss this question').first.click()
    assert (await composer.input_value()).startswith('Keep this unsent draft.')
    assert 'Discuss this question:' in await composer.input_value()
    assert await page.locator('article').count()==0
   await page.screenshot(path=str(ROOT/f'browser-experimental-{state}.png'),full_page=True)
   await page.get_by_role('button',name='Refresh matter',exact=True).click()
   assert (await composer.input_value()).startswith('Keep this unsent draft.')
   await page.reload()
   await expect(composer).to_have_value(re.compile(r'^Keep this unsent draft\.'))
   results.append({'surface':'experimental','state':state,'draft_preserved':True,'pass':True})
  await page.set_viewport_size({'width':390,'height':844})
  await page.goto('http://localhost:3136/experimental/chat?matter='+data['cases']['saved'])
  panel=page.locator('details[aria-label="Problem breakdown"]');await panel.wait_for()
  await panel.locator('summary').first.click()
  await page.screenshot(path=str(ROOT/'browser-experimental-390.png'),full_page=True)
  assert await page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'Horizontal page overflow'
  (ROOT/'browser-results.json').write_text(json.dumps({'results':results,'page_errors':errors},indent=2))
  await browser.close()
asyncio.run(main())
