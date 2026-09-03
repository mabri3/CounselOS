"use client";

import { DragEvent, useEffect, useRef, useState } from "react";
import DocumentReview from "@/components/DocumentReview";
import LinkifiedText from "@/components/LinkifiedText";
import MarkdownRichEditor from "@/components/MarkdownRichEditor";
import { exportFileUrl, getDocumentReview, getFile, rawFileUrl, saveFile, updateDocumentReview } from "@/lib/api";
import { parseMemo } from "@/lib/research";
import type { DocumentReview as ReviewState, DocumentReviewAction, VaultDocument } from "@/lib/types";
import { authorId, GENERATED_REVIEW_AUTHOR, REVIEW_AUTHOR_PALETTE } from "@/lib/reviewAuthor";
import { savedMarkdownMatches } from "@/lib/documentSave";

type SaveState = "clean" | "saving" | "conflict" | "error";

/**
 * Canvas 4c — the work surface. A what-you-see editor over a file that stays
 * plain Markdown on disk. Agent-written files remain clearly labelled.
 */
export default function DocumentPanel({
  activePath,
  onUpload,
  onAskAgent,
  onClose,
  onCollapse,
  activeReviewAuthor,
  lawyerAuthor,
  onReviewAuthorChange,
}: {
  activePath: string | null;
  onUpload: (file: File) => Promise<void>;
  onAskAgent?: () => void;
  onClose?: () => void;
  onCollapse?: () => void;
  activeReviewAuthor: string;
  lawyerAuthor: string;
  onReviewAuthorChange: (name: string) => void;
}) {
  const [document, setDocument] = useState<VaultDocument | null>(null);
  const [review, setReview] = useState<ReviewState | null>(null);
  const [mode, setMode] = useState<"editing" | "markdown" | "review" | "sources">("editing");
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("clean");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [closePromptOpen, setClosePromptOpen] = useState(false);
  const [editorVersion, setEditorVersion] = useState(0);
  const defaultedHumanAuthor = useRef(false);
  const documentRef = useRef<VaultDocument | null>(null);
  documentRef.current = document;

  useEffect(() => {
    const lawyer = lawyerAuthor.trim();
    if (defaultedHumanAuthor.current || !lawyer) return;
    defaultedHumanAuthor.current = true;
    if (!activeReviewAuthor.trim() || ["Themis", GENERATED_REVIEW_AUTHOR].includes(activeReviewAuthor)) {
      onReviewAuthorChange(lawyer);
    }
  }, [activeReviewAuthor, lawyerAuthor, onReviewAuthorChange]);

  useEffect(() => {
    setClosePromptOpen(false);
    if (!activePath) { setDocument(null); return; }
    setBusy(true);
    setError("");
    void loadDocument(activePath)
      .then(({ result, reviewState }) => {
        setDocument(result);
        setReview(reviewState);
        setDirty(false);
        setSaveState("clean");
        setMode("editing");
        setEditorVersion((current) => current + 1);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load the file."))
      .finally(() => setBusy(false));
  }, [activePath]);

  async function loadDocument(path: string): Promise<{ result: VaultDocument; reviewState: ReviewState | null }> {
    let result = await getFile(path);
    if (!result.editable && ["pdf", "docx"].includes(result.kind)) {
      try {
        result = await getFile(`${path}.extracted.md`);
      } catch {
        // Keep the source viewer when no editable companion exists.
      }
    }
    const reviewState = result.kind === "markdown" && result.editable
      ? await getDocumentReview(result.path)
      : null;
    return { result, reviewState };
  }

  async function save(): Promise<boolean> {
    if (!document || !document.editable) return false;
    const submitted = { ...document, metadata: { ...document.metadata } };
    setBusy(true);
    setSaveState("saving");
    setError("");
    try {
      let nextReview: ReviewState | null = null;
      if (review?.tracking) {
        const existing = review.authors.find((item) => item.author_id === authorId(activeReviewAuthor));
        nextReview = await updateDocumentReview(submitted.path, { action: "save_revision", content: submitted.content, author_id: authorId(activeReviewAuthor), author_name: activeReviewAuthor, author_color: existing?.color ?? REVIEW_AUTHOR_PALETTE[review.authors.length % REVIEW_AUTHOR_PALETTE.length] });
      } else if (review) nextReview = await updateDocumentReview(submitted.path, { action: "save_untracked", content: submitted.content });
      else await saveFile(submitted);
      let canonical: VaultDocument;
      try {
        canonical = await getFile(submitted.path);
      } catch {
        setSaveState("conflict");
        setDirty(true);
        setError("The save response returned, but Themis.ai could not verify the saved file. Your local text is still here.");
        return false;
      }
      if (!savedMarkdownMatches(submitted.content, canonical.content)) {
        setSaveState("conflict");
        setDirty(true);
        setError("The saved file differs from this edit. Your local text is still here.");
        return false;
      }
      const current = documentRef.current;
      if (!current || current.path !== submitted.path || current.content !== submitted.content) {
        setSaveState("clean");
        setDirty(true);
        return false;
      }
      setDocument(canonical);
      setDirty(false);
      setSaveState("clean");
      if (canonical.kind === "markdown" && nextReview) setReview(nextReview);
      setEditorVersion((current) => current + 1);
      return true;
    } catch (caught) {
      setSaveState("error");
      setDirty(true);
      setError(caught instanceof Error ? caught.message : "Could not save the file.");
      return false;
    }
    finally { setBusy(false); }
  }

  async function reloadCanonical() {
    if (!document) return;
    if (dirty && !window.confirm("Reload the saved file? This will replace the local edit shown here.")) return;
    setBusy(true);
    setError("");
    try {
      const loaded = await loadDocument(document.path);
      setDocument(loaded.result);
      setReview(loaded.reviewState);
      setDirty(false);
      setSaveState("clean");
      setEditorVersion((current) => current + 1);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not reload the saved file.");
    } finally {
      setBusy(false);
    }
  }

  function requestClose() {
    if (!onClose) return;
    if (dirty) {
      setClosePromptOpen(true);
      return;
    }
    onClose();
  }

  async function saveAndClose() {
    if (await save()) onClose?.();
  }

  async function reviewAction(action: DocumentReviewAction) {
    if (!document) return;
    if (dirty && !await save()) return;
    setBusy(true);
    setError("");
    try {
      const actorName = ["edit_comment", "delete_comment_entry", "resolve_comment", "reopen_comment", "delete_comment_thread", "delete_resolved_comments"].includes(action.action) ? lawyerAuthor : activeReviewAuthor;
      const actorId = authorId(actorName);
      const actor = review?.authors.find((item) => item.author_id === actorId);
      const nextReview = await updateDocumentReview(document.path, { ...action, author_id: action.author_id ?? actorId, author_name: action.author_name ?? actorName, author_color: action.author_color ?? actor?.color ?? REVIEW_AUTHOR_PALETTE[(review?.authors.length ?? 0) % REVIEW_AUTHOR_PALETTE.length] });
      const nextDocument = await getFile(document.path);
      setDocument(nextDocument);
      setReview(nextReview);
      setDirty(false);
      setEditorVersion((current) => current + 1);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update document review.");
    } finally {
      setBusy(false);
    }
  }

  async function exportDocument(format: "docx" | "pdf") {
    if (!document) return;
    if (dirty && !await save()) return;
    const link = window.document.createElement("a");
    link.href = exportFileUrl(document.path, format);
    link.download = "";
    window.document.body.appendChild(link);
    link.click();
    link.remove();
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

  if (!activePath) return null;
  if (busy && !document) return <div className="doc-pane"><div className="loading">Loading document…</div></div>;
  if (error && !document) return <div className="doc-pane"><div className="doc-scroll"><p className="error">{error}</p></div></div>;
  if (!document) return null;

  const isMarkdown = document.kind === "markdown" || /\.md$/i.test(document.name);
  const isResearch = isMarkdown && document.path.includes("/research/") && document.name !== "annotations.md";
  const citations = isResearch ? parseMemo(document).citations : [];
  const agentWritten = /^(research|drafts)\//.test(document.path.split("/").slice(2).join("/"))
    || String(document.metadata.author ?? "").toLowerCase().includes("agent");
  const sourcePath = typeof document.metadata.source_path === "string" ? document.metadata.source_path : null;
  const saveLabel = saveState === "saving"
    ? "Saving…"
    : saveState === "conflict"
      ? "Save conflict — review"
      : dirty ? "Unsaved changes" : "Saved";

  return (
    <div className="doc-pane" onDragOver={(event) => event.preventDefault()} onDrop={drop}>
      <div className="doc-bar">
        <div style={{ minWidth: 0 }}>
          <span className="doc-name">{document.name}</span>
          <span className={`doc-status ${agentWritten ? "agent" : ""}`}>
            {agentWritten ? `Agent draft · ${saveLabel.toLowerCase()}` : saveLabel}
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
          {onClose ? <button aria-label="Close document" className="pane-close" onClick={requestClose} title="Close document" type="button">×</button> : null}
          {onCollapse ? <button aria-label="Collapse document" className="pane-collapse" onClick={onCollapse} title="Collapse document">›</button> : null}
        </div>
      </div>

      {closePromptOpen ? (
        <div className="modal-scrim" onClick={(event) => { if (!busy && event.target === event.currentTarget) setClosePromptOpen(false); }}>
          <div aria-describedby="document-close-description" aria-labelledby="document-close-title" aria-modal="true" className="modal" onKeyDown={(event) => { if (!busy && event.key === "Escape") setClosePromptOpen(false); }} role="alertdialog">
            <div className="modal-head">
              <h3 id="document-close-title">Save changes before closing?</h3>
              <p id="document-close-description">This document has unsaved changes.</p>
            </div>
            <div className="modal-foot">
              <span />
              <div className="btn-row">
                <button autoFocus className="btn" disabled={busy} onClick={() => setClosePromptOpen(false)} type="button">Cancel</button>
                <button className="btn" disabled={busy} onClick={onClose} type="button">Close without saving</button>
                <button className="btn primary" disabled={busy} onClick={() => void saveAndClose()} type="button">{busy ? "Saving…" : "Save and close"}</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
      ) : isMarkdown && (mode === "editing" || !document.editable) ? review ? (
        <DocumentReview
          author={review.authors.find((item) => item.author_id === authorId(activeReviewAuthor)) ?? { author_id: authorId(activeReviewAuthor), name: activeReviewAuthor, color: REVIEW_AUTHOR_PALETTE[review.authors.length % REVIEW_AUTHOR_PALETTE.length] }}
          busy={busy}
          key={document.path}
          lawyerAuthor={lawyerAuthor}
          lawyerAuthorId={authorId(lawyerAuthor)}
          onAction={reviewAction}
          onAuthorChange={onReviewAuthorChange}
          readOnly={!document.editable}
          review={review}
        >{({ mode: reviewMode, reviewers, onAddComment, onOpenThread, onSelectionContext }) => <MarkdownRichEditor
          key={`${document.path}-${editorVersion}`}
          markdown={document.content}
          onAddComment={onAddComment}
          onAskAgent={document.editable ? onAskAgent : undefined}
          onOpenCommentThread={onOpenThread}
          onSelectionContext={onSelectionContext}
          readOnly={!document.editable}
          reviewComments={review.comments}
          reviewMode={reviewMode}
          reviewReviewers={reviewers}
          reviewSegments={review.segments}
          reviewTracking={review.tracking}
          reviewAuthor={review.authors.find((item) => item.author_id === authorId(activeReviewAuthor)) ?? { author_id: authorId(activeReviewAuthor), name: activeReviewAuthor, color: REVIEW_AUTHOR_PALETTE[review.authors.length % REVIEW_AUTHOR_PALETTE.length] }}
          onChange={(content) => {
            setDocument((current) => (current ? { ...current, content } : current));
            setDirty(true);
          }}
        />}</DocumentReview>
      ) : <MarkdownRichEditor key={document.path} markdown={document.content} readOnly />
      : isMarkdown || document.editable ? (
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
      {saveState === "conflict" ? (
        <div className="notice-card wash-attention" style={{ margin: "0 34px 12px" }}>
          <strong>Save conflict — review</strong>
          <p>Your local text is still available. Retry the save, or reload the canonical saved file.</p>
          <div className="btn-row">
            <button className="btn compact" disabled={busy} onClick={() => void save()} type="button">Retry save</button>
            <button className="btn compact" disabled={busy} onClick={() => void reloadCanonical()} type="button">Reload canonical</button>
          </div>
        </div>
      ) : null}

      <div className="doc-bar" style={{ position: "static", borderBottom: 0, borderTop: "1px solid var(--line-soft)" }}>
        <div className="review-footer-status">
          <span>{saveLabel}</span>
          {isMarkdown && review ? (
            <span className="track-toggle">Redline {review.tracking ? "on" : "off"}</span>
          ) : null}
        </div>
        <div className="btn-row">
          {isMarkdown ? (
            <>
              {sourcePath ? <a className="btn compact" href={rawFileUrl(sourcePath)} rel="noreferrer" target="_blank">Original</a> : null}
              <button className="btn compact" disabled={busy} onClick={() => void exportDocument("docx")} type="button">Word</button>
              <button className="btn compact" disabled={busy} onClick={() => void exportDocument("pdf")} type="button">PDF</button>
            </>
          ) : null}
          <button className="btn primary compact" disabled={!dirty || busy || !document.editable} onClick={() => void save()}>
            {busy ? "Saving…" : dirty && review?.tracking ? "Save redline" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
