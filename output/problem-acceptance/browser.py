import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright,expect
ROOT=Path(__file__).resolve().parent;E=json.loads((ROOT/'environment.json').read_text());URL='http://localhost:3136/matters/'+E['matter_id']
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch();page=await browser.new_page(viewport={'width':1141,'height':1006});await page.goto(URL);await page.wait_for_timeout(2500);await page.get_by_role('button',name='1 Audience age',exact=False).click();print((await page.locator('body').inner_text())[:18000]);await page.screenshot(path=str(ROOT/'initial.png'),full_page=True);await browser.close()
asyncio.run(main())
