/**
 * Today (canvas 3a) is derived, not stored. It reads the same matters,
 * decisions and schedules every other screen reads, and ranks them by what
 * actually needs the lawyer.
 *
 * The ranking is the product: overdue, then waiting on your judgment, then
 * decisions whose ground has shifted, then automations that have stopped.
 */

import { daysLate, isOverdue, role, stageLabel } from "./design";
import type { Decision, Matter, Schedule } from "./types";
import { scheduleIsFailing } from "./design";

export type BriefingKind = "overdue" | "judgment" | "review" | "failing";

export type BriefingItem = {
  id: string;
  kind: BriefingKind;
  /** The word beside the colour. */
  status: string;
  color: string;
  /** Row wash — vermilion items read hotter than ochre ones. */
  rowBg: string;
  title: string;
  why: string;
  when: string;
  action: string;
  href: string;
  primary: boolean;
};

const RANK: Record<BriefingKind, number> = { overdue: 0, judgment: 1, review: 2, failing: 3 };

export type ComingUpItem = { id: string; text: string; when: string };

export type Briefing = {
  items: BriefingItem[];
  comingUp: ComingUpItem[];
  headline: string;
  subhead: string;
};

function matterHref(matter: Matter): string {
  return `/matters/${encodeURIComponent(matter.matter_id)}`;
}

function whyFor(matter: Matter): string {
  return (
    matter.next_action ||
    matter.description ||
    `Sitting in ${stageLabel(matter.status).toLowerCase()} with no next action recorded.`
  );
}

export function buildBriefing(
  matters: Matter[],
  decisions: Decision[],
  schedules: Schedule[],
): Briefing {
  const items: BriefingItem[] = [];

  for (const matter of matters) {
    if (matter.status === "closed") continue;
    if (isOverdue(matter)) {
      const late = daysLate(matter);
      items.push({
        id: `matter-${matter.matter_id}`,
        kind: "overdue",
        status: "Overdue",
        color: role.failure,
        rowBg: "#FFFAF8",
        title: matter.next_action || matter.title,
        why: matter.next_action ? matter.description || matter.title : whyFor(matter),
        when: late === 1 ? "1 day late" : `${late} days late`,
        action: matter.status === "respond" ? "Review and send" : "Open the matter",
        href: matterHref(matter),
        primary: true,
      });
      continue;
    }
    if (matter.status === "explore") {
      items.push({
        id: `matter-${matter.matter_id}`,
        kind: "judgment",
        status: "Waiting on you",
        color: role.attention,
        rowBg: "#FFFDF4",
        title: matter.title,
        why: whyFor(matter),
        when: matter.target_date ? `Due ${String(matter.target_date).slice(0, 10)}` : "No date",
        action: "Read the memo",
        href: `${matterHref(matter)}?focus=research`,
        primary: false,
      });
    }
  }

  for (const decision of decisions) {
    if (decision.review_status === "fresh") continue;
    items.push({
      id: `decision-${decision.decision_id}`,
      kind: "review",
      status: "Needs review",
      color: role.attention,
      rowBg: "#FFFDF4",
      title: decision.title,
      why: decision.staleness_reason || "The ground this decision rests on has moved since you recorded it.",
      when: decision.review_status === "stale" ? "Stale" : "Review recommended",
      action: "Review decision",
      href: `/decisions?decision=${encodeURIComponent(decision.decision_id)}`,
      primary: false,
    });
  }

  for (const schedule of schedules) {
    if (!scheduleIsFailing(schedule)) continue;
    items.push({
      id: `schedule-${schedule.schedule_id}`,
      kind: "failing",
      status: "Failing",
      color: role.failure,
      rowBg: "#FFFAF8",
      title: `Reconnect ${schedule.title.toLowerCase()}`,
      why: `The last run failed. Nothing has been filed by this automation since ${
        schedule.last_run_at ? String(schedule.last_run_at).slice(0, 10) : "it stopped"
      }.`,
      when: "Last run failed",
      action: "Reconnect",
      href: "/automations",
      primary: false,
    });
  }

  items.sort((a, b) => RANK[a.kind] - RANK[b.kind]);

  const comingUp: ComingUpItem[] = matters
    .filter((matter) => !items.some((item) => item.id === `matter-${matter.matter_id}`))
    .filter((matter) => matter.status !== "closed" && matter.status !== "intake")
    .slice(0, 4)
    .map((matter) => ({
      id: matter.matter_id,
      text: matter.next_action
        ? `${matter.title} — ${lowerFirst(matter.next_action)}`
        : `${matter.title} is ${stageLabel(matter.status).toLowerCase()}`,
      when: matter.target_date ? String(matter.target_date).slice(0, 10) : stageLabel(matter.status),
    }));

  const overdue = items.filter((item) => item.kind === "overdue").length;

  return {
    items,
    comingUp,
    headline: items.length === 0
      ? "Nothing needs your judgment"
      : `${countWord(items.length)} ${items.length === 1 ? "thing needs" : "things need"} your judgment`,
    subhead: items.length === 0
      ? "Everything is either running or waiting on someone who isn't you."
      : `${overdue === 0 ? "Nothing is overdue" : overdue === 1 ? "One is overdue" : `${countWord(overdue)} are overdue`}. Everything else is either running or waiting on someone who isn't you.`,
  };
}

const WORDS = ["Nothing", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

function countWord(n: number): string {
  return WORDS[n] ?? String(n);
}

function lowerFirst(value: string): string {
  return value ? value[0].toLowerCase() + value.slice(1) : value;
}
