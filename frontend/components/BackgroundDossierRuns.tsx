"use client";

import { useEffect, useRef, useState } from "react";
import { cancelChatRun, getChatRun, getChatRuns, retryChatRun } from "@/lib/api";
import type { ChatRun } from "@/lib/types";

const running = (run: ChatRun) => ["queued", "running"].includes(run.state);

export default function BackgroundDossierRuns({ matterId, conversationId, startedRun, onConversationRefresh }: {
  matterId: string;
  conversationId: string | null;
  startedRun: ChatRun | null;
  onConversationRefresh: (conversationId: string) => Promise<void>;
}) {
  const [runs, setRuns] = useState<ChatRun[]>([]);
  const [error, setError] = useState("");
  const [refreshAttempt, setRefreshAttempt] = useState(0);
  const callbacks = useRef(onConversationRefresh);
  callbacks.current = onConversationRefresh;
  const completed = useRef(new Set<string>());
  const scope = useRef({ matterId, conversationId });
  scope.current = { matterId, conversationId };

  async function refreshResult(run: ChatRun) {
    if (running(run) || !run.conversation_id) return;
    const token = `${run.run_id}:${run.finished_at}`;
    if (completed.current.has(token)) return;
    completed.current.add(token);
    try { await callbacks.current(run.conversation_id); }
    catch {
      completed.current.delete(token);
      if (scope.current.matterId === matterId && scope.current.conversationId === run.conversation_id)
        setError("The dossier status is saved. Its result could not refresh yet.");
    }
  }

  useEffect(() => {
    if (!conversationId) { setRuns([]); return; }
    let cancelled = false;
    setRuns(current => current.filter(run => run.conversation_id === conversationId));
    async function load() {
      try {
        const saved = await getChatRuns(matterId, conversationId!);
        if (cancelled) return;
        const background = saved.filter(run => run.background);
        const latest = background[0];
        setRuns(background.filter((run, index) => running(run) || index === 0));
        setError("");
        if (latest) void refreshResult(latest);
      } catch {
        if (!cancelled) setError("Dossier progress could not load. Saved work remains available.");
      }
    }
    if (startedRun?.background && startedRun.conversation_id === conversationId) {
      setRuns(current => [startedRun, ...current.filter(run => run.run_id !== startedRun.run_id)]);
    }
    void load();
    return () => { cancelled = true; };
  }, [matterId, conversationId, startedRun?.run_id, startedRun?.state, refreshAttempt]);

  const activeIds = runs.filter(running).map(run => run.run_id).sort().join(",");
  useEffect(() => {
    if (!activeIds) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const updates = await Promise.all(activeIds.split(",").map(id => getChatRun(matterId, id)));
        if (cancelled) return;
        setRuns(current => current.map(run => updates.find(next => next.run_id === run.run_id) ?? run));
        setError("");
        for (const run of updates) void refreshResult(run);
      } catch {
        if (!cancelled) setError("Dossier progress could not refresh. The work may still be running.");
      }
      if (!cancelled) timer = setTimeout(() => void poll(), 1500);
    }
    timer = setTimeout(() => void poll(), 500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [activeIds, matterId, conversationId]);

  async function act(run: ChatRun, retry: boolean) {
    try {
      const next = await (retry ? retryChatRun(matterId, run.run_id) : cancelChatRun(matterId, run.run_id));
      setRuns(current => current.map(item => item.run_id === next.run_id ? next : item));
      setError("");
      void refreshResult(next);
    } catch { setError("The dossier action could not finish. Refresh to check its saved state."); }
  }

  return <div aria-label="Background dossier work">
    {runs.map(run => {
      const result = run.response?.operation_results.find(item => item.operation === "generate_dossier" || item.operation === "prepare_dossier_research");
      const needsChoices = run.state === "completed" && result?.operation === "prepare_dossier_research" && !!result.required_user_action;
      return <section className={`chat-card ${running(run) ? "wash-agent" : needsChoices ? "wash-attention" : run.state === "completed" ? "wash-healthy" : "wash-failure"}`} key={run.run_id} role="status">
      <div className="chat-card-kicker">Dossier · {running(run) ? "Working" : needsChoices ? "Plan prepared" : run.state === "completed" ? "Ready" : run.state === "interrupted" ? "Stopped" : "Failed"}</div>
      <div className="chat-card-summary">{running(run) ? `${run.status} You can keep asking questions.` : needsChoices ? "The plan is saved. Its research options and progress are shown above." : result?.summary || run.status}</div>
      <div className="chat-card-actions">
        {running(run) ? <button className="btn tiny quiet" type="button" onClick={() => void act(run, false)}>Stop dossier</button>
          : ["failed", "interrupted"].includes(run.state) ? <button className="btn tiny quiet" type="button" onClick={() => void act(run, true)}>Retry dossier</button> : null}
      </div>
    </section>; })}
    {error && <p role="alert">{error} <button type="button" className="btn tiny quiet" onClick={() => setRefreshAttempt(value => value + 1)}>Refresh dossier result</button></p>}
  </div>;
}
