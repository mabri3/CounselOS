import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import {
  actionOwnerText,
  actionStateWord,
  canCompareSuppliedSource,
  canRequestFact,
  isOpenableWorkTarget,
  orientationAnswer,
  previewOrientationQuestion,
  visibleOrientationActions,
  visibleRecapChanges,
} from "../lib/orientationPresentation.ts";
import type { MeaningfulChange, Orientation } from "../lib/continuityTypes.ts";

const understandSource = readFileSync(new URL("../components/workspace/UnderstandPanel.tsx", import.meta.url), "utf8");
const understandModule = { exports: {} as { longAnswerPreview?: (answer: string) => { text: string; earlierText?: string } } };
runInNewContext(ts.transpileModule(understandSource, {
  fileName: "UnderstandPanel.tsx",
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, { exports: understandModule.exports, require: () => ({}) });
const savedAnswerPreview = understandModule.exports.longAnswerPreview!;

const qualification = "Production use is prohibited until the product owner confirms the audit trail and retention settings. ";
const qualifiedAnswer = `${qualification.repeat(14)}\n\nCurrent answer\n\nThe saved assessment applies only after that confirmation. ${"The supplied source remains controlling. ".repeat(24)}`;
const qualifiedPreview = savedAnswerPreview(qualifiedAnswer);
assert.match(qualifiedPreview.text, /^Current answer\n\nThe saved assessment applies/, "the compact preview must start at the saved Current answer heading");
assert.equal(qualifiedPreview.earlierText, qualification.repeat(14).trim(), "a leading qualification must remain visible below the compact answer");

const fencedAnswer = `${qualification.repeat(14)}\n\n\`\`\`text\nCurrent answer\n\`\`\`\n\n${"The answer remains in source order. ".repeat(24)}`;
const fencedPreview = savedAnswerPreview(fencedAnswer);
assert.equal(fencedPreview.text, fencedAnswer, "a fenced unknown format must keep the prior complete-answer fallback");
assert.equal(fencedPreview.earlierText, undefined, "a heading in fenced content must not reorder the answer");

const harborEvidence = JSON.parse(readFileSync(new URL("../../output/lawyer-workflow-expansion-acceptance/journey-jordan-review-selected.json", import.meta.url), "utf8")) as { text: string };
const harborStart = harborEvidence.text.indexOf("I now have the full picture.");
const harborEnd = harborEvidence.text.indexOf("\n\nThis saved answer starts with one long Markdown block.", harborStart);
assert.ok(harborStart >= 0 && harborEnd > harborStart, "Harbor saved-answer evidence must be present");
const harborPreview = savedAnswerPreview(harborEvidence.text.slice(harborStart, harborEnd));
assert.match(harborPreview.text, /^Current answer\n\nThe saved fact stands as reported:/, "Harbor preview must start with the useful saved answer");
assert.match(harborPreview.text, /What changed[\s\S]*What has not changed[\s\S]*Note on the conflict/, "Harbor preview must retain all substantive saved sections");
assert.match(harborPreview.earlierText ?? "", /^I now have the full picture\./, "Harbor leading text must remain visible under its neutral label");

const longQuestion = "Should Mosaic Relay collect identity information before it enables Instant Payouts for marketplace sellers, given its planned ACH and USDC payout flow?";
assert.equal(previewOrientationQuestion(longQuestion, 62), "Should Mosaic Relay collect identity information before it…");
assert.equal(previewOrientationQuestion("  A saved   question \n with spaces "), "A saved question with spaces");

const legacyOrientation: Orientation = {
  matter_id: "MAT-1",
  basis_revision: "basis-1",
  question_text: longQuestion,
  question_preview: previewOrientationQuestion(longQuestion),
  question_is_preview: true,
  answer: "Saved advice with the qualification that the bank agreement was not supplied.",
  answer_path: "conversations/CONV-1.md",
  answer_label: "Saved conversation advice",
  answer_state: "stale",
  caveats: ["The advice uses an earlier business question.", "The bank agreement was not supplied."],
  primary_action: {
    action_id: "WI-1",
    label: "Review identity collection",
    reason: "The saved design defers identity collection.",
    state: "ready",
    target: { matter_id: "MAT-1", kind: "work_item", target_id: "WI-1", view: "understand" },
    owner_name: "Alex Morgan",
    actor_kind: "lawyer",
  },
  secondary_actions: [
    { action_id: "Q-1", label: "Open question", reason: "A fact is still open.", state: "waiting", target: { matter_id: "MAT-1", kind: "question", target_id: "Q-1" }, actor_kind: "business" },
    { action_id: "RUN-1", label: "View research", reason: "Research is running.", state: "running", target: { matter_id: "MAT-1", kind: "run", target_id: "RUN-1" }, actor_kind: "agent" },
    { action_id: "EXTRA", label: "Hidden extra", reason: "Must not be in the default action budget.", state: "ready", target: { matter_id: "MAT-1", kind: "matter", target_id: "MAT-1" } },
  ],
  current_revision: "recap-1",
};

const selectedAdvice = orientationAnswer(legacyOrientation);
assert.equal(selectedAdvice.text, legacyOrientation.answer, "saved advice must remain verbatim for the reading surface");
assert.equal(selectedAdvice.path, "conversations/CONV-1.md");
assert.equal(selectedAdvice.state, "stale");
assert.deepEqual(legacyOrientation.caveats, ["The advice uses an earlier business question.", "The bank agreement was not supplied."], "all caveats remain available to the presentation");

const fallbackAdvice = orientationAnswer({ ...legacyOrientation, answer: "", answer_state: "unavailable" }, "A useful snapshot answer.");
assert.equal(fallbackAdvice.text, "A useful snapshot answer.");
assert.equal(orientationAnswer({ ...legacyOrientation, answer: "", answer_state: "unavailable" }).state, "unavailable");

const longAdvice = `${"Useful analysis. ".repeat(130)}Qualification: the bank agreement was not supplied.`;
const longOrientation = { ...legacyOrientation, answer: longAdvice, caveats: ["The answer uses an earlier business question.", "The bank agreement was not supplied."] };
assert.equal(orientationAnswer(longOrientation).text, longAdvice, "the complete saved answer remains available when its reading preview is collapsed");
assert.deepEqual(longOrientation.caveats, ["The answer uses an earlier business question.", "The bank agreement was not supplied."], "material qualifications remain separately visible before the full answer is opened");

const actions = visibleOrientationActions(legacyOrientation);
assert.equal(actions.primary?.action_id, "WI-1");
assert.deepEqual(actions.secondary.map(action => action.action_id), ["Q-1", "RUN-1"], "the default orientation exposes no more than two secondary actions");
assert.equal(actionStateWord(actions.secondary[1]), "Agent work");
assert.equal(actionOwnerText(actions.primary!), "For Alex Morgan");
assert.equal(actionOwnerText(actions.secondary[0]), "Waiting on the business");
assert.equal(actionOwnerText(actions.secondary[1]), "Themis.ai is working");
assert.equal(isOpenableWorkTarget({ matter_id: "MAT-1", kind: "artifact", path: "research/packet.md" }), true, "an artifact path is enough to open saved evidence");
assert.equal(isOpenableWorkTarget({ matter_id: "MAT-1", kind: "artifact" }), false, "a target needs an ID or a path");
assert.equal(canRequestFact("open"), true);
assert.equal(canRequestFact("left_open"), true);
assert.equal(canRequestFact("answered"), false, "a recorded answer does not offer a duplicate fact request");
assert.equal(canCompareSuppliedSource("supplied"), true);
assert.equal(canCompareSuppliedSource("retrieved"), false, "only an explicitly supplied source offers comparison");

const changes: MeaningfulChange[] = Array.from({ length: 4 }, (_, index) => ({
  change_id: `change-${index + 1}`,
  title: `Saved change ${index + 1}`,
  detail: "A durable record changed.",
  basis: "saved_receipt",
}));
assert.deepEqual(visibleRecapChanges(changes, false).map(change => change.change_id), ["change-1", "change-2", "change-3"]);
assert.equal(visibleRecapChanges(changes, true).length, 4);

console.log("Orientation presentation checks passed.");
