"use client";

import { useState } from "react";

type Props = {
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
};

/** A small explicit confirmation surface for actions that change saved state. */
export default function ConfirmationDialog({
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const titleId = "confirmation-dialog-title";
  const descriptionId = "confirmation-dialog-description";

  async function confirm() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onCancel();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not complete this action. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-scrim" onClick={(event) => { if (!busy && event.target === event.currentTarget) onCancel(); }}>
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="modal"
        onKeyDown={(event) => { if (!busy && event.key === "Escape") onCancel(); }}
        role="alertdialog"
      >
        <div className="modal-head">
          <h3 id={titleId}>{title}</h3>
          <p id={descriptionId}>{description}</p>
        </div>
        <div className="modal-foot">
          <span>{error ? <span className="error" role="alert">{error}</span> : null}</span>
          <div className="btn-row">
            <button className="btn" disabled={busy} onClick={onCancel} type="button">Cancel</button>
            <button autoFocus className="btn primary" disabled={busy} onClick={() => void confirm()} type="button">
              {busy ? "Working…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
