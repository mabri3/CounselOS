"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getRoot, $getSelection, $isRangeSelection, $isTextNode, $setSelection, BLUR_COMMAND, CLICK_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND, PASTE_COMMAND, type TextNode } from "lexical";
import { $createRevisionTextNode, $isRevisionTextNode, type RevisionKind } from "@/components/RevisionTextNode";
import type { DocumentComment, DocumentReviewSegment, ReviewAuthor } from "@/lib/types";

export type ReviewDisplayMode = "markup" | "current" | "original";
export const REVIEW_SYNC_TAG = "review-sync";
export const REVISION_BOUNDARY = "\u200A";

type Mark = { start: number; end: number; kind: RevisionKind; text: string; authorName: string; authorColor: string; id: string };

/** Adds visual-only review nodes to the existing Markdown-derived Lexical tree. */
export default function RevisionPlugin({ segments, comments, markdown, mode, reviewers, readOnly, tracking, trackingAuthor, onOpenThread, onSelectionContext }: {
  segments: DocumentReviewSegment[]; comments: DocumentComment[]; mode: ReviewDisplayMode; reviewers: Set<string>; readOnly: boolean;
  markdown: string; tracking: boolean; trackingAuthor: ReviewAuthor;
  onOpenThread: (threadId: string, returnFocus: HTMLElement | null) => void;
  onSelectionContext: (context: { quote: string; anchorStart?: number; anchorEnd?: number; returnFocus: HTMLElement | null; rect: DOMRect | null }) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const reviewStateRef = useRef({ segments, comments, markdown, mode, reviewers, readOnly, tracking, trackingAuthor });
  const previewVisibleRef = useRef(false);
  const previewTimerRef = useRef<number | null>(null);
  reviewStateRef.current = { segments, comments, markdown, mode, reviewers, readOnly, tracking, trackingAuthor };

  const syncReview = useCallback((showLocalPreview: boolean) => {
    const state = reviewStateRef.current;
    editor.setEditable(!state.readOnly && state.mode !== "original");
    editor.update(() => {
      if (showLocalPreview) $setSelection(null);
      normalizeReviewNodes();
      const visibleSegments = state.tracking && showLocalPreview
        ? composeLocalRevision(state.segments, state.markdown, state.trackingAuthor)
        : state.segments;
      const marks = buildMarks(visibleSegments, state.comments, state.markdown, state.mode, state.reviewers);
      for (const mark of [...marks].sort((a, b) => b.start - a.start || b.end - a.end)) applyMark(mark);
      if (!state.readOnly && state.mode !== "original") ensureEditableBoundaries();
    }, { tag: REVIEW_SYNC_TAG });
  }, [editor]);

  const scheduleSync = useCallback((showLocalPreview: boolean) => {
    previewVisibleRef.current = showLocalPreview;
    if (previewTimerRef.current !== null) window.clearTimeout(previewTimerRef.current);
    previewTimerRef.current = window.setTimeout(() => {
      previewTimerRef.current = null;
      syncReview(showLocalPreview);
    }, 0);
  }, [syncReview]);

  useEffect(() => {
    syncReview(previewVisibleRef.current);
  }, [comments, mode, readOnly, reviewers, segments, syncReview, tracking, trackingAuthor]);

  useEffect(() => {
    const unregisterFocus = editor.registerCommand(FOCUS_COMMAND, () => {
      if (previewVisibleRef.current) scheduleSync(false);
      return false;
    }, COMMAND_PRIORITY_LOW);
    const unregisterBlur = editor.registerCommand(BLUR_COMMAND, () => {
      const state = reviewStateRef.current;
      if (state.tracking && hasLocalRevision(state.segments, state.markdown)) scheduleSync(true);
      return false;
    }, COMMAND_PRIORITY_LOW);
    const unregisterPaste = editor.registerCommand(PASTE_COMMAND, () => {
      if (reviewStateRef.current.tracking) scheduleSync(true);
      return false;
    }, COMMAND_PRIORITY_LOW);
    return () => {
      unregisterFocus();
      unregisterBlur();
      unregisterPaste();
      if (previewTimerRef.current !== null) window.clearTimeout(previewTimerRef.current);
    };
  }, [editor, scheduleSync]);

  useEffect(() => editor.registerCommand(CLICK_COMMAND, (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return false;
    const threadId = target.closest<HTMLElement>(".revision-comment")?.dataset.changeId;
    if (!threadId) return false;
    onOpenThread(threadId, editor.getRootElement());
    return true;
  }, COMMAND_PRIORITY_LOW), [editor, onOpenThread]);

  useEffect(() => editor.registerUpdateListener(({ editorState, tags }) => {
    if (tags.has(REVIEW_SYNC_TAG)) return;
    editorState.read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || selection.isCollapsed()) return;
      const selectedText = selection.getTextContent();
      const quote = selectedText.trim();
      if (!quote) return;
      const plainRange = selectionOffsets();
      if (!plainRange) return;
      const crossesBlocks = selection.anchor.getNode().getTopLevelElementOrThrow().getKey() !== selection.focus.getNode().getTopLevelElementOrThrow().getKey();
      const leading = selectedText.length - selectedText.trimStart().length;
      const trailing = selectedText.length - selectedText.trimEnd().length;
      const offsets = markdownOffsetMap(markdown);
      const projectedStart = offsets.plainToRaw(plainRange.start + leading);
      const projectedEnd = offsets.plainEndToRaw(plainRange.end - trailing);
      const exactRawSlice = markdown.slice(projectedStart, projectedEnd) === quote;
      const native = window.getSelection();
      onSelectionContext({ quote, anchorStart: crossesBlocks || !exactRawSlice ? undefined : projectedStart, anchorEnd: crossesBlocks || !exactRawSlice ? undefined : projectedEnd, returnFocus: editor.getRootElement(), rect: native?.rangeCount ? native.getRangeAt(0).getBoundingClientRect() : null });
    });
  }), [editor, markdown, onSelectionContext]);

  return null;
}

