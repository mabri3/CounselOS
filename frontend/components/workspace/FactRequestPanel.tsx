"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { ContinuityRunCommand, FactReply, FactRequestPanelProps, FactRequestResult } from "@/lib/continuityTypes";
import { factRequestStateLabel, newActionKey, preparationNotice, receiptNotice, recoverRetryCommand, retryDraftKey, type PresentationNotice } from "@/lib/teamPresentation";
import MatterIcon from "@/components/workspace/MatterIcon";
import styles from "./MatterContinuity.module.css";

type RetryableCommand = { source_action_key: string };

export default function FactRequestPanel(props: FactRequestPanelProps & { supportingQuestion?: ReactNode }) {
  const { actor, question, requests, selectedRequestId, drafts, busy = false, error, onDraftChange, supportingQuestion } = props;
  const [pending, setPending] = useState("");
  const [notice, setNotice] = useState<PresentationNotice | null>(null);
  const [localError, setLocalError] = useState("");
  const [reassessment, setReassessment] = useState<FactRequestResult["reassessment"]>(null);
  const frozen = useRef<Record<string, string>>({});
  const activeContext = useRef(props.contextKey); activeContext.current = props.contextKey;
  useEffect(() => {
    frozen.current = {};
    setPending(""); setNotice(null); setLocalError(""); setReassessment(null);
  }, [props.contextKey]);
  const selected = useMemo(() => requests.find((request) => request.request_id === selectedRequestId) ?? null, [requests, selectedRequestId]);
  const locked = busy || Boolean(pending);
  const value = (field: string, fallback = "") => Object.hasOwn(drafts, field) ? drafts[field] : fallback;

  function commandFor<T extends RetryableCommand>(slot: string, intent: unknown, base: Omit<T, "source_action_key">): T {
    const field = retryDraftKey("fact-request", slot);
    const recovered = recoverRetryCommand<T>(frozen.current[field] ?? drafts[field], intent, base, () => newActionKey(slot));
    frozen.current[field] = recovered.serialized;
    if (!recovered.reused) onDraftChange(field, recovered.serialized);
    return recovered.command;
  }
  function clear(fields: string[], slot: string) { fields.forEach((field) => onDraftChange(field, "")); const retryField = retryDraftKey("fact-request", slot); onDraftChange(retryField, ""); delete frozen.current[retryField]; }
  function fail(cause: unknown, fallback: string) { setLocalError(cause instanceof Error ? cause.message : fallback); }
  async function perform(label: string, work: () => Promise<FactRequestResult>, success: string, clearFields: string[] = []) {
    const startedIn = props.contextKey;
    setPending(label); setLocalError(""); setNotice(null);
    try {
      const result = await work();
      if (activeContext.current !== startedIn) return;
      setNotice(receiptNotice(result.receipt, success));
      setReassessment(result.reassessment ?? null);
      if (result.receipt.state === "applied") clear(clearFields, label);
    } catch (cause) { if (activeContext.current === startedIn) fail(cause, "The action did not finish. Your input is retained for retry."); }
    finally { if (activeContext.current === startedIn) setPending(""); }
  }

  async function copyWording() {
    const wording = value("request.wording", selected?.wording ?? "").trim();
    if (!wording) { setLocalError("Add request wording before you copy it."); return; }
    try { await navigator.clipboard.writeText(wording); setNotice({ tone: "agent", word: "Copied", detail: "The request was copied. The app has not marked it as sent." }); setLocalError(""); }
    catch { setLocalError("Copy failed. Select the request text and copy it manually."); }
  }

  async function prepareWording() {
    if (!question || !props.onPrepareWording) return;
    const slot = `prepare-wording:${question.question_id}`;
    const instruction = "Draft concise, editable wording for this fact request. Do not mark it as sent.";
    const startedIn = props.contextKey;
    setPending(slot); setLocalError(""); setNotice(null);
    try {
      const result = await props.onPrepareWording(question.question_id, commandFor<ContinuityRunCommand>(slot, { question_id: question.question_id, instruction }, { instruction }));
      if (activeContext.current !== startedIn) return;
      setNotice(preparationNotice(result.state, "Request wording", "No external request was recorded."));
      if (result.state === "completed") clear([], slot);
    } catch (cause) { if (activeContext.current === startedIn) fail(cause, "Wording preparation failed. Retry will use the same saved action."); }
    finally { if (activeContext.current === startedIn) setPending(""); }
  }

  const wording = value("request.wording", selected?.wording ?? "");
  const person = value("request.person", selected?.requested_person ?? "");
  const due = value("request.due", selected?.due_at?.slice(0, 10) ?? "");

  return <section className={`${styles.factRequest} fact-request`} aria-labelledby="fact-request-title">
    <header><div><h2 id="fact-request-title">Request and record an answer</h2></div></header>
    <p className="fact-request__intro">Prepare text here, then copy it. Only “Record external request” changes its state.</p>
    {error ? <Notice tone="failure" word="Failed" detail={error} /> : null}{notice ? <Notice {...notice} /> : null}{localError ? <Notice tone="failure" word="Failed" detail={localError} alert /> : null}
    {supportingQuestion ?? (question ? <div className="fact-request__question"><span>Linked question</span><p>{question.text}</p></div> : <p className="muted">Choose a supporting question before you prepare a request.</p>)}
    <label className="fact-request__entering-lawyer"><span className="label">Entering lawyer</span><input className="text-input" readOnly value={actor.display_name} /></label>
    {requests.length ? <label className="label" htmlFor="fact-request-select">Saved request</label> : null}
    {requests.length ? <select id="fact-request-select" className="select-input" value={selectedRequestId ?? ""} onChange={(event) => props.onSelectRequest(event.target.value || null)} disabled={locked}><option value="">Prepare a new request</option>{requests.map((request) => <option value={request.request_id} key={request.request_id}>{factRequestStateLabel(request.state)} · {request.requested_person || "Recipient not specified"}</option>)}</select> : null}
    <div className="fact-request__form">
      <label className="label" htmlFor="fact-request-wording">Editable request</label><textarea id="fact-request-wording" className="text-input prose" value={wording} disabled={locked || Boolean(selected && selected.state !== "prepared")} onChange={(event) => onDraftChange("request.wording", event.target.value)} placeholder="Could you confirm…" />
      <div className="fact-request__grid"><label><span className="label">Requested person</span><input className="text-input" value={person} disabled={locked || Boolean(selected && selected.state !== "prepared")} onChange={(event) => onDraftChange("request.person", event.target.value)} /></label><label><span className="label">Requested date (optional)</span><input className="text-input" type="date" value={due} disabled={locked || Boolean(selected && selected.state !== "prepared")} onChange={(event) => onDraftChange("request.due", event.target.value)} /></label></div>
      <div className="fact-request__information"><section><MatterIcon name="sparkles" size={22} /><div><span className="label">Text preparation</span><strong>Preparation is local</strong><p>Preparing or copying text does not send a request.</p></div></section><section><MatterIcon name="history" size={22} /><div><span className="label">Record external request</span><strong>{selected ? factRequestStateLabel(selected.state) : "Not recorded"}</strong><p>{selected ? "This is the current saved request state." : "Record external request is a separate explicit action."}</p></div></section></div>
      <div className="btn-row"><button type="button" className="btn primary" disabled={locked || !question || !wording.trim() || Boolean(selected && selected.state !== "prepared")} onClick={() => { const slot = selected ? `request-edit:${selected.request_id}` : "request-create"; const intent = selected ? { request_id: selected.request_id, wording: wording.trim(), requested_person: person.trim() || null, due_at: due || null } : { question_id: question!.question_id, wording: wording.trim(), requested_person: person.trim() || null, due_at: due || null }; void perform(slot, () => selected ? props.onEdit(selected.request_id, commandFor(slot, intent, { expected_revision: selected.revision, wording: wording.trim(), requested_person: person.trim() || null, due_at: due || null })) : props.onCreate(commandFor(slot, intent, { question_id: question!.question_id, expected_question_revision: question!.source_revision, business_question_revision: question!.business_question_revision, wording: wording.trim(), requested_person: person.trim() || null, due_at: due || null })), selected ? "Request changes saved." : "Request prepared."); }}>{pending.startsWith("request-") ? "Saving…" : selected ? "Save request changes" : "Prepare request"}</button><button className="btn quiet" type="button" disabled={locked || !wording.trim()} onClick={() => void copyWording()}>Copy</button>{props.onPrepareWording && question ? <button className="btn agent" type="button" disabled={locked} onClick={() => void prepareWording()}>{pending.startsWith("prepare-wording:") ? "Preparing…" : "Draft wording"}</button> : null}</div>
    </div>
    {selected ? <SavedRequest request={selected} {...props} locked={locked} pending={pending} value={value} setPending={setPending} setNotice={setNotice} setError={setLocalError} perform={perform} commandFor={commandFor} /> : null}
    {reassessment ? <div className="fact-request__reassess"><p><strong>Answer saved.</strong> Reassess the current matter with the recorded fact.</p><button className="btn agent" type="button" disabled={locked} onClick={() => { setPending("reassess"); setLocalError(""); void props.onReassess(reassessment).then((result) => setNotice(result.state === "completed" ? { tone: "agent", word: "Complete", detail: "Saved analysis now uses the recorded fact. Drafts and decisions stay unchanged." } : { tone: "agent", word: result.state === "queued" ? "Queued" : "Working", detail: "Reassessment uses the saved fact. Drafts and decisions stay unchanged." })).catch((cause) => fail(cause, "Reassessment failed. The saved reply and fact remain recorded.")).finally(() => setPending("")); }}>Reassess current answer</button></div> : null}
  </section>;
}

