"use client";

import { useState } from "react";
import { getProblemAnalysis } from "@/lib/workspaceApi";
import type { ProblemAnalysisStatus, ProblemReference } from "@/lib/problemAnalysisTypes";
import { role } from "@/lib/design";

const labels = { not_analyzed: "Not yet analyzed", saved: "Saved analysis", partial: "Partial analysis", needs_review: "Needs review", missing: "Unavailable", historical: "Earlier analysis" };
const priority = { decision_changing: 0, supporting: 1, deferred: 2 };
const words = (value: string) => value.replaceAll("_", " ");

type Props = {
  status?: ProblemAnalysisStatus | null;
  disclosureName?: string;
  onDiscuss?: (instruction: string) => void;
  onOpenSource?: (path: string) => void;
  onOpenIssue?: (issueId: string) => void;
};

export default function ProblemBreakdown({ status, disclosureName, onDiscuss, onOpenSource, onOpenIssue }: Props) {
  const [historical, setHistorical] = useState<ProblemAnalysisStatus | null>(null);
  const [historyError, setHistoryError] = useState("");
  const shown = historical?.analysis?.matter_id === status?.analysis?.matter_id ? historical : status;
  const state = shown?.state ?? "not_analyzed";
  const analysis = shown?.analysis;
  const attention = ["needs_review", "missing", "partial"].includes(state);
  const exact = analysis ? `Saved problem breakdown ${analysis.analysis_id}, revision ${analysis.analysis_revision}, in ${analysis.source_path}.` : "Current matter.";
  const questionText = (key: string) => analysis?.questions.find(q => q.key === key)?.question ?? key;
  function refs(items: ProblemReference[]) {
    return items.map((ref, index) => {
      const saved = analysis?.resolved_references.find(r => r.kind === ref.kind && r.record_id === ref.record_id);
      if (!saved) return null;
      const label = saved.text || words(saved.source_class || ref.kind);
      return <span key={`${ref.kind}:${ref.record_id}:${index}`} style={{ display: "inline-block", marginRight: 8 }}>
        {ref.kind === "issue" && onOpenIssue ? <button className="btn quiet" style={{ whiteSpace: "normal", maxWidth: "100%", textAlign: "left" }} type="button" onClick={() => onOpenIssue(ref.record_id)}>{label}</button>
          : saved.path && onOpenSource ? <button className="btn quiet" style={{ whiteSpace: "normal", maxWidth: "100%", textAlign: "left" }} type="button" onClick={() => onOpenSource(saved.path!)}>{label}</button> : <span>{label}</span>}
        {saved.availability && <small> · {words(saved.availability)}</small>}
      </span>;
    });
  }
  return <details data-problem-breakdown name={disclosureName} aria-label="Problem breakdown" style={{ border: `1px dashed ${attention ? role.attention : role.agent}`, background: attention ? role.attentionWash : role.agentWash, borderRadius: 8, padding: 12, marginBlock: 12, minWidth: 0, font: "400 15px/1.55 var(--sans)", overflowWrap: "anywhere" }}>
    <summary style={{ cursor: "pointer" }}><strong>Problem breakdown</strong> · {labels[state]}{analysis && <small> · {new Date(analysis.captured_at).toLocaleDateString()}</small>}
      {analysis?.next_step && <span style={{ display: "block", marginTop: 6 }}>{analysis.next_step}</span>}
    </summary>
    {shown?.warnings?.map((warning, i) => <p key={i}>{warning}</p>)}
    {historyError && <p role="alert">{historyError}</p>}
    {historical && <button className="btn quiet" style={{ whiteSpace: "normal", maxWidth: "100%", textAlign: "left" }} type="button" onClick={() => { setHistorical(null); setHistoryError(""); }}>Return to current breakdown</button>}
    {!analysis && <p>A material conversation or research answer can add a saved breakdown here.</p>}
    {analysis && <>
      <p><strong>Business objective:</strong> {analysis.objective}</p>
      {analysis.proposed_method && <p><strong>Proposed method:</strong> {analysis.proposed_method}</p>}
      {analysis.framing_note && <p><strong>Suggested framing:</strong> {analysis.framing_note}</p>}
      <h3>Parts of the situation</h3>
      {analysis.parts.map(part => <div key={part.key} style={{ borderTop: "1px solid var(--line)", paddingBlock: 8 }}><strong>{part.label}</strong> · {words(part.status)}<p>{part.description}</p>{refs(part.references)}</div>)}
      <h3>Questions that shape the answer</h3>
      {[...analysis.questions].sort((a,b) => priority[a.priority]-priority[b.priority]).map(question => <section key={question.key} style={{ borderTop: "1px solid var(--line)", paddingBlock: 10 }}>
        <strong>{question.question}</strong><p>{words(question.state)} · {words(question.priority)}{!question.issue_id && " · New issue to assess"}</p>
        <p><strong>Why it matters:</strong> {question.why_it_matters}</p>
        {question.part_keys.length > 0 && <p><strong>Related activity:</strong> {question.part_keys.map(key => analysis.parts.find(p => p.key === key)?.label ?? key).join("; ")}</p>}
        {question.parent_key && <p><strong>Part of:</strong> {questionText(question.parent_key)}</p>}
        {question.depends_on.length > 0 && <p><strong>Depends on:</strong> {question.depends_on.map(questionText).join("; ")}</p>}
        {question.characterizations.length > 0 && <p><strong>Possible characterizations:</strong> {question.characterizations.join("; ")}</p>}
        {question.assessment && <p><strong>Current assessment:</strong> {question.assessment}</p>}
        {question.counterpoint && <p><strong>Competing view:</strong> {question.counterpoint}</p>}
        {question.answer_changing_fact && <p><strong>What could change it:</strong> {question.answer_changing_fact}</p>}
        <p><strong>Next action:</strong> {words(question.next_action)}. {question.next_action_reason}</p>
        {refs(question.references)}
        {question.issue_id && onOpenIssue && <button className="btn quiet" style={{ whiteSpace: "normal", maxWidth: "100%", textAlign: "left" }} type="button" onClick={() => onOpenIssue(question.issue_id!)}>Open issue and saved tests</button>}
        {onDiscuss && <button className="btn quiet" style={{ whiteSpace: "normal", maxWidth: "100%", textAlign: "left" }} type="button" onClick={() => onDiscuss(`Discuss this question: ${question.question}\n${exact}\nExplain its effect on the whole plan. This request does not supply a factual answer.`)}>Discuss this question</button>}
      </section>)}
      {analysis.coverage.length > 0 && <details><summary>Coverage notes</summary>{analysis.coverage.map((note,i) => <p key={i}><strong>{note.topic}</strong> · {words(note.state)}. {note.reason}</p>)}</details>}
      <h3>Integrated answer</h3><p>{analysis.integrated_answer}</p>
      {analysis.alternative_paths.map((path,i) => <section key={i}><h4>{path.title}</h4><p>{path.proposed_change}</p><p><strong>Benefit:</strong> {path.benefit}</p><p><strong>Tradeoff:</strong> {path.tradeoff}</p><p><strong>Remaining condition:</strong> {path.remaining_condition}</p></section>)}
      {analysis.changes.length > 0 && <details><summary>What changed</summary>{analysis.changes.map((change,i) => <div key={i}><p><strong>{words(change.kind)}:</strong> {change.reason}</p><p>{change.answer_effect}</p>{refs(change.references)}</div>)}</details>}
      {onOpenSource && <p><button className="btn quiet" style={{ whiteSpace: "normal", maxWidth: "100%", textAlign: "left" }} type="button" onClick={() => onOpenSource(analysis.source_path)}>Open saved answer</button>{analysis.prior_reference && <button className="btn quiet" style={{ whiteSpace: "normal", maxWidth: "100%", textAlign: "left" }} type="button" onClick={async () => { try { setHistorical(await getProblemAnalysis(analysis.matter_id, analysis.prior_reference!)); setHistoryError(""); } catch { setHistoryError("The earlier breakdown could not be opened. Its answer link remains available."); } }}>Open earlier breakdown</button>}</p>}
    </>}
    {onDiscuss && <button className="btn quiet" style={{ whiteSpace: "normal", maxWidth: "100%", textAlign: "left" }} type="button" onClick={() => onDiscuss(`Reassess the problem breakdown against current supplied facts and sources. Explain material changes and the whole-plan answer.\n${exact}`)}>Reassess breakdown</button>}
  </details>;
}
