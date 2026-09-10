"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import ContextTray from "./ContextTray";
import type {
  ContextSelection,
  DocumentReferenceTarget,
  FileUploadBatch,
  FileUploadOutcome,
  MatterFileEntry,
  MatterFilesPanelProps,
} from "@/lib/workspaceTypes";
import { isSafeVaultPath } from "@/lib/research";
import styles from "./MatterTools.module.css";

type UploadOutcome = Omit<FileUploadOutcome, "state"> & {
  state: FileUploadOutcome["state"] | "pending" | "completed" | "unknown";
  input: File;
};
type UploadBatch = {
  id: string;
  destination: "library" | "inquiry";
  outcomes: UploadOutcome[];
};
type ReferenceAwareMatterFilesPanelProps = MatterFilesPanelProps & {
  onOpenReference?: (target: DocumentReferenceTarget) => void;
  /** Render in the Tools & history page instead of the modal drawer. */
  embedded?: boolean;
};
function extractionLabel(state: MatterFileEntry["extraction_state"]) {
  return {
    pending: "Preparing",
    complete: "Text ready",
    partial: "Partial text",
    failed: "Preview failed",
    unsupported: "Unsupported type",
    not_applicable: "Saved output",
  }[state];
}
function stateClass(state: MatterFileEntry["extraction_state"]) {
  if (state === "complete" || state === "not_applicable")
    return "state-healthy";
  if (state === "failed" || state === "unsupported") return "state-failure";
  return state === "partial" ? "state-attention" : "state-agent";
}
export function uploadState(outcomes: UploadOutcome[]) {
  if (outcomes.some((outcome) => outcome.state === "pending"))
    return { word: "Preparing", tone: "state-agent" };
  const failed = outcomes.filter(
    (outcome) => outcome.state === "failed",
  ).length;
  const partial = outcomes.filter(
    (outcome) => outcome.state === "partial",
  ).length;
  if (failed === outcomes.length)
    return { word: "Failed", tone: "state-failure" };
  if (failed || partial) return { word: "Partial", tone: "state-attention" };
  if (outcomes.every((outcome) => outcome.state === "saved"))
    return { word: "Saved", tone: "state-healthy" };
  return { word: "Completed", tone: "state-agent" };
}
export function normalizeUpload(
  result: FileUploadBatch | void,
  inputs: File[],
): UploadOutcome[] {
  if (!result)
    return inputs.map((input, index) => ({
      input,
      name: input.name,
      state: "completed",
      retry_key: `legacy-${index}`,
      failure_detail: "Per-file result not supplied by this upload path.",
    }));
  return inputs.map((input, index) => {
    const outcome = result.outcomes[index];
    return outcome
      ? { ...outcome, input }
      : {
          input,
          name: input.name,
          state: "unknown",
          retry_key: `missing-${index}`,
          failure_detail: "No result was returned for this file.",
        };
  });
}

export function matterFileReferenceTarget(
  file: MatterFileEntry,
  path: string,
): DocumentReferenceTarget {
  return {
    document_id: file.source_id?.trim() || file.reference_id,
    path,
    // The companion has its own text revision. Resolve its current saved copy.
    revision: path === file.path ? file.revision ?? null : null,
    origin: {
      surface: "document",
      record_id: file.reference_id,
      focus_id: `matter-file-${file.reference_id}`,
    },
  };
}

