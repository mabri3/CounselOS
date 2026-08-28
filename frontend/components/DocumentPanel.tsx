"use client";

import { DragEvent, useEffect, useState } from "react";
import LinkifiedText from "@/components/LinkifiedText";
import MarkdownRichEditor from "@/components/MarkdownRichEditor";
import { getFile, rawFileUrl, saveFile } from "@/lib/api";
import { parseMemo } from "@/lib/research";
import type { VaultDocument } from "@/lib/types";

/**
 * Canvas 4c — the work surface. A what-you-see editor over a file that stays
 * plain Markdown on disk. Agent-written files remain clearly labelled.
 */
export default function DocumentPanel({
  activePath,
  onUpload,
  onAskAgent,
  onCollapse,
}: {
  activePath: string | null;
  onUpload: (file: File) => Promise<void>;
  onAskAgent?: () => void;
  onCollapse?: () => void;
}) {
  const [document, setDocument] = useState<VaultDocument | null>(null);
  const [mode, setMode] = useState<"editing" | "markdown" | "sources">("editing");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activePath) { setDocument(null); return; }
    setBusy(true);
    setError("");
    void getFile(activePath)
      .then((result) => { setDocument(result); setDirty(false); setMode("editing"); })
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

  if (!activePath) return <div className="doc-pane"><div className="doc-scroll"><div className="empty-state">Select a matter record or document.</div></div></div>;
  if (busy && !document) return <div className="doc-pane"><div className="loading">Loading document…</div></div>;
  if (error && !document) return <div className="doc-pane"><div className="doc-scroll"><p className="error">{error}</p></div></div>;
  if (!document) return null;

  const isMarkdown = document.kind === "markdown" || /\.md$/i.test(document.name);
  const isResearch = isMarkdown && document.path.includes("/research/") && document.name !== "annotations.md";
  const citations = isResearch ? parseMemo(document).citations : [];
  const agentWritten = /^(research|drafts)\//.test(document.path.split("/").slice(2).join("/"))
    || String(document.metadata.author ?? "").toLowerCase().includes("agent");

  return (
    <div className="doc-pane" onDragOver={(event) => event.preventDefault()} onDrop={drop}>
      <div className="doc-bar">
        <div style={{ minWidth: 0 }}>
          <span className="doc-name">{document.name}</span>
          <span className={`doc-status ${agentWritten ? "agent" : ""}`}>
            {agentWritten
              ? dirty ? "Agent draft · unsaved changes" : "Agent draft"
              : dirty ? "Unsaved changes" : "Saved"}
          </span>
        </div>
        <div className="doc-mode">
          {isMarkdown && document.editable ? (
            <>
              <button className={mode === "editing" ? "active" : ""} onClick={() => setMode("editing")} title="Edit the document with formatting controls.">Editing</button>
              <button className={mode === "markdown" ? "active" : ""} onClick={() => setMode("markdown")} title="Edit the Markdown source text directly.">Markdown</button>
              {isResearch ? (
                <button className={mode === "sources" ? "active" : ""} onClick={() => setMode("sources")} title="Review the sources cited in this research document.">Sources</button>
              ) : null}
            </>
          ) : null}
          {onCollapse ? <button aria-label="Collapse document" className="pane-collapse" onClick={onCollapse} title="Collapse document">›</button> : null}
        </div>
      </div>

      {isResearch && mode === "sources" ? (
        <div className="doc-scroll research-sources">
          {citations.length ? citations.map((citation) => (
            <article className="research-source-card" key={citation.id}>
              <div className="research-source-heading">
                <span>{citation.n}</span>
                <strong>{citation.name}</strong>
              </div>
              <div className="research-source-kind"><LinkifiedText text={citation.kind} /></div>
              <div className="source-quote"><LinkifiedText text={citation.quote} /></div>
              <p><LinkifiedText text={citation.note} /></p>
            </article>
          )) : (
            <div className="empty-state">
              <h3>No sources are cited in this research yet.</h3>
              <p className="muted">The research remains editable. Add citations before relying on it as sourced analysis.</p>
            </div>
          )}
        </div>
      ) : isMarkdown && (mode === "editing" || !document.editable) ? (
        <MarkdownRichEditor
          key={document.path}
          markdown={document.content}
          onAskAgent={document.editable ? onAskAgent : undefined}
          readOnly={!document.editable}
          onChange={(content) => {
            setDocument((current) => (current ? { ...current, content } : current));
            setDirty(true);
          }}
        />
      ) : isMarkdown || document.editable ? (
        <div className="doc-scroll">
          <textarea
            aria-label="Raw Markdown"
            className="markdown-source"
            onChange={(event) => { setDocument({ ...document, content: event.target.value }); setDirty(true); }}
            spellCheck
            value={document.content}
          />
        </div>
      ) : (
        <div className="doc-scroll">
          <div className="empty-state">
            <h3>{document.name}</h3>
            <p className="muted" style={{ maxWidth: "48ch", margin: "8px auto 14px" }}>
              The original file is read-only. Open it directly, or select its extracted Markdown companion.
            </p>
            <a className="btn" href={rawFileUrl(document.path)} target="_blank" rel="noreferrer">Open the original</a>
          </div>
        </div>
      )}

      {error ? <p className="error" style={{ margin: "0 34px 12px" }}>{error}</p> : null}

      <div className="doc-bar" style={{ position: "static", borderBottom: 0, borderTop: "1px solid var(--line-soft)" }}>
        <span style={{ font: "400 14px var(--sans)", color: "var(--ink-3)" }}>
          Stored as <span className="mono" style={{ fontSize: 13, color: "var(--ink-4)" }}>{document.name}</span>
          {isMarkdown ? " — the file stays plain Markdown." : "."}
        </span>
        <div className="btn-row">
          <button className="btn primary compact" disabled={!dirty || busy || !document.editable} onClick={() => void save()}>
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
