"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CommentRail from "@/components/CommentRail";
import type { ReviewDisplayMode } from "@/components/RevisionPlugin";
import { displayReviewAuthor, GENERATED_REVIEW_AUTHOR, REVIEW_AUTHOR_PALETTE } from "@/lib/reviewAuthor";
import type { DocumentReview as ReviewState, DocumentReviewAction, ReviewAuthor } from "@/lib/types";

type SelectionContext = { quote: string; anchorStart?: number; anchorEnd?: number; returnFocus: HTMLElement | null; rect: DOMRect | null };

export default function DocumentReview({ review, author, lawyerAuthor, lawyerAuthorId, busy, readOnly, onAuthorChange, onAction, children }: {
  review: ReviewState; author: ReviewAuthor; lawyerAuthor: string; lawyerAuthorId: string; busy: boolean; readOnly: boolean; onAuthorChange: (name: string) => void; onAction: (action: DocumentReviewAction) => Promise<void>;
  children: (props: { mode: ReviewDisplayMode; reviewers: Set<string>; onAddComment: (context: SelectionContext) => void; onOpenThread: (threadId: string, returnFocus: HTMLElement | null) => void; onSelectionContext: (context: SelectionContext) => void }) => React.ReactNode;
}) {
  const [mode, setMode] = useState<ReviewDisplayMode>(() => review.tracking || review.changes.length || review.comments.some((item) => !item.resolved) ? "markup" : "current");
  const [reviewers, setReviewers] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<SelectionContext | null>(null);
  const [commentQuote, setCommentQuote] = useState("");
  const [comment, setComment] = useState("");
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reviewingChanges, setReviewingChanges] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const reviewButton = useRef<HTMLButtonElement | null>(null);
  const knownChanges = useRef(new Set(review.changes.map((item) => item.change_id)));
  const visibleChanges = useMemo(() => review.changes.filter((item) => reviewers.size === 0 || reviewers.has(item.author_id)), [review.changes, reviewers]);
  const authorOptions = [...new Set([lawyerAuthor.trim(), GENERATED_REVIEW_AUTHOR, ...review.authors.map((item) => displayReviewAuthor(item.name, item.author_id))])].filter(Boolean);
  const selectedAuthor = displayReviewAuthor(author.name, author.author_id);
  const closePopover = useCallback(() => { setCommentQuote(""); setComment(""); setOpenThread(null); const target = returnFocus.current; returnFocus.current = null; requestAnimationFrame(() => target?.focus()); }, []);
  const popupStyle = selection?.rect ? { position: "fixed" as const, left: Math.min(selection.rect.left, window.innerWidth - 450), top: Math.min(selection.rect.bottom + 8, window.innerHeight - 260) } : undefined;
  function decide(action: "accept_change" | "reject_change", changeId: string, next: boolean) { void onAction({ action, change_id: changeId }).then(() => { if (!next) return; const index = visibleChanges.findIndex((item) => item.change_id === changeId); const nextId = visibleChanges[index + 1]?.change_id; if (nextId) requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-review-change="${nextId}"]`)?.focus()); }); }
  function closeReview() { setReviewingChanges(false); requestAnimationFrame(() => reviewButton.current?.focus()); }
  function openComposer(context: SelectionContext) { const exact = context.anchorStart !== undefined ? context : selection?.quote === context.quote ? { ...context, anchorStart: selection.anchorStart, anchorEnd: selection.anchorEnd } : context; setSelection(exact); returnFocus.current = exact.returnFocus; setCommentQuote(exact.quote); setOpenThread(null); }
  function openExisting(threadId: string, focus: HTMLElement | null) { returnFocus.current = focus; setCommentsOpen(true); setOpenThread(threadId); setCommentQuote(""); }
  const contextualThread = review.comments.find((item) => item.thread_id === openThread);
  const openCommentCount = review.comments.filter((item) => !item.resolved).length;

  useEffect(() => {
    const current = new Set(review.changes.map((item) => item.change_id));
    if (review.changes.some((item) => !knownChanges.current.has(item.change_id))) setMode("markup");
    knownChanges.current = current;
  }, [review.changes]);

  useEffect(() => {
    if (visibleChanges.length === 0) setReviewingChanges(false);
  }, [visibleChanges.length]);

  useEffect(() => {
    if (reviewingChanges) requestAnimationFrame(() => document.querySelector<HTMLElement>("[data-review-change]")?.focus());
  }, [reviewingChanges]);

  return <div className={`review-workspace ${commentsOpen || reviewingChanges ? "" : "comments-hidden"} ${reviewingChanges ? "changes-open" : ""}`}>
    <div className="review-main">
      <div className="review-toolbar" role="toolbar" aria-label="Document review">
        <div className="review-modes">{([['markup', 'All Markup'], ['current', 'No Markup'], ['original', 'Original']] as const).map(([value, label]) => <button className={mode === value ? "active" : ""} key={value} onClick={() => setMode(value)} type="button">{label}</button>)}</div>
        <div className="review-toolbar-actions">
          <button
            aria-pressed={review.tracking}
            className={`btn tiny redline-toggle ${review.tracking ? "active" : ""}`}
            disabled={busy || readOnly}
            onClick={() => {
              if (!review.tracking) setMode("markup");
              void onAction({ action: "set_tracking", enabled: !review.tracking });
            }}
            title={review.tracking ? "Stop recording new edits as redlines." : "Record new edits as redlines."}
            type="button"
          >Redline {review.tracking ? "on" : "off"}</button>
          {visibleChanges.length ? <button
            aria-expanded={reviewingChanges}
            className={`btn tiny ${reviewingChanges ? "quiet" : "review"}`}
            ref={reviewButton}
            onClick={() => {
              setMode("markup");
              if (reviewingChanges) closeReview();
              else setReviewingChanges(true);
            }}
            type="button"
          >{reviewingChanges ? "Continue editing" : `Review ${visibleChanges.length} ${visibleChanges.length === 1 ? "change" : "changes"}`}</button> : null}
          <div className="review-toolbar-secondary">
          {review.authors.length ? <details className="reviewer-menu"><summary>Reviewers ({review.authors.length})</summary><div className="reviewer-filters" aria-label="Reviewer filters">{review.authors.map((item) => { const count = review.changes.filter((change) => change.author_id === item.author_id).length; const selected = reviewers.size === 0 || reviewers.has(item.author_id); const displayName = displayReviewAuthor(item.name, item.author_id); return <label key={item.author_id}><input checked={selected} onChange={() => setReviewers((current) => { const next = new Set(current.size === 0 ? review.authors.map((entry) => entry.author_id) : current); if (next.has(item.author_id)) next.delete(item.author_id); else next.add(item.author_id); return next.size === review.authors.length ? new Set() : next; })} type="checkbox"/><span className="author-swatch" style={{ background: item.color }}/>{displayName} ({count})<select aria-label={`Color for ${displayName}`} onChange={(event) => void onAction({ action: "set_author_color", author_id: item.author_id, color: event.target.value })} value={item.color}>{REVIEW_AUTHOR_PALETTE.map((color) => <option key={color} value={color}>{color}</option>)}</select></label>; })}</div></details> : null}
          <button aria-pressed={commentsOpen} className="btn quiet tiny" onClick={() => setCommentsOpen((current) => !current)} type="button">Comments {commentsOpen ? "on" : "off"} ({openCommentCount})</button>
          <label>Author <select aria-label="Active review author" className="select-input" onChange={(event) => { if (event.target.value === "__custom") { setCustomName(""); setCustomOpen(true); } else onAuthorChange(event.target.value); }} value={selectedAuthor}>{authorOptions.map((name) => <option key={name}>{name}</option>)}{!authorOptions.includes(selectedAuthor) ? <option>{selectedAuthor}</option> : null}<option value="__custom">Custom name…</option></select></label>
          {customOpen ? <div className="author-popover"><input autoFocus aria-label="Custom author name" className="text-input" onChange={(event) => setCustomName(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setCustomOpen(false); }} value={customName}/><button className="btn primary tiny" disabled={!customName.trim()} onClick={() => { onAuthorChange(customName); setCustomOpen(false); }} type="button">Use author</button></div> : null}
          </div>
        </div>
      </div>
      {children({ mode, reviewers, onAddComment: openComposer, onOpenThread: openExisting, onSelectionContext: setSelection })}
      {(commentQuote || contextualThread) ? <div className="comment-popover" onKeyDown={(event) => { if (event.key === "Escape") closePopover(); }} role="dialog" aria-label={commentQuote ? "Add comment" : "Comment thread"} style={popupStyle}>{commentQuote ? <><strong>Comment on “{commentQuote}”</strong>{selection?.anchorStart === undefined || selection.anchorEnd === undefined ? <p className="comment-note">Select text within one paragraph or list item to add a comment.</p> : <textarea autoFocus className="text-input" onChange={(event) => setComment(event.target.value)} value={comment}/>}<div className="btn-row"><button className="btn" onClick={closePopover} type="button">Cancel</button><button className="btn primary" disabled={!comment.trim() || busy || selection?.anchorStart === undefined || selection.anchorEnd === undefined} onClick={async () => { await onAction({ action: "add_comment", quote: commentQuote, body: comment.trim(), anchor_start: selection?.anchorStart, anchor_end: selection?.anchorEnd }); setCommentsOpen(true); closePopover(); }} type="button">Add comment</button></div></> : contextualThread ? <><blockquote>{contextualThread.quote}</blockquote>{contextualThread.entries.map((entry) => <p key={entry.comment_id}><strong>{displayReviewAuthor(entry.author_name, entry.author_id)}</strong><br/>{entry.body}</p>)}<button className="btn tiny" onClick={closePopover} type="button">Close</button></> : null}</div> : null}
    </div>
    {reviewingChanges && visibleChanges.length ? <section aria-label="Tracked changes" className="review-list" onKeyDown={(event) => { if (event.key === "Escape") closeReview(); }}><div className="review-list-head"><div><h3>Review tracked changes</h3><p>{visibleChanges.length} {visibleChanges.length === 1 ? "change" : "changes"} remaining</p></div><button className="btn quiet tiny" onClick={closeReview} type="button">Continue editing</button></div>{visibleChanges.map((change) => <article className="review-card" data-review-change={change.change_id} key={change.change_id} tabIndex={-1}><div><strong style={{ color: change.author_color }}>{displayReviewAuthor(change.author_name, change.author_id)}</strong><div className="review-change-text">{change.old_text ? <del style={{ color: change.author_color }}>{change.old_text}</del> : null}{change.new_text ? <ins style={{ color: change.author_color }}>{change.new_text}</ins> : null}</div></div><div className="btn-row"><button className="btn tiny" disabled={busy} onClick={() => decide("reject_change", change.change_id, false)} type="button">Reject</button><button className="btn tiny" disabled={busy} onClick={() => decide("reject_change", change.change_id, true)} type="button">Reject and next</button><button className="btn tiny" disabled={busy} onClick={() => decide("accept_change", change.change_id, false)} type="button">Accept</button><button className="btn primary tiny" disabled={busy} onClick={() => decide("accept_change", change.change_id, true)} type="button">Accept and next</button></div></article>)}</section> : commentsOpen ? <CommentRail busy={busy} comments={review.comments} lawyerAuthorId={lawyerAuthorId} onAction={onAction} onCollapse={() => setCommentsOpen(false)} onOpenThread={openExisting}/> : null}
  </div>;
}
