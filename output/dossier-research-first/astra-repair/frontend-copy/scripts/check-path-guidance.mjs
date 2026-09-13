// Read-only live-page check. Prepares chat text but never submits it.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH, headless:true});
try {
  const page = await browser.newPage({viewport:{width:1156,height:1006}});
  page.setDefaultTimeout(30000);
  await page.goto(process.env.PATH_GUIDANCE_URL);
  const choices = page.getByRole('navigation',{name:'Issue choices',exact:true});
  await choices.getByRole('button',{name:/Collect CIP at onboarding/}).click();
  const outcome = page.getByRole('region',{name:'Outcome for this issue',exact:true});
  const questions = outcome.locator('details').filter({has:page.locator('summary').filter({hasText:'What we need to know'})}).first();
  await questions.locator('summary').first().click();
  await outcome.getByRole('button',{name:/Go to Question 1/}).click();
  assert.equal(await questions.getAttribute('open'), '');
  assert.equal(await page.evaluate(()=>document.activeElement?.id.startsWith('path-question-')), true);
  await outcome.screenshot({path:'../output/shared-questions/question-jump-revision.png'});
  await choices.getByRole('button',{name:/Limit pre-verification payouts/}).click();
  await outcome.getByText('No linked legal support for this choice',{exact:true}).waitFor();
  assert.equal(await outcome.getByText('Satisfied',{exact:true}).count(),0);
  await outcome.screenshot({path:'../output/shared-questions/legal-basis-revision.png'});
  await outcome.getByRole('button',{name:'Research legal basis in chat'}).click();
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('textarea')).some(e=>e.value.includes('Research the legal basis for this selected choice:')));
  const prompt = await page.locator('textarea').evaluateAll(items=>items.map(e=>e.value).find(value=>value.includes('Research the legal basis for this selected choice:')));
  assert.ok(prompt.includes('Limit pre-verification payouts'));
  assert.ok(prompt.includes('supporting and contrary authority'));
  console.log('PASS: jump opens and focuses question; absent support stays neutral; research prepares the selected path in chat. No request submitted.');
} finally {await browser.close();}
