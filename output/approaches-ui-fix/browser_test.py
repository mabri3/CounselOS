import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright,expect
OUT=Path(__file__).parent
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  vault=Path((OUT/'vault-path.txt').read_text())
  facts=vault/'03_Matters/beacon-instant-onboarding/facts.md'
  before=facts.read_bytes()
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto('http://localhost:3137/experimental/chat?matter=MAT-DEMO-BEACON')
  approaches=page.locator('details').filter(has=page.locator(':scope > summary',has_text='Approaches'))
  await page.get_by_text('Approaches',exact=True).click()
  await expect(approaches.get_by_role('checkbox')).to_have_count(1)
  await expect(approaches.get_by_role('button',name='Compare these approaches')).to_be_disabled()
  await page.get_by_text('Approaches',exact=True).click()
  await page.get_by_role('textbox',name='Message Themis',exact=True).fill('Explore bank custody.')
  await page.get_by_role('button',name='Send',exact=True).click()
  await expect(page.get_by_text('The bank design remains conditional',exact=False)).to_be_visible(timeout=90000)
  await page.get_by_text('Approaches',exact=True).click()
  await expect(approaches.get_by_role('checkbox')).to_have_count(2)
  await page.get_by_text('Approaches',exact=True).click()
  await page.locator('summary').filter(has_text='Files').click()
  await page.get_by_role('button',name='facts',exact=True).click()
  await page.get_by_text('Approaches',exact=True).click()
  await expect(approaches.get_by_text('Bank agreement is pending.',exact=True)).not_to_be_visible()
  compare=approaches.get_by_role('button',name='Compare these approaches')
  await approaches.get_by_role('checkbox').nth(0).check()
  await expect(compare).to_be_disabled()
  await approaches.get_by_role('checkbox').nth(1).check()
  await expect(compare).to_be_enabled()
  box=await compare.bounding_box(); assert box and box['y']+box['height']<1006,box
  panel=await approaches.bounding_box(); assert panel['height']<400,panel
  await page.screenshot(path=str(OUT/'overview.png'))
  message=page.get_by_role('textbox',name='Message Themis',exact=True)
  await message.fill('Keep this unsent draft.')
  submitted=[]
  page.on('request',lambda r: submitted.append(r.post_data_json) if r.method=='POST' and r.url.endswith('/chat-runs') else None)
  await compare.click()
  await expect(page.get_by_text('The bank design remains conditional',exact=False)).to_have_count(2,timeout=90000)
  await expect(message).to_have_value('Keep this unsent draft.')
  await expect(page.get_by_role('table')).to_be_visible()
  table=page.get_by_role('table')
  widths=await table.locator('th').evaluate_all('(cells)=>cells.map(c=>c.getBoundingClientRect().width)')
  assert min(widths)>=128,widths
  await table.evaluate('(el)=>el.scrollIntoView({block:"start",behavior:"instant"})')
  first_box=await table.bounding_box()
  await page.wait_for_timeout(300)
  second_box=await table.bounding_box()
  assert abs(first_box['width']-second_box['width'])<1,(first_box,second_box)
  await page.screenshot(path=str(OUT/'answer-render.png'))
  scroll=page.get_by_role('region',name='Scrollable table')
  await scroll.focus()
  await page.keyboard.press('End')
  await scroll.evaluate('(el)=>{el.scrollLeft=el.scrollWidth-el.clientWidth}')
  assert await scroll.evaluate('(el)=>el.scrollLeft')>0
  await page.screenshot(path=str(OUT/'answer-render-bank.png'))
  assert len(submitted)==1,submitted
  request=submitted[0]
  assert len(request['comparison_path_ids'])==2,request
  assert 'SCN-' not in request['message'],request
  assert 'Bank design' in request['message'],request
  await page.get_by_text('Approaches',exact=True).click()
  await approaches.get_by_role('button',name='Details for Bank design').click()
  await expect(approaches.get_by_text('Bank agreement is pending.',exact=True)).to_be_visible()
  promotion=approaches.get_by_role('button',name='Make this our current approach')
  bounds=await promotion.bounding_box()
  assert bounds and bounds['y']+bounds['height']<800,bounds
  await page.screenshot(path=str(OUT/'direction-action.png'))
  await approaches.get_by_role('button',name='Discuss this approach',exact=True).click()
  await expect(page.get_by_role('status')).to_contain_text('Working path selected')
  async def conflict_once(route):
   await route.fulfill(json={'data':{'state':'conflict'}})
  await page.route('**/workspace/paths/actions',conflict_once,times=1)
  await approaches.get_by_role('button',name='Make this our current approach').click()
  await expect(page.get_by_role('status')).to_contain_text('Review the updated details')
  await expect(approaches.get_by_role('heading',name='Bank design',exact=True)).to_be_visible()
  await approaches.get_by_role('button',name='Make this our current approach').click()
  await expect(approaches.get_by_role('checkbox').first).to_have_accessible_name('Bank design Current approach')
  await page.reload()
  await page.get_by_text('Approaches',exact=True).click()
  await expect(approaches.get_by_role('checkbox').first).to_have_accessible_name('Bank design Current approach')
  await approaches.get_by_role('button',name='Details for Current approach').click()
  await approaches.get_by_role('button',name='Make this our current approach').click()
  await expect(approaches.get_by_role('checkbox').first).to_have_accessible_name('Current approach Current approach')
  await approaches.get_by_role('button',name='Details for Bank design').click()
  await approaches.get_by_text('More options',exact=True).click()
  await approaches.get_by_role('button',name='View saved working note').click()
  await expect(approaches.get_by_role('region',name='Saved working note')).to_contain_text('Read the bank agreement.')
  await approaches.get_by_role('button',name='Archive this alternative').click()
  await expect(approaches.get_by_role('checkbox')).to_have_count(1)
  await expect(approaches.get_by_role('button',name='Compare these approaches')).to_be_disabled()
  assert facts.read_bytes()==before, "Hypothetical actions changed actual facts"
  assert not errors,errors
  (OUT/'browser-result.json').write_text(json.dumps({'result':'passed','viewport':[1050,1006],'panel':panel,'compare_button':box,'page_errors':errors},indent=2))
  await browser.close()
asyncio.run(main())
