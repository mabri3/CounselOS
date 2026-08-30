/**
 * Today (canvas 3a) is derived, not stored. It reads the same matters,
 * decisions and schedules every other screen reads, and ranks them by what
 * actually needs the lawyer.
 *
 * The ranking is the product: overdue, then waiting on your judgment, then
 * decisions whose ground has shifted, then automations that have stopped.
 */

import { daysLate, decisionNeedsReview, formatShortDate, matterAwaitsJudgment, matterNextAction, role, stageLabel } from "./design";
import type { Decision, Matter, Schedule } from "./types";
import type { ReviewPacket } from "./watchTypes";
import { scheduleIsFailing } from "./design";

export type BriefingKind = "overdue" | "blocked" | "assignment" | "judgment" | "review" | "packet" | "failing";

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

const RANK: Record<BriefingKind, number> = { overdue: 0, blocked: 1, assignment: 2, judgment: 3, packet: 4, review: 5, failing: 6 };

export type ComingUpItem = { id: string; text: string; when: string; href: string };

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
  return matterNextAction(matter);
}

export function buildBriefing(
  matters: Matter[],
  decisions: Decision[],
  schedules: Schedule[],
  reviewPackets: ReviewPacket[] = [],
): Briefing {
  const items: BriefingItem[] = [];

  for (const matter of matters) {
    if (matter.status === "closed") continue;
    if (matter.work_state.signal.kind === "overdue") {
      const late = daysLate(matter);
      items.push({
        id: `matter-${matter.matter_id}`,
        kind: "overdue",
        status: "Overdue",
        color: role.failure,
        rowBg: role.failureWash,
        title: matterNextAction(matter),
        why: matter.description || matter.title,
        when: late === 1 ? "1 day late" : `${late} days late`,
        action: matter.status === "respond" ? "Review and send" : "Open the matter",
        href: matterHref(matter),
        primary: true,
      });
      continue;
    }
    if (matter.work_state.signal.kind === "blocked" || matter.work_state.next_actor === "unassigned") {
      const blocked = matter.work_state.signal.kind === "blocked";
      items.push({
        id: `matter-${matter.matter_id}`,
        kind: blocked ? "blocked" : "assignment",
        status: blocked ? "Blocked" : "Needs assignment",
        color: role.attentionDeep,
        rowBg: role.attentionWash,
        title: matterNextAction(matter),
        why: matter.description || matter.title,
        when: matter.work_state.due_at ? `Due ${formatShortDate(matter.work_state.due_at)}` : "No date",
        action: "Open the matter",
        href: matterHref(matter),
        primary: false,
      });
      continue;
    }
    if (matterAwaitsJudgment(matter)) {
      items.push({
        id: `matter-${matter.matter_id}`,
        kind: "judgment",
        status: "Waiting on you",
        color: role.attention,
        rowBg: role.attentionWash,
        title: matter.title,
        why: whyFor(matter),
        when: matter.work_state.due_at ? `Due ${formatShortDate(matter.work_state.due_at)}` : "No date",
        action: "Read the memo",
        href: `${matterHref(matter)}?focus=research`,
        primary: false,
      });
    }
  }

  for (const decision of decisions) {
    if (!decisionNeedsReview(decision)) continue;
    items.push({
      id: `decision-${decision.decision_id}`,
      kind: "review",
      status: "Needs review",
      color: role.attention,
      rowBg: role.attentionWash,
      title: decision.title,
      why: decision.staleness_reason || "The ground this decision rests on has moved since you recorded it.",
      when: decision.review_status === "stale" ? "Stale" : "Review recommended",
      action: "Review decision",
      href: `/decisions?decision=${encodeURIComponent(decision.decision_id)}`,
      primary: false,
    });
  }

  for (const packet of reviewPackets) {
    if (packet.attention_state !== "required" || packet.status !== "open") continue;
    items.push({ id: `packet-${packet.packet_id}`, kind: "packet", status: "Needs review", color: role.attention,
      rowBg: role.attentionWash, title: packet.what_happened, why: packet.why_surfaced,
      when: packet.timing || "Review today", action: "Review packet",
      href: `/decisions?packet=${encodeURIComponent(packet.packet_id)}`, primary: false });
  }

  for (const schedule of schedules) {
    if (!scheduleIsFailing(schedule)) continue;
    items.push({
      id: `schedule-${schedule.schedule_id}`,
      kind: "failing",
      status: "Failing",
      color: role.failure,
      rowBg: role.failureWash,
      title: `Reconnect ${schedule.title.toLowerCase()}`,
      why: `The last run failed. Nothing has been filed by this automation since ${
        schedule.last_run_at ? formatShortDate(schedule.last_run_at) : "it stopped"
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
      text: `${matter.title} — ${lowerFirst(matterNextAction(matter))}`,
      when: matter.work_state.due_at ? formatShortDate(matter.work_state.due_at) : stageLabel(matter.status),
      href: matterHref(matter),
    }));

  const overdue = items.filter((item) => item.kind === "overdue").length;
  const blocked = items.filter((item) => item.kind === "blocked").length;
  const assignment = items.filter((item) => item.kind === "assignment").length;
  const judgment = items.filter((item) => item.kind === "judgment").length;
  const review = items.filter((item) => item.kind === "review").length;
  const packets = items.filter((item) => item.kind === "packet").length;
  const failing = items.filter((item) => item.kind === "failing").length;

  return {
    items,
    comingUp,
    headline: items.length === 0
      ? "Nothing needs your attention"
      : `${countWord(items.length)} ${items.length === 1 ? "thing needs" : "things need"} your attention`,
    subhead: `Across matters, decisions, review packets, and schedules: ${overdue} overdue · ${blocked} blocked · ${assignment} unassigned · ${judgment} awaiting judgment · ${review} ${review === 1 ? "decision needs" : "decisions need"} review · ${packets} review ${packets === 1 ? "packet" : "packets"} · ${failing} failed ${failing === 1 ? "schedule" : "schedules"}.`,
  };
}

const WORDS = ["Nothing", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

function countWord(n: number): string {
  return WORDS[n] ?? String(n);
}

function lowerFirst(value: string): string {
  return value ? value[0].toLowerCase() + value.slice(1) : value;
}
