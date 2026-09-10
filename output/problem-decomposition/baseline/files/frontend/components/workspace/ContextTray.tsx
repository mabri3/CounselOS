"use client";

import { useEffect, useState } from "react";
import type { ContextSelection, ContextTrayProps } from "@/lib/workspaceTypes";
import styles from "./MatterTools.module.css";

function title(item: Pick<ContextSelection, "reference_id" | "role">) {
  const known: Record<string, string> = {
    business_question: "Business question", current_facts: "Current facts", company: "Company context",
    company_context: "Company context", selected_passage: "Selected passage", applied_note: "Applied note",
    conversation_history: "Relevant conversation history", contribution: "Lawyer contribution", matter_record: "Matter record",
    tool_read: "Material read by a tool",
  };
  return known[item.role] ?? known[item.reference_id] ?? item.role.replace(/[_-]+/g, " ").replace(/^./, (letter) => letter.toUpperCase());
}

function manifestState(state: string) {
  return ({ included: "Included in this run", truncated: "Included in part", omitted: "Omitted from this run", unavailable: "Unavailable for this run" } as Record<string, string>)[state] ?? "State unknown";
}

export default function ContextTray({ selections, manifest, onChange, busy = false }: ContextTrayProps) {
  const [draft, setDraft] = useState(selections);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (!saving && !dirty) setDraft(selections); }, [selections, saving, dirty]);

  async function toggle(referenceId: string) {
    const next = draft.map((item) => item.reference_id === referenceId ? { ...item, selected: item.selected === false } : item);
    setDraft(next); setDirty(true); setSaving(referenceId); setError("");
    try { await onChange(next); setDirty(false); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Context selection was not saved. Your choices are retained so you can retry."); }
    finally { setSaving(null); }
  }
  async function retry() {
    setSaving("retry"); setError("");
    try { await onChange(draft); setDirty(false); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Context selection was not saved. Your choices are retained so you can retry."); }
    finally { setSaving(null); }
  }

  return <section aria-label="Inquiry context" className={styles.context}>
    <div><h2 className={styles.contextTitle}>Next inquiry</h2><p className={styles.contextCopy}>These choices apply to the next inquiry. Removing a choice does not delete the saved file or change an earlier run.</p></div>
    {error ? <div className="warning-callout" role="status"><strong>Not saved.</strong> {error} <button className="btn quiet tiny" disabled={Boolean(saving)} onClick={() => void retry()} type="button">Retry</button></div> : null}
    <div className={styles.contextList}>
      {draft.length ? draft.map((item) => <label className={`${styles.contextItem} ${item.mandatory ? styles.contextItemMandatory : ""}`} key={item.reference_id}>
        <input checked={item.mandatory || item.selected !== false} disabled={busy || Boolean(saving) || item.mandatory} onChange={() => void toggle(item.reference_id)} type="checkbox" />
        <span><strong>{title(item)}</strong><span className={`record-meta ${styles.contextMetadata}`}>{item.mandatory ? "Mandatory" : item.selected !== false ? dirty ? "Selected · Not saved" : "Selected" : dirty ? "Available · Not saved" : "Available"}</span>{item.path ? <span className={styles.contextCopy}>{item.path}</span> : null}<span className={styles.contextCopy}>{item.mandatory ? "This matter record is always supplied because the inquiry cannot be understood without it." : item.selected !== false ? "Chosen for the next inquiry." : "Saved and available. It will not be supplied directly to the next inquiry."}</span>{saving === item.reference_id ? <span className="state-label state-agent" role="status">Saving selection…</span> : null}</span>
      </label>) : <p className={styles.contextCopy}>No optional context is available. The current question and saved matter facts still travel with the inquiry.</p>}
    </div>

    <div><h2 className={styles.contextTitle}>{manifest ? "Submitted context" : "No submitted inquiry selected"}</h2><p className={styles.contextCopy}>{manifest ? "This is the saved context record for the selected inquiry. Later selection changes do not alter it." : "After an inquiry starts, its actual included, partial, omitted, unavailable, and later-read material appears here."}</p></div>
    {manifest ? <div className={styles.manifestList}>{(manifest.entries ?? []).length ? (manifest.entries ?? []).map((item, index) => <article className={styles.manifestItem} key={`${item.reference_id}:${index}`}>
      <div className={styles.fileHeading}><strong>{title(item)}</strong><span className={`state-label ${item.state === "included" ? "state-healthy" : item.state === "truncated" ? "state-attention" : item.state === "unavailable" ? "state-failure" : "state-agent"}`}>{manifestState(item.state)}</span></div>
      {item.path ? <p className={styles.contextCopy}>{item.path}</p> : null}<p className={styles.contextCopy}>{item.reason || "No reason was stored."}</p>
      {item.tool_read_evidence?.length ? <details className={styles.technicalRecord}><summary className="faint">Technical read record</summary><p className={styles.contextCopy}>{item.tool_read_evidence.join(", ")}</p></details> : item.role === "tool_read" ? <p className="warning-callout">No saved proof of this later read is available.</p> : null}
    </article>) : <p className={styles.contextCopy}>This run stored an empty context manifest.</p>}</div> : null}
  </section>;
}
