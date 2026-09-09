"use client";

import { useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { CSSProperties } from "react";
import type { InteractionReceipt, IssueReviewDetailProps, LinkedIssueDecision, LinkedIssueWork, QuestionChange, QuestionCommand, SupportingQuestionCommand, UnderstandPanelProps, WorkspaceQuestion } from "@/lib/workspaceTypes";
import type { ContinuityUnderstandPanelProps, WorkTarget } from "@/lib/continuityTypes";
import { canCompareSuppliedSource, canRequestFact, orientationAnswer } from "@/lib/orientationPresentation";
import ChangeRecap from "./ChangeRecap";
import IssueNavigator from "./IssueNavigator";
import IssueReviewDetail from "./IssueReviewDetail";
import type { IssueResponseOption, SupportedTextRenderInput } from "./IssueReviewDetail";
import OrientationSummary from "./OrientationSummary";
import WorkItemSummary from "./WorkItemSummary";
import styles from "./MatterReview.module.css";

type ReviewIntegrationActions = "onCompleteWork" | "onDisposition" | "onOpenDocument" | "onResearchLegalBasis" | "onCreateMitigation" | "onRecordDecision" | "onDiscuss" | "onOpenDecisionMap" | "onAnalyzePaths" | "onRecordPath";
export type UnderstandPanelIntegrationProps = ContinuityUnderstandPanelProps & Partial<Pick<IssueReviewDetailProps, ReviewIntegrationActions>> & {
  linkedWorkItems?: LinkedIssueWork[];
  linkedDecisions?: LinkedIssueDecision[];
  responseOptions?: IssueResponseOption[];
  renderSupportedText?: (input: SupportedTextRenderInput) => React.ReactNode;
  sectionNavigation?: React.ReactNode;
};

const reading: CSSProperties = { font: "400 16px/1.65 var(--serif)", color: "var(--ink-2)", margin: "8px 0" };
const card: CSSProperties = { border: "1px solid var(--line)", borderRadius: "var(--radius)", background: "var(--raised)", padding: 16, minWidth: 0 };
const muted: CSSProperties = { color: "var(--ink-4)", font: "400 15px/1.5 var(--sans)", margin: "5px 0" };
type QuestionDraft = { text: string; baseRevision: string };
const LONG_ANSWER_CHARACTER_LIMIT = 1200;
type AnswerPreview = { text: string; earlierText?: string };

function openingBlockPreview(answer: string): AnswerPreview {
  const completeAnswer = { text: answer };
  let fence: { character: string; length: number } | null = null;
  let position = 0;
  let previewEnd = 0;
  for (const line of answer.split(/(?<=\n)/)) {
    position += line.length;
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      const nextFence = marker[1];
      if (!fence) fence = { character: nextFence[0], length: nextFence.length };
      else if (fence.character === nextFence[0] && nextFence.length >= fence.length) fence = null;
    }
    if (!fence && /^\s*\n$/.test(line) && position <= LONG_ANSWER_CHARACTER_LIMIT) previewEnd = position;
  }
  return previewEnd ? { text: answer.slice(0, previewEnd).trimEnd() } : completeAnswer;
}

