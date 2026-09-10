"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  ChangeImpactPanelProps,
  ComparisonCommand,
  ContinuityRunCommand,
  ImpactUpdateCommand,
  ReferenceSelection,
  SpecComparison,
} from "@/lib/continuityTypes";
import {
  differencePresentation,
  findingEffectLabel,
  findingPassageEvidence,
  findingSupportLabel,
  frozenImpactCommand,
  impactAnalysisScope,
  impactContextChanged,
  impactOffer,
  impactRetryDraftKey,
  impactState,
  passageEvidence,
  passagesForFinding,
  selectedReferenceIds,
  selectedReferences,
  targetForFinding,
  type ImpactStatePresentation,
} from "@/lib/impactPresentation";
import styles from "./MatterContinuity.module.css";
import MatterIcon from "@/components/workspace/MatterIcon";

function actionKey(slot: string): string {
  return `${slot}:${crypto.randomUUID()}`;
}

function candidateLabel(reference: Pick<ReferenceSelection, "path" | "title">): string {
  return reference.title?.trim() || reference.path;
}

function targetKind(kind: ReferenceSelection["kind"]): string {
  if (kind === "advice") return "Earlier advice";
  if (kind === "recommendation") return "Recommendation";
  if (kind === "decision") return "Recorded decision";
  if (kind === "draft") return "Draft work product";
  return kind.replaceAll("_", " ");
}

const impactMarkdownComponents = {
  table: ({ children }: { children?: React.ReactNode }) => <div style={{ maxWidth: "100%", overflowX: "auto", margin: "10px 0" }}><table>{children}</table></div>,
  pre: ({ children }: { children?: React.ReactNode }) => <pre style={{ maxWidth: "100%", overflowX: "auto", padding: "10px 12px", background: "var(--paper)", border: "1px solid var(--line-faint)", borderRadius: "var(--radius)" }}>{children}</pre>,
  code: ({ children }: { children?: React.ReactNode }) => <code style={{ overflowWrap: "anywhere" }}>{children}</code>,
};