function composeLocalRevision(segments: DocumentReviewSegment[], content: string, author: ReviewAuthor): DocumentReviewSegment[] {
  const old = segments.filter((item) => item.kind !== "delete").map((item) => item.text).join("");
  if (old.endsWith("\n") && !content.endsWith("\n")) content += "\n";
  if (old === content) return segments;
  const oldTokens = tokenize(old), newTokens = tokenize(content);
  const offsets: Array<{ start: number; end: number; segment: DocumentReviewSegment }> = [];
  let cursor = 0;
  for (const segment of segments) {
    if (segment.kind === "delete") continue;
    const end = cursor + segment.text.length;
    offsets.push({ start: cursor, end, segment });
    cursor = end;
  }
  function pieces(start: number, end: number) {
    const result: DocumentReviewSegment[] = [];
    for (const item of offsets) {
      if (item.end <= start || item.start >= end) continue;
      const text = item.segment.text.slice(Math.max(start, item.start) - item.start, Math.min(end, item.end) - item.start);
      if (text) result.push({ ...item.segment, text });
    }
    return result;
  }
  const tokenOffsets = [0];
  for (const token of oldTokens) tokenOffsets.push(tokenOffsets.at(-1)! + token.length);
  const hidden = new Map<number, DocumentReviewSegment[]>();
  cursor = 0;
  for (const segment of segments) {
    if (segment.kind === "delete") hidden.set(cursor, [...(hidden.get(cursor) ?? []), { ...segment }]);
    else cursor += segment.text.length;
  }
  const output: DocumentReviewSegment[] = [];
  for (const [index, opcode] of diffOpcodes(oldTokens, newTokens).entries()) {
    const start = tokenOffsets[opcode.oldStart], end = tokenOffsets[opcode.oldEnd];
    output.push(...(hidden.get(start) ?? []));
    hidden.delete(start);
    if (opcode.kind === "equal") {
      let pieceStart = start;
      for (const position of [...hidden.keys()].filter((value) => start < value && value < end).sort((left, right) => left - right)) {
        output.push(...pieces(pieceStart, position), ...(hidden.get(position) ?? []));
        hidden.delete(position);
        pieceStart = position;
      }
      output.push(...pieces(pieceStart, end));
      continue;
    }
    const prior = pieces(start, end);
    for (const position of [...hidden.keys()].filter((value) => start < value && value <= end).sort((left, right) => left - right)) {
      output.push(...(hidden.get(position) ?? []));
      hidden.delete(position);
    }
    const changeId = `local-review-${opcode.oldStart}-${opcode.newStart}-${index}`;
    const createdAt = "";
    const replaced = prior.filter((item) => item.kind === "insert");
    for (const item of prior) if (item.kind === "equal") output.push(localSegment("delete", item.text, changeId, author, createdAt));
    const text = newTokens.slice(opcode.newStart, opcode.newEnd).join("");
    if (text) output.push({ ...localSegment("insert", text, changeId, author, createdAt),
      ...(replaced.length ? { replaced_segments: replaced, replaced_text: replaced.map((item) => item.text).join("") } : {}) });
  }
  for (const position of [...hidden.keys()].sort((left, right) => left - right)) output.push(...(hidden.get(position) ?? []));
  return output;
}