export default function MatterFilesPanel(
  props: ReferenceAwareMatterFilesPanelProps,
) {
  const {
    open,
    files,
    onClose,
    onUpload,
    onOpenArtifact,
    onOpenReference,
    onRetryFile,
    manifest,
    busy = false,
    embedded = false,
  } = props;
  const [view, setView] = useState<"files" | "context">("files");
  const [query, setQuery] = useState("");
  const [selections, setSelections] = useState(props.selections);
  const [selectionSaving, setSelectionSaving] = useState(false);
  const [selectionDirty, setSelectionDirty] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  const [batches, setBatches] = useState<UploadBatch[]>([]);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [retryError, setRetryError] = useState<Record<string, string>>({});
  const [pickerDestination, setPickerDestination] = useState<
    "library" | "inquiry"
  >("library");
  const input = useRef<HTMLInputElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!selectionSaving && !selectionDirty) setSelections(props.selections);
  }, [props.selections, selectionSaving, selectionDirty]);
  useEffect(() => {
    if (!open || embedded) return;
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const node = drawer.current;
    const focusable = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusable()[0]?.focus();
    const keydown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      returnFocus.current?.focus();
    };
  }, [embedded, open]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return needle
      ? files.filter((file) =>
          `${file.name} ${file.path}`.toLocaleLowerCase().includes(needle),
        )
      : files;
  }, [files, query]);
  if (!open) return null;

  async function saveSelections(next: ContextSelection[]) {
    setSelections(next);
    setSelectionDirty(true);
    setSelectionSaving(true);
    setSelectionError("");
    try {
      await props.onChange(next);
      setSelectionDirty(false);
    } catch (cause) {
      setSelectionError(
        cause instanceof Error
          ? cause.message
          : "Selection was not saved. Your choice is retained so you can retry.",
      );
      throw cause;
    } finally {
      setSelectionSaving(false);
    }
  }
  async function toggleFile(file: MatterFileEntry) {
    const existing = selections.find(
      (item) => item.reference_id === file.reference_id,
    );
    const selected = existing ? existing.selected !== false : file.selected;
    const next = existing
      ? selections.map((item) =>
          item.reference_id === file.reference_id
            ? { ...item, selected: !selected }
            : item,
        )
      : [
          ...selections,
          {
            reference_id: file.reference_id,
            path: file.path,
            role:
              file.kind === "work_product" ? "generated_output" : "source_file",
            selected: !selected,
            mandatory: false,
            revision: file.revision,
          },
        ];
    try {
      await saveSelections(next);
    } catch {
      /* local selection is intentionally retained */
    }
  }
  async function upload(
    batchFiles: File[],
    destination: "library" | "inquiry",
  ) {
    if (!batchFiles.length) return;
    const id =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    setBatches((current) => [
      ...current,
      {
        id,
        destination,
        outcomes: batchFiles.map((input, index) => ({
          input,
          name: input.name,
          state: "pending",
          retry_key: `pending-${index}`,
        })),
      },
    ]);
    try {
      const result = await onUpload(batchFiles, destination);
      setBatches((current) =>
        current.map((batch) =>
          batch.id === id
            ? { ...batch, outcomes: normalizeUpload(result, batchFiles) }
            : batch,
        ),
      );
    } catch (cause) {
      const detail =
        cause instanceof Error
          ? cause.message
          : "Upload failed. The batch is retained for retry.";
      setBatches((current) =>
        current.map((batch) =>
          batch.id === id
            ? {
                ...batch,
                outcomes: batch.outcomes.map((outcome) => ({
                  ...outcome,
                  state: "failed",
                  failure_detail: detail,
                })),
              }
            : batch,
        ),
      );
    }
  }
  async function retryUpload(batchId: string, retryKey: string) {
    const batch = batches.find((item) => item.id === batchId);
    const outcome = batch?.outcomes.find((item) => item.retry_key === retryKey);
    if (!batch || !outcome) return;
    setBatches((current) =>
      current.map((item) =>
        item.id === batchId
          ? {
              ...item,
              outcomes: item.outcomes.map((candidate) =>
                candidate.retry_key === retryKey
                  ? { ...candidate, state: "pending", failure_detail: null }
                  : candidate,
              ),
            }
          : item,
      ),
    );
    try {
      const result = await onUpload([outcome.input], batch.destination);
      const next = normalizeUpload(result, [outcome.input])[0];
      setBatches((current) =>
        current.map((item) =>
          item.id === batchId
            ? {
                ...item,
                outcomes: item.outcomes.map((candidate) =>
                  candidate.retry_key === retryKey ? next : candidate,
                ),
              }
            : item,
        ),
      );
    } catch (cause) {
      const detail =
        cause instanceof Error
          ? cause.message
          : "Upload failed. The batch is retained for retry.";
      setBatches((current) =>
        current.map((item) =>
          item.id === batchId
            ? {
                ...item,
                outcomes: item.outcomes.map((candidate) =>
                  candidate.retry_key === retryKey
                    ? { ...candidate, state: "failed", failure_detail: detail }
                    : candidate,
                ),
              }
            : item,
        ),
      );
    }
  }
  function chooseFiles(destination: "library" | "inquiry") {
    setPickerDestination(destination);
    input.current?.click();
  }
  function drop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    void upload(
      Array.from(event.dataTransfer.files ?? []),
      view === "context" ? "inquiry" : "library",
    );
  }
  async function retry(file: MatterFileEntry) {
    setRetrying(file.reference_id);
    setRetryError((current) => ({ ...current, [file.reference_id]: "" }));
    try {
      await onRetryFile(file.reference_id);
    } catch (cause) {
      setRetryError((current) => ({
        ...current,
        [file.reference_id]:
          cause instanceof Error
            ? cause.message
            : "Retry failed. The saved file remains available.",
      }));
    } finally {
      setRetrying(null);
    }
  }
  function openSource(file: MatterFileEntry, path: string) {
    if (onOpenReference) onOpenReference(matterFileReferenceTarget(file, path));
    else onOpenArtifact(path);
  }

  return (
    <>
      {!embedded ? (
        <button
          aria-label="Close files and context"
          className={styles.filesBackdrop}
          onClick={onClose}
          type="button"
        />
      ) : null}
      <aside
        aria-label="Files and context"
        aria-modal={embedded ? undefined : "true"}
        className={`${styles.filesPanel} ${embedded ? styles.filesPanelEmbedded : ""}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={drop}
        ref={drawer}
        role={embedded ? undefined : "dialog"}
      >
        <header className={styles.filesHeader}>
          <div>
            {!embedded ? (
              <span className="record-meta">Matter workspace</span>
            ) : null}
            <h2 className={styles.filesTitle}>Files &amp; context</h2>
          </div>
          {!embedded ? (
            <button
              aria-label="Close files and context panel"
              className="btn quiet tiny"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          ) : null}
        </header>
        <div
          aria-label="Files and context views"
          className={`btn-row ${styles.filesTabs}`}
          role="tablist"
        >
          <button
            aria-selected={view === "files"}
            className={`btn tiny ${view === "files" ? "" : "quiet"}`}
            onClick={() => setView("files")}
            role="tab"
            type="button"
          >
            Matter files
          </button>
          <button
            aria-selected={view === "context"}
            className={`btn tiny ${view === "context" ? "" : "quiet"}`}
            onClick={() => setView("context")}
            role="tab"
            type="button"
          >
            Inquiry context
          </button>
        </div>
        <input
          hidden
          multiple
          onChange={(event) => {
            void upload(
              Array.from(event.target.files ?? []),
              pickerDestination,
            );
            event.target.value = "";
          }}
          ref={input}
          type="file"
        />

        <div className={`btn-row ${styles.filesActions}`}>
          <button
            className="btn tiny"
            disabled={busy}
            onClick={() => chooseFiles("library")}
            type="button"
          >
            Add files to library
          </button>
          <button
            className="btn primary tiny"
            disabled={busy}
            onClick={() => chooseFiles("inquiry")}
            type="button"
          >
            Add files to inquiry
          </button>
        </div>
        <p className={styles.filesCopy}>
          You can add several files now and add another batch while earlier
          files are preparing. Dropped files go to the current view.
        </p>
        {batches.length ? (
          <section aria-label="Recent uploads" className={styles.uploadList}>
            {batches.map((batch) => {
              const summary = uploadState(batch.outcomes);
              return (
                <div className={styles.uploadCard} key={batch.id}>
                  <div className={styles.uploadHeading}>
                    <span className={`state-label ${summary.tone}`}>
                      {summary.word}
                    </span>
                    <strong>
                      {batch.destination === "inquiry"
                        ? "Inquiry upload"
                        : "Library upload"}
                    </strong>
                  </div>
                  <div className={styles.uploadRows}>
                    {batch.outcomes.map((outcome, index) => (
                      <div
                        className={styles.uploadRow}
                        key={`${outcome.retry_key}:${index}`}
                      >
                        <div className={styles.uploadHeading}>
                          <span className={styles.fileName}>
                            {outcome.name}
                          </span>
                          <span
                            className={`state-label ${outcome.state === "saved" ? "state-healthy" : outcome.state === "failed" ? "state-failure" : outcome.state === "partial" || outcome.state === "unknown" ? "state-attention" : "state-agent"}`}
                          >
                            {outcome.state === "saved"
                              ? "Saved"
                              : outcome.state === "partial"
                                ? "Saved · Partial text"
                                : outcome.state === "failed"
                                  ? "Not saved"
                                  : outcome.state === "pending"
                                    ? "Preparing"
                                    : outcome.state === "unknown"
                                      ? "Status unavailable"
                                      : "Completed"}
                          </span>
                        </div>
                        {outcome.failure_detail ? (
                          <p className={styles.filesCopy}>
                            {outcome.failure_detail}
                          </p>
                        ) : null}
                        {outcome.state === "failed" ? (
                          <button
                            className="btn quiet tiny"
                            onClick={() =>
                              void retryUpload(batch.id, outcome.retry_key)
                            }
                            type="button"
                          >
                            Retry {outcome.name}
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        ) : null}

        {view === "files" ? (
          <section aria-label="Matter files" className={styles.filesContent}>
            <label className="field-block">
              <span className="field-label">Find by name or folder</span>
              <input
                className="text-input"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search matter files"
                type="search"
                value={query}
              />
            </label>
            {props.folderView ? (
              <details className={styles.folderView}>
                <summary className="btn quiet tiny">Folder view</summary>
                <div className={styles.folderBody}>{props.folderView}</div>
              </details>
            ) : null}
            {selectionError ? (
              <div className="warning-callout" role="status">
                <strong>Selection not saved.</strong> {selectionError}{" "}
                <button
                  className="btn quiet tiny"
                  disabled={selectionSaving}
                  onClick={() =>
                    void saveSelections(selections).catch(() => undefined)
                  }
                  type="button"
                >
                  Retry
                </button>
              </div>
            ) : null}
            {filtered.length ? (
              <div className={styles.filesList}>
                {filtered.map((file) => {
                  const selected =
                    selections.find(
                      (item) => item.reference_id === file.reference_id,
                    )?.selected ?? file.selected;
                  const original =
                    file.original_path && isSafeVaultPath(file.original_path)
                      ? file.original_path
                      : null;
                  const extracted =
                    file.extracted_path && isSafeVaultPath(file.extracted_path)
                      ? file.extracted_path
                      : null;
                  const artifact =
                    file.kind === "work_product" && isSafeVaultPath(file.path)
                      ? file.path
                      : null;
                  return (
                    <article
                      className={styles.fileCard}
                      id={`matter-file-${file.reference_id}`}
                      key={`${file.reference_id}:${file.path}`}
                    >
                      <div className={styles.fileHeading}>
                        <div>
                          <strong className={styles.fileName}>
                            {file.name}
                          </strong>
                          <p className={styles.filesCopy}>
                            {file.kind === "work_product"
                              ? "Generated output"
                              : file.kind === "source"
                                ? "Supplied source"
                                : "Matter file"}{" "}
                            · {file.path}
                          </p>
                        </div>
                        <span
                          className={`state-label ${stateClass(file.extraction_state)}`}
                        >
                          {extractionLabel(file.extraction_state)}
                        </span>
                      </div>
                      <p className={styles.filesCopy}>
                        Saved: {file.saved_at || "Unknown"}
                        {file.source_id
                          ? ` · Source ID: ${file.source_id}`
                          : " · Source ID: Unknown"}
                      </p>
                      {file.failure_detail ? (
                        <p className="warning-callout" role="status">
                          {file.failure_detail}
                        </p>
                      ) : null}
                      <div className={`btn-row ${styles.fileActions}`}>
                        <button
                          className={`btn tiny ${selected ? "" : "quiet"}`}
                          disabled={busy || selectionSaving}
                          onClick={() => void toggleFile(file)}
                          type="button"
                        >
                          {selected
                            ? selectionDirty
                              ? "Selected · Not saved"
                              : "Selected for next inquiry"
                            : selectionDirty
                              ? "Available · Not saved"
                              : "Add to next inquiry"}
                        </button>
                        {original ? (
                          <button
                            className="btn quiet tiny"
                            onClick={() => openSource(file, original)}
                            type="button"
                          >
                            Open original
                          </button>
                        ) : null}
                        {extracted ? (
                          <button
                            className="btn quiet tiny"
                            onClick={() => openSource(file, extracted)}
                            type="button"
                          >
                            Open extracted text
                          </button>
                        ) : null}
                        {artifact ? (
                          <button
                            className="btn quiet tiny"
                            onClick={() => onOpenArtifact(artifact)}
                            type="button"
                          >
                            Open generated output
                          </button>
                        ) : null}
                        {["failed", "partial"].includes(
                          file.extraction_state,
                        ) ? (
                          <button
                            className="btn quiet tiny"
                            disabled={retrying === file.reference_id}
                            onClick={() => void retry(file)}
                            type="button"
                          >
                            {retrying === file.reference_id
                              ? "Retrying…"
                              : "Retry preview"}
                          </button>
                        ) : null}
                      </div>
                      {retryError[file.reference_id] ? (
                        <p className="warning-callout" role="status">
                          {retryError[file.reference_id]}
                        </p>
                      ) : null}
                      {!original && file.original_path ? (
                        <p className="warning-callout" role="status">
                          Unsafe original path blocked.
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className={styles.filesCopy}>No files match this search.</p>
            )}
          </section>
        ) : (
          <div className={styles.contextContent}>
            <ContextTray
              busy={busy || selectionSaving}
              manifest={manifest}
              onChange={saveSelections}
              selections={selections}
            />
          </div>
        )}
      </aside>
    </>
  );
}
