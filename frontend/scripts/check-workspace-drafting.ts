import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { canPersistWorkspaceDraftingPreferences, defaultWorkspaceDraftingPreferences, matchingLocalEditorSnapshot, newWorkspaceDraftActionKey, normalizeWorkspaceDraftingPreferences, readWorkspaceDraftingPreferences, restoredOutputTemplate, reusableWorkspaceDraftActionKey, shouldOpenCompletedDraft, WorkspaceDraftingActionTracker, workspaceDraftRequestFingerprint, workspaceDraftingStorageKey, writeWorkspaceDraftingPreferences } from "../lib/workspaceDrafting.ts";

const [dock, workspace, types, frameStyles] = await Promise.all([
  readFile(new URL("../components/workspace/ConversationDock.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/DraftWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/workspaceTypes.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/MatterA.module.css", import.meta.url), "utf8"),
]);

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const storage = new MemoryStorage();
const saved = { ...defaultWorkspaceDraftingPreferences(), view: "draft" as const, activeArtifactPath: "work/memo.md", selectedTemplateId: "memo", instruction: "Draft the memo", overrides: { audience: "Board" }, sourceActionKey: "draft:M-1:abc", sourceActionFingerprint: "request:abc" };
writeWorkspaceDraftingPreferences(storage, "M-1", saved);
assert.deepEqual(readWorkspaceDraftingPreferences(storage, "M-1"), saved, "matter-local drafting choices must reopen exactly");
assert.deepEqual(readWorkspaceDraftingPreferences(storage, "M-2"), defaultWorkspaceDraftingPreferences(), "one matter cannot restore another matter's draft state");
assert.notEqual(workspaceDraftingStorageKey("M-1"), workspaceDraftingStorageKey("M-2"), "drafting storage keys must include the matter");
assert.deepEqual(normalizeWorkspaceDraftingPreferences({ view: "bad", activeArtifactPath: 3, overrides: { audience: "Board", count: 3 }, sourceActionKey: "" }), { ...defaultWorkspaceDraftingPreferences(), overrides: { audience: "Board" } }, "bad stored data must fall back without leaking invalid values");
assert.equal(newWorkspaceDraftActionKey("M-1", 100, .5), newWorkspaceDraftActionKey("M-1", 100, .5), "a generated draft key is stable for retry when retained");

const strictStorage = new MemoryStorage();
writeWorkspaceDraftingPreferences(strictStorage, "M-1", saved);
const blank = defaultWorkspaceDraftingPreferences();
let hydratedMatterId: string | null = null;
for (const strictEffectReplay of [1, 2]) {
  if (canPersistWorkspaceDraftingPreferences(hydratedMatterId, "M-1")) writeWorkspaceDraftingPreferences(strictStorage, "M-1", blank);
  assert.deepEqual(readWorkspaceDraftingPreferences(strictStorage, "M-1"), saved, `Strict Mode replay ${strictEffectReplay} must not write blank initial state`);
}
hydratedMatterId = "M-1";
if (canPersistWorkspaceDraftingPreferences(hydratedMatterId, "M-1")) writeWorkspaceDraftingPreferences(strictStorage, "M-1", saved);
assert.deepEqual(readWorkspaceDraftingPreferences(strictStorage, "M-1"), saved, "the restored render may persist its actual values");
const delayedTemplate = { template_id: "memo", skill_id: "memo", name: "Memo", output_type: "memo", revision: "v1", content_hash: "hash", path: "skills/memo.md" };
assert.equal(restoredOutputTemplate([], "memo"), null, "template restore must wait for a late template list");
assert.equal(restoredOutputTemplate([delayedTemplate], "memo")?.template_id, "memo", "a late template list must apply the saved template selection");
assert.equal(shouldOpenCompletedDraft("work/memo.md", "work/memo.md"), true, "a draft result may open when the lawyer stayed on its source");
assert.equal(shouldOpenCompletedDraft("work/other-memo.md", "work/memo.md"), false, "a finished request must not replace a later artifact selection");