function localSegment(kind: "insert" | "delete", text: string, changeId: string, author: ReviewAuthor, createdAt: string): DocumentReviewSegment {
  return { kind, text, change_id: changeId, author_id: author.author_id, author_name: author.name, author_color: author.color, created_at: createdAt };
}

function tokenize(value: string) {
  return value.match(/\s+|[\p{L}\p{N}_]+|[^\p{L}\p{N}_\s]/gu) ?? [];
}

type DiffOpcode = { kind: "equal" | "change"; oldStart: number; oldEnd: number; newStart: number; newEnd: number };

function diffOpcodes(oldTokens: string[], newTokens: string[]): DiffOpcode[] {
  const rows = oldTokens.length + 1, columns = newTokens.length + 1;
  if (oldTokens.length * newTokens.length > 2_000_000) return coarseOpcodes(oldTokens, newTokens);
  const table = new Uint32Array(rows * columns);
  for (let oldIndex = oldTokens.length - 1; oldIndex >= 0; oldIndex--) {
    for (let newIndex = newTokens.length - 1; newIndex >= 0; newIndex--) {
      const offset = oldIndex * columns + newIndex;
      table[offset] = oldTokens[oldIndex] === newTokens[newIndex]
        ? table[(oldIndex + 1) * columns + newIndex + 1] + 1
        : Math.max(table[(oldIndex + 1) * columns + newIndex], table[offset + 1]);
    }
  }
  const operations: Array<"equal" | "delete" | "insert"> = [];
  let oldIndex = 0, newIndex = 0;
  while (oldIndex < oldTokens.length || newIndex < newTokens.length) {
    if (oldIndex < oldTokens.length && newIndex < newTokens.length && oldTokens[oldIndex] === newTokens[newIndex]) {
      operations.push("equal"); oldIndex++; newIndex++;
    } else if (newIndex < newTokens.length && (oldIndex === oldTokens.length || table[oldIndex * columns + newIndex + 1] >= table[(oldIndex + 1) * columns + newIndex])) {
      operations.push("insert"); newIndex++;
    } else {
      operations.push("delete"); oldIndex++;
    }
  }
  const result: DiffOpcode[] = [];
  oldIndex = 0; newIndex = 0;
  for (let operationIndex = 0; operationIndex < operations.length;) {
    const equal = operations[operationIndex] === "equal";
    const oldStart = oldIndex, newStart = newIndex;
    while (operationIndex < operations.length && (operations[operationIndex] === "equal") === equal) {
      if (operations[operationIndex] !== "insert") oldIndex++;
      if (operations[operationIndex] !== "delete") newIndex++;
      operationIndex++;
    }
    result.push({ kind: equal ? "equal" : "change", oldStart, oldEnd: oldIndex, newStart, newEnd: newIndex });
  }
  return result;
}

function coarseOpcodes(oldTokens: string[], newTokens: string[]): DiffOpcode[] {
  let prefix = 0;
  while (prefix < oldTokens.length && prefix < newTokens.length && oldTokens[prefix] === newTokens[prefix]) prefix++;
  let suffix = 0;
  while (suffix < oldTokens.length - prefix && suffix < newTokens.length - prefix && oldTokens[oldTokens.length - suffix - 1] === newTokens[newTokens.length - suffix - 1]) suffix++;
  const result: DiffOpcode[] = [];
  if (prefix) result.push({ kind: "equal", oldStart: 0, oldEnd: prefix, newStart: 0, newEnd: prefix });
  result.push({ kind: "change", oldStart: prefix, oldEnd: oldTokens.length - suffix, newStart: prefix, newEnd: newTokens.length - suffix });
  if (suffix) result.push({ kind: "equal", oldStart: oldTokens.length - suffix, oldEnd: oldTokens.length, newStart: newTokens.length - suffix, newEnd: newTokens.length });
  return result;
}

