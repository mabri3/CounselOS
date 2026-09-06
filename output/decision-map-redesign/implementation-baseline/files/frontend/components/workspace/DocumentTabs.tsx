"use client";

import type {
  DocumentIdentity,
  DocumentTabsProps,
  LocalEditorSnapshot,
} from "@/lib/workspaceTypes";
import { lifecycleLabel } from "./DocumentNavigator";
import MatterIcon from "./MatterIcon";
import styles from "./MatterDocuments.module.css";

const VISIBLE_TAB_LIMIT = 4;
export function visibleDocumentTabs(
  documents: readonly DocumentIdentity[],
  activeDocumentId: string | null,
  limit = VISIBLE_TAB_LIMIT,
): { visible: DocumentIdentity[]; overflow: DocumentIdentity[] } {
  if (documents.length <= limit)
    return { visible: [...documents], overflow: [] };
  const visible = documents.slice(0, limit);
  const active = documents.find(
    (document) => document.document_id === activeDocumentId,
  );
  if (
    active &&
    !visible.some((document) => document.document_id === active.document_id)
  )
    visible[limit - 1] = active;
  const visibleIds = new Set(visible.map((document) => document.document_id));
  return {
    visible,
    overflow: documents.filter(
      (document) => !visibleIds.has(document.document_id),
    ),
  };
}

function hasDirtyEdit(
  document: DocumentIdentity,
  localEdits: Record<string, LocalEditorSnapshot>,
): boolean {
  return Boolean(localEdits[document.document_id]?.dirty);
}

function OpenTab({
  document,
  activeDocumentId,
  localEdits,
  onSelect,
  onClose,
  onDiscardLocalEdit,
}: {
  document: DocumentIdentity;
  activeDocumentId: string | null;
  localEdits: Record<string, LocalEditorSnapshot>;
  onSelect: DocumentTabsProps["onSelect"];
  onClose: DocumentTabsProps["onClose"];
  onDiscardLocalEdit: DocumentTabsProps["onDiscardLocalEdit"];
}) {
  const dirty = hasDirtyEdit(document, localEdits);
  return (
    <div
      className={`${styles.tab} ${document.document_id === activeDocumentId ? styles.tabActive : ""}`}
    >
      <button
        aria-current={
          document.document_id === activeDocumentId ? "page" : undefined
        }
        className={`btn quiet tiny ${styles.tabButton}`}
        type="button"
        onClick={() => onSelect(document.document_id)}
      >
        <MatterIcon name="file" size={17} />
        <span>
          <strong>{document.title}</strong>
          <span className={styles.tabMeta}>
            {lifecycleLabel(document)}
            {dirty ? (
              <span className={styles.tabDirty}> · Unsaved</span>
            ) : (
              " · Saved"
            )}
          </span>
        </span>
      </button>
      <button
        aria-label={`Close ${document.title}. ${dirty ? "Local edits will be retained." : ""}`}
        className={`btn quiet tiny ${styles.tabClose}`}
        type="button"
        onClick={() => onClose(document.document_id)}
      >
        ×
      </button>
      {dirty ? (
        <button
          className={`btn quiet tiny ${styles.tabButton} ${styles.tabDiscard}`}
          type="button"
          onClick={() => onDiscardLocalEdit(document.document_id)}
        >
          Discard local edits
        </button>
      ) : null}
    </div>
  );
}

export default function DocumentTabs({
  documents,
  activeDocumentId,
  localEdits,
  onSelect,
  onClose,
  onDiscardLocalEdit,
}: DocumentTabsProps) {
  const { visible, overflow } = visibleDocumentTabs(
    documents,
    activeDocumentId,
  );
  if (!documents.length)
    return <p className={styles.emptyTabs}>No documents are open.</p>;
  return (
    <nav aria-label="Open documents" className={styles.tabs}>
      {visible.map((document) => (
        <OpenTab
          activeDocumentId={activeDocumentId}
          document={document}
          key={document.document_id}
          localEdits={localEdits}
          onClose={onClose}
          onDiscardLocalEdit={onDiscardLocalEdit}
          onSelect={onSelect}
        />
      ))}
      {overflow.length ? (
        <details className={styles.tabOverflow}>
          <summary className="btn quiet tiny">
            More open documents ({overflow.length})
          </summary>
          <div className={styles.tabOverflowList}>
            {overflow.map((document) => (
              <OpenTab
                activeDocumentId={activeDocumentId}
                document={document}
                key={document.document_id}
                localEdits={localEdits}
                onClose={onClose}
                onDiscardLocalEdit={onDiscardLocalEdit}
                onSelect={onSelect}
              />
            ))}
          </div>
        </details>
      ) : null}
    </nav>
  );
}
