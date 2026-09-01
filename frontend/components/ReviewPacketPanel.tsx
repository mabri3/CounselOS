"use client";

import { useState } from "react";
import LinkifiedText from "@/components/LinkifiedText";
import { actOnReviewPacket, createMatterMitigation } from "@/lib/watchApi";
import type { Mitigation, ReviewAction, ReviewPacket } from "@/lib/watchTypes";

const ACTIONS: Array<{ value: ReviewAction["action"]; label: string }> = [
  { value: "keep_current", label: "Keep current" }, { value: "revise_decision", label: "Revise decision" },
  { value: "create_follow_up", label: "Create follow-up work" }, { value: "not_relevant", label: "Not relevant" },
  { value: "keep_monitoring", label: "Keep monitoring" },
];

export default function ReviewPacketPanel({ packet: initialPacket, matterId, mitigations = [], onChanged }: { packet: ReviewPacket; matterId?: string | null; mitigations?: Mitigation[]; onChanged?: () => void | Promise<void> }) {
  const [packet, setPacket] = useState(initialPacket);
  const [action, setAction] = useState<ReviewAction["action"] | null>(null);
  const [note, setNote] = useState("");
  const [decisionId, setDecisionId] = useState(packet.affected_decisions[0] ?? "");
  const [targetMatterId, setTargetMatterId] = useState(matterId ?? packet.affected_matters[0] ?? "");
  const [workTitle, setWorkTitle] = useState(`Review ${packet.what_happened}`);
  const [nextReviewAt, setNextReviewAt] = useState("");
  const [mitigationOpen, setMitigationOpen] = useState(false);
  const [mitigationTitle, setMitigationTitle] = useState("");
  const [mitigationDescription, setMitigationDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function cancel() { setAction(null); setMitigationOpen(false); setError(""); }

  async function submitOutcome() {
    if (!action) return;
    setBusy(true); setError("");
    try {
      let payload: ReviewAction;
      if (action === "keep_current") payload = { action, expected_revision: packet.revision, payload: { note, next_review_at: nextReviewAt || null } };
      else if (action === "revise_decision") payload = { action, expected_revision: packet.revision, payload: { decision_id: decisionId, matter_id: targetMatterId || null, work_item_title: workTitle } };
      else if (action === "create_follow_up") payload = { action, expected_revision: packet.revision, payload: { matter_id: targetMatterId, title: workTitle, due_at: null } };
      else payload = { action, expected_revision: packet.revision, payload: { reason: note } };
      await actOnReviewPacket(packet.packet_id, payload);
      setPacket((current) => ({ ...current, status: action === "keep_monitoring" ? "monitoring" : "resolved", attention_state: action === "keep_monitoring" ? "monitor" : "briefing_only", revision: current.revision + 1 }));
      setMessage(`${ACTIONS.find((item) => item.value === action)?.label} was recorded.`); setAction(null); await onChanged?.();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not record the review outcome."); }
    finally { setBusy(false); }
  }

  async function submitMitigation() {
    if (!targetMatterId || !mitigationTitle.trim() || !mitigationDescription.trim()) return;
    setBusy(true); setError("");
    try {
      await createMatterMitigation(targetMatterId, { title: mitigationTitle.trim(), description: mitigationDescription.trim(), status: "active", decision_ids: decisionId ? [decisionId] : [], owner: "Lawyer", review_at: null });
      setMessage("The mitigation was recorded. The review packet outcome is still open."); setMitigationOpen(false); await onChanged?.();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not record the mitigation."); }
    finally { setBusy(false); }
  }

  return <section className="agent-note" aria-labelledby={`packet-${packet.packet_id}`} style={{ marginTop: 16 }}>
    <div className="agent-label">{packet.status === "open" ? "Themis.ai · Not yet reviewed by an attorney" : "Themis.ai"}</div>
    <h2 id={`packet-${packet.packet_id}`} style={{ margin: "8px 0 4px" }}>Review packet</h2>
    <p><strong>{packet.status === "open" ? "Needs review" : packet.status === "monitoring" ? "Monitoring" : "Resolved"}</strong> · {packet.review_priority.replace("_", " ")} · {packet.potential_impact} potential impact</p>
    <p><LinkifiedText text={packet.what_happened} /></p><p><strong>Why it appeared:</strong> <LinkifiedText text={packet.why_surfaced} /></p>
    <PacketSection label="Prior decision basis" values={[packet.prior_decision_basis]} />
    <PacketSection label="Existing mitigations" values={packet.existing_mitigations} empty="No linked mitigation is recorded." />
    {mitigations.length ? <PacketSection label="Matter mitigations" values={mitigations.map((item) => `${item.title} — ${item.status}`)} /> : null}
    <PacketSection label="Possible tension" values={[packet.possible_tension]} /><PacketSection label="Timing" values={[packet.timing, ...packet.effective_dates]} />
    <div style={{ marginTop: 12 }}><strong>Sources</strong></div>
    {packet.sources.length ? <ul>{packet.sources.map((source, index) => <li key={`${source.canonical_url}-${index}`}><a href={source.canonical_url} rel="noreferrer" target="_blank">{source.title}</a> · {source.support_state.replaceAll("_", " ")}{source.warning ? ` · ${source.warning}` : ""}</li>)}</ul> : <p>No cited sources</p>}
    <PacketSection label="Warnings" values={packet.warnings} empty="No warnings." />
    {message ? <p role="status" style={{ color: "var(--healthy)" }}>{message}</p> : null}{error ? <p className="error" role="alert">{error}</p> : null}
    {packet.status === "open" && !action && !mitigationOpen ? <div className="btn-row" aria-label="Review packet actions">{ACTIONS.map((item) => <button className="btn review compact" key={item.value} onClick={() => { setMessage(""); setAction(item.value); }} type="button">{item.label}</button>)}{matterId || packet.affected_matters.length ? <button className="btn agent compact" onClick={() => { setMessage(""); setMitigationOpen(true); }} type="button">Record mitigation</button> : null}</div> : null}
    {action ? <div className="card" style={{ padding: 14, marginTop: 12 }}><strong>{ACTIONS.find((item) => item.value === action)?.label}</strong>
      {(action === "revise_decision" || action === "create_follow_up") ? <label>Work item title<input value={workTitle} onChange={(event) => setWorkTitle(event.target.value)} /></label> : null}
      {action === "revise_decision" ? <label>Decision ID<input required value={decisionId} onChange={(event) => setDecisionId(event.target.value)} /></label> : null}
      {(action === "revise_decision" || action === "create_follow_up") ? <label>Matter ID<input required={action === "create_follow_up"} value={targetMatterId} onChange={(event) => setTargetMatterId(event.target.value)} /></label> : null}
      {action === "keep_current" ? <label>Next review date<input type="date" value={nextReviewAt} onChange={(event) => setNextReviewAt(event.target.value)} /></label> : null}
      {action !== "revise_decision" && action !== "create_follow_up" ? <label>{action === "keep_current" ? "Note" : "Reason"}<textarea required={action !== "keep_current"} value={note} onChange={(event) => setNote(event.target.value)} /></label> : null}
      <div className="btn-row" style={{ marginTop: 10 }}><button className="btn primary" disabled={busy || (action === "revise_decision" && (!decisionId || !workTitle)) || (action === "create_follow_up" && (!targetMatterId || !workTitle)) || ((action === "not_relevant" || action === "keep_monitoring") && !note.trim())} onClick={submitOutcome} type="button">{busy ? "Recording…" : "Submit outcome"}</button><button className="btn" disabled={busy} onClick={cancel} type="button">Cancel</button></div>
    </div> : null}
    {mitigationOpen ? <div className="card" style={{ padding: 14, marginTop: 12 }}><strong>Record a separate mitigation</strong><p>This does not record a review outcome.</p><label>Title<input value={mitigationTitle} onChange={(event) => setMitigationTitle(event.target.value)} /></label><label>Description<textarea value={mitigationDescription} onChange={(event) => setMitigationDescription(event.target.value)} /></label><label>Matter ID<input value={targetMatterId} onChange={(event) => setTargetMatterId(event.target.value)} /></label><div className="btn-row" style={{ marginTop: 10 }}><button className="btn primary" disabled={busy || !targetMatterId || !mitigationTitle.trim() || !mitigationDescription.trim()} onClick={submitMitigation} type="button">{busy ? "Recording…" : "Record mitigation"}</button><button className="btn" disabled={busy} onClick={cancel} type="button">Cancel</button></div></div> : null}
  </section>;
}

function PacketSection({ label, values, empty }: { label: string; values: string[]; empty?: string }) { const present = values.filter((value) => value?.trim()); return <div style={{ marginTop: 10 }}><strong>{label}</strong>{present.length ? <ul>{present.map((value, index) => <li key={`${value}-${index}`}><LinkifiedText text={value} /></li>)}</ul> : empty ? <p>{empty}</p> : null}</div>; }
