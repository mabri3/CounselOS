"use client";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { targetUrl } from "@/lib/continuityApi";
import type { Orientation } from "@/lib/continuityTypes";
import type { Matter } from "@/lib/types";
import type { BriefingItem } from "@/lib/briefing";
import { formatShortDate, matterNextOwner } from "@/lib/design";
import { actionStateWord, orientationAnswer, previewOrientationQuestion, visibleOrientationActions } from "@/lib/orientationPresentation";
import Phase2Icon from "./Phase2Icon";
import styles from "./TodayPhase2.module.css";
export default function TodayOrientationCard({ orientation, matter, item, index }: { orientation: Orientation; matter?: Matter; item: BriefingItem; index: number }) {
  const [questionOpen, setQuestionOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [expanded, setExpanded] = useState(index === 0);
  const { primary, secondary } = visibleOrientationActions(orientation);
  const answer = orientationAnswer(orientation);
  const question = orientation.question_text || "No business question is saved yet.";
  const questionPreview = previewOrientationQuestion(question, 150);
  const answerPreview = previewOrientationQuestion(answer.text, 260);
  const rootTarget = { matter_id: orientation.matter_id, target_id: orientation.matter_id, kind: "matter" as const };
  const discuss = secondary.find(action => action.label.toLowerCase() === "discuss");
  const draft = secondary.find(action => action.label.toLowerCase() === "draft");
  const due = primary?.due_at || matter?.work_state.due_at;
  return <article className={styles.orientation} aria-label="Matter orientation">
    <div className={styles.cardTop}>
      <span className={styles.rank} style={{ color: item.pillInk, background: item.pillBg }}>{index + 1}</span>
      <div className={styles.cardMain}>
        <h2><Phase2Icon name="Matters" size={27} /><Link href={targetUrl(rootTarget)}>{matter?.title || item.title}</Link></h2>
        <p className={styles.question}>{questionOpen ? question : questionPreview}</p>
        <div className={styles.nextAction}><span>Next action:</span><Link className={styles.primary} href={primary ? targetUrl(primary.target) : item.href}>{primary?.label || item.action}<span aria-hidden="true">›</span></Link></div>
      </div>
      <div className={styles.cardMeta}><span>Owner</span><strong><Phase2Icon name="Agents" />{primary?.owner_name || (matter ? matterNextOwner(matter) : "Unassigned")}</strong>{primary ? <small>{actionStateWord(primary)}</small> : null}</div>
      <div className={styles.cardMeta}><span>Due</span><strong style={{ color: item.pillInk }}>{item.status}</strong><small>{due ? formatShortDate(due) : "No due date"}</small></div>
      <button className={styles.expand} type="button" aria-label={`${expanded ? "Hide" : "Show"} saved answer for ${matter?.title || item.title}`} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? "⌄" : "›"}</button>
    </div>
    {expanded ? <>
      <div className={styles.answer}>
        <div className={styles.answerLabel}><span className={styles.spark}>✧</span><span>Themis.ai · Agent work · {answer.state === "stale" ? "Earlier saved answer" : answer.label}</span></div>
        <div className={styles.answerText}>{answer.text ? answerOpen ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer.text}</ReactMarkdown> : <p>{answerPreview}</p> : <p>No working answer is saved yet.</p>}</div>
        {answer.text && answerPreview !== answer.text ? <button className={styles.textAction} type="button" aria-expanded={answerOpen} onClick={() => setAnswerOpen(value => !value)}>{answerOpen ? "Show shorter answer" : "Read full answer"} <span aria-hidden="true">›</span></button> : null}
      </div>

      {primary?.reason ? <p className={styles.reason}>{primary.reason}</p> : null}
    </> : null}
      {questionPreview !== question ? <button className={styles.textAction} type="button" aria-expanded={questionOpen} onClick={() => setQuestionOpen(value => !value)}>{questionOpen ? "Show shorter question" : "Read full question"}<span aria-hidden="true">›</span></button> : null}
      {orientation.caveats?.filter(caveat => !orientation.warnings?.includes(caveat)).map((caveat, i) => <p className={styles.qualification} key={i}>{caveat}</p>)}
    {orientation.warnings?.map((warning, i) => <p className="warning-callout" role="status" key={i}>{warning}</p>)}
    <div className={`${styles.secondary} ${expanded ? styles.expandedSecondary : ""}`}>
      <Link href={targetUrl(discuss?.target || { ...rootTarget, view: "discuss" })}><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M21 11a9 9 0 0 1-9 9H4l-3 2 2-6A9 9 0 1 1 21 11Z"/><path d="M7 11h1m3 0h1m3 0h1"/></svg><span>Discuss</span></Link>
      <Link href={targetUrl(draft?.target || { ...rootTarget, view: "draft" })}><Phase2Icon name="Briefing" /><span>Draft</span></Link>
      {secondary.filter(action => !["discuss", "draft"].includes(action.label.toLowerCase())).map(action => <Link key={action.action_id} href={targetUrl(action.target)}>{action.label}</Link>)}
    </div>
  </article>;
}