function SavedRequest({ request, actor, locked, pending, value, onDraftChange, onAction, onSaveReply, onRecordReply, onOpenTarget, perform, commandFor }: any) {
  const replyText = value("reply.text"); const speaker = value("reply.speaker"); const date = value("reply.date");
  return <div className="fact-request__saved"><div className="fact-request__saved-head"><div><span className={`fact-state state-${request.state === "answer_recorded" ? "healthy" : "attention"}`}>{factRequestStateLabel(request.state)}</span><p className="small">Requested from: {request.requested_person || "Not specified"}</p></div><button className="btn quiet tiny" type="button" onClick={() => onOpenTarget({ matter_id: request.matter_id, kind: "fact_request", target_id: request.request_id, revision: request.revision })}>Open record</button></div>
    {request.remaining_question ? <p className="fact-request__remaining"><strong>Still open:</strong> {request.remaining_question}</p> : null}
    {(request.state ?? "prepared") === "prepared" ? <div className="btn-row"><button className="btn review" type="button" disabled={locked} onClick={() => { const slot = `request-external:${request.request_id}`; void perform(slot, () => onAction(request.request_id, commandFor(slot, { request_id: request.request_id, action: "requested_externally" }, { action: "requested_externally", expected_revision: request.revision })), "External request recorded."); }}>Record external request</button><button className="btn quiet" type="button" disabled={locked} onClick={() => { const slot = `request-open:${request.request_id}`; void perform(slot, () => onAction(request.request_id, commandFor(slot, { request_id: request.request_id, action: "leave_open" }, { action: "leave_open", expected_revision: request.revision })), "Request left open."); }}>Leave open</button></div> : null}
    <div className="fact-request__reply"><h3>Paste a reply</h3><p className="small muted">The exact reply is saved as supplied text. The speaker is separate from {actor.display_name}, who enters it.</p><label className="label" htmlFor="fact-reply-text">Exact reply text</label><textarea id="fact-reply-text" className="text-input prose" value={replyText} disabled={locked} onChange={(event) => onDraftChange("reply.text", event.target.value)} /><div className="fact-request__grid"><label><span className="label">Reported speaker (optional)</span><input className="text-input" value={speaker} disabled={locked} onChange={(event) => onDraftChange("reply.speaker", event.target.value)} /></label><label><span className="label">Reported date (optional)</span><input className="text-input" type="date" value={date} disabled={locked} onChange={(event) => onDraftChange("reply.date", event.target.value)} /></label></div><button className="btn primary" type="button" disabled={locked || !replyText.trim()} onClick={() => { const slot = `reply-save:${request.request_id}`; const intent = { request_id: request.request_id, text: replyText, reported_speaker: speaker.trim() || null, reported_at: date || null }; void perform(slot, () => onSaveReply(request.request_id, commandFor(slot, intent, { expected_revision: request.revision, text: replyText, reported_speaker: speaker.trim() || null, reported_at: date || null })), "Exact reply saved.", ["reply.text", "reply.speaker", "reply.date"]); }}>{pending.startsWith("reply-save:") ? "Saving reply…" : "Save reply"}</button></div>
    {(request.replies ?? []).map((reply: FactReply) => <ReplyRecord key={reply.reply_id} request={request} reply={reply} locked={locked} value={value} onDraftChange={onDraftChange} onRecordReply={onRecordReply} perform={perform} commandFor={commandFor} />)}
  </div>;
}

