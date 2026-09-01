"use client";

import { useEffect, useRef, useState } from "react";
import { createDecision, getDecisions, getFile } from "@/lib/api";
import { formatLongDay } from "@/lib/design";
import type { MatterDetail } from "@/lib/types";

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
  onClose,
  onRecorded,
}: {
  detail: MatterDetail;
  suggestion: string;
  basis: string[];
  basisLabels?: Record<string, string>;
  lawyerAuthor?: string;
  onClose: () => void;
  onRecorded: () => Promise<void>;
}) {
  const initialDecision = suggestion.trim();
  const [chosenPath, setChosenPath] = useState(initialDecision);
  const [rationale, setRationale] = useState("");
  const [conditions, setConditions] = useState("");
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
  const sourceActionKey = useRef<string | null>(null);

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
    let decisionCreated = created;
    let decisionId = createdId;
    setBusy(true);
    setError("");
    try {
      if (!created) {
        sourceActionKey.current ||= `decision:ui:${crypto.randomUUID()}`;
        const saved = await createDecision({
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
        });
        decisionCreated = true;
        decisionId = saved.decision_id;
        setCreated(true);
        setCreatedId(saved.decision_id);
      }
      const register = await getDecisions();
      if (!decisionId || !register.decisions.some((decision) => decision.decision_id === decisionId)) {
        throw new Error("The decision file was saved, but it is not yet visible in the decision register. Retry confirmation.");
      }
      await onRecorded();
      setRecorded(true);
      setBusy(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : decisionCreated ? "The decision was saved, but the matter did not refresh." : "Could not record the decision.");
      setBusy(false);
    }
  }

  return (
    <div className="modal-scrim" onClick={(event) => { if (!busy && event.target === event.currentTarget) onClose(); }}>
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
              disabled={busy || created || recorded}
              onChange={(event) => setChosenPath(event.target.value)}
              style={{ minHeight: 96 }}
              value={chosenPath}
            />
          </div>

          <div>
            <div className="field-label">Rationale</div>
            <textarea
              aria-label="Rationale"
              className="text-input prose"
              disabled={busy || created || recorded}
              onChange={(event) => setRationale(event.target.value)}
              style={{ minHeight: 88 }}
              value={rationale}
            />
            <div className="field-help">Optional. Explain why this decision was made.</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div className="field-label">Conditions</div>
              <textarea aria-label="Conditions" className="text-input prose" disabled={busy || created || recorded} onChange={(event) => setConditions(event.target.value)} placeholder="One condition per line" value={conditions} />
            </div>
            <div>
              <div className="field-label">Not decided</div>
              <textarea aria-label="Not decided" className="text-input prose" disabled={busy || created || recorded} onChange={(event) => setNotDecided(event.target.value)} placeholder="One open point per line" value={notDecided} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div className="field-label">Decided by</div>
              <input aria-label="Decided by" className="text-input" disabled={busy || created || recorded} onChange={(event) => setDecider(event.target.value)} value={decider} />
            </div>
            <div>
              <div className="field-label">Revisit on</div>
              <input aria-label="Revisit on" className="text-input" disabled={busy || created || recorded} onChange={(event) => setReviewAt(event.target.value)} type="date" value={reviewAt} />
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
                  <button aria-label={`Remove ${basisLabel(path, basisLabels)}`} disabled={busy || created || recorded} onClick={() => setLinkedBasis((current) => current.filter((item) => item !== path))} type="button">×</button>
                </span>
              ))}
            </div>
          </div>

          {error ? <p className="error" style={{ margin: 0 }}>{error}</p> : null}
        </div>

        <div className="modal-foot">
          <span style={{ font: "400 13.5px var(--sans)", color: "var(--ink-4)" }}>
            {recorded ? "Saved and confirmed after the matter reloaded." : created ? "Decision saved. Refresh confirmation is still needed." : "Recorded against this matter and the decision register."}
          </span>
          <div className="btn-row">
            <button className={recorded ? "btn primary" : "btn"} disabled={busy} onClick={onClose}>{created ? "Close" : "Cancel"}</button>
            {recorded ? null : (
              <button className="btn primary" disabled={busy || !chosenPath.trim() || !decider.trim()} onClick={() => void record()}>
                {busy ? created ? "Refreshing…" : "Recording and refreshing…" : created ? "Retry refresh" : "Record durable decision"}
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

function basisLabel(path: string, labels: Record<string, string>): string {
  if (labels[path]?.trim()) return labels[path].trim();
  const name = path.split("/").at(-1) || path;
  return name.replace(/\.(?:md|pdf|docx)$/i, "").replace(/[-_]+/g, " ");
}
