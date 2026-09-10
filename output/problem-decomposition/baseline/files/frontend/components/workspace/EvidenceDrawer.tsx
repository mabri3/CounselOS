"use client";

import { useEffect, useRef } from "react";
import type { EvidenceDrawerProps } from "@/lib/workspaceTypes";
import { isSafeSourceUrl, isSafeVaultPath } from "@/lib/research";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./MatterDocuments.module.css";

function supportLabel(state: NonNullable<NonNullable<EvidenceDrawerProps["evidence"]>["support_state"]>) {
  return ({ supplied: "Supplied", retrieved: "Retrieved", verified: "Verified support", unverified_lead: "Unverified lead", unknown: "Status unknown" })[state];
}

export default function EvidenceDrawer({ evidence, open, onClose, onOpenArtifact }: EvidenceDrawerProps) {
  const drawer = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = drawer.current;
    const focusable = () => Array.from(node?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], summary, [tabindex]:not([tabindex="-1"])') ?? []);
    focusable()[0]?.focus();
    const keydown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== "Tab") return;
      const items = focusable(); if (!items.length) return;
      const first = items[0]; const last = items.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); returnFocus.current?.focus(); };
  }, [open]);
  if (!open) return null;

  const state = evidence?.support_state ?? "unknown";
  const safeUrl = evidence?.url && isSafeSourceUrl(evidence.url) ? evidence.url : null;
  const safePath = evidence?.path && isSafeVaultPath(evidence.path) ? evidence.path : null;
  return <>
    <button aria-label="Close evidence" className={styles.evidenceBackdrop} onClick={onClose} type="button" />
    <aside aria-label="Claim evidence" aria-modal="true" className={styles.evidenceDrawer} ref={drawer} role="dialog">
      <header className={styles.evidenceHeader}>
        <div><span className="record-meta">Source</span><h2 className={styles.evidenceTitle}>{evidence?.source_label || "Source unavailable"}</h2></div>
        <button aria-label="Close evidence drawer" className="btn quiet tiny" onClick={onClose} type="button">Close</button>
      </header>
      {!evidence ? <p role="status">This source record is unavailable.</p> : <div className={styles.evidenceStack}>
        <section className={styles.evidenceCard}>
          <div className={`btn-row ${styles.evidenceActions}`}>
            {safeUrl && <a className="btn primary" href={safeUrl} rel="noopener noreferrer" target="_blank">Open original source ↗</a>}
            {safePath && <button className="btn quiet" onClick={() => { onClose(); onOpenArtifact(safePath); }} type="button">Read saved copy</button>}
          </div>
          {safeUrl && <p className="faint">{new URL(safeUrl).hostname}</p>}
          {!safeUrl && !safePath && <p>No source link is available.</p>}
          <span className={`state-label ${state === "verified" ? "state-healthy" : state === "unverified_lead" || state === "unknown" ? "state-attention" : "state-agent"}`}>{supportLabel(state)}</span>
        </section>
        {evidence.locator && evidence.available_excerpt ? <section className={styles.evidenceCard}>
          <span className="record-meta">Saved passage · {evidence.locator}</span>
          <div className={styles.evidenceReading}><ReactMarkdown remarkPlugins={[remarkGfm]} components={{a: ({href, children}) => isSafeSourceUrl(href) ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> : <span>{children}</span>, img: () => null}}>{evidence.available_excerpt}</ReactMarkdown></div>
        </section> : <p className="faint">No specific passage was saved. Read the original or saved copy to check the source in context.</p>}
        {evidence.explanation && <details className={styles.evidenceCard}><summary>Generated explanation</summary><p>{evidence.explanation}</p></details>}
        <details className={styles.evidenceCard}><summary>Technical details</summary><dl className={styles.evidenceDetails}>
          <dt>Source ID</dt><dd>{evidence.source_id}</dd>
          <dt>Retrieved</dt><dd>{evidence.retrieved_at || "Unknown"}</dd>
          <dt>Claim ID</dt><dd>{evidence.claim_id}</dd>
          <dt>Claim revision</dt><dd>{evidence.claim_revision || "Unavailable"}</dd>
          <dt>Output revision</dt><dd>{evidence.output_revision || "Unavailable"}</dd>
          <dt>Version</dt><dd>{evidence.source_version || evidence.source_hash || "Unknown"}</dd>
        </dl></details>
      </div>}
    </aside>
  </>;
}
