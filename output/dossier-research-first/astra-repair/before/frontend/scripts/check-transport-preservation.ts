import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  BOLD_ITALIC_STAR,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  UNORDERED_LIST,
} from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $getRoot, $getSelection, $isRangeSelection, createEditor } from "lexical";
import { remainingComposerValue } from "../lib/chatRunLogic.ts";
import {
  discardLocalEditorSnapshot,
  documentVersionKey,
  freezeDocumentTarget,
  localEditorSnapshotStorageKey,
  mutationBasisForSnapshot,
  readLocalEditorSnapshot,
  recoverableLocalEditorSnapshot,
  sameDocumentTarget,
  snapshotForDocument,
  writeLocalEditorSnapshot,
} from "../lib/documentNavigation.ts";
import { isModifiedDocumentEnd, moveSelectionToDocumentEnd } from "../lib/editorSelection.ts";
import { savedMarkdownMatches } from "../lib/documentSave.ts";

const form = readFileSync(new URL("../components/NewMatterForm.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/api.ts", import.meta.url), "utf8");
const panel = readFileSync(new URL("../components/DocumentPanel.tsx", import.meta.url), "utf8");
const editor = readFileSync(new URL("../components/MarkdownRichEditor.tsx", import.meta.url), "utf8");
const apiModel = readFileSync(new URL("../../backend/app/models/api.py", import.meta.url), "utf8");
const matterService = readFileSync(new URL("../../backend/app/services/matters.py", import.meta.url), "utf8");
const chatPanel = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
const chatCards = readFileSync(new URL("../components/ChatCards.tsx", import.meta.url), "utf8");

