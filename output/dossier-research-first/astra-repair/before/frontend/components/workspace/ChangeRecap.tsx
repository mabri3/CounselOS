"use client";

import { useState } from "react";
import type { ContinuityChangeRecapProps, MeaningfulChange, WorkTarget } from "@/lib/continuityTypes";
import { isOpenableWorkTarget, visibleRecapChanges } from "@/lib/orientationPresentation";
import styles from "./MatterReview.module.css";

type RecapChange = MeaningfulChange | Record<string, unknown>;

function changeText(change: RecapChange) {
  const record = change as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title : typeof record.label === "string" ? record.label : typeof record.path === "string" ? record.path : "Matter record";
  const detail = typeof record.detail === "string" ? record.detail : typeof record.message === "string" ? record.message : typeof record.state === "string" ? record.state : "changed";
  return `${title}: ${detail}`;
}

function changeKey(change: RecapChange, index: number) {
  const record = change as Record<string, unknown>;
  return String(record.change_id ?? record.path ?? record.label ?? record.title ?? index);
}

function changeTarget(change: RecapChange): WorkTarget | null {
  const target = (change as { target?: unknown }).target;
  return isOpenableWorkTarget(target) ? target : null;
}

export default function ChangeRecap({ recap, onOpenArtifact, onMarkSeen, meaningfulChanges, firstVisit = false, onOpenTarget }: ContinuityChangeRecapProps) {
  const [saving, setSaving] = useState(false);
  const [savedRevision, setSavedRevision] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  if (!recap) return null;
  const currentRecap = recap;
  const allChanges = (meaningfulChanges ?? currentRecap.changes ?? []) as RecapChange[];
  const changes = visibleRecapChanges(allChanges, expanded);
  const outputs = currentRecap.new_outputs ?? [];
  const failures = currentRecap.output_read_failures ?? [];
  const hasChanges = Boolean(allChanges.length || outputs.length || failures.length);
  const seen = savedRevision === currentRecap.current_revision;
  const recapState = seen ? "Seen" : hasChanges ? (firstVisit ? "First visit" : "Updated") : "Current";
  const recapStateClass = seen ? "state-label state-healthy" : hasChanges ? "state-label state-agent" : "record-meta";
  async function markSeen() {
    setSaving(true); setError("");
    try { await onMarkSeen(currentRecap.current_revision); setSavedRevision(currentRecap.current_revision); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Changes were not marked seen. You can retry."); }
    finally { setSaving(false); }
  }
  return <section aria-label="What changed" className={`${styles.card} ${styles.stack}`}>
    <div className={styles.between}><h2 className={styles.sectionTitle}>What changed</h2><span className={recapStateClass}>{recapState}</span></div>
    {!hasChanges ? <p className={styles.copy}>No new saved work since you last reviewed this matter.</p> : <>
      {changes.length ? <ul className={styles.recapList}>{changes.map((change, index) => { const target = changeTarget(change); return <li key={`${changeKey(change, index)}:${index}`}>{changeText(change)}{target && onOpenTarget ? <button className="btn quiet tiny" onClick={() => onOpenTarget(target)} style={{ marginLeft: 7 }} type="button">Open</button> : null}</li>; })}</ul> : null}
      {allChanges.length > 3 ? <button aria-expanded={expanded} className="btn quiet tiny" onClick={() => setExpanded(value => !value)} type="button">{expanded ? "Show fewer" : `Show all ${allChanges.length} changes`}</button> : null}
      {outputs.length ? <div style={{ marginTop: 10 }}><strong className="small">Saved outputs</strong><div className="btn-row" style={{ marginTop: 7 }}>{outputs.map((path) => <button className="btn quiet tiny" key={path} onClick={() => onOpenArtifact(path)} type="button">Open {path.split("/").at(-1) ?? path}</button>)}</div></div> : null}
      {failures.length ? <div className="warning-callout" role="status" style={{ marginTop: 10 }}><strong>Some optional output files could not be read.</strong><ul style={{ marginBottom: 0 }}>{failures.map((failure) => <li key={failure.path}>{failure.path.split("/").at(-1) ?? failure.path}: {failure.message}</li>)}</ul></div> : null}
      <div className="btn-row" style={{ marginTop: 12 }}><button className="btn tiny" disabled={saving || seen} onClick={() => void markSeen()} type="button">{saving ? "Saving…" : seen ? "Marked seen" : "Mark seen"}</button>{error ? <span className="warning-callout" role="status" style={{ padding: "5px 8px" }}>{error}</span> : null}</div>
    </>}
  </section>;
}
