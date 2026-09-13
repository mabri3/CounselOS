import type { FactRequest, Handoff, TeamView } from "./continuityTypes";
import type { InteractionReceipt } from "./workspaceTypes";

export type PresentationNotice = { tone: "healthy" | "attention" | "failure" | "agent"; word: string; detail: string };

type RetryCommand = { source_action_key: string };
type RetryEnvelope<T extends RetryCommand> = { version: 1; intent_signature: string; command: T };

/**
 * Reserved parent-draft convention. The parent persists these string values under
 * vault/person/matter, so a failed command survives refresh and component remount.
 */
export const RETRY_DRAFT_PREFIX = "__continuity.retry.v1";

export function retryDraftKey(panel: "fact-request" | "handoff" | "impact", slot: string): string {
  return `${RETRY_DRAFT_PREFIX}:${panel}:${slot}`;
}

export function recoverRetryCommand<T extends RetryCommand>(
  stored: string | undefined,
  intent: unknown,
  base: Omit<T, "source_action_key">,
  createKey: () => string,
): { command: T; serialized: string; reused: boolean } {
  const intentSignature = JSON.stringify(intent);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<RetryEnvelope<T>>;
      if (parsed.version === 1 && parsed.intent_signature === intentSignature && parsed.command && typeof parsed.command.source_action_key === "string") {
        return { command: parsed.command, serialized: stored, reused: true };
      }
    } catch {
      // A malformed reserved value is replaced on the next explicit submission.
    }
  }
  const command = { ...base, source_action_key: createKey() } as T;
  return { command, serialized: JSON.stringify({ version: 1, intent_signature: intentSignature, command }), reused: false };
}

const REQUEST_LABELS: Record<NonNullable<FactRequest["state"]>, string> = {
  prepared: "Prepared",
  requested_externally: "Requested externally",
  reply_saved: "Reply saved",
  answer_recorded: "Answer recorded",
  partly_answered: "Partly answered",
  left_open: "Left open",
};

const HANDOFF_LABELS: Record<NonNullable<Handoff["state"]>, string> = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
  withdrawn: "Withdrawn",
};

export const TEAM_VIEW_LABELS: Record<TeamView, string> = {
  my_work: "My work",
  waiting: "Waiting on others",
  team: "Team",
};

export function factRequestStateLabel(state?: FactRequest["state"]): string {
  return state ? REQUEST_LABELS[state] : "Prepared";
}

export function handoffStateLabel(state?: Handoff["state"]): string {
  return state ? HANDOFF_LABELS[state] : "Pending";
}

export function receiptNotice(receipt: InteractionReceipt, success: string): PresentationNotice {
  if (receipt.state === "applied") return { tone: "healthy", word: "Saved", detail: success };
  if (receipt.state === "proposed") return { tone: "attention", word: "Proposed", detail: "No recorded fact or ownership changed." };
  const labels: Record<string, string> = { reported_fact: "reported fact", supplied_reply: "exact reply", question_link: "question link", request_record: "request record", ownership: "ownership change", handoff_record: "handoff record" };
  const completed = receipt.completed_parts ?? [];
  const saved = completed.length ? ` Saved: ${completed.map((part) => labels[part] ?? part.replaceAll("_", " ")).join(", ")}.` : "";
  return { tone: "failure", word: completed.length ? "Partly saved" : "Not saved", detail: `${receipt.failure_detail || "The action did not finish."}${saved} Your input is retained for retry.` };
}

export function preparationNotice(state: string, subject: string, unchanged: string): PresentationNotice {
  if (state === "completed") return { tone: "agent", word: "Ready", detail: `${subject} is ready to edit. ${unchanged}` };
  if (state === "queued") return { tone: "agent", word: "Queued", detail: `${subject} is queued. ${unchanged}` };
  if (state === "running") return { tone: "agent", word: "Working", detail: `${subject} is being prepared. ${unchanged}` };
  if (state === "failed") return { tone: "failure", word: "Failed", detail: `${subject} was not prepared. The saved action is retained for retry. ${unchanged}` };
  if (state === "interrupted") return { tone: "failure", word: "Interrupted", detail: `${subject} preparation was interrupted. The saved action is retained for retry. ${unchanged}` };
  return { tone: "attention", word: "Pending", detail: `${subject} has status “${state}”. ${unchanged}` };
}

export function handoffActions(handoff: Handoff, actorId: string): Array<"accept" | "decline" | "withdraw" | "return"> {
  const state = handoff.state ?? "pending";
  if (state === "pending" && handoff.recipient.person_id === actorId) return ["accept", "decline"];
  if (state === "pending" && handoff.sender.person_id === actorId) return ["withdraw"];
  if (state === "accepted" && handoff.recipient.person_id === actorId && !handoff.return_handoff_id) return ["return"];
  return [];
}

export function splitOpenQuestions(value: string): string[] {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

export function newActionKey(prefix: string): string {
  return `${prefix}:${crypto.randomUUID()}`;
}
