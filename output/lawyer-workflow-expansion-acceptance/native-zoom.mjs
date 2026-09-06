import { chromium } from "/Users/bharris/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
const dir = new URL("./",import.meta.url), extension = new URL("zoom-extension/",dir).pathname;
const label=process.argv[2] || "native-zoom-first";
if(!/^[a-z0-9-]+$/.test(label)) throw Error("Invalid label");
const context=await chromium.launchPersistentContext("",{channel:"chromium",headless:true,viewport:{width:1440,height:1024},reducedMotion:"reduce",args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]});
try {
 const worker=context.serviceWorkers()[0] || await context.waitForEvent("serviceworker",{timeout:15000});
 const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(String(e)));
 await page.goto("http://localhost:3117/matters/MAT-20260905-0a2378",{waitUntil:"domcontentloaded"});
 await page.locator(".composer textarea").waitFor({timeout:60000});
 let refreshUsed=false;
 try { await page.waitForFunction(()=>document.querySelector('section[aria-label="Matter orientation"] h2')?.textContent?.includes("Assess the US pilot"),{},{timeout:20000}); } catch { const refresh=page.locator('section[aria-label="Matter orientation"] button').filter({hasText:"Refresh matter"}).first(); await refresh.click(); refreshUsed=true; await page.waitForFunction(()=>document.querySelector('section[aria-label="Matter orientation"] h2')?.textContent?.includes("Assess the US pilot"),{},{timeout:60000}); }
 const before=await page.evaluate(()=>({innerWidth,devicePixelRatio,scrollWidth:document.documentElement.scrollWidth}));
 const zoom=await worker.evaluate(async()=>{const tab=(await chrome.tabs.query({url:"http://localhost:3117/*"}))[0];if(!tab?.id)throw Error("Test tab missing");await chrome.tabs.setZoom(tab.id,2);return {id:tab.id,factor:await chrome.tabs.getZoom(tab.id)};});
 await page.waitForTimeout(2000);
 const after=await page.evaluate(()=>({innerWidth,devicePixelRatio,scrollWidth:document.documentElement.scrollWidth,reducedMotion:matchMedia("(prefers-reduced-motion: reduce)").matches}));
 const keyboard=[];
 await page.keyboard.press("Control+Home");
 for(let index=0;index<80;index++){await page.keyboard.press("Tab");const focus=await page.evaluate(()=>{const e=document.activeElement,r=e?.getBoundingClientRect(),s=e?getComputedStyle(e):null;return {tag:e?.tagName,text:e?.textContent?.trim(),outline:s?.outlineWidth,rect:r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom}:null};});keyboard.push(focus);if(focus.text==="Files & context"){await page.keyboard.press("Enter");await page.getByRole("dialog").waitFor({state:"visible",timeout:15000});await page.keyboard.press("Escape");const returned=await page.evaluate(()=>document.activeElement?.textContent?.trim());keyboard.push({drawerOpened:true,focusReturned:returned});break;}}
 await page.keyboard.press("Control+Home");
 // Keep a viewport capture: full-page captures at native zoom can crop Chromium's scaled surface.
 await page.screenshot({path:new URL(`${label}-viewport.png`,dir).pathname,fullPage:false});
 const cdp=await context.newCDPSession(page);
 const capture=await cdp.send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
 await fs.writeFile(new URL(`${label}-native-surface.png`,dir),Buffer.from(capture.data,"base64"));
 await page.screenshot({path:new URL(`${label}.png`,dir).pathname,fullPage:true});
 await fs.writeFile(new URL(`${label}.json`,dir),JSON.stringify({before,zoom,after,errors,refreshUsed,keyboard,text:await page.locator("body").innerText()},null,2));
 console.log(JSON.stringify({before,zoom,after,errors,refreshUsed,keyboard}));
 await worker.evaluate(async id=>chrome.tabs.setZoom(id,1),zoom.id);
} finally {await context.close();}