const baseRequest = {
  instruction: "Draft the memo",
  target: { matter_id: "M-1", artifact_path: "work/memo.md", artifact_revision: "content-a", artifact_review_revision: "review-a", selected_range: { start: 0, end: 4, text: "Memo" }, local_draft_snapshot: "Memo" },
  business_question_revision: "question-a",
  output_type: "memo",
  template_use: { template_id: "memo", output_type: "memo", revision: "template-a", content_hash: "hash-a", instructions_snapshot: "Use headings", overrides: { audience: "Board" } },
  output_preferences: { audience: "Board" },
};
const baseFingerprint = workspaceDraftRequestFingerprint(baseRequest);
assert.notEqual(baseFingerprint, workspaceDraftRequestFingerprint({ ...baseRequest, target: { ...baseRequest.target, artifact_revision: "content-b" } }), "a changed artifact revision needs a new retry key");
assert.notEqual(baseFingerprint, workspaceDraftRequestFingerprint({ ...baseRequest, target: { ...baseRequest.target, artifact_path: "work/other.md" } }), "a changed target needs a new retry key");
assert.notEqual(baseFingerprint, workspaceDraftRequestFingerprint({ ...baseRequest, business_question_revision: "question-b" }), "a changed question revision needs a new retry key");
assert.notEqual(baseFingerprint, workspaceDraftRequestFingerprint({ ...baseRequest, template_use: { ...baseRequest.template_use, revision: "template-b" } }), "a changed template version needs a new retry key");
assert.equal(reusableWorkspaceDraftActionKey("saved-key", baseFingerprint, baseFingerprint, () => "new-key"), "saved-key", "an exact reopened request retains its retry key");
assert.equal(reusableWorkspaceDraftActionKey("saved-key", baseFingerprint, `${baseFingerprint}:changed`, () => "new-key"), "new-key", "a changed request cannot reuse an old retry key");
assert.equal(matchingLocalEditorSnapshot("work/memo.md", { path: "work/memo.md", content: "Local edit", base_revision: "content-a", review_revision: "review-a", dirty: true, selected_range: null })?.content, "Local edit", "a matching target may include its dirty local snapshot");
assert.equal(matchingLocalEditorSnapshot("work/other.md", { path: "work/memo.md", content: "Local edit", base_revision: "content-a", dirty: true, selected_range: null }), null, "a dirty editor cannot override a cleared or different visible target");

const tracker = new WorkspaceDraftingActionTracker("M-1");
const requestFromA = tracker.begin();
const currentArtifactAfterSelection = "work/b.md";
assert.equal(shouldOpenCompletedDraft(currentArtifactAfterSelection, "work/a.md"), false, "after choosing B, A's resolved request cannot open C over B");
assert.equal(tracker.isCurrent(requestFromA), true, "a same-matter selection change keeps the useful A result available");
tracker.setMatter("M-2");
assert.equal(tracker.isCurrent(requestFromA), false, "an A completion cannot set result or clear pending state after a matter switch");
const requestFromM2 = tracker.begin();
assert.equal(tracker.isCurrent(requestFromM2), true, "the new matter can start its own action after stale A is ignored");

