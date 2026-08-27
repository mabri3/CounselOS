import Link from "next/link";
import { signalFor } from "@/lib/design";
import type { Matter } from "@/lib/types";

const weekMs = 7 * 24 * 60 * 60 * 1000;

export default function MattersTimeline({ matters }: { matters: Matter[] }) {
  const start = mondayOfCurrentWeek();
  const end = new Date(start.getTime() + 12 * weekMs);
  const weeks = Array.from({ length: 12 }, (_, index) => new Date(start.getTime() + index * weekMs));
  const scheduled = matters
    .map((matter) => ({ matter, target: parseDate(matter.target_date) }))
    .filter(({ matter, target }) => target && (signalFor(matter).word === "Overdue" || (target >= start && target < end)))
    .sort((left, right) => left.target!.getTime() - right.target!.getTime());
  const noDate = matters.filter((matter) => !matter.target_date);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 1152 }}>
          <div className="record-meta" style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: 8, paddingBottom: 8 }}>
            {weeks.map((week) => <span key={week.toISOString()}>{formatWeek(week)}</span>)}
          </div>

          {scheduled.length ? scheduled.map(({ matter, target }) => {
            const signal = signalFor(matter);
            const week = signal.word === "Overdue"
              ? 0
              : Math.min(11, Math.max(0, Math.floor((target!.getTime() - start.getTime()) / weekMs)));
            return (
              <div
                key={matter.matter_id}
                style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: 8, marginBottom: 8 }}
              >
                <Link
                  className="board-card"
                  href={`/matters/${encodeURIComponent(matter.matter_id)}`}
                  style={{
                    background: signal.bg,
                    borderLeftColor: signal.rail,
                    cursor: "pointer",
                    gridColumn: `${week + 1} / span ${week === 11 ? 1 : 2}`,
                    minWidth: 0,
                    padding: "8px 10px",
                  }}
                >
                  <span className="board-card-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {matter.title}
                  </span>
                  <span className="board-card-why" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {signal.word || formatWeek(target!)}
                  </span>
                </Link>
              </div>
            );
          }) : (
            <div className="empty-state">Nothing is scheduled in the next twelve weeks.</div>
          )}
        </div>
      </div>

      {noDate.length ? (
        <section>
          <div className="section-heading" style={{ marginBottom: 8 }}>No target date</div>
          <div className="quiet-list">
            {noDate.map((matter) => (
              <Link className="quiet-row" href={`/matters/${encodeURIComponent(matter.matter_id)}`} key={matter.matter_id}>
                <span>{matter.title}</span>
                <span>{matter.legal_owner || "Unassigned"}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function mondayOfCurrentWeek(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceMonday = (today.getDay() + 6) % 7;
  today.setDate(today.getDate() - daysSinceMonday);
  return today;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatWeek(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
