import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright,expect
ROOT=Path(__file__).resolve().parent
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch();page=await browser.new_page(viewport={'width':1440,'height':1050})
  async def state():return await (await page.request.get('http://localhost:8136/fixture-stories')).json()
  start=await state();ids=start['stories'];results=[]
  async def send(story,prompt,expectation):
   if ('matter='+ids[story]) not in page.url:await page.goto('http://localhost:3136/experimental/chat?matter='+ids[story])
   await expect(page.locator('details[aria-label="Problem breakdown"]')).to_be_visible(timeout=60000)
   await page.wait_for_timeout(800)
   box=page.get_by_role('textbox',name='Message Themis');await box.fill(prompt)
   await expect(box).to_have_value(prompt)
   await page.screenshot(path=str(ROOT/'story-send-debug.png'))
   await page.get_by_role('button',name='Send',exact=False).last.click()
   await expect(page.locator('article').last).to_contain_text(expectation,timeout=60000)
   await expect(page.get_by_role('button',name='Send',exact=False).last).to_be_disabled(timeout=10000)
   return await state()
  a=await send('A','Can we use customer chats to improve our support product? We want a pilot next month.','Separate internal evaluation')
  assert a['states']['A']['state']=='saved',a['states']['A']
  prior=a['states']['A']['reference']
  a=await send('A','The vendor retains the chats and uses them to train its general model. Our earlier description of internal-only use was wrong.','Withdraw internal-only reliance')
  current=a['states']['A']['reference'];assert current!=prior
  assert a['states']['A']['analysis']['prior_reference']==prior
  before_facts=a['records']['A']['facts']
  assert any(f.get('supersedes') for f in before_facts)
  scenario=await send('A','What if we used synthetic chats instead?','Hypothetical only')
  assert scenario['states']['A']['reference']==current and scenario['records']['A']['facts']==before_facts
  assert scenario['decisions']==start['decisions']
  await page.reload();panel=page.locator('details[aria-label="Problem breakdown"]');await expect(panel).to_contain_text('Saved analysis');await panel.locator('summary').first.click()
  await expect(panel).to_contain_text('Withdraw internal-only reliance');await panel.get_by_role('button',name='Open earlier breakdown',exact=True).click();await expect(panel).to_contain_text('Earlier analysis');await expect(panel).to_contain_text('Separate internal evaluation')
  await page.screenshot(path=str(ROOT/'story-A-history.png'),full_page=True)
  results.append({'story':'A','current':current,'prior':prior,'fact_count':len(before_facts),'scenario_unchanged':True,'pass':True})
  b=await send('B','Assess the fictional amendment: Alder approval before identifiable-chat vendor training, effective September 15, for our October 1 pilot. Synthetic data is excepted. Revisit the earlier decision without changing it.','Revisit the earlier decision')
  assert b['states']['B']['state']=='saved',b['states']['B']
  first_b=b['states']['B']['reference']
  b=await send('B','The Birch employee-notice rule has no connection to our Alder activities. The Alder training ban is only proposed and has no final effective date.','No material change')
  assert b['states']['B']['analysis']['prior_reference']==first_b
  assert b['decisions']==start['decisions']
  assert len(b['records']['B']['issues'])==len(start['records']['B']['issues'])
  panel=page.locator('details[aria-label="Problem breakdown"]');await panel.locator('summary').first.click();await page.screenshot(path=str(ROOT/'story-B-no-change.png'),full_page=True)
  results.append({'story':'B','current':b['states']['B']['reference'],'prior':first_b,'decision_unchanged':True,'pass':True})
  c=await send('C','Assess instant earnings access: a $100 advance, $105 payroll recovery, and personal liability if recovery fails. Each component is assumed permitted, but the combined license scope and recovery responsibility are unresolved.','combined launch conditional')
  assert c['states']['C']['state']=='saved',c['states']['C']
  panel=page.locator('details[aria-label="Problem breakdown"]');await panel.locator('summary').first.click();await expect(panel).to_contain_text('business label does not determine');await page.screenshot(path=str(ROOT/'story-C-combined.png'),full_page=True)
  results.append({'story':'C','current':c['states']['C']['reference'],'pass':True})
  (ROOT/'browser-stories-results.json').write_text(json.dumps({'fixture':str(ROOT/'stories-fixture.json'),'provider':'Scripted StoryProvider; not judgment evidence','results':results},indent=2))
  await browser.close()
asyncio.run(main())
