"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Children, type MouseEvent, type ReactNode } from "react";
import type { ClaimEvidence, DocumentIdentity, DocumentReferenceTarget, ReferenceOrigin, WorkspaceClaim } from "@/lib/workspaceTypes";
import { isSafeDocumentPath } from "@/lib/documentNavigation";
import styles from "./MatterDocuments.module.css";

const SOURCE_MARKER = /\[source:([^\]|;\s]+)(?:\|([^\]]+))?\]/g;
const TRANSPORT = /```(claim-support|decision-paths)[ \t]*\n([\s\S]*?)\n```[ \t]*(?:\n|$)/g;

export function visibleClaimProse(text: string): string {
  const visible = text.replace(TRANSPORT, (block, kind: string, payload: string) => {
    try {
      const parsed = JSON.parse(payload);
      if (!parsed || typeof parsed !== "object") return block;
      const structured = kind === "claim-support" ? Array.isArray(parsed.claims)
        : Array.isArray(parsed.issue_analyses) || (parsed.issue_analysis && typeof parsed.issue_analysis === "object" && !Array.isArray(parsed.issue_analysis));
      return structured ? "" : block;
    } catch { return block; }
  }).trimEnd();
  return visible.trim() ? visible : text.trimEnd();
}

export function evidenceForSourceMarker(claims: WorkspaceClaim[], sourceId: string, locator?: string | null): ClaimEvidence | null {
  const normalizedLocator = locator?.trim() || null;
  const matches = claims.flatMap((claim) => claim.evidence.map((evidence) => ({ claim, evidence }))).filter(({ claim, evidence }) =>
    evidence.source_id === sourceId
    && (!normalizedLocator || evidence.locator?.trim() === normalizedLocator)
    && (!evidence.output_revision || !claim.output_revision || evidence.output_revision === claim.output_revision)
    && (!evidence.claim_revision || !claim.claim_revision || evidence.claim_revision === claim.claim_revision));
  return matches.length === 1 ? matches[0].evidence : null;
}

export function claimsForRenderedText(claims: WorkspaceClaim[], text: string): WorkspaceClaim[] {
  const prose = visibleClaimProse(text);
  return claims.filter((claim) => {
    const statement = claim.text?.trim();
    return Boolean(statement && prose.includes(statement));
  });
}

export function sourceForMarker(claims: WorkspaceClaim[], sourceId: string): ClaimEvidence | null {
  const matches = claims.flatMap((claim) => claim.evidence.map((evidence) => ({ claim, evidence }))).filter(({ claim, evidence }) =>
    evidence.source_id === sourceId
    && (!evidence.output_revision || !claim.output_revision || evidence.output_revision === claim.output_revision)
    && (!evidence.claim_revision || !claim.claim_revision || evidence.claim_revision === claim.claim_revision));
  const sources = new Map<string, ClaimEvidence[]>();
  for (const { evidence } of matches) {
    const key = `${evidence.source_id}\u0000${evidence.path ?? ""}\u0000${evidence.url ?? ""}`;
    sources.set(key, [...(sources.get(key) ?? []), evidence]);
  }
  if (sources.size !== 1) return null;
  const sourceEvidence = [...sources.values()][0];
  const evidence = sourceEvidence[0];
  const versions = new Set(sourceEvidence.map((item) => item.source_version).filter(Boolean));
  return {
      claim_id: `source:${evidence.source_id}`,
      source_id: evidence.source_id,
      source_label: evidence.source_label,
      path: evidence.path,
      url: evidence.url,
      source_version: versions.size === 1 ? evidence.source_version : null,
      support_state: evidence.support_state,
  };
}

