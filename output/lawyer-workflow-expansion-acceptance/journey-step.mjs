import { chromium } from "/Users/bharris/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";

// Real browser actions on the copied-vault application. Each step retains local state.
const dir = new URL("./", import.meta.url);
const input = JSON.parse(await fs.readFile(process.argv[2], "utf8"));
if (!/^[a-z0-9-]+$/.test(input.label)) throw new Error("Invalid evidence label");
const statePath = new URL("journey-browser-state.json", dir).pathname;
let storageState;
try { storageState = JSON.parse(await fs.readFile(statePath, "utf8")); } catch {}
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState, viewport: { width: input.width || 1440, height: 1024 }, reducedMotion: "reduce", permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
const errors = [], responses = [], completed = [];
page.on("pageerror", e => errors.push(String(e)));
page.on("response", r => { if (r.url().includes(":8117/api/") && r.request().method() !== "GET") responses.push({url:r.url(), method:r.request().method(), status:r.status()}); });
function locate(a) { return a.selector ? page.locator(a.selector) : a.text ? page.getByText(a.text, { exact: a.exact ?? true }) : a.label ? page.getByLabel(a.label, { exact: a.exact ?? true }) : page.getByRole(a.role || "button", { name: a.name, exact: a.exact ?? true }); }
let failure = null;
try {
  await page.goto(`http://localhost:3117${input.route || "/matters/MAT-20260905-0a2378"}`, {waitUntil:"domcontentloaded"});
  await page.waitForTimeout(2500);
  for (const a of input.actions || []) {
    if (a.op === "wait") await page.waitForTimeout(a.ms || 1000);
    else if (a.op === "click") await locate(a).click({ timeout: 15000 });
    else if (a.op === "fill") await locate(a).fill(a.value);
    else if (a.op === "select") await locate(a).selectOption(a.value);
    else if (a.op === "press") { if (a.selector || a.label || a.name) await locate(a).press(a.key); else await page.keyboard.press(a.key); }
    else if (a.op === "upload") await locate(a).setInputFiles(a.paths);
    else if (a.op === "uploadViaButton") { const chooserPromise = page.waitForEvent("filechooser"); await locate(a).click(); const chooser = await chooserPromise; await chooser.setFiles(a.paths); }
    else if (a.op === "visible") await locate(a).first().waitFor({state:"visible",timeout:a.timeout || 60000});
    else if (a.op === "assertValue") { const actual = await locate(a).inputValue(); if(actual !== a.value) throw new Error(`Value mismatch: ${JSON.stringify(actual)}`); }
    else if (a.op === "assertClipboard") { const actual=await page.evaluate(()=>navigator.clipboard.readText()); if(actual!==a.value) throw new Error(`Clipboard mismatch: ${JSON.stringify(actual)}`); }
    else throw new Error(`Unknown action ${a.op}`);
    completed.push(a);
  }
} catch (e) { failure = String(e); }
await page.screenshot({path:new URL(`${input.label}.png`,dir).pathname,fullPage:true});
const result = {label:input.label,url:page.url(),completed,failure,errors,responses,text:await page.locator("body").innerText(),controls:await page.locator("input,textarea,select,button").evaluateAll(es=>es.map(e=>({tag:e.tagName,id:e.id,text:e.innerText,value:e.value,disabled:e.disabled,type:e.type}))),editors:await page.locator('[contenteditable="true"],.cm-editor').evaluateAll(es=>es.map(e=>({tag:e.tagName,classes:e.className,role:e.getAttribute("role"),label:e.getAttribute("aria-label"),text:e.innerText.slice(0,700)}))),dimensions:await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,reducedMotion:matchMedia("(prefers-reduced-motion: reduce)").matches}))};
await context.storageState({path:statePath});
await fs.writeFile(new URL(`${input.label}.json`,dir),JSON.stringify(result,null,2));
await browser.close();
console.log(JSON.stringify(result,null,2));
if(failure) process.exitCode=1;
