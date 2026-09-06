"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { MouseEvent, ReactNode } from "react";
import type { ClaimEvidence, DocumentIdentity, DocumentReferenceTarget, ReferenceOrigin, WorkspaceClaim } from "@/lib/workspaceTypes";
import { isSafeDocumentPath } from "@/lib/documentNavigation";
import styles from "./MatterDocuments.module.css";

const SOURCE_MARKER = /\[source:([^\]|;\s]+)(?:\|([^\]]+))?\]/g;
const TRANSPORT = /```claim-support[ \t]*\n([\s\S]*?)\n```[ \t]*(?:\n|$)/g;

export function visibleClaimProse(text: string): string {
  const visible = text.replace(TRANSPORT, (block, payload: string) => {
    try {
      const parsed = JSON.parse(payload);
      return parsed && typeof parsed === "object" && Array.isArray(parsed.claims) ? "" : block;
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
  documents?: DocumentIdentity[];
  surface?: ReferenceOrigin["surface"];
  recordId?: string | null;
  className?: string;
  onOpenEvidence?: (evidence: ClaimEvidence) => void;
  onOpenDocument?: (target: DocumentReferenceTarget) => void;
}

/** Render saved prose and resolve each source marker by source, locator, and claim revision. */
export default function ClaimMarkdown({ text, claims = [], documents = [], surface = "document", recordId, className, onOpenEvidence, onOpenDocument }: ClaimMarkdownProps) {
  const markers: Array<{ label: string; evidence: ClaimEvidence | null; exact: boolean }> = [];
  const renderedClaims = claimsForRenderedText(claims, text);
  const markdown = visibleClaimProse(text).replace(SOURCE_MARKER, (_marker, sourceId: string, locator?: string) => {
    const normalizedLocator = locator?.trim() || null;
    const exact = evidenceForSourceMarker(renderedClaims, sourceId, normalizedLocator);
    const evidence = exact ?? sourceForMarker(claims, sourceId);
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
    a: ({ href = "", children }) => {
      const marker = href.match(/^#themis-source-(\d+)$/);
      if (marker) {
        const item = markers[Number(marker[1])];
        return <button className="claim-source-link" disabled={!item?.evidence || !onOpenEvidence} onClick={() => item?.evidence && onOpenEvidence?.(item.evidence)} title={item?.exact ? "Review this saved passage" : item?.evidence ? "Open the saved source; no unique passage is selected" : "The saved source is unavailable"} type="button">{children}{item?.exact ? null : item?.evidence ? " · source" : " · unavailable"}</button>;
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
