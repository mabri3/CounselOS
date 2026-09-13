"use client";

import ReactMarkdown from "react-markdown";
import { separateChatSections } from "@/lib/chatMarkdown";
import { markdownDisclosures } from "@/lib/markdownDisclosures";
import remarkGfm from "remark-gfm";
import { Children, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { ClaimEvidence, DocumentIdentity, DocumentReferenceTarget, ReferenceOrigin, WorkspaceClaim } from "@/lib/workspaceTypes";
import { isSafeDocumentPath } from "@/lib/documentNavigation";
import styles from "./MatterDocuments.module.css";

const SOURCE_MARKER = /\[source:([^\]|;\s]+)(?:\|([^\]]+))?\]/g;
const TRANSPORT = /```(claim-support|decision-paths|problem-analysis)[ \t]*\n([\s\S]*?)\n```[ \t]*(?:\n|$)/g;

/** Hide dossier metadata only in parsed HTML; source Markdown and code stay intact. */
function hideDossierIssueMarkers() {
  type MarkdownNode = { type: string; value?: string; children?: MarkdownNode[] };
  return function visit(node: MarkdownNode): void {
    if (node.type === "html" && node.value) {
      node.value = node.value.replace(/<!-- (?:issue:ISS-[A-Za-z0-9_-]+|saved-issue-analysis:(?:start|end)) -->/g, "");
    }
    node.children?.forEach(visit);
  };
}

