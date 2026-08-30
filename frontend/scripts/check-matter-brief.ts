import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  completableCurrentWorkItemId,
  controlIdForCurrentWork,
  currentWorkItemFor,
  explicitlyRequestsWorkspaceMutation,
  isKnownMatterArtifactPath,
  matterArtifacts,
  mutationOutcome,
  openItemsFor,
  type BriefWorkItem,
} from "../lib/matterBrief.ts";
import { lifecycleActionNeedsDirectMutation, matterAction } from "../lib/matterActions.ts";
import type { ChatCard, FileNode, MatterDetail } from "../lib/types.ts";

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
assert.equal(completableCurrentWorkItemId(orbitCurrent), "WI-ORBIT-1");
assert.equal(completableCurrentWorkItemId(workItem("WI-DONE", "Done", "research", 1, "done")), null);
assert.equal(completableCurrentWorkItemId(workItem("WI-OPTIONAL", "Optional", "research", 0)), null);
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
assert.equal(currentWorkItemFor(harbor, "WI-HARBOR-1")?.work_item_id, "WI-HARBOR-1");
assert.equal(lifecycleActionNeedsDirectMutation("approve_response"), true);
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

const tree: FileNode[] = [{
  name: "custom-output", path: "matters/M-1/custom-output", type: "folder", children: [
    { name: "draft.md", label: "Configured draft", path: "matters/M-1/custom-output/draft.md", type: "file", extension: ".md", record_type: "work_product", state: "draft" },
    { name: "approved.md", label: "Approved response", path: "matters/M-1/custom-output/approved.md", type: "file", extension: ".md", record_type: "work_product", state: "final", updated_at: 100 },
    { name: "newest.md", label: "Newest final", path: "matters/M-1/custom-output/newest.md", type: "file", extension: ".md", record_type: "work_product", state: "final", updated_at: 200 },
  ],
}, {
  name: "research", path: "matters/M-1/research", type: "folder", children: [
    { name: "packet.md", label: "Old research label", path: "matters/M-1/research/packet.md", type: "file", extension: ".md", record_type: "research" },
    { name: "runs", path: "matters/M-1/research/runs", type: "folder", children: [
      { name: "RUN-1.md", label: "Queued", path: "matters/M-1/research/runs/RUN-1.md", type: "file", extension: ".md", record_type: "research_run" },
    ] },
  ],
}, {
  name: "work-product", path: "matters/M-1/work-product", type: "folder", children: [{
    name: "final", path: "matters/M-1/work-product/final", type: "folder", children: [
      { name: "folder-only.md", path: "matters/M-1/work-product/final/folder-only.md", type: "file", extension: ".md" },
      { name: "legacy-valid.md", path: "matters/M-1/work-product/final/legacy-valid.md", type: "file", extension: ".md", record_type: "work_product", state: "final", updated_at: 50 },
    ],
  }],
}, {
  name: "events", path: "matters/M-1/events", type: "folder", children: [
    { name: "event.md", path: "matters/M-1/events/event.md", type: "file", extension: ".md" },
  ],
}];
const artifacts = matterArtifacts(tree);
assert.deepEqual(artifacts.map((item) => [item.kind, item.path]), [
  ["research", "matters/M-1/research/packet.md"],
  ["draft", "matters/M-1/custom-output/draft.md"],
  ["final", "matters/M-1/custom-output/newest.md"],
]);
assert.equal(artifacts.find((item) => item.kind === "research")?.label, "First-pass research");
assert.equal(artifacts.some((item) => item.path.includes("/research/runs/")), false);
assert.equal(isKnownMatterArtifactPath("matters/M-1/custom-output/newest.md", artifacts), true);
const approvedArtifacts = matterArtifacts(tree, "matters/M-1/custom-output/approved.md");
assert.equal(approvedArtifacts.find((item) => item.kind === "final")?.path, "matters/M-1/custom-output/approved.md");
assert.equal(isKnownMatterArtifactPath("matters/M-1/events/event.md", artifacts), false);
assert.equal(isKnownMatterArtifactPath("matters/M-1/matter.md", artifacts), false);
assert.equal(isKnownMatterArtifactPath("matters/M-1/work-product/final/folder-only.md", artifacts), false);
const workProductCard: ChatCard = { type: "work_product", title: "Saved advice", vault_path: "matters/M-1/other/advice.md", state: "draft", summary: "Saved" };
assert.equal(isKnownMatterArtifactPath(workProductCard.vault_path, artifacts, [workProductCard]), true);

assert.equal(explicitlyRequestsWorkspaceMutation("Please record this decision"), true);
assert.equal(explicitlyRequestsWorkspaceMutation("Record that it was delivered"), true);
assert.equal(explicitlyRequestsWorkspaceMutation("Log that the response was sent"), true);
assert.equal(explicitlyRequestsWorkspaceMutation("Finish this matter"), true);
assert.equal(explicitlyRequestsWorkspaceMutation("What do you recommend?"), false);
assert.equal(explicitlyRequestsWorkspaceMutation("Can you finish explaining the options?"), false);
assert.equal(mutationOutcome("Record this decision", [{ tool: "record_decision", status: "error", summary: "failed" }]), "no_change");
assert.equal(mutationOutcome("Record this decision", [{ tool: "record_decision", status: "success", summary: "saved" }]), "recorded");
assert.equal(mutationOutcome("Draft and save the response", [], [workProductCard]), "recorded");
assert.equal(mutationOutcome("What do you recommend?", []), "none");

const closeWithRequiredWork = matterAction({
  status: "respond",
  response_approved_at: "2026-08-29T12:00:00Z",
  response_sent_at: "2026-08-30T12:00:00Z",
  work_items: [{ required: 1, status: "open" }],
} as MatterDetail, false);
assert.equal(closeWithRequiredWork.id, "close_matter");
assert.match(closeWithRequiredWork.detail, /Required work remains/);

const workspaceSource = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
assert.equal(workspaceSource.includes("Latest research"), false);
assert.equal(workspaceSource.includes("Agent research"), false);
assert.equal(workspaceSource.includes("Written by Themis, unreviewed"), false);
assert.ok((workspaceSource.match(/First-pass research/g) ?? []).length >= 3, "workspace uses one research label");

console.log("All checks passed.");
