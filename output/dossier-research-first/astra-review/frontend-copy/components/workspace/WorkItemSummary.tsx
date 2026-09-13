"use client";

import type { IssueReviewItem, WorkItemSummaryProps } from "@/lib/workspaceTypes";
import styles from "./MatterReview.module.css";

const TITLE_LIMIT = 120;
export function previewIssueTitle(title: string, limit = TITLE_LIMIT): string {
  const clean = title.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const boundary = clean.lastIndexOf(" ", limit - 1);
  return `${clean.slice(0, boundary > 0 ? boundary : limit).trimEnd()}…`;
}

export function reviewStatePresentation(state: IssueReviewItem["state"]): { label: string; className: string; washClassName: string } {
  if (state === "needs_attention") return { label: "Needs attention", className: "state-attention", washClassName: "wash-attention" };
  if (state === "agent_work") return { label: "Agent work", className: "state-agent", washClassName: "wash-agent" };
  if (state === "complete") return { label: "Complete", className: "state-healthy", washClassName: "wash-healthy" };
  if (state === "overdue") return { label: "Overdue", className: "state-failure", washClassName: "wash-failure" };
  return { label: "Failed", className: "state-failure", washClassName: "wash-failure" };
}

export default function WorkItemSummary({ item, issue, onOpenIssue, onClosePanel }: WorkItemSummaryProps) {
  const state = reviewStatePresentation(item.state);
  const title = issue.title.trim() || "Untitled issue";
  const shortTitle = previewIssueTitle(title);
  const titleIsShortened = shortTitle !== title.replace(/\s+/g, " ").trim();

  return <article aria-label={`Review item: ${title}`} className={`${styles.reviewRow} ${state.washClassName}`}>
      <div>
        <span className="record-meta">Issue to review</span>
        <h4 className={styles.reviewTitle}>{shortTitle}</h4>
        {titleIsShortened ? <details><summary>Read full issue</summary><p className={styles.copy}>{title}</p></details> : null}
        <p className={styles.copy}>{item.reason}</p>
      </div>
      <div aria-label="State and owner" className={styles.row}>
        <span className={`state-label ${state.className}`}>{state.label}</span>
        <span className={styles.copy}>Owner: {item.actor.trim() || "Unassigned"}</span>
        {item.due_at ? <span className="record-meta">Due {item.due_at}</span> : null}
      </div>
      <div aria-label="Review actions" className={styles.reviewActions}>
        <button className={`btn tiny ${styles.reviewAction}`} type="button" onClick={() => onOpenIssue(item.issue_id)}>{item.action_label}</button>
        <button aria-label="Close panel without completing work" className={`btn quiet tiny ${styles.reviewAction}`} type="button" onClick={onClosePanel}>Close panel</button>
      </div>
  </article>;
}
