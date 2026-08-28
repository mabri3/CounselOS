/**
 * Shared design vocabulary — see docs/DESIGN_LANGUAGE.md.
 *
 * Colour carries meaning, never decoration, and always travels with a word.
 * Nothing in the UI should hard-code these hexes; import the role instead.
 */

import type { Decision, Matter, Schedule, StageId } from "./types";

export const role = {
  attention: "#E0A008",
  attentionTint: "#FDEEC0",
  attentionDeep: "#8A6612",
  healthy: "#146B54",
  healthyTint: "#E0EFE9",
  failure: "#B33A20",
  failureTint: "#F8E3DC",
  agent: "#5F5AC0",
  agentTint: "#F4F3FC",
  ink: "#1b1a17",
  quiet: "#5f5b54",
  quietTint: "#efece5",
  hairline: "#e6e2d9",
} as const;

/** The six stages, in plain language. Same words on every surface. */
export const STAGES: { id: StageId; label: string; sub: string }[] = [
  { id: "intake", label: "Just came in", sub: "Not yet triaged" },
  { id: "research", label: "Being researched", sub: "An agent is gathering the facts" },
  { id: "explore", label: "Waiting on your judgment", sub: "Research is done; a path must be chosen" },
  { id: "generate", label: "Being drafted", sub: "Work product is being written" },
  { id: "respond", label: "Ready to send", sub: "Review, approve, and deliver" },
  { id: "closed", label: "Closed", sub: "Delivered or otherwise resolved" },
];

export function stageLabel(stage: string): string {
  return STAGES.find((entry) => entry.id === stage)?.label ?? stage;
}

/** A matter is overdue when its target date has passed and it is still open. */
export function isOverdue(matter: Matter): boolean {
  if (!matter.target_date || matter.status === "closed") return false;
  const target = parseDisplayDate(matter.target_date);
  if (Number.isNaN(target.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target < today;
}

export function daysLate(matter: Matter): number {
  if (!matter.target_date) return 0;
  const target = parseDisplayDate(matter.target_date);
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
  /** The word beside the colour. Empty means "nothing owed" — no signal shown. */
  word: "" | "Overdue" | "Waiting on you" | "Themis is working";
  wordColor: string;
};

/**
 * The single place a matter turns into a colour. Order matters: overdue beats
 * waiting on the lawyer, which beats an agent working.
 */
export function signalFor(matter: Matter): Signal {
  if (isOverdue(matter)) {
    return { rail: role.failure, bg: "#FFFAF8", word: "Overdue", wordColor: role.failure };
  }
  if (matter.status === "explore") {
    return { rail: role.attention, bg: "#FFFDF4", word: "Waiting on you", wordColor: role.attentionDeep };
  }
  if (matter.status === "research" || matter.status === "generate") {
    return { rail: role.agent, bg: "#FDFDFF", word: "Themis is working", wordColor: role.agent };
  }
  if (matter.status === "closed") {
    return { rail: "transparent", bg: "#fbfaf7", word: "", wordColor: role.quiet };
  }
  return { rail: role.hairline, bg: "#fffefb", word: "", wordColor: role.quiet };
}

export function dueWord(matter: Matter): { text: string; color: string } {
  if (isOverdue(matter)) {
    const late = daysLate(matter);
    return { text: late === 1 ? "1 day late" : `${late} days late`, color: role.failure };
  }
  if (!matter.target_date) return { text: "No date", color: role.quiet };
  return { text: formatDay(matter.target_date), color: role.quiet };
}

export function formatDay(value: string | null | undefined): string {
  if (!value) return "—";
  const date = parseDisplayDate(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatLongDay(value: string | null | undefined): string {
  if (!value) return "—";
  const date = parseDisplayDate(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Date-only vault values are calendar dates, not midnight UTC timestamps. */
function parseDisplayDate(value: string): Date {
  const raw = String(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(raw);
}

export function decisionSignal(decision: Decision): { stale: boolean; label: string; detail: string } {
  if (decision.review_status === "fresh") {
    return {
      stale: false,
      label: decision.next_review_at ? formatDay(decision.next_review_at) : "—",
      detail: "Current",
    };
  }
  const detail = decision.staleness_reason || "Needs review";
  return { stale: true, label: shorten(detail), detail };
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
