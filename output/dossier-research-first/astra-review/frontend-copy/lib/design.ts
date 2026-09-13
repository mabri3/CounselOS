/**
 * Shared design vocabulary — see docs/DESIGN_LANGUAGE.md.
 *
 * Colour carries meaning, never decoration, and always travels with a word.
 * Nothing in the UI should hard-code these hexes; import the role instead.
 */

import type { Decision, Matter, MatterConsistencyIssue, MatterSignalKind, Schedule, StageId } from "./types.ts";

export const role = {
  attention: "#F97316",
  attentionTint: "#FFF1DC",
  attentionWash: "#FFFAF3",
  attentionDeep: "#C94800",
  healthy: "#146B54",
  healthyTint: "#E0EFE9",
  healthyWash: "#F8FCFA",
  failure: "#B33A20",
  failureTint: "#F8E3DC",
  failureWash: "#FFFAF8",
  agent: "#4922FF",
  agentTint: "#EEE9FF",
  agentWash: "#FAF8FF",
  ink: "#071421",
  quiet: "#596477",
  quietTint: "#f5f5f7",
  quietWash: "#FBFAF7",
  hairline: "#e6e2d9",
} as const;

/** Shared status words keep colour and meaning paired on every surface. */
export const statusRole = {
  attention: { label: "Needs attention", color: role.attentionDeep, tint: role.attentionTint, wash: role.attentionWash },
  healthy: { label: "Healthy", color: role.healthy, tint: role.healthyTint, wash: role.healthyWash },
  failure: { label: "Failed", color: role.failure, tint: role.failureTint, wash: role.failureWash },
  agent: { label: "Agent work", color: role.agent, tint: role.agentTint, wash: role.agentWash },
} as const;

const CONSISTENCY_LABELS: Record<MatterConsistencyIssue["code"], string> = {
  final_with_pre_respond_stage: "Current final is before Respond",
  approval_without_current_final: "Approval is not tied to the current final",
  delivery_without_approved_artifact: "Delivery has no approved artifact",
  closed_without_required_lifecycle_fields: "Closed lifecycle record is incomplete",
};

export function consistencyIssueLabel(issue: MatterConsistencyIssue): string {
  return CONSISTENCY_LABELS[issue.code];
}

export function consistencyIssueIsSafelyRepairable(issue: MatterConsistencyIssue): boolean {
  return issue.code === "final_with_pre_respond_stage";
}

export const reviewAuthorPalette = ["#2F5597", "#7030A0", "#008272", "#A64B00", "#C0006F", "#5B6573", "#7A3E00", "#006B8F"] as const;

/** The six stages, in plain language. Same words on every surface. */
export const STAGES: { id: StageId; label: string; sub: string }[] = [
  { id: "intake", label: "Just came in", sub: "Not yet triaged" },
  { id: "research", label: "Being researched", sub: "An agent is gathering the facts" },
  { id: "explore", label: "Waiting on your judgment", sub: "Research is done; a path must be chosen" },
  { id: "generate", label: "Being drafted", sub: "Work product is being written" },
  { id: "respond", label: "Respond", sub: "Review, approve, and deliver" },
  { id: "closed", label: "Closed", sub: "Delivered or otherwise resolved" },
];

export function stageLabel(stage: string): string {
  return STAGES.find((entry) => entry.id === stage)?.label ?? stage;
}

export function matterAwaitsJudgment(matter: Matter): boolean {
  return matter.status === "explore";
}

export function matterIsAgentWorking(matter: Matter): boolean {
  return matter.work_state.execution_state === "queued" || matter.work_state.execution_state === "running";
}

export function matterNeedsAttention(matter: Matter): boolean {
  const kind = matter.work_state.signal.kind;
  return kind === "overdue" || kind === "needs_assignment" || isWaitingSignal(kind);
}

export function isWaitingSignal(kind: MatterSignalKind): boolean {
  return ["waiting_on_owner", "waiting_on_you", "blocked", "execution_unknown"].includes(kind);
}

export function signalCellTint(kind: MatterSignalKind): string {
  if (kind === "overdue") return role.failureWash;
  if (isWaitingSignal(kind) || kind === "needs_assignment") return role.attentionWash;
  if (kind === "agent_working" || kind === "ready_for_themis") return role.agentWash;
  return "transparent";
}

/** Prefer the authoritative projection, with a fallback for a stale API response. */
export function matterNextAction(matter: Matter): string {
  if (matter.status === "closed") return "Closed";
  return matter.work_state?.next_action || matter.next_action;
}

export function matterNextOwner(matter: Matter): string {
  if (matter.work_state.next_owner) return matter.work_state.next_owner;
  if (matter.work_state.next_actor === "unassigned") return "Unassigned";
  if (matter.work_state.next_actor === "you") return "You";
  return "—";
}

/** Read the backend verdict. Date parsing must not override the work-state signal. */
export function isOverdue(matter: Matter): boolean {
  return matter.work_state.signal.kind === "overdue";
}

