import assert from 'node:assert/strict';
import { markdownDisclosures } from '../lib/markdownDisclosures.ts';

const previous = '<details>\n<summary>Earlier view &amp; sources</summary>\n\nOriginal **qualified** advice.\n\n</details>';
const sections = markdownDisclosures(`Current answer.\n\n${previous}\n\nNext action.`);
assert.equal(sections.length, 3);
assert.equal(sections[1].summary, 'Earlier view & sources');
assert.equal(sections[1].text.trim(), 'Original **qualified** advice.');
assert.equal(sections[2].text.trim(), 'Next action.');
for (const text of [`\`\`\`md\n${previous}\n\`\`\``, `    <details>\n    <summary>Code</summary>\n    </details>`, '<details>\n<summary>Unclosed</summary>\nOriginal prose.']) {
  assert.deepEqual(markdownDisclosures(text), [{ text }]);
}
const nested = markdownDisclosures(`<details>\n<summary>History</summary>\n${previous}\n</details>`);
assert.equal(nested.length, 1);
assert.equal(markdownDisclosures(nested[0].text)[0].summary, 'Earlier view & sources');
const unsafeLabel = markdownDisclosures('<details>\n<summary><img onerror=alert(1)></summary>\nRead only.\n</details>');
assert.equal(unsafeLabel[0].summary, '<img onerror=alert(1)>', 'Summary stays React text, never HTML');
assert.equal(markdownDisclosures('<details onclick="alert(1)">\n<summary>Unsupported HTML</summary>\n</details>')[0].summary, undefined);
console.log('Markdown history, prose preservation and HTML isolation passed.');