export function longAnswerPreview(answer: string): AnswerPreview {
  const completeAnswer = { text: answer };
  if (answer.length <= LONG_ANSWER_CHARACTER_LIMIT) return completeAnswer;
  if (/!?\[[^\]]+\]\[[^\]]*\]|^\s*\[[^\]]+\]:/m.test(answer)) return completeAnswer;
  if (/^\s*(`{3,}|~{3,})/m.test(answer)) return openingBlockPreview(answer);
  let position = 0;
  for (const line of answer.split(/(?<=\n)/)) {
    const lineStart = position;
    position += line.length;
    if (/^\s*(?:#{1,6}\s+)?Current answer\s*#*\s*$/i.test(line)) {
      const earlierText = answer.slice(0, lineStart).trim();
      return earlierText ? { text: answer.slice(lineStart).trimStart(), earlierText } : completeAnswer;
    }
  }
  return openingBlockPreview(answer);
}

const answerMarkdownComponents = {
  table: ({ children }: { children?: React.ReactNode }) => <div className={styles.tableScroll}><table>{children}</table></div>,
  pre: ({ children }: { children?: React.ReactNode }) => <pre className={styles.codeBlock}>{children}</pre>,
};

function receiptText(receipt: InteractionReceipt, fallback: string) {
  if (receipt.state === "not_saved") {
    return (receipt.completed_parts ?? []).includes("reported_fact")
      ? "Fact saved. Question update not saved."
      : `${fallback} not saved.`;
  }
  if (receipt.state === "proposed") return "Proposed reframe saved.";
  return `${fallback} saved.`;
}

function questionState(question: WorkspaceQuestion) {
  if (question.state === "answered") return "Answered";
  if (question.state === "left_open") return "Left open";
  return "Open question";
}

export function questionAnswerKind(question: WorkspaceQuestion) {
  return question.question_kind === "legal" ? "legal_analysis" as const : "reported_fact" as const;
}

function questionAnswerLabel(question: WorkspaceQuestion) {
  return questionAnswerKind(question) === "legal_analysis" ? "Legal analysis" : "Reported fact";
}

function receiptClass(state: InteractionReceipt["state"] | "working" | null) {
  return state === "not_saved" ? "state-failure" : state === "proposed" || state === "working" ? "state-agent" : "state-healthy";
}

export default function UnderstandPanel(props: UnderstandPanelIntegrationProps) {
  const { snapshot, loading, error, selectedIssueId, onSelectIssue, onIssueUpdate, onQuestionChange, onProposalAction, onQuestionAnswer, onQuestionHistory, onQuestionRestore, onRefresh, onTargetChange, onAction, onOpenArtifact, onOpenEvidence } = props;
  const answerClaims = snapshot?.answer_claims ?? [];
  const [questionDraft, setQuestionDraft] = useState<QuestionDraft | null>(null);
  const [proposalDrafts, setProposalDrafts] = useState<Record<string, string>>({});
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [answeringIds, setAnsweringIds] = useState<string[]>([]);
  const [history, setHistory] = useState(props.questionHistory ?? []);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeState, setNoticeState] = useState<InteractionReceipt["state"] | "working" | null>(null);
  const [actionError, setActionError] = useState("");
  const [answerExpanded, setAnswerExpanded] = useState(false);
  const [hiddenReviewIds, setHiddenReviewIds] = useState<string[]>([]);
  const answerId = useId();
  const allIssuesRef = useRef<HTMLElement>(null);
  const actionKeys = useRef(new Map<string, string>());
  const proposalInputs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const actionKey = (signature: string) => {
    const existing = actionKeys.current.get(signature);
    if (existing) return existing;
    const key = `workspace:${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;
    actionKeys.current.set(signature, key);
    return key;
  };

  if (!snapshot) return <section aria-label="Matter understanding" className={styles.card}>
    <h1 style={{ margin: 0 }}>{loading ? "Preparing matter understanding" : "Matter understanding"}</h1>
    <p style={muted}>{loading ? "Loading the saved question and work." : error || "No saved matter understanding is available."}</p>
    {error ? <button className="btn tiny" onClick={onRefresh} type="button">Retry</button> : null}
  </section>;

  const currentQuestion = snapshot.question;
  const matterId = snapshot.matter_id;
  const questions = snapshot.questions ?? (snapshot.supporting_question ? [snapshot.supporting_question] : []);
  const proposals = snapshot.pending_reframes ?? [];
  const facts = props.materialFacts ?? [];
  const sources = props.sourceActions ?? [];
  const savedAnswer = orientationAnswer(props.orientation, snapshot.short_answer);
  const answerIsStale = snapshot.stale || savedAnswer.state === "stale";
  const hasReviewProjection = snapshot.review_items !== undefined;
  const reviewItems = (snapshot.review_items ?? []).filter((item) => !hiddenReviewIds.includes(item.issue_id)).slice(0, 3);
  const issueById = new Map((snapshot.issues ?? []).map((issue) => [issue.issue_id, issue]));
  const selectedIssue = selectedIssueId ? issueById.get(selectedIssueId) ?? null : null;
  const effectiveQuestionLinks = (question: WorkspaceQuestion) => [...new Set([question.issue_id, ...(question.issue_ids ?? [])].filter((id): id is string => Boolean(id)))];
  const selectedQuestions = selectedIssue ? questions.filter((question) => effectiveQuestionLinks(question).includes(selectedIssue.issue_id)) : [];
  const analysisStatus = selectedIssue ? snapshot.issue_analyses?.[selectedIssue.issue_id] : undefined;
  const selectedClaims = selectedIssue ? (snapshot.claims ?? []).filter((claim) => ((selectedIssue.claim_ids ?? []).includes(claim.claim_id) && (!selectedIssue.claim_output_revisions?.[claim.claim_id] || selectedIssue.claim_output_revisions[claim.claim_id] === claim.output_revision)) || (Boolean(analysisStatus?.analysis?.source_revisions[`claim:${claim.claim_id}`]) && analysisStatus?.analysis?.source_revisions[`claim:${claim.claim_id}`] === claim.output_revision)) : [];
  const openTarget = (target: WorkTarget) => {
    if (props.onOpenTarget) { props.onOpenTarget(target); return; }
    if (target.path) { onOpenArtifact(target.path); return; }
    onTargetChange({ matter_id: target.matter_id, artifact_path: target.kind === "artifact" ? target.path : undefined });
  };
  const chooseIssue = (issueId: string | null) => {
    onSelectIssue(issueId);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
    onTargetChange(issueId ? { matter_id: snapshot.matter_id, business_question_id: currentQuestion.question_id, business_question_revision: currentQuestion.revision, issue_id: issueId } : null);
  };
  async function useReceipt(action: () => Promise<InteractionReceipt>, savedLabel: string, after?: () => void) {
    setBusy(true); setActionError("");
    try {
      const receipt = await action();
      setNotice(receiptText(receipt, savedLabel));
      setNoticeState(receipt.state);
      if (receipt.state !== "not_saved") after?.();
      onRefresh();
      return receipt;
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : `${savedLabel} was not saved. Your text is retained.`);
      return null;
    } finally { setBusy(false); }
  }
  async function saveQuestion() {
    const draft = questionDraft;
    if (!draft?.text.trim()) return;
    if (draft.baseRevision !== currentQuestion.revision) {
      setActionError("The business question changed after you began editing. Rebase your edit or use the latest saved question before saving.");
      return;
    }
    const text = draft.text.trim();
    const signature = `question:${draft.baseRevision}:${text}`;
    await useReceipt(() => onQuestionChange({ text, expected_revision: draft.baseRevision, source_action_key: actionKey(signature) }), "Business question", () => setQuestionDraft(null));
  }
  async function actOnProposal(proposal: QuestionChange, action: "apply" | "reject") {
    const text = (proposalDrafts[proposal.proposal_id] ?? proposal.text).trim();
    const signature = `proposal:${action}:${proposal.proposal_id}:${currentQuestion.revision}:${text}`;
    await useReceipt(() => onProposalAction(proposal.proposal_id, { action, text: action === "apply" ? text : undefined, expected_revision: currentQuestion.revision, source_action_key: actionKey(signature) }), action === "apply" ? "Proposed reframe" : "Proposal rejection", () => setProposalDrafts((current) => { const next = { ...current }; delete next[proposal.proposal_id]; return next; }));
  }
  async function answerQuestion(question: WorkspaceQuestion, state: SupportingQuestionCommand["state"]) {
    const answer = answerDrafts[question.question_id]?.trim();
    if (state === "answered" && !answer) return;
    const signature = `support:${state}:${question.question_id}:${question.source_revision ?? ""}:${answer ?? ""}`;
    setAnsweringIds((current) => current.includes(question.question_id) ? current : [...current, question.question_id]); setActionError("");
    try {
      const receipt = await onQuestionAnswer(question.question_id, { state, answer: state === "answered" ? answer : undefined, answer_kind: state === "answered" ? questionAnswerKind(question) : undefined, expected_revision: question.source_revision ?? "", source_action_key: actionKey(signature) });
      setNotice(receiptText(receipt, state === "answered" ? "Answer" : "Question state"));
      setNoticeState(receipt.state);
      if (receipt.state !== "not_saved") setAnswerDrafts((current) => { const next = { ...current }; delete next[question.question_id]; return next; });
      onRefresh();
    } catch (cause) { setActionError(cause instanceof Error ? cause.message : "Question update was not saved. Your text is retained."); }
    finally { setAnsweringIds((current) => current.filter((questionId) => questionId !== question.question_id)); }
  }
  async function exploreQuestion(question: WorkspaceQuestion) {
    const target = { matter_id: matterId, business_question_id: currentQuestion.question_id, business_question_revision: currentQuestion.revision, issue_id: effectiveQuestionLinks(question)[0] ?? null };
    onTargetChange(target);
    setBusy(true); setActionError("");
    try {
      await onAction({ action: "explore_question", instruction: `Explore why this matters: ${question.text}`, target, source_action_key: actionKey(`explore:${question.question_id}:${currentQuestion.revision}`) });
      setNotice("Exploration started in the matter conversation.");
      setNoticeState("working");
    } catch (cause) { setActionError(cause instanceof Error ? cause.message : "Exploration could not start. Try again."); }
    finally { setBusy(false); }
  }
  async function loadHistory() {
    if (!onQuestionHistory) { setHistoryOpen((open) => !open); return; }
    setBusy(true); setActionError("");
    try { setHistory(await onQuestionHistory()); setHistoryOpen(true); }
    catch (cause) { setActionError(cause instanceof Error ? cause.message : "Question history could not load."); }
    finally { setBusy(false); }
  }
  async function restore(revision: string) {
    if (!onQuestionRestore) return;
    await useReceipt(() => onQuestionRestore({ revision, expected_revision: currentQuestion.revision, source_action_key: actionKey(`restore:${revision}:${currentQuestion.revision}`) }), "Earlier business question");
  }
  const questionDetails = <article className={styles.card}>
    <span className="record-meta">Current business question</span>
    {questionDraft === null ? <><h1 style={{ font: "600 24px/1.25 var(--serif)", margin: "5px 0" }}>{currentQuestion.text || "No business question is saved yet."}</h1><div className="btn-row"><button className="btn tiny quiet" onClick={() => setQuestionDraft({ text: currentQuestion.text, baseRevision: currentQuestion.revision })} type="button">Edit question</button><button className="btn tiny quiet" disabled={busy} onClick={() => void loadHistory()} type="button">{historyOpen ? "Refresh earlier questions" : "Earlier questions"}</button></div></> : <div style={{ display: "grid", gap: 9, marginTop: 8 }}><label className="field-block"><span className="field-label">Business question</span><textarea className="text-input prose" disabled={busy} onChange={(event) => setQuestionDraft((current) => current ? { ...current, text: event.target.value } : current)} value={questionDraft.text} /></label>{questionDraft.baseRevision !== currentQuestion.revision ? <div className="warning-callout" role="status"><strong>The saved question changed while you were editing.</strong><div className="btn-row" style={{ marginTop: 8 }}><button className="btn quiet tiny" disabled={busy} onClick={() => setQuestionDraft({ text: currentQuestion.text, baseRevision: currentQuestion.revision })} type="button">Use latest question</button><button className="btn tiny" disabled={busy} onClick={() => setQuestionDraft((current) => current ? { ...current, baseRevision: currentQuestion.revision } : current)} type="button">Rebase my edit</button></div></div> : null}<div className="btn-row"><button className="btn tiny" disabled={busy || questionDraft.baseRevision !== currentQuestion.revision || !questionDraft.text.trim()} onClick={() => void saveQuestion()} type="button">{busy ? "Saving…" : "Save question"}</button><button className="btn tiny quiet" disabled={busy} onClick={() => setQuestionDraft(null)} type="button">Cancel</button></div></div>}
    {historyOpen ? <div style={{ display: "grid", gap: 7, marginTop: 12 }}>{history.map((question) => <div key={question.revision} style={{ borderTop: "1px solid var(--line-faint)", paddingTop: 8 }}><span className="record-meta">{question.revision === currentQuestion.revision ? "Current question" : "Based on an earlier question"}</span><p style={reading}>{question.text}</p>{question.revision !== currentQuestion.revision && onQuestionRestore ? <button className="btn quiet tiny" disabled={busy} onClick={() => void restore(question.revision)} type="button">Restore this question</button> : null}</div>)}</div> : null}
  </article>;

  return <section aria-label="Matter understanding" className={styles.surface} data-issue-selected={selectedIssue ? "true" : undefined} id={`matter-${snapshot.matter_id}-review`}>
    {loading ? <p className="state-label state-agent" role="status">Refreshing saved matter work</p> : null}
    {error ? <div className="warning-callout" role="status"><strong>Workspace refresh failed.</strong> Saved work is still shown. <button className="btn tiny quiet" onClick={onRefresh} type="button">Retry</button></div> : null}
    {selectedIssue ? <button className={`btn quiet ${styles.backToIssues}`} type="button" onClick={() => chooseIssue(null)}>← All issues</button> : null}
    {notice ? <p className={`state-label ${receiptClass(noticeState)}`} role="status">{notice}</p> : null}
    {actionError ? <p className="warning-callout" role="status">{actionError}</p> : null}

    {hasReviewProjection ? <OrientationSummary citationState={answerClaims.some((claim) => claim.evidence.some((evidence) => evidence.available_excerpt && (evidence.path || evidence.url))) ? "available" : "none"} allIssueCount={(snapshot.issues ?? []).length} onOpenIssue={chooseIssue} onShowAllIssues={() => allIssuesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} qualification={snapshot.qualification ?? props.orientation?.caveats?.[0]} question={currentQuestion} renderAnswer={props.renderSupportedText ? (text) => props.renderSupportedText!({ text, surface: "current_answer", claims: answerClaims }) : undefined} reviewItems={snapshot.review_items ?? []} shortAnswer={snapshot.short_answer ?? savedAnswer.text} /> : props.orientation ? <OrientationSummary compact error={error} onOpenTarget={openTarget} onRefresh={onRefresh} orientation={props.orientation} /> : null}

    {answerIsStale ? <p className="warning-callout" role="status">Some saved analysis is based on an earlier question or source version. It remains available while you refresh it. <button className="btn quiet tiny" onClick={onRefresh} type="button">Refresh matter</button></p> : null}

    {!props.orientation && !hasReviewProjection ? questionDetails : null}

    {hasReviewProjection ? <details aria-labelledby="needs-review-heading" className={`${styles.card} ${styles.reviewBlock}`}>
      <summary className={styles.between}><h2 className={styles.sectionTitle} id="needs-review-heading">Needs your review</h2><span className="record-meta">Up to 3 items</span></summary>
      {reviewItems.length ? <div className={styles.reviewRows}>{reviewItems.map((item) => { const issue = issueById.get(item.issue_id); return issue ? <WorkItemSummary item={item} issue={issue} key={item.issue_id} onClosePanel={() => setHiddenReviewIds((current) => current.includes(item.issue_id) ? current : [...current, item.issue_id])} onOpenIssue={chooseIssue} /> : <div className="warning-callout" key={item.issue_id} role="status"><strong>Issue reference unavailable.</strong> Review item {item.issue_id} remains visible.</div>; })}</div> : <p className={styles.muted}>No saved item needs your review.</p>}
    </details> : null}

    {hasReviewProjection ? <section ref={allIssuesRef}><IssueNavigator issues={snapshot.issues ?? []} issuesRevision={snapshot.issues_revision} onSelect={chooseIssue} selectedIssueId={selectedIssueId} /></section> : null}

    {hasReviewProjection ? props.sectionNavigation ?? null : null}

    {hasReviewProjection && selectedIssue ? <IssueReviewDetail onCompleteWork={props.onCompleteWork} analysisStatus={analysisStatus} onAnalyzePaths={props.onAnalyzePaths} onRecordPath={props.onRecordPath} busy={busy} claims={[...new Map([...selectedClaims, ...(analysisStatus?.claims ?? [])].map((claim) => [`${claim.claim_id}:${claim.output_revision}`, claim])).values()]} decisions={props.linkedDecisions ?? []} error={actionError || error} issue={selectedIssue} issuesRevision={snapshot.issues_revision ?? ""} key={selectedIssue.issue_id} matterId={snapshot.matter_id} onCreateMitigation={props.onCreateMitigation} onDiscuss={props.onDiscuss} onDisposition={props.onDisposition} onIssueUpdate={onIssueUpdate} onOpenDecisionMap={props.onOpenDecisionMap} onOpenDocument={props.onOpenDocument} onOpenEvidence={onOpenEvidence} onQuestionAnswer={onQuestionAnswer} onRecordDecision={props.onRecordDecision} onResearchLegalBasis={props.onResearchLegalBasis} questions={selectedQuestions} renderSupportedText={props.renderSupportedText} responseOptions={props.responseOptions ?? []} workItems={props.linkedWorkItems ?? []} /> : null}

    {savedAnswer.text && (!hasReviewProjection || savedAnswer.text.trim() !== (snapshot.short_answer ?? "").trim()) ? (() => {
      const answerIsLong = savedAnswer.text.length > LONG_ANSWER_CHARACTER_LIMIT;
      const preview = answerExpanded || !answerIsLong ? { text: savedAnswer.text } : longAnswerPreview(savedAnswer.text);
      const visibleAnswer = preview.text;
      const previewIsOneLongBlock = answerIsLong && !answerExpanded && visibleAnswer === savedAnswer.text;
      const answerCard = <article className="wash-agent" style={{ ...card, borderStyle: "dashed", borderColor: "var(--agent-edge)" }}><span className="record-meta">{hasReviewProjection ? "Full saved answer" : "Useful current answer"}</span>{answerIsStale ? <span className="state-label state-agent" style={{ marginLeft: 8 }}>Based on an earlier question or source</span> : null}<p style={muted}>Source: {savedAnswer.label}{savedAnswer.path ? ` · ${savedAnswer.path.split("/").at(-1)}` : ""}</p>{!hasReviewProjection && props.orientation?.caveats?.length ? <ul className="warning-callout" style={{ margin: "8px 0", paddingLeft: 24 }}>{props.orientation.caveats.map((caveat, index) => <li key={`${caveat}:${index}`}><ReactMarkdown components={answerMarkdownComponents} remarkPlugins={[remarkGfm]}>{caveat}</ReactMarkdown></li>)}</ul> : null}<div className="reading" id={answerId} style={{ maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere", ...(previewIsOneLongBlock ? { maxHeight: "30rem", overflow: "hidden" } : {}) }}>{props.renderSupportedText ? props.renderSupportedText({ text: visibleAnswer, surface: "current_answer", claims: answerClaims }) : <ReactMarkdown components={answerMarkdownComponents} remarkPlugins={[remarkGfm]}>{visibleAnswer}</ReactMarkdown>}</div>{!answerExpanded && preview.earlierText ? <section aria-label="Earlier text in saved answer" style={{ borderTop: "1px solid var(--line-faint)", marginTop: 16, paddingTop: 12 }}><span className="record-meta">Earlier text in saved answer</span><div className="reading" style={{ maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere" }}>{props.renderSupportedText ? props.renderSupportedText({ text: preview.earlierText, surface: "current_answer", claims: answerClaims }) : <ReactMarkdown components={answerMarkdownComponents} remarkPlugins={[remarkGfm]}>{preview.earlierText}</ReactMarkdown>}</div></section> : null}{answerIsLong ? <><p style={muted}>{answerExpanded ? "The full saved answer is shown." : preview.earlierText ? "Showing the saved current answer first. Earlier text in the saved answer remains below." : previewIsOneLongBlock ? "This saved answer starts with one long Markdown block." : "Showing complete opening blocks from this saved answer."}</p><button aria-controls={answerId} aria-expanded={answerExpanded} className="btn quiet tiny" onClick={() => setAnswerExpanded((expanded) => !expanded)} type="button">{answerExpanded ? "Show less" : "Read full answer"}</button></> : null}{savedAnswer.path ? <div className="btn-row"><button className="btn quiet tiny" onClick={() => onOpenArtifact(savedAnswer.path!)} type="button">Open saved answer</button></div> : null}{snapshot.answer_links?.length ? <div className="btn-row">{snapshot.answer_links.map((path) => <button className="btn quiet tiny" key={path} onClick={() => onOpenArtifact(path)} type="button">Open supporting work</button>)}</div> : null}</article>;
      return hasReviewProjection ? <details><summary>Read full answer</summary><div style={{ marginTop: 10 }}>{answerCard}</div></details> : answerCard;
    })() : props.orientation?.answer_state === "unavailable" ? <article style={card}><span className="record-meta">Useful current answer</span><p style={muted}>No saved answer is available. Refresh the matter or open the next saved work item to recover local context.</p><button className="btn tiny" onClick={onRefresh} type="button">Refresh matter</button></article> : null}



    <details className={styles.details} id={`matter-${snapshot.matter_id}-evidence`} open={!hasReviewProjection}><summary>{hasReviewProjection ? "Supporting material and history" : "Matter details"}</summary><div className={styles.supporting}>
    {props.orientation ? <details><summary>Question, editing and history</summary>{questionDetails}</details> : null}

    {proposals.map((proposal) => <article className="wash-agent" key={proposal.proposal_id} style={{ ...card, borderStyle: "dashed", borderColor: "var(--agent-edge)" }}><span className="record-meta">Proposed reframe</span><label className="field-block" style={{ marginTop: 7 }}><span className="field-label">Suggested business question</span><textarea className="text-input prose" disabled={busy} onChange={(event) => setProposalDrafts((current) => ({ ...current, [proposal.proposal_id]: event.target.value }))} ref={(node) => { proposalInputs.current[proposal.proposal_id] = node; }} value={proposalDrafts[proposal.proposal_id] ?? proposal.text} /></label>{proposal.reason ? <p style={muted}>{proposal.reason}</p> : null}<div className="btn-row"><button className="btn tiny" disabled={busy || !(proposalDrafts[proposal.proposal_id] ?? proposal.text).trim()} onClick={() => void actOnProposal(proposal, "apply")} type="button">Apply</button><button className="btn quiet tiny" disabled={busy} onClick={() => proposalInputs.current[proposal.proposal_id]?.focus()} type="button">Edit</button><button className="btn quiet tiny" disabled={busy} onClick={() => void actOnProposal(proposal, "reject")} type="button">Reject</button></div></article>)}

    {props.businessContext ? <article style={card}><span className="record-meta">Business context</span><p style={reading}>{props.businessContext}</p></article> : null}
    {facts.length ? <article style={card}><span className="record-meta">Material facts</span><ul style={{ ...reading, paddingLeft: 20 }}>{facts.map((fact, index) => <li key={fact.id ?? `${fact.text}:${index}`}>{fact.text}{fact.state ? <span className="faint"> · {fact.state}</span> : null}{fact.source ? <span className="faint"> · {fact.source}</span> : null}</li>)}</ul></article> : null}

    {questions.map((question) => { const answering = answeringIds.includes(question.question_id); const answerLabel = questionAnswerLabel(question); const isLegal = question.question_kind === "legal"; return <article className={question.state !== "answered" ? "wash-attention" : undefined} key={question.question_id} style={card}><div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}><span className={`state-label ${question.state === "left_open" ? "state-attention" : question.state === "answered" ? "state-healthy" : "state-attention"}`}>{questionState(question)}</span><div className="btn-row">{question.issue_id ? <button className="btn quiet tiny" onClick={() => chooseIssue(question.issue_id ?? null)} type="button">View issue</button> : null}{!isLegal && props.onFactRequest && canRequestFact(question.state) ? <button className="btn quiet tiny" onClick={() => props.onFactRequest?.(question.question_id)} type="button">Request a fact</button> : null}</div></div><span className="record-meta">{isLegal ? "Legal question" : "Factual question"}</span><p style={reading}>{question.text}</p>{question.consequence ? <p style={muted}>{question.consequence}</p> : null}{question.answer ? <div><span className="record-meta">{answerLabel}</span><p style={reading}>{question.answer}</p></div> : null}{question.state !== "answered" ? <><label className="field-block"><span className="field-label">{answerLabel}</span><textarea className="text-input prose" disabled={answering} onChange={(event) => setAnswerDrafts((current) => ({ ...current, [question.question_id]: event.target.value }))} placeholder={isLegal ? "Record legal analysis. This will not create a reported fact." : "Record the answer as a reported fact."} value={answerDrafts[question.question_id] ?? ""} /></label><div className="btn-row" style={{ marginTop: 9 }}><button className="btn tiny" disabled={answering || !(answerDrafts[question.question_id] ?? "").trim()} onClick={() => void answerQuestion(question, "answered")} type="button">{answering ? "Saving…" : isLegal ? "Save legal analysis" : "Save reported fact"}</button><button className="btn agent tiny" disabled={busy} onClick={() => void exploreQuestion(question)} type="button">Explore why</button>{question.state === "open" ? <button className="btn quiet tiny" disabled={answering} onClick={() => void answerQuestion(question, "left_open")} type="button">Leave open</button> : null}</div></> : null}</article>; })}

    {!hasReviewProjection ? <IssueNavigator issues={snapshot.issues ?? []} issuesRevision={snapshot.issues_revision} onIssueUpdate={onIssueUpdate} onSelect={chooseIssue} selectedIssueId={selectedIssueId} /> : null}
    {sources.length ? <article style={card}><span className="record-meta">Sources and actions</span><div className="btn-row" style={{ marginTop: 8 }}>{sources.map((source, index) => <span className="btn-row" key={`${source.label}:${index}`}><button className="btn quiet tiny" onClick={() => source.evidence ? onOpenEvidence(source.evidence) : source.path ? onOpenArtifact(source.path) : undefined} type="button">{source.label}</button>{props.onCompareSources && canCompareSuppliedSource(source.evidence?.support_state) ? <button className="btn quiet tiny" onClick={props.onCompareSources} type="button">Compare</button> : null}</span>)}</div></article> : null}
    <ChangeRecap firstVisit={props.orientation?.first_visit} meaningfulChanges={props.orientation?.changes} onMarkSeen={props.onMarkSeen ?? (async () => { throw new Error("Mark seen is not available in this view."); })} onOpenArtifact={onOpenArtifact} onOpenTarget={props.onOpenTarget} recap={snapshot.recap ?? null} />
    </div></details>
  </section>;
}
