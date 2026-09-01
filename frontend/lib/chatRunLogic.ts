export type RunStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const chatRunStorageKey = (matterId: string, conversationId?: string | null) =>
  `themis.ai:chat-run:${matterId}:${conversationId || "new"}`;

export const legacyChatRunStorageKey = (matterId: string, conversationId?: string | null) =>
  `counsel-os:chat-run:${matterId}:${conversationId || "new"}`;

export const chatDraftStorageKey = (matterId: string) => `themis.ai:chat-draft:${matterId}`;
export const legacyChatDraftStorageKey = (matterId: string) => `counsel-os:chat-draft:${matterId}`;

export function remainingComposerValue<T>(
  current: T,
  submittedSnapshot: T,
  consumedBySubmission: boolean,
  emptyValue: T,
): T {
  return consumedBySubmission && current === submittedSnapshot ? emptyValue : current;
}

export function mergeChatMessages<T extends { message_id?: string; role: string; content: string }>(local: T[], saved: T[]): T[] {
  const keys = new Set(saved.flatMap((item) => [item.message_id, `${item.role}:${item.content}`]).filter(Boolean));
  const savedHasUser = saved.some((item) => item.role === "user");
  return [...saved, ...local.filter((item) => (
    !keys.has(item.message_id)
    && !keys.has(`${item.role}:${item.content}`)
    && !(savedHasUser && item.role === "user" && !item.message_id)
  ))];
}

export function pendingChatRunId(storage: RunStorage, matterId: string, conversationId?: string | null): string | null {
  return storage.getItem(chatRunStorageKey(matterId, conversationId))
    ?? storage.getItem(chatRunStorageKey(matterId))
    ?? storage.getItem(legacyChatRunStorageKey(matterId, conversationId))
    ?? storage.getItem(legacyChatRunStorageKey(matterId));
}

export function rememberChatRun(
  storage: RunStorage,
  matterId: string,
  run: { run_id: string; conversation_id?: string | null },
): void {
  const pendingKey = chatRunStorageKey(matterId);
  const conversationKey = chatRunStorageKey(matterId, run.conversation_id);
  storage.setItem(conversationKey, run.run_id);
  storage.removeItem(legacyChatRunStorageKey(matterId, run.conversation_id));
  storage.removeItem(legacyChatRunStorageKey(matterId));
  if (run.conversation_id) storage.removeItem(pendingKey);
  else storage.setItem(pendingKey, run.run_id);
}

export function chatRunStateLabel(state: "queued" | "running" | "completed" | "failed" | "interrupted"): string {
  return { queued: "Queued", running: "Working", completed: "Completed", failed: "Failed", interrupted: "Interrupted" }[state];
}

export function shouldShowChatRunStatus(state: "queued" | "running" | "completed" | "failed" | "interrupted"): boolean {
  return state !== "completed";
}

export function safeChatFailureDetail(detail?: string | null): string {
  if (!detail || /failed to fetch/i.test(detail) || /https?:\/\//i.test(detail) || detail.length > 240) return "";
  return detail;
}

export function chatAgentId(intakeActive: boolean, activeAgentId?: string | null): string {
  if (intakeActive) return "intake-agent";
  return activeAgentId || "counsel-copilot";
}

export function needsIntakeQuestionRecovery(
  intakeActive: boolean,
  messages: Array<{ role: string; cards?: Array<{ type: string }> }>,
): boolean {
  if (!intakeActive) return false;
  const latest = messages.at(-1);
  return Boolean(
    latest?.role === "assistant"
    && !latest.cards?.some((card) => card.type === "question"),
  );
}

export type HistoricalQuestionState = {
  state: "active" | "answered" | "superseded" | "stopped";
  values: string[];
};

type HistoricalChatMessage = {
  message_id?: string;
  role: string;
  content: string;
  cards?: Array<{ type: string; question_id?: string }>;
  card_action?: {
    card_id: string;
    action: string;
    values?: string[];
    answers?: Array<{ card_id: string; action: "answer" | "skip"; values?: string[] }>;
  } | null;
};

export function historicalQuestionStates(
  messages: HistoricalChatMessage[],
  messageIndex: number,
  questionIds: string[],
  intakeActive: boolean,
): Record<string, HistoricalQuestionState> {
  const states: Record<string, HistoricalQuestionState> = Object.fromEntries(
    questionIds.map((id) => [id, { state: "active", values: [] }]),
  );
  const laterSavedMessages = messages.slice(messageIndex + 1).filter((message) => message.message_id);
  let stopped = false;

  for (const message of laterSavedMessages) {
    if (message.role !== "user" || !message.card_action) continue;
    const action = message.card_action;
    if (action.action === "answer" && states[action.card_id]) {
      states[action.card_id] = { state: "answered", values: action.values ?? [] };
    } else if (action.action === "skip" && states[action.card_id]) {
      states[action.card_id] = { state: "superseded", values: [] };
    } else if (action.action === "answer_set") {
      for (const answer of action.answers ?? []) {
        if (!states[answer.card_id]) continue;
        states[answer.card_id] = answer.action === "answer"
          ? { state: "answered", values: answer.values ?? [] }
          : { state: "superseded", values: [] };
      }
    } else if (action.action === "stop" && states[action.card_id]) {
      stopped = true;
    }
  }

  for (const id of questionIds) {
    if (states[id].state !== "active") continue;
    if (stopped) states[id] = { state: "stopped", values: [] };
    else if (!intakeActive || laterSavedMessages.length > 0) {
      states[id] = { state: "superseded", values: [] };
    }
  }
  return states;
}