function safeDecodePath(href: string): string | null {
  try { return decodeURIComponent(href.replace(/^\.\//, "")); }
  catch { return null; }
}

function safePublicUrl(value: string): boolean {
  try { return ["http:", "https:", "mailto:"].includes(new URL(value).protocol); }
  catch { return false; }
}

function origin(surface: ReferenceOrigin["surface"], recordId?: string | null): ReferenceOrigin {
  return { surface, record_id: recordId ?? null, focus_id: typeof document === "undefined" ? null : document.activeElement instanceof HTMLElement ? document.activeElement.id || null : null, scroll_offset: typeof window === "undefined" ? null : window.scrollY };
}

export interface ClaimMarkdownProps {
  text: string;
  claims?: WorkspaceClaim[];
  sources?: ClaimEvidence[];
  documents?: DocumentIdentity[];
  surface?: ReferenceOrigin["surface"];
  recordId?: string | null;
  className?: string;
  separateParagraphLines?: boolean;
  onOpenEvidence?: (evidence: ClaimEvidence) => void;
  onOpenDocument?: (target: DocumentReferenceTarget) => void;
}

/** Render saved prose and resolve each source marker by source, locator, and claim revision. */
export default function ClaimMarkdown({ text, claims = [], sources = [], documents = [], surface = "document", recordId, className, separateParagraphLines = false, onOpenEvidence, onOpenDocument }: ClaimMarkdownProps) {
  const markers: Array<{ label: string; evidence: ClaimEvidence | null; exact: boolean }> = [];
  const renderedClaims = claimsForRenderedText(claims, text);
  const markdown = visibleClaimProse(text).replace(SOURCE_MARKER, (_marker, sourceId: string, locator?: string) => {
    const normalizedLocator = locator?.trim() || null;
    const exact = evidenceForSourceMarker(renderedClaims, sourceId, normalizedLocator);
    const savedSources = sources.filter(source => source.source_id === sourceId && (!normalizedLocator || source.locator === normalizedLocator));
    const matched = exact ?? (savedSources.length === 1 ? savedSources[0] : null) ?? sourceForMarker(claims, sourceId);
    const copies = documents.filter(doc => doc.document_id === sourceId && doc.kind === "source");
    // Legacy chat may retain only an ID. Resolve a unique saved source without claiming an exact passage.
    const copy = copies.length === 1 ? copies[0] : null;
    const evidence = matched?.url || matched?.path ? matched : copy ? {
      claim_id: `source:${sourceId}`, source_id: sourceId, source_label: copy.title,
      path: copy.path, url: copy.source_url,
    } : matched;
    const index = markers.push({ label: normalizedLocator ? `${sourceId} · ${normalizedLocator}` : sourceId, evidence, exact: Boolean(exact) }) - 1;
    return `[${normalizedLocator ? `Source: ${sourceId} · ${normalizedLocator}` : `Source: ${sourceId}`}](#themis-source-${index})`;
  });

  function openInternal(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const decoded = safeDecodePath(href);
    if (!decoded) return;
    const match = documents.find((item) => item.path === decoded);
    if (!match || !onOpenDocument || !isSafeDocumentPath(match.path)) return;
    event.preventDefault();
    onOpenDocument({ document_id: match.document_id, path: match.path, revision: match.revision, origin: origin(surface, recordId) });
  }

  return <div className={[styles.claim, className].filter(Boolean).join(" ")}><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    p: ({ children }) => {
      if (!separateParagraphLines) return <p>{children}</p>;
      const lines: ReactNode[][] = [[]];
      Children.forEach(children, child => {
        if (typeof child !== "string") { lines[lines.length - 1].push(child); return; }
        child.split("\n").forEach((part, index) => {
          if (index) lines.push([]);
          if (part) lines[lines.length - 1].push(part);
        });
      });
      return <>{lines.filter(line => line.length).map((line, index) => <p key={index}>{line}</p>)}</>;
    },
    a: ({ href = "", children }) => {
      const marker = href.match(/^#themis-source-(\d+)$/);
      if (marker) {
        const item = markers[Number(marker[1])];
        const evidence = item?.evidence;
        const publicUrl = evidence?.url && /^https?:/.test(evidence.url) && safePublicUrl(evidence.url) ? evidence.url : null;
        const saved = evidence?.path && isSafeDocumentPath(evidence.path) ? documents.find(doc => doc.path === evidence.path) : null;
        const label = evidence?.source_label || (publicUrl ? new URL(publicUrl).hostname : "Source");
        const openSaved = saved && onOpenDocument ? () => onOpenDocument({ document_id: saved.document_id, path: saved.path, revision: saved.revision, origin: origin(surface, recordId) }) : null;
        if (publicUrl) return <span><a className="claim-source-link" href={publicUrl} target="_blank" rel="noopener noreferrer" title="Open original source">{label}</a>{openSaved ? <> · <button className="claim-source-link" onClick={openSaved} type="button" aria-label={`Saved copy of ${label}`}>Saved copy</button></> : evidence?.path && onOpenEvidence ? <> · <button className="claim-source-link" onClick={() => onOpenEvidence(evidence)} type="button">Source details</button></> : null}</span>;
        return <button className="claim-source-link" disabled={!evidence || (!openSaved && !onOpenEvidence)} onClick={() => openSaved ? openSaved() : evidence && onOpenEvidence?.(evidence)} title="Open saved source" type="button">{label}{!evidence ? " · unavailable" : ""}</button>;
      }
      if (safePublicUrl(href)) return <a href={href} rel="noreferrer" target="_blank">{children}</a>;
      const decoded = safeDecodePath(href);
      const internal = decoded !== null && documents.some((item) => item.path === decoded);
      if (internal) return <a href={href} onClick={(event) => openInternal(event, href)}>{children}</a>;
      return <span title="Unsafe or unavailable link">{children}</span>;
    },
    table: ({ children }: { children?: ReactNode }) => <div className="claim-table-scroll"><table>{children}</table></div>,
  }}>{markdown}</ReactMarkdown></div>;
}
