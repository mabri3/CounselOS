import assert from "node:assert/strict";
import {
  TEAM_VIEW_LABELS,
  factRequestStateLabel,
  handoffActions,
  handoffStateLabel,
  preparationNotice,
  receiptNotice,
  recoverRetryCommand,
  retryDraftKey,
  splitOpenQuestions,
} from "../lib/teamPresentation.ts";
import type { Handoff } from "../lib/continuityTypes.ts";

const handoff = (overrides: Partial<Handoff> = {}): Handoff => ({
  handoff_id: "HOF-1", matter_id: "MAT-1", path: "continuity/handoffs/HOF-1.md",
  sender: { person_id: "alex", display_name: "Alex Morgan", mode: "demo" },
  recipient: { person_id: "jordan", display_name: "Jordan Lee" },
  scope: { matter_id: "MAT-1", kind: "work_item", work_item_id: "WI-1", title: "Review clause", path: "work-items/WI-1.md", owner_id: "alex", owner_name: "Alex Morgan", ownership_revision: "owner-1", content_revision: "content-1", status: "open" },
  ask: "Review the termination clause.", state: "pending", revision: "handoff-1", created_at: "2026-09-05T12:00:00Z", ...overrides,
});

assert.equal(factRequestStateLabel("requested_externally"), "Requested externally");
assert.equal(factRequestStateLabel("partly_answered"), "Partly answered");
assert.equal(handoffStateLabel(undefined), "Pending");
assert.deepEqual(handoffActions(handoff(), "jordan"), ["accept", "decline"], "recipient controls a pending handoff");
assert.deepEqual(handoffActions(handoff(), "alex"), ["withdraw"], "sender can withdraw while pending");
assert.deepEqual(handoffActions(handoff({ state: "accepted" }), "jordan"), ["return"], "accepted work can be returned through a reciprocal handoff");
assert.deepEqual(handoffActions(handoff({ state: "accepted", return_handoff_id: "HOF-2" }), "jordan"), [], "do not create a second return while one is pending");
assert.deepEqual(handoffActions(handoff({ state: "declined" }), "alex"), [], "decline is terminal for this packet");
assert.deepEqual(handoffActions(handoff({ recipient: { person_id: "jordan", display_name: "Jordan Lee", specialty: "Product" } }), "jordan"), ["accept", "decline"]);
assert.deepEqual(handoffActions(handoff({ recipient: { person_id: "jordan", display_name: "Jordan Lee" } }), "jordan"), ["accept", "decline"], "specialty does not control handoff actions");

const partial = receiptNotice({ receipt_id: "R-1", source_action_key: "same-key", operation: "fact.record", target: {}, state: "not_saved", completed_parts: ["reported_fact"], failure_detail: "Question link failed." }, "unused");
assert.equal(partial.word, "Partly saved");
assert.match(partial.detail, /reported fact/);
assert.match(partial.detail, /retained for retry/);
const failed = receiptNotice({ receipt_id: "R-2", source_action_key: "same-key", operation: "fact.record", target: {}, state: "not_saved", completed_parts: [], failure_detail: "Nothing was written." }, "unused");
assert.equal(failed.word, "Not saved");
assert.doesNotMatch(failed.detail, /Saved:/);
assert.deepEqual(splitOpenQuestions(" First?\n\n Second? \n"), ["First?", "Second?"]);
assert.deepEqual(Object.values(TEAM_VIEW_LABELS), ["My work", "Waiting on others", "Team"]);

type RecordAnswerCommand = {
  expected_revision: string;
  expected_question_revision: string;
  answer_text: string;
  source_action_key: string;
};
const intent = { request_id: "FR-1", reply_id: "REP-1", answer_text: "The launch is limited to adults." };
let created = 0;
const first = recoverRetryCommand<RecordAnswerCommand>(undefined, intent, {
  expected_revision: "request-revision-1",
  expected_question_revision: "question-revision-1",
  answer_text: intent.answer_text,
}, () => `answer-key-${++created}`);
const parentDrafts = new Map([[retryDraftKey("fact-request", "answer-record:FR-1:REP-1"), first.serialized]]);
const saveAttempts = [first.command.source_action_key];

// Simulate a refresh and remount after only the canonical fact saved. Automatic
// revision changes must not alter the frozen retry target or create a second fact.
const remounted = recoverRetryCommand<RecordAnswerCommand>(parentDrafts.get(retryDraftKey("fact-request", "answer-record:FR-1:REP-1")), intent, {
  expected_revision: "request-revision-2",
  expected_question_revision: "question-revision-2",
  answer_text: intent.answer_text,
}, () => `answer-key-${++created}`);
saveAttempts.push(remounted.command.source_action_key);
assert.equal(remounted.reused, true);
assert.deepEqual(remounted.command, first.command, "refresh/remount keeps the full failed command and its old target revisions");
assert.equal(new Set(saveAttempts).size, 1, "retry uses one durable action key, so it cannot create a duplicate fact");

const changed = recoverRetryCommand<RecordAnswerCommand>(remounted.serialized, { ...intent, answer_text: "The launch is limited to verified adults." }, {
  expected_revision: "request-revision-2",
  expected_question_revision: "question-revision-2",
  answer_text: "The launch is limited to verified adults.",
}, () => `answer-key-${++created}`);
assert.equal(changed.reused, false, "an intentional text change starts a new logical action");
assert.notEqual(changed.command.source_action_key, first.command.source_action_key);
assert.equal(changed.command.expected_revision, "request-revision-2", "the new action uses the current target revision");
const changedTarget = recoverRetryCommand<RecordAnswerCommand>(remounted.serialized, { ...intent, reply_id: "REP-2" }, {
  expected_revision: "request-revision-2",
  expected_question_revision: "question-revision-2",
  answer_text: intent.answer_text,
}, () => `answer-key-${++created}`);
assert.notEqual(changedTarget.command.source_action_key, first.command.source_action_key, "a changed explicit target starts a new logical action");
assert.equal(retryDraftKey("handoff", "accept:HOF-1"), "__continuity.retry.v1:handoff:accept:HOF-1");

assert.deepEqual(preparationNotice("completed", "Request wording", "No request was sent."), { tone: "agent", word: "Ready", detail: "Request wording is ready to edit. No request was sent." });
assert.equal(preparationNotice("queued", "Request wording", "No request was sent.").word, "Queued");
assert.equal(preparationNotice("running", "Request wording", "No request was sent.").word, "Working");
assert.match(preparationNotice("failed", "Request wording", "No request was sent.").detail, /retained for retry/);
assert.match(preparationNotice("interrupted", "The handoff brief", "Ownership has not changed.").detail, /retained for retry/);

console.log("Team interaction presentation checks passed.");
