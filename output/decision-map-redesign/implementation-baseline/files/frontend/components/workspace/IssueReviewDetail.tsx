"use client";

import { useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type {
  ConversationTarget,
  IssueDispositionCommand,
  IssueDispositionState,
  IssueReviewDetailProps,
  IssueUpdate,
  SupportingQuestionCommand,
  WorkspaceQuestion,
  WorkspaceClaim,
} from "@/lib/workspaceTypes";
import MatterIcon from "./MatterIcon";
import styles from "./MatterIssue.module.css";

type DetailActionKeys =
  | "onIssueUpdate"
  | "onQuestionAnswer"
  | "onDisposition"
  | "onOpenEvidence"
  | "onOpenDocument"
  | "onResearchLegalBasis"
  | "onCreateMitigation"
  | "onRecordDecision"
  | "onDiscuss"
  | "onOpenDecisionMap";

export interface IssueResponseOption {
  option_id: string;
  title: string;
  condition?: string | null;
  state?: string | null;
}

export interface SupportedTextRenderInput {
  text: string;
  surface: "current_answer" | "issue_claim";
  claim?: WorkspaceClaim;
  claims: WorkspaceClaim[];
}

export type IssueReviewDetailComponentProps = Omit<IssueReviewDetailProps, DetailActionKeys> & Partial<Pick<IssueReviewDetailProps, DetailActionKeys>> & {
  responseOptions?: IssueResponseOption[];
  renderSupportedText?: (input: SupportedTextRenderInput) => ReactNode;
};

type IssueDraft = { title: string; parentIssueId: string; whyItMatters: string; baseRevision: string };

const reading: CSSProperties = { color: "var(--ink-2)", font: "400 16px/1.65 var(--serif)", margin: "7px 0", overflowWrap: "anywhere", whiteSpace: "pre-wrap" };
const muted: CSSProperties = { color: "var(--ink-3)", font: "400 15px/1.5 var(--sans)", margin: "5px 0", overflowWrap: "anywhere" };
const actionStyle: CSSProperties = { maxWidth: "100%", whiteSpace: "normal", overflowWrap: "anywhere", textAlign: "left" };

export function dispositionLabel(disposition?: IssueDispositionState | null) {
  if (disposition === "mitigation_in_progress") return "Mitigation in progress";
  if (disposition === "resolved") return "Resolved";
  if (disposition === "risk_accepted") return "Risk accepted";
  if (disposition === "not_applicable") return "Not applicable";
  return disposition === "unresolved" ? "Unresolved" : "No disposition recorded";
}

function questionLabel(question: WorkspaceQuestion) {
  if (question.state === "answered") return "Answered";
  if (question.state === "left_open") return "Left open";
  return "Open";
}

function compactIssueTitle(title: string, limit = 70) {
  const clean = title.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const boundary = clean.lastIndexOf(" ", limit - 1);
  return `${clean.slice(0, boundary > 0 ? boundary : limit).trimEnd()}…`;
}

function lawyerStateLabel(state?: string | null) {
  if (state === "explored") return "Explored";
  if (state === "set_aside") return "Set aside";
  return "Open";
}

function uniqueActionKey(prefix: string) {
  return `${prefix}:${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;
}

export default function IssueReviewDetail(props: IssueReviewDetailComponentProps) {
  const { issue, issuesRevision, questions, claims, workItems, decisions, busy = false, error } = props;
  const [issueDraft, setIssueDraft] = useState<IssueDraft | null>(null);
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [disposition, setDisposition] = useState<IssueDispositionState>("unresolved");
  const [reason, setReason] = useState("");
  const [decisionIds, setDecisionIds] = useState<string[]>([]);
  const [dispositionFormOpen, setDispositionFormOpen] = useState(false);
  const [dispositionBaseRevision, setDispositionBaseRevision] = useState<string | null>(null);
  const [localBusy, setLocalBusy] = useState("");
  const [localError, setLocalError] = useState("");
  const actionKeys = useRef(new Map<string, string>());
  const actionKey = (signature: string) => {
    const saved = actionKeys.current.get(signature);
    if (saved) return saved;
    const next = uniqueActionKey(`issue:${issue.issue_id}`);
    actionKeys.current.set(signature, next);
    return next;
  };
  const unavailable = "This action will be available after the matter page finishes loading its review controls.";
  const target: ConversationTarget = { matter_id: props.matterId, issue_id: issue.issue_id };
  const currentDisposition = dispositionLabel(issue.disposition);
  const fullIssueTitle = issue.title || "Untitled issue";
  const titlePreview = compactIssueTitle(fullIssueTitle);
  const titleIsShortened = titlePreview !== fullIssueTitle;
  const hasCitedEvidence = claims.some((claim) => claim.evidence.length > 0);
  const isReopen = Boolean(issue.disposition && issue.disposition !== "unresolved" && disposition === "unresolved");
  const riskNeedsDecision = disposition === "risk_accepted" && decisionIds.length === 0;

  function openDispositionForm() {
    setDisposition(issue.disposition === "unresolved" ? "mitigation_in_progress" : "unresolved");
    setReason("");
    setDecisionIds(issue.linked_decision_ids ?? []);
    setDispositionBaseRevision(issuesRevision);
    setDispositionFormOpen(true);
    setLocalError("");
  }

  function cancelDispositionForm() {
    setDispositionFormOpen(false);
    setDispositionBaseRevision(null);
    setReason("");
    setDecisionIds([]);
    setLocalError("");
  }

  async function saveIssue() {
    if (!issueDraft || !props.onIssueUpdate) return;
    if (issueDraft.baseRevision !== issuesRevision) {
      setLocalError("The issue changed while you were editing. Use the latest issue before you save.");
      return;
    }
    const command: IssueUpdate = {
      expected_revision: issueDraft.baseRevision,
      title: issueDraft.title.trim(),
      parent_issue_id: issueDraft.parentIssueId.trim() || null,
      why_it_matters: issueDraft.whyItMatters.trim() || null,
    };
    setLocalBusy("issue"); setLocalError("");
    try { await props.onIssueUpdate(issue.issue_id, command); setIssueDraft(null); }
    catch (cause) { setLocalError(cause instanceof Error ? cause.message : "The issue change was not saved. Your text is retained."); }
    finally { setLocalBusy(""); }
  }

  async function answerQuestion(question: WorkspaceQuestion, state: SupportingQuestionCommand["state"]) {
    if (!props.onQuestionAnswer) return;
    const answer = answerDrafts[question.question_id]?.trim();
    if (state === "answered" && !answer) return;
    const answerKind = question.question_kind === "legal" ? "legal_analysis" : "reported_fact";
    const signature = `question:${question.question_id}:${question.source_revision ?? ""}:${state}:${answerKind}:${answer ?? ""}`;
    setLocalBusy(`question:${question.question_id}`); setLocalError("");
    try {
      await props.onQuestionAnswer(question.question_id, {
        state,
        answer: state === "answered" ? answer : undefined,
        answer_kind: state === "answered" ? answerKind : undefined,
        expected_revision: question.source_revision ?? "",
        source_action_key: actionKey(signature),
      });
      setAnswerDrafts((current) => { const next = { ...current }; delete next[question.question_id]; return next; });
    } catch (cause) { setLocalError(cause instanceof Error ? cause.message : "The answer was not saved. Your text is retained."); }
    finally { setLocalBusy(""); }
  }

  async function recordDisposition() {
    if (!props.onDisposition || !reason.trim() || riskNeedsDecision) return;
    if (!dispositionBaseRevision || dispositionBaseRevision !== issuesRevision) {
      setLocalError("The issue changed while you were choosing a disposition. Cancel and open the form again to use the latest issue.");
      return;
    }
    const command: IssueDispositionCommand = {
      disposition,
      reason: reason.trim(),
      expected_revision: dispositionBaseRevision,
      source_action_key: actionKey(`disposition:${dispositionBaseRevision}:${disposition}:${reason.trim()}:${decisionIds.join(",")}`),
      linked_work_item_ids: issue.linked_work_item_ids ?? [],
      linked_decision_ids: decisionIds,
    };
    setLocalBusy("disposition"); setLocalError("");
    try { await props.onDisposition(issue.issue_id, command); cancelDispositionForm(); }
    catch (cause) { setLocalError(cause instanceof Error ? cause.message : "The disposition was not recorded. Your reason is retained."); }
    finally { setLocalBusy(""); }
  }

  return <article aria-label={`Issue review: ${issue.title}`} className={styles.detail}>
    <header className={styles.detailHead}>
      <div><span className={styles.kicker}>What needs your judgment</span><h2 className={styles.questionTitle}>{titlePreview}</h2>
        {titleIsShortened ? <details className={styles.fullTitle}><summary>Read full issue title</summary><p>{fullIssueTitle}</p></details> : null}
        <div className={styles.statusRow}><span className={styles.lawyerState}>{lawyerStateLabel(issue.lawyer_state)}</span><span className={styles.disposition}>{currentDisposition}</span></div>
        <p className={styles.why}>{issue.why_it_matters || "No business consequence is saved for this issue."}</p>
        <p className={styles.nextAction}><strong>Next action:</strong> {issue.next_action || "Review the saved analysis and record the next position."}</p>
        <p className={styles.owner}><MatterIcon name="user" size={20} /><span>Owner</span> <strong>{issue.action_owner || "Unassigned"}</strong></p>
      </div>
      <div className={styles.detailActions}>
        <button className="btn" disabled={!props.onOpenDecisionMap} onClick={() => props.onOpenDecisionMap?.(issue.issue_id)} style={actionStyle} title={!props.onOpenDecisionMap ? unavailable : undefined} type="button"><MatterIcon name="map" size={21} /> Open decision map</button>
        <button className="btn" disabled={!props.onDiscuss} onClick={() => props.onDiscuss?.(target)} style={actionStyle} title={!props.onDiscuss ? unavailable : undefined} type="button"><MatterIcon name="chat" size={21} /> Discuss this issue</button>
        <details className={styles.details}>
        <summary>Edit issue details</summary>
        {!props.onIssueUpdate ? <p style={muted}>{unavailable}</p> : <div style={{ display: "grid", gap: 9, marginTop: 10 }}>
          <label className="field-block"><span className="field-label">Issue title</span><input className="text-input" disabled={busy || localBusy === "issue"} onChange={(event) => setIssueDraft((current) => ({ title: event.target.value, parentIssueId: current?.parentIssueId ?? issue.parent_issue_id ?? "", whyItMatters: current?.whyItMatters ?? issue.why_it_matters ?? "", baseRevision: current?.baseRevision ?? issuesRevision }))} value={issueDraft?.title ?? issue.title} /></label>
          <label className="field-block"><span className="field-label">Parent issue ID</span><input className="text-input" disabled={busy || localBusy === "issue"} onChange={(event) => setIssueDraft((current) => ({ title: current?.title ?? issue.title, parentIssueId: event.target.value, whyItMatters: current?.whyItMatters ?? issue.why_it_matters ?? "", baseRevision: current?.baseRevision ?? issuesRevision }))} value={issueDraft?.parentIssueId ?? issue.parent_issue_id ?? ""} /></label>
          <label className="field-block"><span className="field-label">Why this matters</span><textarea className="text-input prose" disabled={busy || localBusy === "issue"} onChange={(event) => setIssueDraft((current) => ({ title: current?.title ?? issue.title, parentIssueId: current?.parentIssueId ?? issue.parent_issue_id ?? "", whyItMatters: event.target.value, baseRevision: current?.baseRevision ?? issuesRevision }))} value={issueDraft?.whyItMatters ?? issue.why_it_matters ?? ""} /></label>
          <div className="btn-row"><button className="btn tiny" disabled={!issueDraft || !issueDraft.title.trim() || issueDraft.baseRevision !== issuesRevision || busy || Boolean(localBusy)} onClick={() => void saveIssue()} type="button">{localBusy === "issue" ? "Saving…" : "Save issue details"}</button><button className="btn quiet tiny" disabled={!issueDraft || Boolean(localBusy)} onClick={() => setIssueDraft(null)} type="button">Cancel</button></div>
        </div>}
        </details>
      </div>
    </header>

    <div className={styles.sectionStack}>
    <section aria-labelledby={`why-${issue.issue_id}`} className={styles.issueSection}><span className={styles.sectionIcon}><MatterIcon name="map" size={25} /></span><span className="record-meta">Why this matters</span><h3 className={styles.sectionTitle} id={`why-${issue.issue_id}`}>Business effect</h3><p className={styles.sectionLead}>{issue.why_it_matters || "No business consequence is saved for this issue."}</p></section>

    <section aria-labelledby={`law-${issue.issue_id}`} className={styles.issueSection}>
      <span className={styles.sectionIcon}><MatterIcon name="scale" size={25} /></span><span className="record-meta">Legal basis</span><h3 className={styles.sectionTitle} id={`law-${issue.issue_id}`}>Claims and applicability</h3>
      {!claims.length ? <div className={styles.sectionBody}><p className={styles.sectionLead}>No cited sources.</p><div className={styles.inlineActions}><button className="btn quiet" disabled={!props.onResearchLegalBasis} onClick={() => props.onResearchLegalBasis?.(issue.issue_id)} title={!props.onResearchLegalBasis ? unavailable : undefined} type="button">Research legal basis</button></div></div> : <div className={styles.sectionBody} style={{ display: "grid", gap: 10 }}>
        {!hasCitedEvidence ? <div className="warning-callout" role="status"><strong>No cited sources.</strong><p style={{ margin: "4px 0" }}>The saved claims remain visible. Research can add claim-level support.</p><button className="btn agent tiny" disabled={!props.onResearchLegalBasis} onClick={() => props.onResearchLegalBasis?.(issue.issue_id)} title={!props.onResearchLegalBasis ? unavailable : undefined} type="button">Research legal basis</button></div> : null}
        {claims.map((claim) => <article className={`${styles.itemCard} ${styles.claim}`} key={`${claim.claim_id}:${claim.claim_revision ?? "legacy"}`}>
          <span className="state-label state-agent">Agent claim</span>{props.renderSupportedText ? <div className={styles.reading}>{props.renderSupportedText({ text: claim.text, surface: "issue_claim", claim, claims: [claim] })}</div> : <p className={styles.reading}>{claim.text}</p>}
          <dl style={{ display: "grid", gridTemplateColumns: "max-content minmax(0, 1fr)", gap: "5px 10px", fontSize: 13 }}><dt>Regulated actor</dt><dd style={{ margin: 0 }}>{claim.applicability?.regulated_actor || "Not stated"}</dd><dt>Jurisdiction</dt><dd style={{ margin: 0 }}>{claim.applicability?.jurisdiction || "Not stated"}</dd><dt>Application</dt><dd style={{ margin: 0 }}>{claim.applicability?.explanation || "Applicability is not explained."}</dd></dl>
          {claim.applicability?.fact_ids?.length ? <p className={styles.muted}>Facts used: {claim.applicability.fact_ids.join(", ")}</p> : null}{claim.applicability?.assumption_ids?.length ? <p className={styles.muted}>Assumptions used: {claim.applicability.assumption_ids.join(", ")}</p> : null}
          {claim.support_gap ? <p className="warning-callout" role="status"><strong>Support gap:</strong> {claim.support_gap}</p> : null}
          {claim.evidence.length ? <div style={{ display: "grid", gap: 7 }}>{claim.evidence.map((evidence, index) => <button className="btn quiet tiny" disabled={!props.onOpenEvidence} key={`${evidence.source_id}:${evidence.locator ?? "no-locator"}:${index}`} onClick={() => props.onOpenEvidence?.(evidence)} style={actionStyle} title={!props.onOpenEvidence ? unavailable : undefined} type="button">{evidence.source_label || evidence.source_id} · {evidence.locator || "Location unavailable"} · {evidence.support_state === "verified" ? "Verified" : evidence.support_state === "retrieved" ? "Retrieved" : evidence.support_state === "supplied" ? "Supplied" : "Support needs review"}</button>)}</div> : <p className={styles.muted}><strong>No claim-level evidence is saved.</strong> This claim remains visible with its support gap.</p>}
        </article>)}
      </div>}
    </section>

    <section aria-labelledby={`questions-${issue.issue_id}`} className={styles.issueSection}>
      <span className={styles.sectionIcon}><MatterIcon name="search" size={25} /></span><span className="record-meta">Questions that change the answer</span><h3 className={styles.sectionTitle} id={`questions-${issue.issue_id}`}>Facts and legal questions</h3>
      {!questions.length ? <p style={muted}>No linked questions are saved for this issue.</p> : <div style={{ display: "grid", gap: 10 }}>{questions.map((question) => {
        const isLegal = question.question_kind === "legal";
        const saving = localBusy === `question:${question.question_id}`;
        return <article className={question.state === "answered" ? undefined : "wash-attention"} key={question.question_id} style={{ border: "1px solid var(--line-faint)", borderRadius: "var(--radius)", padding: 12 }}>
          <div className="btn-row"><span className={`state-label ${question.state === "answered" ? "state-healthy" : "state-attention"}`}>{questionLabel(question)}</span><span className="record-meta">{isLegal ? "Legal question" : "Factual question"}</span>{(question.issue_ids?.length ?? 0) > 1 ? <span className="record-meta">Shared with {question.issue_ids!.length} issues</span> : null}</div>
          <p style={reading}>{question.text}</p>{question.consequence ? <p style={muted}>{question.consequence}</p> : null}
          {question.answer ? <div><span className="record-meta">{question.answer_kind === "legal_analysis" || isLegal ? "Legal analysis" : "Reported fact"}</span><p style={reading}>{question.answer}</p></div> : null}
          {question.state !== "answered" ? <div style={{ display: "grid", gap: 8 }}><label className="field-block"><span className="field-label">{isLegal ? "Legal analysis" : "Reported fact"}</span><textarea className="text-input prose" disabled={busy || saving || !props.onQuestionAnswer} onChange={(event) => setAnswerDrafts((current) => ({ ...current, [question.question_id]: event.target.value }))} placeholder={isLegal ? "Record legal analysis. This will not create a reported fact." : "Record the answer as a reported fact."} value={answerDrafts[question.question_id] ?? ""} /></label><div className="btn-row"><button className="btn tiny" disabled={busy || saving || !props.onQuestionAnswer || !(answerDrafts[question.question_id] ?? "").trim()} onClick={() => void answerQuestion(question, "answered")} type="button">{saving ? "Saving…" : isLegal ? "Save legal analysis" : "Save reported fact"}</button><button className="btn quiet tiny" disabled={busy || saving || !props.onQuestionAnswer} onClick={() => void answerQuestion(question, "left_open")} type="button">Leave open</button></div>{!props.onQuestionAnswer ? <p style={muted}>{unavailable}</p> : null}</div> : null}
        </article>;
      })}</div>}
    </section>

    <section aria-labelledby={`ways-${issue.issue_id}`} className={styles.issueSection}>
      <span className={styles.sectionIcon}><MatterIcon name="check" size={25} /></span><span className="record-meta">Ways forward</span><h3 className={styles.sectionTitle} id={`ways-${issue.issue_id}`}>Options and mitigation</h3>
      {props.responseOptions?.length ? <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>{props.responseOptions.map((option) => <article className="wash-agent" key={option.option_id} style={{ border: "1px dashed var(--agent-edge)", borderRadius: "var(--radius)", padding: 11 }}><div className="btn-row"><span className={`state-label ${option.state === "selected" ? "state-healthy" : option.state === "unknown" || !option.state ? "state-attention" : "state-agent"}`}>{option.state || "Unknown"}</span><span className="record-meta">{option.option_id}</span></div><h4 style={{ font: "600 16px/1.35 var(--serif)", margin: "6px 0" }}>{option.title}</h4><p style={muted}><strong>Condition:</strong> {option.condition?.trim() || "Unknown condition"}</p></article>)}</div> : <p style={muted}>No saved response options are linked to this issue.</p>}
      {workItems.length ? <div style={{ display: "grid", gap: 8 }}>{workItems.map((work) => <article key={work.work_item_id} style={{ border: "1px solid var(--line-faint)", borderRadius: "var(--radius)", padding: 11 }}><strong>{work.title}</strong><div className="btn-row" style={{ marginTop: 5 }}><span className={`state-label ${work.state === "done" || work.state === "complete" || work.state === "completed" ? "state-healthy" : "state-attention"}`}>{work.state === "done" || work.state === "complete" || work.state === "completed" ? "Completed" : work.state || "State unknown"}</span><span style={muted}>Owner: {work.owner || "Unassigned"}</span>{work.required ? <span className="state-label state-attention">Required</span> : null}</div></article>)}</div> : <p style={muted}>No mitigation work is linked to this issue.</p>}
      <div className="btn-row" style={{ marginTop: 10 }}><button className="btn tiny" disabled={!props.onCreateMitigation} onClick={() => props.onCreateMitigation?.(issue.issue_id)} title={!props.onCreateMitigation ? unavailable : undefined} type="button">Create mitigation work</button><button className="btn quiet tiny" disabled={!props.onRecordDecision} onClick={() => props.onRecordDecision?.(issue.issue_id)} title={!props.onRecordDecision ? unavailable : undefined} type="button">Record formal decision</button></div>
      {!props.onCreateMitigation && !props.onRecordDecision ? <p style={muted}>{unavailable}</p> : null}
    </section></div>

    <section aria-labelledby={`position-${issue.issue_id}`} className={styles.recordedPosition}>
      <span className="record-meta">Your recorded position</span><h3 className={styles.positionTitle} id={`position-${issue.issue_id}`}>{currentDisposition}</h3>
      {issue.disposition_reason ? <p style={reading}>{issue.disposition_reason}</p> : <p style={muted}>No disposition reason is recorded.</p>}
      {decisions.length ? <div style={{ display: "grid", gap: 8 }}>{decisions.map((decision) => <article key={decision.decision_id} style={{ border: "1px solid var(--line-faint)", borderRadius: "var(--radius)", padding: 11 }}><span className="state-label state-healthy">Recorded</span><h4 style={{ font: "600 16px/1.35 var(--serif)", margin: "6px 0" }}>{decision.title}</h4><p style={reading}>{decision.chosen_path}</p><p style={muted}>{decision.rationale} · {decision.decision_maker || "Unknown decision maker"}{decision.decided_at ? ` · ${decision.decided_at}` : ""}</p></article>)}</div> : <p style={muted}>No formal decision is linked to this issue.</p>}
      {!dispositionFormOpen ? <button className="btn tiny" disabled={!props.onDisposition || busy || Boolean(localBusy)} onClick={openDispositionForm} style={{ ...actionStyle, marginTop: 12 }} title={!props.onDisposition ? unavailable : undefined} type="button">{issue.disposition && issue.disposition !== "unresolved" ? "Change or reopen disposition" : "Record disposition"}</button> : <fieldset disabled={busy || Boolean(localBusy)} style={{ border: "1px solid var(--line-faint)", borderRadius: "var(--radius)", margin: "14px 0 0", padding: 12 }}><legend className="field-label">Record issue disposition</legend>{dispositionBaseRevision !== issuesRevision ? <p className="warning-callout" role="status"><strong>The issue changed while this form was open.</strong> Cancel and open it again before you record a disposition.</p> : null}<label className="field-block"><span className="field-label">Disposition</span><select className="select-input" onChange={(event) => setDisposition(event.target.value as IssueDispositionState)} value={disposition}><option value="unresolved">Unresolved / reopen</option><option value="mitigation_in_progress">Mitigation in progress</option><option value="resolved">Resolved</option><option value="risk_accepted">Risk accepted</option><option value="not_applicable">Not applicable</option></select></label><label className="field-block"><span className="field-label">Reason</span><textarea className="text-input prose" onChange={(event) => setReason(event.target.value)} placeholder="Give the reason for this recorded position." value={reason} /></label>{disposition === "risk_accepted" ? <fieldset style={{ border: "1px solid var(--line-faint)", borderRadius: "var(--radius)", margin: "8px 0", padding: 10 }}><legend className="field-label">Decision that records risk acceptance</legend>{decisions.length ? decisions.map((decision) => <label key={decision.decision_id} style={{ display: "block", margin: "6px 0" }}><input checked={decisionIds.includes(decision.decision_id)} onChange={(event) => setDecisionIds((current) => event.target.checked ? [...new Set([...current, decision.decision_id])] : current.filter((id) => id !== decision.decision_id))} type="checkbox" /> {decision.title}</label>) : <p style={muted}>Record a formal decision before you accept risk.</p>}</fieldset> : null}<div className="btn-row"><button className="btn tiny" disabled={!reason.trim() || riskNeedsDecision || dispositionBaseRevision !== issuesRevision || busy || Boolean(localBusy)} onClick={() => void recordDisposition()} style={actionStyle} type="button">{localBusy === "disposition" ? "Recording…" : isReopen ? "Reopen issue" : "Record disposition"}</button><button className="btn quiet tiny" disabled={busy || Boolean(localBusy)} onClick={cancelDispositionForm} type="button">Cancel</button></div></fieldset>}
      {!props.onDisposition ? <p style={muted}>{unavailable}</p> : null}
      <details style={{ marginTop: 12 }}><summary>Disposition history ({issue.disposition_history?.length ?? 0})</summary>{issue.disposition_history?.length ? <ol style={{ ...muted, paddingLeft: 20 }}>{issue.disposition_history.map((record) => <li key={record.disposition_id} style={{ margin: "8px 0" }}><strong>{record.action === "reopened" ? "Reopened" : dispositionLabel(record.disposition)}</strong> · {record.actor_name || "Unknown actor"} · {record.recorded_at || "Date unavailable"}<br />{record.reason}</li>)}</ol> : <p style={muted}>No disposition history is saved.</p>}</details>
    </section>
    {(error || localError) ? <p className="warning-callout" role="status">{localError || error}</p> : null}
  </article>;
}
