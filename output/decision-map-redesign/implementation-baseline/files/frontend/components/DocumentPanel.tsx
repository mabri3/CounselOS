"use client";

import { DragEvent, useEffect, useRef, useState } from "react";
import DocumentReview from "@/components/DocumentReview";
import LinkifiedText from "@/components/LinkifiedText";
import MarkdownRichEditor from "@/components/MarkdownRichEditor";
import { exportFileUrl, getDocumentReview, getFile, rawFileUrl, saveFile, updateDocumentReview } from "@/lib/api";
import { discardLocalEditorSnapshot, documentVersionKey, freezeDocumentTarget, mutationBasisForSnapshot, readLocalEditorSnapshot, recoverableLocalEditorSnapshot, sameDocumentTarget, snapshotForDocument, writeLocalEditorSnapshot } from "@/lib/documentNavigation";
import { parseMemo } from "@/lib/research";
import type { DocumentIdentity, DocumentPanelProps, LocalEditorSnapshot, SelectedRange } from "@/lib/workspaceTypes";
import type { DocumentReview as ReviewState, DocumentReviewAction, VaultDocument } from "@/lib/types";
import { authorId, GENERATED_REVIEW_AUTHOR, REVIEW_AUTHOR_PALETTE } from "@/lib/reviewAuthor";
import { savedMarkdownMatches } from "@/lib/documentSave";
import styles from "@/components/workspace/MatterDocuments.module.css";

type SaveState = "clean" | "saving" | "conflict" | "error";
type MutationBasis = { base_revision: string; review_revision?: string };
type ReferenceAwareDocumentPanelProps = DocumentPanelProps & { documents?: DocumentIdentity[] };

/**
 * Canvas 4c — the work surface. A what-you-see editor over a file that stays
 * plain Markdown on disk. Agent-written files remain clearly labelled.
 */
