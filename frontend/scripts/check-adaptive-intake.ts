import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { choiceNeedsDetail, effectiveQuestionMode, groupedAnswerText, legacyQuestionModeStorageKey, questionModeStorageKey, questionProgressLabel } from "../lib/chatCardLogic.ts";

assert.equal(questionProgressLabel(), "Follow-up");
assert.equal(questionProgressLabel(1, null), "Follow-up");
assert.equal(questionProgressLabel(2, 1), "Follow-up");
assert.equal(questionProgressLabel(2, 4), "2 of 4");

assert.equal(choiceNeedsDetail("partly", "Partly"), true);
assert.equal(choiceNeedsDetail("change", "Something else"), true);
assert.equal(choiceNeedsDetail("custom", "Other arrangement"), true);
assert.equal(choiceNeedsDetail("yes", "Yes"), false);
assert.equal(effectiveQuestionMode("single", 0), "free_text");
assert.equal(effectiveQuestionMode("multiple", 0), "free_text");
assert.equal(effectiveQuestionMode("single", 2), "single");
assert.equal(questionModeStorageKey("MAT-1"), "themis.ai:question-mode:MAT-1");
assert.equal(legacyQuestionModeStorageKey("MAT-1"), "counsel-os:question-mode:MAT-1");

const grouped = groupedAnswerText([
  { question_id: "Q-HIGH", text: "What changes the decision?", choices: [{ value: "pending", label: "Still pending" }] },
  { question_id: "Q-NEXT", text: "Who owns the filing?", choices: [] },
], {
  "Q-HIGH": { action: "answer", values: ["pending"], text: "Still pending" },
  "Q-NEXT": { action: "skip", values: [], text: "" },
});
assert.match(grouped, /What changes the decision\?\n  Still pending/);
assert.match(grouped, /Who owns the filing\?\n  Skipped/);

const cards = readFileSync(new URL("../components/ChatCards.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
assert.match(cards, /action:\s*"skip"/, "adaptive questions must allow a no-answer skip action");
assert.match(cards, /action:\s*"stop"/, "adaptive questions must allow intake to stop without an answer");
assert.match(cards, /detail \? \[\.\.\.selected, detail\] : selected/, "multiple-choice clarification must preserve added detail");
assert.match(cards, /suggested \? <span className="suggested-label">Suggested<\/span>/, "Suggested must remain a label, not a preselection");
assert.match(cards, />Guided<\/button>/, "intake questions must offer guided mode");
assert.match(cards, />Answer a set<\/button>/, "intake questions must offer grouped mode");
assert.match(cards, /action:\s*"answer_set"/, "grouped mode must send one structured answer set");
assert.match(cards, /Priority order/, "the UI must preserve and label model priority order");
assert.match(cards, /btn primary compact/, "question actions must use the standard compact primary size");
assert.doesNotMatch(cards, /matter-update-card/, "internal matter-update receipts must not interrupt the chat");
assert.match(cards, /QuestionHistoryCard/, "historical questions must use an inert renderer");
assert.match(cards, /Answered|Superseded|Stopped/, "historical questions must name their truthful state");
assert.match(styles, /\.question-choice\s*\{[^}]*justify-content:\s*flex-start/, "question choices must keep the control and answer text left-aligned");
assert.match(styles, /\.question-choice \.suggested-label\s*\{[^}]*margin-left:\s*auto/, "the Suggested badge may align right without moving the answer text");

console.log("Adaptive intake card checks passed.");
