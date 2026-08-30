import type { MatterActionId } from "./matterActions";
import type { ChatCard, FileNode, ToolTrace } from "./types";

export type BriefWorkItem = {
  work_item_id: string;
  path: string;
  title: string;
  status: string;
  required: number;
  item_type: string;
};

export type OpenItem = {
  key: string;
  text: string;
  required: boolean;
  source: "work_item" | "open_question";
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

export function controlIdForCurrentWork(
  stageActionId: MatterActionId,
  currentWorkItem: BriefWorkItem | undefined,
): MatterControlId {
  if (!currentWorkItem) return stageActionId;
  if (currentWorkItem.item_type === "research") return "run_research";
  if (currentWorkItem.item_type === "approval" && stageActionId === "approve_response") {
    return "approve_response";
  }
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
    });
  }

  return items;
}

function normalizeQuestion(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?]+$/, "").trim();
}

export function matterArtifacts(tree: FileNode[], approvedArtifactPath?: string | null): MatterArtifact[] {
  const files: FileNode[] = [];
  const walk = (nodes: FileNode[]) => {
    for (const node of nodes) node.type === "folder" ? walk(node.children ?? []) : files.push(node);
  };
  walk(tree);

  const markdown = files.filter((node) => node.extension === ".md" || node.name.endsWith(".md"));
  const recommendation = markdown.find((node) => node.name === "recommendations.md");
  const research = markdown.filter((node) => (
    node.record_type === "research" ||
    (node.path.includes("/research/") && node.name !== "annotations.md")
  )).at(-1);
  const workProducts = markdown.filter((node) => node.record_type === "work_product");
  const legacyDrafts = markdown.filter((node) => (
    node.path.includes("/work-product/draft/") || node.path.includes("/drafts/")
  ));
  const draft = workProducts.filter((node) => node.state === "draft").at(-1) ?? legacyDrafts.at(-1);
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
  const final = approvedFinal ?? newestMetadataFinal;

  return [
    recommendation && { kind: "recommendation" as const, path: recommendation.path, label: recommendation.label ?? recommendation.name },
    research && { kind: "research" as const, path: research.path, label: research.label ?? research.name },
    draft && { kind: "draft" as const, path: draft.path, label: draft.label ?? draft.name },
    final && { kind: "final" as const, path: final.path, label: final.label ?? final.name },
  ].filter((item): item is MatterArtifact => Boolean(item));
}

export function isKnownMatterArtifactPath(path: string, artifacts: MatterArtifact[], cards: ChatCard[] = []): boolean {
  if (!path || !path.endsWith(".md")) return false;
  if (artifacts.some((item) => item.path === path)) return true;
  return cards.some((card) => card.type === "work_product" && card.vault_path === path);
}

const MUTATION_TOOLS = new Set([
  "save_work_product", "complete_work_item", "approve_response", "mark_response_sent", "close_matter",
  "move_matter_stage", "create_work_item", "record_decision", "update_matter", "save_facts",
]);

export function explicitlyRequestsWorkspaceMutation(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return false;
  return /\b(record (?:this|the|a)|approve (?:this|the|response)|(?:mark|log|record) that (?:it|the response) (?:was )?(?:delivered|sent)|mark (?:this|the|response).+ sent|(?:close|finish) (?:this|the)? ?matter|complete (?:this|the|work item)|move (?:this|the)? ?matter|update (?:this|the|matter|record|file|facts)|create (?:a )?work item|draft .+ and save|save (?:this|that|the|a|draft|work product))\b/.test(normalized);
}

export function mutationOutcome(text: string, trace: ToolTrace[] = [], cards: ChatCard[] = []): "recorded" | "no_change" | "none" {
  const mutationTrace = trace.filter((item) => MUTATION_TOOLS.has(item.tool));
  const structuredSuccess = mutationTrace.some((item) => item.status === "success")
    || cards.some((card) => card.type === "matter_update" || card.type === "work_product");
  if (structuredSuccess) return "recorded";
  if (mutationTrace.some((item) => item.status === "error") || explicitlyRequestsWorkspaceMutation(text)) return "no_change";
  return "none";
}
