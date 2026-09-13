import type { DossierIssueStatus, DossierPriority, DossierRequestStatus } from "./types.ts";
import type { ResearchScope } from "./researchScope.ts";

const ACTIVE = new Set(["running"]);
const RESUMABLE = new Set(["interrupted", "stopped"]);

function record(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function strings(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && !!item) : []; }
function number(value: unknown): number { return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0; }

export function normalizeDossierStatus(value: unknown, fallback: { requestId: string; matterId: string; state?: string; phase?: string }): DossierRequestStatus {
  const raw = record(value);
  const issues = Array.isArray(raw.issues) ? raw.issues.map((item, index): DossierIssueStatus => {
    const issue = record(item);
    return { issue_id: String(issue.issue_id || `issue-${index + 1}`), title: String(issue.title || issue.issue_id || `Issue ${index + 1}`), state: String(issue.state || "not_selected"), planned_order: typeof issue.planned_order === "number" ? issue.planned_order : null, selected_first: issue.selected_first === true, sources_read: number(issue.sources_read), sources_retrieved: number(issue.sources_retrieved), support: typeof issue.support === "string" ? issue.support : null, packet_path: typeof issue.packet_path === "string" ? issue.packet_path : null, answer_path: typeof issue.answer_path === "string" ? issue.answer_path : null, last_error: typeof issue.last_error === "string" ? issue.last_error : null, run_id: typeof issue.run_id === "string" ? issue.run_id : null };
  }) : [];
  const priorities = Array.isArray(raw.priorities) ? raw.priorities.slice(0, 3).map((item, index): DossierPriority => { const priority = record(item); return { key: String(priority.key || `p${index + 1}`), text: String(priority.text || `Priority ${index + 1}`), why: String(priority.why || ""), issue_ids: strings(priority.issue_ids), changed: priority.changed === true }; }) : [];
  const publications = Array.isArray(raw.publications) ? raw.publications.filter(item => item && typeof item === "object") as DossierRequestStatus["publications"] : [];
  const countsRaw = record(raw.counts); const counts: Record<string, number> = {};
  for (const [key, value] of Object.entries(countsRaw)) counts[key] = number(value);
  return { request_id: typeof raw.request_id === "string" ? raw.request_id : fallback.requestId, matter_id: typeof raw.matter_id === "string" ? raw.matter_id : fallback.matterId, state: typeof raw.state === "string" ? raw.state : fallback.state || "awaiting_choices", phase: typeof raw.phase === "string" ? raw.phase : fallback.phase || "setup", sequence: number(raw.sequence), plan_revision: typeof raw.plan_revision === "string" ? raw.plan_revision : "legacy", execution_mode: raw.execution_mode === "research" || raw.execution_mode === "saved_only" ? raw.execution_mode : null, scope: raw.scope === "top_three" || raw.scope === "all" ? raw.scope : null, stop_requested: raw.stop_requested === true, origin: record(raw.origin) as DossierRequestStatus["origin"], priorities, first_issue_ids: strings(raw.first_issue_ids), planned_issue_ids: strings(raw.planned_issue_ids), new_issue_candidates: Array.isArray(raw.new_issue_candidates) ? raw.new_issue_candidates.map(record) : [], counts, issues, publications, latest_publication: record(raw.latest_publication) as DossierRequestStatus["latest_publication"], first_pass_ready_at: typeof raw.first_pass_ready_at === "string" ? raw.first_pass_ready_at : null, finished_at: typeof raw.finished_at === "string" ? raw.finished_at : null, last_error: typeof raw.last_error === "string" ? raw.last_error : null, source_scope: record(raw.source_scope), model_selections: record(raw.model_selections), preparation: typeof raw.preparation === "string" ? raw.preparation : "" };
}

export function uniqueIssueOrder(values: string[], available: string[], limit = 3): string[] {
  const valid = new Set(available); return values.filter((value, index) => valid.has(value) && values.indexOf(value) === index).slice(0, limit);
}

