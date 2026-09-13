"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { ContinuityRunCommand, HandoffAction, HandoffCommand, HandoffPanelProps } from "@/lib/continuityTypes";
import { handoffActions, handoffStateLabel, newActionKey, preparationNotice, receiptNotice, recoverRetryCommand, retryDraftKey, splitOpenQuestions, type PresentationNotice } from "@/lib/teamPresentation";
import MatterIcon from "@/components/workspace/MatterIcon";
import styles from "./MatterContinuity.module.css";

type RetryableCommand = { source_action_key: string };

export default function HandoffPanel(props: HandoffPanelProps & { scopeSelector?: ReactNode }) {
  const { actor, people, scope, handoffs, references, drafts, busy = false, error, onDraftChange, scopeSelector } = props;
  const [pending, setPending] = useState(""); const [notice, setNotice] = useState<PresentationNotice | null>(null); const [localError, setLocalError] = useState("");
  const frozen = useRef<Record<string, string>>({});
  const activeContext = useRef(props.contextKey); activeContext.current = props.contextKey;
  useEffect(() => {
    frozen.current = {};
    setPending(""); setNotice(null); setLocalError("");
  }, [props.contextKey]);
  const locked = busy || Boolean(pending);
  const value = (field: string, fallback = "") => Object.hasOwn(drafts, field) ? drafts[field] : fallback;
  const recipients = useMemo(() => people, [people]);
  const recipient = value("handoff.recipient", recipients[0]?.person_id ?? "");

  function freeze<T extends RetryableCommand>(slot: string, intent: unknown, base: Omit<T, "source_action_key">): T {
    const field = retryDraftKey("handoff", slot);
    const recovered = recoverRetryCommand<T>(frozen.current[field] ?? drafts[field], intent, base, () => newActionKey(slot));
    frozen.current[field] = recovered.serialized;
    if (!recovered.reused) onDraftChange(field, recovered.serialized);
    return recovered.command;
  }
  function clearRetry(slot: string, fields: string[] = []) {
    fields.forEach((field) => onDraftChange(field, ""));
    const retryField = retryDraftKey("handoff", slot); onDraftChange(retryField, ""); delete frozen.current[retryField];
  }
  async function run(slot: string, work: () => ReturnType<HandoffPanelProps["onCreate"]>, success: string, clear: string[] = []) {
    const startedIn = props.contextKey;
    setPending(slot); setLocalError(""); setNotice(null);
    try { const result = await work(); if (activeContext.current !== startedIn) return; setNotice(receiptNotice(result.receipt, success)); if (result.receipt.state === "applied") clearRetry(slot, clear); }
    catch (cause) { if (activeContext.current === startedIn) setLocalError(cause instanceof Error ? cause.message : "The handoff did not finish. Your input is retained for retry."); }
    finally { if (activeContext.current === startedIn) setPending(""); }
  }
  async function create() {
    if (!scope || !recipient || !value("handoff.ask").trim()) { setLocalError("Choose a recipient and add the exact ask."); return; }
    const base = { scope, recipient_id: recipient, ask: value("handoff.ask").trim(), current_basis: value("handoff.basis").trim() || undefined, open_questions: splitOpenQuestions(value("handoff.questions")), references, requested_date: value("handoff.date") || null };
    const intent = { scope: { matter_id: scope.matter_id, kind: scope.kind, work_item_id: scope.work_item_id ?? null }, recipient_id: recipient, ask: base.ask, current_basis: base.current_basis, open_questions: base.open_questions, references: references.map(({ reference_id, kind, path }) => ({ reference_id, kind, path })), requested_date: base.requested_date };
    await run("handoff-create", () => props.onCreate(freeze<HandoffCommand>("handoff-create", intent, base)), "Pending handoff created. Ownership has not changed.", ["handoff.ask", "handoff.basis", "handoff.questions", "handoff.date"]);
  }
  async function act(handoffId: string, action: HandoffAction["action"], revision: string, ownership: string, content: string) {
    const slot = `handoff-${action}:${handoffId}`; const reason = value(`handoff.reason:${handoffId}`).trim();
    await run(slot, () => props.onAction(handoffId, freeze<HandoffAction>(slot, { handoff_id: handoffId, action, reason: reason || undefined }, { action, expected_revision: revision, expected_ownership_revision: ownership, expected_content_revision: content, reason: reason || undefined })), action === "return" ? "Return request created. The work is still assigned to the current owner." : action === "accept" ? "Handoff accepted for this scope." : action === "decline" ? "Handoff declined. Ownership did not change." : "Handoff withdrawn. Ownership did not change.", action === "decline" || action === "return" ? [`handoff.reason:${handoffId}`] : []);
  }

  async function prepareBrief() {
    if (!scope || !props.onPrepareBrief) return;
    const targetId = scope.kind === "matter" ? scope.matter_id : scope.work_item_id!;
    const slot = `prepare-brief:${scope.kind}:${targetId}`;
    const instruction = "Prepare an editable brief for this exact handoff scope. Do not create or accept a handoff.";
    const startedIn = props.contextKey;
    setPending(slot); setLocalError(""); setNotice(null);
    try {
      const result = await props.onPrepareBrief(freeze<ContinuityRunCommand>(slot, { scope: { matter_id: scope.matter_id, kind: scope.kind, target_id: targetId }, instruction }, { instruction }));
      if (activeContext.current !== startedIn) return;
      setNotice(preparationNotice(result.state, "The handoff brief", "Ownership has not changed."));
      if (result.state === "completed") clearRetry(slot);
    } catch (cause) { if (activeContext.current === startedIn) setLocalError(cause instanceof Error ? cause.message : "Brief preparation failed. Retry will use the same saved action."); }
    finally { if (activeContext.current === startedIn) setPending(""); }
  }

  return <section className={`${styles.handoffPanel} handoff-panel`} aria-labelledby="handoff-title">
    <header><div><p className="eyebrow">Team</p><h2 id="handoff-title">Hand off work</h2></div><span className="handoff-panel__actor"><MatterIcon name="user" size={17} />Acting as {actor.display_name}</span></header>
    <p className="handoff-panel__intro">Create a pending local handoff. The recipient must accept it before ownership changes.</p>
    {scopeSelector}
    {error ? <Notice tone="failure" word="Failed" detail={error} /> : null}{notice ? <Notice {...notice} /> : null}{localError ? <Notice tone="failure" word="Failed" detail={localError} alert /> : null}
    {scope ? <div className="handoff-panel__scope"><span>Exact scope</span><strong>{scope.kind === "matter" ? "Whole matter" : "Work item"}: {scope.title}</strong><small>Current owner: {scope.owner_name || "Unknown"} · State: {scope.status}</small></div> : <p className="muted">Choose a matter or work item to hand off.</p>}
    <div className="handoff-panel__form"><label><span className="label">Recipient</span><select className="select-input" value={recipient} disabled={locked} onChange={(event) => onDraftChange("handoff.recipient", event.target.value)}>{recipients.length ? recipients.map((person) => <option key={person.person_id} value={person.person_id}>{person.display_name}{person.specialty ? ` · ${person.specialty}` : ""} · {person.person_id}</option>) : <option value="">No configured people</option>}</select></label>
      <label><span className="label">Exact ask</span><textarea className="text-input prose" value={value("handoff.ask")} disabled={locked} onChange={(event) => onDraftChange("handoff.ask", event.target.value)} placeholder="Review the termination clause and return your proposed wording." /></label>
      <label><span className="label">Current basis (optional)</span><textarea className="text-input" value={value("handoff.basis")} disabled={locked} onChange={(event) => onDraftChange("handoff.basis", event.target.value)} /></label>
      <div className="handoff-panel__grid"><label><span className="label">Open questions, one per line</span><textarea className="text-input" value={value("handoff.questions")} disabled={locked} onChange={(event) => onDraftChange("handoff.questions", event.target.value)} /></label><label><span className="label">Requested date (optional)</span><input className="text-input" type="date" value={value("handoff.date")} disabled={locked} onChange={(event) => onDraftChange("handoff.date", event.target.value)} /></label></div>
      {references.length ? <p className="small muted">Included references: {references.map((reference) => reference.title || reference.path).join(", ")}</p> : null}
      <div className="btn-row"><button className="btn primary" type="button" disabled={locked || !scope || !recipient || !value("handoff.ask").trim()} onClick={() => void create()}>{pending === "handoff-create" ? "Creating handoff…" : "Create pending handoff"}</button>{props.onPrepareBrief && scope ? <button className="btn agent" type="button" disabled={locked} onClick={() => void prepareBrief()}>{pending.startsWith("prepare-brief:") ? "Preparing…" : "Draft handoff brief"}</button> : null}</div>
    </div>
    {handoffs.length ? <div className="handoff-panel__list">{handoffs.map((handoff) => { const actions = handoffActions(handoff, actor.person_id); const currentScope = scope && scope.kind === handoff.scope.kind && scope.matter_id === handoff.scope.matter_id && scope.work_item_id === handoff.scope.work_item_id ? scope : handoff.scope; return <article key={handoff.handoff_id} className="handoff-card"><div className="handoff-card__head"><span className={`handoff-card__state ${handoff.state === "accepted" ? "healthy" : handoff.state === "pending" ? "attention" : "quiet"}`}>{handoffStateLabel(handoff.state)}</span><button className="btn quiet tiny" type="button" onClick={() => props.onOpenTarget({ matter_id: handoff.matter_id, kind: "handoff", target_id: handoff.handoff_id, path: handoff.path, revision: handoff.revision })}>Open packet</button></div><h3>{handoff.scope.kind === "matter" ? "Whole matter" : "Work item"}: {handoff.scope.title}</h3><p><strong>From:</strong> {handoff.sender.display_name} <strong>To:</strong> {handoff.recipient.display_name}</p><p><strong>Ask:</strong> {handoff.ask}</p>{handoff.current_basis ? <p><strong>Current basis:</strong> {handoff.current_basis}</p> : null}{handoff.open_questions?.length ? <div><strong>Open questions</strong><ul>{handoff.open_questions.map((question) => <li key={question}>{question}</li>)}</ul></div> : null}{handoff.reason ? <p><strong>Response:</strong> {handoff.reason}</p> : null}{actions.includes("decline") || actions.includes("return") ? <label><span className="label">{actions.includes("return") ? "Return response" : "Reason"}</span><textarea className="text-input" value={value(`handoff.reason:${handoff.handoff_id}`)} onChange={(event) => onDraftChange(`handoff.reason:${handoff.handoff_id}`, event.target.value)} disabled={locked} /></label> : null}<div className="btn-row">{actions.map((action) => <button key={action} className={`btn ${action === "accept" ? "primary" : "quiet"}`} type="button" disabled={locked || ((action === "decline" || action === "return") && !value(`handoff.reason:${handoff.handoff_id}`).trim())} onClick={() => void act(handoff.handoff_id, action, handoff.revision, handoff.accepted_ownership_revision || currentScope.ownership_revision, currentScope.content_revision)}>{action === "accept" ? "Accept handoff" : action === "decline" ? "Decline" : action === "withdraw" ? "Withdraw" : "Return work"}</button>)}</div>{handoff.return_handoff_id ? <p className="small muted">A reciprocal return handoff is linked to this accepted handoff. Open the packet to see its current state.</p> : null}</article>; })}</div> : <p className="muted">No handoffs for this scope.</p>}
  </section>;
}

function Notice({ tone, word, detail, alert = false }: PresentationNotice & { alert?: boolean }) { return <p className={`handoff-panel__notice ${tone}`} role={alert ? "alert" : "status"}><strong>{word}:</strong> {detail}</p>; }
