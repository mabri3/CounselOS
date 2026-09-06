"use client";

import { useId, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { OrientationSummaryProps as ContinuityOrientationSummaryProps } from "@/lib/continuityTypes";
import type { ReviewOrientationProps } from "@/lib/workspaceTypes";
import { actionOwnerText, actionStateWord, previewOrientationQuestion, visibleOrientationActions } from "@/lib/orientationPresentation";
import MatterIcon from "./MatterIcon";
import styles from "./MatterReview.module.css";

const card: CSSProperties = { border: "1px solid var(--line)", borderRadius: "var(--radius)", background: "var(--raised)", padding: 16, minWidth: 0, maxWidth: "100%", boxSizing: "border-box" };
const quiet: CSSProperties = { color: "var(--ink-3)", font: "400 15px/1.5 var(--sans)", margin: "5px 0", overflowWrap: "anywhere" };
const compactAction: CSSProperties = { maxWidth: "100%", whiteSpace: "normal", overflowWrap: "anywhere" };
const reading: CSSProperties = { color: "var(--ink-2)", font: "400 16px/1.65 var(--serif)", margin: "6px 0", overflowWrap: "anywhere" };
const ANSWER_PREVIEW_LIMIT = 260;

export interface CompactAnswerPreview {
  text: string;
  shortened: boolean;
  plainText: boolean;
}

function plainTextPreview(answer: string, limit: number): string {
  const plain = answer
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/[*_~`>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const boundary = plain.lastIndexOf(" ", limit - 1);
  return `${plain.slice(0, boundary > 0 ? boundary : limit).trimEnd()}…`;
}

export function compactAnswerPreview(answer: string, limit = ANSWER_PREVIEW_LIMIT): CompactAnswerPreview {
  let full = answer.trim();
  let sectionSelected = false;
  let fence: string | null = null;
  let offset = 0;
  for (const line of full.split(/(?<=\n)/)) {
    offset += line.length;
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) { if (!fence) fence = marker[1][0]; else if (fence === marker[1][0]) fence = null; continue; }
    if (!fence && /^\s*#{1,6}\s+(?:Current answer|Short answer|Conditional answer|Bottom line)\s*#*\s*$/i.test(line)) {
      const remaining = full.slice(offset).trim();
      const nextHeading = remaining.search(/^\s*#{1,6}\s+/m);
      const section = (nextHeading >= 0 ? remaining.slice(0, nextHeading) : remaining).trim();
      if (section) { full = section; sectionSelected = true; }
      break;
    }
  }
  if (full.length <= limit) return { text: full, shortened: sectionSelected, plainText: false };
  const paragraphEnd = full.search(/\n\s*\n/);
  if (paragraphEnd > 0 && paragraphEnd <= limit) return { text: full.slice(0, paragraphEnd).trimEnd(), shortened: true, plainText: false };
  const firstBlock = paragraphEnd > 0 ? full.slice(0, paragraphEnd) : full;
  const protectedRanges = [...firstBlock.matchAll(/\[source:[^\]\n]+\]|!?\[[^\]\n]*\]\([^\)\n]*\)|!?\[[^\]\n]*\]\[[^\]\n]*\]/g)].map((match) => ({ start: match.index ?? 0, end: (match.index ?? 0) + match[0].length }));
  let sentenceEnd = 0;
  for (const match of firstBlock.matchAll(/[.!?](?=\s|$)/g)) {
    const end = (match.index ?? 0) + 1;
    if (end > limit) break;
    if (protectedRanges.some((range) => end > range.start && end < range.end)) continue;
    sentenceEnd = end;
  }
  if (sentenceEnd > 0) return { text: firstBlock.slice(0, sentenceEnd).trimEnd(), shortened: true, plainText: false };
  return { text: plainTextPreview(firstBlock, Math.min(limit, 420)), shortened: true, plainText: true };
}

export type { OrientationSummaryProps } from "@/lib/continuityTypes";
export type { ReviewOrientationProps } from "@/lib/workspaceTypes";

type ReviewOrientationComponentProps = ReviewOrientationProps & { renderAnswer?: (answer: string) => ReactNode; citationState?: "available" | "none" };
type OrientationSummaryComponentProps = ContinuityOrientationSummaryProps | ReviewOrientationComponentProps;

function isReviewOrientation(props: OrientationSummaryComponentProps): props is ReviewOrientationProps {
  return "question" in props;
}

function reviewStateClass(state: ReviewOrientationProps["reviewItems"][number]["state"]): string {
  if (state === "needs_attention") return "state-attention";
  if (state === "agent_work") return "state-agent";
  if (state === "complete") return "state-healthy";
  return "state-failure";
}

function reviewStateWord(state: ReviewOrientationProps["reviewItems"][number]["state"]): string {
  if (state === "needs_attention") return "Needs attention";
  if (state === "agent_work") return "Agent work";
  if (state === "complete") return "Complete";
  return state === "overdue" ? "Overdue" : "Failed";
}

function ReviewOrientation({ question, shortAnswer, qualification, reviewItems, allIssueCount, onOpenIssue, onShowAllIssues, renderAnswer, citationState }: ReviewOrientationComponentProps) {
  const [questionOpen, setQuestionOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const questionId = useId();
  const answerId = useId();
  const fullQuestion = question.text.trim() || "No business question is saved yet.";
  const questionPreview = previewOrientationQuestion(fullQuestion, 110);
  const questionIsLong = questionPreview !== fullQuestion.replace(/\s+/g, " ").trim();
  const next = reviewItems[0] ?? null;
  const answer = shortAnswer.trim();
  const answerPreview = compactAnswerPreview(answer);
  const narrowAnswerPreview = compactAnswerPreview(answer, 160);
  const hasNarrowAnswerPreview = narrowAnswerPreview.text !== answerPreview.text;
  const renderAnswerPreview = (preview: CompactAnswerPreview) =>
    answer
      ? preview.plainText && !answerOpen
        ? preview.text
        : renderAnswer?.(preview.text) ?? preview.text
      : "No working answer is saved yet.";
  const fullAnswer: CompactAnswerPreview = { text: answer, shortened: false, plainText: false };

  return <section aria-label="Matter review orientation" className={`${styles.card} ${styles.orientation}`}>
    <div className={styles.orientationQuestion}>
      <span className="record-meta">Business question</span>
      <h2 className={styles.questionTitle}>{questionPreview}</h2>
      {questionIsLong ? <>
        <button aria-controls={questionId} aria-expanded={questionOpen} className="btn quiet tiny" type="button" onClick={() => setQuestionOpen((open) => !open)}>{questionOpen ? "Show shorter question" : "Read full question"}</button>
        <p id={questionId} hidden={!questionOpen} className={styles.reading}>{fullQuestion}</p>
      </> : null}
    </div>
    <div className={styles.agentAnswer}>
      <span className="record-meta">Working answer · Agent work{citationState === "none" ? " · No cited sources" : ""}</span>
      <div className={styles.answerWithIcon}><span className={styles.agentIcon}><MatterIcon name="sparkles" /></span><div id={answerId} className={styles.reading}>{answerOpen || !hasNarrowAnswerPreview ? renderAnswerPreview(answerOpen ? fullAnswer : answerPreview) : <><span className={styles.answerDesktop}>{renderAnswerPreview(answerPreview)}</span><span className={styles.answerNarrow}>{renderAnswerPreview(narrowAnswerPreview)}</span></>}</div></div>
      {answerPreview.shortened || narrowAnswerPreview.shortened ? <><p className={`${styles.copy} ${styles.answerPreviewStatus}`}>{answerOpen ? "The full saved answer is shown." : "Showing a short section of the saved answer."}</p><button aria-controls={answerId} aria-expanded={answerOpen} className="btn quiet tiny" onClick={() => setAnswerOpen((open) => !open)} type="button">{answerOpen ? "Show shorter answer" : "Read full answer"}</button></> : null}

    </div>
      {qualification?.trim() ? <div className={styles.qualification} role="note"><MatterIcon name="scale" /><span className="sr-only">Material qualification</span><span className={styles.qualificationText}>{qualification}</span></div> : null}
    <div className={styles.orientationAction}>
      <div className={styles.between}>
        <span className="record-meta">One next action</span>
        <button className="btn quiet tiny" style={compactAction} type="button" onClick={onShowAllIssues}>View all issues ({allIssueCount})</button>
      </div>
      {next ? <div className={`${styles.nextAction} ${next.state === "needs_attention" ? "wash-attention" : next.state === "agent_work" ? "wash-agent" : next.state === "complete" ? "wash-healthy" : "wash-failure"}`}>
        <p className={styles.copy}><strong>{next.reason}</strong></p>
        <div className={styles.row}><span className={`state-label ${reviewStateClass(next.state)}`}>{reviewStateWord(next.state)}</span><span className={styles.copy}>Owner: {next.actor.trim() || "Unassigned"}</span></div>
        <button className={`btn primary ${styles.nextActionButton}`} style={compactAction} type="button" onClick={() => onOpenIssue(next.issue_id)}>{next.action_label}</button>
      </div> : <p style={quiet}>No issue needs review.</p>}
    </div>
  </section>;
}

function ContinuityOrientation({ orientation, loading = false, error, compact = false, onOpenTarget, onRefresh }: ContinuityOrientationSummaryProps) {
  const [questionOpen, setQuestionOpen] = useState(false);
  const questionId = useId();
  if (!orientation) return <section aria-label="Matter orientation" style={card}>
    <span className="record-meta">Matter orientation</span>
    <h2 className="section-heading" style={{ margin: "5px 0" }}>{loading ? "Preparing your next step" : "Saved orientation is unavailable"}</h2>
    <p style={quiet}>{error || "Refresh this matter to load its saved question, answer, and next action."}</p>
    <button className="btn tiny" type="button" onClick={onRefresh}>{loading ? "Refreshing…" : "Refresh matter"}</button>
  </section>;

  const { primary, secondary } = visibleOrientationActions(orientation);
  const fullQuestion = orientation.question_text || "No business question is saved yet.";
  const questionPreview = orientation.question_preview || previewOrientationQuestion(fullQuestion);
  const isPreview = Boolean(orientation.question_is_preview || questionPreview !== fullQuestion);
  return <section aria-label="Matter orientation" style={card}>
    <span className="record-meta">Matter orientation</span>
    <h2 className="section-heading" style={{ margin: "5px 0" }}>{isPreview ? questionPreview : fullQuestion}</h2>
    {isPreview ? <button aria-controls={questionId} aria-expanded={questionOpen} className="btn quiet tiny" type="button" onClick={() => setQuestionOpen(value => !value)}>{questionOpen ? "Show shorter question" : "Read full question"}</button> : null}
    {isPreview ? <p id={questionId} hidden={!questionOpen} style={quiet}>{fullQuestion}</p> : null}
    {!compact && orientation.first_visit ? <p className="state-label state-agent">First visit</p> : null}
    {orientation.warnings?.map((warning, index) => <p className="warning-callout" key={`${warning}:${index}`} role="status">{warning}</p>)}
    {primary ? <div style={{ marginTop: 12 }}>
      <p style={quiet}><strong>{primary.reason}</strong>{actionOwnerText(primary) ? ` ${actionOwnerText(primary)}.` : ""}</p>
      <p className={`state-label ${primary.state === "failed" || primary.state === "unavailable" ? "state-failure" : primary.state === "waiting" ? "state-attention" : primary.state === "running" ? "state-agent" : "state-healthy"}`}>{actionStateWord(primary)}</p>
      <button className="btn tiny" style={compactAction} type="button" onClick={() => onOpenTarget(primary.target)}>{primary.label}</button>
    </div> : <p style={quiet}>No required action is saved for this matter.</p>}
    {secondary.length ? <div className="btn-row" style={{ marginTop: 9 }}>{secondary.map(action => <button className="btn quiet tiny" style={compactAction} key={action.action_id} type="button" onClick={() => onOpenTarget(action.target)}>{action.label}</button>)}</div> : null}
    {error ? <p className="warning-callout" role="status">Saved work is still shown. {error} <button className="btn quiet tiny" onClick={onRefresh} type="button">Retry</button></p> : null}
  </section>;
}

export default function OrientationSummary(props: OrientationSummaryComponentProps) {
  return isReviewOrientation(props) ? <ReviewOrientation {...props} /> : <ContinuityOrientation {...props} />;
}
