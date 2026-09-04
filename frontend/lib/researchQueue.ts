import type { ResearchRun } from "./types.ts";

export type ResearchQueueAggregate = {
  runCount: number;
  activeCount: number;
  savedPacketCount: number;
  supportCount: number;
};

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

/** Summarize only support that is already saved in durable research packets. */
export function researchQueueAggregate(items: ResearchRun[]): ResearchQueueAggregate {
  return items.reduce<ResearchQueueAggregate>((aggregate, item) => {
    const results = item.results ?? [];
    return {
      runCount: aggregate.runCount + 1,
      activeCount: aggregate.activeCount + Number(item.state === "queued" || item.state === "running"),
      savedPacketCount: aggregate.savedPacketCount + results.filter((result) => Boolean(result.path)).length,
      supportCount: aggregate.supportCount + savedSupportCount(item),
    };
  }, { runCount: 0, activeCount: 0, savedPacketCount: 0, supportCount: 0 });
}

export function savedSupportCount(item: ResearchRun): number {
  const countedResults = (item.results ?? []).reduce(
    (total, result) => total + Number(result.internal_sources || 0) + Number(result.external_sources || 0),
    0,
  );
  return Math.max(Number(item.useful_support || 0), countedResults);
}

export function researchSupportLabel(item: ResearchRun): string {
  const supportCount = savedSupportCount(item);
  if (supportCount) return `${supportCount} saved support ${supportCount === 1 ? "source" : "sources"}`;
  if (item.results?.some((result) => Boolean(result.path))) return "Saved packet · No counted support sources";
  return item.state === "queued" || item.state === "running"
    ? "No saved support yet"
    : "No saved support";
}
