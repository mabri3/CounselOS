import type { MatterActionId } from "./matterActions";
import type { ChatCard, FileNode, ToolTrace } from "./types";

export type BriefWorkItem = {
  work_item_id: string;
  path: string;
  title: string;
  status: string;
  required: number;
  item_type: string;
  owner?: string;
};

export type OpenItem = {
  key: string;
  text: string;
  required: boolean;
  source: "work_item" | "open_question";
  workItemId: string | null;
};

export type MatterControlId = MatterActionId | "open_work_item";

export type MatterArtifactKind = "recommendation" | "research" | "draft" | "final";
export type MatterArtifact = { kind: MatterArtifactKind; path: string; label: string };

export function currentWorkItemFor(
  workItems: BriefWorkItem[],
  nextWorkItemId: string | null,
): BriefWorkItem | undefined {
  return workItems.find((item) => item.work_item_id === nextWorkItemId);
}

export function completableCurrentWorkItemId(currentWorkItem: BriefWorkItem | undefined): string | null {
  if (!currentWorkItem || !currentWorkItem.required || ["done", "closed"].includes(currentWorkItem.status)) return null;
  return currentWorkItem.work_item_id;
}

export function workItemOwnerLabel(workItem: BriefWorkItem | undefined): string {
  return workItem?.owner?.trim() || "Unassigned";
}

export function controlIdForCurrentWork(
  stageActionId: MatterActionId,
  currentWorkItem: BriefWorkItem | undefined,
): MatterControlId {
  // Approval and delivery are explicit lawyer actions. A stale or older API
  // response must not let an unrelated required item replace either control.
  if (stageActionId === "approve_response" || stageActionId === "mark_as_sent") return stageActionId;
  if (!currentWorkItem) return stageActionId;
  if (currentWorkItem.item_type === "research") return "run_research";
  return "open_work_item";
}

export function openItemsFor(
  workItems: BriefWorkItem[],
  openQuestions: string[],
  nextWorkItemId: string | null,
  nextAction: string,
): OpenItem[] {
  const openWorkItems = workItems.filter((item) => !["done", "closed"].includes(item.status));
  const workTitleKeys = new Set(openWorkItems.map((item) => normalizeQuestion(item.title)));
  const items: OpenItem[] = openWorkItems
    .filter((item) => item.work_item_id !== nextWorkItemId)
    .map((item) => ({
      key: `work:${item.work_item_id}`,
      text: item.title,
      required: Boolean(item.required),
      source: "work_item",
      workItemId: item.work_item_id,
    }));
  const seenQuestionKeys = new Set<string>();
  const currentActionKey = normalizeQuestion(nextAction);

  for (const question of openQuestions) {
    const key = normalizeQuestion(question);
    if (!key || key === currentActionKey || workTitleKeys.has(key) || seenQuestionKeys.has(key)) continue;
    seenQuestionKeys.add(key);
    items.push({
      key: `question:${key}`,
      text: question,
      required: false,
      source: "open_question",
      workItemId: null,
    });
  }

  return items;
}

function normalizeQuestion(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?]+$/, "").trim();
}