export default function ChangeImpactPanel(props: ChangeImpactPanelProps) {
  const { drafts, busy = false, error, onDraftChange } = props;
  const [pending, setPending] = useState("");
  const [notice, setNotice] = useState<ImpactStatePresentation | null>(null);
  const [localError, setLocalError] = useState("");
  const [showAllPassages, setShowAllPassages] = useState(false);
  const activeContext = useRef(props.contextKey);
  activeContext.current = props.contextKey;
  const renderedContext = useRef(props.contextKey);
  const retryOverlay = useRef<{ contextKey: string; values: Record<string, string> }>({ contextKey: props.contextKey, values: {} });
  if (retryOverlay.current.contextKey !== props.contextKey) retryOverlay.current = { contextKey: props.contextKey, values: {} };
  const locked = busy || Boolean(pending);
  const value = (field: string, fallback = "") => Object.hasOwn(drafts, field) ? drafts[field] : fallback;
  const selected = props.comparisons.find((item) => item.comparison_id === props.selectedComparisonId) ?? null;
  const chosenTargetIds = selectedReferenceIds(value("impact.targets"));

  useEffect(() => {
    if (!impactContextChanged(renderedContext.current, props.contextKey)) return;
    renderedContext.current = props.contextKey;
    setPending("");
    setNotice(null);
    setLocalError("");
    setShowAllPassages(false);
  }, [props.contextKey]);

  function setFrozen<T extends { source_action_key: string }>(slot: string, intent: unknown, create: () => T): T {
    const key = impactRetryDraftKey(slot);
    const stored = retryOverlay.current.values[key] ?? value(key);
    const frozen = frozenImpactCommand(stored, intent, create);
    retryOverlay.current.values[key] = frozen.draft;
    if (!frozen.reused) onDraftChange(key, frozen.draft);
    return frozen.command;
  }

  function clearFrozen(slot: string) {
    const key = impactRetryDraftKey(slot);
    delete retryOverlay.current.values[key];
    onDraftChange(key, "");
  }

  async function perform(slot: string, work: () => Promise<unknown>, success: string, clearRetry = true) {
    const startedIn = props.contextKey;
    setPending(slot); setNotice(null); setLocalError("");
    try {
      const result = await work();
      if (activeContext.current !== startedIn) return;
      const resultState = result && typeof result === "object" && "state" in result ? String(result.state) : "";
      if (["failed", "interrupted", "not_saved"].includes(resultState)) {
        setLocalError(`The run is ${resultState.replaceAll("_", " ")}. The original command is retained for retry.`);
        return;
      }
      if (resultState === "queued") setNotice({ word: "Queued", tone: "agent", detail: success });
      else if (resultState === "running") setNotice({ word: "Agent work", tone: "agent", detail: success });
      else if (resultState === "completed" || resultState === "complete") setNotice({ word: "Complete", tone: "healthy", detail: success });
      else setNotice({ word: "Saved", tone: "healthy", detail: success });
      if (clearRetry) clearFrozen(slot);
    } catch (cause) {
      if (activeContext.current === startedIn) setLocalError(cause instanceof Error ? cause.message : "The action did not finish. Your selection is retained for retry.");
    } finally {
      if (activeContext.current === startedIn) setPending("");
    }
  }

  function toggleTarget(referenceId: string) {
    const next = chosenTargetIds.includes(referenceId) ? chosenTargetIds.filter((id) => id !== referenceId) : [...chosenTargetIds, referenceId];
    onDraftChange("impact.targets", JSON.stringify(next));
  }

  async function prepare() {
    const before = props.sources.find((item) => item.reference_id === value("impact.before")) ?? null;
    const after = props.sources.find((item) => item.reference_id === value("impact.after"));
    const targets = selectedReferences(props.targets, value("impact.targets"));
    if (!after) { setLocalError("Choose the current supplied version."); return; }
    const commandBase = { before, after, targets, business_question_revision: props.businessQuestionRevision };
    const intent = { before_id: before?.reference_id ?? null, after_id: after.reference_id, target_ids: targets.map((target) => target.reference_id) };
    const command = setFrozen<ComparisonCommand>("prepare", intent, () => ({ ...commandBase, source_action_key: actionKey("impact.prepare") }));
    const startedIn = props.contextKey;
    setPending("prepare"); setNotice(null); setLocalError("");
    try {
      const comparison = await props.onPrepare(command);
      if (activeContext.current !== startedIn) return;
      props.onSelectComparison(comparison.comparison_id);
      if (comparison.state === "partial") {
        setNotice({ word: "Partly saved", tone: "attention", detail: "The comparison record exists, but its evidence snapshots are incomplete. Your original command is retained for retry." });
      } else {
        clearFrozen("prepare");
        setNotice({ word: "Prepared", tone: "agent", detail: "Exact source versions and selected work were frozen. No advice, decision, or draft changed." });
      }
    } catch (cause) {
      if (activeContext.current === startedIn) setLocalError(cause instanceof Error ? cause.message : "The comparison was not prepared. Your selections are retained for retry.");
    } finally {
      if (activeContext.current === startedIn) setPending("");
    }
  }

  async function analyze(comparison: SpecComparison) {
    const slot = `analyze:${comparison.comparison_id}`;
    const instruction = value("impact.instruction").trim();
    const intent = { comparison_id: comparison.comparison_id, instruction };
    const command = setFrozen<ContinuityRunCommand>(slot, intent, () => ({ source_action_key: actionKey("impact.analyze"), instruction: instruction || undefined }));
    await perform(slot, () => props.onAnalyze(comparison.comparison_id, command), "The request uses the existing matter conversation. Earlier work remains unchanged.");
  }

  async function requestUpdate(comparison: SpecComparison, targetId: string, artifactRevision: string) {
    const slot = `update:${comparison.comparison_id}:${targetId}`;
    const intent = { comparison_id: comparison.comparison_id, target_id: targetId };
    const command = setFrozen<ImpactUpdateCommand>(slot, intent, () => ({ target_id: targetId, expected_comparison_revision: comparison.revision, expected_artifact_revision: artifactRevision, source_action_key: actionKey("impact.update") }));
    await perform(slot, () => props.onRequestUpdate(comparison.comparison_id, command), "The request uses the existing document editor. The saved draft has not been replaced.");
  }

  async function actOnOffer(offerId: string, action: "accept" | "decline", expectedRevision: string) {
    const slot = `offer:${action}:${offerId}`;
    await perform(slot, () => props.onOfferAction(offerId, action, expectedRevision), action === "decline" ? "Update offer declined. The existing draft is retained." : "Update offer accepted. Review the proposed edits in the existing editor.", false);
  }

  return <section className={`${styles.impactPanel} impact-panel`} aria-labelledby="impact-panel-title">
    <header><div><p className="eyebrow">Change impact</p><h2 id="impact-panel-title">Compare supplied versions</h2></div><div className="impact-panel__status"><MatterIcon name="book" size={22} />{selected ? <span className={`impact-state ${impactState(selected).tone}`}>{impactState(selected).word}</span> : null}</div></header>
    <p className="impact-panel__intro">Read what changed first. Then assess what remains supported, what changes, and what may need review. This analysis does not edit earlier work.</p>
    {error ? <Notice word="Failed" tone="failure" detail={error} /> : null}{notice ? <Notice {...notice} /> : null}{localError ? <Notice word="Failed" tone="failure" detail={localError} alert /> : null}

    {props.comparisons.length ? <div className="impact-history" aria-label="Saved comparisons">{props.comparisons.map((comparison) => <button aria-pressed={comparison.comparison_id === selected?.comparison_id} className={comparison.comparison_id === selected?.comparison_id ? "selected" : ""} key={comparison.comparison_id} onClick={() => { setShowAllPassages(false); props.onSelectComparison(comparison.comparison_id); }} type="button"><span>{comparison.after.title}</span><small>{impactState(comparison).word} · {differencePresentation(comparison.difference).word}</small></button>)}</div> : null}

    <details className="impact-prepare" open={!props.comparisons.length}>
      <summary>Choose versions and earlier work</summary>
      <div className="impact-prepare__columns">
        <section className="impact-versions"><h3>1. Choose versions to compare</h3><div className="impact-prepare__grid">
          <label><span className="label">Earlier version (optional)</span><select className="select-input" disabled={locked} value={value("impact.before")} onChange={(event) => onDraftChange("impact.before", event.target.value)}><option value="">Earlier text not supplied</option>{props.sources.map((source) => <option key={`before:${source.reference_id}`} value={source.reference_id}>{candidateLabel(source)}</option>)}</select></label>
          <label><span className="label">Current supplied version</span><select className="select-input" disabled={locked} value={value("impact.after")} onChange={(event) => onDraftChange("impact.after", event.target.value)}><option value="">Choose current version</option>{props.sources.map((source) => <option key={`after:${source.reference_id}`} value={source.reference_id}>{candidateLabel(source)}</option>)}</select></label>
        </div></section>
        <fieldset className="impact-targets"><legend>2. Review earlier work (optional)</legend>{props.targets.length ? props.targets.map((target) => <label key={target.reference_id}><input checked={chosenTargetIds.includes(target.reference_id)} disabled={locked} onChange={() => toggleTarget(target.reference_id)} type="checkbox" /><span><strong>{candidateLabel(target)}</strong><small>{targetKind(target.kind)} · revision {target.expected_revision}</small></span></label>) : <p className="muted">No earlier saved work is available. You can still compare the supplied source versions.</p>}{!props.targets.some((target) => target.kind === "draft") ? <p className="small muted">To assess a future draft, use Draft to create it. Then prepare a new comparison and select that draft.</p> : null}</fieldset>
      </div>
      {!chosenTargetIds.length ? <p className="small muted"><strong>Source-only scope:</strong> No earlier advice, recommendation, decision, or draft will be assessed.</p> : null}
      <div className="impact-prepare__action"><span>3. Compare and assess</span><button className="btn primary" disabled={locked || !value("impact.after")} onClick={() => void prepare()} type="button">{pending === "prepare" ? "Preparing comparison…" : "Prepare comparison"}</button></div>
    </details>

    {selected ? <ComparisonReading comparison={selected} offers={props.updateOffers} locked={locked} pending={pending} showAllPassages={showAllPassages} instruction={value("impact.instruction")} onInstruction={(next) => onDraftChange("impact.instruction", next)} onShowAll={() => setShowAllPassages(true)} onAnalyze={analyze} onRequestUpdate={requestUpdate} onOfferAction={actOnOffer} onOpenTarget={props.onOpenTarget} onOpenEvidence={props.onOpenEvidence} /> : <div className="impact-empty"><span className="state-label state-quiet">No comparison selected</span><p>Prepare a comparison or open a saved one to read its exact passages and effects.</p><div className="impact-support-cards"><section><MatterIcon name="book" size={25} /><h3>Exact source passages</h3><p>Select versions to read the supplied text side by side.</p></section><section><MatterIcon name="scale" size={25} /><h3>Effect on earlier work</h3><p>Select saved work to assess it against the supplied versions.</p></section></div></div>}
  </section>;
}

