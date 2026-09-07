"use client";

import { useEffect, useRef, useState } from "react";
import { createDecision, revisePathDecision, getDecisions, getFile } from "@/lib/api";
import { formatLongDay } from "@/lib/design";
import type { MatterDetail } from "@/lib/types";
import type { RecommendationDisposition } from "@/lib/types";
import { recommendationNeedsReason } from "@/lib/recommendations";
import type { DecisionMapBasis, DecisionPathPrefill } from "@/lib/decisionMapTypes";

type DecisionSubmission = { payload: Record<string, unknown>; sourceActionKey: string };

/**
 * Canvas 2b / 1h. The modal makes the explicit record action clear: the
 * durable result is attributed, dated, and available to future answers.
 */
export default function RecordDecisionModal({
  detail,
  suggestion,
  basis,
  basisLabels = {},
  lawyerAuthor,
  pathPrefill,
  onClose,
  onRecorded,
}: {
  detail: MatterDetail;
  suggestion: string;
  basis: string[];
  basisLabels?: Record<string, string>;
  lawyerAuthor?: string;
  pathPrefill?: DecisionPathPrefill;
  onClose: () => void;
  onRecorded: () => Promise<void>;
}) {
  const initialDecision = pathPrefill?.option.title.trim() || suggestion.trim();
  const [chosenPath, setChosenPath] = useState(initialDecision);
  const [rationale, setRationale] = useState("");
  const [disposition, setDisposition] = useState<RecommendationDisposition>(detail.recommendation?.current_version_id ? "followed" : "not_applicable");
  const [dispositionReason, setDispositionReason] = useState("");
  const [conditions, setConditions] = useState(() => pathPrefill ? pathConditions(pathPrefill) : "");
  const [notDecided, setNotDecided] = useState("");
  const [linkedBasis, setLinkedBasis] = useState(basis);
  const [failedPublicResearch, setFailedPublicResearch] = useState<string[]>([]);
  const [decider, setDecider] = useState(lawyerAuthor?.trim() || detail.legal_owner || "");
  const [reviewAt, setReviewAt] = useState(defaultReview());
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [recorded, setRecorded] = useState(false);
  const [error, setError] = useState("");
  const [historicalBasisAccepted, setHistoricalBasisAccepted] = useState(false);
  const [basisConflict, setBasisConflict] = useState(false);
  const [uncertainSave, setUncertainSave] = useState(false);
  const sourceActionKey = useRef<string | null>(null);
  const pendingSubmission = useRef<DecisionSubmission | null>(null);
  const historicalBasisRequired = Boolean(pathPrefill && (basisConflict || pathPrefill.state === "needs_review" || pathPrefill.state === "historical"));
  const formLocked = busy || created || recorded || uncertainSave;

  function edit(update: () => void) {
    if (uncertainSave) return;
    pendingSubmission.current = null;
    sourceActionKey.current = null;
    setError("");
    update();
  }

  useEffect(() => {
    let active = true;
    void Promise.all(
      basis.filter((path) => path.includes("/research/")).map(async (path) => {
        try {
          const document = await getFile(path);
          const status = document.metadata.public_research_status;
          return status === "failed" || status === "unavailable" ? path : null;
        } catch {
          return null;
        }
      }),
    ).then((paths) => { if (active) setFailedPublicResearch(paths.filter((path): path is string => Boolean(path))); });
    return () => { active = false; };
  }, [basis]);

  async function record() {
    if (!chosenPath.trim()) { setError("Say what was decided."); return; }
    if (!decider.trim()) { setError("Enter who made the decision."); return; }
    if (recommendationNeedsReason(disposition) && !dispositionReason.trim()) { setError("Give a short reason for modifying or not following the recommendation."); return; }
    let decisionCreated = created;
    let decisionId = createdId;
    setBusy(true);
    setError("");
    try {
      if (!created) {
        const submission = pendingSubmission.current ?? (() => {
          sourceActionKey.current ||= `decision:ui:${crypto.randomUUID()}`;
          const payload = {
          matter_id: detail.matter_id,
          title: detail.title,
          chosen_path: chosenPath.trim(),
          rationale: rationale.trim(),
          decision_maker: decider.trim(),
          risk_level: detail.risk_level,
          next_review_at: reviewAt || null,
          conditions: lines(conditions),
          not_decided: lines(notDecided),
          linked_paths: linkedBasis,
          source_action_key: sourceActionKey.current,
          recommendation_disposition: disposition,
          recommendation_disposition_reason: dispositionReason.trim(),
          recommendation_version_id: detail.recommendation?.current_version_id ?? null,
          ...(pathPrefill ? { map_basis: submittedMapBasis(pathPrefill.map_basis, historicalBasisAccepted) } : {}),
          };
          return { payload, sourceActionKey: sourceActionKey.current };
        })();
        pendingSubmission.current = submission;
        const saved = await (pathPrefill?.revises_decision_id ? revisePathDecision(pathPrefill.revises_decision_id, submission.payload) : createDecision(submission.payload));
        decisionCreated = true;
        decisionId = saved.decision_id;
        setCreated(true);
        setCreatedId(saved.decision_id);
        setUncertainSave(false);
      }
      const register = await getDecisions();
      if (!decisionId || !register.decisions.some((decision) => decision.decision_id === decisionId)) {
        throw new Error("The decision file was saved, but it is not yet visible in the decision register. Retry confirmation.");
      }
      await onRecorded();
      setRecorded(true);
      setBusy(false);
    } catch (caught) {
      const message = errorMessage(caught, decisionCreated ? "The decision was saved, but the matter did not refresh." : "Could not record the decision.");
      const status = errorStatus(caught);
      const code = errorCode(caught);
      if (!decisionCreated && status === 409 && code !== "action_key_conflict") {
        pendingSubmission.current = null;
        sourceActionKey.current = null;
        setBasisConflict(Boolean(pathPrefill));
        setUncertainSave(false);
      } else if (!decisionCreated && (status === 400 || status === 404 || status === 422)) {
        pendingSubmission.current = null;
        sourceActionKey.current = null;
        setUncertainSave(false);
      } else if (!decisionCreated) {
        setUncertainSave(true);
      }
      setError(message);
      setBusy(false);
    }
  }

  return (
    <div className="modal-scrim" onClick={(event) => { if (!busy && !uncertainSave && event.target === event.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Record durable decision">
        <div className="modal-head">
          <h3>Record a durable decision</h3>
          <p>Use this for a material position, recurring risk, future advice, or a condition that must be monitored.</p>
        </div>

        <div className="modal-body">
          {recorded ? (
            <div className="mutation-status recorded" role="status">
              Decision recorded. The refreshed matter and decision register now include it.
            </div>
          ) : null}
          <div>
            <div className="field-label">Decision {initialDecision && chosenPath === initialDecision ? <span className="field-source">Themis.ai draft</span> : null}</div>
            <textarea
              aria-label="Decision"
              autoFocus
              className="text-input prose"
              disabled={formLocked}
              onChange={(event) => edit(() => setChosenPath(event.target.value))}
              style={{ minHeight: 96 }}
              value={chosenPath}
            />
            {pathPrefill && chosenPath.trim() !== pathPrefill.option.title.trim() ? <div className="field-help">Your wording differs from the saved path. The exact saved path remains linked as the decision map basis.</div> : null}
          </div>

          {pathPrefill ? (
            <div className="warning-callout" role="status">
              <div className="btn-row"><strong>Decision map basis</strong><span className={`state-label ${historicalBasisRequired || pathPrefill.hypothetical ? "state-attention" : "state-agent"}`}>{pathPrefill.hypothetical ? "Hypothetical" : historicalBasisRequired ? pathPrefill.state === "historical" ? "Historical" : "Needs review" : "Saved"}</span></div>
              <p style={{ margin: "7px 0 0" }}>{pathPrefill.analysis.display_title || pathPrefill.option.title} · analysis {pathPrefill.analysis.analysis_revision}</p>
              {historicalBasisRequired ? <label style={{ display: "flex", gap: 8, marginTop: 10 }}><input checked={historicalBasisAccepted} disabled={formLocked} onChange={(event) => edit(() => setHistoricalBasisAccepted(event.target.checked))} type="checkbox" /> Use this saved historical basis even though newer analysis may be needed.</label> : null}
            </div>
          ) : null}

          <div>
            <div className="field-label">Recommendation disposition</div>
            <select aria-label="Recommendation disposition" className="text-input" disabled={formLocked} onChange={(event) => edit(() => setDisposition(event.target.value as RecommendationDisposition))} value={disposition}>
              <option value="followed">Followed</option>
              <option value="modified">Modified</option>
              <option value="not_followed">Not followed</option>
              <option value="not_applicable">Not applicable</option>
            </select>
            {recommendationNeedsReason(disposition) ? (
              <input aria-label="Reason for recommendation disposition" className="text-input" disabled={formLocked} onChange={(event) => edit(() => setDispositionReason(event.target.value))} placeholder="Short reason" value={dispositionReason} />
            ) : null}
          </div>

          <div>
            <div className="field-label">Rationale</div>
            <textarea
              aria-label="Rationale"
              className="text-input prose"
              disabled={formLocked}
              onChange={(event) => edit(() => setRationale(event.target.value))}
              style={{ minHeight: 88 }}
              value={rationale}
            />
            <div className="field-help">Optional. Explain why this decision was made.</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div className="field-label">Conditions</div>
              <textarea aria-label="Conditions" className="text-input prose" disabled={formLocked} onChange={(event) => edit(() => setConditions(event.target.value))} placeholder="One condition per line" value={conditions} />
            </div>
            <div>
              <div className="field-label">Issues this decision does not resolve</div>
              <textarea aria-label="Issues this decision does not resolve" className="text-input prose" disabled={formLocked} onChange={(event) => edit(() => setNotDecided(event.target.value))} placeholder="One open point per line" value={notDecided} />
              <div className="field-help">Optional. List issues that remain open after this decision.</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div className="field-label">Decided by</div>
              <input aria-label="Decided by" className="text-input" disabled={formLocked} onChange={(event) => edit(() => setDecider(event.target.value))} value={decider} />
            </div>
            <div>
              <div className="field-label">Revisit on</div>
              <input aria-label="Revisit on" className="text-input" disabled={formLocked} onChange={(event) => edit(() => setReviewAt(event.target.value))} type="date" value={reviewAt} />
              <div style={{ marginTop: 6, font: "400 13px var(--sans)", color: "var(--ink-5)" }}>
                {reviewAt ? formatLongDay(reviewAt) : "No review date"}
              </div>
            </div>
          </div>

          <div>
            <div className="field-label">What it rests on</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {linkedBasis.length === 0 ? (
                <span className="faint small">Nothing linked yet.</span>
              ) : null}
              {linkedBasis.map((path) => (
                <span className="basis-tag" key={path} title={path}>
                  {basisLabel(path, basisLabels)}
                  {failedPublicResearch.includes(path) ? " · Public research failed" : ""}
                  <button aria-label={`Remove ${basisLabel(path, basisLabels)}`} disabled={formLocked} onClick={() => edit(() => setLinkedBasis((current) => current.filter((item) => item !== path)))} type="button">×</button>
                </span>
              ))}
            </div>
          </div>

          {error ? <p className="error" style={{ margin: 0 }}>{error}</p> : null}
        </div>

        <div className="modal-foot">
          <span style={{ font: "400 13.5px var(--sans)", color: "var(--ink-4)" }}>
            {recorded ? "Saved and confirmed after the matter reloaded." : created ? "Decision saved. Refresh confirmation is still needed." : uncertainSave ? "The save result is uncertain. Retry uses the same request and action key." : "Recorded against this matter and the decision register."}
          </span>
          <div className="btn-row">
            <button className={recorded ? "btn primary" : "btn"} disabled={busy || uncertainSave} onClick={onClose}>{created ? "Close" : "Cancel"}</button>
            {recorded ? null : (
              <button className="btn primary" disabled={busy || !chosenPath.trim() || !decider.trim() || (historicalBasisRequired && !historicalBasisAccepted) || (recommendationNeedsReason(disposition) && !dispositionReason.trim())} onClick={() => void record()}>
                {busy ? created ? "Refreshing…" : "Recording and refreshing…" : created ? "Retry refresh" : uncertainSave ? "Retry recording" : "Record durable decision"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function defaultReview(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function lines(value: string): string[] {
  return value.split("\n").map((item) => item.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
}

export function submittedMapBasis(basis: DecisionMapBasis, useHistoricalBasis: boolean): DecisionMapBasis {
  const { canonical_option: _canonicalOption, input_basis: _inputBasis, use_historical_basis: _historical, ...identifiers } = basis;
  return useHistoricalBasis ? { ...identifiers, use_historical_basis: true } : identifiers;
}

export function pathConditions(prefill: DecisionPathPrefill): string {
  const rows = [prefill.option.condition_summary.trim()];
  for (const requirement of prefill.option.requirements) {
    const condition = prefill.analysis.conditions.find((item) => item.condition_id === requirement.condition_id);
    rows.push(`${condition?.question || requirement.condition_id} — must be ${requirement.state === "met" ? "met" : "not met"}`);
  }
  return [...new Set(rows.filter(Boolean))].join("\n");
}

function errorMessage(caught: unknown, fallback: string): string {
  if (caught && typeof caught === "object" && "message" in caught && typeof caught.message === "string") return caught.message;
  return fallback;
}

function errorStatus(caught: unknown): number | null {
  if (!caught || typeof caught !== "object" || !("status" in caught) || typeof caught.status !== "number") return null;
  return caught.status;
}

function errorCode(caught: unknown): string | null {
  if (!caught || typeof caught !== "object" || !("detail" in caught) || !caught.detail || typeof caught.detail !== "object" || !("code" in caught.detail) || typeof caught.detail.code !== "string") return null;
  return caught.detail.code;
}

function basisLabel(path: string, labels: Record<string, string>): string {
  if (labels[path]?.trim()) return labels[path].trim();
  const name = path.split("/").at(-1) || path;
  return name.replace(/\.(?:md|pdf|docx)$/i, "").replace(/[-_]+/g, " ");
}
