import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  completableCurrentWorkItemId,
  countUserFacingDocuments,
  controlIdForCurrentWork,
  currentWorkItemFor,
  isKnownMatterArtifactPath,
  matterArtifacts,
  mutationFailureMessages,
  mutationOutcome,
  openItemsFor,
  userFacingMatterTree,
  workItemOwnerLabel,
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
assert.equal(workItemOwnerLabel({ ...orbitCurrent!, owner: " Lena Brooks " }), "Lena Brooks");
assert.equal(workItemOwnerLabel(orbitCurrent), "Unassigned");
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
    { name: "packet.md", label: "Old research label", path: "matters/M-1/research/packet.md", type: "file", extension: ".md", record_type: "research", updated_at: 200 },
    { name: "newer-by-tree.md", label: "Wrong tree choice", path: "matters/M-1/research/newer-by-tree.md", type: "file", extension: ".md", record_type: "research", updated_at: 300 },
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
}, {
  name: "work-product.md", label: "Legacy work product", path: "matters/M-1/work-product.md", type: "file", extension: ".md", record_type: "work_product", state: "draft",
}];
const canonicalDraftPath = "matters/M-1/custom-output/draft.md";
const latestResearchPath = "matters/M-1/research/packet.md";
const fallbackArtifacts = matterArtifacts(tree);
assert.equal(fallbackArtifacts.find((item) => item.kind === "draft")?.path, "matters/M-1/work-product.md");
const artifacts = matterArtifacts(tree, null, canonicalDraftPath, latestResearchPath, "matters/M-1/custom-output/newest.md");
assert.deepEqual(artifacts.map((item) => [item.kind, item.path]), [
  ["research", "matters/M-1/research/packet.md"],
  ["draft", canonicalDraftPath],
  ["final", "matters/M-1/custom-output/newest.md"],
]);
assert.equal(artifacts.find((item) => item.kind === "draft")?.label, "Configured draft");
assert.equal(artifacts.find((item) => item.kind === "research")?.label, "Old research label");
assert.equal(artifacts.some((item) => item.path.includes("/research/runs/")), false);
assert.equal(isKnownMatterArtifactPath("matters/M-1/custom-output/newest.md", artifacts), true);
const approvedArtifacts = matterArtifacts(tree, "matters/M-1/custom-output/approved.md", canonicalDraftPath);
assert.equal(approvedArtifacts.find((item) => item.kind === "final")?.path, "matters/M-1/custom-output/approved.md");
assert.equal(isKnownMatterArtifactPath("matters/M-1/events/event.md", artifacts), false);
assert.equal(isKnownMatterArtifactPath("matters/M-1/matter.md", artifacts), false);
assert.equal(isKnownMatterArtifactPath("matters/M-1/work-product/final/folder-only.md", artifacts), false);
const draftWithoutFinal = matterArtifacts(tree, null, canonicalDraftPath, latestResearchPath, null);
assert.equal(draftWithoutFinal.some((item) => item.kind === "final"), false);
const workProductCard: ChatCard = { type: "work_product", title: "Saved advice", vault_path: "matters/M-1/other/advice.md", state: "draft", summary: "Saved" };
assert.equal(isKnownMatterArtifactPath(workProductCard.vault_path, artifacts, [workProductCard]), true);
assert.equal(countUserFacingDocuments(tree), 8);
assert.equal(JSON.stringify(userFacingMatterTree(tree)).includes("RUN-1.md"), false);
assert.equal(JSON.stringify(userFacingMatterTree(tree)).includes("event.md"), false);

assert.equal(mutationOutcome([{ tool: "record_decision", status: "error", summary: "failed", mutation_status: "failed" }]), "no_change");
assert.equal(mutationOutcome([{ tool: "record_decision", status: "success", summary: "saved", mutation_status: "changed" }]), "recorded");
assert.equal(mutationOutcome([{ tool: "complete_work_item", status: "success", summary: "already complete", mutation_status: "no_change" }]), "no_change");
assert.equal(mutationOutcome([], [workProductCard]), "recorded");
assert.equal(mutationOutcome([]), "none");
assert.deepEqual(mutationFailureMessages([
  { tool: "record_decision", status: "error", summary: "The decision was not recorded.", mutation_status: "failed" },
]), ["The decision was not recorded."]);

const closeWithRequiredWork = matterAction({
  status: "respond",
  current_work_product_final_path: "matters/M-1/work-product/final/approved.md",
  response_approved_at: "2026-08-29T12:00:00Z",
  response_sent_at: "2026-08-30T12:00:00Z",
  work_items: [{ required: 1, status: "open" }],
} as MatterDetail, false);
assert.equal(closeWithRequiredWork.id, "close_matter");
assert.match(closeWithRequiredWork.detail, /Required work remains/);