function normalizeReviewNodes() {
  for (const node of $getRoot().getAllTextNodes()) {
    if ($isRevisionTextNode(node)) {
      if (node.getRevisionKind() === "delete") { node.remove(); continue; }
      const plain = $createTextNode(node.__text).setFormat(node.getFormat()).setStyle(node.getStyle());
      plain.setDetail(node.getDetail()).setMode(node.getMode());
      node.replace(plain);
      continue;
    }
    if (!node.getTextContent().includes(REVISION_BOUNDARY)) continue;
    const text = node.getTextContent().replaceAll(REVISION_BOUNDARY, "");
    if (text) node.setTextContent(text);
    else node.remove();
  }
}

function ensureEditableBoundaries() {
  const nodes = $getRoot().getAllTextNodes();
  const first = nodes[0];
  const last = nodes.at(-1);
  if ($isRevisionTextNode(first)) first.insertBefore($createTextNode(REVISION_BOUNDARY));
  if ($isRevisionTextNode(last)) last.insertAfter($createTextNode(REVISION_BOUNDARY));
}

function hasLocalRevision(segments: DocumentReviewSegment[], markdown: string) {
  const current = segments.filter((item) => item.kind !== "delete").map((item) => item.text).join("");
  const normalizedMarkdown = current.endsWith("\n") && !markdown.endsWith("\n") ? `${markdown}\n` : markdown;
  return current !== normalizedMarkdown;
}

function buildMarks(segments: DocumentReviewSegment[], comments: DocumentComment[], markdown: string, mode: ReviewDisplayMode, reviewers: Set<string>): Mark[] {
  const marks: Mark[] = [];
  const offsets = markdownOffsetMap(markdown);
  let rawCursor = 0;
  for (const segment of segments) {
    const text = markdownText(segment.text);
    const selected = reviewers.size === 0 || reviewers.has(segment.author_id);
    const start = offsets.rawToPlain(Math.min(rawCursor, markdown.length));
    if (segment.kind === "delete") {
      if ((mode === "markup" && selected) || mode === "original") marks.push({ start, end: start, kind: "delete", text, authorName: segment.author_name, authorColor: segment.author_color, id: segment.change_id });
      continue;
    }
    rawCursor += segment.text.length;
    const end = offsets.rawToPlain(Math.min(rawCursor, markdown.length));
    if (segment.kind === "insert") {
      if (mode === "original") marks.push({ start, end, kind: "insert", text, authorName: "__hidden__", authorColor: segment.author_color, id: segment.change_id });
      else if (mode === "markup" && selected) marks.push({ start, end, kind: "insert", text, authorName: segment.author_name, authorColor: segment.author_color, id: segment.change_id });
    }
  }
  if (mode !== "original") for (const thread of comments.filter((item) => !item.resolved)) {
    const quote = markdownText(thread.quote);
    const validStoredRange = Number.isInteger(thread.anchor_start) && Number.isInteger(thread.anchor_end) && thread.anchor_start >= 0 && thread.anchor_end > thread.anchor_start && thread.anchor_end <= markdown.length && markdown.slice(thread.anchor_start, thread.anchor_end) === thread.quote;
    const legacyRawStart = validStoredRange ? -1 : markdown.indexOf(thread.quote);
    const start = validStoredRange ? offsets.rawToPlain(thread.anchor_start) : legacyRawStart >= 0 ? offsets.rawToPlain(legacyRawStart) : -1;
    const end = validStoredRange ? offsets.rawToPlain(thread.anchor_end) : start + quote.length;
    if (start >= 0 && end > start) marks.push({ start, end, kind: "comment", text: quote, authorName: "Comment", authorColor: "var(--attention)", id: thread.thread_id });
  }
  return marks;
}

function markdownText(value: string) {
  return markdownOffsetMap(value).plain;
}

