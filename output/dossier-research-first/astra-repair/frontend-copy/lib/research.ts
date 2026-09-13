/** Parse saved research without inventing source text or source status. */

import type { Citation, MemoBlock, ResearchMemo, VaultDocument } from "./types.ts";
import { formatDateTime } from "./design.ts";

const SOURCE_LINE = /^(?:[-*]|\d{1,3}[.)])\s+([^:]+):\s*(.*)$/;
const LIST_ITEM = /^(?:[-*]|\d{1,3}[.)])\s+(.+)$/;
const BACKTICK_PATH = /`([^`]+)`/;
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/;
const SOURCE_ID = /\[source:([^\]]+)\]/i;
type SourceStatus = "supplied" | "retrieved" | "verified_label" | "unverified" | "unknown";

export function parseMemo(document: VaultDocument): ResearchMemo & { publicResearchStatus?: "not_requested" | "retrieved" | "unavailable" | "failed" } {
  const lines = document.content.split("\n");
  const citations: Citation[] = [];
  const bodyLines: string[] = [];
  let inSources = false;
  let sourceOrdinal = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.trim().match(/^#{1,6}\s+(.+)$/);
    if (heading) inSources = /\bsources?\b/i.test(heading[1]);
    const match = line.trim().match(SOURCE_LINE);
    const listItem = line.trim().match(LIST_ITEM);
    const parsedLabel = match ? sourceLabelState(match[1]) : null;
    const sourceCandidate = Boolean(parsedLabel || (inSources && listItem));
    if (!sourceCandidate) { bodyLines.push(line); continue; }

    // Count every source-list row. A malformed or unknown row must not make a
    // later source take its numeric citation marker.
    sourceOrdinal += 1;
    if (!match || !parsedLabel) {
      const ignoredExcerpt = readExcerpt(lines, index + 1);
      if (ignoredExcerpt.consumed) index += ignoredExcerpt.consumed;
      continue;
    }
    const rest = match[2];
    const sourceId = rest.match(SOURCE_ID)?.[1]?.trim();
    const withoutId = rest.replace(SOURCE_ID, "").trim();
    const [nameRaw, inlineExcerpt] = splitOnDash(withoutId);
    const rawPath = nameRaw.match(BACKTICK_PATH)?.[1];
    const path = rawPath && isSafeVaultPath(rawPath) ? rawPath : undefined;
    const link = nameRaw.match(MARKDOWN_LINK);
    const url = link && isSafeSourceUrl(link[2]) ? link[2] : undefined;
    const captured = readExcerpt(lines, index + 1);
    if (captured.consumed) index += captured.consumed;
    const exactExcerpt = captured.found ? captured.text : cleanLegacyInlineExcerpt(inlineExcerpt);
    const statusText = sourceStatusText(parsedLabel.status);
    citations.push({
      id: sourceId || `s${sourceOrdinal}`,
      n: String(sourceOrdinal),
      name: link ? stripMarks(link[1]) : path ? displaySourceLabel(path) : stripMarks(nameRaw) || "Unknown source",
      kind: url ? `${parsedLabel.kind} · ${url}` : parsedLabel.kind,
      quote: exactExcerpt,
      note: `${statusText}${exactExcerpt ? "" : " · No exact passage is available."}${rawPath && !path ? " The saved path is unsafe and was blocked." : ""}`,
    });
  }

  const savedTitle = lines.find((line) => line.startsWith("# "))?.slice(2).trim();
  const title = !savedTitle || /^First-Pass Research Packet$/i.test(savedTitle) ? String(document.metadata.title ?? document.metadata.question ?? document.name) : savedTitle;
  const author = String(document.metadata.author ?? document.metadata.agent_id ?? "Themis.ai");
  const created = String(document.metadata.created_at ?? document.metadata.updated_at ?? "");
  const providerLegs = Array.isArray(document.metadata.provider_legs) ? document.metadata.provider_legs.filter(isRecord) : [];
  const polarisObservability = isRecord(document.metadata.polaris_observability) ? document.metadata.polaris_observability : null;
  const correlationId = typeof document.metadata.correlation_id === "string" ? document.metadata.correlation_id : "";
  return {
    path: document.path,
    title,
    byline: [author, created ? formatDateTime(created) : null, citations.length ? `${citations.length} source${citations.length === 1 ? "" : "s"} cited` : "no sources cited"].filter(Boolean).join(" · "),
    blocks: toBlocks(bodyLines), citations,
    technicalDetails: providerLegs.length || polarisObservability || correlationId ? { providerLegs, polarisObservability, correlationId } : null,
    publicResearchStatus: isPublicResearchStatus(document.metadata.public_research_status) ? document.metadata.public_research_status : undefined,
  };
}

function sourceLabelState(label: string): { status: SourceStatus; kind: string } | null {
  const value = label.trim().toLowerCase().replace(/\s+/g, " ");
  if (/^internal(?:(?: matter)? support)?$/.test(value)) return { status: "supplied", kind: "Internal matter support" };
  if (/^supplied(?: public)? source$/.test(value)) return { status: "supplied", kind: "Supplied public source" };
  if (/^retrieved(?: external authority)?$/.test(value)) return { status: "retrieved", kind: "Retrieved external authority" };
  if (/^verified(?: external authority)?$/.test(value)) return { status: "verified_label", kind: "External authority · Legacy label: Verified" };
  if (/^unverified(?: external lead)?$/.test(value)) return { status: "unverified", kind: "Unverified external lead" };
  if (/^external(?: authority)?$/.test(value)) return { status: "unknown", kind: "External authority · Status unknown" };
  if (/^source$/.test(value)) return { status: "unknown", kind: "Source · Status unknown" };
  return null;
}

function sourceStatusText(status: SourceStatus): string {
  return ({ supplied: "Supplied", retrieved: "Retrieved", verified_label: "Legacy label: Verified · Stored verification event not available", unverified: "Unverified lead", unknown: "Status unknown" })[status];
}

function readExcerpt(lines: string[], start: number): { found: boolean; text: string; consumed: number } {
  let cursor = start;
  while (cursor < lines.length && !lines[cursor].trim()) cursor += 1;
  if (!/^\s+Available excerpt:\s*$/i.test(lines[cursor] ?? "")) {
    if (/^\s+No source excerpt available\.\s*$/i.test(lines[cursor] ?? "")) return { found: true, text: "", consumed: cursor - start + 1 };
    return { found: false, text: "", consumed: 0 };
  }
  const passage: string[] = [];
  cursor += 1;
  while (cursor < lines.length) {
    const quoted = lines[cursor].match(/^\s*> ?(.*)$/);
    if (!quoted) break;
    passage.push(quoted[1]); cursor += 1;
  }
  return { found: true, text: passage.join("\n"), consumed: cursor - start };
}

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function isPublicResearchStatus(value: unknown): value is "not_requested" | "retrieved" | "unavailable" | "failed" { return ["not_requested", "retrieved", "unavailable", "failed"].includes(String(value)); }

function toBlocks(lines: string[]): MemoBlock[] {
  const blocks: MemoBlock[] = []; let paragraph: string[] = []; let list: string[] = [];
  const flushParagraph = () => { if (paragraph.length) blocks.push({ kind: "p", text: paragraph.join(" ").trim() }); paragraph = []; };
  const flushList = () => { if (list.length) blocks.push({ kind: "list", items: [...list] }); list = []; };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) { flushParagraph(); flushList(); if (heading[1].length > 1) blocks.push({ kind: "h", level: heading[1].length, text: heading[2].trim() }); continue; }
    const item = line.match(/^(?:[-*]|\d{1,3}[.)])\s+(.*)$/);
    if (item) { flushParagraph(); list.push(item[1].trim()); continue; }
    if (line.startsWith(">")) { flushParagraph(); flushList(); blocks.push({ kind: "quote", text: line.replace(/^>\s?/, "") }); continue; }
    flushList(); paragraph.push(line);
  }
  flushParagraph(); flushList(); return blocks;
}

export type MemoRun = { text: string } | { citation: string };
export function splitCitations(paragraph: string): MemoRun[] {
  const runs: MemoRun[] = []; let cursor = 0;
  const pattern = /\[(?:source:([^\]]+)|(\d{1,3}))\]/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(paragraph)) !== null) {
    if (match.index > cursor) runs.push({ text: paragraph.slice(cursor, match.index) });
    runs.push({ citation: (match[1] || match[2]).trim() }); cursor = match.index + match[0].length;
  }
  if (cursor < paragraph.length) runs.push({ text: paragraph.slice(cursor) });
  return runs;
}

function splitOnDash(value: string): [string, string] {
  const index = value.indexOf(" — "); if (index !== -1) return [value.slice(0, index).trim(), value.slice(index + 3).trim()];
  const dash = value.indexOf(" - "); return dash === -1 ? [value.trim(), ""] : [value.slice(0, dash).trim(), value.slice(dash + 3).trim()];
}
function stripMarks(value: string): string { return value.replace(/[`*_]/g, "").trim(); }
function cleanLegacyInlineExcerpt(value: string): string {
  const excerpt = stripMarks(value).replace(/\s+/g, " ").trim();
  // Older packets flattened a whole Markdown record into this description.
  // That text is not a captured passage, so leave the quotation empty.
  if (/^---(?:\s|$)/.test(excerpt) || /\b(?:matter_id|record_type|created_at|updated_at|source_revision):\s/.test(excerpt)) return "";
  return excerpt;
}

export function isSafeSourceUrl(value?: string | null): value is string {
  if (!value) return false;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}
export function isSafeVaultPath(value?: string | null): value is string {
  if (!value || value.startsWith("/") || value.startsWith("\\") || value.includes("\\")) return false;
  return value.split("/").every((part) => Boolean(part) && part !== "." && part !== "..");
}

function displaySourceLabel(path: string): string {
  const name = path.split("/").at(-1) ?? path;
  const fixed: Record<string, string> = { "matter.md": "Matter details", "request.md": "Original request", "facts.md": "Facts, sources & assumptions", "issues.md": "Issue map", "participants.md": "People & roles", "recommendations.md": "Working recommendation", "dossier.md": "Matter dossier" };
  if (fixed[name]) return fixed[name];
  if (/^CONV-/i.test(name)) return "Matter conversation";
  if (/^RES-/i.test(name)) return "Research packet";
  if (/^RUN-/i.test(name)) return "Research run";
  if (/^DOS-/i.test(name)) return "Dossier revision";
  if (/^WI-/i.test(name)) return "Work item";
  if (/^(?:EVT-|\d{4}-\d{2}-\d{2}-EVT-)/i.test(name)) return "Matter activity";
  return name.replace(/\.md$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
