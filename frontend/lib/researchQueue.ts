import type { ResearchRun } from "./types.ts";

/** Poll while the serial backend queue can still move work forward. */
export function shouldPollResearchQueue(items: ResearchRun[]): boolean {
  return items.some((item) => item.state === "queued" || item.state === "running");
}

export function researchQuestion(selected: string, entered: string, matterTitle: string): string {
  return selected.trim() || entered.trim() || matterTitle.trim();
}

export function movePending(items: ResearchRun[], runId: string, direction: -1 | 1): string[] {
  const pending = items.filter((item) => item.state === "queued");
  const index = pending.findIndex((item) => item.run_id === runId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= pending.length) return pending.map((item) => item.run_id);
  [pending[index], pending[target]] = [pending[target], pending[index]];
  return pending.map((item) => item.run_id);
}
