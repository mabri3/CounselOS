"use client";

import { useEffect, useRef } from "react";
import type { EvidenceDrawerProps } from "@/lib/workspaceTypes";
import { isSafeSourceUrl, isSafeVaultPath } from "@/lib/research";
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
    const focusable = () => Array.from(node?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? []);
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
        <div><span className="record-meta">Evidence for claim</span><h2 className={styles.evidenceTitle}>{evidence?.source_label || "Source unavailable"}</h2></div>
        <button aria-label="Close evidence drawer" className="btn quiet tiny" onClick={onClose} type="button">Close</button>
      </header>
      {!evidence ? <div className="warning-callout" role="status"><strong>Evidence unavailable.</strong> The saved answer remains visible.</div> : <div className={styles.evidenceStack}>
        <section className={styles.evidenceCard}><span className={`state-label ${state === "verified" ? "state-healthy" : state === "unverified_lead" || state === "unknown" ? "state-attention" : "state-agent"}`}>{supportLabel(state)}</span><dl className={styles.evidenceDetails}><dt>Claim ID</dt><dd>{evidence.claim_id || "Unknown"}</dd><dt>Claim revision</dt><dd>{evidence.claim_revision || "Legacy or unavailable"}</dd><dt>Output revision</dt><dd>{evidence.output_revision || "Legacy or unavailable"}</dd><dt>Source ID</dt><dd>{evidence.source_id || "Unknown"}</dd><dt>Location</dt><dd>{evidence.locator || "Exact location unavailable"}</dd><dt>Retrieved</dt><dd>{evidence.retrieved_at || "Unknown"}</dd><dt>Version</dt><dd>{evidence.source_version || evidence.source_hash || "Unknown"}</dd></dl><p className="faint">Source support and legal applicability are separate. Supplied or Retrieved does not mean Verified, and no source status proves that the rule applies to this matter.</p></section>
        <section className={styles.evidenceCard}><span className="record-meta">Exact available passage</span>{evidence.available_excerpt ? <blockquote className={styles.evidenceReading}>{evidence.available_excerpt}</blockquote> : <p className={styles.evidenceReading}>No exact passage is available. Retrieval may have failed or the saved source reference may be missing.</p>}</section>
        {evidence.explanation ? <section className={`wash-agent ${styles.evidenceCard}`}><span className="record-meta">Generated explanation · How this source supports this claim</span><p className={styles.evidenceReading}>{evidence.explanation}</p></section> : <section className="warning-callout" role="status"><strong>Claim explanation unavailable.</strong> The source record remains available, but its support for this claim is not explained.</section>}
        <section className={styles.evidenceCard}><span className="record-meta">Open source</span><div className={`btn-row ${styles.evidenceActions}`}>{safeUrl ? <a className="btn quiet tiny" href={safeUrl} rel="noopener noreferrer" target="_blank">Open public source</a> : null}{safePath ? <button className="btn quiet tiny" onClick={() => onOpenArtifact(safePath)} type="button">Open saved source</button> : null}{!safeUrl && !safePath ? <span className="faint">No safe source link is available.</span> : null}</div>{(evidence.url && !safeUrl) || (evidence.path && !safePath) ? <p className="warning-callout" role="status">An unsafe source location was blocked.</p> : null}<p className="faint">Opening a link does not verify the source.</p></section>
      </div>}
    </aside>
  </>;
}
