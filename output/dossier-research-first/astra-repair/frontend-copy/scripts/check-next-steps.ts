import assert from "node:assert/strict";
import { matterNextSteps } from "../components/experimental/nextSteps.ts";
import type { MatterDetail } from "../lib/types.ts";
import type { WorkspaceSnapshot } from "../lib/workspaceTypes.ts";

const matter = {
  matter_id: "MAT-1", title: "Harbor", status: "explore",
  orientation: { next_action: "Determine licensing requirements in the four new markets." },
  work_items: [{ work_item_id: "DONE", title: "Orient to the request", status: "done" }],
} as MatterDetail;
const workspace = {
  matter_id: "MAT-1", question: { text: "Can the migration proceed?" },
  issues: [
    { issue_id: "SAR", title: "Review open alerts", lawyer_state: "open" },
    { issue_id: "KYC", title: "Missing KYC records", lawyer_state: "open" },
    { issue_id: "OLD", title: "Resolved issue", disposition: "resolved" },
  ],
  questions: [{ question_id: "ANSWERED", text: "Which deal structure?", state: "answered", answer: "Asset purchase" }],
} as WorkspaceSnapshot;
const steps = matterNextSteps(matter, workspace);
assert.equal(steps[0].label, matter.orientation.next_action);
assert.deepEqual(steps.map(step => step.id), ["saved-action", "issue:SAR", "issue:KYC"]);
assert.match(steps[0].message, /research, and existing work product/);
assert.match(steps[0].message, /Do not infer approval, delivery, or closure/);
assert.equal(matterNextSteps({ ...matter, status: "closed" }, workspace).length, 0);
assert.equal(matterNextSteps(matter, { ...workspace, matter_id: "MAT-2" }).length, 0);
assert.equal(matterNextSteps(null, workspace).length, 0);

// Saving a completed task/issue or an answered question removes its suggestion.
const changed = structuredClone(workspace);
changed.issues![0].disposition = "resolved";
assert.ok(!matterNextSteps(matter, changed).some(step => step.id === "issue:SAR"));
const openWork = { work_item_id: "TASK", path: "03_Matters/harbor/work-items/task.md", title: "Obtain the state list", status: "open", required: 1, priority: "high", owner: "Product", description: "Needed for the license analysis." };
const withWork = { ...matter, work_items: [openWork] } as MatterDetail;
assert.equal(matterNextSteps(withWork, workspace)[0].id, "work:TASK");
openWork.status = "done";
assert.ok(!matterNextSteps(withWork, workspace).some(step => step.id === "work:TASK"));
const empty = { ...matter, orientation: { ...matter.orientation, next_action: "" } };
const questions: WorkspaceSnapshot = { ...workspace, issues: [], questions: [{ question_id: "Q", business_question_id: "BQ", business_question_revision: "1", text: "Which states?", state: "open" }] };
assert.equal(matterNextSteps(empty, questions)[0].id, "question:Q");
questions.questions![0].state = "answered";
assert.equal(matterNextSteps(empty, questions)[0].id, "synthesize");
console.log("Matter next-step regression checks passed.");
