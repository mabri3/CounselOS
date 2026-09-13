import asyncio
from playwright.async_api import async_playwright,expect
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch()
  page=await browser.new_page(viewport={'width':1050,'height':1006})
  api=await p.request.new_context(base_url='http://127.0.0.1:8000/api')
  before=(await (await api.get('/api/settings?include_model_catalog=false')).json())['values']
  keys={'research.collection_enabled':False,'research.collection_reasoning_effort':'default','research.model_fallback_provider':'openai_compatible','research.model_fallback_model':'kimi-k3-fast'}
  restore={key:before.get(key,default) for key,default in keys.items()}
  try:
   await page.goto('http://localhost:3000/settings')
   await page.get_by_role('button',name='Research',exact=True).click()
   await page.get_by_role('checkbox',name='Use collection agent',exact=True).check()
   await page.get_by_role('combobox',name='Collection model provider',exact=True).select_option('opencode_go')
   await page.get_by_role('combobox',name='Collection model',exact=True).select_option('deepseek-v4.1-flash')
   await page.get_by_role('combobox',name='Collection reasoning effort',exact=True).select_option('max')
   async with page.expect_response(lambda r:r.url.endswith('/settings') and r.request.method=='PUT') as pending:
    await page.get_by_role('button',name='Save changes',exact=True).click()
   response=await pending.value
   assert response.ok,await response.text()
   await page.reload()
   await page.get_by_role('button',name='Research',exact=True).click()
   await expect(page.get_by_role('checkbox',name='Use collection agent',exact=True)).to_be_checked()
   await expect(page.get_by_role('combobox',name='Collection model',exact=True)).to_have_value('deepseek-v4.1-flash')
   await expect(page.get_by_role('combobox',name='Collection reasoning effort',exact=True)).to_have_value('max')
   await page.screenshot(path='output/approaches-ui-fix/collection-picker.png')
   await page.get_by_role('checkbox',name='Use collection agent',exact=True).uncheck()
   await expect(page.get_by_role('combobox',name='Collection model',exact=True)).to_have_count(0)
   print('Collection toggle, provider/model/effort, save and reload passed.')
  finally:
   response=await api.put('/api/settings',data={'values':restore})
   assert response.ok,await response.text()
   await browser.close()
asyncio.run(main())