assert.match(dock, /onTargetChange\(null\)/, "the scope strip must clear the visible target");
assert.match(dock, /changed_links.*onOpenArtifact/, "receipts must open actual saved source files");
assert.match(dock, /children/, "ConversationDock must receive one composed conversation child");
assert.doesNotMatch(dock, /#[0-9a-fA-F]{3,8}/, "conversation layout must use shared semantic color tokens");
assert.match(workspace, /props\.conversation/, "DraftWorkspace must compose the shared conversation node");
assert.equal((workspace.match(/props\.conversation/g) ?? []).length, 1, "the shared conversation node must appear in exactly one mounted place");
assert.match(workspace, /hidden=\{props\.view !== "understand"\}/, "Understand must hide without unmounting");
assert.match(workspace, /hidden=\{props\.view !== "draft"\}/, "the editor must hide without unmounting");
assert.match(workspace, /local_draft_snapshot: localSnapshot\?\.content/, "a dirty editor must be submitted as an explicit local snapshot");
assert.match(workspace, /artifact_review_revision: localSnapshot\?\.review_revision/, "draft requests must preserve separate review state revisions");
assert.match(workspace, /submittedTarget\.current/, "a draft request must freeze its target before awaiting the result");
assert.match(workspace, /shouldOpenCompletedDraft\(latestActiveArtifactPath\.current, submittedTarget\.current\)/, "a completion must read the latest artifact selection instead of its old render closure");
assert.match(workspace, /WorkspaceDraftingActionTracker/, "all awaited actions must invalidate their completion after a matter switch");
assert.match(workspace, /hydratedMatterId/, "persistence must wait for hydration state instead of a one-shot effect ref");
assert.match(workspace, /canPersistWorkspaceDraftingPreferences\(hydratedMatterId, props\.matterId\)/, "Strict Mode effect replay must not persist blank initial values");
assert.match(workspace, /restoredOutputTemplate\(props\.templates, restoredTemplateId\)/, "a saved template must apply when templates arrive after restore");
assert.match(workspace, /matchingLocalEditorSnapshot\(props\.target\?\.artifact_path, props\.editorSnapshot/, "a dirty snapshot must match the current visible document target");
assert.match(workspace, /workspaceDraftRequestFingerprint\(requestBase\)/, "retry identity must cover the full frozen request");
assert.match(workspace, /Preview · Not kept[\s\S]*Keep preview/, "preview must have a clear not-kept state and explicit keep action");
assert.match(workspace, /result\.artifact\.preview \? "Preview · Not kept" : "Saved work product"/, "a kept preview must stop using the unkept state label");
assert.match(workspace, /previewResult\.artifact\.preview \? <button[\s\S]*Keep preview/, "the transient preview panel must hide Keep after the artifact is kept");
assert.match(workspace, /artifact\.preview && !previewKeptHere[\s\S]*Keep preview/, "a restored saved preview artifact must expose Keep preview from the artifact list");
assert.match(workspace, /setPreviewResult\(\(current\) => current\?\.artifact\?\.path === artifact\.path[\s\S]*preview: false/, "a successful keep must stop the local result from claiming the preview is unkept");
assert.match(workspace, /refreshed && !refreshed\.preview && previewResult\.artifact\.preview/, "refreshed kept artifacts must reconcile the transient preview result");
assert.match(workspace, /Creates a separate editable preview\. It does not replace a draft, record a decision, or send work\./, "preview copy must describe the durable separate artifact without implying approval or delivery");
assert.match(workspace, /Preview failed[\s\S]*Preview not saved/, "preview failures must have explicit state words instead of preparing copy");
assert.match(workspace, /Accept update[\s\S]*Decline update/, "update offers must keep lawyer acceptance and decline distinct");
assert.match(workspace, /offerState === "declined"[\s\S]*Earlier facts · Draft retained[\s\S]*Ask in the conversation to request an update\./, "a declined update must keep the earlier-facts indicator and point to the normal conversation path");
assert.match(workspace, /Retain copy[\s\S]*Open current[\s\S]*Rebase draft/, "proposal conflicts must offer recoverable choices");
assert.match(workspace, /draftResult\.proposal_path[\s\S]*submittedArtifact\.current[\s\S]*Retain copy/, "a returned draft conflict must keep recovery choices beside its saved proposal");
assert.match(frameStyles, /@media \(max-width: 760px\)/, "the layout must have a 390px-safe small-screen rule");
assert.match(frameStyles, /@media \(max-width: 900px\)[\s\S]*?\.draft-workspace__conversation[\s\S]*?position: static;[\s\S]*?max-height: none;[\s\S]*?overflow: visible;/, "narrow reading views must keep the one conversation in normal flow instead of overlaying the question");
assert.match(types, /onKeepPreview[\s\S]*onUpdateOfferAction[\s\S]*onResolveDraftConflict/, "the draft layout must use the shared explicit action callbacks");

const React = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const ts = await import("typescript");
class ActionTracker {
  setMatter() {}
  begin() { return 1; }
  isCurrent() { return true; }
}
const iconModule = { exports: {} };
const iconSource = await readFile(new URL("../components/workspace/MatterIcon.tsx", import.meta.url), "utf8");
runInNewContext(ts.transpileModule(iconSource, { fileName: "MatterIcon.tsx", compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React } }).outputText, { React, exports: iconModule.exports });
const renderedModule = { exports: {} as { default: (props: Record<string, unknown>) => React.ReactElement } };
const renderedSource = workspace
  .replace('import { useEffect, useRef, useState } from "react";', "const { useEffect, useRef, useState } = React;")
  .replace(/import \{ canPersistWorkspaceDraftingPreferences,[\s\S]*? \} from "@\/lib\/workspaceDrafting";/, "const { canPersistWorkspaceDraftingPreferences, matchingLocalEditorSnapshot, newWorkspaceDraftActionKey, readWorkspaceDraftingPreferences, restoredOutputTemplate, reusableWorkspaceDraftActionKey, shouldOpenCompletedDraft, WorkspaceDraftingActionTracker, workspaceDraftRequestFingerprint, writeWorkspaceDraftingPreferences } = workspaceDrafting;")
  .replace(/import type \{[^;]+;\n/, "")
  .replace("<style jsx>{", "<style>{");
runInNewContext(ts.transpileModule(renderedSource, { fileName: "DraftWorkspace.tsx", compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React } }).outputText, {
  React, exports: renderedModule.exports, require: (name: string) => { if (name === "./MatterIcon") return iconModule.exports; assert.ok(name.endsWith(".module.css")); return { default: {} }; },
  workspaceDrafting: {
    canPersistWorkspaceDraftingPreferences: () => false, matchingLocalEditorSnapshot: () => null, newWorkspaceDraftActionKey: () => "draft:1", readWorkspaceDraftingPreferences: () => ({}), restoredOutputTemplate: () => null, reusableWorkspaceDraftActionKey: () => "draft:1", shouldOpenCompletedDraft: () => false, WorkspaceDraftingActionTracker: ActionTracker, workspaceDraftRequestFingerprint: () => "", writeWorkspaceDraftingPreferences: () => {},
  },
});
const declinedHtml = renderToStaticMarkup(React.createElement(renderedModule.exports.default, {
  matterId: "M-1", view: "draft", onViewChange: () => {}, understand: null, conversation: null, editor: null,
  artifacts: [{ work_product_id: "WP-1", path: "work/memo.md", title: "Memo", revision: "content-v1", update_offer: { offer_id: "offer-1", artifact_path: "work/memo.md", base_revision: "content-v1", reason: "Reported timing changed", state: "declined" } }],
  activeArtifactPath: "work/memo.md", onSelectArtifact: () => {}, editorSnapshot: null, templates: [], selectedTemplateId: null, onSelectTemplate: () => {}, onOpenTemplates: () => {}, onPreviewTemplate: async () => ({ state: "failed" }), onDraft: async () => ({ state: "failed" }),
}));
assert.match(declinedHtml, /Earlier facts · Draft retained[\s\S]*Ask in the conversation to request an update\./, "a rendered declined artifact must preserve the earlier-facts state");
assert.doesNotMatch(declinedHtml, /Accept update|Decline update|Update offer/, "a rendered declined artifact must not offer a repeat acceptance or decline action");

console.log("Workspace drafting checks passed.");
