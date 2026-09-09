"use client";
import ConditionAnswer, { type ReportedAnswer } from "./ConditionAnswer";
import { useRef, useState } from "react";
import type { DecisionMapNode, DecisionMapSnapshot, DecisionPathPrefill, IssueAnalysisStatus, IssueOption } from "@/lib/decisionMapTypes";
import { completeWorkItem, createMatterWorkItem } from "@/lib/api";
import { workspaceCommand } from "@/lib/workspaceApi";
import { connectedPathEffects, pathImplementationWork } from "@/lib/decisionMapLayout";
import { recordPrefill } from "./DecisionMapInspector";
import styles from "./MatterMap.module.css";
import type { WorkspaceClaim } from "@/lib/workspaceTypes";

export function outcomeProgress(option: IssueOption, nodes: DecisionMapNode[], agreed: boolean) {
  const states = option.requirements.map(req => {
    const node = nodes.find(n => n.record_type === "condition" && n.record_id === req.condition_id);
    const assessment = (node?.data?.lawyer_assessment as {assessment?: string} | undefined)?.assessment ?? node?.state ?? "unknown";
    return ["unknown", "conflicting", "historical"].includes(assessment) ? "unknown" : assessment === req.state ? "met" : "not_met";
  });
  const satisfied = !states.length || (option.combination === "any" ? states.includes("met") : states.every(s => s === "met"));
  const failed = !satisfied && (option.combination === "any" ? states.every(s => s === "not_met") : states.includes("not_met"));
  const work = pathImplementationWork(option, nodes);
  const unique = work.filter((item, index) => work.findIndex(other => (other.node?.node_id ?? other.title) === (item.node?.node_id ?? item.title)) === index);
  const pending = unique.filter(item => !item.node || !["done", "completed", "complete"].includes(item.node.state));
  return {work: unique, pending, satisfied, failed, label: !agreed ? "Exploring — decision not recorded" : failed ? "Agreed path needs review" : !satisfied ? "Path agreed — conditions unresolved" : pending.length ? "Path agreed — implementation pending" : "Complete for this issue"};
}

