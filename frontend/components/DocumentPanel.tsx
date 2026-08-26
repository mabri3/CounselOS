"use client";

import { DragEvent, useEffect, useState } from "react";
import MarkdownRichEditor from "@/components/MarkdownRichEditor";
import { getFile, rawFileUrl, saveFile } from "@/lib/api";
import type { VaultDocument } from "@/lib/types";

export default function DocumentPanel({
  activePath,
  onUpload,
}: {
  activePath: string | null;
  onUpload: (file: File) => Promise<void>;
}) {
  const [document, setDocument] = useState<VaultDocument | null>(null);
  const [mode, setMode] = useState<"formatted" | "markdown">("formatted");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activePath) { setDocument(null); return; }
    setBusy(true);
    setError("");
    void getFile(activePath)
      .then((result) => { setDocument(result); setDirty(false); setMode("formatted"); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load the file."))
      .finally(() => setBusy(false));
  }, [activePath]);

  async function save() {
    if (!document || !document.editable) return;
    setBusy(true);
    try { await saveFile(document); setDirty(false); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save the file."); }
    finally { setBusy(false); }
  }

  async function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (document?.editable && /\.(md|txt)$/i.test(file.name)) {
      const text = await file.text();
      setDocument({ ...document, content: `${document.content.trimEnd()}\n\n${text}\n` });
      setDirty(true);
      return;
    }
    await onUpload(file);
  }

  if (!activePath) return <div className="empty-state">Select a matter record or document from the tree.</div>;
  if (busy && !document) return <div className="loading">Loading document…</div>;
  if (error && !document) return <div className="empty-state error">{error}</div>;
  if (!document) return null;

  const metadata = Object.entries(document.metadata).slice(0, 8);
  const isMarkdown = document.kind === "markdown" || /\.md$/i.test(document.name);
  return (
    <div className="document-wrap" onDragOver={(event) => event.preventDefault()} onDrop={drop}>
      {metadata.length ? (
        <div className="metadata-strip">
          {metadata.map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value ?? "")}`).join("  ·  ")}
        </div>
      ) : null}
      {isMarkdown ? (
        mode === "formatted" || !document.editable ? (
          <MarkdownRichEditor
            key={document.path}
            markdown={document.content}
            readOnly={!document.editable}
            onChange={(content) => {
              setDocument((current) => current ? { ...current, content } : current);
              setDirty(true);
            }}
          />
        ) : (
          <textarea
            className="editor"
            aria-label="Raw Markdown"
            value={document.content}
            onChange={(event) => { setDocument({ ...document, content: event.target.value }); setDirty(true); }}
            spellCheck
          />
        )
      ) : document.editable ? (
        <textarea
          className="editor"
          aria-label="Text document"
          value={document.content}
          onChange={(event) => { setDocument({ ...document, content: event.target.value }); setDirty(true); }}
          spellCheck
        />
      ) : (
        <div className="empty-state">
          <div>
            <h2>{document.name}</h2>
            <p className="muted">The native file is read-only in the MVP. Open it directly or select its extracted Markdown companion.</p>
            <a className="button" href={rawFileUrl(document.path)} target="_blank" rel="noreferrer">Open original</a>
          </div>
        </div>
      )}
      {error ? <div className="error small" style={{ padding: "8px 12px" }}>{error}</div> : null}
      {document.editable ? (
        <div className="pane-header" style={{ borderTop: "1px solid var(--line-soft)", borderBottom: 0 }}>
          <span className="small muted">{dirty ? "Unsaved changes" : "Saved"}</span>
          <div className="document-toolbar">
            {isMarkdown ? (
              <div className="mode-toggle" aria-label="Editor mode">
                <button className={`button compact ${mode === "formatted" ? "active" : ""}`} aria-pressed={mode === "formatted"} onClick={() => setMode("formatted")}>Formatted</button>
                <button className={`button compact ${mode === "markdown" ? "active" : ""}`} aria-pressed={mode === "markdown"} onClick={() => setMode("markdown")}>Markdown</button>
              </div>
            ) : null}
            <button className="button primary compact" disabled={!dirty || busy} onClick={() => void save()}>{busy ? "Saving…" : "Save"}</button>
          </div>
        </div>
      ) : isMarkdown ? <div className="read-only-status small muted">Read-only Markdown</div> : null}
    </div>
  );
}
