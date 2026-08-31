export type RunStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const chatRunStorageKey = (matterId: string, conversationId?: string | null) =>
  `counsel-os:chat-run:${matterId}:${conversationId || "new"}`;

export function pendingChatRunId(storage: RunStorage, matterId: string, conversationId?: string | null): string | null {
  return storage.getItem(chatRunStorageKey(matterId, conversationId))
    ?? storage.getItem(chatRunStorageKey(matterId));
}

export function rememberChatRun(
  storage: RunStorage,
  matterId: string,
  run: { run_id: string; conversation_id?: string | null },
): void {
  const pendingKey = chatRunStorageKey(matterId);
  const conversationKey = chatRunStorageKey(matterId, run.conversation_id);
  storage.setItem(conversationKey, run.run_id);
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
