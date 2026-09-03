/**
 * Canvas 6a — turning a research memo on disk into something readable:
 * paragraphs, and the sources each claim was drawn from.
 *
 * The parse is real. The memos the research service writes list their sources
 * as `- Internal: \`path\` — snippet` / `- External: [title](url) — snippet`,
 * and any `[n]` markers already in the prose bind to that list by position.
 */

import type { Citation, MemoBlock, ResearchMemo, VaultDocument } from "./types.ts";
import { formatDateTime } from "./design.ts";

const SOURCE_LINE = /^[-*]\s+(Internal(?: support)?|External(?: authority)?|Supplied(?: source)?|Source)\s*:\s*(.+)$/i;
const BACKTICK_PATH = /`([^`]+)`/;
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/;

export function parseMemo(document: VaultDocument): ResearchMemo & {
  publicResearchStatus?: "not_requested" | "retrieved" | "unavailable" | "failed";
} {
  const lines = document.content.split("\n");
  const citations: Citation[] = [];
  const bodyLines: string[] = [];

  for (const line of lines) {
    const match = line.match(SOURCE_LINE);
    if (!match) { bodyLines.push(line); continue; }

    const sourceClass = match[1].toLowerCase();
    const external = sourceClass.startsWith("external") || sourceClass.startsWith("supplied");
    const supplied = sourceClass.startsWith("supplied");
    const kind = supplied ? "Supplied public source" : external ? "External authority" : "Internal matter support";
    const rest = match[2];
    const [nameRaw, noteRaw] = splitOnDash(rest);
    const path = nameRaw.match(BACKTICK_PATH)?.[1];
    const link = nameRaw.match(MARKDOWN_LINK);

    citations.push({
      id: `s${citations.length + 1}`,
      n: String(citations.length + 1),
      name: link ? link[1] : path ? sourceLabel(path) : stripMarks(nameRaw),
      kind: link ? `${kind} · ${link[2]}` : kind,
      quote: cleanExcerpt(noteRaw, path),
      note: external ? "Public link cited in this research." : "Used as internal matter support.",
    });
  }

  const savedTitle = lines.find((line) => line.startsWith("# "))?.slice(2).trim();
  const title = !savedTitle || /^First-Pass Research Packet$/i.test(savedTitle)
    ? String(document.metadata.title ?? document.metadata.question ?? document.name)
    : savedTitle;

  const blocks = toBlocks(bodyLines);

  const author = String(document.metadata.author ?? document.metadata.agent_id ?? "Themis.ai");
  const created = String(document.metadata.created_at ?? document.metadata.updated_at ?? "");
  const providerLegs = Array.isArray(document.metadata.provider_legs)
    ? document.metadata.provider_legs.filter(isRecord)
    : [];
  const polarisObservability = isRecord(document.metadata.polaris_observability)
    ? document.metadata.polaris_observability
    : null;
  const correlationId = typeof document.metadata.correlation_id === "string"
    ? document.metadata.correlation_id
    : "";

  return {
    path: document.path,
    title,
    byline: [
      author,
      created ? formatDateTime(created) : null,
      citations.length ? `${citations.length} source${citations.length === 1 ? "" : "s"} cited` : "no sources cited",
    ]
      .filter(Boolean)
      .join(" · "),
    blocks,
    citations,
    technicalDetails: providerLegs.length || polarisObservability || correlationId
      ? { providerLegs, polarisObservability, correlationId }
      : null,
    publicResearchStatus: isPublicResearchStatus(document.metadata.public_research_status)
      ? document.metadata.public_research_status
      : undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isPublicResearchStatus(
  value: unknown,
): value is "not_requested" | "retrieved" | "unavailable" | "failed" {
  return ["not_requested", "retrieved", "unavailable", "failed"].includes(String(value));
}

/**
 * Markdown headings, lists and paragraphs — enough structure for a memo to
 * read like a memo rather than like its own source.
 */
function toBlocks(lines: string[]): MemoBlock[] {
  const blocks: MemoBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ kind: "p", text: paragraph.join(" ").trim() });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ kind: "list", items: [...list] });
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); continue; }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph(); flushList();
      if (heading[1].length > 1) blocks.push({ kind: "h", level: heading[1].length, text: heading[2].trim() });
      continue;
    }

    const item = line.match(/^(?:[-*]|\d{1,2}[.)])\s+(.*)$/);
    if (item) { flushParagraph(); list.push(item[1].trim()); continue; }

    if (line.startsWith(">")) {
      flushParagraph(); flushList();
      blocks.push({ kind: "quote", text: line.replace(/^>\s?/, "") });
      continue;
    }

    flushList();
    paragraph.push(line);
  }
  flushParagraph();
  flushList();
  return blocks;
}

/** Splits a paragraph into runs of text and `[n]` citation markers. */
export type MemoRun = { text: string } | { citation: string };

export function splitCitations(paragraph: string): MemoRun[] {
  const runs: MemoRun[] = [];
  let cursor = 0;
  const pattern = /\[(\d{1,2})\]/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(paragraph)) !== null) {
    if (match.index > cursor) runs.push({ text: paragraph.slice(cursor, match.index) });
    runs.push({ citation: match[1] });
    cursor = match.index + match[0].length;
  }
  if (cursor < paragraph.length) runs.push({ text: paragraph.slice(cursor) });
  return runs;
}

function splitOnDash(value: string): [string, string] {
  const index = value.indexOf(" — ");
  if (index === -1) {
    const dash = value.indexOf(" - ");
    return dash === -1 ? [value.trim(), ""] : [value.slice(0, dash).trim(), value.slice(dash + 3).trim()];
  }
  return [value.slice(0, index).trim(), value.slice(index + 3).trim()];
}

function stripMarks(value: string): string {
  return value.replace(/[`*_]/g, "").trim();
}

