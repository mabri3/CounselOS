import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as impactPresentation from "../lib/impactPresentation.ts";
import {
  differencePresentation,
  findingSupportLabel,
  findingPassageEvidence,
  frozenImpactCommand,
  impactAnalysisScope,
  impactContextChanged,
  impactOffer,
  impactRetryDraftKey,
  impactState,
  passageEvidence,
  passagesForFinding,
  selectedReferenceIds,
  selectedReferences,
  targetForFinding,
} from "../lib/impactPresentation.ts";
import type { ChangeImpactPanelProps, SpecComparison } from "../lib/continuityTypes.ts";

const changeImpactPanel = readFileSync(new URL("../components/workspace/ChangeImpactPanel.tsx", import.meta.url), "utf8");
const panelCompilation = ts.transpileModule(changeImpactPanel, {
  fileName: "ChangeImpactPanel.tsx",
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  reportDiagnostics: true,
});
assert.equal(panelCompilation.diagnostics?.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error).length, 0, "Change impact presentation must transpile");
assert.ok(changeImpactPanel.indexOf('aria-label="Saved comparisons"') < changeImpactPanel.indexOf('<details className="impact-prepare"'), "saved comparisons must appear before creation controls");
assert.match(changeImpactPanel, /open=\{!props\.comparisons\.length\}/, "creation controls collapse when saved comparisons exist");
assert.match(changeImpactPanel, /ReactMarkdown components=\{impactMarkdownComponents\}[\s\S]*\{comparison\.analysis\}/, "effect summaries must render saved Markdown");
assert.match(changeImpactPanel, /To assess a future draft, use Draft to create it\./, "the no-draft state must explain how to prepare a later comparison");

const comparison: SpecComparison = {
  comparison_id: "CMP-1", matter_id: "MAT-1", path: "continuity/impacts/CMP-1.md", revision: "cmp-r1",
  actor: { person_id: "alex", display_name: "Alex Morgan", mode: "demo" }, source_action_key: "compare:1",
  before: { reference_id: "SRC-old", source_id: "SRC-1", kind: "source", title: "Policy v1", path: "sources/policy-v1.md", revision: "old-r1", content_hash: "old-hash", text: "Retain for 30 days." },
  after: { reference_id: "SRC-new", source_id: "SRC-1", kind: "source", title: "Policy v2", path: "sources/policy-v2.md", revision: "new-r1", content_hash: "new-hash", text: "Retain for 60 days." },
  targets: [
    { reference_id: "ADV-1", kind: "advice", title: "Earlier advice", path: "conversations/advice.md", revision: "adv-r1", content_hash: "adv-hash", text: "Use 30 days." },
    { reference_id: "DRAFT-1", kind: "draft", title: "Retention memo", path: "work-product/draft/memo.md", revision: "draft-r1", content_hash: "draft-hash", text: "Use a 30-day period." },
  ],
  question: { reference_id: "Q-1", kind: "question", title: "Business question", path: "workspace.md", revision: "q-r1", content_hash: "q-hash", text: "Can we publish?" },
  baseline_revisions: { question: "q-r1" }, state: "partial", difference: "text_changed",
  passages: [{ passage_id: "P-1", kind: "changed", before_text: "Retain for 30 days.", after_text: "Retain for 60 days.", before_locator: "Line 4", after_locator: "Line 4" }],
  analysis: "The earlier advice may need review because the stated period changed.",
  findings: [{ finding_id: "F-1", target_id: "ADV-1", effect: "may_need_review", explanation: "The period changed.", support: "linked", passage_ids: ["P-1"], affected_section: "Recommendation" }],
  coverage_limits: ["No external research was performed."], created_at: "2026-09-05T12:00:00Z", offer_ids: ["OFF-1"],
};

