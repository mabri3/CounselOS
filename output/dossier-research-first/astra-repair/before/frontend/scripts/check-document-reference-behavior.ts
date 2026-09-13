import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import {
  discardLocalEditorSnapshot,
  documentVersionKey,
  exactPassageRange,
  freezeDocumentTarget,
  isSafeDocumentPath,
  localEditorSnapshotStorageKey,
  mutationBasisForSnapshot,
  readLocalEditorSnapshot,
  recoverableLocalEditorSnapshot,
  referenceOpenMode,
  resolveDocumentReference,
  sameDocumentTarget,
  snapshotForDocument,
  writeLocalEditorSnapshot,
} from "../lib/documentNavigation.ts";
import { freezeWorkspaceDocumentAction, isFrozenWorkspaceDocumentActionCurrent, matchingLocalEditorSnapshot } from "../lib/workspaceDrafting.ts";
import type { DocumentIdentity, LocalEditorSnapshot } from "../lib/workspaceTypes.ts";

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

const draft: DocumentIdentity = { document_id: "WP-LAUNCH", path: "MAT/work-product/draft/launch.md", title: "Launch reply", kind: "work_product", revision: "draft-r2", lifecycle_state: "editing_draft", editable: true, immutable: false };
const final: DocumentIdentity = { ...draft, path: "MAT/work-product/final/launch.md", revision: "final-r1", version_id: "v1", lifecycle_state: "final", editable: false, immutable: true };
const duplicateSource: DocumentIdentity = { document_id: "SRC-SECOND", path: "MAT/documents/other/launch.md", title: "launch.md", kind: "source", revision: "source-r1", lifecycle_state: "reading_source", editable: false, immutable: true };

assert.notEqual(documentVersionKey(draft), documentVersionKey(final), "one stable work-product ID must still distinguish its draft and final versions");
assert.equal(resolveDocumentReference([draft, final, duplicateSource], { document_id: "WP-LAUNCH", path: final.path, revision: "final-r1" }).document?.path, final.path, "a historical reference must keep its exact path and revision");
assert.equal(resolveDocumentReference([draft, final, duplicateSource], { document_id: "WP-LAUNCH", path: final.path, revision: "missing" }).passage_state, "missing", "a missing revision cannot fall back to another version with the same stable ID");
assert.equal(resolveDocumentReference([draft, duplicateSource], { document_id: "WP-LAUNCH", path: duplicateSource.path }).passage_state, "missing", "a duplicate file name or path cannot replace the supplied document ID");
assert.equal(isSafeDocumentPath("MAT/documents/source.md"), true);
for (const unsafe of ["../source.md", "/tmp/source.md", "MAT/../source.md", "MAT\\source.md"]) {
  assert.equal(resolveDocumentReference([duplicateSource], { document_id: duplicateSource.document_id, path: unsafe }).message, "Unsafe reference path blocked.");
}