function sourceLabel(path: string): string {
  const name = path.split("/").at(-1) ?? path;
  const fixed: Record<string, string> = {
    "matter.md": "Matter details",
    "request.md": "Original request",
    "facts.md": "Facts, sources & assumptions",
    "issues.md": "Issue map",
    "participants.md": "People & roles",
    "recommendations.md": "Working recommendation",
    "dossier.md": "Matter dossier",
  };
  if (fixed[name]) return fixed[name];
  if (/^CONV-/i.test(name)) return "Matter conversation";
  if (/^RES-/i.test(name)) return "Research packet";
  if (/^RUN-/i.test(name)) return "Research run";
  if (/^DOS-/i.test(name)) return "Dossier revision";
  if (/^WI-/i.test(name)) return "Work item";
  if (/^(?:EVT-|\d{4}-\d{2}-\d{2}-EVT-)/i.test(name)) return "Matter activity";
  return name.replace(/\.md$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cleanExcerpt(raw: string, path?: string): string {
  const value = stripMarks(raw).replace(/\s+/g, " ").trim();
  if (!value) return "No excerpt was captured for this source.";
  const looksLikeFrontmatter = /^---\s/.test(value)
    || /\b(?:matter_id|record_type|created_at|updated_at|immutable|source_revision):\s/.test(value);
  if (!looksLikeFrontmatter) return value;

  const bodyHeading = value.match(/(?:^|\s)#{1,6}\s+[^#]+?(?=\s+#{1,6}\s+|$)/)?.[0]
    ?.replace(/^\s*#{1,6}\s+/, "")
    .trim();
  if (bodyHeading && !/:\s/.test(bodyHeading)) return bodyHeading;

  const label = path ? sourceLabel(path) : "Matter source";
  const descriptions: Record<string, string> = {
    "Original request": "The request that opened this matter.",
    "Matter details": "The saved details for this matter.",
    "Facts, sources & assumptions": "The saved facts and assumptions for this matter.",
    "Issue map": "The saved legal and operational issues.",
    "People & roles": "The saved people and roles for this matter.",
    "Working recommendation": "The saved working recommendation.",
    "Matter dossier": "The current matter summary.",
    "Matter conversation": "A saved conversation from this matter.",
    "Research packet": "A saved first-pass research packet.",
    "Research run": "The saved status of a research run.",
    "Dossier revision": "A saved revision of the matter dossier.",
    "Work item": "A saved work item for this matter.",
    "Matter activity": "A saved matter activity record.",
  };
  return descriptions[label] ?? "A saved document from this matter.";
}
