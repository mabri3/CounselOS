"use client";

import { useState } from "react";
import type { IssueNavigatorProps, IssueNode, IssueUpdate } from "@/lib/workspaceTypes";
import MatterIcon from "./MatterIcon";
import styles from "./MatterReview.module.css";

type IssueDraft = { changes: Omit<IssueUpdate, "expected_revision">; baseRevision: string };

function issueDepths(issues: IssueNode[]) {
  const byId = new Map(issues.map((issue) => [issue.issue_id, issue]));
  const depth = (issue: IssueNode, visited = new Set<string>()): number => {
    if (!issue.parent_issue_id || visited.has(issue.issue_id)) return 0;
    const parent = byId.get(issue.parent_issue_id);
    return parent ? 1 + depth(parent, new Set([...visited, issue.issue_id])) : 0;
  };
  return new Map(issues.map((issue) => [issue.issue_id, Math.min(depth(issue), 4)]));
}

function stateLabel(state: IssueNode["lawyer_state"]) {
  if (state === "explored") return "Explored";
  if (state === "set_aside") return "Set aside";
  return "Open";
}

function dispositionLabel(issue: IssueNode) {
  if (issue.disposition === "mitigation_in_progress") return "Mitigation in progress";
  if (issue.disposition === "resolved") return "Resolved";
  if (issue.disposition === "risk_accepted") return "Risk accepted";
  if (issue.disposition === "not_applicable") return "Not applicable";
  return issue.disposition === "unresolved" ? "Unresolved" : "No disposition recorded";
}

function dispositionClass(issue: IssueNode) {
  if (issue.disposition === "resolved" || issue.disposition === "not_applicable") return "state-healthy";
  if (issue.lawyer_state === "set_aside") return "state-attention";
  return issue.disposition === "mitigation_in_progress" ? "state-agent" : "state-attention";
}

export function compactIssueTitle(title: string, limit = 110) {
  const clean = title.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const boundary = clean.lastIndexOf(" ", limit - 1);
  return `${clean.slice(0, boundary > 0 ? boundary : limit).trimEnd()}…`;
}