export function visibleClaimProse(text: string): string {
  const visible = text.replace(TRANSPORT, (block, kind: string, payload: string) => {
    try {
      const parsed = JSON.parse(payload);
      if (!parsed || typeof parsed !== "object") return block;
      const structured = kind === "problem-analysis" ? parsed.schema_version === 1 && typeof parsed.objective === "string" && typeof parsed.integrated_answer === "string" : kind === "claim-support" ? Array.isArray(parsed.claims)
        : Array.isArray(parsed.issue_analyses) || (parsed.issue_analysis && typeof parsed.issue_analysis === "object" && !Array.isArray(parsed.issue_analysis));
      return structured ? "" : block;
    } catch { return kind === "problem-analysis" ? "Problem breakdown unavailable. The useful answer was retained." : block; }
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
  if (versions.size > 1) return null;
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

export function sourceRecordsForDisplay(records?: Array<Record<string, unknown>>): ClaimEvidence[] {
  return (records ?? []).filter(record => typeof record.source_id === "string").map(record => ({...record, claim_id: `source:${record.source_id}`} as unknown as ClaimEvidence));
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
export default function ClaimMarkdown(props: ClaimMarkdownProps) {
  const { text, claims = [], sources = [], documents = [], surface = "document", recordId, className, separateParagraphLines = false, onOpenEvidence, onOpenDocument } = props;
  const [opened, setOpened] = useState<ClaimEvidence | null>(null);
  const sourceContainer = useRef<HTMLDivElement>(null);
  const sourceDetails = useRef<HTMLElement>(null);
  const sourceButton = useRef<string | null>(null);
  useEffect(() => {
    if (opened) {
      sourceDetails.current?.scrollIntoView({block: "nearest"});
      sourceDetails.current?.focus({preventScroll: true});
    } else if (sourceButton.current !== null) {
      sourceContainer.current?.querySelector<HTMLButtonElement>(`button[data-source-marker="${sourceButton.current}"]`)?.focus();
    }
  }, [opened]);
  function showSource(event: MouseEvent<HTMLButtonElement>, evidence: ClaimEvidence) {
    sourceButton.current = event.currentTarget.dataset.sourceMarker ?? null;
    setOpened(evidence);
  }
  function closeSource() {
    setOpened(null);
  }
  const markers: Array<{ label: string; evidence: ClaimEvidence | null; exact: boolean }> = [];
  const renderedClaims = claimsForRenderedText(claims, text);
  const prose = visibleClaimProse(text);
  const markdown = (separateParagraphLines ? separateChatSections(prose) : prose).replace(SOURCE_MARKER, (_marker, sourceId: string, locator?: string) => {
    const normalizedLocator = locator?.trim() || null;
    const exact = evidenceForSourceMarker(renderedClaims, sourceId, normalizedLocator);
    const savedSources = sources.filter(source => source.source_id === sourceId && (!normalizedLocator || source.locator === normalizedLocator || source.reference_key === `${sourceId}|${normalizedLocator}`));
    const matched = sources.some(source => source.source_id === sourceId)
      ? (savedSources.length === 1 ? savedSources[0] : null)
      : exact ?? sourceForMarker(claims, sourceId);
    const copies = documents.filter(doc => doc.document_id === sourceId && doc.kind === "source");
    // Legacy chat may retain only an ID. Resolve a unique saved source without claiming an exact passage.
    const copy = copies.length === 1 && !sources.some(source => source.source_id === sourceId) ? copies[0] : null;
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

  const sections = markdownDisclosures(prose);
  if (sections.some(section => section.summary !== undefined)) return <div className={[styles.claim, className].filter(Boolean).join(" ")}>
    {sections.map((section, index) => section.summary !== undefined
      ? <details className={styles.markdownDisclosure} key={index}><summary>{section.summary}</summary><ClaimMarkdown {...props} text={section.text} className={undefined} /></details>
      : <ClaimMarkdown {...props} text={section.text} className={undefined} key={index} />)}
  </div>;

  return <div ref={sourceContainer} className={[styles.claim, className].filter(Boolean).join(" ")}><ReactMarkdown remarkPlugins={[remarkGfm, hideDossierIssueMarkers]} components={{
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
        const label = evidence?.source_label || (publicUrl ? new URL(publicUrl).hostname : item?.label || "Source");
        const openSaved = saved && onOpenDocument ? () => onOpenDocument({ document_id: saved.document_id, path: saved.path, revision: saved.revision, origin: origin(surface, recordId) }) : null;
        if (publicUrl) return <span><a className="claim-source-link" href={publicUrl} target="_blank" rel="noopener noreferrer" title="Open original source">{label}</a>{evidence && <> · <button className="claim-source-link" data-source-marker={marker[1]} onClick={(event) => showSource(event, evidence)} type="button">Saved source details</button></>}{openSaved ? <> · <button className="claim-source-link" onClick={openSaved} type="button" aria-label={`Saved copy of ${label}`}>Saved copy</button></> : null}</span>;
        return <button className="claim-source-link" data-source-marker={marker[1]} disabled={!evidence} onClick={(event) => evidence && showSource(event, evidence)} title="Open captured record" type="button">{label}{!evidence ? " · unavailable" : ""}</button>;
      }
      if (safePublicUrl(href)) return <a href={href} rel="noreferrer" target="_blank">{children}</a>;
      const decoded = safeDecodePath(href);
      const internal = decoded !== null && documents.some((item) => item.path === decoded);
      if (internal) return <a href={href} onClick={(event) => openInternal(event, href)}>{children}</a>;
      return <span title="Unsafe or unavailable link">{children}</span>;
    },
    table: ({ children }: { children?: ReactNode }) => <div className="claim-table-scroll" role="region" aria-label="Scrollable table" tabIndex={0}><table>{children}</table></div>,
  }}>{markdown}</ReactMarkdown>{opened && <aside ref={sourceDetails} tabIndex={-1} onKeyDown={(event) => { if (event.key === "Escape") closeSource(); }} aria-label="Captured source details" className="research-source-card"><strong>{opened.source_label || opened.source_id}</strong><p>{opened.source_class?.replaceAll("_", " ") || "Saved source"} · {opened.source_id}</p><p>Saved version {opened.source_version?.slice(0, 12) || "not recorded"}{opened.locator ? ` · ${opened.locator}` : ""}</p>{opened.selected_passages?.length ? opened.selected_passages.map((passage, index) => <blockquote key={index}><pre style={{whiteSpace: "pre-wrap"}}>{passage.text || passage.quote}</pre></blockquote>) : opened.available_excerpt ? <blockquote><pre style={{whiteSpace: "pre-wrap"}}>{opened.available_excerpt}</pre></blockquote> : <p>No exact passage was saved with this output.</p>}{opened.path && isSafeDocumentPath(opened.path) && documents.some(doc => doc.path === opened.path) && onOpenDocument && <button type="button" onClick={() => { const doc = documents.find(item => item.path === opened.path)!; onOpenDocument({document_id: doc.document_id, path: doc.path, revision: doc.revision, origin: origin(surface, recordId)}); }}>Open current saved file</button>}{onOpenEvidence && <button type="button" onClick={() => onOpenEvidence(opened)}>Open source record</button>}<button type="button" onClick={closeSource}>Close source details</button></aside>}</div>;
}
