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
const ClaimMarkdown = load('../components/workspace/ClaimMarkdown.tsx').default;
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
