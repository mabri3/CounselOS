"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getDossierRequest, getResearchOptions, resumeDossierRequest, startDossierIssue, startDossierRequest, stopDossierRequest } from "@/lib/api";
import { canResumeDossierIssue, dossierControls, dossierStateWord, followUpText, issueProgressLabel, normalizeDossierStatus, pollingScopeMatches, publicationToken, setIssueAt, shouldPollDossier, startPayload, uniqueIssueOrder } from "@/lib/dossierRequests";
import type { ChatCard, DossierPriority, DossierRequestStatus } from "@/lib/types";
import type { ResearchOptions, ResearchScope } from "@/lib/researchScope";
import { ResearchScopeFields } from "@/components/ResearchScopeChoice";
import DossierIssueWebResearch from "./DossierIssueWebResearch";
import styles from "./DossierResearchCard.module.css";

type Card = Extract<ChatCard, { type: "dossier_research" }>;

export default function DossierResearchCard({ card, activeConversationId, disabled, onConversationRefresh, onOpenDocument, onPrepareFollowUp }: {
  card: Card; activeConversationId?: string | null; disabled?: boolean;
  onConversationRefresh?: (conversationId: string) => void | Promise<void>;
  onOpenDocument?: (path: string) => void;
  onPrepareFollowUp?: (text: string) => void;
}) {
  const initial = useMemo(() => normalizeDossierStatus(card.status, { requestId: card.request_id, matterId: card.matter_id, state: card.state, phase: card.phase }), [card]);
  const [status, setStatus] = useState(initial);
  const [priorities, setPriorities] = useState<DossierPriority[]>(initial.priorities);
  const selectableIssues = useMemo(() => [...initial.issues.map(issue => ({ issue_id: issue.issue_id, title: issue.title })), ...initial.new_issue_candidates.map((item, index) => ({ issue_id: String(item.candidate_key || `candidate-${index + 1}`), title: String(item.title || `New issue ${index + 1}`) }))], [initial]);
  const availableIds = selectableIssues.map(issue => issue.issue_id);
  const [firstIssueIds, setFirstIssueIds] = useState(() => uniqueIssueOrder(initial.first_issue_ids.length ? initial.first_issue_ids : availableIds, availableIds));
  const [scope, setScope] = useState<"top_three" | "all">("top_three");
  const [source, setSource] = useState<ResearchScope>({ external: false, other_matters: false, public_query: String(initial.source_scope?.public_query || initial.source_scope?.overall_topic || ""), provider_ids: [] });
  const [options, setOptions] = useState<ResearchOptions>({ provider_ids: [], cost_notice: "External search may incur provider charges.", sensitivity_notice: "Other matters may contain sensitive information." });
  const [busy, setBusy] = useState(false);
  const [startingIssueId, setStartingIssueId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const actionKeys = useRef<Record<string, string>>({});
  const publication = useRef(publicationToken(initial));
  const liveScope = useRef({ matterId: card.matter_id, conversationId: activeConversationId });
  liveScope.current = { matterId: card.matter_id, conversationId: activeConversationId };

  useEffect(() => {
    const receive = (event: Event) => {
      const next = (event as CustomEvent<DossierRequestStatus>).detail;
      if (next?.matter_id === card.matter_id && next?.request_id === card.request_id) {
        setStatus(current => next.sequence >= current.sequence ? next : current);
      }
    };
    window.addEventListener("themis-dossier-status", receive);
    return () => window.removeEventListener("themis-dossier-status", receive);
  }, [card.matter_id, card.request_id]);

  useEffect(() => {
    setStatus(current => {
      if (initial.sequence < current.sequence) return current;
      publication.current = publicationToken(initial);
      return initial;
    });
  }, [initial]);
  useEffect(() => {
    if (!card.request_id || !card.matter_id) return;
    const expected = { matterId: card.matter_id, conversationId: activeConversationId };
    const controller = new AbortController();
    void getDossierRequest(card.matter_id, card.request_id, controller.signal).then(value => {
      if (controller.signal.aborted || !pollingScopeMatches(expected.matterId, expected.conversationId, liveScope.current.matterId, liveScope.current.conversationId)) return;
      const next = normalizeDossierStatus(value, { requestId: card.request_id, matterId: card.matter_id });
      setError("");
      setStatus(current => next.sequence >= current.sequence ? next : current);
      publication.current = publicationToken(next);
    }).catch(caught => {
      if (!(caught instanceof DOMException && caught.name === "AbortError")) setError(caught instanceof Error ? caught.message : "Dossier progress could not refresh.");
    });
    return () => controller.abort();
  }, [activeConversationId, card.matter_id, card.request_id]);
  useEffect(() => {
    if (status.phase !== "setup") return;
    let cancelled = false;
    void getResearchOptions(card.matter_id).then(value => {
      if (cancelled) return;
      setOptions(value);
      setSource(current => ({ ...current, provider_ids: value.provider_ids, native: value.native_available === true, allow_firecrawl: false, allow_followup_queries: value.allow_followup_queries === true, model_selection: value.model_selection, main_model_selection: value.main_model_selection, collector_model_selection: value.collector_model_selection }));
    }).catch(() => { if (!cancelled) setNotice("Source options could not refresh. Saved-material use is still available."); });
    return () => { cancelled = true; };
  }, [card.matter_id, status.phase]);

  useEffect(() => {
    if (!shouldPollDossier(status)) return;
    const expected = { matterId: card.matter_id, conversationId: activeConversationId };
    let stopped = false; let timer: ReturnType<typeof setTimeout>; let controller: AbortController | null = null;
    const poll = async () => {
      controller = new AbortController();
      try {
        const next = normalizeDossierStatus(await getDossierRequest(card.matter_id, card.request_id, controller.signal), { requestId: card.request_id, matterId: card.matter_id });
        if (stopped || !pollingScopeMatches(expected.matterId, expected.conversationId, liveScope.current.matterId, liveScope.current.conversationId)) return;
        const nextToken = publicationToken(next);
        setStatus(current => next.sequence >= current.sequence ? next : current);
        if (nextToken !== publication.current) {
          publication.current = nextToken;
          const origin = next.origin?.conversation_id;
          if (origin && origin === liveScope.current.conversationId) await onConversationRefresh?.(origin);
        }
        if (shouldPollDossier(next)) timer = setTimeout(poll, 2000);
      } catch (caught) {
        if (!stopped && !(caught instanceof DOMException && caught.name === "AbortError")) {
          setError(caught instanceof Error ? caught.message : "Dossier progress could not refresh.");
          timer = setTimeout(poll, 4000);
        }
      }
    };
    timer = setTimeout(poll, 2000);
    return () => { stopped = true; clearTimeout(timer); controller?.abort(); };
  }, [activeConversationId, card.matter_id, card.request_id, onConversationRefresh, status.state]);

  function key(action: string) { return actionKeys.current[action] ||= `dossier-ui:${action}:${crypto.randomUUID()}`; }
  function updateStatus(next: DossierRequestStatus) {
    setStatus(current => next.sequence >= current.sequence ? next : current);
    // The conversation can contain several saved cards for this same request.
    // Wake every copy's existing poller after an action; no extra work is started.
    window.dispatchEvent(new CustomEvent("themis-dossier-status", { detail: next }));
  }
  async function start(mode: "research" | "saved_only") {
    if (mode === "research" && firstIssueIds.length !== Math.min(3, selectableIssues.length)) { setError("Choose three different issues before research starts."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const next = await startDossierRequest(card.matter_id, card.request_id, startPayload(status, mode, priorities, firstIssueIds, scope, source, key(mode)));
      updateStatus(normalizeDossierStatus(next, { requestId: card.request_id, matterId: card.matter_id }));
      setNotice(mode === "research" ? "Research started. You can continue this conversation." : "The saved material is being composed.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The dossier request could not start."); }
    finally { setBusy(false); }
  }
  async function stop() { setBusy(true); setError(""); try { updateStatus(normalizeDossierStatus(await stopDossierRequest(card.matter_id, card.request_id, status.sequence), { requestId: card.request_id, matterId: card.matter_id })); } catch (caught) { setError(caught instanceof Error ? caught.message : "Research could not stop."); } finally { setBusy(false); } }
  async function resume(retryIssueIds?: string[], retryUnknown = false) { setBusy(true); setError(""); try { updateStatus(normalizeDossierStatus(await resumeDossierRequest(card.matter_id, card.request_id, status.sequence, retryIssueIds, retryUnknown), { requestId: card.request_id, matterId: card.matter_id })); } catch (caught) { setError(caught instanceof Error ? caught.message : "Research could not resume."); } finally { setBusy(false); } }
  async function startIssue(issueId: string) {
    if (disabled || busy) return;
    setBusy(true); setStartingIssueId(issueId); setError(""); setNotice("");
    try {
      const next = normalizeDossierStatus(await startDossierIssue(card.matter_id, card.request_id, issueId, status.plan_revision), { requestId: card.request_id, matterId: card.matter_id });
      updateStatus(next);
      setNotice("Issue added to research. You can continue this conversation.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "This issue could not start. Try again."); }
    finally { setBusy(false); setStartingIssueId(null); }
  }

  if (status.phase === "setup" || status.state === "awaiting_choices") return <section className={`${styles.card} ${styles.setup}`}>
    <div className={styles.kicker}>Dossier research · Needs your choices</div><h3>Prepare your dossier</h3>
    <div className={styles.priorities}>{priorities.map((priority, index) => <fieldset key={priority.key}><legend>Priority {index + 1}</legend><label>Priority<input disabled={disabled || busy} value={priority.text} onChange={event => setPriorities(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, text: event.target.value, changed: true } : item))} /></label><label>Why it matters<textarea disabled={disabled || busy} value={priority.why} onChange={event => setPriorities(items => items.map((item, itemIndex) => itemIndex === index ? { ...item, why: event.target.value, changed: true } : item))} /></label></fieldset>)}</div>
    <fieldset className={styles.issues}><legend>First issues to research</legend>{[0, 1, 2].slice(0, Math.min(3, selectableIssues.length)).map(position => <label key={position}>Issue {position + 1}<select disabled={disabled || busy} value={firstIssueIds[position] || ""} onChange={event => setFirstIssueIds(current => setIssueAt(current, position, event.target.value, availableIds))}>{selectableIssues.map(issue => <option key={issue.issue_id} value={issue.issue_id}>{issue.title}</option>)}</select></label>)}</fieldset>
    <fieldset className={styles.scope}><legend>Research scope</legend><label><input type="radio" name={`dossier-scope-${status.request_id}`} checked={scope === "top_three"} onChange={() => setScope("top_three")} /> Research the top three</label><label><input type="radio" name={`dossier-scope-${status.request_id}`} checked={scope === "all"} onChange={() => setScope("all")} /> Research all {selectableIssues.length} identified issues</label>{scope === "all" && <p>We will deliver the first dossier after the first three issues. The remaining issues will be researched in the background. This takes longer.</p>}</fieldset>
    <details><summary>Initial answers for all mapped issues</summary>{initial.issues.map(issue => <article key={issue.issue_id}><strong>{issue.title}</strong><p>{issue.initial_answer}</p>{issue.next_action && <p>Next step: {issue.next_action}</p>}</article>)}</details>
    <ResearchScopeFields value={source} onChange={setSource} options={options} disabled={disabled || busy} />
    {error && <p className={styles.error} role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    <div className={styles.actions}><button className="btn primary compact" disabled={disabled || busy || (source.external && !source.public_query.trim())} onClick={() => void start("research")} type="button">{busy ? "Starting…" : "Start dossier research"}</button><button className="btn compact" disabled={disabled || busy} onClick={() => void start("saved_only")} type="button">Use saved material now</button><button className="btn tiny quiet" disabled={disabled || busy} onClick={() => { setPriorities(status.priorities); setNotice("Suggested priorities kept. No research started."); }} type="button">Skip priority changes</button><button className="btn tiny quiet" disabled={disabled || busy} onClick={() => { setPriorities(status.priorities); setFirstIssueIds(uniqueIssueOrder(status.first_issue_ids, availableIds)); setNotice("Setup kept. No research started."); }} type="button">Cancel</button></div>
  </section>;

  const controls = dossierControls(status); const failedIds = status.issues.filter(issue => issue.state === "failed").map(issue => issue.issue_id); const firstPublication = status.publications[0]; const latest = status.latest_publication && Object.keys(status.latest_publication).length ? status.latest_publication : status.publications.at(-1);
  return <section className={`${styles.card} ${styles.progress}`} aria-busy={shouldPollDossier(status)}><div className={styles.kicker}>Dossier research · {dossierStateWord(status.state)}</div><h3>{issueProgressLabel(status)}</h3>
    {status.first_pass_ready_at && firstPublication?.revision_path ? <button className={styles.revision} onClick={() => onOpenDocument?.(firstPublication.revision_path!)} type="button">First dossier ready · Open exact revision</button> : null}
    {status.publications.length > 1 && latest?.revision_path && latest.revision_path !== firstPublication?.revision_path ? <button className={styles.revision} onClick={() => onOpenDocument?.(latest.revision_path!)} type="button">Latest dossier update · Open exact revision</button> : null}
    {latest?.state === "review_required" && <p className={styles.attention} role="status">Update ready for review</p>}
    {status.waiting_for_existing_research && <p role="status">Waiting for the current research to finish. No additional workers have started.</p>}
    {status.last_error && <p className={styles.error} role="alert">{status.last_error}</p>}
    {status.unknown_writer_outcome && <p className={styles.attention}>The writer stopped before its reply was saved. Retrying can incur another charge. <button disabled={disabled || busy} onClick={() => void resume(undefined, true)} type="button">Retry unknown call</button></p>}
    {status.issues.some(issue => canResumeDossierIssue(status, issue)) && <p>Resume keeps saved work and adds a new time allowance. Repeating an unfinished call can incur another charge.</p>}
    <ul className={styles.issueRows}>{status.issues.map(issue => {
      const canStart = status.execution_mode === "research" && issue.state === "not_selected";
      const heading = <><strong>{issue.title}</strong><span className={styles.state}>{issue.recovery_status && issue.state === "running" ? "Resuming" : issue.state === "partial" ? "Unfinished" : dossierStateWord(issue.state)}</span></>;
      const progress = <>{issue.sources_read} sources read · {issue.sources_retrieved} sources retrieved{issue.support ? ` · ${issue.support}` : ""}</>;
      return <li className={`${styles[`state_${issue.state}`] || ""} ${canStart ? styles.actionableIssue : ""}`} key={issue.issue_id}>
        {canStart ? <button className={styles.issueStart} type="button" disabled={disabled || busy} aria-label={`Start research: ${issue.title}`} onClick={() => void startIssue(issue.issue_id)}>
          <span className={styles.issueHeading}>{heading}</span><span className={styles.issueMeta}>{progress}</span><span className={styles.issueStartLabel}>{startingIssueId === issue.issue_id ? "Starting…" : "Start research"}</span>
        </button> : <><div>{heading}</div><p>{progress}</p></>}
        {issue.answer_path && <button className="text-button" onClick={() => onOpenDocument?.(issue.answer_path!)} type="button">Open saved answer</button>}{issue.last_error && <p className={styles.error}>{issue.last_error}</p>}
        {issue.state === "partial" && !issue.last_error && <p>Research stopped before a finished answer was saved.</p>}
        {issue.recovery_status && ["queued", "running"].includes(issue.state) && <p role="status">{issue.recovery_status}</p>}
        {canResumeDossierIssue(status, issue) && <button className="btn compact" disabled={disabled || busy} aria-label={`Resume research: ${issue.title}`} onClick={() => void resume([issue.issue_id], true)} type="button">Resume research</button>}
        <DossierIssueWebResearch matterId={card.matter_id} requestId={card.request_id} planRevision={status.plan_revision} issue={issue} included={status.execution_mode === "research" && status.source_scope?.external === true} publicQuery={String(status.source_scope?.public_query || "")} disabled={disabled || busy} onOpenDocument={onOpenDocument} onRefresh={async () => {
          const next = normalizeDossierStatus(await getDossierRequest(card.matter_id, card.request_id), { requestId: card.request_id, matterId: card.matter_id });
          setStatus(current => next.sequence >= current.sequence ? next : current);
          if (activeConversationId) await onConversationRefresh?.(activeConversationId);
        }} />
      </li>;
    })}</ul>
    {status.new_issue_candidates.length > 0 && <div className={styles.newIssues}><strong>New issues found</strong><ul>{status.new_issue_candidates.map((item, index) => <li key={String(item.candidate_key || index)}>{String(item.title || "New issue")}</li>)}</ul><button className="btn tiny quiet" onClick={() => onPrepareFollowUp?.(followUpText(status))} type="button">Prepare follow-up question</button></div>}
    {error && <p className={styles.error} role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    <div className={styles.actions}>{controls.stop && <button className="btn tiny quiet" disabled={disabled || busy} onClick={() => void stop()} type="button">Stop</button>}{!status.unknown_writer_outcome && (latest?.state === "failed" || status.state === "failed" && failedIds.length === 0) && <button className="btn primary compact" disabled={disabled || busy} onClick={() => void resume()} type="button">Retry saving dossier</button>}{controls.resume && <button className="btn primary compact" disabled={disabled || busy} onClick={() => void resume()} type="button">Resume</button>}{controls.retry && failedIds.length > 0 && <button className="btn tiny quiet" disabled={disabled || busy} onClick={() => void resume(failedIds)} type="button">Retry failed {failedIds.length === 1 ? "issue" : "issues"}</button>}</div>
    <details><summary>Diagnostic details</summary><code>{status.request_id}</code></details>
  </section>;
}
