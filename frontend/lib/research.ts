/**
 * Canvas 6a — turning a research memo on disk into something readable:
 * paragraphs, and the sources each claim was drawn from.
 *
 * The parse is real. The memos the research service writes list their sources
 * as `- Internal: \`path\` — snippet` / `- External: [title](url) — snippet`,
 * and any `[n]` markers already in the prose bind to that list by position.
 */

import type { Citation, MemoBlock, ResearchMemo, VaultDocument } from "./types";
import { formatDateTime } from "./design";

const SOURCE_LINE = /^[-*]\s+(Internal|External|Source)\s*:\s*(.+)$/i;
const BACKTICK_PATH = /`([^`]+)`/;
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/;

export function parseMemo(document: VaultDocument): ResearchMemo {
  const lines = document.content.split("\n");
  const citations: Citation[] = [];
  const bodyLines: string[] = [];

  for (const line of lines) {
    const match = line.match(SOURCE_LINE);
    if (!match) { bodyLines.push(line); continue; }

    const kind = match[1] === "External" ? "Public source" : "Vault document";
    const rest = match[2];
    const [nameRaw, noteRaw] = splitOnDash(rest);
    const path = nameRaw.match(BACKTICK_PATH)?.[1];
    const link = nameRaw.match(MARKDOWN_LINK);

    citations.push({
      id: `s${citations.length + 1}`,
      n: String(citations.length + 1),
      name: link ? link[1] : path ? path.split("/").at(-1) ?? path : stripMarks(nameRaw),
      kind: link ? `${kind} · ${link[2]}` : path ? `${kind} · ${path}` : kind,
      quote: noteRaw || "No passage was captured for this source.",
      note: path ? `Stored in the vault at ${path}.` : "Captured with the memo.",
    });
  }

  const title = lines.find((line) => line.startsWith("# "))?.slice(2).trim()
    || String(document.metadata.title ?? document.name);

  const blocks = toBlocks(bodyLines);

  const author = String(document.metadata.author ?? document.metadata.agent_id ?? "Themis");
  const created = String(document.metadata.created_at ?? document.metadata.updated_at ?? "");

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
  };
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