function ComparisonReading({ comparison, offers, locked, pending, showAllPassages, instruction, onInstruction, onShowAll, onAnalyze, onRequestUpdate, onOfferAction, onOpenTarget, onOpenEvidence }: {
  comparison: SpecComparison; offers: ChangeImpactPanelProps["updateOffers"]; locked: boolean; pending: string; showAllPassages: boolean; instruction: string;
  onInstruction: (value: string) => void; onShowAll: () => void; onAnalyze: (comparison: SpecComparison) => Promise<void>;
  onRequestUpdate: (comparison: SpecComparison, targetId: string, revision: string) => Promise<void>;
  onOfferAction: (offerId: string, action: "accept" | "decline", revision: string) => Promise<void>;
  onOpenTarget: ChangeImpactPanelProps["onOpenTarget"]; onOpenEvidence: ChangeImpactPanelProps["onOpenEvidence"];
}) {
  const state = impactState(comparison); const difference = differencePresentation(comparison.difference);
  const passages = comparison.passages ?? []; const shown = showAllPassages ? passages : passages.slice(0, 3);
  const draftTargets = (comparison.targets ?? []).filter((target) => target.kind === "draft");
  return <div className="impact-reading">
    <div className="impact-reading__head"><div><h3>{comparison.before?.title || "Earlier version unavailable"} → {comparison.after.title}</h3><p className="record-meta">Saved comparison · {comparison.comparison_id}</p></div><button className="btn quiet tiny" onClick={() => onOpenTarget({ matter_id: comparison.matter_id, kind: "impact", target_id: comparison.comparison_id, path: comparison.path, revision: comparison.revision })} type="button">Open comparison record</button></div>
    <Notice {...state} /><Notice {...difference} /><Notice {...impactAnalysisScope(comparison.targets)} />
    {shown.length ? <section className="impact-passages" aria-labelledby="impact-passages-title"><h3 id="impact-passages-title">Exact changed passages</h3>{shown.map((passage) => <article className="impact-passage" key={passage.passage_id}><div className="impact-passage__label"><strong>{passage.kind === "formatting" ? "Formatting difference" : passage.kind === "added" ? "Added text" : passage.kind === "deleted" ? "Deleted text" : "Changed text"}</strong><span className="mono">{passage.passage_id}</span></div><div className="impact-passage__columns"><section><div><span>Before · {passage.before_locator || "Location unavailable"}</span>{comparison.before ? <button className="btn quiet tiny" onClick={() => onOpenEvidence(passageEvidence(comparison, passage, "before"))} type="button">Open evidence</button> : null}</div><pre>{passage.before_text || (comparison.before ? "No text in this passage" : "Earlier text unavailable")}</pre></section><section><div><span>After · {passage.after_locator || "Location unavailable"}</span><button className="btn quiet tiny" onClick={() => onOpenEvidence(passageEvidence(comparison, passage, "after"))} type="button">Open evidence</button></div><pre>{passage.after_text || "No text in this passage"}</pre></section></div></article>)}{passages.length > shown.length ? <button className="btn quiet" onClick={onShowAll} type="button">Show all {passages.length} passages</button> : null}</section> : <section className="impact-no-passages"><h3>No exact changed passages</h3><p>{comparison.difference === "unchanged" ? "The available text is unchanged." : comparison.difference === "unavailable" ? "An exact before/after reading is unavailable." : "No passage detail was saved."}</p></section>}
    {comparison.analysis?.trim() ? <section className="impact-analysis"><span className="state-label state-agent">Themis.ai · Generated analysis</span><h3>Effect summary</h3><div className="impact-analysis__markdown"><ReactMarkdown components={impactMarkdownComponents} remarkPlugins={[remarkGfm]}>{comparison.analysis}</ReactMarkdown></div></section> : <section className="impact-analysis empty"><span className="state-label state-agent">Analysis not started</span><label><span className="label">Focus for this analysis (optional)</span><textarea className="text-input" disabled={locked || comparison.state === "stale"} onChange={(event) => onInstruction(event.target.value)} placeholder="For example: Focus on the notice section of the draft." value={instruction} /></label><button className="btn agent" disabled={locked || comparison.state === "stale"} onClick={() => void onAnalyze(comparison)} type="button">{pending === `analyze:${comparison.comparison_id}` ? "Starting analysis…" : "Analyze effect on selected work"}</button></section>}
    {(comparison.findings ?? []).length ? <section className="impact-findings" aria-labelledby="impact-findings-title"><h3 id="impact-findings-title">Effect on earlier work</h3>{comparison.findings!.map((finding) => { const target = targetForFinding(comparison, finding); const linkedPassages = passagesForFinding(comparison, finding); return <article key={finding.finding_id}><div className="impact-finding__head"><div><span className={`impact-effect effect-${finding.effect}`}>{findingEffectLabel(finding.effect)}</span><span className={`impact-support support-${finding.support}`}>{findingSupportLabel(finding.support)}</span></div>{target ? <button className="btn quiet tiny" onClick={() => onOpenTarget({ matter_id: comparison.matter_id, kind: "artifact", target_id: target.reference_id, path: target.path, revision: target.revision, view: target.kind === "draft" ? "draft" : "understand" })} type="button">Open {targetKind(target.kind).toLowerCase()}</button> : null}</div><h4>{target?.title || "Affected work unavailable"}{finding.affected_section ? ` · ${finding.affected_section}` : ""}</h4>{target ? <p className="record-meta">{targetKind(target.kind)} · frozen revision {target.revision}</p> : null}<p>{finding.explanation}</p>{linkedPassages.length ? <div className="impact-evidence-links"><span>Exact evidence:</span>{linkedPassages.map((passage) => { const evidence = findingPassageEvidence(comparison, passage); return <button className="btn quiet tiny" key={passage.passage_id} onClick={() => onOpenEvidence(evidence)} type="button">{evidence.locator || passage.passage_id}</button>; })}</div> : <p className="small muted">No exact passage link was saved for this finding.</p>}{target?.kind === "decision" ? <p className="small muted">Analysis only. The recorded decision is unchanged.</p> : null}</article>; })}</section> : comparison.analysis?.trim() ? <section className="impact-no-passages"><h3>No structured affected-work links</h3><p>The useful analysis remains available. No precise saved-work link was recorded.</p></section> : null}
    {draftTargets.length ? <section className="impact-draft-updates" aria-labelledby="impact-draft-updates-title"><h3 id="impact-draft-updates-title">Update selected drafts</h3>{draftTargets.map((target) => <article key={target.reference_id}><div><h4>{candidateLabel(target)}</h4><p className="record-meta">Draft work product · frozen revision {target.revision}</p></div><button className="btn agent" disabled={locked || comparison.state === "stale" || !comparison.analysis?.trim()} onClick={() => void onRequestUpdate(comparison, target.reference_id, target.revision)} type="button">{pending === `update:${comparison.comparison_id}:${target.reference_id}` ? "Requesting update…" : "Request draft update"}</button></article>)}</section> : null}
    {(comparison.offer_ids ?? []).length ? <section className="impact-offers" aria-labelledby="impact-offers-title"><h3 id="impact-offers-title">Existing draft update offers</h3>{comparison.offer_ids!.map((offerId) => { const offer = impactOffer(comparison, offers, offerId); const offerState = offer?.state ?? "unavailable"; return <article key={offerId}><div><span className={`state-label ${offerState === "stale" ? "state-attention" : offerState === "unavailable" ? "state-quiet" : "state-agent"}`}>Update offer · {offerState}</span><p>{offer?.reason || "The saved offer state is not available in this view."}</p></div>{offerState === "declined" ? <span className="impact-offer__retained">Declined · Existing draft retained</span> : offerState === "accepted" ? <span className="impact-offer__retained">Accepted · Open the existing editor to review changes</span> : offerState === "stale" ? <span className="impact-offer__retained">Stale · Prepare a current comparison</span> : offerState === "unavailable" ? <span className="impact-offer__retained">State unavailable · No action taken</span> : <div className="btn-row"><button className="btn tiny" disabled={locked} onClick={() => void onOfferAction(offerId, "accept", offer!.base_revision)} type="button">Accept update offer</button><button className="btn quiet tiny" disabled={locked} onClick={() => void onOfferAction(offerId, "decline", offer!.base_revision)} type="button">Decline offer</button></div>}</article>; })}</section> : null}
    {(comparison.coverage_limits ?? []).length ? <details className="impact-limits" open={comparison.state === "partial" || comparison.state === "unavailable" || comparison.state === "stale"}><summary>Coverage and limits</summary><ul>{comparison.coverage_limits!.map((limit, index) => <li key={`${limit}:${index}`}>{limit}</li>)}</ul></details> : null}
  </div>;
}

function Notice({ word, tone, detail, alert = false }: ImpactStatePresentation & { alert?: boolean }) {
  return <p className={`impact-notice ${tone}`} role={alert ? "alert" : "status"}><strong>{word}:</strong> {detail}</p>;
}