function ReplyRecord({ request, reply, locked, value, onDraftChange, onRecordReply, perform, commandFor }: any) {
  const answer = value(`answer.text:${reply.reply_id}`, reply.text); const coverage = value(`answer.coverage:${reply.reply_id}`, "full"); const remaining = value(`answer.remaining:${reply.reply_id}`); const supersedes = value(`answer.supersedes:${reply.reply_id}`);
  const answerInputId = `reported-fact-${reply.reply_id}`;
  const slot = `answer-record:${request.request_id}:${reply.reply_id}`;
  const intent = { request_id: request.request_id, reply_id: reply.reply_id, answer_text: answer.trim(), coverage, remaining_question: coverage === "partial" ? remaining.trim() : null, supersedes_fact_id: supersedes.trim() || null };
  return <details className="fact-request__answer"><summary>Record answer from {reply.reported_speaker || "speaker unknown"}</summary><blockquote>{reply.text}</blockquote><label className="label" htmlFor={answerInputId}>Reported fact</label><textarea id={answerInputId} className="text-input" value={answer} disabled={locked} onChange={(event) => onDraftChange(`answer.text:${reply.reply_id}`, event.target.value)} /><fieldset><legend className="label">Coverage</legend><label><input type="radio" name={`coverage-${reply.reply_id}`} checked={coverage === "full"} onChange={() => onDraftChange(`answer.coverage:${reply.reply_id}`, "full")} /> Full answer</label><label><input type="radio" name={`coverage-${reply.reply_id}`} checked={coverage === "partial"} onChange={() => onDraftChange(`answer.coverage:${reply.reply_id}`, "partial")} /> Partial answer</label></fieldset>{coverage === "partial" ? <label><span className="label">Question that remains</span><input className="text-input" value={remaining} onChange={(event) => onDraftChange(`answer.remaining:${reply.reply_id}`, event.target.value)} /></label> : null}<label><span className="label">Superseded fact ID (optional)</span><input className="text-input" value={supersedes} onChange={(event) => onDraftChange(`answer.supersedes:${reply.reply_id}`, event.target.value)} /></label><button className="btn primary" type="button" disabled={locked || !answer.trim() || (coverage === "partial" && !remaining.trim())} onClick={() => void perform(slot, () => onRecordReply(request.request_id, reply.reply_id, commandFor(slot, intent, { expected_revision: request.revision, expected_question_revision: request.question_revision, business_question_revision: request.business_question_revision, answer_text: answer.trim(), coverage, remaining_question: coverage === "partial" ? remaining.trim() : null, supersedes_fact_id: supersedes.trim() || null })), coverage === "partial" ? "Partial answer recorded. The remaining question stays open." : "Answer recorded.")}>Record this answer</button></details>;
}

function Notice({ tone, word, detail, alert = false }: PresentationNotice & { alert?: boolean }) { return <p className={`fact-request__notice ${tone}`} role={alert ? "alert" : "status"}><strong>{word}:</strong> {detail}</p>; }
