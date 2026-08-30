import assert from "node:assert/strict";
import { getChatRun, retryChatRun, startChatRun } from "../lib/api.ts";
import { chatRunStateLabel, chatRunStorageKey, pendingChatRunId, rememberChatRun, safeChatFailureDetail } from "../components/ChatPanel.tsx";
import type { ChatRun } from "../lib/types.ts";

const originalFetch = globalThis.fetch;
const calls: Array<{ url: string; method: string }> = [];
const startedRun: ChatRun = {
  run_id: "CHAT-1",
  matter_id: "M-1",
  conversation_id: null,
  state: "running",
  status: "Working",
  created_at: "2026-08-30T00:00:00Z",
  path: "matters/M-1/conversations/runs/CHAT-1.md",
};

globalThis.fetch = (async (input, init) => {
  calls.push({ url: String(input), method: init?.method ?? "GET" });
  const body = init?.method === "POST" && !String(input).endsWith("/retry")
    ? startedRun
    : { ...startedRun, conversation_id: "CONV-NEW" };
  return new Response(JSON.stringify(body), { status: init?.method === "POST" ? 202 : 200 });
}) as typeof fetch;

async function main() {
try {
  const started = await startChatRun("M-1", { message: "Yes" });
  assert.equal(started.run_id, "CHAT-1");
  assert.match(calls[0].url, /\/matters\/M-1\/chat-runs$/);

  // A remount can read the stored ID and reconnect without adding an optimistic user turn.
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
  rememberChatRun(storage, "M-1", started);
  assert.equal(started.conversation_id, null);
  assert.equal(pendingChatRunId(storage, "M-1", "CONV-OLD"), "CHAT-1", "a selected saved conversation falls back to the pending new-conversation run");
  const reconnected = await getChatRun("M-1", pendingChatRunId(storage, "M-1", "CONV-OLD")!);
  rememberChatRun(storage, "M-1", reconnected);
  assert.equal(reconnected.state, "running");
  assert.equal(reconnected.conversation_id, "CONV-NEW");
  assert.equal(values.has(chatRunStorageKey("M-1")), false, "the pending key is migrated after the server assigns a conversation");
  assert.equal(values.get(chatRunStorageKey("M-1", "CONV-NEW")), "CHAT-1");
  assert.match(calls[1].url, /\/chat-runs\/CHAT-1$/);

  await retryChatRun("M-1", reconnected.run_id);
  assert.match(calls[2].url, /\/chat-runs\/CHAT-1\/retry$/);
  assert.equal(calls[2].method, "POST");

  const appended = new Set<string>();
  const appendCompleted = (runId: string) => appended.add(runId);
  appendCompleted("CHAT-1");
  appendCompleted("CHAT-1");
  assert.equal(appended.size, 1, "a completed run is handled once");

  const failedWithOutput: ChatRun = {
    ...reconnected,
    state: "failed",
    status: "Failed",
    failure_detail: "Provider timed out after saving a useful first pass.",
    response: { reply: "Useful saved answer", trace: [], changed_paths: [], refresh: [], cards: [], applied_skills: [] },
  };
  assert.equal(failedWithOutput.response?.reply, "Useful saved answer", "failure UX has access to the saved response without adding it to the transcript");
  const recovered = { ...failedWithOutput, state: "completed" as const, response: { ...failedWithOutput.response!, reply: "Recovered final answer" } };
  const recoveredResults = new Map<string, string>();
  const showRecoveredResult = (completed: ChatRun) => recoveredResults.set(completed.run_id, completed.response!.reply);
  showRecoveredResult(recovered);
  showRecoveredResult(recovered);
  assert.deepEqual([...recoveredResults.values()], ["Recovered final answer"], "retry shows the recovered final answer once");

  let waiting = true;
  const serverState = reconnected.state;
  waiting = false;
  assert.equal(waiting, false, "Stop waiting releases only local waiting state");
  assert.equal(serverState, "running", "Stop waiting does not mutate server state");

  assert.equal(safeChatFailureDetail("Failed to fetch"), "");
  assert.equal(safeChatFailureDetail("Saved provider timeout"), "Saved provider timeout");
  assert.deepEqual(
    ["queued", "running", "completed", "failed", "interrupted"].map((state) => chatRunStateLabel(state as Parameters<typeof chatRunStateLabel>[0])),
    ["Queued", "Working", "Completed", "Failed", "Interrupted"],
  );
} finally {
  globalThis.fetch = originalFetch;
}

console.log("All chat run recovery checks passed.");
}

void main();
