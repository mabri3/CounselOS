import type { MatterDetail } from "../../lib/types.ts";
import type { WorkspaceSnapshot } from "../../lib/workspaceTypes.ts";

export type NextStep = { id: string; label: string; detail: string; message: string };
const done = new Set(["done", "closed", "complete", "completed", "cancelled", "canceled"]);

/** Project the existing saved synthesis, not a second model-generated plan. */
export function matterNextSteps(matter: MatterDetail | null, workspace: WorkspaceSnapshot | null): NextStep[] {
  if (!matter || !workspace || matter.matter_id !== workspace.matter_id || matter.status === "closed") return [];
  const steps: NextStep[] = [];
  const add = (id: string, label: string, detail: string, instruction: string) => {
    if (!label.trim() || steps.some(step => step.label.trim().toLowerCase() === label.trim().toLowerCase())) return;
    steps.push({ id, label, detail, message: `${instruction}\n\nUse the current saved records for matter ${matter.matter_id}: the dossier, facts, issues, working recommendation, research, and existing work product. Read relevant source documents and company knowledge as needed. Account for the saved answers and completed work; do not repeat intake or redo finished work. Check whether this step is still needed before proceeding. Keep recommendations separate from recorded decisions. Do not infer approval, delivery, or closure from this request.` });
  };
  const work = (matter.work_items ?? []).filter(item => !done.has(item.status) && !item.completed_at);
  const rank: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
  work.sort((a, b) => Number(Boolean(b.required)) - Number(Boolean(a.required)) || (rank[a.priority] ?? 2) - (rank[b.priority] ?? 2));
  for (const item of work) {
    add(`work:${item.work_item_id}`, item.title,
      `${item.status === "blocked" ? "Blocked work" : item.required ? "Required work" : "Open work"}${item.owner ? ` · ${item.owner}` : ""}. ${item.description || ""}`.trim(),
      `Help me advance this saved work item: ${item.title}. Read ${item.path}. If it needs another person's input, prepare the request rather than claiming the work is complete.`);
  }
  const savedAction = matter.orientation?.next_action?.trim();
  if (savedAction && !(matter.work_items ?? []).some(item => (done.has(item.status) || item.completed_at) && item.title.trim().toLowerCase() === savedAction.toLowerCase())) {
    add("saved-action", savedAction, "Next counsel action · From the saved matter summary.", `Help me take this saved next counsel action: ${savedAction}`);
  }
  for (const issue of workspace.issues ?? []) {
    if (issue.lawyer_state === "set_aside" || ["resolved", "risk_accepted", "not_applicable"].includes(issue.disposition ?? "")) continue;
    if (work.some(item => item.issue_id === issue.issue_id || item.issue_ids?.includes(issue.issue_id))) continue;
    add(`issue:${issue.issue_id}`, issue.next_action || `Assess: ${issue.title}`,
      issue.priority_reason || issue.why_it_matters || "Open issue · Compare the saved findings and identify the remaining action.",
      `Work through the unresolved issue ${issue.issue_id}: ${issue.title}. ${issue.next_action || "Use the existing analysis to recommend the next concrete action, with the material remaining unknowns."}`);
  }
  for (const question of workspace.questions ?? []) {
    if (question.state !== "open" || question.answer?.trim()) continue;
    add(`question:${question.question_id}`, question.text,
      question.consequence || "Open question · Check the saved sources before asking for more input.",
      `Resolve the saved open question ${question.question_id}: ${question.text}. Look for the answer in the available documents first. If it is absent, prepare one focused request for the missing information.`);
  }
  if (!steps.length && workspace.question?.text) {
    add("synthesize", `Identify the next action for ${matter.title}`, "No specific open action is saved yet.",
      `Synthesize the available matter knowledge around this question: ${workspace.question.text}. Save a useful working recommendation and next counsel action, stating material assumptions. Do not merely offer generic research or drafting options.`);
  }
  return steps.slice(0, 3);
}
