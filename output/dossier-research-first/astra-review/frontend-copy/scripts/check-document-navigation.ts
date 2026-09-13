import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

type Node = { type: unknown; props: Record<string, unknown> };
type Exports = Record<string, unknown> & { default?: (props: Record<string, unknown>) => Node };

const jsx = (type: unknown, props: Record<string, unknown> | null): Node => ({ type, props: props ?? {} });

function load(source: string, fileName: string, modules: Record<string, unknown> = {}): Exports {
  const module = { exports: {} as Exports };
  const output = ts.transpileModule(source, { fileName, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  runInNewContext(output, { module, exports: module.exports, require: (name: string) => name === "react/jsx-runtime" ? { Fragment: "Fragment", jsx, jsxs: jsx } : modules[name] ?? {} });
  return module.exports;
}

function expand(node: unknown): Node[] {
  if (node === null || node === undefined || typeof node === "boolean") return [];
  if (Array.isArray(node)) return node.flatMap(expand);
  if (typeof node !== "object") return [];
  const element = node as Node;
  if (typeof element.type === "function") return expand(element.type(element.props));
  return [element, ...expand(element.props.children)];
}

function text(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  const element = node as Node;
  if (typeof element.type === "function") return text(element.type(element.props));
  return text(element.props.children);
}

const [navigatorSource, tabsSource] = await Promise.all([
  readFile(new URL("../components/workspace/DocumentNavigator.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/DocumentTabs.tsx", import.meta.url), "utf8"),
]);

const navigatorModule = load(navigatorSource, "DocumentNavigator.tsx");
const groupDocuments = navigatorModule.groupDocuments as (documents: Record<string, unknown>[], kind: string) => Array<{ groupId: string; documents: Record<string, unknown>[] }>;
const lifecycleLabel = navigatorModule.lifecycleLabel as (document: Record<string, unknown>) => string;
const documentPickerValue = navigatorModule.documentPickerValue as (document: Record<string, unknown>) => string;
const DocumentNavigator = navigatorModule.default!;

const documents = [
  { document_id: "DOC-DRAFT-CURRENT", work_product_id: "WP-REPLY", path: "work-products/reply.md", title: "Launch reply", kind: "work_product", revision: "r3", version_id: "v3", lifecycle_state: "editing_draft", editable: true, immutable: false },
  { document_id: "DOC-DRAFT-CURRENT", work_product_id: "WP-REPLY", path: "work-products/versions/reply-v2.md", title: "Launch reply", kind: "work_product", revision: "r2", version_id: "v2", lifecycle_state: "final", editable: false, immutable: true },
  { document_id: "DOC-MEMO", work_product_id: "WP-MEMO", path: "work-products/memo.md", title: "Launch reply", kind: "work_product", revision: "m1", lifecycle_state: "approved", editable: false, immutable: true },
  { document_id: "SRC-CONTRACT", path: "sources/contract.pdf", title: "School agreement", kind: "source", revision: "s1", lifecycle_state: "reading_source", editable: false, immutable: true },
  { document_id: "SRC-NOTES", path: "sources/notes.txt", title: "Launch reply", kind: "source", revision: "s2", lifecycle_state: "reading_source", editable: false, immutable: true },
  { document_id: "REC-MATTER", path: "matter.md", title: "Matter details", kind: "matter_record", revision: "mr1", lifecycle_state: "matter_record", editable: true, immutable: false },
];

const workGroups = groupDocuments(documents, "work_product");
assert.equal(workGroups.length, 2, "earlier versions do not increase the work-product count");
assert.equal(workGroups[0].documents.length, 2, "the earlier version stays under its stable work-product identity");
assert.notEqual(workGroups[0].groupId, workGroups[1].groupId, "duplicate titles do not merge distinct work products");
assert.equal(lifecycleLabel(documents[0]), "Editing draft");
assert.equal(lifecycleLabel(documents[3]), "Reading source");
assert.equal(lifecycleLabel(documents[2]), "Approved");

let opened = "";
let openedPath = "";
let openedRevision = "";
let workingCopy = "";
const navigatorTree = DocumentNavigator({
  documents,
  activeDocumentId: "DOC-DRAFT-CURRENT",
  onOpen: (document: { document_id: string; path: string; revision: string }) => { opened = document.document_id; openedPath = document.path; openedRevision = document.revision; },
  onCreateWorkingCopy: (document: { document_id: string }) => { workingCopy = document.document_id; },
});
const navigatorNodes = expand(navigatorTree);
assert.ok(navigatorNodes.some((node) => node.type === "nav" && node.props["aria-label"] === "Documents"), "the complete library has an accessible Documents name");
assert.match(text(navigatorTree), /Work products \(2\)[\s\S]*Sources \(2\)[\s\S]*Matter records \(1\)/, "the complete library has grouped counts");
const recordsDisclosure = navigatorNodes.find((node) => node.type === "details" && text(node).includes("Matter records (1)"));
assert.equal(recordsDisclosure?.props.open, false, "matter records start collapsed");
assert.equal(text(navigatorTree).includes("Earlier versions (1)"), true, "history is nested under the work product");
assert.equal(text(navigatorTree).includes("work-products/memo.md"), true, "duplicate titles include a secondary path that distinguishes the record");
assert.equal(navigatorNodes.filter((node) => node.props["aria-current"] === "page").length, 1, "document-level active data does not claim that an earlier revision is active");
const namedButtons = navigatorNodes.filter((node) => node.type === "button" && text(node) === "Launch reply");
assert.ok(namedButtons.length >= 3, "duplicate friendly names remain separate selectable records");
(namedButtons[1].props.onClick as () => void)();
assert.equal(opened, "DOC-MEMO", "duplicate names open by stable document identity");
const picker = navigatorNodes.find((node) => node.type === "select")!;
(picker.props.onChange as (event: { target: { value: string } }) => void)({ target: { value: documentPickerValue(documents[1]) } });
assert.equal(opened, "DOC-DRAFT-CURRENT", "the historical picker option keeps the stable document ID");
assert.equal(openedPath, "work-products/versions/reply-v2.md", "the composite picker resolves the historical path rather than the first matching ID");
assert.equal(openedRevision, "r2", "the composite picker resolves the historical revision");
const historicalTree = DocumentNavigator({ documents, activeDocumentId: documents[1].document_id,
  activeDocumentPath: documents[1].path, activeDocumentRevision: documents[1].revision,
  onOpen: () => {}, onCreateWorkingCopy: () => {} });
const historicalNodes = expand(historicalTree);
assert.equal(historicalNodes.find(node => node.type === "select")?.props.value, documentPickerValue(documents[1]));
assert.equal(historicalNodes.filter(node => node.props["aria-current"] === "page").length, 1);
assert.equal(text(historicalNodes.find(node => node.props["aria-current"] === "page")), "v2");
const workingCopyButton = navigatorNodes.find((node) => node.type === "button" && text(node) === "Create working copy")!;
(workingCopyButton.props.onClick as () => void)();
assert.equal(workingCopy, "SRC-CONTRACT", "a read-only source requires the explicit working-copy callback");
assert.equal(navigatorNodes.some((node) => node.type === "select"), true, "a native keyboard-accessible document picker is present");

const tabsModule = load(tabsSource, "DocumentTabs.tsx", { "./DocumentNavigator": { lifecycleLabel } });
const visibleDocumentTabs = tabsModule.visibleDocumentTabs as (documents: Record<string, unknown>[], active: string | null, limit?: number) => { visible: Record<string, unknown>[]; overflow: Record<string, unknown>[] };
const DocumentTabs = tabsModule.default!;
const openedDocuments = [...documents.slice(0, 5)];
const split = visibleDocumentTabs(openedDocuments, "SRC-NOTES", 4);
assert.equal(split.visible.some((document) => document.document_id === "SRC-NOTES"), true, "the active open document stays in the visible tab row");
assert.equal(split.overflow.length, 1, "extra open tabs move to the overflow menu");

let selected = "";
let closed = "";
let discarded = "";
const tabsTree = DocumentTabs({
  documents: openedDocuments,
  activeDocumentId: "DOC-DRAFT-CURRENT",
  localEdits: { "DOC-DRAFT-CURRENT": { path: "work-products/reply.md", content: "Unsaved lawyer text", base_revision: "r3", dirty: true, selected_range: null, recoverable: true } },
  onSelect: (documentId: string) => { selected = documentId; },
  onClose: (documentId: string) => { closed = documentId; },
  onDiscardLocalEdit: (documentId: string) => { discarded = documentId; },
});
const tabNodes = expand(tabsTree);
assert.equal(text(tabsTree).includes("Unsaved"), true, "a dirty tab explicitly says its edit is unsaved");
assert.equal(text(tabsTree).includes("More open documents (1)"), true, "overflow remains accessible by a native disclosure");
const currentTab = tabNodes.find((node) => node.type === "button" && node.props["aria-current"] === "page")!;
assert.match(text(currentTab), /Launch reply[\s\S]*Editing draft[\s\S]*Unsaved/, "the active tab shows its title, lifecycle, and retained edit state");
(currentTab.props.onClick as () => void)();
assert.equal(selected, "DOC-DRAFT-CURRENT");
const closeDirty = tabNodes.find((node) => node.type === "button" && String(node.props["aria-label"] || "").includes("Local edits will be retained"))!;
(closeDirty.props.onClick as () => void)();
assert.equal(closed, "DOC-DRAFT-CURRENT", "close reports the exact dirty document identity");
assert.equal(discarded, "", "closing a dirty tab does not discard its edit");
const discardButton = tabNodes.find((node) => node.type === "button" && text(node) === "Discard local edits")!;
(discardButton.props.onClick as () => void)();
assert.equal(discarded, "DOC-DRAFT-CURRENT", "discard remains a distinct explicit callback");

for (const source of [navigatorSource, tabsSource]) {
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "document navigation uses shared design tokens");
  assert.doesNotMatch(source, /localStorage|fetch\(|deleteDocument|saveDocument/, "presentation components do not save, delete, or persist documents");
}

console.log("Document navigation render, grouping, identity, and callback checks passed. Browser layout checks remain pending.");
