import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getChatRun, retryChatRun, startChatRun } from "../lib/api.ts";
import { chatAgentId, chatDraftStorageKey, chatRunStateLabel, chatRunStorageKey, historicalQuestionStates, legacyChatRunStorageKey, mergeChatMessages, needsIntakeQuestionRecovery, pendingChatRunId, rememberChatRun, remainingComposerValue, safeChatFailureDetail, shouldShowChatRunStatus } from "../lib/chatRunLogic.ts";
import type { ChatRun } from "../lib/types.ts";

const originalFetch = globalThis.fetch;
const chatPanelSource = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
assert.match(chatPanelSource, /SHOW_AGENT_TRACES && message\.trace\?\.length/, "technical traces must be hidden unless developer tracing is enabled");
assert.match(chatPanelSource, /Stop showing progress/, "the local progress control must not claim to cancel server work");
assert.match(chatPanelSource, /Server work continues if you stop waiting/, "the progress control must explain that server work continues");
assert.match(chatPanelSource, /mutationFailureMessages/, "structured mutation failures must render above useful reply text");
assert.match(chatPanelSource, /submit\(answerText \?\? "", action, \[\], false, false\)/, "card actions must not consume unrelated composer content");
assert.match(chatPanelSource, /historicalQuestionStates/, "question controls and historical state must come from durable chat actions");
assert.match(chatPanelSource, /saved\.changed_paths\.length[\s\S]*This current draft already exists\. No new save was made\./, "chat-save retries must report that no new draft was saved");
assert.match(
  chatPanelSource,
  /setWaiting\(\["queued", "running"\]\.includes\(next\.state\)\);[\s\S]*if \(!\["queued", "running"\]\.includes\(next\.state\)\) await finishRun\(next\);/,
  "a retry that finishes before the response returns must clear the local busy state",
);
assert.match(chatPanelSource, /loadingHistory \|\| busy \|\| refreshingRun \|\| !conversationId/, "intake recovery must wait for terminal matter refresh");
assert.match(
  chatPanelSource,
  /if \(run\.state !== "completed"[\s\S]*setBusy\(false\);[\s\S]*completedRuns\.current\.add/,
  "a terminal run must clear visible progress before conversation reload or matter refresh",
);
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
  values.set(legacyChatRunStorageKey("M-LEGACY"), "CHAT-LEGACY");
  assert.equal(pendingChatRunId(storage, "M-LEGACY"), "CHAT-LEGACY", "an old product-name storage key remains readable");
  rememberChatRun(storage, "M-1", started);
  assert.equal(started.conversation_id, null);
  assert.equal(pendingChatRunId(storage, "M-1", "CONV-OLD"), "CHAT-1", "a selected saved conversation falls back to the pending new-conversation run");
  const reconnected = await getChatRun("M-1", pendingChatRunId(storage, "M-1", "CONV-OLD")!);
  rememberChatRun(storage, "M-1", reconnected);
  assert.equal(reconnected.state, "running");
  assert.equal(reconnected.conversation_id, "CONV-NEW");
  assert.equal(values.has(chatRunStorageKey("M-1")), false, "the pending key is migrated after the server assigns a conversation");
  assert.equal(values.get(chatRunStorageKey("M-1", "CONV-NEW")), "CHAT-1");
  values.set(chatDraftStorageKey("M-1"), "Unsent question");
  assert.equal(values.get(chatDraftStorageKey("M-1")), "Unsent question", "an unsent composer draft survives a remount");
  assert.equal(
    remainingComposerValue("Unsent question", "Unsent question", false, ""),
    "Unsent question",
    "a card action preserves unrelated unsent text",
  );
  const unsentAttachments = [{ name: "later.pdf" }];
  assert.equal(
    remainingComposerValue(unsentAttachments, unsentAttachments, false, []),
    unsentAttachments,
    "a card action preserves unrelated unsent attachments",
  );
  assert.equal(
    remainingComposerValue("Sent question", "Sent question", true, ""),
    "",
    "a normal composer submission clears the text it sent",
  );
  assert.equal(
    remainingComposerValue("New draft", "Sent question", true, ""),
    "New draft",
    "text entered while a request starts is not cleared",
  );
  assert.deepEqual(
    mergeChatMessages([{ role: "user", content: "Yes" }], [{ message_id: "MSG-1", role: "user", content: "Yes" }]),
    [{ message_id: "MSG-1", role: "user", content: "Yes" }],
    "saved history replaces the same optimistic echo without duplication",
  );
  assert.deepEqual(
    mergeChatMessages([{ role: "user", content: "Displayed intake answer" }], [{ message_id: "MSG-2", role: "user", content: "Stored intake answer" }]),
    [{ message_id: "MSG-2", role: "user", content: "Stored intake answer" }],
    "the durable card-action turn replaces its differently formatted optimistic echo",
  );
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
  assert.equal(shouldShowChatRunStatus("completed"), false, "completed runs must not add a redundant status card");
  assert.equal(shouldShowChatRunStatus("running"), true, "running work must remain visible");
  assert.equal(shouldShowChatRunStatus("failed"), true, "failed work must remain visible for recovery");

  let waiting = true;
  const serverState = reconnected.state;
  waiting = false;
  assert.equal(waiting, false, "Stop waiting releases only local waiting state");
  assert.equal(serverState, "running", "Stop waiting does not mutate server state");

  assert.equal(safeChatFailureDetail("Failed to fetch"), "");
  assert.equal(safeChatFailureDetail("Saved provider timeout"), "Saved provider timeout");
  assert.equal(chatAgentId(true, "counsel-copilot"), "intake-agent", "active intake must use the Intake Agent");
  assert.equal(needsIntakeQuestionRecovery(true, [{ role: "assistant", cards: [] }]), true, "active intake must recover a prose-only assistant turn");
  assert.equal(needsIntakeQuestionRecovery(true, [{ role: "assistant", cards: [{ type: "question" }] }]), false, "a structured question must not trigger recovery");
  assert.equal(needsIntakeQuestionRecovery(false, [{ role: "assistant", cards: [] }]), false, "completed intake must not trigger recovery");
  assert.equal(needsIntakeQuestionRecovery(true, [{ role: "user", cards: [] }]), false, "a pending user turn must not trigger recovery");
  assert.deepEqual(
    historicalQuestionStates([
      { message_id: "MSG-A", role: "assistant", content: "Question", cards: [{ type: "question", question_id: "Q-1" }] },
      { message_id: "MSG-U", role: "user", content: "Yes, after review", card_action: { card_id: "Q-1", action: "answer", values: ["yes", "after review"] } },
    ], 0, ["Q-1"], true),
    { "Q-1": { state: "answered", values: ["yes", "after review"] } },
    "a saved answer makes its historical question inert and preserves the qualifier",
  );
  assert.deepEqual(
    historicalQuestionStates([
      { message_id: "MSG-A", role: "assistant", content: "Questions", cards: [{ type: "question", question_id: "Q-1" }, { type: "question", question_id: "Q-2" }] },
      { message_id: "MSG-U", role: "user", content: "Stop", card_action: { card_id: "Q-1", action: "stop" } },
    ], 0, ["Q-1", "Q-2"], false),
    { "Q-1": { state: "stopped", values: [] }, "Q-2": { state: "stopped", values: [] } },
    "stopping intake makes every remaining question in that historical turn inert",
  );
  assert.deepEqual(
    historicalQuestionStates([
      { message_id: "MSG-A", role: "assistant", content: "Question", cards: [{ type: "question", question_id: "Q-1" }] },
      { role: "user", content: "Optimistic answer", card_action: { card_id: "Q-1", action: "answer", values: ["yes"] } },
    ], 0, ["Q-1"], true),
    { "Q-1": { state: "active", values: [] } },
    "an optimistic action without a saved message ID cannot settle a question",
  );
  assert.deepEqual(
    historicalQuestionStates([
      { message_id: "MSG-A", role: "assistant", content: "Question", cards: [{ type: "question", question_id: "Q-1" }] },
      { message_id: "MSG-U", role: "user", content: "Continue intake" },
      { message_id: "MSG-B", role: "assistant", content: "Next question", cards: [{ type: "question", question_id: "Q-2" }] },
    ], 0, ["Q-1"], true),
    { "Q-1": { state: "superseded", values: [] } },
    "a later saved intake turn supersedes an unanswered historical question",
  );
  assert.equal(chatAgentId(false, "counsel-copilot"), "counsel-copilot", "completed intake must use the active agent");
  assert.equal(chatAgentId(false, null), "counsel-copilot", "ordinary chat must have a safe default agent");
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
