"use client";

import { FormEvent, useState } from "react";
import { getSettings } from "@/lib/api";

/**
 * Canvas 3b — intake is one bar for a request. The full
 * form only unfolds once you have said what the request is.
 */
export default function NewMatterForm({
  onCreate,
  busy,
}: {
  onCreate: (payload: Record<string, unknown>) => Promise<void>;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [title, setTitle] = useState("");
  const [matterType, setMatterType] = useState("product_change");
  const [priority, setPriority] = useState("normal");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const settings = await getSettings().catch(() => null);
      const reviewRows = settings?.sections.find((section) => section.id === "document-review")?.rows ?? [];
      const legalOwner = reviewRows
        .find((row) => row.config_key === "document_review.lawyer_name")
        ?.value?.trim() ?? "";
      await onCreate({
        title: title || requestText.split("\n")[0].slice(0, 120),
        request_text: requestText,
        matter_type: matterType,
        priority,
        target_date: targetDate || null,
        legal_owner: legalOwner,
        requester: "Product",
        description: requestText.slice(0, 220),
      });
      setTitle("");
      setRequestText("");
      setTargetDate("");
      setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not open the matter.");
    }
  }

  if (!open) {
    return (
      <div className="intake-bar">
        <div
          style={{ flex: 1, minWidth: 0, font: "400 15px/1.5 var(--serif)", color: "var(--ink-5)", cursor: "text" }}
          onClick={() => setOpen(true)}
        >
          Paste a request — a Slack thread, an email, or a redline note…
        </div>
        <button className="btn primary" onClick={() => setOpen(true)}>New matter</button>
      </div>
    );
  }

  return (
    <form className="card card-pad" onSubmit={submit}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <div>
          <h2>Open the matter; orient it next</h2>
          <p style={{ margin: "5px 0 0", font: "400 14px var(--sans)", color: "var(--ink-3)" }}>
            Intake takes the request as it arrived. Everything else can be inferred or corrected later.
          </p>
        </div>
        <button className="btn compact quiet" type="button" onClick={() => setOpen(false)}>Close</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div className="field-label">The request, as it arrived</div>
          <textarea
            aria-label="The request as received"
            autoFocus
            className="text-input prose"
            onChange={(event) => setRequestText(event.target.value)}
            placeholder="Paste the Slack thread, the email, or the redline note…"
            required
            style={{ minHeight: 130 }}
            value={requestText}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
          <div style={{ gridColumn: "span 2" }}>
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
              onChange={(event) => setTargetDate(event.target.value)}
              type="date"
              value={targetDate}
            />
          </div>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <button className="btn primary" disabled={busy || !requestText.trim()} type="submit">
          {busy ? "Creating matter…" : "Create matter and open Chat"}
        </button>
      </div>
    </form>
  );
}
