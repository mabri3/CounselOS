import type { NextAction, Orientation, WorkTarget } from "./continuityTypes";

const QUESTION_PREVIEW_LIMIT = 220;

export type OrientationAnswer = {
  text: string;
  label: string;
  path: string | null;
  state: "current" | "stale" | "unavailable";
};

export function previewOrientationQuestion(question: string, limit = QUESTION_PREVIEW_LIMIT): string {
  const clean = question.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const boundary = clean.lastIndexOf(" ", limit - 1);
  return `${clean.slice(0, boundary > 0 ? boundary : limit).trimEnd()}…`;
}

export function orientationAnswer(orientation: Orientation | null | undefined, fallback = ""): OrientationAnswer {
  const answer = orientation?.answer?.trim() || fallback.trim();
  if (!answer) return {
    text: "",
    label: orientation?.answer_label || "No saved answer is available",
    path: orientation?.answer_path ?? null,
    state: orientation?.answer_state ?? "unavailable",
  };
  return {
    text: answer,
    label: orientation?.answer_label || "Saved matter answer",
    path: orientation?.answer_path ?? null,
    state: orientation?.answer_state ?? "current",
  };
}

export function visibleOrientationActions(orientation: Orientation | null | undefined): {
  primary: NextAction | null;
  secondary: NextAction[];
} {
  return {
    primary: orientation?.primary_action ?? null,
    secondary: (orientation?.secondary_actions ?? []).slice(0, 2),
  };
}

export function visibleRecapChanges<T>(changes: readonly T[] | null | undefined, expanded: boolean): T[] {
  return expanded ? [...(changes ?? [])] : (changes ?? []).slice(0, 3);
}

export function actionStateWord(action: NextAction): string {
  if (action.state === "ready") return "Ready";
  if (action.state === "waiting") return "Waiting";
  if (action.state === "running") return "Agent work";
  if (action.state === "failed") return "Failed";
  if (action.state === "complete") return "Complete";
  return "Unavailable";
}

export function actionOwnerText(action: NextAction): string | null {
  if (action.owner_name) return `For ${action.owner_name}`;
  if (action.actor_kind === "business") return "Waiting on the business";
  if (action.actor_kind === "agent") return "Themis.ai is working";
  return null;
}

const WORK_TARGET_KINDS = new Set<WorkTarget["kind"]>(["matter", "work_item", "question", "artifact", "handoff", "fact_request", "impact", "run"]);

/** A durable artifact may be opened by path before a server assigns a display ID. */
export function isOpenableWorkTarget(target: unknown): target is WorkTarget {
  if (!target || typeof target !== "object") return false;
  const value = target as { matter_id?: unknown; kind?: unknown; target_id?: unknown; path?: unknown };
  return typeof value.matter_id === "string"
    && value.matter_id.trim().length > 0
    && typeof value.kind === "string"
    && WORK_TARGET_KINDS.has(value.kind as WorkTarget["kind"])
    && ((typeof value.target_id === "string" && value.target_id.trim().length > 0) || (typeof value.path === "string" && value.path.trim().length > 0));
}

export function canRequestFact(questionState: string | undefined): boolean {
  return questionState === "open" || questionState === "left_open";
}

export function canCompareSuppliedSource(supportState: string | undefined): boolean {
  return supportState === "supplied";
}
