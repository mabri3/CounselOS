/** Browser acceptance against an explicitly isolated running fixture, never the user's vault.
 * WORKSPACE_DROP_URL=http://localhost:3107 WORKSPACE_DROP_MATTER=MAT-DEMO-RELAY
 * WORKSPACE_DROP_ISOLATED=1 PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs npm run check:workspace-file-drop
 * Uses actual DOM File/DataTransfer events and real upload routes. No chat/model calls.
 */
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const base = process.env.WORKSPACE_DROP_URL;
const matter = process.env.WORKSPACE_DROP_MATTER;
assert.ok(base && matter && process.env.WORKSPACE_DROP_ISOLATED === "1", "Set the isolated fixture URL, matter ID and WORKSPACE_DROP_ISOLATED=1 explicitly.");
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Use a local isolated test server.");
const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : "playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
const prefix = `dom-drop-${Date.now()}`;
const unsent = "Unsent message must survive every file batch and view change.";
// Chromium omits file bodies from DevTools postData. Observe the real FormData
// at fetch instead, retaining object identity and bytes without changing them.
await page.addInitScript(() => {
  const root = window as any;
  root.__fileDropUploads = [];
  const ids = new WeakMap<File, number>(); let nextId = 0;
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    if (init?.body instanceof FormData && /\/uploads(?:\?|$)/.test(String(input))) {
      const entries = [];
      for (const [field, value] of init.body.entries()) if (value instanceof File) {
        if (!ids.has(value)) ids.set(value, ++nextId);
        entries.push({ field, name: value.name, text: await value.text(), size: value.size, identity: ids.get(value) });
      }
      root.__fileDropUploads.push(entries);
    }
    return originalFetch.call(window, input, init);
  };
});
async function assertSameRetriedFile(marker: string) {
  const attempts = await page.evaluate((text: string) => (window as any).__fileDropUploads.flat().filter((item: any) => item.text === text), marker);
  assert.equal(attempts.length, 2, "The exact original bytes must be retried once.");
  assert.equal(attempts[0].identity, attempts[1].identity, "Retry must reuse the retained browser File object.");
  assert.equal(attempts[0].name, attempts[1].name);
}
page.on("request", (request: any) => {
  assert.ok(!/\/chat(?:-runs)?(?:\?|$)/.test(request.url()) || request.method() === "GET", "The file test must not submit a chat run.");
});
const uploadResponse = () => page.waitForResponse((response: any) => response.request().method() === "POST" && /\/uploads(?:\?|$)/.test(response.url()));
async function drop(selector: string, files: Array<{ name: string; text: string; type?: string }>) {
  const transfer = await page.evaluateHandle((items: Array<{ name: string; text: string; type?: string }>) => {
    const data = new DataTransfer();
    for (const item of items) data.items.add(new File([item.text], item.name, { type: item.type ?? "text/plain" }));
    return data;
  }, files);
  const response = uploadResponse();
  await page.locator(selector).dispatchEvent("dragover", { dataTransfer: transfer });
  await page.locator(selector).dispatchEvent("drop", { dataTransfer: transfer });
  await transfer.dispose();
  return response;
}
try {
  await page.goto(`${base}/matters/${encodeURIComponent(matter)}`);
  await page.locator(".composer textarea").waitFor();
  await page.locator(".composer textarea").fill(unsent);
  await page.locator(".composer").evaluate((node: HTMLElement) => { node.dataset.dropIdentity = "same-composer"; });
  let selectedCount = 0;
  for (const view of ["Understand", "Discuss", "Draft"]) {
    await page.locator(".draft-workspace__head label").filter({ hasText: new RegExp(`^${view}$`) }).click();
    assert.equal(await page.locator(".composer").getAttribute("data-drop-identity"), "same-composer");
    assert.equal(await page.locator(".composer textarea").inputValue(), unsent);
    const pickerName = `${prefix}-${view}-picker.txt`;
    const picked = uploadResponse();
    await page.locator(".composer input[type=file]").setInputFiles({ name: pickerName, mimeType: "text/plain", buffer: Buffer.from(`Picker bytes ${prefix} ${view}`) });
    assert.equal((await picked).status(), 201);
    await page.locator(".composer").getByText(pickerName, { exact: true }).first().waitFor();
    await page.locator(".composer .composer-plus:not([disabled])").waitFor();
    selectedCount++;
    const good = `${prefix}-${view}-drop.txt`, bad = `${prefix}-${view}-bad.exe`, marker = `EXACT-RETRY-BYTES-${view}`;
    const mixed = await drop(".composer", [{ name: good, text: `Drop bytes ${prefix} ${view}` }, { name: bad, text: marker, type: "application/octet-stream" }]);
    assert.equal(mixed.status(), 201);
    const mixedBody = await mixed.json();
    assert.deepEqual(mixedBody.results.map((item: any) => item.state), ["saved", "failed"]);
    await page.locator(".composer").getByRole("button", { name: `Retry ${bad}`, exact: true }).waitFor();
    selectedCount++;
    await page.locator(".composer .composer-plus:not([disabled])").waitFor();
    const retry = uploadResponse();
    await page.locator(".composer").getByRole("button", { name: `Retry ${bad}`, exact: true }).click();
    assert.equal((await (await retry).json()).results[0].state, "failed");
    await assertSameRetriedFile(marker);
    await page.locator(".composer .composer-plus:not([disabled])").waitFor();
    const intent = await page.locator(".upload-intent-card .chat-card-summary").innerText();
    assert.ok(intent.includes(String(selectedCount)), `Earlier composer batches must remain selected: ${intent}`);

    await page.getByRole("button", { name: "Files & context", exact: true }).click();
    await page.getByRole("tab", { name: "Inquiry context", exact: true }).click();
    for (const name of [pickerName, good]) {
      const choice = page.getByRole("region", { name: "Inquiry context", exact: true }).locator("label").filter({ hasText: name }).getByRole("checkbox");
      assert.equal(await choice.isChecked(), true, "Composer attachments must also be selected in the context drawer.");
    }
    await page.getByRole("tab", { name: "Matter files", exact: true }).click();
    const library = `${prefix}-${view}-library.txt`, libraryBad = `${prefix}-${view}-library.exe`;
    const libraryResult = await drop('[role="dialog"][aria-label="Files and context"]', [{ name: library, text: `Library bytes ${prefix} ${view}` }, { name: libraryBad, text: `LIBRARY-RETRY-${view}`, type: "application/octet-stream" }]);
    assert.equal(libraryResult.status(), 201);
    await page.getByRole("dialog", { name: "Files and context" }).getByRole("button", { name: `Retry ${libraryBad}`, exact: true }).waitFor();
    const retryLibrary = uploadResponse();
    await page.getByRole("dialog", { name: "Files and context" }).getByRole("button", { name: `Retry ${libraryBad}`, exact: true }).click();
    assert.equal((await (await retryLibrary).json()).results[0].state, "failed");
    await assertSameRetriedFile(`LIBRARY-RETRY-${view}`);
    await page.getByRole("tab", { name: "Inquiry context", exact: true }).click();
    assert.equal(await page.getByRole("region", { name: "Inquiry context", exact: true }).locator("label").filter({ hasText: library }).getByRole("checkbox").isChecked(), false, "Library upload must remain available, not auto-selected.");
    await page.getByRole("tab", { name: "Matter files", exact: true }).click();
    await page.getByRole("button", { name: "Close files and context panel", exact: true }).click();
    assert.equal(await page.locator(".composer textarea").inputValue(), unsent);
    assert.equal(await page.locator(".upload-intent-card .chat-card-summary").innerText(), intent, "Library drops must not change inquiry attachments.");
  }
  // A transport failure retains the same File for a later successful real upload.
  const transient = `${prefix}-transient.txt`;
  let failedOnce = false;
  await page.route("**/uploads", async (route: any) => {
    if (!failedOnce && route.request().method() === "POST") { failedOnce = true; await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ detail: "Temporary fixture upload outage." }) }); }
    else await route.continue();
  });
  assert.equal((await drop(".composer", [{ name: transient, text: "TRANSIENT-ORIGINAL-BYTES" }])).status(), 503);
  await page.locator(".composer").getByRole("button", { name: `Retry ${transient}`, exact: true }).waitFor();
  const recovered = uploadResponse();
  await page.locator(".composer").getByRole("button", { name: `Retry ${transient}`, exact: true }).click();
  assert.equal((await (await recovered).json()).results[0].state, "saved");
  await assertSameRetriedFile("TRANSIENT-ORIGINAL-BYTES");
  assert.equal(await page.locator(".composer textarea").inputValue(), unsent);
  console.log(`PASS: actual browser picker + File/DataTransfer drops in all three views; additive composer/library batches; byte-identical failed retries and successful recovery. Fixture prefix: ${prefix}`);
} finally { await browser.close(); }
