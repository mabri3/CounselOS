import fs from 'node:fs';
import {chromium} from '/Users/bharris/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const dir=new URL('.',import.meta.url).pathname;
const env=JSON.parse(fs.readFileSync(dir+'environment.json','utf8'));
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const results=[];
try {
 for(const path of ['/','/workspace','/matters','/decisions','/agents','/skills','/automations','/settings',`/matters/${env.matter_id}`]){
  const response=await page.goto(`http://localhost:${env.frontend_port}${path}`,{waitUntil:'networkidle'});
  await page.waitForTimeout(500);
  results.push({path,status:response?.status(),title:await page.title(),body:(await page.locator('main').innerText().catch(()=>page.locator('body').innerText())).slice(0,1800),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
 }
} finally {
 fs.writeFileSync(dir+'route-smoke.json',JSON.stringify({results,errors},null,2));
 await browser.close();
}
console.log(JSON.stringify({routes:results.map(r=>({path:r.path,status:r.status,overflow:r.overflow})),errors}));
