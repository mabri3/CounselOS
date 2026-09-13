import type {
  DocumentIdentity,
  DocumentReferenceTarget,
  LocalEditorSnapshot,
  ReferenceOrigin,
  ResolvedDocumentReference,
} from "./workspaceTypes";

const SNAPSHOT_PREFIX = "themis:document-edit:";

export interface FrozenDocumentTarget {
  document_id: string;
  path: string;
  revision: string;
}

export function documentVersionKey(document: Pick<DocumentIdentity, "document_id" | "path" | "revision">): string {
  return JSON.stringify([document.document_id, document.path, document.revision]);
}

export function localEditorSnapshotStorageKey(matterId: string, documentId: string): string {
  return `${SNAPSHOT_PREFIX}${encodeURIComponent(matterId)}:${encodeURIComponent(documentId)}`;
}

function selectedRange(value: unknown): LocalEditorSnapshot["selected_range"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const range = value as Record<string, unknown>;
  if (typeof range.start !== "number" || typeof range.end !== "number" || typeof range.text !== "string") return null;
  return { start: range.start, end: range.end, text: range.text };
}

export function normalizeLocalEditorSnapshot(value: unknown): LocalEditorSnapshot | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const saved = value as Record<string, unknown>;
  if (typeof saved.document_id !== "string" || !saved.document_id.trim()) return null;
  if (typeof saved.path !== "string" || !saved.path.trim() || typeof saved.content !== "string") return null;
  return {
    document_id: saved.document_id,
    path: saved.path,
    content: saved.content,
    base_revision: typeof saved.base_revision === "string" ? saved.base_revision : "",
    review_revision: typeof saved.review_revision === "string" ? saved.review_revision : null,
    dirty: saved.dirty === true,
    selected_range: selectedRange(saved.selected_range),
    recoverable: saved.recoverable === true,
    updated_at: typeof saved.updated_at === "string" ? saved.updated_at : null,
  };
}

export function readLocalEditorSnapshot(
  storage: Pick<Storage, "getItem">,
  matterId: string,
  documentId: string,
): LocalEditorSnapshot | null {
  try {
    const raw = storage.getItem(localEditorSnapshotStorageKey(matterId, documentId));
    return raw ? normalizeLocalEditorSnapshot(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeLocalEditorSnapshot(
  storage: Pick<Storage, "setItem">,
  matterId: string,
  snapshot: LocalEditorSnapshot,
): void {
  const normalized = normalizeLocalEditorSnapshot(snapshot);
  if (!normalized?.document_id) return;
  storage.setItem(localEditorSnapshotStorageKey(matterId, normalized.document_id), JSON.stringify(normalized));
}

export function discardLocalEditorSnapshot(
  storage: Pick<Storage, "removeItem">,
  matterId: string,
  documentId: string,
): void {
  storage.removeItem(localEditorSnapshotStorageKey(matterId, documentId));
}

export function recoverableLocalEditorSnapshot(snapshot: LocalEditorSnapshot, now = new Date().toISOString()): LocalEditorSnapshot {
  return { ...snapshot, dirty: true, recoverable: true, updated_at: now };
}

export function mutationBasisForSnapshot(snapshot: Pick<LocalEditorSnapshot, "base_revision" | "review_revision">): {
  expected_revision: string;
  expected_review_revision?: string;
} {
  return { expected_revision: snapshot.base_revision, expected_review_revision: snapshot.review_revision ?? undefined };
}

export function snapshotForDocument(
  document: Pick<DocumentIdentity, "document_id" | "path"> | null | undefined,
  snapshot: LocalEditorSnapshot | null | undefined,
): LocalEditorSnapshot | null {
  if (!document || !snapshot?.dirty) return null;
  return snapshot.document_id === document.document_id && snapshot.path === document.path ? snapshot : null;
}

export function freezeDocumentTarget(document: Pick<DocumentIdentity, "document_id" | "path" | "revision">): FrozenDocumentTarget {
  return { document_id: document.document_id, path: document.path, revision: document.revision };
}

export function sameDocumentTarget(
  left: FrozenDocumentTarget | null | undefined,
  right: Pick<DocumentIdentity, "document_id" | "path" | "revision"> | null | undefined,
): boolean {
  return Boolean(left && right
    && left.document_id === right.document_id
    && left.path === right.path
    && left.revision === right.revision);
}

export function isSafeDocumentPath(path: string): boolean {
  return Boolean(path)
    && !path.startsWith("/")
    && !path.startsWith("\\")
    && !path.includes("\\")
    && path.split("/").every((part) => Boolean(part) && part !== "." && part !== "..");
}

/** Resolve only saved identity fields. A title or duplicate file name is never a fallback. */
export function resolveDocumentReference(
  documents: readonly DocumentIdentity[],
  target: DocumentReferenceTarget,
): ResolvedDocumentReference {
  if (!isSafeDocumentPath(target.path)) {
    return { target, document: null, passage_state: "missing", message: "Unsafe reference path blocked." };
  }
  const document = documents.find((candidate) => candidate.document_id === target.document_id
    && candidate.path === target.path
    && (!target.revision || candidate.revision === target.revision));
  if (!document) {
    return { target, document: null, passage_state: "missing", message: "Referenced document or version is unavailable." };
  }
  return {
    target,
    document,
    passage_state: target.exact_passage_available ? "exact" : "document_only",
    message: target.exact_passage_available ? undefined : "Exact passage unavailable",
  };
}

export function referenceOpenMode(document: DocumentIdentity, drafting: boolean): "tab" | "preview" {
  return drafting && document.kind === "source" ? "preview" : "tab";
}

export function exactPassageRange(
  content: string,
  target: Pick<DocumentReferenceTarget, "available_excerpt" | "exact_passage_available" | "locator">,
): { start: number; end: number } | null {
  if (!target.exact_passage_available) return null;
  const candidate = target.available_excerpt?.trim() || target.locator?.trim();
  if (!candidate) return null;
  const start = content.indexOf(candidate);
  if (start < 0 || content.indexOf(candidate, start + candidate.length) >= 0) return null;
  return { start, end: start + candidate.length };
}

export function returnReferenceOrigin(origin: ReferenceOrigin | null | undefined): ReferenceOrigin {
  return origin ?? { surface: "document", focus_id: null, scroll_offset: null };
}
