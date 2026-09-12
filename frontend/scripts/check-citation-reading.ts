import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
function load(path: string | URL): any {
  const exports = {};
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022}}).outputText;
  runInNewContext(compiled, {exports, URL, require: (name: string) => {
    if (name.endsWith('.css')) return {default: {}};
    if (name.startsWith('@/')) return load('../' + name.slice(2) + '.ts');
    if (name.startsWith('.')) return load(new URL(name.endsWith('.ts') ? name : name + '.ts', new URL(path, import.meta.url)));
    return require(name);
  }});
  return exports;
}
const { default: ClaimMarkdown, visibleClaimProse } = load('../components/workspace/ClaimMarkdown.tsx');
const Drawer = load('../components/workspace/EvidenceDrawer.tsx').default;
const source = {source_id: 'SRC-1', claim_id: 'source:SRC-1', source_label: 'FinCEN — Reporting requirements', url: 'https://www.fincen.gov/rule', path: '03_Matters/example/research/source.md', available_excerpt: '[Skip to main content](https://www.fincen.gov/#main)', support_state: 'retrieved'};
const render = (evidence: any) => renderToStaticMarkup(createElement(ClaimMarkdown, {text: '[source:SRC-1]', sources: [evidence], documents: [{document_id: 'DOC-1', path: source.path, revision: '1'}], onOpenDocument: () => {}}));
const markup = render(source);
assert.ok(markup.includes('href="https://www.fincen.gov/rule"'), 'citation opens the original without a drawer callback');
assert.ok(markup.includes('FinCEN — Reporting requirements'));
assert.ok(markup.includes('Saved copy'));
assert.ok(!markup.includes('SRC-1'), 'internal IDs are not visible citation labels');
assert.ok(!render({...source, url: 'javascript:alert(1)', path: '../secret'}).includes('href='));
const drawer = renderToStaticMarkup(createElement(Drawer, {evidence: source, open: true, onClose: () => {}, onOpenArtifact: () => {}}));
assert.ok(drawer.indexOf('Open original source') < drawer.indexOf('Technical details'));
assert.ok(!drawer.includes('Skip to main content'), 'unlocated page prefix is not presented as a claim passage');
assert.ok(drawer.includes('<details') && !drawer.includes('<details open'), 'technical details are collapsed');
console.log('Citation reading: original link, readable title, saved copy, safe URLs, and collapsed technical details passed.');

const legacy = renderToStaticMarkup(createElement(ClaimMarkdown, {
  text: '[source:SRC-1]', documents: [{document_id: 'SRC-1', kind: 'source', title: source.source_label, path: source.path, source_url: source.url, revision: '1'}], onOpenDocument: () => {},
}));
assert.ok(legacy.includes('href="https://www.fincen.gov/rule"') && legacy.includes('Saved copy'), 'legacy source ID resolves to its saved page and original URL');

const renderProse = (text: string, separateParagraphLines = false) => renderToStaticMarkup(createElement(ClaimMarkdown, { text, separateParagraphLines }));
const dossier = '# Dossier\n\n<!-- issue:ISS-20260911-a1b2c3 -->\n### Privacy\n\nKeep the **qualified** answer.\n\n<!-- issue:ISS-CONTRACTS-2 -->\n### Contracts\n\nKeep this answer.';
for (const chat of [false, true]) {
  const rendered = renderProse(dossier, chat);
  assert.doesNotMatch(rendered, /issue:ISS-/, 'dossier issue metadata is hidden in document and chat rendering');
  assert.ok(rendered.includes('<h3>Privacy</h3>') && rendered.includes('<strong>qualified</strong>') && rendered.includes('<h3>Contracts</h3>'), 'issue headings and qualified analysis remain visible');
}
assert.equal(visibleClaimProse(dossier), dossier, 'dossier markers remain in the source prose');
assert.doesNotMatch(renderProse('<!-- issue:ISS-ONLY -->'), /issue:ISS-/, 'a marker-only reply does not restore hidden metadata');
assert.equal(renderProse('Before <!-- issue:ISS-INLINE --> after.'), renderProse('Before  after.'));
assert.doesNotMatch(renderProse('<details>\n<summary>Earlier view</summary>\n\n<!-- issue:ISS-EARLIER -->\nSaved analysis.\n</details>'), /issue:ISS-/, 'disclosed dossier sections also hide their markers');
for (const literal of [
  '<!-- Source note: retain this qualification. -->',
  '<!-- issue:OTHER-1 -->',
  '<!-- issue:ISS-A extra source text -->',
  '<span title="Source wording">Original HTML</span>',
  '`<!-- issue:ISS-CODE -->`',
  '```html\n<!-- issue:ISS-CODE -->\n```',
  '    <!-- issue:ISS-CODE -->',
  '&lt;!-- issue:ISS-ESCAPED --&gt;',
]) {
  const baseline = renderToStaticMarkup(createElement(require('react-markdown').default, { children: literal }));
  assert.equal(renderProse(literal), `<div class="">${baseline}</div>`, 'other comments, HTML, and literal code retain their original rendering');
}
console.log('Dossier issue markers hidden; source prose, other HTML, comments, and code preserved.');

for (const marker of ['start', 'end']) {
  assert.doesNotMatch(renderProse(`<!-- saved-issue-analysis:${marker} -->`), /saved-issue-analysis/, 'saved analysis boundaries are hidden');
  assert.ok(renderProse('`<!-- saved-issue-analysis:' + marker + ' -->`').includes('saved-issue-analysis'), 'literal code remains visible');
}
const versions = [
  {...source, source_label: 'Original transfer clause', source_version: 'v1', reference_key: 'SRC-1|saved-version-one'},
  {...source, source_label: 'Amended transfer clause', source_version: 'v2', reference_key: 'SRC-1|saved-version-two'},
];
for (const record of versions) {
  const html = renderToStaticMarkup(createElement(ClaimMarkdown, {text: `[source:${record.reference_key}]`, sources: versions}));
  assert.ok(html.includes(record.source_label) && !html.includes('unavailable'), 'version-qualified citation resolves its own record');
  assert.ok(!html.includes(versions.find(item => item !== record)!.source_label), 'citation never opens the sibling version');
}
const ambiguous = renderToStaticMarkup(createElement(ClaimMarkdown, {text: '[source:SRC-1]', sources: versions}));
assert.ok(ambiguous.includes('unavailable'), 'an unqualified ambiguous source cannot silently pick the first version');
