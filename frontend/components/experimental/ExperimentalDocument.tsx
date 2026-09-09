"use client";
import { useEffect, useRef, useState } from "react";
import DocumentPanel from "@/components/DocumentPanel";
import EvidenceDrawer from "@/components/workspace/EvidenceDrawer";
import ClaimMarkdown from "@/components/workspace/ClaimMarkdown";
import { getDocumentReview, getFile, updateDocumentReview } from "@/lib/api";
import type { DocumentReview, VaultDocument } from "@/lib/types";
import type { ActionActor } from "@/lib/continuityTypes";
import type { DocumentIdentity, LocalEditorSnapshot, ConversationTarget, ClaimEvidence, WorkspaceClaim } from "@/lib/workspaceTypes";
import styles from "./ExperimentalChat.module.css";
export default function ExperimentalDocument({ document, documents, matterId, actor, contextKey, refresh, onSnapshot, onAsk, onOpen, onSaved }: {
    document: DocumentIdentity;
    documents: DocumentIdentity[];
    matterId: string;
    actor: ActionActor;
    contextKey: string;
    refresh: number;
    onSnapshot: (snapshot: LocalEditorSnapshot) => void;
    onAsk: (text: string, target: ConversationTarget, commentId?: string) => void;
    onOpen: (path: string, commentId?: string) => void;
    onSaved: () => void;
}) {
    const [file, setFile] = useState<VaultDocument | null>(null);
    const [review, setReview] = useState<DocumentReview | null>(null);
    const [evidence, setEvidence] = useState<ClaimEvidence | null>(null);
    const [editing, setEditing] = useState(false);
    const commentKey = `${contextKey}:comment:${document.document_id}`;
    const priorComment = () => { try {
        return JSON.parse(localStorage.getItem(commentKey) || "null");
    }
    catch {
        return null;
    } };
    const [quote, setQuote] = useState(() => priorComment()?.quote || "");
    const [comment, setComment] = useState(() => priorComment()?.comment || "");
    useEffect(() => { try {
        localStorage.setItem(commentKey, JSON.stringify({ quote, comment }));
    }
    catch { /* Kept in the mounted document until save. */ } }, [commentKey, quote, comment]);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [localRefresh, setLocalRefresh] = useState(0);
    const article = useRef<HTMLDivElement>(null);
    useEffect(() => { let cancelled = false; void Promise.all([getFile(document.path), getDocumentReview(document.path)]).then(([next, comments]) => { if (!cancelled) {
        setFile(next);
        setReview(comments);
        setError("");
    } }).catch(e => { if (!cancelled)
        setError(e.message); }); return () => { cancelled = true; }; }, [document.path, refresh, localRefresh]);
    const claims = (Array.isArray(file?.metadata.claims) ? file.metadata.claims : []) as WorkspaceClaim[];
    const sources = (Array.isArray(file?.metadata.source_records) ? file.metadata.source_records : []).map(source => ({...source, claim_id: `source:${source.source_id}`})) as ClaimEvidence[];
    // Avoid repeating the file title when the Markdown starts with the same heading.
    const preview = file?.content.replace(/^# ([^\n]+)\n*/, (heading, title: string) => title.trim() === document.title.trim() ? "" : heading);
    const target = (text?: string): ConversationTarget => ({ matter_id: matterId, artifact_path: document.path, artifact_revision: review?.artifact_revision || document.revision, artifact_review_revision: review?.revision,
        ...(text && file?.content.includes(text) ? { selected_range: { text, start: Array.from(file.content.slice(0, file.content.indexOf(text))).length, end: Array.from(file.content.slice(0, file.content.indexOf(text) + text.length)).length } } : {}) });
    async function addComment() { if (!review || !comment.trim() || !quote)
        return; setBusy(true); setError(""); try {
        const next = await updateDocumentReview(document.path, { action: "add_comment", body: comment, quote, author_id: actor.person_id, author_name: actor.display_name, expected_revision: review.artifact_revision, expected_review_revision: review.revision });
        setReview(next);
        setComment("");
        setQuote("");
        onSaved();
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Comment could not save.");
    }
    finally {
        setBusy(false);
    } }
    return <div className={styles.document}><div className={styles.row}><small title={`Saved version ${document.revision}`}>{document.lifecycle_state === "editing_draft" ? "Draft" : document.lifecycle_state === "reading_source" ? "Source" : document.lifecycle_state === "matter_record" ? "Matter record" : document.lifecycle_state} · Saved</small><button onClick={() => { setEditing(!editing); setLocalRefresh(x => x + 1); }}>{editing ? "Return to comments" : "Edit document"}</button></div><h2>{document.title}</h2>{error && <p role="alert" className={styles.error}>{error}</p>}
    <div hidden={!editing}><DocumentPanel autoSave activeDocument={document} activePath={document.path} contextKey={contextKey} humanActor={actor} documents={documents} refreshSignal={refresh} onSnapshot={onSnapshot} onSaved={() => { setLocalRefresh(x => x + 1); onSaved(); }} activeReviewAuthor={actor.display_name} lawyerAuthor={actor.display_name} onReviewAuthorChange={() => { }} onUpload={async () => { throw new Error("Use Attach in the conversation."); }} onAskAgent={() => onAsk("Review my edits and explain any effect on the analysis.", target())} onOpenReference={ref => onOpen(ref.path)}/></div>
    <div hidden={editing} ref={article}><ClaimMarkdown text={preview ?? "Loading document…"} claims={claims} sources={sources} documents={documents} onOpenEvidence={setEvidence} onOpenDocument={ref => onOpen(ref.path)}/>
    <EvidenceDrawer evidence={evidence} open={Boolean(evidence)} onClose={() => setEvidence(null)} onOpenArtifact={path => onOpen(path)}/></div>
    {!editing && <><button disabled={!file} onMouseDown={event => event.preventDefault()} onClick={() => { const selection = window.getSelection(); if (selection?.anchorNode && article.current?.contains(selection.anchorNode) && selection.toString().trim()) {
            setQuote(selection.toString().trim());
            setError("");
        }
        else
            setError("Select a passage in this document first."); }}>Comment on selected text</button>{quote && <section className={styles.comment}><p className={styles.quote}>{quote}</p><label>Comment or question<textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}/></label><button disabled={busy || !comment.trim()} onClick={() => void addComment()}>Save comment</button></section>}
    {review?.comments.map(thread => <section id={`experimental-comment-${thread.thread_id}`} key={thread.thread_id} className={styles.comment}><small>{thread.resolved ? "Resolved" : "Open comment"}</small><p className={styles.quote}>{thread.quote}</p>{thread.entries.map(entry => <div key={entry.comment_id}><strong>{entry.author_name}</strong><br /><ClaimMarkdown text={entry.body} documents={documents} onOpenDocument={ref=>onOpen(ref.path,thread.thread_id)}/></div>)}<button onClick={() => onAsk(`Review comment on “${document.title}”: ${thread.entries.map(entry => `${entry.author_name}: ${entry.body}`).join("; ")}`, target(thread.quote), thread.thread_id)}>Ask Themis about this comment</button></section>)}</>}
  </div>;
}
