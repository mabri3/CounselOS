"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { getFile } from "@/lib/api";
import {
  exactPassageRange,
  isSafeDocumentPath,
  returnReferenceOrigin,
} from "@/lib/documentNavigation";
import { isSafeVaultPath } from "@/lib/research";
import type { ReferencePreviewProps } from "@/lib/workspaceTypes";
import type { VaultDocument } from "@/lib/types";
import MatterIcon from "./MatterIcon";
import styles from "./MatterDocuments.module.css";

function passage(
  content: string,
  range: { start: number; end: number } | null,
  passageMark: RefObject<HTMLElement | null>,
): ReactNode {
  if (!range) return content;
  return (
    <>
      {content.slice(0, range.start)}
      <mark ref={passageMark}>{content.slice(range.start, range.end)}</mark>
      {content.slice(range.end)}
    </>
  );
}

export default function ReferencePreview({
  target,
  document,
  loading = false,
  error,
  onBack,
  onOpenOriginal,
  onUseInRequest,
  onCreateWorkingCopy,
}: ReferencePreviewProps) {
  const [loaded, setLoaded] = useState<VaultDocument | null>(null);
  const [loadError, setLoadError] = useState("");
  const backButton = useRef<HTMLButtonElement>(null);
  const readingArea = useRef<HTMLPreElement>(null);
  const passageMark = useRef<HTMLElement>(null);

  useEffect(() => {
    const path = document?.path;
    setLoaded(null);
    setLoadError("");
    if (!target || !document || !path) return;
    if (!isSafeDocumentPath(path)) {
      setLoadError("Unsafe reference path blocked.");
      return;
    }
    let current = true;
    void getFile(path)
      .then((result) => {
        if (current) setLoaded(result);
      })
      .catch((cause) => {
        if (current)
          setLoadError(
            cause instanceof Error
              ? cause.message
              : "The referenced document is unavailable.",
          );
      });
    return () => {
      current = false;
    };
  }, [
    document?.document_id,
    document?.path,
    document?.revision,
    target?.document_id,
    target?.path,
    target?.revision,
  ]);

  useEffect(() => {
    if (target) backButton.current?.focus();
  }, [target]);

  const range = useMemo(
    () => (loaded && target ? exactPassageRange(loaded.content, target) : null),
    [loaded, target],
  );
  useEffect(() => {
    const area = readingArea.current;
    if (!area || !loaded) return;
    area.scrollTop = 0;
    const mark = passageMark.current;
    if (!range || !mark) return;
    const centeredTop =
      mark.offsetTop - Math.max(0, (area.clientHeight - mark.offsetHeight) / 2);
    area.scrollTop = Math.max(0, centeredTop);
  }, [loaded, range]);

  if (!target) return null;
  const passageUnavailable = Boolean(
    loaded && (!range || !target.exact_passage_available),
  );
  const originalAvailable = Boolean(
    document &&
    ((document.original_path && isSafeVaultPath(document.original_path)) ||
      (document.kind === "source" && isSafeDocumentPath(document.path))),
  );
  const missing = !document && !loading;
  const actualPath = document?.path ?? target.path;
  const actualRevision = document?.revision || null;
  const requestedRevisionDiffers = Boolean(
    document && target.revision && target.revision !== actualRevision,
  );
  const unavailableMessage =
    error || loadError || "Referenced document or version is unavailable.";

  const sourceState =
    missing || loadError || error
      ? "Source unavailable"
      : document
        ? "Saved source"
        : "Source unavailable";
  const passageState = passageUnavailable
    ? "Exact passage unavailable"
    : loading || !loaded
      ? "Finding exact passage"
      : "Exact passage";
  const excerpt = target.available_excerpt?.trim() || null;

  return (
    <aside aria-label="Source reading" className={styles.reference}>
      <header className={styles.referenceHeader}>
        <button
          className={`btn quiet tiny ${styles.referenceBack}`}
          ref={backButton}
          type="button"
          onClick={() => onBack(returnReferenceOrigin(target.origin))}
        >
          ← Back to {target.origin?.document_id ? "document" : "where you were"}
        </button>
        <div className={styles.referencePageHeading}>
          <div>
            <span className="record-meta">Reading source</span>
            <h2 className={styles.referenceTitle}>Source reading</h2>
          </div>
          <span
            className={`state-label ${passageUnavailable || missing || loadError || error ? "state-attention" : "state-healthy"}`}
          >
            {missing || loadError || error ? "Unavailable" : "Saved"}
          </span>
        </div>
      </header>
      <section className={styles.referenceFileCard}>
        <span className={styles.referenceFileMedallion}>
          <MatterIcon name="file" size={23} />
        </span>
        <div>
          <h3>{document?.title || "Reference unavailable"}</h3>
          <p className={styles.referencePath}>{actualPath}</p>
          <p className={styles.referencePath}>
            {actualRevision
              ? `Saved revision ${actualRevision}`
              : target.revision
                ? `Requested revision ${target.revision}`
                : "Saved revision unavailable"}
            {requestedRevisionDiffers
              ? ` · Requested revision ${target.revision}`
              : ""}
          </p>
        </div>
        <span className={styles.referenceFileKind}>Reading source</span>
      </section>
      <section
        className={styles.referenceExcerpt}
        aria-label="Referenced excerpt"
      >
        <span className="record-meta">Referenced excerpt</span>
        {excerpt ? (
          <blockquote>{excerpt}</blockquote>
        ) : (
          <p>
            {passageState}.{" "}
            {target.locator
              ? `Saved locator: ${target.locator}.`
              : "No excerpt was saved with this reference."}
          </p>
        )}
        <p className={styles.referenceUseNote}>
          <MatterIcon name="eye" size={17} />
          Reading this source does not add it to the agent request.
        </p>
      </section>
      <section aria-label="Source actions" className={styles.referenceFooter}>
        {document ? (
          <>
            {originalAvailable ? (
              <button
                className="btn compact"
                type="button"
                onClick={() => onOpenOriginal(document)}
              >
                Open original
              </button>
            ) : null}
            {document.immutable || !document.editable ? (
              <button
                className="btn compact"
                type="button"
                onClick={() => onCreateWorkingCopy(document)}
              >
                Create working copy
              </button>
            ) : null}
            <button
              className="btn agent compact"
              type="button"
              onClick={() => onUseInRequest(document)}
            >
              Use in this request
            </button>
          </>
        ) : null}
      </section>
      <section
        aria-labelledby="claim-support-heading"
        className={styles.referenceSupport}
      >
        <h3 id="claim-support-heading">Claim support</h3>
        <div className={styles.referenceSupportGrid}>
          <div>
            <span className={styles.referenceSupportIcon}>
              <MatterIcon name="scale" size={21} />
            </span>
            <strong>Claim</strong>
            <p>No linked claim</p>
          </div>
          <div>
            <span className={styles.referenceSupportIcon}>
              <MatterIcon name="file" size={21} />
            </span>
            <strong>Source</strong>
            <p>
              {sourceState}
              {document?.title ? ` · ${document.title}` : ""}
            </p>
          </div>
          <div>
            <span className={styles.referenceSupportIcon}>
              <MatterIcon name="search" size={21} />
            </span>
            <strong>Passage</strong>
            <p>{passageState}</p>
          </div>
          <div>
            <span className={styles.referenceSupportIcon}>
              <MatterIcon name="eye" size={21} />
            </span>
            <strong>Applicability</strong>
            <p>No applicability explanation saved</p>
          </div>
        </div>
      </section>
      <section className={styles.referenceState}>
        <span
          className={`state-label ${passageUnavailable || missing || loadError || error ? "state-attention" : "state-healthy"}`}
        >
          {passageState}
        </span>
        {target.locator ? (
          <span className={styles.referencePath}>
            Saved locator: {target.locator}
          </span>
        ) : null}
      </section>
      {error || loadError || missing ? (
        <div
          className={`warning-callout ${styles.referenceMessage}`}
          role="status"
        >
          {unavailableMessage}
          {!document && target.revision
            ? ` Requested revision: ${target.revision}.`
            : ""}
        </div>
      ) : null}
      {loading || (document && !loaded && !loadError && !error) ? (
        <div className="loading">Loading referenced document…</div>
      ) : null}
      {loaded ? (
        <section className={styles.referenceFullText}>
          <h3>Full saved source</h3>
          {document?.extracted_path === target.path ||
          loaded.path.endsWith(".extracted.md") ? (
            <p className="chat-history-status" style={{ margin: 0 }}>
              Extracted text · The original document layout is not shown.
            </p>
          ) : null}
          <pre
            className={styles.referenceReading}
            data-passage-state={range ? "exact" : "document_only"}
            ref={readingArea}
          >
            {passage(loaded.content, range, passageMark)}
          </pre>
        </section>
      ) : null}
    </aside>
  );
}
