import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright,expect
ROOT=Path(__file__).resolve().parent
async def main():
 d=json.loads((ROOT/'story-D-results.json').read_text());mid=d['matter_id']
 async with async_playwright() as p:
  browser=await p.chromium.launch();page=await browser.new_page(viewport={'width':1440,'height':1050});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://localhost:3136/experimental/chat?matter='+mid)
  panel=page.locator('details[aria-label="Problem breakdown"]');await expect(panel).to_contain_text('Saved analysis',timeout=60000)
  composer=page.get_by_role('textbox',name='Message Themis');await composer.fill('Keep this lifecycle draft.');await panel.locator('summary').first.click()
  async with page.expect_popup() as popup:
   await panel.get_by_role('button',name='Open saved answer',exact=True).click()
  source=await popup.value;await source.wait_for_load_state();await expect(source.locator('body')).to_contain_text('A useful conditional answer.',timeout=60000)
  await expect(composer).to_have_value('Keep this lifecycle draft.');await source.screenshot(path=str(ROOT/'story-D-saved-answer.png'),full_page=True);await source.close();await expect(composer).to_have_value('Keep this lifecycle draft.')
  await page.reload();await expect(composer).to_have_value('Keep this lifecycle draft.');await expect(panel).to_contain_text('Saved analysis')
  await panel.locator('summary').first.click();await panel.get_by_role('button',name='Open earlier breakdown',exact=True).click();await expect(panel).to_contain_text('Earlier analysis');await page.screenshot(path=str(ROOT/'story-D-reopen.png'),full_page=True)
  response=await page.request.get('http://localhost:8136/api/matters/'+mid+'/workspace');assert (await response.json())['problem_analysis']['reference']==d['current']
  smoke=[]
  for path in ['/matters','/decisions','/automations','/settings','/matters/'+mid]:
   await page.goto('http://localhost:3136'+path);await page.wait_for_timeout(800);await expect(page.locator('body')).not_to_contain_text('Application error:');smoke.append(path)
  fresh=await browser.new_context(viewport={'width':1440,'height':1050});page=await fresh.new_page();await page.goto('http://localhost:3136/matters/'+mid)
  panel=page.locator('details[aria-label="Problem breakdown"]');await panel.locator('summary').first.click();await expect(panel).to_contain_text('Saved analysis');await page.screenshot(path=str(ROOT/'story-D-normal.png'),full_page=True)
  await page.set_viewport_size({'width':390,'height':844});await page.screenshot(path=str(ROOT/'story-D-normal-390.png'),full_page=True)
  (ROOT/'browser-followthrough-results.json').write_text(json.dumps({'D_current':d['current'],'source_open_return_draft_preserved':True,'reopen_after_rebuild':True,'route_smoke':smoke,'page_errors':errors,'limits':'Route smoke is not the full fifteen-step matter-review acceptance walk.'},indent=2))
  await browser.close()
asyncio.run(main())
