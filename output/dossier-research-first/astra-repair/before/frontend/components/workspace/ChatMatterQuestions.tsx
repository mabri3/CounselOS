"use client";
import { useEffect, useRef, useState } from "react";
import { getDecisionMap } from "@/lib/workspaceApi";
import { subscribeMatterChanges } from "@/lib/api";
import type { DecisionMapSnapshot } from "@/lib/decisionMapTypes";
import type { ConversationTarget } from "@/lib/workspaceTypes";
import ConditionAnswer, { type ReportedAnswer } from "./ConditionAnswer";

export default function ChatMatterQuestions({matterId, contextKey, target, onTarget, onAsk, chatText, conversationId}: {
  matterId: string; contextKey?: string; target?: ConversationTarget; onTarget: (target: ConversationTarget) => void;
  onAsk: (text: string) => void; chatText?: string; conversationId?: string | null;
}) {
  const [map, setMap] = useState<DecisionMapSnapshot | null>(null);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const refresh = async () => {
    const token = ++generation.current;
    try { const next = await getDecisionMap(matterId); if (token === generation.current) { setMap(next); setError(""); } }
    catch { if (token === generation.current) setError("Shared questions could not refresh. Your chat and drafts are retained."); }
  };
  useEffect(() => {
    setMap(null); void refresh();
    const unsubscribe = subscribeMatterChanges(matterId, () => void refresh());
    return () => { generation.current++; unsubscribe(); };
  }, [matterId, contextKey]);
  const questions = map?.nodes.filter(n => n.record_type === "condition" && map.issue_analyses?.[n.issue_ids?.[0] ?? ""]?.analysis?.analysis_revision === n.analysis_revision) ?? [];
  const selected = questions.find(n => n.record_id === target?.condition_id);
  const choose = (id: string) => {
    const node = questions.find(n => n.record_id === id);
    if (node) onTarget({matter_id:matterId, issue_id:node.issue_ids?.[0], condition_id:node.record_id,
      analysis_id:node.analysis_id, analysis_revision:node.analysis_revision});
  };
  const issueId = selected?.issue_ids?.[0] ?? target?.issue_id;
  const query = new URLSearchParams({view:"understand"});
  if (issueId) query.set("issue", issueId);
  if (conversationId) query.set("conversation", conversationId);
  return <details open={Boolean(selected)} className="chat-card" aria-label="Shared matter actions">
    <summary>Questions and actions · Same saved matter</summary>
    {error ? <p role="status">{error}</p> : null}
    <label className="field-block">Question to answer or discuss<select className="select-input" value={selected?.record_id ?? ""} onChange={e => choose(e.target.value)}><option value="">Choose a saved question</option>{questions.map(node => <option key={node.node_id} value={node.record_id}>{map?.nodes.find(i => i.record_type === "issue" && i.record_id === node.issue_ids?.[0])?.label} · Question {String(node.data?.question_number)}: {node.label}</option>)}</select></label>
    {!questions.length && map ? <p>No decision-path questions are saved yet. You can ask chat to explore the matter.</p> : null}
    {selected ? <section key={selected.node_id}>
      <h3>Question {String(selected.data?.question_number)}: {selected.label}</h3>
      <p>Discussion does not save an answer. Select Save answer below to record it.</p>
      <button className="btn quiet" onClick={() => onAsk(`Help me answer Question ${selected.data?.question_number}: ${selected.label}. Use the saved starting answers and current facts. Give an editable first pass and material alternatives. Do not save a fact or decision.`)}>Help me answer this question</button>
      <ConditionAnswer matterId={matterId} issueId={issueId!} conditionId={selected.record_id} revision={selected.analysis_revision!} question={selected.label}
        choices={(selected.data?.answer_choices ?? []) as Array<{label:string;answer:string}>}
        history={(selected.data?.answer_history ?? []) as ReportedAnswer[]}
        savedAnswer={String((selected.data?.reported_answer as {answer?:string})?.answer ?? "")}
        savedKey={String((selected.data?.reported_answer as {source_action_key?:string})?.source_action_key ?? "")}
        surface="chat" chatText={chatText} onRefresh={refresh} onAnalyze={() => onAsk("Reassess this issue and its connected paths using the latest saved facts and reported answers. Preserve recorded decisions and lawyer edits. Return useful prose and optional decision-paths.")} />
    </section> : null}
    <p><a href={`/matters/${encodeURIComponent(matterId)}?${query}`}>Review issue, record decision, or complete follow-up</a> · <a href={`/matters/${encodeURIComponent(matterId)}/decision-map?${query}`}>View the same records on the map</a></p>
  </details>;
}
