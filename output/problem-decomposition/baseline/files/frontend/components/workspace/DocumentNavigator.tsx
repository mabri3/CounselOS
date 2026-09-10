"use client";

import type {
  DocumentIdentity,
  DocumentKind,
  DocumentNavigatorProps,
} from "@/lib/workspaceTypes";
import MatterIcon from "./MatterIcon";
import styles from "./MatterDocuments.module.css";

export type DocumentGroup = {
  groupId: string;
  title: string;
  documents: DocumentIdentity[];
};

export function groupDocuments(
  documents: readonly DocumentIdentity[],
  kind: DocumentKind,
): DocumentGroup[] {
  const groups = new Map<string, DocumentGroup>();
  for (const document of documents) {
    if (document.kind !== kind) continue;
    const identity = document.work_product_id?.trim() || document.document_id;
    const groupId = `${kind}:${identity}`;
    const group = groups.get(groupId);
    if (group) group.documents.push(document);
    else
      groups.set(groupId, {
        groupId,
        title: document.title,
        documents: [document],
      });
  }
  return [...groups.values()];
}

export function documentType(document: DocumentIdentity): string {
  const name = document.path.split("/").at(-1) || document.path;
  const extension = name.includes(".") ? name.split(".").at(-1) : "file";
  return (extension || "file").toUpperCase();
}

export function lifecycleLabel(document: DocumentIdentity): string {
  if (document.lifecycle_state === "editing_draft") return "Editing draft";
  if (document.lifecycle_state === "reading_source") return "Reading source";
  if (document.lifecycle_state === "final") return "Final";
  if (document.lifecycle_state === "approved") return "Approved";
  return "Matter record";
}

export function documentPickerValue(document: DocumentIdentity): string {
  return JSON.stringify([
    document.document_id,
    document.path,
    document.revision,
  ]);
}

