"use client";

import { FormEvent, useState } from "react";

export default function NewMatterForm({
  onCreate,
  busy,
}: {
  onCreate: (payload: Record<string, unknown>) => Promise<void>;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [requestText, setRequestText] = useState("");
  const [matterType, setMatterType] = useState("product_change");
  const [priority, setPriority] = useState("normal");
  const [targetDate, setTargetDate] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    await onCreate({
      title,
      request_text: requestText,
      matter_type: matterType,
      priority,
      target_date: targetDate || null,
      legal_owner: "Brian Harris",
      requester: "Product Manager",
      description: requestText.slice(0, 220),
    });
    setTitle("");
    setRequestText("");
    setTargetDate("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="button primary" onClick={() => setOpen(true)}>
        + New matter
      </button>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <form className="card form-card" onSubmit={submit}>
        <div className="page-header" style={{ marginBottom: 14 }}>
          <div>
            <div className="eyebrow">Fast intake</div>
            <h2 style={{ marginBottom: 0 }}>Create the matter; orient it next</h2>
          </div>
          <button className="button ghost compact" type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <div className="form-grid">
          <div className="field span-2">
            <label htmlFor="matter-title">Matter title</label>
            <input id="matter-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="matter-type">Matter type</label>
            <select id="matter-type" value={matterType} onChange={(event) => setMatterType(event.target.value)}>
              <option value="product_launch">Product launch</option>
              <option value="product_change">Product change</option>
              <option value="marketing_review">Marketing review</option>
              <option value="privacy_review">Privacy review</option>
              <option value="ai_governance">AI governance</option>
              <option value="regulatory_analysis">Regulatory analysis</option>
              <option value="general_advice">General advice</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="field span-4">
            <label htmlFor="request">Original business request</label>
            <textarea id="request" value={requestText} onChange={(event) => setRequestText(event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="target-date">Target date</label>
            <input id="target-date" type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
          </div>
          <div className="field" style={{ justifyContent: "flex-end" }}>
            <button className="button primary" disabled={busy} type="submit">
              {busy ? "Creating…" : "Create in Intake"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
