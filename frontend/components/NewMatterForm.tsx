"use client";

import styles from "@/components/PortfolioPhase2.module.css";
import { FormEvent, useRef, useState } from "react";
import { getSettings, matterTargetDateFromForm } from "@/lib/api";
import type { MatterCreatePayload } from "@/lib/types";

/**
 * Canvas 3b — intake is one bar for a request. The full
 * form only unfolds once you have said what the request is.
 */
export default function NewMatterForm({
  onCreate,
  busy,
}: {
  onCreate: (payload: MatterCreatePayload) => Promise<void>;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [title, setTitle] = useState("");
  const [matterType, setMatterType] = useState("product_change");
  const [priority, setPriority] = useState("normal");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const sourceActionKey = useRef<string | null>(null);
  const submitLocked = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLocked.current) return;
    submitLocked.current = true;
    setSubmitting(true);
    setCreated(false);
    setError("");
    const submittedTargetDate = matterTargetDateFromForm(new FormData(event.currentTarget));
    try {
      const settings = await getSettings().catch(() => null);
      const reviewRows = settings?.sections.find((section) => section.id === "document-review")?.rows ?? [];
      const legalOwner = reviewRows
        .find((row) => row.config_key === "document_review.lawyer_name")
        ?.value?.trim() ?? "";
      sourceActionKey.current ??= `matter-create:form:${crypto.randomUUID()}`;
      await onCreate({
        title: title || requestText.split("\n")[0].slice(0, 120),
        request_text: requestText,
        matter_type: matterType,
        priority,
        target_date: submittedTargetDate,
        legal_owner: legalOwner,
        requester: "Product",
        description: requestText.slice(0, 220),
        source_action_key: sourceActionKey.current,
      });
      setCreated(true);
      sourceActionKey.current = null;
      setTitle("");
      setRequestText("");
      setTargetDate("");
      setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not open the matter.");
    } finally {
      submitLocked.current = false;
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <div>
        {created ? (
          <p role="status" style={{ margin: "0 0 8px", color: "var(--healthy)", font: "600 14px var(--sans)" }}>
            Matter created. Intake is starting.
          </p>
        ) : null}
        <button className={styles.intakeBar} type="button" onClick={() => { setCreated(false); setOpen(true); }}>
          <span className={styles.plus} aria-hidden="true">＋</span>
          <span><strong>Create a new matter</strong><small>Start intake and triage</small></span>
          <span aria-hidden="true">⌄</span>
        </button>
      </div>
    );
  }

  return (
    <form className={styles.intake} onSubmit={submit}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <div>
          <h2>New matter</h2>
          <p style={{ margin: "5px 0 0", font: "400 14px var(--sans)", color: "var(--ink-3)" }}>
            Capture the request so you can organize and decide.
          </p>
        </div>

      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div className="field-label">What needs legal attention? (required)</div>
          <textarea
            aria-label="The request as received"
            autoFocus
            className="text-input prose"
            onChange={(event) => setRequestText(event.target.value)}
            placeholder="Paste the Slack thread, the email, or the redline note…"
            required
            style={{ minHeight: 134 }}
            value={requestText}
          />
        </div>
        <div className={styles.intakeFields}>
          <div className={styles.fullField}>
            <div className="field-label">Matter title</div>
            <input
              aria-label="Matter title"
              className="text-input"
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Left blank, the first line of the request is used"
              value={title}
            />
          </div>
          <div>
            <div className="field-label">Type</div>
            <select aria-label="Matter type" className="select-input" onChange={(event) => setMatterType(event.target.value)} value={matterType}>
              <option value="product_launch">Product launch</option>
              <option value="product_change">Product change</option>
              <option value="marketing_review">Marketing review</option>
              <option value="privacy_review">Privacy review</option>
              <option value="ai_governance">AI governance</option>
              <option value="regulatory_analysis">Regulatory analysis</option>
              <option value="general_advice">General advice</option>
            </select>
          </div>
          <div>
            <div className="field-label">Priority</div>
            <select aria-label="Matter priority" className="select-input" onChange={(event) => setPriority(event.target.value)} value={priority}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <div className="field-label">Target date</div>
            <input
              aria-label="Matter target date"
              className="text-input"
              name="target_date"
              onChange={(event) => setTargetDate(event.target.value)}
              type="date"
              value={targetDate}
            />
          </div>
        </div>
      </div>

      {created ? (
        <p role="status" style={{ color: "var(--healthy)", font: "600 14px var(--sans)" }}>
          Matter created. Intake is starting.
        </p>
      ) : null}
      {error ? <p className="error">{error} You can retry without creating a duplicate.</p> : null}

      <div className={styles.intakeActions}>
        <button className="btn" type="button" onClick={() => setOpen(false)}>Close</button>
        <button className="btn primary" disabled={busy || submitting || !requestText.trim()} type="submit">
          {busy || submitting ? "Creating matter…" : "Create matter and open Chat"}
        </button>
      </div>
    </form>
  );
}
