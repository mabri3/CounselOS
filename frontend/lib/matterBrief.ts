import type { MatterActionId } from "./matterActions";

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

export function currentWorkItemFor(
  workItems: BriefWorkItem[],
  nextWorkItemId: string | null,
): BriefWorkItem | undefined {
  return workItems.find((item) => item.work_item_id === nextWorkItemId);
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
