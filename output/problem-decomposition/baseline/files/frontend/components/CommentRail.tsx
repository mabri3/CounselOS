"use client";

import { useEffect, useRef, useState } from "react";
import type { DocumentComment, DocumentReviewAction } from "@/lib/types";

export default function CommentRail({ comments, lawyerAuthorId, busy, onAction, onCollapse, onOpenThread }: { comments: DocumentComment[]; lawyerAuthorId: string; busy: boolean; onAction: (action: DocumentReviewAction) => Promise<void>; onCollapse: () => void; onOpenThread: (threadId: string, returnFocus: HTMLElement | null) => void }) {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const confirmTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ kind: "thread"; threadId: string } | { kind: "resolved" } | null>(null);
  useEffect(() => { if (replyTo) inputRef.current?.focus(); }, [replyTo]);
  useEffect(() => { if (pendingDelete) confirmRef.current?.focus(); }, [pendingDelete]);
  const resolved = comments.filter((thread) => thread.resolved);
  const open = comments.filter((thread) => !thread.resolved);
  function canEdit(authorId: string) { return authorId === lawyerAuthorId && authorId !== "author-themis" && !authorId.startsWith("author-imported"); }
  function requestDelete(pending: { kind: "thread"; threadId: string } | { kind: "resolved" }, trigger: HTMLButtonElement) { confirmTriggerRef.current = trigger; setPendingDelete(pending); }
  function closeDelete() { setPendingDelete(null); const trigger = confirmTriggerRef.current; confirmTriggerRef.current = null; requestAnimationFrame(() => trigger?.focus()); }
  async function confirmDelete() { if (!pendingDelete) return; const action: DocumentReviewAction = pendingDelete.kind === "thread" ? { action: "delete_comment_thread", thread_id: pendingDelete.threadId } : { action: "delete_resolved_comments" }; await onAction(action); closeDelete(); }
  function renderThread(thread: DocumentComment) { return (
    <article className={`comment-thread ${thread.resolved ? "resolved" : ""}`} key={thread.thread_id}>
      <button className="comment-anchor-button" onClick={(event) => onOpenThread(thread.thread_id, event.currentTarget)} type="button"><blockquote>{thread.quote}</blockquote></button>
      {thread.entries.map((entry) => <div className="comment-entry" key={entry.comment_id}>
        <strong>{entry.author_name}</strong>{editing === entry.comment_id ? <div className="comment-reply"><input autoFocus aria-label="Edit comment" className="text-input" onChange={(event) => setEditBody(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") { setEditing(null); setEditBody(""); } }} value={editBody}/><button className="btn primary tiny" disabled={!editBody.trim() || busy} onClick={async () => { await onAction({ action: "edit_comment", thread_id: thread.thread_id, comment_id: entry.comment_id, body: editBody.trim() }); setEditing(null); setEditBody(""); }} type="button">Save</button></div> : <p>{entry.body}</p>}
        {canEdit(entry.author_id) ? <div className="btn-row"><button className="btn quiet tiny" disabled={busy} onClick={() => { setEditing(entry.comment_id); setEditBody(entry.body); }} type="button">Edit</button><button className="btn quiet tiny" disabled={busy} onClick={() => void onAction({ action: "delete_comment_entry", thread_id: thread.thread_id, comment_id: entry.comment_id })} type="button">Delete</button></div> : null}
      </div>)}
      {replyTo === thread.thread_id ? <div className="comment-reply"><input ref={inputRef} aria-label="Reply" className="text-input" onKeyDown={(event) => { if (event.key === "Escape") { setReplyTo(null); setBody(""); } }} onChange={(event) => setBody(event.target.value)} value={body} /><button className="btn primary tiny" disabled={!body.trim() || busy} onClick={async () => { await onAction({ action: "reply_comment", thread_id: thread.thread_id, body: body.trim() }); setReplyTo(null); setBody(""); }} type="button">Reply</button></div> : null}
      <div className="comment-thread-actions">{!thread.resolved ? <><button className="btn tiny" onClick={() => setReplyTo(thread.thread_id)} type="button">Reply</button><button className="btn tiny" disabled={busy} onClick={() => void onAction({ action: "resolve_comment", thread_id: thread.thread_id })} type="button">Resolve thread</button></> : <button className="btn tiny" disabled={busy} onClick={() => void onAction({ action: "reopen_comment", thread_id: thread.thread_id })} type="button">Reopen thread</button>}<button className="btn quiet tiny" disabled={busy} onClick={(event) => requestDelete({ kind: "thread", threadId: thread.thread_id }, event.currentTarget)} type="button">Delete thread permanently…</button></div>
      {thread.resolved ? <p className="comment-note">Comment resolved. It remains available under Resolved comments.</p> : null}
    </article>
  ); }
  return (
    <aside className="comment-rail" aria-label="Document comments">
      <div className="comment-rail-head"><strong>Comments</strong><span>{comments.filter((item) => !item.resolved).length} open</span><button aria-label="Hide comments" className="pane-collapse" onClick={onCollapse} title="Hide comments" type="button">›</button></div>
      {open.map(renderThread)}
      {resolved.length ? <details className="resolved-comments"><summary>Resolved comments ({resolved.length})</summary><p>Resolved comments remain with this document until you delete them.</p>{resolved.map(renderThread)}<button className="btn quiet tiny" disabled={busy} onClick={(event) => requestDelete({ kind: "resolved" }, event.currentTarget)} type="button">Delete all resolved threads…</button></details> : null}
      {pendingDelete ? <div aria-describedby="comment-delete-description" aria-labelledby="comment-delete-title" className="comment-popover" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeDelete(); } }} role="alertdialog">
        <strong id="comment-delete-title">Confirm permanent deletion</strong>
        <p id="comment-delete-description">{pendingDelete.kind === "thread" ? "Delete this comment thread permanently? Its content cannot be recovered." : "Delete all resolved comment threads permanently? Their content cannot be recovered."}</p>
        <div className="btn-row"><button className="btn" disabled={busy} onClick={closeDelete} type="button">Cancel</button><button className="btn primary" disabled={busy} onClick={() => void confirmDelete()} ref={confirmRef} type="button">{pendingDelete.kind === "thread" ? "Delete thread permanently" : "Delete all resolved threads"}</button></div>
      </div> : null}
    </aside>
  );
}
