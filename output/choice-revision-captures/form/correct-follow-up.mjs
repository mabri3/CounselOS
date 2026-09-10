import { chromium } from '/Users/bharris/.npm/_npx/fd3bca3c548369c0/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1365, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000/matters/MAT-20260904-abf788', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /The \$3,000 cumulative payout threshold/ }).click();
  await page.getByRole('button', { name: 'Record disposition' }).first().click();
  const submit = page.getByRole('button', { name: 'Record decision and follow-up', exact: true });
  await submit.waitFor({ state: 'visible' });
  await submit.evaluate(el => el.scrollIntoView({ block: 'end', behavior: 'instant' }));
  await page.screenshot({ path: '/Users/bharris/Programs/counsel-os-mvp/output/choice-revision-captures/form/04-recommended-form-follow-up.png' });
  console.log('Submit bounds:', await submit.boundingBox());
} finally {
  await browser.close();
}
