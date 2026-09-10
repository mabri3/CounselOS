"use client";

import { useRef, useState } from "react";
import type { IssueDispositionCommand, IssueDispositionState } from "@/lib/workspaceTypes";
import type { IssueReviewDetailComponentProps } from "./IssueReviewDetail";

type Props = Pick<IssueReviewDetailComponentProps, "issue" | "issuesRevision" | "analysisStatus" | "workItems" | "decisions" | "onDisposition" | "onAnalyzePaths"> & { onCancel: () => void; initialOptionId?: string };
type FollowUp = NonNullable<IssueDispositionCommand["follow_up"]>[number];

export default function IssueChoiceForm(props: Props) {
  const analysis = props.analysisStatus?.analysis;
  const options = analysis?.options ?? [];
  const recommended = options.find(option => option.recommendation === "recommended");
  const currentDecision = props.decisions.filter(item => !props.decisions.some(other => other.revises_decision_id === item.decision_id)).sort((a, b) => String(b.decided_at ?? "").localeCompare(String(a.decided_at ?? "")))[0];
  const initial = props.initialOptionId ? options.find(option => option.option_id === props.initialOptionId) : currentDecision ? options.find(option => option.option_id === currentDecision.map_basis?.selected_option_id) : recommended ?? options[0];
  const useCurrent = currentDecision && (!props.initialOptionId || props.initialOptionId === currentDecision.map_basis?.selected_option_id);
  const draftReason = (id: string) => {
    const option = options.find(item => item.option_id === id);
    return [option?.recommendation_reason, option?.consequence].filter(Boolean).join("\n\n");
  };
  const draftWork = (id: string): FollowUp[] => {
    const option = options.find(item => item.option_id === id);
    return (option?.remaining_work ?? []).filter(title => !props.workItems.some(work => work.title === title)).map(title => ({ title, owner: "", required: true }));
  };
  const draftConditions = (id: string) => {
    const option = options.find(item => item.option_id === id);
    return [option?.condition_summary, ...(option?.requirements ?? []).map(req => `${analysis?.conditions.find(item => item.condition_id === req.condition_id)?.question ?? req.condition_id} — must be ${req.state === "met" ? "met" : "not met"}`)].filter(Boolean).join("\n");
  };
  const [optionId, setOptionId] = useState(initial?.option_id ?? "custom");
  const [path, setPath] = useState(useCurrent ? currentDecision.chosen_path : initial?.title ?? "");
  const [reason, setReason] = useState(useCurrent ? currentDecision.rationale : draftReason(initial?.option_id ?? ""));
  const [conclusion, setConclusion] = useState<IssueDispositionState>("mitigation_in_progress");
  const [conditions, setConditions] = useState(useCurrent ? currentDecision.conditions?.join("\n") ?? "" : draftConditions(initial?.option_id ?? ""));
  const [work, setWork] = useState<FollowUp[]>(useCurrent ? [] : draftWork(initial?.option_id ?? ""));
  const [revision] = useState(props.issuesRevision);
  const [analysisRevision] = useState(analysis?.analysis_revision);
  const [historical, setHistorical] = useState(false);
  const [revisionOf, setRevisionOf] = useState(currentDecision?.decision_id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const retry = useRef<{ signature: string; key: string } | null>(null);
  const selected = options.find(option => option.option_id === optionId);
  const stale = revision !== props.issuesRevision || analysisRevision !== analysis?.analysis_revision;
  const needsHistorical = Boolean(selected && props.analysisStatus?.state === "needs_review");
  const different = !selected || selected.recommendation !== "recommended" || path !== selected.title || reason.trim() !== draftReason(optionId).trim() || conditions.trim() !== draftConditions(optionId).trim();
  const openWork = props.workItems.filter(item => !["done", "closed", "complete", "completed"].includes(item.state));

  function choose(id: string) {
    const option = options.find(item => item.option_id === id);
    setOptionId(id); setPath(option?.title ?? ""); setReason(draftReason(id));
    setConditions(draftConditions(id)); setWork(draftWork(id));
  }

  async function save() {
    if (!props.onDisposition || busy || stale) return;
    const payload = {
      workflow: true, disposition: conclusion, reason: reason.trim(),
      chosen_path: conclusion === "unresolved" ? "" : path.trim(),
      conditions: conditions.split("\n").map(value => value.trim()).filter(Boolean),
      follow_up: work, expected_revision: revision,
      linked_work_item_ids: props.workItems.map(item => item.work_item_id),
      linked_decision_ids: props.issue.linked_decision_ids ?? [],
      revises_decision_id: revisionOf || null,
      map_basis: selected && analysis && conclusion !== "unresolved" ? {
        issue_id: props.issue.issue_id, analysis_id: analysis.analysis_id,
        analysis_revision: analysis.analysis_revision, analysis_path: analysis.source_path,
        output_revision: analysis.output_revision, selected_option_id: selected.option_id,
        selected_option_revision: selected.option_revision, use_historical_basis: historical,
      } : null,
    };
    const signature = JSON.stringify(payload);
    if (retry.current?.signature !== signature) retry.current = { signature, key: `issue-choice:${crypto.randomUUID()}` };
    setBusy(true); setError("");
    try {
      await props.onDisposition(props.issue.issue_id, { ...payload, source_action_key: retry.current.key });
    } catch (cause) {
      setError((cause instanceof Error ? cause.message : "Recording did not finish.") + " Your text is retained. Retry the same action to finish any saved parts.");
      setBusy(false); return;
    }
    props.onCancel();
    if (different || conclusion === "unresolved") props.onAnalyzePaths?.(props.issue.issue_id, `Recorded conclusion: ${conclusion}\nChosen path: ${payload.chosen_path || "Question left open"}\nReason: ${reason}\nConditions still to confirm: ${conditions}`);
  }

  return <fieldset disabled={busy} className="field-block" style={{ border: "1px solid var(--line-faint)", padding: 16 }}>
    <legend className="field-label">Record choice and follow-up</legend>
    {currentDecision ? <p className="field-help">Updating your recorded choice: {currentDecision.title}. The earlier decision stays in history.</p> : null}
    {stale ? <p className="warning-callout">The issue or analysis changed. Your text is retained. Cancel and reopen before recording.</p> : null}
    {error ? <p className="warning-callout" role="alert">{error}</p> : null}
    <label className="field-block"><span className="field-label">Starting choice</span><select className="select-input" value={optionId} onChange={event => choose(event.target.value)}>{options.map(option => <option key={option.option_id} value={option.option_id}>{option.recommendation === "recommended" ? "Recommended" : "Candidate"} — {option.title}</option>)}<option value="custom">A different position / my own reason</option></select></label>
    <label className="field-block"><span className="field-label">Chosen path</span><input className="text-input" value={path} maxLength={2000} onChange={event => setPath(event.target.value)} /></label>
    <label className="field-block"><span className="field-label">Your conclusion</span><select className="select-input" value={conclusion} onChange={event => setConclusion(event.target.value as IssueDispositionState)}><option value="mitigation_in_progress">Proceed with follow-up</option><option value="resolved">Issue resolved</option><option value="risk_accepted">Accept the remaining risk</option><option value="not_applicable">Issue does not apply</option><option value="unresolved">Leave the question open / reopen</option></select></label>
    <label className="field-block"><span className="field-label">Reason</span><textarea className="text-input prose" value={reason} maxLength={10000} onChange={event => setReason(event.target.value)} /></label>
    <p className="field-help">Suggested reasons are agent analysis. Edit them to reflect your judgment. A different path does not automatically mean risk acceptance.</p>
    <details><summary>Conditions and earlier decisions</summary>
      <label className="field-block"><span className="field-label">Conditions still to confirm</span><textarea className="text-input" value={conditions} onChange={event => setConditions(event.target.value)} /></label>
      {props.decisions.length ? <label className="field-block"><span className="field-label">Replace an earlier decision</span><select className="select-input" value={revisionOf} onChange={event => setRevisionOf(event.target.value)}><option value="">Do not replace another decision</option>{props.decisions.map(item => <option key={item.decision_id} value={item.decision_id}>{item.title}</option>)}</select></label> : null}
    </details>
    {needsHistorical ? <label><input type="checkbox" checked={historical} onChange={event => setHistorical(event.target.checked)} /> Use this saved analysis despite its Needs review state.</label> : null}
    <h4>Follow-up work</h4>
    {selected?.work_item_ids.length ? <p className="field-help">This path also links {selected.work_item_ids.length} existing work item(s) shown on the decision map. They remain part of its checklist.</p> : null}
    <p className="field-help">Existing work stays linked. Confirm new tasks below. Required work must finish before the matter closes. Completing work does not itself resolve this issue.</p>
    {openWork.map(item => <p key={item.work_item_id}>{item.title} · {item.owner || "Unassigned"} · {item.state}</p>)}
    {work.map((item, index) => <fieldset key={index} style={{ border: "1px solid var(--line-faint)", padding: 10 }}><legend>New task {index + 1}</legend>
      <label className="field-block"><span className="field-label">Task</span><input className="text-input" value={item.title} maxLength={500} onChange={event => setWork(work.map((value, i) => i === index ? { ...value, title: event.target.value } : value))} /></label>
      <label className="field-block"><span className="field-label">Owner</span><input className="text-input" value={item.owner} onChange={event => setWork(work.map((value, i) => i === index ? { ...value, owner: event.target.value } : value))} /></label>
      <label className="field-block"><span className="field-label">Due date</span><input className="text-input" type="date" value={item.due_at ?? ""} onChange={event => setWork(work.map((value, i) => i === index ? { ...value, due_at: event.target.value || null } : value))} /></label>
      <label><input type="checkbox" checked={item.required} onChange={event => setWork(work.map((value, i) => i === index ? { ...value, required: event.target.checked } : value))} /> Required before closure</label>
      <button className="btn quiet tiny" type="button" onClick={() => setWork(work.filter((_, i) => i !== index))}>Remove new task</button>
    </fieldset>)}
    <button className="btn quiet" type="button" onClick={() => setWork([...work, { title: "", owner: "", required: true }])}>Add follow-up task</button>
    {conclusion === "mitigation_in_progress" ? <p className="field-help">A required lawyer review task will track the final issue conclusion after follow-up. An existing open review task is reused.</p> : null}
    <p className="field-help">This saves your conclusion{conclusion !== "unresolved" ? ", a formal decision," : ""} and the listed new work. It does not confirm conditions, approve a response, or close the matter.{different ? " Analysis will then reassess your position and connected issues. If it fails, use Update analysis to retry." : ""}</p>
    <div className="btn-row"><button className="btn primary" type="button" disabled={busy || stale || !props.onDisposition || !reason.trim() || (conclusion !== "unresolved" && !path.trim()) || work.some(item => !item.title.trim()) || (needsHistorical && !historical)} onClick={save}>{busy ? "Recording…" : conclusion === "unresolved" ? "Record open question and follow-up" : "Record decision and follow-up"}</button><button className="btn quiet" type="button" onClick={props.onCancel}>Cancel</button></div>
  </fieldset>;
}