const storage = new MemoryStorage();
const localEdit: LocalEditorSnapshot = { document_id: draft.document_id, path: draft.path, content: "Local draft text", base_revision: "draft-r2", review_revision: "review-r3", dirty: true, selected_range: { start: 0, end: 5, text: "Local" } };
writeLocalEditorSnapshot(storage, "MAT-1", localEdit);
assert.deepEqual(readLocalEditorSnapshot(storage, "MAT-1", draft.document_id), { ...localEdit, recoverable: false, updated_at: null }, "a local edit must survive remount under its matter and stable document ID");
assert.equal(readLocalEditorSnapshot(storage, "MAT-2", draft.document_id), null, "a matter cannot restore another matter's local edit");
assert.equal(snapshotForDocument(draft, localEdit)?.content, "Local draft text");
assert.equal(snapshotForDocument(final, localEdit), null, "viewing a final with the same stable ID must not apply the draft-path snapshot");
assert.equal(matchingLocalEditorSnapshot(draft.path, localEdit, draft.document_id)?.content, "Local draft text");
assert.equal(matchingLocalEditorSnapshot(draft.path, localEdit, "WP-OTHER"), null, "draft generation cannot use a same-path snapshot from another identity");
const closed = recoverableLocalEditorSnapshot(localEdit, "2026-09-05T12:00:00Z");
assert.equal(closed.recoverable, true, "closing a dirty tab must keep an explicit recoverable state");
assert.equal(closed.dirty, true, "closing does not silently save or discard");
const staleSavedEdit = { ...localEdit, base_revision: "server-r1", review_revision: "review-r1", content: "Unsaved text from r1" };
writeLocalEditorSnapshot(storage, "MAT-1", staleSavedEdit);
const latestServer = { artifact_revision: "server-r2", review_revision: "review-r2" };
const submittedBasis = mutationBasisForSnapshot(staleSavedEdit);
assert.deepEqual(submittedBasis, { expected_revision: "server-r1", expected_review_revision: "review-r1" }, "a recovered r1 edit must submit against r1 even after the server loads r2");
assert.notEqual(submittedBasis.expected_revision, latestServer.artifact_revision, "loading r2 must not silently rebase the recovered edit");
let conflict = false;
try {
  if (submittedBasis.expected_revision !== latestServer.artifact_revision) throw new Error("revision_conflict");
} catch { conflict = true; }
assert.equal(conflict, true, "the stale recovered save must conflict instead of overwriting r2");
assert.equal(readLocalEditorSnapshot(storage, "MAT-1", draft.document_id)?.content, "Unsaved text from r1", "the local r1 text must remain after the stale save conflict");
discardLocalEditorSnapshot(storage, "MAT-1", draft.document_id);
assert.equal(storage.getItem(localEditorSnapshotStorageKey("MAT-1", draft.document_id)), null, "discard is a separate explicit deletion");

const frozen = freezeDocumentTarget(draft);
assert.equal(sameDocumentTarget(frozen, draft), true);
assert.equal(sameDocumentTarget(frozen, final), false, "a delayed action result cannot target a newly focused version");
assert.equal(referenceOpenMode(duplicateSource, true), "preview", "a source opened during drafting uses the separate reference preview");
assert.equal(referenceOpenMode(draft, true), "tab", "a work product opens in the editor tabs");
assert.deepEqual(exactPassageRange("Before exact saved passage after", { exact_passage_available: true, available_excerpt: "exact saved passage" }), { start: 7, end: 26 });
const farDownPrefix = Array.from({ length: 400 }, (_, index) => `Background line ${index}: saved source context.`).join("\n");
const farDownContent = `${farDownPrefix}\nUnique cited passage near the end.\nClosing text.`;
const farDownRange = exactPassageRange(farDownContent, { exact_passage_available: true, available_excerpt: "Unique cited passage near the end." });
assert.ok(farDownRange && farDownRange.start > 10_000, "an exact passage far below the first reading viewport must retain its real document offset");
assert.equal(exactPassageRange("Passage changed", { exact_passage_available: true, available_excerpt: "old passage" }), null, "a stale locator cannot invent a highlight");
assert.deepEqual(exactPassageRange("# Rule 16 CFR 312.2 applies", { exact_passage_available: true, locator: "16 CFR 312.2" }), { start: 7, end: 19 }, "a unique literal saved locator may identify the exact position");
assert.equal(exactPassageRange("Rule 1 then Rule 1", { exact_passage_available: true, locator: "Rule 1" }), null, "an ambiguous locator cannot invent which passage was cited");
assert.equal(exactPassageRange("Repeated excerpt then Repeated excerpt", { exact_passage_available: true, available_excerpt: "Repeated excerpt" }), null, "an ambiguous saved excerpt cannot choose or scroll to a guessed passage");
assert.equal(exactPassageRange(farDownContent, { exact_passage_available: false, available_excerpt: "Unique cited passage near the end." }), null, "a source without an exact-passage result cannot highlight or scroll to an excerpt");

const action = freezeWorkspaceDocumentAction("MAT-1", draft.document_id, draft.path, draft.revision, "review-r3");
assert.equal(isFrozenWorkspaceDocumentActionCurrent(action, "MAT-1", draft.document_id, draft.path, draft.revision), true);
assert.equal(isFrozenWorkspaceDocumentActionCurrent(action, "MAT-1", duplicateSource.document_id, duplicateSource.path, duplicateSource.revision), false, "source focus cannot retarget a draft action");

