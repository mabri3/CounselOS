"use client";

import { useState } from "react";
import { createDecision } from "@/lib/api";
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
  onClose,
  onRecorded,
}: {
  detail: MatterDetail;
  suggestion: string;
  basis: string[];
  onClose: () => void;
  onRecorded: () => Promise<void>;
}) {
  const [chosenPath, setChosenPath] = useState(suggestion);
  const [rationale, setRationale] = useState(detail.orientation.why_now || "");
  const [decider, setDecider] = useState(detail.legal_owner || "");
  const [reviewAt, setReviewAt] = useState(defaultReview());
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [error, setError] = useState("");

  async function record() {
    if (!chosenPath.trim()) { setError("Say what was decided."); return; }
    if (!decider.trim()) { setError("Enter who made the decision."); return; }
    let decisionCreated = created;
    setBusy(true);
    setError("");
    try {
      if (!created) {
        await createDecision({
          matter_id: detail.matter_id,
          title: detail.title,
          chosen_path: chosenPath.trim(),
          rationale: rationale.trim(),
          decision_maker: decider.trim(),
          risk_level: detail.risk_level,
          next_review_at: reviewAt || null,
          linked_paths: basis,
        });
        decisionCreated = true;
        setCreated(true);
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
            <div className="field-label">Decision {suggestion.trim() ? <span className="field-source">Themis draft</span> : null}</div>
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
            <div className="field-label">Rationale {detail.orientation.why_now.trim() ? <span className="field-source">Themis draft</span> : null}</div>
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
              {basis.length === 0 ? (
                <span className="faint small">Nothing linked yet.</span>
              ) : null}
              {basis.map((path) => (
                <span className="basis-tag" key={path}>{path.split("/").at(-1)}</span>
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
