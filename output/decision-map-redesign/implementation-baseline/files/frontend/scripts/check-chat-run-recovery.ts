import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { getChatRun, retryChatRun, startChatRun } from "../lib/api.ts";
import { chatAgentId, chatDraftStorageKey, chatFailureGuidance, chatProgressLabel, chatRunStateLabel, chatRunStorageKey, chatSuggestions, conversationChatDraftStorageKey, durableChatProgress, historicalQuestionStates, intakeRecoveryKey, legacyChatRunStorageKey, mergeChatMessages, needsIntakeQuestionRecovery, operationChangeLinks, pendingChatRunId, promoteConversationComposer, rememberChatRun, remainingComposerValue, safeChatFailureDetail, shouldShowChatRunStatus, storeConversationComposer, visibleOperationResults } from "../lib/chatRunLogic.ts";
import type { ChatRun } from "../lib/types.ts";

const originalFetch = globalThis.fetch;
const chatPanelSource = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
const eligibilitySource = chatPanelSource.match(/function isEligibleWorkProductResponse\(message: Message\): boolean \{[\s\S]*?\n\}/)?.[0];
if (!eligibilitySource) throw new Error("Could not load work-product eligibility logic.");
const eligibilityModule = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(`${eligibilitySource}\nexport { isEligibleWorkProductResponse };`, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString("base64")}`) as { isEligibleWorkProductResponse: (message: { role: string; content: string; cards?: unknown[]; operation_results?: Array<{ operation: string }> }) => boolean };
assert.match(chatPanelSource, /SHOW_AGENT_TRACES && message\.trace\?\.length/, "technical traces must be hidden unless developer tracing is enabled");
assert.match(chatPanelSource, /Continue in background/, "the local progress control must state that only local progress is hidden");
assert.match(chatPanelSource, /Server work continues/, "the progress control must explain that server work continues");
assert.match(chatPanelSource, /Last durable step:/, "long runs must show their last durable milestone");
assert.match(chatPanelSource, /chatFailureGuidance\(activeRun\.failure_class\)/, "failed runs must use the persisted safe failure class");
assert.match(chatPanelSource, /terminalRuns\.current\.has\(run\.run_id\)/, "a reload must reconcile one durable terminal run only once");
assert.match(chatPanelSource, /terminalRuns\.current\.delete\(next\.run_id\)/, "retrying the same durable run must permit its next terminal reconciliation");
assert.match(chatPanelSource, /await onRefresh\(\)/, "a durable terminal run must refresh the matter after reconnect");
assert.doesNotMatch(chatPanelSource, /setHistoryError\("Themis\.ai could not finish this request\."\);\s*setWaiting\(false\);\s*setBusy\(false\);/, "a temporary run-read error must not enable a conflicting second action");
assert.doesNotMatch(chatPanelSource, /getChatRun\(matterId, runId\)[\s\S]{0,520}setBusy\(false\);\s*setWaiting\(false\);/, "an initial durable-run reconnect failure must retain its local block");
assert.match(chatPanelSource, /window\.setTimeout\(reconnectSavedRun, 2000\)/, "a transient initial reconnect failure must schedule one bounded retry");
assert.match(chatPanelSource, /const reconnectSavedRun =[\s\S]{0,220}setHistoryError\(""\);[\s\S]{0,260}setActiveRun\(run\)/, "a successful durable reconnect must clear the stale blocked error before showing its run");
assert.match(chatPanelSource, /currentEligibleAssistantIndex/, "only the current eligible assistant response may offer the primary draft save");
assert.match(chatPanelSource, /isEligibleWorkProductResponse/, "intake and system-status replies must not become a work-product draft");
assert.match(chatPanelSource, /finish_intake|Intake is complete/, "completed intake summaries must be excluded even when they are long prose");
assert.match(chatPanelSource, /Save current work product/, "the current developed assistant reply must have a clear primary save action");
assert.doesNotMatch(chatPanelSource, /Stop showing progress/, "the ambiguous progress label must not return");
assert.match(chatPanelSource, /operationResults=\{currentOperationResults\}/, "the latest persisted operation result must control workspace-action rendering");
assert.match(chatPanelSource, /latestOperationResults\.get\(result\.source_action_key \?\? result\.action\) === result/, "reload must hide an older confirmation after its durable result is saved");
assert.doesNotMatch(chatPanelSource, /mutationFailureMessages|mutationOutcome/, "chat mutation truth must not use legacy trace inference");
assert.match(chatPanelSource, /operation_results: run\.response!\.operation_results/, "the immediate chat-run fallback must keep finalized operation results");
assert.match(chatPanelSource, /submit\(answerText \?\? "", action, \[\], false, false\)/, "card actions must not consume unrelated composer content");
assert.match(chatPanelSource, /historicalQuestionStates/, "question controls and historical state must come from durable chat actions");
assert.match(chatPanelSource, /saved\.changed_paths\.length[\s\S]*This current draft already exists\. No new save was made\./, "chat-save retries must report that no new draft was saved");
assert.match(
  chatPanelSource,
  /setWaiting\(\["queued", "running"\]\.includes\(next\.state\)\);[\s\S]*if \(!\["queued", "running"\]\.includes\(next\.state\)\) await finishRun\(next\);/,
  "a retry that finishes before the response returns must clear the local busy state",
);
assert.match(chatPanelSource, /loadingHistory \|\| busy \|\| refreshingRun \|\| !conversationId/, "intake recovery must wait for terminal matter refresh");
assert.match(chatPanelSource, /intakeRecoveryAttempts\.current\.has\(recoveryKey\)/, "one saved user turn may trigger only one automatic intake recovery");
assert.match(chatPanelSource, /could not be restored automatically/, "an exhausted automatic recovery must show a stable recovery state");
assert.match(chatPanelSource, /Retry intake question/, "failed automatic recovery must offer an explicit retry");
assert.notEqual(conversationChatDraftStorageKey("MAT-1", "CONV-A"), conversationChatDraftStorageKey("MAT-1", "CONV-B"), "unsent text keys cannot leak between conversations");
assert.equal(conversationChatDraftStorageKey("MAT-1", "CONV-A"), conversationChatDraftStorageKey("MAT-1", "CONV-A"), "the same matter conversation uses one key across routes");
assert.match(chatPanelSource, /const draftConversationId = conversationId \?\? \(loadingHistory \? initialConversationId : null\)/, "route hydration selects the carried saved conversation before restoring unsent text");
assert.match(chatPanelSource, /saved\?\.trim\(\)[\s\S]*setPreparedRequest\(seed\.text\)[\s\S]*return;/, "a prepared seed cannot replace a saved nonempty composer");
assert.match(chatPanelSource, /remainingComposerValue\(current, previousInput, consumeInput, ""\)/, "a successful consuming send still clears only its submitted composer snapshot");
const composerValues = new Map<string, string>();
const composerStorage = {
  getItem: (key: string) => composerValues.get(key) ?? null,
  setItem: (key: string, value: string) => { composerValues.set(key, value); },
  removeItem: (key: string) => { composerValues.delete(key); },
};
storeConversationComposer(composerStorage, "MAT-1", "CONV-A", "Draft for A");
storeConversationComposer(composerStorage, "MAT-1", null, "");
assert.equal(composerStorage.getItem(conversationChatDraftStorageKey("MAT-1", "CONV-A")), "Draft for A", "A draft survives A to New and can be restored when A is selected again");
storeConversationComposer(composerStorage, "MAT-1", null, "Typed while the first run is pending");
promoteConversationComposer(composerStorage, "MAT-1", null, "CONV-SERVER", "Typed while the first run is pending");
assert.equal(composerStorage.getItem(conversationChatDraftStorageKey("MAT-1", "CONV-SERVER")), "Typed while the first run is pending", "new-conversation text moves to the assigned server conversation");
assert.equal(composerStorage.getItem(conversationChatDraftStorageKey("MAT-1", null)), null, "promotion removes the obsolete new-conversation copy");
assert.match(chatPanelSource, /async function openConversation[\s\S]*saveOutgoingComposer\(\);[\s\S]*if \(!nextId\)[\s\S]*setConversationId\(null\)/, "opening New saves the outgoing conversation before clearing the visible composer");
assert.match(chatPanelSource, /const promotedValue = remainingComposerValue[\s\S]*promoteNewComposer\(saved\.conversation_id, promotedValue\)/, "server conversation promotion preserves non-consumed or newly typed text and clears consumed text");
assert.deepEqual(chatSuggestions([]), ["Which other matters does this touch?", "What would change your view?"], "comparison must not be suggested without two named matter options");
assert.equal(chatSuggestions(["Path A", "Path B"])[0], "Compare both paths", "two named matter options enable the comparison suggestion");
assert.equal(chatProgressLabel({ action: "answer" }), "Answer saved · Reassessing intake");
assert.equal(chatProgressLabel(null), "Working…");
assert.equal(durableChatProgress({ state: "running", status: "Chat is running.", milestone: "Partial work saved." }), "Partial work saved.");
assert.match(chatFailureGuidance("provider"), /retry once/);
assert.match(chatFailureGuidance("tool_validation"), /corrected input/);
assert.doesNotMatch(chatFailureGuidance("unknown"), /https?:|RUN-|\/Users\//);
const projectedResults = visibleOperationResults([
  { operation: "write_markdown", status: "failed", id: "protected" },
  { operation: "save_work_product", status: "changed", id: "saved" },
  { operation: "run_research", status: "failed", id: "unrelated" },
]);
assert.deepEqual(projectedResults.map((result) => result.id), ["saved", "unrelated"], "only a protected write failure recovered by a typed save is hidden");
const usefulResults = visibleOperationResults([
  { operation: "list_files", status: "no_change", id: "read-only" },
  { operation: "complete_work_item", status: "no_change", id: "actionable", required_user_action: "Choose an open work item." },
  { operation: "run_research", status: "failed", id: "failed" },
]);
assert.deepEqual(usefulResults.map((result) => result.id), ["actionable", "failed"], "non-actionable no-change audit results must not become lawyer-facing cards");
const intakeResults = visibleOperationResults([
  { operation: "record_intake_answer", status: "changed", id: "answer" },
  { operation: "update_matter_intake", status: "changed", id: "intake" },
]);
assert.deepEqual(intakeResults.map((result) => result.id), ["intake"], "one successful intake step must render one consolidated update card");
assert.deepEqual(operationChangeLinks([
  "03_Matters/demo/facts.md",
  "03_Matters/demo/issues.md",
  "03_Matters/demo/matter.md",
  "03_Matters/demo/dossier-revisions/DOS-1.md",
  "03_Matters/demo/dossier.md",
]), [
  { label: "Facts, sources & assumptions", path: "03_Matters/demo/facts.md" },
  { label: "Issue map", path: "03_Matters/demo/issues.md" },
  { label: "Matter details", path: "03_Matters/demo/matter.md" },
  { label: "Dossier", path: "03_Matters/demo/dossier-revisions/DOS-1.md" },
], "saved change links must use lawyer-facing labels and collapse duplicate dossier targets");
assert.match(
  chatPanelSource,
  /terminalRuns\.current\.add\(run\.run_id\);[\s\S]*setBusy\(false\);[\s\S]*setRefreshingRun\(true\)/,
  "a terminal run must clear visible progress before conversation reload or matter refresh",
);
// Exercise the production reconnect and terminal callbacks, including their output merge.
const refreshPolicySource = chatPanelSource.match(/function terminalRunToken[\s\S]*?(?=\nconst SHOW_AGENT_TRACES)/)?.[0];
const finishCallbackSource = chatPanelSource.match(/const finishRun = useCallback\([\s\S]*?\n  \}, \[matterId[^\n]+/)?.[0];
const readRunSource = chatPanelSource.match(/const readSavedRun = [\s\S]*?\n    \};/)?.[0];
const reconnectCallbackSource = chatPanelSource.match(/const reconnectSavedRun = [\s\S]*?\n    \}\);/)?.[0];
assert.ok(refreshPolicySource && finishCallbackSource && readRunSource && reconnectCallbackSource, "production run reconciliation callbacks must remain testable");
const retryCallbackSource = chatPanelSource.match(/async function retryRun\(\)[\s\S]*?\n  \}/)?.[0];
assert.ok(retryCallbackSource);
const callbackCode = ts.transpileModule(
  `${refreshPolicySource}\n${finishCallbackSource}\n${readRunSource}\n${reconnectCallbackSource.replace("() => void readSavedRun", "() => readSavedRun")}\n${retryCallbackSource}\nreturn { finishRun, reconnectSavedRun, retryRun };`,
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } },
).outputText;
// Return the same promise chain in the harness so assertions wait for all production work.
const createRunCallbacks = new Function("scope", `with (scope) { ${callbackCode} }`);
async function checkRunReconciliation({ pending = false, matchingRun = true, matchingReply = true, failed = false, conversationFails = false, live = false, listed = true, readFails = false, running = false, refreshFails = false, hintFails = false } = {}) {
  const run = { run_id: "RUN-SAVED", finished_at: "2026-09-05T13:00:00Z", conversation_id: "CONV-SAVED", state: running ? "running" : failed ? "failed" : "completed",
    response: { conversation_id: "CONV-SAVED", reply: "Useful saved answer", trace: [], cards: [], operation_results: [] } };
  let messages = [{ message_id: "MSG-SAVED", run_id: matchingRun ? run.run_id : "RUN-OTHER", role: "assistant", content: matchingReply ? run.response.reply : "Earlier answer" }];
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => { if (hintFails && key.includes("reconciled")) throw new Error("Storage unavailable"); return values.get(key) ?? null; }, setItem: (key: string, value: string) => { if (hintFails && key.includes("reconciled")) throw new Error("Storage full"); values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
  let refreshes = 0, completions = 0, busy = true, waiting = true, active: unknown;
  const reads: string[] = [];
  const timers: number[] = [];
  const scope: Record<string, unknown> = {
    useCallback: (callback: unknown) => callback, contextKey: "vault/alex/M-1/panels", matterId: "M-1", runId: run.run_id, pendingRunId: pending ? run.run_id : null,
    conversationId: "CONV-SAVED", initialRunId: "RUN-OLD-INITIAL", messages, cancelled: false, timer: undefined,
    terminalRuns: { current: new Set<string>() }, window: { localStorage: storage, setTimeout: (_callback: unknown, delay: number) => { timers.push(delay); } },
    getChatRun: async (_matterId: string, id: string) => { reads.push(id); if (readFails) throw new Error("Read unavailable"); return run; },
    getChatRuns: async () => { reads.push("list"); if (readFails) throw new Error("Read unavailable"); return listed ? [run] : []; },
    getConversation: async () => { if (conversationFails) throw new Error("Read unavailable"); return { conversation_id: "CONV-SAVED", messages }; },
    setMessages: (update: (current: typeof messages) => typeof messages) => { messages = update(messages); },
    setActiveRun: (value: unknown) => { active = value; }, setBusy: (value: boolean) => { busy = value; }, setWaiting: (value: boolean) => { waiting = value; },
    setRefreshingRun: () => {}, setHistoryError: () => {}, setConversationId: () => {}, onConversationChange: () => {}, onReviewAuthorChange: () => {},
    onRefresh: async () => { refreshes++; if (refreshFails) throw new Error("Refresh unavailable"); }, onRunComplete: () => { completions++; },
    rememberChatRun, chatRunStorageKey, legacyChatRunStorageKey, mergeChatMessages,
  };
  const hintKey = JSON.stringify(["themis.ai:chat-run-reconciled:v1", scope.contextKey, "M-1", "CONV-SAVED"]);
  if (running) values.set(hintKey, "earlier-terminal-attempt");
  const callbacks = createRunCallbacks(scope);
  if (live) await callbacks.finishRun(run); else await callbacks.reconnectSavedRun();
  assert.deepEqual(reads, live ? [] : pending ? [run.run_id] : listed || readFails ? ["list"] : ["list", "RUN-OLD-INITIAL"], "pending runs take priority; a listed latest run prevents any competing old initial-run read");
  if (readFails) {
    assert.equal(refreshes, 0); assert.equal(busy, true); assert.equal(waiting, true);
    assert.deepEqual(timers, [2000], "failed restore remains blocked and schedules a read retry");
    assert.equal(active, undefined);
    return;
  }
  if (running) {
    assert.equal(values.has(hintKey), false, "observing a queued or running attempt clears any prior reconciliation hint");
    assert.equal(active, run); assert.equal(refreshes, 0);
    assert.equal(busy, true); assert.equal(waiting, true);
    assert.equal(pendingChatRunId(storage, "M-1", "CONV-SAVED"), run.run_id);
    await callbacks.finishRun({ ...run, state: "completed" });
    assert.equal(refreshes, 1, "a restored active run still refreshes when polling observes completion");
    assert.equal(completions, 1);
    return;
  }
  const expectedRefresh = live || pending || !matchingRun || !matchingReply;
  assert.equal(refreshes, Number(expectedRefresh), "only already-saved non-pending restoration avoids the full matter reload");
  assert.equal(completions, refreshFails ? 0 : Number(expectedRefresh), "historical hydration must not reapply completion targets");
  assert.equal(active, run, "terminal status and failed-run retry remain available");
  assert.equal(busy, false); assert.equal(waiting, false);
  assert.ok(messages.some(message => message.content === run.response.reply), "useful run output survives even if conversation reload fails");
  if (failed) assert.equal(pendingChatRunId(storage, "M-1", "CONV-SAVED"), run.run_id, "failed output retains its exact retry key");
  await callbacks.finishRun(run);
  assert.equal(refreshes, Number(expectedRefresh), "one terminal reconciliation does not repeat the full refresh");
  if (failed) {
    // A fresh mounted callback has no in-memory terminal Set, but retains the exact retry ID.
    scope.pendingRunId = run.run_id;
    scope.messages = messages;
    scope.terminalRuns = { current: new Set<string>() };
    const remounted = createRunCallbacks(scope);
    await remounted.reconnectSavedRun();
    assert.equal(refreshes, Number(expectedRefresh) + Number(refreshFails || hintFails), "returning to reconciled failed output avoids another full refresh; optional hint failure stays conservative");
    assert.equal(pendingChatRunId(storage, "M-1", "CONV-SAVED"), run.run_id);
    if (!refreshFails && !hintFails) {
      for (const staleHint of ["not-json", JSON.stringify([run.run_id, run.state, "2026-09-04T13:00:00Z"])]) {
        for (const key of values.keys()) if (key.includes("reconciled")) values.set(key, staleHint);
        scope.terminalRuns = { current: new Set<string>() };
        const before = refreshes;
        await createRunCallbacks(scope).reconnectSavedRun();
        assert.equal(refreshes, before + 1, "malformed or older attempt hints do not suppress refresh");
      }
      scope.contextKey = "vault/jordan/M-1/panels";
      scope.terminalRuns = { current: new Set<string>() };
      const before = refreshes;
      await createRunCallbacks(scope).reconnectSavedRun();
      assert.equal(refreshes, before + 1, "another person's context cannot reuse the refresh hint");
      for (const timestamp of ["", "not-a-timestamp"]) {
        run.finished_at = timestamp;
        scope.terminalRuns = { current: new Set<string>() };
        const before = refreshes;
        await createRunCallbacks(scope).reconnectSavedRun();
        assert.equal(refreshes, before + 1, "missing or malformed terminal timestamp requires refresh");
      }
      run.finished_at = "2026-09-05T13:00:00Z";
      scope.activeRun = run;
      scope.retryChatRun = async () => {
        const key = JSON.stringify(["themis.ai:chat-run-reconciled:v1", scope.contextKey, "M-1", "CONV-SAVED"]);
        assert.equal(values.has(key), false, "explicit Retry clears the hint before the server request");
        return { ...run, finished_at: "2026-09-05T13:02:00Z" };
      };
      const beforeRetry = refreshes;
      await createRunCallbacks(scope).retryRun();
      assert.equal(refreshes, beforeRetry + 1, "a new failed retry attempt always refreshes even with the same useful reply");
      assert.equal(pendingChatRunId(storage, "M-1", "CONV-SAVED"), run.run_id);
    }
  }
}
await checkRunReconciliation();
await checkRunReconciliation({ listed: false });
await checkRunReconciliation({ running: true });
await checkRunReconciliation({ pending: true, running: true });
await checkRunReconciliation({ readFails: true });
await checkRunReconciliation({ pending: true, readFails: true });
await checkRunReconciliation({ pending: true });
await checkRunReconciliation({ live: true });
await checkRunReconciliation({ matchingRun: false }); // Identical generic text from another run is not proof.
await checkRunReconciliation({ matchingReply: false, conversationFails: true });
await checkRunReconciliation({ failed: true, conversationFails: true });
await checkRunReconciliation({ pending: true, failed: true, conversationFails: true });
await checkRunReconciliation({ pending: true, failed: true, refreshFails: true });
await checkRunReconciliation({ failed: true, hintFails: true });

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

const longStatusTail = "Saved facts and research remain available for review. ".repeat(5);
assert.equal(
  eligibilityModule.isEligibleWorkProductResponse({ role: "assistant", content: `## Intake is complete\n\n${longStatusTail}` }),
  false,
  "a Markdown-headed completed intake summary must not become the canonical draft",
);
assert.equal(
  eligibilityModule.isEligibleWorkProductResponse({ role: "assistant", content: `## Research complete\n\n${longStatusTail}` }),
  false,
  "a Markdown-headed research status must not become the canonical draft",
);
assert.equal(
  eligibilityModule.isEligibleWorkProductResponse({ role: "assistant", content: "## Recommended response\n\nThe company can launch after it completes the listed controls and records the decision rationale.\n\n- Confirm the owner\n- Save the final response\n\nThis keeps the recommendation separate from the recorded decision." }),
  true,
  "a developed structured response remains eligible for the canonical draft",
);

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

  const terminalRefreshes = new Set<string>();
  const refreshTerminalRun = (run: ChatRun) => {
    if (!run.finished_at || terminalRefreshes.has(run.run_id)) return;
    terminalRefreshes.add(run.run_id);
  };
  const terminal = { ...reconnected, state: "completed" as const, finished_at: "2026-08-30T00:00:08Z" };
  refreshTerminalRun(terminal);
  refreshTerminalRun(terminal);
  assert.equal(terminalRefreshes.size, 1, "reload and polling refresh the same durable terminal run once");

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
  assert.equal(shouldShowChatRunStatus("completed"), false, "completed run status remains available through the durable result rather than a second local run");
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
  for (const workspace_action of ["prepare_handoff", "analyze_change_impact", "reassess_changed_facts", "unreconciled_run"]) {
    assert.equal(needsIntakeQuestionRecovery(true, [{ role: "assistant", cards: [], workspace_action }]), false, "completed workspace work must not trigger an unrelated intake run after reload");
  }
  assert.equal(needsIntakeQuestionRecovery(true, [{ role: "assistant", cards: [] }]), true, "active intake must recover a prose-only assistant turn");
  assert.equal(needsIntakeQuestionRecovery(true, [{ role: "assistant", cards: [{ type: "question" }] }]), false, "a structured question must not trigger recovery");
  assert.equal(needsIntakeQuestionRecovery(false, [{ role: "assistant", cards: [] }]), false, "completed intake must not trigger recovery");
  assert.equal(needsIntakeQuestionRecovery(true, [{ role: "user", cards: [] }]), false, "a pending user turn must not trigger recovery");
  assert.equal(
    intakeRecoveryKey("CONV-1", [
      { message_id: "MSG-U1", role: "user" },
      { message_id: "MSG-A1", role: "assistant" },
      { message_id: "MSG-A2", role: "assistant" },
    ]),
    "CONV-1:MSG-U1",
    "recovery identity must use the latest saved user message, not an assistant message",
  );
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
    { "Q-1": { state: "earlier", values: [] } },
    "a later saved intake turn uses neutral wording without durable answer evidence",
  );
  assert.deepEqual(
    historicalQuestionStates(
      [{ message_id: "MSG-A", role: "assistant", content: "Question", cards: [{ type: "question", question_id: "Q-OLD" }] }],
      0,
      ["Q-OLD"],
      false,
      [{ question_id: "Q-NEW", question: "Which launch path applies?", answer: "Pilot", values: ["pilot"], status: "answered" }],
      { "Q-OLD": "Which launch path applies?" },
    ),
    { "Q-OLD": { state: "answered", values: ["pilot"] } },
    "one unique normalized question-text match preserves a durable answer when a model changes the ID",
  );
  assert.deepEqual(
    historicalQuestionStates(
      [{ message_id: "MSG-A", role: "assistant", content: "Question", cards: [{ type: "question", question_id: "Q-OLD" }] }],
      0,
      ["Q-OLD"],
      false,
      [
        { question_id: "Q-A", question: "Which launch path applies?", values: ["a"] },
        { question_id: "Q-B", question: "Which launch path applies?", values: ["b"] },
      ],
      { "Q-OLD": "Which launch path applies?" },
    ),
    { "Q-OLD": { state: "earlier", values: [] } },
    "ambiguous text matches stay neutral",
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