function DocumentGroupList({
  groups,
  duplicateTitles,
  activeDocumentId,
  activePickerValue,
  onOpen,
  onCreateWorkingCopy,
}: {
  groups: DocumentGroup[];
  duplicateTitles: ReadonlySet<string>;
  activeDocumentId: string | null;
  activePickerValue?: string;
  onOpen: DocumentNavigatorProps["onOpen"];
  onCreateWorkingCopy: DocumentNavigatorProps["onCreateWorkingCopy"];
}) {
  return (
    <ul className={styles.documentList}>
      {groups.map((group) => {
        const current = group.documents[0];
        const versions = group.documents.slice(1);
        return (
          <li className={styles.documentItem} key={group.groupId}>
            <div className={styles.documentRow}>
              <span aria-hidden="true" className={styles.documentMedallion}>
                <MatterIcon name="file" size={18} />
              </span>
              <div className={styles.documentRowCopy}>
                <button
                  aria-current={
                    current.document_id === activeDocumentId &&
                    (!activePickerValue ||
                      documentPickerValue(current) === activePickerValue)
                      ? "page"
                      : undefined
                  }
                  className={`btn quiet tiny ${styles.documentButton}`}
                  type="button"
                  onClick={() => onOpen(current)}
                >
                  {group.title}
                </button>
                <span className={styles.documentMeta}>
                  {documentType(current)} · {lifecycleLabel(current)} · Saved
                </span>
              </div>
              <MatterIcon
                className={styles.documentChevron}
                name="chevron"
                size={17}
              />
            </div>
            {duplicateTitles.has(current.title) ? (
              <div className={styles.documentMeta}>{current.path}</div>
            ) : null}
            {current.kind === "source" && !current.editable ? (
              <button
                className={`btn quiet tiny ${styles.documentWorkingCopy}`}
                type="button"
                onClick={() => onCreateWorkingCopy(current)}
              >
                Create working copy
              </button>
            ) : null}
            {versions.length ? (
              <details className={styles.versionDisclosure}>
                <summary>Earlier versions ({versions.length})</summary>
                <ul className={styles.versionList}>
                  {versions.map((version) => (
                    <li
                      className={styles.documentRow}
                      key={`${version.document_id}:${version.revision}`}
                    >
                      <button
                        aria-current={
                          activePickerValue === documentPickerValue(version)
                            ? "page"
                            : undefined
                        }
                        className={`btn quiet tiny ${styles.documentButton}`}
                        type="button"
                        onClick={() => onOpen(version)}
                      >
                        {version.version_id || version.revision}
                      </button>
                      <span className={styles.documentMeta}>
                        {documentType(version)} · {lifecycleLabel(version)} ·
                        Saved
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function DocumentNavigator({
  documents,
  activeDocumentId,
  activeDocumentPath,
  activeDocumentRevision,
  matterRecordsExpanded = false,
  onOpen,
  onCreateWorkingCopy,
}: DocumentNavigatorProps) {
  const workProducts = groupDocuments(documents, "work_product");
  const sources = groupDocuments(documents, "source");
  const matterRecords = groupDocuments(documents, "matter_record");
  const activeDocument = documents.find(
    (document) =>
      document.document_id === activeDocumentId &&
      (!activeDocumentPath || document.path === activeDocumentPath) &&
      (!activeDocumentRevision || document.revision === activeDocumentRevision),
  );
  const activeValue = activeDocument ? documentPickerValue(activeDocument) : "";
  const titleCounts = new Map<string, number>();
  for (const document of documents)
    titleCounts.set(document.title, (titleCounts.get(document.title) ?? 0) + 1);
  const duplicateTitles = new Set(
    [...titleCounts].filter(([, count]) => count > 1).map(([title]) => title),
  );

  return (
    <nav aria-label="Documents" className={styles.navigator}>

      <div className={styles.navigatorGrid}>
        <section
          aria-labelledby="work-products-heading"
          className={styles.navigatorSection}
        >
          <h3
            className={styles.navigatorSectionTitle}
            id="work-products-heading"
          >
            <MatterIcon name="file" size={18} />
            Work products ({workProducts.length})
          </h3>
          <DocumentGroupList
            activeDocumentId={activeDocumentId}
            activePickerValue={activeValue}
            duplicateTitles={duplicateTitles}
            groups={workProducts}
            onCreateWorkingCopy={onCreateWorkingCopy}
            onOpen={onOpen}
          />
        </section>
        <section
          aria-labelledby="sources-heading"
          className={styles.navigatorSection}
        >
          <h3 className={styles.navigatorSectionTitle} id="sources-heading">
            <MatterIcon name="book" size={18} />
            Sources ({sources.length})
          </h3>
          <DocumentGroupList
            activeDocumentId={activeDocumentId}
            activePickerValue={activeValue}
            duplicateTitles={duplicateTitles}
            groups={sources}
            onCreateWorkingCopy={onCreateWorkingCopy}
            onOpen={onOpen}
          />
        </section>
      </div>
      <details className={styles.navigatorRecords} open={matterRecordsExpanded}>
        <summary>
          <MatterIcon name="folder" size={18} />
          Matter records ({matterRecords.length})
          <MatterIcon
            className={styles.summaryChevron}
            name="chevron"
            size={17}
          />
        </summary>
        <DocumentGroupList
          activeDocumentId={activeDocumentId}
          activePickerValue={activeValue}
          duplicateTitles={duplicateTitles}
          groups={matterRecords}
          onCreateWorkingCopy={onCreateWorkingCopy}
          onOpen={onOpen}
        />
      </details>
      <details className={styles.documentPickerDetails}><summary>Find a document</summary>      <label className={`field-block ${styles.navigatorPicker}`}>
        <span className="field-label">Open document</span>
        <select
          className="text-input"
          value={activeValue}
          onChange={(event) => {
            const selected = documents.find(
              (document) =>
                documentPickerValue(document) === event.target.value,
            );
            if (selected) onOpen(selected);
          }}
        >
          <option value="">Choose a document</option>
          {documents.map((document) => (
            <option
              key={documentPickerValue(document)}
              value={documentPickerValue(document)}
            >
              {document.title} · {lifecycleLabel(document)}
              {duplicateTitles.has(document.title) ? ` · ${document.path}` : ""}
            </option>
          ))}
        </select>
      </label>
      </details>
    </nav>
  );
}
