import type { FileNode, RecommendationState } from "./types";

export type EvidenceNode = { path: string; name: string; kind: string; note: string };

export function recommendationIdentity(
  matterId: string,
  recommendation: RecommendationState | null | undefined,
): string {
  return `${matterId}:${recommendation?.current_version_id ?? "absent"}`;
}

/** Supplemental history may enrich the canonical version, but never replace it. */
export function isMatchingRecommendationSupplement(
  matterId: string,
  currentVersionId: string | null,
  saved: RecommendationState,
): boolean {
  return saved.matter_id === matterId && saved.current_version_id === currentVersionId;
}

/** Keep a direct save when a delayed matter reload still carries an older version. */
export function shouldApplyCanonicalRecommendation(
  current: RecommendationState | null,
  incoming: RecommendationState | null,
): boolean {
  if (!incoming || !current) return true;
  if (incoming.current_version_id === current.current_version_id) return true;
  const currentNumber = current.current_version_number;
  const incomingNumber = incoming.current_version_number;
  if (currentNumber != null && incomingNumber != null) return incomingNumber >= currentNumber;
  return true;
}

/** A proposal exists only when the recommendation record labels it on one line. */
export function parseProposedPath(markdown: string): string {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
  const paragraphs = body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const firstSubstantive = paragraphs.find((paragraph) => !paragraph.startsWith("#"));
  const firstForMatching = stripEmphasis(firstSubstantive ?? "");
  if (/^No (?:launch )?recommendation\b/i.test(firstForMatching)) return "";

  for (const rawLine of body.split("\n")) {
    const matchLine = stripEmphasis(rawLine.trim());
    const match = matchLine.match(/^(?:Working path|Recommended path):\s*(.+)$/i);
    if (!match) continue;
    return match[1]
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => !/^(?:Counsel must confirm|Confirm|Pending|Open question)\b/i.test(sentence.trim()))
      .join(" ")
      .trim();
  }
  return "";
}

/** Falls back to the first recommendation paragraph when older records lack a path label. */
export function recommendationSummary(markdown: string): string {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
  const paragraph = body
    .split(/\n\s*\n/)
    .map((value) => value.trim())
    .find((value) => value && !value.startsWith("#"));
  const normalized = stripEmphasis(paragraph ?? "");
  return /^No (?:launch )?recommendation\b/i.test(normalized) ? "" : normalized;
}

export function stripEmphasis(value: string): string {
  return value.replace(/\*\*|__|(?<!\*)\*(?!\*)|(?<!_)_(?!_)/g, "").trim();
}

/** Flattens the matter tree into the two things the lawyer actually cites. */
export function collectEvidence(tree: FileNode[]): EvidenceNode[] {
  const out: EvidenceNode[] = [];
  const matterRecordLabels: Record<string, Omit<EvidenceNode, "path">> = {
    "request.md": { name: "Original request", kind: "Matter record", note: "The request that started this matter" },
    "facts.md": { name: "Facts, sources & assumptions", kind: "Matter record", note: "The current factual record" },
    "issues.md": { name: "Issue map", kind: "Matter record", note: "The legal and operational questions" },
    "recommendations.md": {
      name: "Working recommendation",
      kind: "Matter record",
      note: "Saved recommendation; source and review status are not recorded",
    },
  };
  const walk = (nodes: FileNode[], folder: string) => {
    for (const node of nodes) {
      if (node.type === "folder") { walk(node.children ?? [], node.name); continue; }
      const matterRecord = matterRecordLabels[node.name];
      if (matterRecord) {
        out.push({ path: node.path, ...matterRecord });
      } else if (folder === "documents") {
        out.push({ path: node.path, name: node.label ?? node.name, kind: "Source document", note: "Attached to the matter" });
      } else if (folder === "research" && !node.path.includes("/research/runs/")) {
        out.push({ path: node.path, name: node.label ?? node.name, kind: "First-pass research", note: "Saved research packet" });
      }
    }
  };
  walk(tree, "");
  return out.slice(0, 6);
}

export function safeMatterPath(requested: string | null | undefined, matterPath: string, fallback: string | null): string | null {
  if (!requested || requested.includes("\\") || requested.split("/").includes("..")) return fallback;
  return requested.startsWith(`${matterPath}/`) ? requested : fallback;
}

export function conversationIdFromPath(path: string): string | null {
  if (!path.includes("/conversations/")) return null;
  const match = path.split("/").at(-1)?.match(/^(CONV-\d{8}-[a-f0-9]{6})\.md$/);
  return match?.[1] ?? null;
}

export function findConversationPath(tree: FileNode[], conversationId: string): string | null {
  const folder = tree.find((node) => node.type === "folder" && node.name === "conversations");
  return (folder?.children ?? []).find((node) => node.path.endsWith(`/${conversationId}.md`))?.path ?? null;
}

export function findLatestResearch(tree: FileNode[]): string | null {
  const folder = tree.find((node) => node.type === "folder" && node.name === "research");
  const files = (folder?.children ?? []).filter(
    (node) => node.type === "file" && node.extension === ".md" && node.name !== "annotations.md",
  );
  return files.length ? files[files.length - 1].path : null;
}

export function participantRoleLabel(role: string): string {
  return role.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}

export function findFileByName(tree: FileNode[], name: string): string | null {
  for (const node of tree) {
    if (node.type === "file" && node.name === name) return node.path;
    if (node.type === "folder") {
      const found = findFileByName(node.children ?? [], name);
      if (found) return found;
    }
  }
  return null;
}