export function markdownOffsetMap(markdown: string) {
  const skipped = new Uint8Array(markdown.length);
  function skip(start: number, end: number) { for (let index = Math.max(0, start); index < Math.min(markdown.length, end); index++) skipped[index] = 1; }
  for (const match of markdown.matchAll(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+\.)\s+/gm)) skip(match.index, match.index + match[0].length);
  for (const match of markdown.matchAll(/!?\[([^\]]+)\]\(([^)]*)\)/g)) {
    const full = match[0], label = match[1], labelAt = match.index + full.indexOf(label);
    skip(match.index, labelAt); skip(labelAt + label.length, match.index + full.length);
  }
  for (const expression of [/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, /(~~)(?=\S)([\s\S]*?\S)\1/g, /(`+)([^`]*?)\1/g, /(?<!\*)\*(?=\S)([\s\S]*?\S)\*(?!\*)/g, /(?<!_)_(?=\S)([\s\S]*?\S)_(?!_)/g]) {
    for (const match of markdown.matchAll(expression)) { const marker = match[1]?.length ?? 1; skip(match.index, match.index + marker); skip(match.index + match[0].length - marker, match.index + match[0].length); }
  }
  for (let index = 0; index < markdown.length; index++) if (markdown[index] === "\n" || markdown[index] === "\r") skipped[index] = 1;
  const rawByPlain: number[] = [];
  let plain = "";
  for (let raw = 0; raw < markdown.length; raw++) if (!skipped[raw]) { rawByPlain.push(raw); plain += markdown[raw]; }
  return {
    plain,
    rawToPlain(rawOffset: number) { let low = 0, high = rawByPlain.length; while (low < high) { const middle = (low + high) >> 1; if (rawByPlain[middle] < rawOffset) low = middle + 1; else high = middle; } return low; },
    plainToRaw(plainOffset: number) { if (plainOffset <= 0) return rawByPlain[0] ?? 0; if (plainOffset >= rawByPlain.length) return markdown.length; return rawByPlain[plainOffset]; },
    plainEndToRaw(plainOffset: number) { if (plainOffset <= 0) return rawByPlain[0] ?? 0; return (rawByPlain[Math.min(plainOffset, rawByPlain.length) - 1] ?? markdown.length - 1) + 1; },
  };
}

function selectionOffsets(): { start: number; end: number } | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return null;
  const nodes = $getRoot().getAllTextNodes();
  let cursor = 0, anchor: number | null = null, focus: number | null = null;
  for (const node of nodes) {
    const size = node.getTextContentSize();
    if ($isTextNode(selection.anchor.getNode()) && node.getKey() === selection.anchor.key) anchor = cursor + selection.anchor.offset;
    if ($isTextNode(selection.focus.getNode()) && node.getKey() === selection.focus.key) focus = cursor + selection.focus.offset;
    cursor += size;
  }
  return anchor === null || focus === null ? null : { start: Math.min(anchor, focus), end: Math.max(anchor, focus) };
}

function applyMark(mark: Mark) {
  const nodes = $getRoot().getAllTextNodes().filter((node) => !$isRevisionTextNode(node));
  if (mark.kind === "delete") {
    const location = locate(nodes, mark.start);
    if (!location) return;
    const revision = $createRevisionTextNode(mark.text, "delete", mark.authorName, mark.authorColor, mark.id);
    if (location.offset === 0) location.node.insertBefore(revision);
    else if (location.offset >= location.node.getTextContentSize()) location.node.insertAfter(revision);
    else { const [, after] = location.node.splitText(location.offset); after.insertBefore(revision); }
    return;
  }
  let cursor = 0;
  for (const node of nodes) {
    const text = node.getTextContent(); const left = cursor; const right = cursor + text.length; cursor = right;
    const from = Math.max(mark.start, left); const to = Math.min(mark.end, right);
    if (from >= to) continue;
    replaceSlice(node, from - left, to - left, mark);
  }
}

function replaceSlice(node: TextNode, start: number, end: number, mark: Mark) {
  let selected: TextNode;
  if (start === 0 && end === node.getTextContentSize()) selected = node;
  else if (start === 0) [selected] = node.splitText(end);
  else [, selected] = node.splitText(start, end);
  const revision = $createRevisionTextNode(selected.getTextContent(), mark.kind, mark.authorName, mark.authorColor, mark.id)
    .setFormat(selected.getFormat()).setStyle(selected.getStyle());
  revision.setDetail(selected.getDetail()).setMode(selected.getMode());
  selected.replace(revision);
}

function locate(nodes: TextNode[], position: number): { node: TextNode; offset: number } | null {
  let cursor = 0;
  for (const node of nodes) { const end = cursor + node.getTextContentSize(); if (position <= end) return { node, offset: position - cursor }; cursor = end; }
  const last = nodes.at(-1); return last ? { node: last, offset: last.getTextContentSize() } : null;
}