export default function PathOutcome({node, status, snapshot, onSelectNode, onRecordPath, onRefresh, onDiscuss, onAnalyze, onDiscussQuestion}: {
  node: DecisionMapNode; status: IssueAnalysisStatus; snapshot: DecisionMapSnapshot;
  onSelectNode: (id: string) => void; onRecordPath?: (value: DecisionPathPrefill) => void;
  onDiscussQuestion?: (conditionId: string) => void;
  onAnalyze?: () => void; onRefresh?: () => Promise<void>; onDiscuss: (prompt?: string) => void;
}) {
  const effects = snapshot.nodes.flatMap(target => connectedPathEffects(target, snapshot.nodes, snapshot.edges)).filter(effect => effect.sourceId === node.node_id || effect.targetId === node.node_id);
  const option = node.data as unknown as IssueOption;
  const analysis = status.analysis!;
  const claims = (Array.isArray(node.data?.claim_support) ? node.data.claim_support : []) as WorkspaceClaim[];
  const hasEvidence = claims.some(claim => claim.evidence?.length);
  const researchPrompt = `Research the legal basis for this selected choice: ${option.title}. Identify the applicable actor and rule, supporting and contrary authority, material facts, and any exception. Distinguish a business risk reduction from legal permission. Explain how each authority applies and preserve source verification labels. If no supporting authority is found, state the research scope and gap; do not claim that no authority exists. Reassess the selected path and connected paths using the findings. Return useful prose and optional decision-paths with exact claim links. Do not record a decision or change a lawyer's recorded choice.`;
  const related = snapshot.nodes.filter(n => (n.issue_ids?.includes(analysis.issue_id) || n.record_type === "decision") && (n.record_type !== "condition" || n.analysis_revision === analysis.analysis_revision));
  const decisionLink = snapshot.edges.find(edge => edge.from_node_id === node.node_id && edge.relationship === "decided_by" && edge.state === "active");
  const decision = snapshot.nodes.find(n => n.node_id === decisionLink?.to_node_id);
  const activeAgreements = snapshot.edges.filter(edge => edge.relationship === "decided_by" && edge.state === "active" && edge.from_node_id.startsWith("option:"));
  const latestAgreement = snapshot.nodes.filter(n => n.record_type === "decision" && (n.data?.map_basis as {issue_id?: string} | undefined)?.issue_id === analysis.issue_id && activeAgreements.some(e => e.to_node_id === n.node_id)).sort((a,b) => String(b.data?.decided_at ?? "").localeCompare(String(a.data?.decided_at ?? "")))[0];
  const expectedConditions = [option.condition_summary.trim(), ...option.requirements.map(req => `${analysis.conditions.find(c => c.condition_id === req.condition_id)?.question ?? req.condition_id} — must be ${req.state === "met" ? "met" : "not met"}`)];
  const additionalConditions = Array.isArray(decision?.data?.conditions) ? decision.data.conditions.filter(value => typeof value === "string" && !expectedConditions.includes(value.trim())) as string[] : [];
  const progress = outcomeProgress(option, related, !!decision);
  if (decision && additionalConditions.length && !progress.failed) progress.label = "Path agreed — conditions unresolved";
  if (decision && effects.some(effect => effect.targetId === node.node_id && effect.effective)) progress.label = "Agreed path needs review";
  const prefill = recordPrefill(node, analysis, status);
  const [editing, setEditing] = useState<string | null>(null);
  const [assessment, setAssessment] = useState("unknown");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = async (action: () => Promise<unknown>) => { setBusy(true); setError(""); try { await action(); await onRefresh?.(); setEditing(null); } catch (e) { setError(e instanceof Error ? e.message : "Could not save. Reload to check the record."); } finally {setBusy(false);} };
  const question = snapshot.nodes.find(n => n.record_type === "business_question");
  const conditionsRef = useRef<HTMLDetailsElement | null>(null);
  const workRef = useRef<HTMLDetailsElement | null>(null);
  const effectsRef = useRef<HTMLDetailsElement | null>(null);
  const unresolved = option.requirements.filter(req => {
    const condition = related.find(n => n.record_type === "condition" && n.record_id === req.condition_id);
    const state = (condition?.data?.lawyer_assessment as {assessment?: string} | undefined)?.assessment ?? condition?.state ?? "unknown";
    return state !== req.state;
  });
  const hasEffectConflict = !!decision && effects.some(effect => effect.targetId === node.node_id && effect.effective);
  const needsConditions = !progress.satisfied || additionalConditions.length > 0;
  const openSection = (section: HTMLDetailsElement | null) => {
    if (!section) return;
    section.open = true;
    section.scrollIntoView({behavior: "smooth", block: "start"});
    section.querySelector("summary")?.focus({preventScroll: true});
  };
  const jumpToQuestion = (id: string) => {
    if (conditionsRef.current) conditionsRef.current.open = true;
    const question = document.getElementById(`path-question-${id}`);
    question?.scrollIntoView({behavior: "smooth", block: "start"});
    question?.focus({preventScroll: true});
  };
  const nextTitle = hasEffectConflict ? "Review the effect on your agreed path" : needsConditions ? `Review ${unresolved.length + additionalConditions.length} unresolved condition${unresolved.length + additionalConditions.length === 1 ? "" : "s"}` : progress.pending.length ? `Review ${progress.pending.length} pending work item${progress.pending.length === 1 ? "" : "s"}` : decision ? "This issue’s checklist is complete" : "Ready to record your choice";
  return <section className={`${styles.card} ${styles.outcomePanel}`} aria-label="Outcome for this issue">
    <header className={styles.outcomeHeader}><div><span className={styles.meta}>Outcome for this issue</span><h2>{option.title}</h2><p className={styles.outcomeSummary}>{option.consequence || "No outcome saved yet."}</p></div><div className={styles.outcomeAgreement}>{prefill && onRecordPath ? <button className="btn quiet" disabled={busy} onClick={() => onRecordPath({...prefill, ...(latestAgreement ? {revises_decision_id:latestAgreement.record_id} : {})})}>{decision ? "Revisit this decision" : "Agree on this path"}</button> : null}<small>{decision ? "Your recorded choice" : "You can agree subject to unresolved conditions."}</small></div></header>
    <div className={styles.outcomeProgress} aria-label="Path progress"><span className={decision ? styles.outcomeHealthy : styles.outcomeNeutral}>{decision ? "Path agreed" : "Not agreed"}</span><span className={needsConditions ? styles.outcomeAttention : option.requirements.length ? styles.outcomeHealthy : styles.outcomeNeutral}>{needsConditions ? `${unresolved.length + additionalConditions.length} conditions need review` : option.requirements.length ? "Required conditions satisfied" : "No listed conditions"}</span><span className={progress.pending.length ? styles.outcomeNeutral : styles.outcomeHealthy}>{progress.pending.length ? `${progress.pending.length} work items pending` : "No work pending"}</span></div>
    {option.requirements.length ? <section aria-label="Question navigation"><h3>Questions for this path</h3><p>Jump to a question to review or answer it. You can agree conditionally before answering. Agreement does not resolve the issue or confirm these conditions.</p><nav aria-label="Questions for this path" className={styles.questionLinks}>{option.requirements.map(req => <button type="button" className="btn quiet" key={req.condition_id} onClick={() => jumpToQuestion(req.condition_id)}>Go to Question {analysis.conditions.findIndex(c => c.condition_id === req.condition_id) + 1} — {unresolved.some(item => item.condition_id === req.condition_id) ? "Needs review" : "Assessed"} ↓</button>)}</nav></section> : null}
    <section className={styles.pathCondition} aria-label="Legal basis for this choice">
      <h3>Legal basis</h3>
      <p className={hasEvidence ? styles.outcomeNeutral : styles.outcomeAttention}>{hasEvidence ? "Linked source material — review its support and applicability" : "No linked legal support for this choice"}</p>
      {!hasEvidence ? <p>The saved record does not establish a legal basis. This is a research gap, not a finding that the choice is unlawful.</p> : <p>A linked source is not proof that this choice is lawful. Source status and application to the facts must be read separately.</p>}
      <p><strong>Saved reasoning: </strong>{option.recommendation_reason || option.condition_summary || "No reasoning saved."}</p>
      {claims.map(claim => <article key={claim.claim_id}><p>{claim.text}</p>{claim.applicability?.explanation ? <p>Application: {claim.applicability.explanation}</p> : <p>No application to the facts is recorded for this claim.</p>}{claim.support_gap ? <p>Support gap: {claim.support_gap}</p> : null}{claim.evidence?.map((evidence, index) => <p key={index}>{evidence.source_label || evidence.source_id} · {(evidence.support_state || "unknown").replace(/_/g, " ")}{evidence.locator ? ` · ${evidence.locator}` : ""}{evidence.available_excerpt ? ` — ${evidence.available_excerpt}` : ""}</p>)}</article>)}
      {hasEvidence ? <button type="button" className="btn quiet" onClick={() => { const support = document.querySelector<HTMLElement>('[aria-label="Selected record support"]'); support?.scrollIntoView({behavior:"smooth", block:"start"}); support?.querySelector<HTMLElement>("button, a")?.focus({preventScroll:true}); }}>Review linked sources</button> : null}
      <button type="button" className="btn quiet" onClick={() => onDiscuss(researchPrompt)}>Research legal basis in chat</button>
      <p className="field-help">Prepares a request for your review. Select Send in chat to start research.</p>
    </section>
    {option.trade_off ? <p><strong>Main downside: </strong>{option.trade_off}</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    {!needsConditions || hasEffectConflict ? <section className={`${styles.outcomeNext} ${hasEffectConflict || needsConditions ? styles.outcomeNextAttention : ""}`} aria-label="Next action"><span className={styles.meta}>{hasEffectConflict || needsConditions ? "Needs review" : "Next step"}</span><h3>{nextTitle}</h3><p>{hasEffectConflict ? "A recorded effect changes whether this path remains available." : needsConditions ? "Confirm the facts this choice depends on before treating it as ready to carry out." : progress.pending.length ? progress.pending[0].node?.label ?? progress.pending[0].title : decision ? "The listed conditions and implementation work are satisfied." : "Record the path if it reflects your decision."}</p>{hasEffectConflict || needsConditions || progress.pending.length ? <button className="btn primary" onClick={() => openSection(hasEffectConflict ? effectsRef.current : needsConditions ? conditionsRef.current : workRef.current)}>{hasEffectConflict ? "Review connected paths" : needsConditions ? "Review conditions" : "Review work"}</button> : null}</section> : null}
    <div className={styles.outcomeDetails}>
    <details open className={styles.outcomeDisclosure} ref={conditionsRef}><summary>What we need to know <span>{unresolved.length + additionalConditions.length ? `${unresolved.length + additionalConditions.length} need review` : option.requirements.length ? "Assessed" : "Not assessed"}</span></summary><p>{option.requirements.length ? `The saved analysis treats ${option.combination === "any" ? "at least one" : "all"} of these as conditions for carrying out this path, not prerequisites for recording a conditional agreement. Review whether each condition actually applies; update analysis if it does not.` : "No conditions were recorded. This does not establish that the path is ready or legally supported."}</p>
    {option.requirements.map(req => {
      const condition = related.find(n => n.record_type === "condition" && n.record_id === req.condition_id && n.analysis_revision === analysis.analysis_revision);
      const original = analysis.conditions.find(c => c.condition_id === req.condition_id);
      const saved = condition?.data?.lawyer_assessment as {assessment: string; reason: string} | undefined;
      return <article id={`path-question-${req.condition_id}`} tabIndex={-1} className={styles.pathCondition} key={req.condition_id}><strong><span className={styles.questionNumber}>Question {analysis.conditions.findIndex(c => c.condition_id === req.condition_id) + 1}</span> {original?.question ?? req.condition_id}</strong><details><summary>Assessment and supporting facts</summary><p>Current assessment: {(saved?.assessment ?? original?.assessment ?? "unknown").replace(/_/g," ")} · Required: {req.state.replace(/_/g," ")}</p><p>{saved?.reason ?? original?.assessment_basis}</p>
        {condition ? <button className="btn quiet" onClick={() => onSelectNode(condition.node_id)}>Review condition and facts</button> : null}
        <button className="btn quiet" disabled={busy} onClick={() => {setEditing(req.condition_id); setAssessment(saved?.assessment ?? original?.assessment ?? "unknown"); setReason(saved?.reason ?? "");}}>Update assessment</button>
        {editing === req.condition_id ? <div><label>Assessment<select value={assessment} onChange={e => setAssessment(e.target.value)}><option value="met">Met</option><option value="not_met">Not met</option><option value="unknown">Unknown</option><option value="conflicting">Conflicting</option></select></label><label>Reason and supporting facts<textarea value={reason} onChange={e => setReason(e.target.value)} /></label><button className="btn primary" disabled={busy || !reason.trim()} onClick={() => void run(() => workspaceCommand(snapshot.matter_id, `/issues/${analysis.issue_id}/conditions/${req.condition_id}/assessment`, "POST", {analysis_revision:analysis.analysis_revision, assessment, reason}))}>Save assessment</button></div> : null}
        </details><ConditionAnswer history={(condition?.data?.answer_history ?? []) as ReportedAnswer[]} matterId={snapshot.matter_id} issueId={analysis.issue_id} conditionId={req.condition_id} revision={analysis.analysis_revision} question={original?.question ?? req.condition_id} choices={(condition?.data?.answer_choices ?? []) as Array<{label:string;answer:string}>} savedKey={String((condition?.data?.reported_answer as {source_action_key?:string})?.source_action_key ?? "")} savedAnswer={String((condition?.data?.reported_answer as {answer?: string} | undefined)?.answer ?? "")} onRefresh={onRefresh} onAnalyze={onAnalyze} />{onDiscussQuestion ? <button className="btn quiet" onClick={() => onDiscussQuestion(req.condition_id)}>Discuss Question {analysis.conditions.findIndex(c => c.condition_id === req.condition_id) + 1}</button> : null}
      </article>;
    })}
    {!option.requirements.length ? <p>No conditions are recorded for this path.</p> : null}
    {additionalConditions.length ? <section><h3>Additional conditions in this agreement</h3><ul>{additionalConditions.map(value => <li key={value}>{value} — review needed</li>)}</ul><p>Revisit the saved decision to review these additional conditions.</p></section> : null}
</details>
    <details className={styles.outcomeDisclosure} ref={workRef}><summary>Implementation work <span>{progress.pending.length ? `${progress.pending.length} pending` : "No work pending"}</span></summary>
    {progress.work.map(item => <article className={styles.pathCondition} key={item.node?.node_id ?? item.title}><strong>{item.node?.label ?? item.title}</strong><p>{item.node?.state ?? "Not yet tracked"}</p>{item.node ? <><button className="btn quiet" onClick={() => onSelectNode(item.node!.node_id)}>Open work item</button>{!["done","complete","completed"].includes(item.node.state) ? <button className="btn quiet" disabled={busy} onClick={() => void run(() => completeWorkItem(snapshot.matter_id,item.node!.record_id,"Lawyer"))}>Mark work complete</button> : null}</> : <button className="btn quiet" disabled={busy || option.work_item_ids.includes(item.title)} onClick={() => void run(() => createMatterWorkItem(snapshot.matter_id,{title:item.title, description:`Implementation for agreed path: ${option.title}`, item_type:"mitigation", status:"open", priority:"normal", owner:"Lawyer", required:true, issue_id:analysis.issue_id, source_action_key:`path-work:${option.option_revision}:${option.remaining_work.indexOf(item.title)}`}))}>Create linked work item</button>}</article>)}
    {!progress.work.length ? <p>No implementation work is listed in this analysis.</p> : null}
</details>
    <details className={styles.outcomeDisclosure}><summary>Why this path and its risks</summary><p>{option.recommendation_reason || option.condition_summary}</p>{option.trade_off ? <><h4>Risk or trade-off</h4><p>{option.trade_off}</p></> : null}</details>
    <details className={styles.outcomeDisclosure} ref={effectsRef}><summary>Effects on connected paths <span>{effects.length}</span></summary><section aria-label="Effects on connected paths">{effects.length ? effects.map((effect, index) => <article className={styles.pathCondition} key={index}><strong>{effect.label}</strong><p>{effect.reason}</p>{decision && effect.targetId === node.node_id && effect.effective ? <p>Agreement needs review: this effect also applies to your agreed path.</p> : null}<button className="btn quiet" onClick={() => onSelectNode(effect.targetId === node.node_id ? effect.sourceId : effect.targetId)}>Open {snapshot.nodes.find(n => n.node_id === (effect.targetId === node.node_id ? effect.sourceId : effect.targetId))?.label ?? "connected path"}</button>{effect.triggerIds.map(id => <button className="btn quiet" key={id} onClick={() => onSelectNode(id)}>Review trigger: {snapshot.nodes.find(n => n.node_id === id)?.label ?? "record"}</button>)}</article>) : <p>No effects on other paths are recorded. Connected nodes are not treated as excluded merely because they are connected.</p>}</section></details>    <details className={styles.outcomeDisclosure}><summary>Business question and agreement details</summary><h4>Original business question</h4><p>{question?.label}</p><h4>What this changes</h4><p>{analysis.business_effect}</p><p>This outcome covers this issue. Other issues remain separate.</p><p>{progress.label}</p>{decision ? <p>Recorded by {String(decision.data?.decision_maker ?? "Lawyer")} · {String(decision.data?.decided_at ?? "")}</p> : null}</details>
    </div>
    <button className="btn quiet" onClick={() => onDiscuss()}>Discuss what remains</button>
  </section>;
}