export default function DocumentPanel({
  activeDocument,
  activePath,
  contextKey,
  humanActor,
  refreshSignal = 0,
  localEdit,
  actionTargetDocumentId,
  referenceTarget,
  documents = [],
  onSnapshot,
  onSaved,
  onUpload,
  onAskAgent,
  onOpenReference,
  onClose,
  onCollapse,
  activeReviewAuthor,
  lawyerAuthor,
  onReviewAuthorChange,
}: ReferenceAwareDocumentPanelProps) {
  const [document, setDocument] = useState<VaultDocument | null>(null);
  const [review, setReview] = useState<ReviewState | null>(null);
  const [mode, setMode] = useState<"editing" | "markdown" | "review" | "sources">("editing");
  const [exportMode, setExportMode] = useState<"markup" | "accepted_text">("markup");
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("clean");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editorVersion, setEditorVersion] = useState(0);
  const cachedEdits = useRef(new Map<string, { document: VaultDocument; review: ReviewState | null; dirty: boolean; range: SelectedRange | null }>());
  const mutationBases = useRef(new Map<string, MutationBasis>());
  const loadVersion = useRef(0);
  const reviewRef = useRef<ReviewState | null>(null);
  reviewRef.current = review;
  const [savedChangesAvailable, setSavedChangesAvailable] = useState(false);
  const [selectedRange, setSelectedRange] = useState<SelectedRange | null>(null);
  const defaultedHumanAuthor = useRef(false);
  const documentRef = useRef<VaultDocument | null>(null);
  documentRef.current = document;
  const activeIdentity: DocumentIdentity | null = activeDocument ?? (activePath ? {
    document_id: activePath,
    path: activePath,
    title: activePath.split("/").at(-1) || activePath,
    kind: "work_product",
    revision: "",
    lifecycle_state: "editing_draft",
    editable: true,
    immutable: false,
  } : null);
  const activeIdentityRef = useRef<DocumentIdentity | null>(activeIdentity);
  activeIdentityRef.current = activeIdentity;

  const editingAuthorId = humanActor?.person_id ?? authorId(activeReviewAuthor);
  const editingAuthorName = humanActor?.display_name ?? activeReviewAuthor;
  const lawyerAuthorId = humanActor?.person_id ?? authorId(lawyerAuthor);

  function basisFor(identity: DocumentIdentity, savedReview: ReviewState | null): MutationBasis {
    return mutationBases.current.get(documentVersionKey(identity)) ?? {
      base_revision: savedReview?.artifact_revision || identity.revision,
      review_revision: savedReview?.revision ?? undefined,
    };
  }

  useEffect(() => {
    const lawyer = lawyerAuthor.trim();
    if (defaultedHumanAuthor.current || !lawyer) return;
    defaultedHumanAuthor.current = true;
    if (!activeReviewAuthor.trim() || ["Themis", GENERATED_REVIEW_AUTHOR].includes(activeReviewAuthor)) {
      onReviewAuthorChange(lawyer);
    }
  }, [activeReviewAuthor, lawyerAuthor, onReviewAuthorChange]);

  function rememberDocument(savedDocument: VaultDocument, savedReview: ReviewState | null, isDirty: boolean, range: SelectedRange | null, recoverable = false, frozenIdentity = activeIdentityRef.current) {
    const identity = frozenIdentity;
    const cacheKey = identity ? documentVersionKey(identity) : savedDocument.path;
    cachedEdits.current.set(cacheKey, { document: savedDocument, review: savedReview, dirty: isDirty, range });
    if (identity && !isDirty) mutationBases.current.set(cacheKey, { base_revision: savedReview?.artifact_revision || identity.revision, review_revision: savedReview?.revision ?? undefined });
    if (!contextKey || !identity || identity.path !== savedDocument.path) return;
    const basis = basisFor(identity, savedReview);
    const snapshot: LocalEditorSnapshot = { document_id: identity.document_id, path: identity.path, content: savedDocument.content, base_revision: basis.base_revision, review_revision: basis.review_revision, dirty: isDirty, selected_range: range, recoverable, updated_at: new Date().toISOString() };
    if (isDirty) writeLocalEditorSnapshot(localStorage, contextKey, snapshot);
    else {
      const stored = readLocalEditorSnapshot(localStorage, contextKey, identity.document_id);
      if (stored?.path === identity.path) discardLocalEditorSnapshot(localStorage, contextKey, identity.document_id);
    }
  }

  useEffect(() => {
    if (!document) return;
    const identity = activeIdentityRef.current;
    if (!identity || identity.path !== document.path) return;
    rememberDocument(document, review, dirty, selectedRange);
    const basis = basisFor(identity, review);
    onSnapshot?.({ document_id: identity.document_id, path: identity.path, content: document.content, base_revision: basis.base_revision, review_revision: basis.review_revision, dirty, selected_range: selectedRange, recoverable: false, updated_at: new Date().toISOString() });
  }, [document, review, dirty, selectedRange, onSnapshot, activeDocument?.document_id, activeDocument?.path, activeDocument?.revision]);

  useEffect(() => {
    let current = true;
    const version = ++loadVersion.current;
    setSavedChangesAvailable(false);
    if (!activePath) { setDocument(null); return; }
    const identity = activeIdentityRef.current;
    const cacheKey = identity ? documentVersionKey(identity) : activePath;
    const recoveredSnapshot = snapshotForDocument(identity, localEdit)
      ?? (contextKey && identity ? snapshotForDocument(identity, readLocalEditorSnapshot(localStorage, contextKey, identity.document_id)) : null);
    const cached = cachedEdits.current.get(cacheKey);
    if (cached?.dirty) {
      setDocument(cached.document); setReview(cached.review); setDirty(true); setSelectedRange(cached.range);
    }
    if (!cached?.dirty && recoveredSnapshot) {
      setDocument(null);
      setDirty(true);
      setSelectedRange(recoveredSnapshot.selected_range);
    }
    if (!cached?.dirty) { setDocument(null); setReview(null); setBusy(true); }
    setError("");
    void loadDocument(activePath).then(({ result, reviewState }) => {
      if (!current || version !== loadVersion.current) return;
      const latestIdentity = activeIdentityRef.current;
      const newer = cachedEdits.current.get(cacheKey) || cached;
      if (newer?.dirty) {
        const localBasis = latestIdentity ? basisFor(latestIdentity, newer.review) : { base_revision: newer.review?.artifact_revision ?? "", review_revision: newer.review?.revision };
        setSavedChangesAvailable(localBasis.base_revision !== (reviewState?.artifact_revision || latestIdentity?.revision || "") || localBasis.review_revision !== reviewState?.revision);
        return;
      }
      const restored = snapshotForDocument(latestIdentity, recoveredSnapshot);
      if (restored) {
        const localDocument = { ...result, content: restored.content };
        const restoredBasis = mutationBasisForSnapshot(restored);
        mutationBases.current.set(cacheKey, { base_revision: restoredBasis.expected_revision, review_revision: restoredBasis.expected_review_revision });
        cachedEdits.current.set(cacheKey, { document: localDocument, review: reviewState, dirty: true, range: restored.selected_range });
        setDocument(localDocument); setReview(reviewState); setDirty(true); setSelectedRange(restored.selected_range);
        setSavedChangesAvailable(Boolean(restored.base_revision && restored.base_revision !== (reviewState?.artifact_revision || latestIdentity?.revision)) || Boolean(restored.review_revision && restored.review_revision !== reviewState?.revision));
        setSaveState("clean"); setMode("editing"); setEditorVersion(value => value + 1);
        return;
      }
      rememberDocument(result, reviewState, false, null);
      setDocument(result); setReview(reviewState); setDirty(false); setSelectedRange(null);
      setSaveState("clean"); setMode("editing"); setEditorVersion(value => value + 1);
    }).catch(cause => { if (current && version === loadVersion.current) setError(cause instanceof Error ? cause.message : "Could not load the file."); })
      .finally(() => { if (current && version === loadVersion.current) setBusy(false); });
    return () => { current = false; ++loadVersion.current; };
  }, [activePath, activeDocument?.document_id, activeDocument?.path, activeDocument?.revision, refreshSignal, contextKey, localEdit?.document_id, localEdit?.path]);

  async function loadDocument(path: string): Promise<{ result: VaultDocument; reviewState: ReviewState | null }> {
    let result = await getFile(path);
    if (result.kind !== "markdown" || (path.includes("/documents/") && result.metadata.record_type !== "work_product" && !path.endsWith(".extracted.md"))) {
      try {
        const companion = await getFile(`${path}.extracted.md`);
        const reviewState = await getDocumentReview(companion.path);
        return { result: { ...result, editable: false }, reviewState };
      } catch {
        // Original bytes stay visible even when no editable companion is available.
      }
    }
    const reviewState = result.kind === "markdown" && result.editable
      ? await getDocumentReview(result.path)
      : null;
    if (reviewState && !savedMarkdownMatches(result.content, reviewState.segments.filter(segment => segment.kind !== "delete").map(segment => segment.text).join(""))) {
      throw new Error("The saved file changed while it loaded. Reload to get its latest text and review together.");
    }
    return { result, reviewState };
  }

  async function save(): Promise<boolean> {
    const submittedIdentity = activeIdentityRef.current;
    if (!document || !document.editable || submittedIdentity?.immutable || submittedIdentity?.editable === false) return false;
    const frozenTarget = submittedIdentity ? freezeDocumentTarget(submittedIdentity) : null;
    const targetIsActive = () => frozenTarget ? sameDocumentTarget(frozenTarget, activeIdentityRef.current) : documentRef.current?.path === document.path;
    const submitted = { ...document, metadata: { ...document.metadata } };
    const frozenBasis = submittedIdentity ? basisFor(submittedIdentity, review) : { base_revision: review?.artifact_revision ?? "", review_revision: review?.revision };
    const latestBaseRevision = review?.artifact_revision || submittedIdentity?.revision || "";
    if (frozenBasis.base_revision !== latestBaseRevision || frozenBasis.review_revision !== review?.revision) {
      setSaveState("conflict");
      setDirty(true);
      setError("The saved file changed after this local edit began. Your local text is still here. Reload the saved file only when you are ready to discard or reapply it.");
      return false;
    }
    const basis = { expected_revision: frozenBasis.base_revision, expected_review_revision: frozenBasis.review_revision };
    ++loadVersion.current;
    setBusy(true);
    setSaveState("saving");
    setError("");
    try {
      let nextReview: ReviewState | null = null;
      if (review?.tracking) {
        const existing = review.authors.find((item) => item.author_id === editingAuthorId);
        nextReview = await updateDocumentReview(submitted.path, { ...basis, action: "save_revision", content: submitted.content, author_id: editingAuthorId, author_name: editingAuthorName, author_color: existing?.color ?? REVIEW_AUTHOR_PALETTE[review.authors.length % REVIEW_AUTHOR_PALETTE.length] });
      } else if (review) nextReview = await updateDocumentReview(submitted.path, { ...basis, action: "save_untracked", content: submitted.content });
      else await saveFile(submitted);
      let canonical: VaultDocument;
      try {
        canonical = await getFile(submitted.path);
      } catch {
        if (targetIsActive()) {
          setSaveState("conflict");
          setDirty(true);
          setError("The save response returned, but Themis.ai could not verify the saved file. Your local text is still here.");
        }
        return false;
      }
      if (!savedMarkdownMatches(submitted.content, canonical.content)) {
        if (targetIsActive()) {
          setSaveState("conflict");
          setDirty(true);
          setError("The saved file differs from this edit. Your local text is still here.");
        }
        return false;
      }
      const current = documentRef.current;
      if (!current || current.path !== submitted.path) {
        const cacheKey = submittedIdentity ? documentVersionKey(submittedIdentity) : submitted.path;
        const cached = cachedEdits.current.get(cacheKey);
        if (cached?.document.content === submitted.content) rememberDocument(canonical, nextReview, false, null, false, submittedIdentity);
        return false;
      }
      if (current?.path === submitted.path && nextReview) {
        reviewRef.current = nextReview;
        setReview(nextReview);
      }
      if (current.content !== submitted.content) {
        if (current?.path === submitted.path) rememberDocument(current, nextReview, true, selectedRange, false, submittedIdentity);
        setSaveState("clean");
        setDirty(true);
        return false;
      }
      rememberDocument(canonical, nextReview, false, null, false, submittedIdentity);
      documentRef.current = canonical;
      setDocument(canonical);
      setDirty(false);
      setSelectedRange(null);
      setSavedChangesAvailable(false);
      setSaveState("clean");
      if (canonical.kind === "markdown" && nextReview) setReview(nextReview);
      setEditorVersion((current) => current + 1);
      const savedRevision = nextReview?.artifact_revision || (typeof canonical.metadata.revision === "string" ? canonical.metadata.revision : submittedIdentity?.revision);
      if (submittedIdentity && savedRevision && savedRevision !== submittedIdentity.revision) onSaved?.({ ...submittedIdentity, revision: savedRevision });
      else onSaved?.();
      return true;
    } catch (caught) {
      if (targetIsActive()) {
        setSaveState("error");
        setDirty(true);
        setError(caught instanceof Error ? caught.message : "Could not save the file.");
      }
      return false;
    }
    finally { setBusy(false); }
  }

  async function reloadCanonical() {
    if (!document) return;
    if (dirty && !window.confirm("Discard your local changes and load the latest saved file? Copy any text you want to keep before you continue.")) return;
    const submitted = documentRef.current;
    const version = ++loadVersion.current;
    setBusy(true);
    setError("");
    try {
      const loaded = await loadDocument(document.path);
      if (version !== loadVersion.current) return;
      if (documentRef.current !== submitted) {
        setError("Your local text changed while the saved file loaded. It is still here. Reload again when you are ready.");
        return;
      }
      rememberDocument(loaded.result, loaded.reviewState, false, null);
      documentRef.current = loaded.result;
      reviewRef.current = loaded.reviewState;
      setSavedChangesAvailable(false);
      setSelectedRange(null);
      setMode("editing");
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
      const identity = activeIdentityRef.current;
      if (document && identity) {
        rememberDocument(document, review, true, selectedRange, true, identity);
        const basis = basisFor(identity, review);
        onSnapshot?.(recoverableLocalEditorSnapshot({ document_id: identity.document_id, path: identity.path, content: document.content, base_revision: basis.base_revision, review_revision: basis.review_revision, dirty: true, selected_range: selectedRange }));
      }
      setDocument(null);
      onClose();
      return;
    }
    onClose();
  }

  async function reviewAction(action: DocumentReviewAction) {
    if (!document) return;
    const requestedDocument = documentRef.current;
    const requestedIdentity = activeIdentityRef.current;
    if (dirty && !await save()) return;
    const submitted = documentRef.current?.path === requestedDocument?.path ? documentRef.current : null;
    const submittedIdentity = requestedIdentity;
    const frozenTarget = submittedIdentity ? freezeDocumentTarget(submittedIdentity) : null;
    if (!submitted) return;
    ++loadVersion.current;
    setBusy(true);
    setError("");
    try {
      const actorName = ["edit_comment", "delete_comment_entry", "resolve_comment", "reopen_comment", "delete_comment_thread", "delete_resolved_comments"].includes(action.action) ? lawyerAuthor : activeReviewAuthor;
      const actorId = humanActor?.person_id ?? authorId(actorName);
      const actor = review?.authors.find((item) => item.author_id === actorId);
      const frozenBasis = submittedIdentity ? basisFor(submittedIdentity, reviewRef.current) : { base_revision: reviewRef.current?.artifact_revision ?? "", review_revision: reviewRef.current?.revision };
      const basis = reviewRef.current;
      const nextReview = await updateDocumentReview(submitted.path, { ...action, expected_revision: frozenBasis.base_revision, expected_review_revision: frozenBasis.review_revision, author_id: action.author_id ?? actorId, author_name: humanActor?.display_name ?? action.author_name ?? actorName, author_color: action.author_color ?? actor?.color ?? REVIEW_AUTHOR_PALETTE[(review?.authors.length ?? 0) % REVIEW_AUTHOR_PALETTE.length] });
      const nextDocument = await getFile(submitted.path);
      const current = documentRef.current;
      if (!current || current.path !== submitted.path) return;
      if (current.content !== submitted.content) {
        // These edits started against the prior review. Keep that base so a
        // later save cannot silently overwrite the completed review action.
        const cacheKey = submittedIdentity ? documentVersionKey(submittedIdentity) : current.path;
        rememberDocument(current, basis, true, cachedEdits.current.get(cacheKey)?.range ?? null, false, submittedIdentity);
        setDirty(true);
        setSavedChangesAvailable(true);
        setError("Your review action was saved. Your newer local text is still here. Reload the saved file when you are ready to review it.");
        return;
      }
      rememberDocument(nextDocument, nextReview, false, null, false, submittedIdentity);
      documentRef.current = nextDocument;
      reviewRef.current = nextReview;
      setSavedChangesAvailable(false);
      setSelectedRange(null);
      setDocument(nextDocument);
      setReview(nextReview);
      setDirty(false);
      setEditorVersion((current) => current + 1);
    } catch (caught) {
      if (!frozenTarget || sameDocumentTarget(frozenTarget, activeIdentityRef.current)) {
        setError(caught instanceof Error ? caught.message : "Could not update document review.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function exportDocument(format: "docx" | "pdf") {
    if (!document) return;
    const submitted = { path: document.path, document_id: activeIdentityRef.current?.document_id };
    if (dirty && !await save()) return;
    const link = window.document.createElement("a");
    const savedReview = await getDocumentReview(submitted.path);
    link.href = exportFileUrl(submitted.path, format, { mode: exportMode, expected_revision: savedReview.artifact_revision, expected_review_revision: savedReview.revision });
    link.download = "";
    window.document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (document?.editable && activeIdentityRef.current?.editable !== false && !activeIdentityRef.current?.immutable && /\.(md|txt)$/i.test(file.name)) {
      const text = await file.text();
      setDocument({ ...document, content: `${document.content.trimEnd()}\n\n${text}\n` });
      setDirty(true);
      return;
    }
    await onUpload(file);
  }

  if (!activePath) return null;
  if (busy && !document) return <div className={`doc-pane ${styles.panel}`}><div className="loading">Loading document…</div></div>;
  if (error && !document) return <div className={`doc-pane ${styles.panel}`}><div className="doc-scroll"><p className="error">{error}</p></div></div>;
  if (!document) return null;

  const isMarkdown = document.kind === "markdown" || /\.md$/i.test(document.name);
  const canEdit = document.editable && activeIdentity?.editable !== false && !activeIdentity?.immutable;
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
    <div className={`doc-pane ${styles.panel}`} onDragOver={(event) => event.preventDefault()} onDrop={drop}>

      <div className="doc-bar">
        <div style={{ minWidth: 0 }}>
          <span className="doc-name">{canEdit ? "Editing: " : "Reading: "}{activeIdentity?.title || document.name}</span>
          <span className={`doc-status ${agentWritten ? "agent" : ""}`}>
            {activeIdentity?.lifecycle_state === "reading_source" ? "Reading source · Read-only"
              : activeIdentity?.lifecycle_state === "approved" ? "Approved · Read-only"
                : activeIdentity?.lifecycle_state === "final" ? "Final · Read-only"
                  : agentWritten ? `Editing draft · Agent work · ${saveLabel.toLowerCase()}`
                    : canEdit ? `Editing draft · ${saveLabel.toLowerCase()}` : saveLabel}
          </span>
        </div>
        <div className="doc-mode">
          {isMarkdown && canEdit ? (
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

      {!isMarkdown && review ? <p className="chat-history-status">Original supplied file. Drafting uses its saved extracted text. The original remains unchanged.</p> : null}
      {referenceTarget && onOpenReference ? <div className="chat-history-status"><button className="btn quiet tiny" type="button" onClick={() => onOpenReference(referenceTarget)}>Open referenced passage</button> The source opens separately and does not change this document&apos;s action target.</div> : null}
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
          author={review.authors.find((item) => item.author_id === editingAuthorId) ?? { author_id: editingAuthorId, name: editingAuthorName, color: REVIEW_AUTHOR_PALETTE[review.authors.length % REVIEW_AUTHOR_PALETTE.length] }}
          busy={busy}
          key={document.path}
          lawyerAuthor={lawyerAuthor}
          lawyerAuthorId={lawyerAuthorId}
          onAction={reviewAction}
          onAuthorChange={onReviewAuthorChange}
          readOnly={!canEdit}
          review={review}
        >{({ mode: reviewMode, reviewers, onAddComment, onOpenThread, onSelectionContext }) => <MarkdownRichEditor
          key={`${document.path}-${editorVersion}`}
          markdown={document.content}
          onAddComment={onAddComment}
          onAskAgent={canEdit && onAskAgent ? () => onAskAgent(actionTargetDocumentId ?? activeIdentity?.document_id) : undefined}
          onOpenCommentThread={onOpenThread}
          onSelectionContext={selection => {
            onSelectionContext(selection);
            if (selection.anchorStart !== undefined && selection.anchorEnd !== undefined) {
              const start = Array.from(document.content.slice(0, selection.anchorStart)).length;
              const end = Array.from(document.content.slice(0, selection.anchorEnd)).length;
              setSelectedRange({ start, end, text: document.content.slice(selection.anchorStart, selection.anchorEnd) });
            } else setSelectedRange(null);
          }}
          documents={documents}
          onOpenDocument={onOpenReference}
          readOnly={!canEdit}
          reviewComments={review.comments}
          reviewMode={reviewMode}
          reviewReviewers={reviewers}
          reviewSegments={review.segments}
          reviewTracking={review.tracking}
          reviewAuthor={review.authors.find((item) => item.author_id === editingAuthorId) ?? { author_id: editingAuthorId, name: editingAuthorName, color: REVIEW_AUTHOR_PALETTE[review.authors.length % REVIEW_AUTHOR_PALETTE.length] }}
          onChange={(content) => {
            if (savedMarkdownMatches(content, document.content)) return;
            setDocument((current) => (current ? { ...current, content } : current));
            setDirty(true);
          }}
        />}</DocumentReview>
      ) : <MarkdownRichEditor key={document.path} markdown={document.content} readOnly documents={documents} onOpenDocument={onOpenReference} />
      : isMarkdown || document.editable ? (
        <div className="doc-scroll">
          <textarea
            aria-label="Raw Markdown"
            className="markdown-source"
            onChange={(event) => { setDocument({ ...document, content: event.target.value }); setDirty(true); }}
            readOnly={!canEdit}
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

      {savedChangesAvailable ? (
        <div className="notice-card wash-attention" style={{ margin: "0 34px 12px" }}>
          <strong>New saved version available</strong>
          <p>Your local text is still here. Copy any edits you want to keep, then reload the saved file to review its latest changes.</p>
        </div>
      ) : null}
      {error ? <p className="error" style={{ margin: "0 34px 12px" }}>{error}</p> : null}
      {saveState === "conflict" ? (
        <div className="notice-card wash-attention" style={{ margin: "0 34px 12px" }}>
          <strong>Save conflict — review</strong>
          <p>Your local text is still available. Check the saved file before you retry.</p>
          <div className="btn-row">
            <button className="btn compact" disabled={busy} onClick={() => void save()} type="button">Retry save</button>
            <button className="btn compact" disabled={busy} onClick={() => void reloadCanonical()} type="button">Reload saved file</button>
          </div>
        </div>
      ) : null}

      <div className="doc-bar document-actions" style={{ position: "static", borderBottom: 0, borderTop: "1px solid var(--line-soft)" }}>
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
          {saveState !== "conflict" ? <button className="btn compact" disabled={busy} onClick={() => void reloadCanonical()} type="button">Reload saved file</button> : null}
          <button className="btn primary compact" disabled={!dirty || busy || !canEdit} onClick={() => void save()}>
            {busy ? "Saving…" : dirty && review?.tracking ? "Save redline" : "Save"}
          </button>
      <label className="workspace-export-mode">Export version <select value={exportMode} onChange={event => setExportMode(event.target.value as "markup" | "accepted_text")}><option value="markup">Saved changes as markup</option><option value="accepted_text">Accepted text only</option></select></label>
        </div>
      </div>
    </div>
  );
}