export function setIssueAt(values: string[], position: number, issueId: string, available: string[]): string[] {
  const next = [...values]; const prior = next.indexOf(issueId); if (prior >= 0 && prior !== position) next[prior] = next[position] || ""; next[position] = issueId;
  return uniqueIssueOrder(next, available);
}

export function startPayload(status: DossierRequestStatus, mode: "research" | "saved_only", priorities: DossierPriority[], firstIssueIds: string[], scope: "top_three" | "all", sourceChoice: ResearchScope, actionKey: string) {
  const candidateKeys = status.new_issue_candidates.map(item => String(item.candidate_key || "")).filter(Boolean);
  const available = [...status.issues.map(issue => issue.issue_id), ...candidateKeys];
  const selected = uniqueIssueOrder(firstIssueIds, available);
  const priorityRows = priorities.slice(0, 3).map((item, index) => ({ ...item, issue_ids: strings(item.issue_ids).filter(id => available.includes(id)), changed: item.changed === true || item.text !== status.priorities[index]?.text || item.why !== status.priorities[index]?.why }));
  const accepted = new Set([...selected, ...priorityRows.flatMap(item => item.issue_ids)].filter(id => candidateKeys.includes(id)));
  return { execution_mode: mode, expected_sequence: status.sequence, plan_revision: status.plan_revision, priorities: priorityRows, first_issue_ids: selected, scope: mode === "research" ? scope : null, source_choice: { ...sourceChoice, provider_ids: strings(sourceChoice.provider_ids), collection_enabled: Boolean(sourceChoice.external || sourceChoice.other_matters) }, accepted_candidate_keys: [...accepted], source_action_key: actionKey };
}

export function shouldPollDossier(status: DossierRequestStatus): boolean { return ACTIVE.has(status.state); }
export function dossierControls(status: DossierRequestStatus) { return { stop: ACTIVE.has(status.state), resume: RESUMABLE.has(status.state), retry: status.state === "failed" || status.issues.some(issue => issue.state === "failed") }; }
export function publicationToken(status: DossierRequestStatus): string { return JSON.stringify(status.publications.map(item => [item.key, item.state, item.revision_path, record(item.receipts).conversation])); }
export function pollingScopeMatches(expectedMatter: string, expectedConversation: string | null | undefined, actualMatter: string, actualConversation: string | null | undefined): boolean { return expectedMatter === actualMatter && (expectedConversation || null) === (actualConversation || null); }
export function mergeBackgroundDraft(current: string, followUp: string): string { return current.trim() ? `${current}\n\n${followUp}` : followUp; }
export function issueProgressLabel(status: DossierRequestStatus): string { const total = status.planned_issue_ids.length || status.counts.total || status.issues.length; const active = status.issues.filter(issue => issue.state !== "not_selected").length; return `Researching ${Math.min(active, total)} of ${total} issues`; }
export function dossierCompletionStage(status: DossierRequestStatus): "setup" | "working" | "first_pass" | "complete" | "partial" {
  if (status.state === "awaiting_choices" || status.phase === "setup") return "setup";
  if (status.state === "completed") return status.issues.some(issue => ["partial", "failed", "interrupted"].includes(issue.state)) ? "partial" : "complete";
  if (status.first_pass_ready_at || status.publications.length > 0) return "first_pass";
  return status.state === "partial" || status.state === "failed" ? "partial" : "working";
}
export function dossierStateWord(state: string): string { return ({ awaiting_choices: "Needs your choices", planning: "Planning", not_selected: "Unselected", queued: "Queued", running: "Running", saved: "Complete", completed: "Complete", stopped: "Stopped", partial: "Partial", failed: "Failed", interrupted: "Interrupted", newly_identified: "New" } as Record<string, string>)[state] || "Unknown"; }
export function followUpText(status: DossierRequestStatus): string { const names = status.new_issue_candidates.map(item => String(item.title || item.candidate_key || "New issue")); const priorities = status.priorities.map(item => item.text).filter(Boolean); return `Review these newly found dossier issues through the normal research flow: ${names.join("; ")}. Keep these prior priorities in view: ${priorities.join("; ")}.`; }