const [panelSource, previewSource, scenarioSource, filesSource] = await Promise.all([
  readFile(new URL("../components/DocumentPanel.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/ReferencePreview.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/ScenarioPanel.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/MatterFilesPanel.tsx", import.meta.url), "utf8"),
]);

const scenarioAst = ts.createSourceFile("ScenarioPanel.tsx", scenarioSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const scenarioFunctions = new Map<string, string>();
function collectScenarioFunctions(node: ts.Node) {
  if (ts.isFunctionDeclaration(node) && node.name) scenarioFunctions.set(node.name.text, node.getText(scenarioAst));
  ts.forEachChild(node, collectScenarioFunctions);
}
collectScenarioFunctions(scenarioAst);
const scenarioModule = { exports: {} as Record<string, unknown> };
runInNewContext(ts.transpileModule(
  `${scenarioFunctions.get("scenarioFactChanges")}\nexport ${scenarioFunctions.get("runScenarioAnalysis")}\nexport ${scenarioFunctions.get("hasScenarioCitations")}`,
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText, { exports: scenarioModule.exports });
const hasScenarioCitations = scenarioModule.exports.hasScenarioCitations as (ids: string[], claims: unknown[]) => boolean;
assert.equal(hasScenarioCitations(["known"], [{ claim_id: "known", evidence: [] }]), false, "known unsupported claim keeps citation gap");
assert.equal(hasScenarioCitations(["known"], [{ claim_id: "known", evidence: [{ available_excerpt: "actual passage", source_id: "source", path: "source.md" }] }]), true, "saved passage remains checkable");
assert.equal(hasScenarioCitations(["known"], [{ claim_id: "known", evidence: [] }, { claim_id: "known", evidence: [] }]), false, "ambiguous revisions do not imply citation support");
const runScenarioAnalysis = scenarioModule.exports.runScenarioAnalysis as (input: Record<string, unknown>) => Promise<{ target: { scenario_id: string }; result: { state: string } }>;
const originalScenario = { scenario_id: "SCN-OLD", title: "Saved old scenario", revision: "old-r1", baseline_revisions: { "facts.md": "facts-r1" }, proposed_fact_changes: [{ change_id: "old-change", fact_id: "FACT-1", text: "Old value" }] };
const originalBefore = structuredClone(originalScenario);
const createdScenario = { scenario_id: "SCN-NEW", title: "Working scenario", revision: "new-r1", baseline_revisions: { "facts.md": "facts-r2" }, proposed_fact_changes: [{ change_id: "new-change", fact_id: "FACT-1", text: "New value" }] };
let createCommand: Record<string, unknown> | null = null;
let analyzedScenarioId = "";
let selectedAfterCreate = "";
await runScenarioAnalysis({
  selected: originalScenario,
  createNew: true,
  changesText: "New value",
  hypotheticalFactId: "FACT-1",
  currentRevisions: { "facts.md": "facts-r2" },
  facts: [{ fact_id: "FACT-1", text: "Original fact" }],
  initialIssueId: "ISS-1",
  instruction: "Analyze the new value",
  getCreateSourceKey: () => "create-new-key",
  getAnalysisSourceKey: () => "analyze-new-key",
  onCreate: async (command: Record<string, unknown>) => { createCommand = command; return createdScenario; },
  onAnalyze: async (scenarioId: string) => { analyzedScenarioId = scenarioId; return { state: "saved" }; },
  onSelect: (scenarioId: string) => { selectedAfterCreate = scenarioId; },
});
const createdChanges = (createCommand as { proposed_fact_changes: Array<{ fact_id: string; text: string }> }).proposed_fact_changes;
assert.equal(createdChanges.length, 1, "new-scenario mode must create one change for the newly entered value");
assert.equal(createdChanges[0].fact_id, "FACT-1", "the new baseline must keep the selected fact identity");
assert.equal(createdChanges[0].text, "New value", "the new baseline must use the newly entered hypothetical value");
assert.equal(analyzedScenarioId, "SCN-NEW", "analysis must target the ID returned by new baseline creation instead of the previously selected scenario");
assert.equal(selectedAfterCreate, "SCN-NEW", "the returned new baseline must become the selected scenario");
assert.deepEqual(originalScenario, originalBefore, "starting a different assumption must not change the original saved scenario");

assert.match(panelSource, /recoverableLocalEditorSnapshot/, "dirty close must report a recoverable snapshot");
assert.match(panelSource, /mutationBasisForSnapshot\(restored\)/, "a recovered edit must keep its original mutation revisions");
assert.match(panelSource, /expected_revision: frozenBasis\.base_revision/, "save and review mutations must use the frozen snapshot basis");
assert.match(panelSource, /frozenBasis\.base_revision !== latestBaseRevision/, "a stale recovered edit must be blocked before it can use the latest server revision");
assert.match(panelSource, /savedRevision !== submittedIdentity\.revision[\s\S]*onSaved\?\.\(\{ \.\.\.submittedIdentity, revision: savedRevision \}\)[\s\S]*else onSaved\?\.\(\)/, "save completion must report a proven new identity revision or ask the parent to refresh");
assert.match(panelSource, /onAskAgent\(actionTargetDocumentId \?\? activeIdentity\?\.document_id\)/, "agent rewrite must name the frozen document identity");
assert.match(panelSource, /const submitted = \{ path: document\.path, document_id:/, "export must freeze its path before an awaited save");
assert.match(panelSource, /activeIdentity\?\.immutable/, "final and approved identities must remain read-only");
assert.match(previewSource, /const path = document\?\.path/, "reference preview must load the resolver's exact document version path");
assert.match(previewSource, /getFile\(path\)/, "reference preview must load the resolved saved path");
assert.match(previewSource, /const actualPath = document\?\.path \?\? target\.path/, "reference metadata must prefer the resolver's actual saved path over the requested path");
assert.match(previewSource, /Requested revision:/, "an unavailable or mismatched requested revision must remain explicit");
assert.match(previewSource, /ref=\{readingArea\}/, "the bounded source reading area must be addressable after content renders");
assert.match(previewSource, /<mark ref=\{passageMark\}>/, "only the uniquely matched exact passage may become the scroll target");
assert.match(previewSource, /area\.scrollTop = Math\.max\(0, centeredTop\)/, "a far-down exact passage must scroll the bounded reading area to its real rendered position");
assert.doesNotMatch(previewSource, /scrollIntoView/, "passage opening must not scroll the whole page through nested scroll containers");
assert.match(previewSource, /Exact passage unavailable/, "missing exact text must remain explicit");
assert.match(previewSource, /Use in this request/, "reading and agent context require separate actions");
assert.match(filesSource, /onOpenReference\(matterFileReferenceTarget\(file, path\)\)/, "source files must use reference-preview routing when connected");
assert.match(scenarioSource, /Working scenario —/, "Analyze must create a temporary baseline when no saved scenario is selected");
assert.match(scenarioSource, /const selectedForAnalysis = creating \? null : selected/, "the open new-assumption form must not reuse a previously selected saved scenario");
assert.match(scenarioSource, /onClick=\{toggleNewScenario\}/, "Try a different assumption must use the explicit new-scenario selection reset");
assert.match(scenarioSource, /if \(initialFactId === undefined\) return;[\s\S]*onSelect\(null\)/, "a new map launch intent must reset a mounted panel to new-scenario mode");
assert.doesNotMatch(scenarioSource, /setChangesText\(""\)|setAnalysisInstruction\(""\)/, "a failed scenario run must retain the entered hypothetical value and analysis question for retry");
assert.match(scenarioSource, /expected_scenario_revision: target\.revision/, "scenario analysis must freeze the saved scenario revision");
assert.match(scenarioSource, /onSaveScenario\(selected, title\.trim\(\), selected\.revision/, "named scenario saving must use an expected revision");
assert.match(scenarioSource, /change_ids: selectedChanges/, "adoption must submit only explicitly selected fact changes");
assert.match(scenarioSource, /Hypothetical · Agent analysis/, "scenario output must state that it is hypothetical agent analysis");
assert.match(scenarioSource, /A failed attempt does not remove an earlier result/, "failed analysis must keep useful prior output visible");

console.log("Document reference, per-document recovery, frozen action, and scenario interaction checks passed.");
