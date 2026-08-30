import assert from "node:assert/strict";
import {
  controlIdForCurrentWork,
  currentWorkItemFor,
  openItemsFor,
  type BriefWorkItem,
} from "../lib/matterBrief.ts";

function workItem(
  work_item_id: string,
  title: string,
  item_type: string,
  required = 1,
  status = "open",
): BriefWorkItem {
  return { work_item_id, path: `work-items/${work_item_id}.md`, title, status, required, item_type };
}

const orbit = [workItem("WI-ORBIT-1", "Run adverse-action research", "research")];
const orbitCurrent = currentWorkItemFor(orbit, "WI-ORBIT-1");
assert.equal(controlIdForCurrentWork("run_research", orbitCurrent), "run_research");
assert.deepEqual(openItemsFor(orbit, ["Run adverse-action research?"], "WI-ORBIT-1", "Run adverse-action research"), []);

const apex = [
  workItem("WI-APEX-1", "Confirm whether audio is used for model training", "question"),
  workItem("WI-APEX-2", "Complete privacy review", "research"),
];
assert.equal(controlIdForCurrentWork("review_and_decide", currentWorkItemFor(apex, "WI-APEX-1")), "open_work_item");
assert.deepEqual(openItemsFor(apex, [], "WI-APEX-1", apex[0].title).map((item) => [item.text, item.required]), [
  ["Complete privacy review", true],
]);

const harbor = [
  workItem("WI-HARBOR-1", "Approve customer response", "approval"),
  workItem("WI-HARBOR-2", "Confirm policy exception", "counsel_review"),
];
assert.equal(controlIdForCurrentWork("approve_response", currentWorkItemFor(harbor, "WI-HARBOR-1")), "approve_response");
assert.deepEqual(openItemsFor(harbor, [], "WI-HARBOR-1", harbor[0].title).map((item) => [item.text, item.required]), [
  ["Confirm policy exception", true],
]);

const cedar = [workItem("WI-CEDAR-1", "Review first 90 days of reconciliation exceptions", "obligation", 0)];
assert.equal(controlIdForCurrentWork("none", currentWorkItemFor(cedar, null)), "none");
assert.deepEqual(openItemsFor(cedar, [], null, "The work was delivered or otherwise resolved.").map((item) => item.text), [
  "Review first 90 days of reconciliation exceptions",
]);

const repeated = [
  workItem("WI-SAME-1", "Confirm retention period", "question"),
  workItem("WI-SAME-2", "Confirm retention period", "question"),
];
assert.deepEqual(openItemsFor(repeated, [], null, "Review matter").map((item) => item.key), [
  "work:WI-SAME-1",
  "work:WI-SAME-2",
]);

const questions = openItemsFor(
  [workItem("WI-Q-1", "Confirm retention period", "question")],
  [
    " Confirm   retention period? ",
    "Confirm the retention period?",
    "What is the launch date?",
    "what is the launch date!",
    "   ",
  ],
  null,
  "Review matter",
);
assert.deepEqual(questions.map((item) => item.text), [
  "Confirm retention period",
  "Confirm the retention period?",
  "What is the launch date?",
]);

assert.equal(
  controlIdForCurrentWork("review_intake", workItem("WI-UNKNOWN", "Inspect record", "new_type")),
  "open_work_item",
);
assert.deepEqual(openItemsFor(apex, [], "WI-NOT-FOUND", "Review matter").map((item) => item.key), [
  "work:WI-APEX-1",
  "work:WI-APEX-2",
]);

console.log("All checks passed.");