export function matterArtifacts(
  tree: FileNode[],
  approvedArtifactPath?: string | null,
  currentDraftPath?: string | null,
  latestResearchPath?: string | null,
  currentFinalPath?: string | null,
): MatterArtifact[] {
  const files: FileNode[] = [];
  const walk = (nodes: FileNode[]) => {
    for (const node of nodes) node.type === "folder" ? walk(node.children ?? []) : files.push(node);
  };
  walk(tree);

  const markdown = files.filter((node) => node.extension === ".md" || node.name.endsWith(".md"));
  const recommendation = markdown.find((node) => node.name === "recommendations.md");
  const researchCandidates = markdown.filter((node) => (
    !node.path.includes("/research/runs/") && (
      node.record_type === "research" ||
      (node.path.includes("/research/") && node.name !== "annotations.md")
    )
  ));
  const research = latestResearchPath
    ? researchCandidates.find((node) => node.path === latestResearchPath)
    : researchCandidates.reduce<FileNode | undefined>((latest, node) => (
      !latest || (node.updated_at ?? 0) >= (latest.updated_at ?? 0) ? node : latest
    ), undefined);
  const workProducts = markdown.filter((node) => node.record_type === "work_product");
  const legacyDrafts = markdown.filter((node) => (
    node.path.includes("/work-product/draft/") || node.path.includes("/drafts/")
  ));
  const draftCandidates = [
    ...workProducts.filter((node) => node.state === "draft"),
    ...legacyDrafts.filter((node) => !workProducts.includes(node)),
  ];
  const canonicalDraft = currentDraftPath
    ? draftCandidates.find((node) => node.path === currentDraftPath)
    : undefined;
  const draft = canonicalDraft ?? draftCandidates.at(-1);
  const metadataFinals = workProducts.filter((node) => node.state === "final");
  const newestMetadataFinal = metadataFinals.reduce<FileNode | undefined>((latest, node) => {
    if (!latest) return node;
    const nodeUpdated = node.updated_at ?? 0;
    const latestUpdated = latest.updated_at ?? 0;
    return nodeUpdated >= latestUpdated ? node : latest;
  }, undefined);
  const approvedFinal = approvedArtifactPath
    ? metadataFinals.find((node) => node.path === approvedArtifactPath)
    : undefined;
  const currentFinal = currentFinalPath
    ? metadataFinals.find((node) => node.path === currentFinalPath)
    : undefined;
  const final = approvedFinal ?? currentFinal ?? (currentDraftPath ? undefined : newestMetadataFinal);

  return [
    recommendation && { kind: "recommendation" as const, path: recommendation.path, label: recommendation.label ?? recommendation.name },
    research && { kind: "research" as const, path: research.path, label: research.label ?? "First-pass research" },
    draft && { kind: "draft" as const, path: draft.path, label: draft.label ?? draft.name },
    final && { kind: "final" as const, path: final.path, label: final.label ?? final.name },
  ].filter((item): item is MatterArtifact => Boolean(item));
}

const OPERATIONAL_PATH_PARTS = [
  "/events/",
  "/research/runs/",
  "/documents/batches/",
  "/dossier-revisions/",
];

/** Returns the exact document tree shown to the lawyer, without runtime records. */
export function userFacingMatterTree(tree: FileNode[]): FileNode[] {
  return tree.flatMap((node) => {
    const normalizedPath = `/${node.path.replace(/^\/+|\/+$/g, "")}/`;
    if (OPERATIONAL_PATH_PARTS.some((part) => normalizedPath.includes(part))) return [];
    if (node.type === "file") return [node];
    return [{ ...node, children: userFacingMatterTree(node.children ?? []) }];
  });
}

/** Counts only current document nodes that are present in the visible matter tree. */
export function countUserFacingDocuments(tree: FileNode[]): number {
  let total = 0;
  const walk = (nodes: FileNode[]) => {
    for (const node of nodes) {
      if (node.type === "folder") walk(node.children ?? []);
      else total += 1;
    }
  };
  walk(userFacingMatterTree(tree));
  return total;
}

export function isKnownMatterArtifactPath(path: string, artifacts: MatterArtifact[], cards: ChatCard[] = []): boolean {
  if (!path || !path.endsWith(".md")) return false;
  if (artifacts.some((item) => item.path === path)) return true;
  return cards.some((card) => card.type === "work_product" && card.vault_path === path);
}

export function mutationOutcome(trace: ToolTrace[] = [], cards: ChatCard[] = []): "recorded" | "no_change" | "none" {
  const structuredSuccess = trace.some((item) => item.mutation_status === "changed")
    || cards.some((card) => card.type === "matter_update" || card.type === "work_product");
  if (structuredSuccess) return "recorded";
  if (trace.some((item) => item.mutation_status === "failed" || item.mutation_status === "no_change")) return "no_change";
  return "none";
}

export function mutationFailureMessages(trace: ToolTrace[] = []): string[] {
  return [...new Set(
    trace
      .filter((item) => item.mutation_status === "failed")
      .map((item) => item.summary.trim())
      .filter(Boolean),
  )];
}