const React = await import("react");
const { renderToStaticMarkup } = await import("react-dom/server");
const localRequire = createRequire(import.meta.url);
const panelModule = { exports: {} as { default?: React.ComponentType<ChangeImpactPanelProps> } };
runInNewContext(panelCompilation.outputText, {
  exports: panelModule.exports,
  require: (id: string) => {
    if (id === "react" || id === "react/jsx-runtime") return localRequire(id);
    if (id === "react-markdown") return { __esModule: true, default: ({ children }: { children?: React.ReactNode }) => React.createElement("div", { "data-markdown": "rendered" }, children) };
    if (id === "remark-gfm") return { __esModule: true, default: () => {} };
    if (id === "@/lib/impactPresentation") return impactPresentation;
    return {};
  },
});
const proseDraftComparison: SpecComparison = { ...comparison, state: "complete", analysis: "## Effect summary\n\nThe selected draft needs review.", findings: [], offer_ids: [] };
const panelProps: ChangeImpactPanelProps = {
  contextKey: "test:alex:MAT-1", drafts: {}, onDraftChange: () => {}, busy: false, error: null,
  updateOffers: [], sources: [], targets: [], comparisons: [proseDraftComparison], selectedComparisonId: proseDraftComparison.comparison_id, businessQuestionRevision: "q-r1",
  onSelectComparison: () => {}, onPrepare: async () => proseDraftComparison, onAnalyze: async () => ({ state: "completed", run_id: "RUN-1" }), onRequestUpdate: async () => ({ state: "completed", run_id: "RUN-2" }), onOfferAction: async () => {}, onOpenTarget: () => {}, onOpenEvidence: () => {},
};
const proseDraftMarkup = renderToStaticMarkup(React.createElement(panelModule.exports.default!, panelProps));
assert.equal((proseDraftMarkup.match(/Request draft update/g) ?? []).length, 1, "a prose-only comparison exposes one draft-update action for its frozen draft");
assert.match(proseDraftMarkup, /Update selected drafts/, "draft updates are listed outside structured findings");

const repeatedFindingMarkup = renderToStaticMarkup(React.createElement(panelModule.exports.default!, { ...panelProps, comparisons: [{ ...proseDraftComparison, findings: [
  { finding_id: "F-DRAFT-1", target_id: "DRAFT-1", effect: "may_need_review", explanation: "First draft section needs review.", support: "linked" },
  { finding_id: "F-DRAFT-2", target_id: "DRAFT-1", effect: "changes", explanation: "Second draft section needs review.", support: "linked" },
] }] }));
assert.equal((repeatedFindingMarkup.match(/Request draft update/g) ?? []).length, 1, "multiple findings for one frozen draft must not duplicate its update action");

const declinedOffer = { offer_id: "OFF-1", artifact_path: "work-product/draft/memo.md", base_revision: "draft-r1", reason: "Impact changed", state: "declined" as const };
const staleMarkup = renderToStaticMarkup(React.createElement(panelModule.exports.default!, { ...panelProps, comparisons: [{ ...proseDraftComparison, state: "stale", offer_ids: [declinedOffer.offer_id] }], updateOffers: [declinedOffer] }));
assert.equal((staleMarkup.match(/Request draft update/g) ?? []).length, 1, "a stale comparison still has one visible draft action");
assert.match(staleMarkup, /Request draft update<\/button>/, "the stale action remains explicitly labelled");
assert.match(staleMarkup, /disabled=""/, "the stale draft action remains disabled");
assert.match(staleMarkup, /Declined · Existing draft retained/, "a declined offer remains retained and does not repeat an offer");

