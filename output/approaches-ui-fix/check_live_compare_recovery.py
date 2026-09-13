import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright,expect
OUT=Path(__file__).parent
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  page.on('pageerror',lambda e: print('PAGE ERROR',e,flush=True))
  page.on('request',lambda r: print('POST',r.url,flush=True) if r.method=='POST' else None)
  await page.goto('http://localhost:3000/experimental/chat?matter=MAT-20260909-d89ad8')
  history=page.locator('details').filter(has=page.locator(':scope > summary',has_text='History'))
  await history.locator('summary').click()
  await history.get_by_role('button').click()
  await expect(page.get_by_role('textbox',name='Message Themis')).to_be_enabled()
  await page.get_by_label('Choose chat model').click()
  await page.get_by_label('Chat provider',exact=True).select_option('codex')
  await page.get_by_label('Chat model',exact=True).select_option('gpt-5.6-sol')
  await page.get_by_label('Chat effort',exact=True).select_option('medium')
  await page.get_by_role('button',name='Done',exact=True).click()
  panel=page.locator('details').filter(has=page.locator(':scope > summary',has_text='Approaches'))
  await panel.locator('summary').click()
  await expect(panel.get_by_role('checkbox')).to_have_count(2)
  for box in await panel.get_by_role('checkbox').all(): await box.check()
  await expect(panel.get_by_role('button',name='Compare these approaches')).to_be_enabled()
  async with page.expect_response(lambda r:'/chat-runs' in r.url and r.request.method=='POST',timeout=90000) as submitted:
   await panel.get_by_role('button',name='Compare these approaches').click()
  response=await submitted.value
  data=await response.json()
  (OUT/'live-compare-recovery-submission.json').write_text(json.dumps(data,indent=2))
  print('Submitted',response.status,data.get('run_id'),flush=True)
  await expect(page.get_by_role('button',name='Stop work',exact=True)).to_be_visible(timeout=20000)
  await expect(page.get_by_role('button',name='Stop work',exact=True)).not_to_be_visible(timeout=300000)
  text=await page.locator('article').last.inner_text()
  (OUT/'live-compare-recovery-answer.md').write_text(text)
  await page.locator('article').last.evaluate('(el)=>el.scrollIntoView({block:"start",behavior:"instant"})')
  await page.screenshot(path=str(OUT/'live-compare-recovery.png'))
  print('Answer:',text,flush=True)
  assert 'The request stopped before completion' not in text
  assert 'Bank' in text or 'bank' in text

  await browser.close()
asyncio.run(main())