export function daysLate(matter: Matter): number {
  if (!matter.work_state.due_at) return 0;
  const target = parseDisplayDate(matter.work_state.due_at);
  if (Number.isNaN(target.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today.getTime() - target.getTime()) / 86_400_000));
}

export type Signal = {
  /** Left spine colour on rows and cards. */
  rail: string;
  /** Row background wash. */
  bg: string;
  /** The factual state label shown beside the colour. */
  kind: MatterSignalKind;
  word: string;
  wordColor: string;
};

/**
 * The single place a matter turns into a colour. Order matters: overdue beats
 * waiting, which beats an agent working.
 */
export function signalFor(matter: Matter): Signal {
  const { kind, label } = matter.work_state.signal;
  if (matter.status === "closed") {
    return { kind, rail: "transparent", bg: "#fbfaf7", word: "Closed", wordColor: role.quiet };
  }
  if (kind === "overdue") return { kind, rail: role.failure, bg: role.failureWash, word: label, wordColor: role.failure };
  if (isWaitingSignal(kind) || kind === "needs_assignment") {
    return { kind, rail: role.attention, bg: role.attentionWash, word: label, wordColor: role.attentionDeep };
  }
  if (kind === "agent_working" || kind === "ready_for_themis") {
    return { kind, rail: role.agent, bg: role.agentWash, word: label, wordColor: role.agent };
  }
  return { kind, rail: role.hairline, bg: "#ffffff", word: "No action needed", wordColor: role.quiet };
}

export function dueWord(matter: Matter): { text: string; color: string } {
  if (isOverdue(matter)) {
    const late = daysLate(matter);
    return { text: late === 1 ? "1 day late" : `${late} days late`, color: role.failure };
  }
  if (!matter.work_state.due_at) return { text: "No date", color: role.quiet };
  return { text: formatDay(matter.work_state.due_at), color: role.quiet };
}

export function formatShortDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = parseDisplayDate(String(value));
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatLongDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = parseDisplayDate(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export function formatTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** Compatible aliases for existing callers. */
export const formatDay = formatShortDate;
export const formatLongDay = formatLongDate;

export const RISK_DEFINITION = "Risk is the recorded level of legal or business impact.";

export function riskLabel(value: string | null | undefined): string {
  const clean = value?.trim() ?? "";
  return !clean || clean.toLowerCase() === "unknown" ? "Not assessed" : clean;
}

/** Legal risk is lawyer-set text. It does not use failure or overdue colours. */
export function riskRole(value: string | null | undefined): { label: string; color: string; wash: string } | null {
  const label = riskLabel(value);
  if (label === "Not assessed") return null;
  return { label, color: role.quiet, wash: role.quietWash };
}

/** Date-only vault values are calendar dates, not midnight UTC timestamps. */
export function parseDisplayDate(value: string): Date {
  const raw = String(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(raw);
}

export function decisionSignal(decision: Decision): { stale: boolean; label: string; detail: string } {
  if (!decisionNeedsReview(decision)) {
    return {
      stale: false,
      label: decision.next_review_at ? formatDay(decision.next_review_at) : "—",
      detail: "Current",
    };
  }
  const detail = decision.staleness_reason || "Needs review";
  return { stale: true, label: shorten(detail), detail };
}

/** Older vault records use `current`; it has the same meaning as `fresh`. */
export function decisionNeedsReview(decision: Decision): boolean {
  return decision.review_status !== "fresh" && decision.review_status !== "current";
}

/** The register column is narrow; the full reason stays in the tooltip. */
function shorten(reason: string): string {
  const clean = reason.replace(/\.$/, "");
  if (clean.length <= 18) return clean;
  const words: string[] = [];
  for (const word of clean.split(/\s+/)) {
    if ([...words, word].join(" ").length > 18) break;
    words.push(word);
  }
  return `${words.join(" ") || clean.slice(0, 18)}…`;
}

export function scheduleIsFailing(schedule: Schedule): boolean {
  return schedule.last_status === "error" || schedule.last_status === "failed";
}

/** The API sends a boolean; older vault records sent 0/1. Both mean paused. */
export function scheduleIsPaused(schedule: Schedule): boolean {
  return schedule.enabled === false || (schedule.enabled as unknown) === 0;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  return (parts[0][0] + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

/** "B. Harris" from "Brian Harris" — the register and board both use short form. */
export function shortName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return name || "Unassigned";
  return `${parts[0][0]}. ${parts.at(-1)}`;
}

/** "every 15 minutes", "weekly" — never a raw second count. */
export function cadence(seconds: number): string {
  if (seconds < 90) return "every minute";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `every ${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours === 1 ? "hourly" : `every ${hours} hours`;
  const days = Math.round(hours / 24);
  if (days === 1) return "daily";
  if (days === 7) return "weekly";
  if (days < 7) return `every ${days} days`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? "weekly" : `every ${weeks} weeks`;
}