assert.equal(impactState(comparison).word, "Partial");
assert.equal(impactAnalysisScope([]).word, "Source-only scope");
assert.match(impactAnalysisScope([]).detail, /No earlier advice/);
assert.equal(impactAnalysisScope(comparison.targets).word, "Selected work");
assert.equal(impactContextChanged("vault-a:alex:MAT-1", "vault-a:jordan:MAT-1"), true, "a person context change resets only local view state");
assert.equal(impactContextChanged("vault-a:alex:MAT-1", "vault-a:alex:MAT-1"), false);
const beforeMissing = impactState({ ...comparison, before: null, state: "unavailable", difference: "unavailable" });
assert.equal(beforeMissing.tone, "quiet", "missing text is not styled as a system failure");
assert.match(beforeMissing.detail, /earlier source was not supplied/);
assert.doesNotMatch(beforeMissing.detail, /current source text is unavailable/);
const afterFailed = impactState({ ...comparison, after: { ...comparison.after, text: "", extraction_state: "failed" }, state: "unavailable", difference: "unavailable" });
assert.match(afterFailed.detail, /current source text is unavailable/);
assert.doesNotMatch(afterFailed.detail, /earlier source was not supplied/);
const bothUnavailable = impactState({ ...comparison, before: null, after: { ...comparison.after, text: "", extraction_state: "unavailable" }, state: "unavailable", difference: "unavailable" });
assert.match(bothUnavailable.detail, /earlier source was not supplied.*current source text is unavailable/);
assert.equal(differencePresentation("unavailable").detail, "One or both required source texts are unavailable. Unavailable text is not treated as a deletion.");
assert.equal(differencePresentation("formatting_only").word, "Formatting only");
assert.match(differencePresentation("formatting_only").detail, /does not establish legal equivalence/);
assert.equal(differencePresentation("unchanged").word, "Text unchanged");
assert.match(differencePresentation("unchanged").detail, /does not decide legal effect/);
assert.equal(targetForFinding(comparison, comparison.findings![0])?.text, "Use 30 days.", "affected saved work remains exact");
assert.deepEqual(passagesForFinding(comparison, comparison.findings![0]).map((item) => item.passage_id), ["P-1"]);
assert.equal(findingSupportLabel("linked"), "Supported link");
assert.equal(findingSupportLabel("inferred"), "Possible effect");

const beforeEvidence = passageEvidence(comparison, comparison.passages![0], "before");
assert.equal(beforeEvidence.available_excerpt, "Retain for 30 days.");
assert.equal(beforeEvidence.locator, "Line 4");
assert.equal(beforeEvidence.source_version, "old-r1");
assert.equal(beforeEvidence.path, "sources/policy-v1.md");
const deletedEvidence = findingPassageEvidence(comparison, { ...comparison.passages![0], kind: "deleted", after_text: "" });
assert.equal(deletedEvidence.available_excerpt, "Retain for 30 days.", "deleted findings open the exact earlier passage");

assert.deepEqual(selectedReferenceIds('["ADV-1","DRAFT-1","ADV-1",7]'), ["ADV-1", "DRAFT-1"]);
assert.deepEqual(selectedReferenceIds("bad JSON"), []);
const candidates = [
  { reference_id: "ADV-1", kind: "advice" as const, path: "a.md", expected_revision: "1" },
  { reference_id: "DRAFT-1", kind: "draft" as const, path: "d.md", expected_revision: "2" },
];
assert.deepEqual(selectedReferences(candidates, '["DRAFT-1"]'), [candidates[1]]);

const offer = { offer_id: "OFF-1", artifact_path: "work-product/draft/memo.md", base_revision: "draft-r1", reason: "Impact changed", state: "declined" as const };
assert.equal(impactOffer(comparison, [offer], "OFF-1")?.state, "declined", "declined state remains authoritative after refresh");
assert.equal(impactOffer(comparison, [offer], "OFF-other"), null);

let created = 0;
const make = () => ({ source_action_key: `impact:${++created}`, target_id: "DRAFT-1", expected_comparison_revision: "cmp-r1", expected_artifact_revision: "draft-r1" });
const first = frozenImpactCommand("", { target_id: "DRAFT-1", comparison_id: "CMP-1" }, make);
const remounted = frozenImpactCommand(first.draft, { target_id: "DRAFT-1", comparison_id: "CMP-1" }, make);
assert.equal(remounted.command.source_action_key, first.command.source_action_key, "same intent reuses the complete command after remount");
assert.equal(remounted.reused, true);
const afterRefresh = frozenImpactCommand(first.draft, { target_id: "DRAFT-1", comparison_id: "CMP-1" }, () => ({ ...make(), expected_comparison_revision: "cmp-r2", expected_artifact_revision: "draft-r2" }));
assert.equal(afterRefresh.command.expected_comparison_revision, "cmp-r1", "automatic revision refresh retains the original retry command");
const changed = frozenImpactCommand(first.draft, { target_id: "DRAFT-2", comparison_id: "CMP-1" }, make);
assert.notEqual(changed.command.source_action_key, first.command.source_action_key, "intentional target change gets a new command");
assert.equal(impactRetryDraftKey("update:CMP-1:DRAFT-1"), "__continuity.retry.v1:impact:update:CMP-1:DRAFT-1");

console.log("Change impact presentation checks passed.");