assert.match(form, /const submittedTargetDate = matterTargetDateFromForm\(new FormData\(event\.currentTarget\)\);[\s\S]*await getSettings\(\)[\s\S]*target_date:\s*submittedTargetDate/, "the matter payload must use the submitted target date captured from FormData before any await");
assert.doesNotMatch(form, /target_date:\s*targetDate(?:\s*\|\|\s*null)?/, "matter creation must not fall back to stale target-date React state");
assert.match(form, /type="date"[\s\S]*value=\{targetDate\}/, "the target-date input must remain controlled");
assert.match(api, /createMatter[\s\S]+JSON\.stringify\(payload\)/, "the matters API must transport the full form payload");
assert.match(apiModel, /class MatterCreate[\s\S]+target_date:\s*str\s*\|\s*None\s*=\s*None/, "the API model must accept a target date");
assert.match(matterService, /"target_date":\s*request\.target_date/, "the matter record must store the target date");
assert.match(matterService, /"requested_launch_date":\s*request\.target_date/, "the immutable request must store the target date");
assert.match(chatPanel, /setMessages\(\(current\) => \[\.\.\.current, \{ role: "user"/, "chat must echo a submitted user turn before transport completes");
assert.match(chatPanel, /setInput\(\(current\) => remainingComposerValue/, "accepted submissions must clear only the composer text they sent");
assert.equal(
  remainingComposerValue("Unsent question", "Unsent question", false, ""),
  "Unsent question",
  "a failed or unrelated submission must preserve composer text",
);
assert.equal(
  remainingComposerValue("Newer unsent question", "Submitted question", true, ""),
  "Newer unsent question",
  "an accepted submission must preserve composer text entered after it started",
);
assert.match(chatCards, /type=\{mode === "single" \? "radio" : "checkbox"\}/, "question choices must use native radio and checkbox inputs");
assert.match(chatPanel, /operation_results\?: ChatOperationResult\[\]/, "chat history must preserve typed operation results");
assert.doesNotMatch(chatCards, /createDecision|performMatterAction/, "confirmation cards must use the durable chat action path");
assert.match(chatCards, /card_id: `operation-result:\$\{result\.action\}`[\s\S]*action: "apply"/, "confirmation cards must send a normal chat card action");
assert.match(chatCards, /value="followed">Followed<[\s\S]*value="modified">Modified<[\s\S]*value="not_followed">Not followed<[\s\S]*value="not_applicable">Not applicable</, "decision confirmation must require an explicit recommendation disposition");
assert.match(chatCards, /reasonRequired = disposition === "modified" \|\| disposition === "not_followed"/, "departures from a recommendation must require a reason");
assert.match(chatCards, /mark_as_sent: "Record manual delivery"/, "a persisted delivery operation must keep its specific action label");
assert.match(chatPanel, /latestOperationResults\.set\(result\.source_action_key \?\? result\.action, result\)[\s\S]*latestOperationResults\.get\(result\.source_action_key \?\? result\.action\) === result/, "reload must render only the latest durable result for a source action");
assert.match(chatCards, /No workspace change recorded/, "failed typed mutation results must render a structured no-change state");

assert.match(panel, /value=\{document\.content\}/, "raw Markdown must use the same document content as the rich editor");
assert.match(panel, /markdown=\{document\.content\}/, "the rich editor must use the same document content as raw Markdown");
assert.match(panel, /canonical = await getFile\(submitted\.path\)/, "save must read the canonical document back");
assert.match(panel, /savedMarkdownMatches\(submitted\.content, canonical\.content\)/, "Saved must require canonical content equality");
assert.match(panel, /Save conflict — review/, "a read-back mismatch must remain visible");
assert.match(panel, /Retry save[\s\S]*Reload saved file/, "a conflict must keep retry and reload recovery controls");
assert.equal(savedMarkdownMatches("Saved text", "Saved text\n"), true, "one trailing newline is a storage normalization");
assert.equal(savedMarkdownMatches("Saved text\n", "Saved text"), true, "one trailing newline is symmetric");
assert.equal(savedMarkdownMatches("Saved text\n\n", "Saved text\n"), false, "more than one trailing newline is a real mismatch");
assert.equal(savedMarkdownMatches("Local text", "Canonical text"), false, "different content must conflict");
assert.match(panel, /onClick=\{\(\) => setMode\("editing"\)\}/, "switching to rich editing must only change the display mode");
assert.match(panel, /onClick=\{\(\) => setMode\("markdown"\)\}/, "switching to raw Markdown must only change the display mode");
assert.match(editor, /\bHEADING\b/, "the Markdown conversion must support headings, including H1");
assert.match(editor, /h1:\s*"rich-heading rich-heading-h1"/, "the rich editor must register an H1 presentation");
assert.match(editor, /registerCommand\(KEY_DOWN_COMMAND[\s\S]*isModifiedDocumentEnd[\s\S]*moveSelectionToDocumentEnd/, "the rich editor must own modified-End keyboard behavior");

assert.equal(isModifiedDocumentEnd({ key: "End", altKey: false, ctrlKey: true, metaKey: false }), true);
assert.equal(isModifiedDocumentEnd({ key: "End", altKey: false, ctrlKey: false, metaKey: true }), true);
assert.equal(isModifiedDocumentEnd({ key: "End", altKey: false, ctrlKey: false, metaKey: false }), false);
assert.equal(isModifiedDocumentEnd({ key: "Home", altKey: false, ctrlKey: true, metaKey: false }), false);

const preserved = "# Review heading\n\n| Item | Result |\n| --- | --- |\n| Date | 2026-09-15 |\n";
const transformers = [
  HEADING, QUOTE, UNORDERED_LIST, ORDERED_LIST, BOLD_ITALIC_STAR, BOLD_STAR,
  BOLD_UNDERSCORE, ITALIC_STAR, ITALIC_UNDERSCORE, LINK,
];
const lexical = createEditor({
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
  onError(error) { throw error; },
});
lexical.update(() => { $convertFromMarkdownString(preserved, transformers); }, { discrete: true });
let converted = "";
lexical.getEditorState().read(() => { converted = $convertToMarkdownString(transformers); });
assert.equal(converted, preserved.trimEnd(), "Lexical conversion must preserve an H1 and pipe table");

for (const source of [
  "# Review heading\n\nFirst paragraph.\n\nLast paragraph.",
  "# Review heading\n\n- First item\n- Last item",
  "# Review heading\n\n| Item | Result |\n| --- | --- |\n| Date | 2026-09-15 |",
]) {
  const interactionEditor = createEditor({
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode],
    onError(error) { throw error; },
  });
  interactionEditor.update(() => {
    $convertFromMarkdownString(source, transformers);
    moveSelectionToDocumentEnd();
    const selection = $getSelection();
    assert.equal($isRangeSelection(selection), true);
    if ($isRangeSelection(selection)) selection.insertText(" ATTORNEY NOTE");
  }, { discrete: true });
  let result = "";
  interactionEditor.getEditorState().read(() => { result = $convertToMarkdownString(transformers); });
  assert.equal(result.startsWith("# Review heading"), true, "modified End must never change the H1");
  assert.equal(result.endsWith(" ATTORNEY NOTE"), true, "typing after modified End must append at the final editable position");
}

console.log("Target-date, modified-End, and Markdown preservation checks passed.");

// Execute the production offset mapper, then compare it with real Lexical text.
// This catches formatting markers that accidentally consume visible letters.
const { transpileModule, ModuleKind, ScriptTarget } = await import("typescript");
const { runInNewContext } = await import("node:vm");
const revisionSource = readFileSync(new URL("../components/RevisionPlugin.tsx", import.meta.url), "utf8");
const offsetSource = revisionSource.slice(revisionSource.indexOf("export function markdownOffsetMap("), revisionSource.indexOf("\nfunction selectionOffsets("));
const offsetModule = { exports: {} as { markdownOffsetMap?: (text: string) => { plain: string; rawToPlain: (offset: number) => number; plainToRaw: (offset: number) => number } } };
runInNewContext(transpileModule(offsetSource, { compilerOptions: { module: ModuleKind.CommonJS, target: ScriptTarget.ES2022 } }).outputText, { exports: offsetModule.exports });
const offsetMap = offsetModule.exports.markdownOffsetMap!;
for (const source of [
  "# Memo\n\nThe service uses **identity and fraud signals**. Proceed only after review.",
  "Keep customer_account_id. Proceed only after review.",
  "Read https://example.test/a_b_c. Proceed only after review.",
  "Keep `customer_account_id` and ~~literal text~~. Proceed only after review.",
  "# Memo\n\nThe service uses *identity* and _fraud_ signals. Proceed only after review.",
  "# Memo\n\nThe service uses ***identity and fraud signals***. Proceed only after review.",
  "# Memo\n\nThe service uses __identity__ and [fraud signals](https://example.com). Proceed only after review.",
]) {
  const mappingEditor = createEditor({ nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, AutoLinkNode], onError(error) { throw error; } });
  mappingEditor.update(() => { $convertFromMarkdownString(source, transformers); }, { discrete: true });
  let visible = "";
  mappingEditor.getEditorState().read(() => { visible = $getRoot().getAllTextNodes().map(node => node.getTextContent()).join(""); });
  const mapping = offsetMap(source);
  assert.equal(mapping.plain, visible, "Markdown emphasis must preserve every visible letter in the Lexical offset map");
  const deletionAnchor = source.indexOf("Proceed");
  assert.equal(mapping.rawToPlain(deletionAnchor), visible.indexOf("Proceed"), "a deletion before the later sentence must not appear inside earlier bold or italic words");
  assert.equal(mapping.plainToRaw(visible.indexOf("Proceed")), deletionAnchor, "selection offsets must map back to the exact saved Markdown passage");
}
console.log("Formatted-text redline offset checks passed.");

// Run the actual parent callback with a delayed/failed refresh. A durable POST
// receipt must reach the flow panel before unrelated reads finish.
const workspaceSource = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
const factActionSource = workspaceSource.slice(workspaceSource.indexOf("  async function recordFactAction("), workspaceSource.indexOf("  async function startInquiry("));
const refreshHelperSource = workspaceSource.slice(workspaceSource.indexOf("  function refreshSavedWorkspace("), workspaceSource.indexOf("  async function saveWorkspaceReceipt("));
const factActionJs = transpileModule(`${refreshHelperSource}\nexport ${factActionSource.trim()}`, { compilerOptions: { module: ModuleKind.CommonJS, target: ScriptTarget.ES2022 } }).outputText;
async function checkFactReceipt(refreshFails: boolean, switchedMatter = false, postFails = false) {
  let settleRefresh!: () => void;
  const refresh = new Promise<void>((resolve, reject) => { settleRefresh = () => refreshFails ? reject(new Error("Context read timed out")) : resolve(); });
  let flowState = { proposed_fact_changes: [{ change_id: "accepted", text: "Release timing is not confirmed", state: "proposed" }, { change_id: "unselected", text: "Other fact", state: "proposed" }] };
  const notices: string[] = [];
  const runs: unknown[] = [];
  const receipts = { state: "applied", receipt_id: "fact-acceptance" };
  const currentMatterRef = { current: switchedMatter ? "MAT-NEW" : "MAT-TEST" };
  const actionModule = { exports: {} as { recordFactAction: (path: string, body: object) => Promise<unknown> } };
  runInNewContext(factActionJs, {
    exports: actionModule.exports, detail: { matter_id: "MAT-TEST", path: "03_Matters/test" }, currentMatterRef,
    currentConversationId: "CONV-ONE", effectiveTarget: { matter_id: "MAT-TEST" },
    workspaceCommand: async () => { if (postFails) throw new Error("Fact write rejected"); return { state: "applied", accepted_change_ids: ["accepted"], receipt: receipts, run: { run_id: "RUN-followup" } }; },
    setMatchingScenarios: () => {}, setExternalRun: (run: unknown) => runs.push(run),
    setFlow: (update: (current: typeof flowState) => typeof flowState) => { flowState = update(flowState); },
    refreshAfterChatRun: () => refresh, setWorkspaceNotice: (value: string) => notices.push(value),
  });
  const pending = actionModule.exports.recordFactAction("/flow/accept-facts", { source_action_key: "accept-once" });
  if (postFails) { await assert.rejects(pending, /Fact write rejected/); assert.equal(runs.length, 0); settleRefresh(); return; }
  const delivered = await Promise.race([pending, new Promise(resolve => setImmediate(() => resolve("still waiting for refresh")))]);
  assert.equal(delivered, receipts, "the saved receipt must return while the later refresh is still pending");
  assert.equal(flowState.proposed_fact_changes.some(item => item.change_id === "accepted" && item.state === "proposed"), switchedMatter, "only server-confirmed accepted IDs must leave the current flow proposal list");
  assert.equal(flowState.proposed_fact_changes.some(item => item.change_id === "unselected"), true, "unselected facts must remain available");
  assert.equal(runs.length, switchedMatter ? 0 : 1, "late completions must not attach a run to another matter");
  settleRefresh(); await new Promise(resolve => setImmediate(resolve));
  if (refreshFails && !switchedMatter) assert.match(notices.join(" "), /saved[\s\S]*refresh/i, "refresh failure must preserve the successful fact-save state");
  if (switchedMatter) assert.equal(notices.length, 0, "a late refresh failure must not add a notice to another matter");
}
await checkFactReceipt(false);
await checkFactReceipt(true);
await checkFactReceipt(false, true);
await checkFactReceipt(false, false, true);
console.log("Saved fact receipts survive delayed and failed workspace refreshes.");

// Execute shipped callbacks with successful writes and failed optional reads.
const ts = await import("typescript");
const workspaceAst = ts.createSourceFile("MatterWorkspace.tsx", workspaceSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function productionFunction(name: string): string {
  let found = "";
  function visit(node: import("typescript").Node) { if (ts.isFunctionDeclaration(node) && node.name?.text === name) found = node.getText(workspaceAst); ts.forEachChild(node, visit); }
  visit(workspaceAst); assert.ok(found, `${name} must exist`); return found;
}
function productionCallback(component: string, attribute: string): string {
  let found = "";
  function visit(node: import("typescript").Node) {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(workspaceAst) === component) {
      const prop = node.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.getText(workspaceAst) === attribute);
      if (prop && ts.isJsxAttribute(prop) && prop.initializer && ts.isJsxExpression(prop.initializer) && prop.initializer.expression) found = prop.initializer.expression.getText(workspaceAst);
    }
    ts.forEachChild(node, visit);
  }
  visit(workspaceAst); assert.ok(found, `${component}.${attribute} must be wired`); return found;
}
function parentModule(code: string, bindings: Record<string, unknown>) {
  const result = { exports: {} as Record<string, (...args: any[]) => Promise<any>> };
  runInNewContext(transpileModule(code, { fileName: "callback.tsx", compilerOptions: { module: ModuleKind.CommonJS, target: ScriptTarget.ES2022, jsx: ts.JsxEmit.React } }).outputText, { exports: result.exports, ...bindings });
  return result.exports;
}
const parentBase = { detail: { matter_id: "MAT-TEST", path: "03_Matters/test" }, currentMatterRef: { current: "MAT-TEST" } };
for (const callback of [productionFunction("saveWorkspaceReceipt"), `const saveTemplate = ${productionCallback("OutputTemplateEditor", "onSave")}`]) {
  const notices: string[] = []; const saved = { state: "applied", revision: "NEW", template_id: "custom-memo" }; let writes = 0;
  const compiled = parentModule(`${productionFunction("refreshSavedWorkspace")}\nexport ${callback}`, {
    ...parentBase, editingTemplate: { template_id: "custom-memo" }, setEditingTemplate: () => {},
    templateCommand: async () => { writes++; return saved; }, refreshWorkspace: async () => { throw new Error("Read failed"); },
    loadWorkspaceFeatures: async () => { throw new Error("Read failed"); }, setWorkspaceNotice: (notice: string) => notices.push(notice),
  });
  const result = compiled.saveWorkspaceReceipt ? await compiled.saveWorkspaceReceipt(async () => { writes++; return saved; }) : await compiled.saveTemplate({}, "OLD");
  assert.equal(result, saved, "saved question/template responses must survive optional refresh failure");
  await new Promise(resolve => setImmediate(resolve)); assert.equal(writes, 1); assert.match(notices.join(" "), /saved[\s\S]*refresh/i);
}
for (const failRefresh of [false, true]) {
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  const oldSources = { "03_Matters/test/facts.md": "facts-v1", "03_Matters/test/flow.md": "old-source-hash" };
  const newSources = { ...oldSources, "03_Matters/test/flow.md": "server-source-hash-distinct-from-edit-revision" };
  const savedFlow = { matter_id: "MAT-TEST", revision: "flow-edit-revision", actors: [], edges: [] };
  let projected: any = { ...savedFlow, source_revisions: oldSources, proposed_fact_changes: [{ change_id: "old", text: "Earlier fact" }] };
  let acceptedPayload: any; const notices: string[] = [];
  const compiled = parentModule(["refreshSavedWorkspace", "refreshFlow", "saveFlow", "recordFactAction"].map(name => `export ${productionFunction(name)}`).join("\n"), {
    ...parentBase, featureRead: { current: 0 },
    workspaceCommand: async (_matter: string, path: string, method?: string, body?: any) => {
      if (method === "PATCH") return savedFlow;
      if (path === "/flow/accept-facts") { acceptedPayload = body; return { state: "applied", accepted_change_ids: ["new"], receipt: { state: "applied", receipt_id: "accepted" } }; }
      await gate; if (failRefresh) throw new Error("Flow read failed");
      return { ...savedFlow, proposed_fact_changes: [{ change_id: "new", text: "Release timing is not confirmed" }] };
    },
    getWorkspace: async () => { await gate; return { source_revisions: newSources }; },
    setFlow: (next: any) => { projected = typeof next === "function" ? next(projected) : next; },
    loadWorkspaceFeatures: async () => {}, setWorkspaceNotice: (notice: string) => notices.push(notice),
    currentConversationId: "CONV-SAME", effectiveTarget: { matter_id: "MAT-TEST" },
    setMatchingScenarios: () => {}, setExternalRun: () => {}, refreshAfterChatRun: async () => {},
  });
  assert.equal(await compiled.saveFlow({}, "old-edit-revision"), savedFlow, "saved flow must return before its source-map refresh");
  assert.equal(projected.proposed_fact_changes, undefined, "old choices must not survive a flow save without a new source map");
  release(); await new Promise(resolve => setImmediate(resolve));
  if (failRefresh) { assert.equal(projected.revision, savedFlow.revision); assert.equal(projected.proposed_fact_changes, undefined); assert.match(notices.join(" "), /business flow was saved[\s\S]*refresh/i); }
  else {
    assert.equal(projected.proposed_fact_changes[0].change_id, "new"); assert.equal(projected.source_revisions, newSources);
    await compiled.recordFactAction("/flow/accept-facts", { change_ids: ["new"], expected_revisions: projected.source_revisions, source_action_key: "accept-new-flow" });
    assert.deepEqual(acceptedPayload.expected_revisions, newSources, "immediate acceptance must use the actual source hash"); assert.equal(acceptedPayload.conversation_id, "CONV-SAME");
  }
}
assert.equal(productionCallback("BusinessFlow", "onSave"), "saveFlow");
assert.match(productionCallback("BusinessFlow", "currentRevisions"), /flow\.source_revisions/);
assert.equal(productionCallback("InquiryActions", "onAction"), "runWorkspaceShortcut");
assert.match(productionCallback("InquiryActions", "target"), /effectiveTarget/);
let shortcutRequest: any; let generatedQuestion: any;
const completedInquiry = { run_id: "RUN-INQUIRY", matter_id: "MAT-TEST", state: "completed", response: { reply: "Who controls the funds before settlement?" } };
const shortcuts = parentModule(["refreshSavedWorkspace", "startInquiry", "runWorkspaceShortcut"].map(name => `export ${productionFunction(name)}`).join("\n"), {
  ...parentBase, currentConversationId: "CONV-SAME", runWorkspaceAction: async (_matter: string, request: any) => { shortcutRequest = request; return completedInquiry; },
  getChatRun: async () => completedInquiry, setExternalRun: () => {}, setBusinessQuestionDraft: (draft: any) => { generatedQuestion = draft; }, refreshWorkspace: async () => {}, setWorkspaceNotice: () => {},
});
assert.equal((await shortcuts.runWorkspaceShortcut({ action: "ask_business", instruction: "Ask about control", target: { matter_id: "MAT-TEST", issue_id: "ISSUE-control" }, source_action_key: "ask-once" })).state, "saved");
assert.equal(shortcutRequest.conversation_id, "CONV-SAME"); assert.equal(shortcutRequest.target.issue_id, "ISSUE-control");
assert.equal(generatedQuestion.text, completedInquiry.response.reply, "editable business draft must contain the actual generated reply");
assert.match(workspaceSource, /clipboard\s*\.writeText\(\s*businessQuestionDraft\.text\s*,?\s*\)/);
console.log("Saved sibling receipts, flow-source acceptance, and same-conversation inquiry shortcuts passed.");

// Render the actual editor slot in the actual DraftWorkspace visibility wrapper.
const React = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const selectedArtifact = { path: "03_Matters/test/work-product/selected-clause.md", title: "Selected clause", revision: "content-v2", review_revision: "review-v3" };
const selectedDocument = { document_id: "DOC-selected", path: selectedArtifact.path, title: selectedArtifact.title, revision: selectedArtifact.revision, kind: "work_product", lifecycle_state: "editing_draft", editable: true };
const selectedLocalEdit = { document_id: selectedDocument.document_id, path: selectedDocument.path, base_revision: "content-v2", review_revision: "review-v3", dirty: true, content: "Unsent local clause edit" };
const editorBindings = {
  React, ...parentBase, contextKey: "vault-a:alex:MAT-1", actor: { person_id: "alex", display_name: "Alex Morgan", mode: "demo" }, recommendationSelected: false, selectedSavedDraft: selectedArtifact,
  workspace: { documents: [selectedDocument], question: { revision: "question-v1" } }, activeDocument: selectedDocument, openDocuments: [selectedDocument], localEdits: { [selectedDocument.document_id]: selectedLocalEdit }, referenceTarget: null,
  researchQueue: [{ state: "running" }], savedResearch: { activeCount: 1, savedPacketCount: 2 }, busy: false,
  prepareResearchDraftUpdate: () => {}, activePath: selectedArtifact.path, editorRefresh: 0, setEditorSnapshot: () => {}, handleEditorSnapshot: () => {}, openDocumentIdentity: () => {},
  reviewAuthor: { name: "Lawyer", setName: () => {} }, reviewSettings: { lawyer: "Lawyer" }, upload: () => {},
  DocumentNavigator: (props: any) => { assert.equal(props.documents[0].document_id, selectedDocument.document_id); assert.equal(props.activeDocumentId, selectedDocument.document_id); assert.equal(props.activeDocumentRevision, "content-v2"); return React.createElement("nav", { "aria-label": "Documents" }, "Selected clause"); },
  DocumentTabs: (props: any) => { assert.equal(props.documents[0].document_id, selectedDocument.document_id); assert.equal(props.activeDocumentId, selectedDocument.document_id); assert.equal(props.localEdits[selectedDocument.document_id].base_revision, "content-v2"); return React.createElement("nav", { "aria-label": "Open documents" }, "Selected clause · Local edits retained"); },
  DocumentPanel: (props: any) => { assert.equal(props.contextKey, "vault-a:alex:MAT-1"); assert.equal(props.lawyerAuthor, "Alex Morgan"); assert.equal(props.humanActor.person_id, "alex"); assert.equal(props.activeDocument.document_id, selectedDocument.document_id); assert.equal(props.actionTargetDocumentId, selectedDocument.document_id); assert.equal(props.localEdit.review_revision, "review-v3"); return React.createElement("article", { "data-editor": true }, "Saved clause text"); },
};
const editorRenderer = parentModule(`export const renderEditor = () => (${productionCallback("DraftWorkspace", "editor")});`, editorBindings);
const layoutSource = readFileSync(new URL("../components/workspace/DraftWorkspace.tsx", import.meta.url), "utf8");
const layoutAst = ts.createSourceFile("DraftWorkspace.tsx", layoutSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let editorWrapper = "";
function findEditorWrapper(node: import("typescript").Node) { if (ts.isJsxElement(node) && node.openingElement.attributes.properties.some(prop => ts.isJsxAttribute(prop) && prop.name.getText(layoutAst) === "className" && prop.initializer?.getText(layoutAst) === '"draft-workspace__editor"')) editorWrapper = node.getText(layoutAst); ts.forEachChild(node, findEditorWrapper); }
findEditorWrapper(layoutAst); assert.ok(editorWrapper);
const wrapper = parentModule(`export const renderWrapper = props => (${editorWrapper});`, { React });
const visibleHtml = renderToStaticMarkup(await wrapper.renderWrapper({ view: "draft", editor: await editorRenderer.renderEditor() }));
assert.match(visibleHtml, /Saved research snapshot[\s\S]*Research is running[\s\S]*Update draft from saved research[\s\S]*Saved clause text/);
assert.doesNotMatch(visibleHtml, /hidden=""/, "the snapshot notice and action must be visible in Draft");
const hiddenHtml = renderToStaticMarkup(await wrapper.renderWrapper({ view: "understand", editor: await editorRenderer.renderEditor() }));
assert.match(hiddenHtml, /hidden=""/, "the editor notice must follow the existing view visibility");
let preparedTarget: any; let preparedSeed = "";
const draftUpdate = parentModule(`export ${productionFunction("prepareResearchDraftUpdate")}`, {
  ...parentBase, selectedSavedDraft: selectedArtifact, editorSnapshotRef: { current: { path: selectedArtifact.path, base_revision: "content-v2", review_revision: "review-v3", dirty: true, content: "Unsent local clause edit" } },
  setConversationTarget: (target: any) => { preparedTarget = target; }, openChatWithSeed: (text: string) => { preparedSeed = text; },
});
await draftUpdate.prepareResearchDraftUpdate();
assert.equal(preparedTarget.artifact_path, selectedArtifact.path); assert.equal(preparedTarget.artifact_revision, "content-v2"); assert.equal(preparedTarget.artifact_review_revision, "review-v3");
assert.equal(preparedTarget.local_draft_snapshot, "Unsent local clause edit"); assert.match(preparedSeed, /Selected clause[\s\S]*tracked revisions/);
assert.doesNotMatch(productionFunction("prepareResearchDraftUpdate"), /startChatRun|submitDraft|workspaceCommand|setActivePath/, "preparing a research update must not submit or mutate the artifact");

const currentChatSource = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
const chatAst = ts.createSourceFile("ChatPanel.tsx", currentChatSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let seedEffect = ""; let appendRequest = "";
function findSeedCallbacks(node: import("typescript").Node) {
  if (ts.isCallExpression(node) && node.expression.getText(chatAst) === "useEffect" && node.arguments[0]?.getText(chatAst).includes("composerValue.current")) seedEffect = node.arguments[0].getText(chatAst);
  if (ts.isFunctionDeclaration(node) && node.name?.text === "appendPreparedRequest") appendRequest = node.getText(chatAst);
  ts.forEachChild(node, findSeedCallbacks);
}
findSeedCallbacks(chatAst); assert.ok(seedEffect); assert.ok(appendRequest);
for (const existingText of ["", "My unsent next message"]) {
  let composerText = existingText; let pendingSeed: string | null = null;
  const bindings: Record<string, any> = { window: { localStorage: { getItem: () => null } }, inputStorageKey: "test-composer", seed: { text: preparedSeed, revision: 1 }, composerValue: { current: existingText }, setInput: (value: any) => { composerText = typeof value === "function" ? value(composerText) : value; }, setPreparedRequest: (value: string | null) => { pendingSeed = value; }, requestAnimationFrame: () => {}, inputRef: { current: null } };
  const effect = parentModule(`export const receiveSeed = ${seedEffect}`, bindings);
  await effect.receiveSeed();
  assert.equal(composerText, existingText || preparedSeed, "a seed must preserve a nonempty composer and still fill an empty composer");
  if (existingText) {
    assert.equal(pendingSeed, preparedSeed, "the prepared request must remain separately available");
    const append = parentModule(`export ${appendRequest}`, { ...bindings, preparedRequest: pendingSeed });
    await append.appendPreparedRequest();
    assert.equal(composerText, `${existingText}\n\n${preparedSeed}`, "only the explicit append action may add the prepared request"); assert.equal(pendingSeed, null);
  }
}
assert.match(currentChatSource, /onClick=\{appendPreparedRequest\}>Append prepared request/);
assert.doesNotMatch(seedEffect + appendRequest, /\bsubmit\(/, "seed delivery and append must never auto-submit");
console.log("Draft snapshot notice, selected-artifact target, and unsent composer seed preservation passed.");

// Execute the production save/reload callbacks and refresh effect. The fixture
// enforces the server's two revision checks and retains a scoped browser draft.
const documentAst = ts.createSourceFile("DocumentPanel.tsx", panel, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const documentFunctions: string[] = [];
let documentRefresh = "";
function findDocumentCallbacks(node: import("typescript").Node) {
  if (ts.isFunctionDeclaration(node) && ["basisFor", "rememberDocument", "loadDocument", "save", "reloadCanonical", "requestClose", "reviewAction"].includes(node.name?.text || "")) documentFunctions.push(node.getText(documentAst));
  if (ts.isCallExpression(node) && node.expression.getText(documentAst) === "useEffect" && node.arguments[1]?.getText(documentAst).includes("refreshSignal")) documentRefresh = node.arguments[0].getText(documentAst);
  ts.forEachChild(node, findDocumentCallbacks);
}
findDocumentCallbacks(documentAst); assert.equal(documentFunctions.length, 7); assert.ok(documentRefresh);
function documentFixture(tracking = false) {
  const path = "03_Matters/demo/drafts/memo.md";
  const contextKey = "vault:alex:MAT-editor";
  const identity = { document_id: "DOC-memo", path, title: "Memo", kind: "work_product", revision: "body-1", lifecycle_state: "editing_draft", editable: true, immutable: false };
  const versionKey = documentVersionKey(identity);
  const draftKey = localEditorSnapshotStorageKey(contextKey, identity.document_id);
  const browserStorage = new Map<string, string>();
  const local = { path, name: "memo.md", kind: "markdown", editable: true, content: "My local clause", metadata: { record_type: "work_product" } };
  const baseline = { path, tracking, artifact_revision: "body-1", revision: "review-1", authors: [], segments: [{ kind: "equal", text: "Original clause" }] };
  let savedDocument = { ...local, content: "Original clause" };
  let savedReview: any = baseline;
  let sequence = 1;
  const sent: any[] = [];
  const bindings: Record<string, any> = {
    document: local, documentRef: { current: local }, review: baseline, reviewRef: { current: baseline }, dirty: true, selectedRange: null,
    activeDocument: identity, activeIdentityRef: { current: identity }, localEdit: null, cachedEdits: { current: new Map() }, mutationBases: { current: new Map() }, loadVersion: { current: 0 }, contextKey, activePath: path, savedChangesAvailable: false,
    editingAuthorId: "alex", editingAuthorName: "Alex Morgan", humanActor: { person_id: "alex", display_name: "Alex Morgan" }, activeReviewAuthor: "Alex Morgan", lawyerAuthor: "Alex Morgan", authorId: () => "alex", REVIEW_AUTHOR_PALETTE: ["purple"],
    window: { confirm: () => true },
    localStorage: { getItem: (key: string) => browserStorage.get(key) ?? null, setItem: (key: string, value: string) => browserStorage.set(key, value), removeItem: (key: string) => browserStorage.delete(key) },
    documentVersionKey, freezeDocumentTarget, mutationBasisForSnapshot, readLocalEditorSnapshot, recoverableLocalEditorSnapshot, sameDocumentTarget, snapshotForDocument, writeLocalEditorSnapshot, discardLocalEditorSnapshot,
    setDocument: (value: any) => { bindings.document = typeof value === "function" ? value(bindings.document) : value; bindings.documentRef.current = bindings.document; },
    setReview: (value: any) => { bindings.review = value; bindings.reviewRef.current = value; },
    savedMarkdownMatches,
    getFile: async () => savedDocument,
    getDocumentReview: async () => savedReview,
    updateDocumentReview: async (_path: string, action: any) => {
      sent.push(action);
      assert.equal(_path, path);
      if (action.expected_revision !== savedReview.artifact_revision || action.expected_review_revision !== savedReview.revision) throw new Error("The saved document changed. Your proposed text is retained separately.");
      sequence++;
      if (action.content !== undefined) savedDocument = { ...savedDocument, content: `${action.content}\n` };
      savedReview = { ...savedReview, artifact_revision: `body-${sequence}`, revision: `review-${sequence}`, segments: [{ kind: "equal", text: savedDocument.content }] };
      return savedReview;
    },
    saveFile: () => { throw new Error("Editable Markdown must use its guarded review path"); },
    onSaved: () => { assert.equal(browserStorage.has(draftKey), false, "verified save clears storage before the parent refresh"); assert.equal(bindings.cachedEdits.current.get(versionKey).dirty, false); },
    onSnapshot: (snapshot: any) => { bindings.closedSnapshot = snapshot; },
    onClose: () => { bindings.closed = true; },
  };
  for (const key of ["dirty", "saveState", "busy", "error", "selectedRange", "savedChangesAvailable", "mode", "editorVersion"]) bindings[`set${key[0].toUpperCase()}${key.slice(1)}`] = (value: any) => { bindings[key] = typeof value === "function" ? value(bindings[key] || 0) : value; };
  bindings.exports = {};
  runInNewContext(transpileModule(`${documentFunctions.join("\n")}\nexport {rememberDocument,loadDocument,save,reloadCanonical,requestClose,reviewAction}; export const refresh = ${documentRefresh};`, {compilerOptions: {module: ModuleKind.CommonJS, target: ScriptTarget.ES2022}}).outputText, bindings);
  const module = bindings.exports;
  module.rememberDocument(local, baseline, true, null);
  return { bindings, module, sent, browserStorage, draftKey, path, versionKey, identity,
    propose: () => { sequence++; savedDocument = { ...savedDocument, content: "New proposed clause\n", metadata: { record_type: "work_product", pending_review: true } }; savedReview = { ...savedReview, artifact_revision: `body-${sequence}`, revision: `review-${sequence}`, segments: [{ kind: "insert", text: savedDocument.content }] }; },
    saved: () => ({ document: savedDocument, review: savedReview }),
  };
}
const settleDocument = async () => { for (let step = 0; step < 8; step++) await Promise.resolve(); };
for (const tracking of [false, true]) {
  const fixture = documentFixture(tracking);
  fixture.propose(); const before = JSON.stringify(fixture.saved());
  assert.equal(await fixture.module.save(), false);
  assert.equal(fixture.sent[0].expected_revision, "body-1");
  assert.equal(fixture.sent[0].expected_review_revision, "review-1");
  assert.equal(JSON.stringify(fixture.saved()), before, "stale local save cannot replace a newer model proposal");
  assert.equal(fixture.bindings.document.content, "My local clause");
  assert.ok(fixture.browserStorage.has(fixture.draftKey));
  const cleanup = fixture.module.refresh(); await settleDocument();
  assert.equal(fixture.bindings.savedChangesAvailable, true, "dirty refresh must discover the newer review");
  assert.equal(fixture.bindings.review.revision, "review-1", "discovery cannot rebase the local edit onto a newer revision");
  fixture.bindings.window.confirm = () => false;
  await fixture.module.reloadCanonical();
  assert.equal(fixture.bindings.document.content, "My local clause");
  assert.ok(fixture.browserStorage.has(fixture.draftKey));
  fixture.bindings.window.confirm = () => true;
  await fixture.module.reloadCanonical();
  assert.equal(fixture.bindings.document.content, "New proposed clause\n");
  assert.equal(fixture.bindings.document.metadata.pending_review, true);
  assert.equal(fixture.bindings.review.segments[0].kind, "insert", "reload exposes the existing editor's proposal review");
  assert.equal(fixture.bindings.mode, "editing");
  assert.equal(fixture.bindings.dirty, false);
  assert.equal(fixture.browserStorage.has(fixture.draftKey), false);
  cleanup();
}
{
  const fixture = documentFixture();
  const oldGet = fixture.bindings.getFile;
  let finish!: (value: any) => void;
  fixture.bindings.getFile = () => new Promise(resolve => { finish = resolve; });
  const stale = fixture.saved().document;
  const cleanup = fixture.module.refresh();
  fixture.bindings.getFile = oldGet;
  assert.equal(await fixture.module.save(), true);
  finish(stale); await settleDocument();
  assert.equal(fixture.bindings.document.content, "My local clause\n", "a pre-save refresh cannot restore stale content");
  assert.equal(fixture.bindings.dirty, false);
  assert.equal(fixture.browserStorage.has(fixture.draftKey), false);
  await fixture.module.reviewAction({ action: "add_comment", body: "Review this" });
  assert.equal(fixture.sent[1].expected_review_revision, "review-2", "the next review action uses the confirmed save revision");
  cleanup();
}
{
  const fixture = documentFixture();
  fixture.bindings.getFile = async () => { throw new Error("Read unavailable"); };
  await fixture.module.reloadCanonical();
  assert.equal(fixture.bindings.document.content, "My local clause");
  assert.ok(fixture.browserStorage.has(fixture.draftKey), "failed reload must keep the draft");
  fixture.browserStorage.set("vault:jordan:MAT-editor:other", "Other person's text");
  fixture.module.requestClose();
  assert.equal(JSON.parse(fixture.browserStorage.get(fixture.draftKey)!).recoverable, true, "closing a dirty document must retain a recoverable local edit");
  assert.equal(fixture.bindings.closedSnapshot.base_revision, "body-1");
  assert.equal(fixture.bindings.closedSnapshot.review_revision, "review-1");
  discardLocalEditorSnapshot(fixture.bindings.localStorage, "vault:alex:MAT-editor", fixture.identity.document_id);
  assert.equal(fixture.browserStorage.has(fixture.draftKey), false);
  assert.equal(fixture.browserStorage.get("vault:jordan:MAT-editor:other"), "Other person's text");
  assert.equal(fixture.bindings.closed, true);
}
{
  const fixture = documentFixture();
  let finish!: (value: any) => void;
  fixture.bindings.getFile = () => new Promise(resolve => { finish = resolve; });
  const reloading = fixture.module.reloadCanonical();
  fixture.bindings.setDocument({ ...fixture.bindings.document, content: "New typing during reload" });
  finish(fixture.saved().document); await reloading;
  assert.equal(fixture.bindings.document.content, "New typing during reload");
  assert.equal(fixture.bindings.dirty, true);
  assert.match(fixture.bindings.error, /local text changed/);
}
console.log("Document recovery passed: guarded saves, dirty refresh discovery, confirmed proposal reload, save/refresh race, and scoped discard.");

for (const action of ["accept_change", "reject_change"]) {
  const fixture = documentFixture(true);
  await fixture.module.reloadCanonical();
  const originalRevision = fixture.bindings.review.revision;
  const apply = fixture.bindings.updateDocumentReview;
  let finish!: () => void;
  fixture.bindings.updateDocumentReview = async (...args: any[]) => {
    const result = await apply(...args);
    await new Promise<void>(resolve => { finish = resolve; });
    return result;
  };
  const pending = fixture.module.reviewAction({ action, change_id: "change-1" });
  await settleDocument();
  fixture.bindings.setDocument({ ...fixture.bindings.document, content: "Typed while review action was saving" });
  fixture.bindings.dirty = true;
  fixture.module.rememberDocument(fixture.bindings.document, fixture.bindings.review, true, null);
  finish(); await pending;
  assert.equal(fixture.bindings.document.content, "Typed while review action was saving");
  assert.equal(fixture.bindings.dirty, true);
  assert.equal(fixture.bindings.review.revision, originalRevision, "new typing retains its actual prior basis");
  assert.equal(JSON.parse(fixture.browserStorage.get(fixture.draftKey)!).content, "Typed while review action was saving");
  assert.equal(fixture.bindings.savedChangesAvailable, true);
  assert.match(fixture.bindings.error, /review action was saved/);
  fixture.bindings.updateDocumentReview = apply;
  assert.equal(await fixture.module.save(), false, "a retained edit must conflict against the completed review action until explicitly reloaded");
}
console.log("Typing during accept/reject survives completion with its original revision and a saved-result notice.");
