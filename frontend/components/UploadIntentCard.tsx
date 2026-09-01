"use client";

import { KeyboardEvent, useState } from "react";
import type { AttachmentReference } from "@/lib/types";

export default function UploadIntentCard({ attachments, busy, onSend, onClear }: {
  attachments: AttachmentReference[];
  busy?: boolean;
  onSend: (intent: string) => void | Promise<void>;
  onClear: () => void;
}) {
  const [intent, setIntent] = useState("");
  if (!attachments.length) return null;
  const count = attachments.length;
  const title = count === 1 ? `Added ${attachments[0].name}`
    : count <= 3 ? `Added ${count} files`
    : `Added a set of ${count} files`;
  const prompt = count === 1 ? "What should Themis.ai do with this file?" : "What should Themis.ai do with this set?";

  function submit() {
    if (intent.trim() && !busy) void onSend(intent.trim());
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") { event.preventDefault(); submit(); }
  }

  return (
    <section className="upload-intent-card" aria-label="Uploaded file intent">
      <div className="chat-card-kicker">Sources added</div>
      <div className="chat-card-summary">{title}</div>
      <div className="upload-file-list">{attachments.slice(0, 3).map((item) => item.name).join(" · ")}{count > 3 ? ` · +${count - 3} more` : ""}</div>
      <label htmlFor="upload-intent">{prompt}</label>
      <div className="question-free-text">
        <input className="text-input" disabled={busy} id="upload-intent" onChange={(event) => setIntent(event.target.value)} onKeyDown={keyDown} placeholder="For example, summarize the key issues" value={intent} />
        <button className="btn primary compact" disabled={busy || !intent.trim()} onClick={submit}>Send</button>
      </div>
      <button className="btn tiny quiet" disabled={busy} onClick={onClear}>Remove from this message</button>
    </section>
  );
}
