import asyncio
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
  suggestions=page.locator('details').filter(has=page.locator(':scope > summary',has_text='Suggested Next Steps'))
  await expect(suggestions).to_have_count(1)
  assert await suggestions.get_attribute('open') is None
  await expect(suggestions.get_by_role('button').first).not_to_be_visible()
  await suggestions.locator(':scope > summary').click()
  await expect(suggestions.get_by_role('button').first).to_be_visible()
  await suggestions.locator(':scope > summary').click()
  await expect(suggestions.get_by_role('button').first).not_to_be_visible()
  fields=page.get_by_role('group',name='Where should I look?').last
  await expect(fields.locator('textarea')).not_to_be_visible()
  await expect(fields).to_contain_text('turn your question into focused searches')
  await fields.locator('summary',has_text='Research options').click()
  await expect(fields.locator('textarea')).to_be_visible()
  await fields.locator('summary',has_text='Research options').click()
  await suggestions.locator(':scope > summary').scroll_into_view_if_needed()
  await page.screenshot(path='output/approaches-ui-fix/topic-suggestions-ui.png')
  print('Suggestions collapsed initially, expand and collapse correctly. Research topic and multiple-search explanation visible.')
  await browser.close()
asyncio.run(main())