export default function IssueNavigator({ issues, issuesRevision, selectedIssueId, onSelect, onIssueUpdate }: IssueNavigatorProps) {
  const [drafts, setDrafts] = useState<Record<string, IssueDraft>>({});
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [error, setError] = useState<Record<string, string>>({});
  const canEdit = Boolean(onIssueUpdate && issuesRevision);
  const depths = issueDepths(issues);

  const change = (issueId: string, next: Omit<IssueUpdate, "expected_revision">) => setDrafts((current) => {
    const draft = current[issueId] ?? { changes: {}, baseRevision: issuesRevision ?? "" };
    return { ...current, [issueId]: { ...draft, changes: { ...draft.changes, ...next } } };
  });
  const draftFor = (issue: IssueNode) => drafts[issue.issue_id];
  const field = (issue: IssueNode, key: Exclude<keyof IssueUpdate, "expected_revision">) => {
    const changes = draftFor(issue)?.changes;
    return changes && Object.prototype.hasOwnProperty.call(changes, key) ? changes[key] : issue[key as keyof IssueNode] ?? "";
  };

  async function save(issue: IssueNode) {
    if (!onIssueUpdate || !issuesRevision) return;
    const draft = drafts[issue.issue_id];
    if (!draft || !Object.keys(draft.changes).length) return;
    if (draft.baseRevision !== issuesRevision) {
      setError((current) => ({ ...current, [issue.issue_id]: "This issue changed after you began editing. Rebase your edits or use the latest saved issue before saving." }));
      return;
    }
    setSavingIds((current) => current.includes(issue.issue_id) ? current : [...current, issue.issue_id]);
    setError((current) => ({ ...current, [issue.issue_id]: "" }));
    try {
      await onIssueUpdate(issue.issue_id, { ...draft.changes, expected_revision: draft.baseRevision });
      setDrafts((current) => { const next = { ...current }; delete next[issue.issue_id]; return next; });
    } catch (cause) {
      setError((current) => ({ ...current, [issue.issue_id]: cause instanceof Error ? cause.message : "Issue change was not saved. Your edits are retained." }));
    } finally { setSavingIds((current) => current.filter((issueId) => issueId !== issue.issue_id)); }
  }

  return <section aria-label="Issue navigator" className={`${styles.card} ${styles.issueNav}`}>
    <div className={styles.between}>
      <h2 className={styles.issueListTitle}>Issues ({issues.length})</h2>
      <span className="record-meta">All issues</span>
    </div>
    {!issues.length ? <p className={styles.muted}>No issues are saved yet.</p> : <div className={styles.issueList}>
      {issues.map((issue, index) => {
        const selected = issue.issue_id === selectedIssueId;
        const draft = draftFor(issue);
        const saving = savingIds.includes(issue.issue_id);
        const revisionChanged = Boolean(draft && draft.baseRevision !== issuesRevision);
        const title = String(field(issue, "title"));
        const shortTitle = compactIssueTitle(issue.title || "Untitled issue", 65);
        const parent = field(issue, "parent_issue_id") as string | null;
        const state = field(issue, "lawyer_state") as IssueNode["lawyer_state"];
        return <article aria-current={selected ? "true" : undefined} className={`${styles.issueRow} ${selected ? styles.issueRowSelected : ""}`} key={issue.issue_id} style={{ marginLeft: (depths.get(issue.issue_id) ?? 0) * 10 }}>
          <button className={styles.issueButton} onClick={() => onSelect(selected ? null : issue.issue_id)} type="button">
            <span className={styles.issueNumber}>{index + 1}</span><MatterIcon name="scale" /><span className={styles.issueName} title={shortTitle !== issue.title ? issue.title : undefined}>{shortTitle}</span>
            <span className={`state-label ${dispositionClass(issue)}`}>{stateLabel(issue.lawyer_state)}</span><span className={styles.issueDisposition}>{dispositionLabel(issue)}</span><MatterIcon name="chevron" size={17} />
          </button>
          {selected && issue.why_it_matters ? <p className={styles.muted}>{issue.why_it_matters}</p> : null}
          {selected && onIssueUpdate ? <div className={styles.issueEdit}>
            <label className="field-block"><span className="field-label">Issue title</span><input className="text-input" disabled={!canEdit || saving} onChange={(event) => change(issue.issue_id, { title: event.target.value })} value={title} /></label>
            <label className="field-block"><span className="field-label">Parent issue</span><select className="select-input" disabled={!canEdit || saving} onChange={(event) => change(issue.issue_id, { parent_issue_id: event.target.value || null })} value={parent ?? ""}><option value="">No parent issue</option>{issues.filter((candidate) => candidate.issue_id !== issue.issue_id).map((candidate) => <option key={candidate.issue_id} value={candidate.issue_id}>{candidate.title}</option>)}</select></label>
            <label className="field-block"><span className="field-label">Lawyer state</span><select className="select-input" disabled={!canEdit || saving} onChange={(event) => change(issue.issue_id, { lawyer_state: event.target.value as IssueNode["lawyer_state"] })} value={state ?? "open"}><option value="open">Open</option><option value="explored">Explored</option><option value="set_aside">Set aside</option></select></label>
            {revisionChanged ? <div className="warning-callout" role="status"><strong>This issue changed while you were editing.</strong><div className="btn-row" style={{ marginTop: 8 }}><button className="btn quiet tiny" disabled={saving} onClick={() => setDrafts((current) => { const next = { ...current }; delete next[issue.issue_id]; return next; })} type="button">Use latest issue</button><button className="btn tiny" disabled={saving} onClick={() => setDrafts((current) => ({ ...current, [issue.issue_id]: { ...current[issue.issue_id], baseRevision: issuesRevision ?? "" } }))} type="button">Rebase my edits</button></div></div> : null}
            {canEdit ? <div className="btn-row"><button className="btn tiny" disabled={saving || revisionChanged || !Object.keys(draft?.changes ?? {}).length || !title.trim()} onClick={() => void save(issue)} type="button">{saving ? "Saving…" : "Save issue"}</button><button className="btn quiet tiny" disabled={saving || !Object.keys(draft?.changes ?? {}).length} onClick={() => setDrafts((current) => { const next = { ...current }; delete next[issue.issue_id]; return next; })} type="button">Reset</button></div> : <p className={styles.muted}>Issue editing is not available in this view.</p>}
            {error[issue.issue_id] ? <p className="warning-callout" role="status" style={{ margin: 0 }}>{error[issue.issue_id]}</p> : null}
          </div> : null}
        </article>;
      })}
    </div>}
  </section>;
}