const unrelatedRequiredItem: BriefWorkItem = {
  work_item_id: "WI-REQUIRED", path: "work-items/required.md", title: "Archive response",
  status: "open", required: 1, item_type: "task", owner: "Operations",
};
assert.equal(controlIdForCurrentWork("approve_response", unrelatedRequiredItem), "approve_response");
assert.equal(controlIdForCurrentWork("mark_as_sent", unrelatedRequiredItem), "mark_as_sent");
assert.equal(controlIdForCurrentWork("close_matter", unrelatedRequiredItem), "open_work_item");

const workspaceSource = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
assert.equal(workspaceSource.includes("Latest research"), false);
assert.equal(workspaceSource.includes("Agent research"), false);
assert.equal(workspaceSource.includes("Written by Themis.ai, unreviewed"), false);
assert.equal(workspaceSource.includes("No working recommendation is saved."), false);
assert.equal(workspaceSource.includes("Matter at a glance"), true);
assert.equal(workspaceSource.includes("Question to resolve"), true);
assert.equal(workspaceSource.includes("Other open items and questions"), true);
assert.equal(workspaceSource.includes("Other saved work items"), true);
assert.equal(workspaceSource.includes("Also open on this matter"), false);
assert.equal(workspaceSource.includes("detail.orientation.summary"), true);
assert.equal(workspaceSource.includes("<summary>Original request</summary>"), true);
assert.equal(workspaceSource.includes("detail.original_request"), true);
assert.equal(workspaceSource.includes("openDocument(requestPath)"), true);
assert.equal(workspaceSource.includes("completeSavedWorkItem"), true);
assert.equal(workspaceSource.includes("Open work item"), true);
assert.equal(workspaceSource.includes("Current work · Saved work item"), true);
assert.equal(workspaceSource.includes("<p>{currentWorkItem.title}</p>"), false);
assert.equal(workspaceSource.includes("Owner: <strong>{ownerOverrides[currentWorkItem.work_item_id] || currentWorkItemOwner}</strong>"), true);
assert.equal(workspaceSource.includes("detail as MatterDetail & { participants?: MatterParticipant[] }"), true);
assert.equal(workspaceSource.includes("finalizeCurrentDraft"), true);
assert.equal(workspaceSource.includes("createManualDraft"), true);
assert.equal(workspaceSource.includes("countUserFacingDocuments(detail.tree)"), true);
assert.ok((workspaceSource.match(/detail\.current_work_product_draft_path,/g) ?? []).length >= 2, "artifact selection receives the canonical draft path");
assert.equal(workspaceSource.includes("const draftPath = detail.current_work_product_draft_path"), true);
assert.equal(workspaceSource.includes("detail.current_work_product_final_path"), true);
assert.equal(workspaceSource.includes("detail.latest_research_path"), true);
assert.equal(workspaceSource.includes("approvalUnavailable"), true);
assert.equal(workspaceSource.includes("showDraftSnapshotNotice={Boolean(draftPath && activePath === draftPath)}"), true);
assert.equal(workspaceSource.includes("Do not replace the draft automatically."), true);
assert.equal(workspaceSource.includes("finalizeWorkProduct(detail.matter_id, draftPath)"), true);
assert.equal(workspaceSource.includes("currentWorkProductDraftPath={draftPath}"), true);
assert.equal(workspaceSource.includes('currentControl.id !== "open_work_item"'), true);
assert.equal(workspaceSource.includes('research: "Research packet"'), true, "workspace gives saved research a clear artifact type");
for (const message of [
  "No research packet is saved yet.",
  "No working recommendation is saved yet.",
  "No current work-product draft is saved yet.",
  "No final work product is saved yet.",
  "No durable decision is recorded for this matter.",
]) assert.equal(workspaceSource.includes(message), true);
assert.equal(workspaceSource.includes("saved.changed_paths.length"), false, "chat retry state belongs to ChatPanel");
assert.equal(workspaceSource.includes("result.changed_paths.length"), true);
assert.equal(workspaceSource.includes("result.changed_paths?.length"), true);
assert.equal(/no new save was made/i.test(workspaceSource), true);

const decisionModalSource = readFileSync(new URL("../components/RecordDecisionModal.tsx", import.meta.url), "utf8");
assert.equal(decisionModalSource.includes("lawyerAuthor?.trim() || detail.legal_owner"), true);

console.log("All checks passed.");
