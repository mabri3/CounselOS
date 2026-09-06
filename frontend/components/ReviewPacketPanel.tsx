"use client";

import { useState } from "react";
import LinkifiedText from "@/components/LinkifiedText";
import { actOnReviewPacket, createMatterMitigation } from "@/lib/watchApi";
import type { Mitigation, ReviewAction, ReviewPacket } from "@/lib/watchTypes";
import MatterIcon from "@/components/workspace/MatterIcon";
import phase2 from "@/components/DecisionsPhase2.module.css";
import matterStyles from "@/components/workspace/MatterWork.module.css";

const ACTIONS: Array<{ value: ReviewAction["action"]; label: string }> = [
  { value: "keep_current", label: "Keep current" }, { value: "revise_decision", label: "Revise decision" },
  { value: "create_follow_up", label: "Create follow-up work" }, { value: "not_relevant", label: "Not relevant" },
  { value: "keep_monitoring", label: "Keep monitoring" },
];

export default function ReviewPacketPanel({ packet: initialPacket, matterId, mitigations = [], onChanged, presentation = "matter" }: { packet: ReviewPacket; matterId?: string | null; mitigations?: Mitigation[]; onChanged?: () => void | Promise<void> } & { presentation?: "matter" | "phase2" }) {
  const isPhase2 = presentation === "phase2";
  const styles = isPhase2 ? phase2 : matterStyles;
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

  return <section className={isPhase2 ? phase2.packet : `agent-note ${styles.reviewPacket}`} aria-labelledby={`packet-${packet.packet_id}`}>
    <header className={styles.packetHeader}><div><div className={`agent-label ${styles.packetAgentLabel}`}>{packet.status === "open" ? "Themis.ai · Not yet reviewed by an attorney" : "Themis.ai"}</div><h2 className={styles.packetTitle} id={`packet-${packet.packet_id}`}>{isPhase2 ? "Review a change to the recorded basis" : "Review packet"}</h2></div><MatterIcon name="history" size={23} /></header>
    <p className={styles.packetMeta}><strong>{packet.status === "open" ? "Needs review" : packet.status === "monitoring" ? "Monitoring" : "Resolved"}</strong> · {packet.review_priority.replace("_", " ")} · {packet.potential_impact} potential impact</p>
    <div className={isPhase2 ? phase2.columns : undefined}>
    <p className={styles.packetReading}>{isPhase2 ? <strong>What happened</strong> : null}<LinkifiedText text={packet.what_happened} /></p><p className={styles.packetReading}><strong>Why it appeared:</strong> <LinkifiedText text={packet.why_surfaced} /></p>
    <PacketSection presentation={presentation} label="Prior decision basis" values={[packet.prior_decision_basis]} />
    <PacketSection presentation={presentation} label="Existing mitigations" values={packet.existing_mitigations} empty="No linked mitigation is recorded." />
    {mitigations.length ? <PacketSection presentation={presentation} label="Matter mitigations" values={mitigations.map((item) => `${item.title} — ${item.status}`)} /> : null}
    <PacketSection presentation={presentation} label="Possible tension" values={[packet.possible_tension]} /><PacketSection presentation={presentation} label="Timing" values={[packet.timing, ...packet.effective_dates]} />
    </div>
    <div className={isPhase2 ? phase2.sources : undefined}>
    <div className={styles.packetSectionLabel}><strong>Sources</strong></div>
    {packet.sources.length ? <ul className={styles.packetList}>{packet.sources.map((source, index) => <li key={`${source.canonical_url}-${index}`}><a href={source.canonical_url} rel="noreferrer" target="_blank">{source.title}</a> · {source.support_state.replaceAll("_", " ")}{source.warning ? ` · ${source.warning}` : ""}</li>)}</ul> : <p className={styles.packetEmpty}>No cited sources</p>}
    <PacketSection presentation={presentation} label="Warnings" values={packet.warnings} empty="No warnings." />
    </div>
    {message ? <p className={styles.successMessage} role="status">{message}</p> : null}{error ? <p className={`error ${styles.errorMessage}`} role="alert">{error}</p> : null}
    {isPhase2 && packet.status === "open" && !mitigationOpen ? <fieldset className={phase2.packetActions}><legend>How would you like to proceed?</legend>{ACTIONS.map((item) => <label className={phase2.choice} key={item.value}><input type="radio" name={`outcome-${packet.packet_id}`} checked={action === item.value} disabled={busy} onChange={() => { setMessage(""); setAction(item.value); }} /><span>{item.label}<small>{({ keep_current: "Keep the existing decision as recorded.", revise_decision: "Open work to revise this decision.", create_follow_up: "Create work to research or monitor this change.", not_relevant: "This change does not affect the decision.", keep_monitoring: "Continue monitoring this source for changes." })[item.value]}</small></span></label>)}</fieldset> : null}
    {!isPhase2 && packet.status === "open" && !action && !mitigationOpen ? <div className={`btn-row ${styles.packetActions}`} aria-label="Review packet actions">{ACTIONS.map((item) => <button className="btn review compact" key={item.value} onClick={() => { setMessage(""); setAction(item.value); }} type="button">{item.label}</button>)}{matterId || packet.affected_matters.length ? <button className="btn agent compact" onClick={() => { setMessage(""); setMitigationOpen(true); }} type="button">Record mitigation</button> : null}</div> : null}
    {action ? <div className={`card ${styles.packetForm}`}><strong>{ACTIONS.find((item) => item.value === action)?.label}</strong>
      {(action === "revise_decision" || action === "create_follow_up") ? <label>Work item title<input value={workTitle} onChange={(event) => setWorkTitle(event.target.value)} /></label> : null}
      {action === "revise_decision" ? <label>Decision ID<input required value={decisionId} onChange={(event) => setDecisionId(event.target.value)} /></label> : null}
      {(action === "revise_decision" || action === "create_follow_up") ? <label>Matter ID<input required={action === "create_follow_up"} value={targetMatterId} onChange={(event) => setTargetMatterId(event.target.value)} /></label> : null}
      {action === "keep_current" ? <label>Next review date<input type="date" value={nextReviewAt} onChange={(event) => setNextReviewAt(event.target.value)} /></label> : null}
      {action !== "revise_decision" && action !== "create_follow_up" ? <label>{action === "keep_current" ? "Note" : "Reason"}<textarea required={action !== "keep_current"} value={note} onChange={(event) => setNote(event.target.value)} /></label> : null}
      <div className={`btn-row ${styles.formActions}`}><button className="btn primary" disabled={busy || (action === "revise_decision" && (!decisionId || !workTitle)) || (action === "create_follow_up" && (!targetMatterId || !workTitle)) || ((action === "not_relevant" || action === "keep_monitoring") && !note.trim())} onClick={submitOutcome} type="button">{busy ? "Recording…" : "Submit outcome"}</button><button className="btn" disabled={busy} onClick={cancel} type="button">Cancel</button></div>
    </div> : null}
    {isPhase2 && packet.status === "open" && !mitigationOpen && (matterId || packet.affected_matters.length) ? <div className={phase2.mitigation}><button className="btn" type="button" disabled={busy} onClick={() => { setMessage(""); setAction(null); setMitigationOpen(true); }}>Record mitigation</button><p>Creates a mitigation; leaves the review outcome open.</p></div> : null}
    {mitigationOpen ? <div className={`card ${styles.packetForm}`}><strong>Record a separate mitigation</strong><p>This does not record a review outcome.</p><label>Title<input value={mitigationTitle} onChange={(event) => setMitigationTitle(event.target.value)} /></label><label>Description<textarea value={mitigationDescription} onChange={(event) => setMitigationDescription(event.target.value)} /></label><label>Matter ID<input value={targetMatterId} onChange={(event) => setTargetMatterId(event.target.value)} /></label><div className={`btn-row ${styles.formActions}`}><button className="btn primary" disabled={busy || !targetMatterId || !mitigationTitle.trim() || !mitigationDescription.trim()} onClick={submitMitigation} type="button">{busy ? "Recording…" : "Record mitigation"}</button><button className="btn" disabled={busy} onClick={cancel} type="button">Cancel</button></div></div> : null}
  </section>;
}

function PacketSection({ label, values, empty, presentation }: { label: string; values: string[]; empty?: string; presentation?: "matter" | "phase2" }) { const styles = presentation === "phase2" ? phase2 : matterStyles; const present = values.filter((value) => value?.trim()); return <div className={styles.packetSection}><strong>{label}</strong>{present.length ? <ul className={styles.packetList}>{present.map((value, index) => <li key={`${value}-${index}`}><LinkifiedText text={value} /></li>)}</ul> : empty ? <p className={styles.packetEmpty}>{empty}</p> : null}</div>; }
