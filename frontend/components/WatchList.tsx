import Link from "next/link";
import { formatDateTime } from "@/lib/design";
import type { Watch } from "@/lib/watchTypes";

const stateClass: Record<Watch["status"], string> = {
  draft: "state-agent", scanning: "state-agent", healthy: "state-healthy",
  paused: "state-attention", failed: "state-failure", needs_review: "state-attention",
};

function label(value: string) { return value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase()); }
/** Name the providers rather than the enum the record stores. */
function providerNames(provider: Watch["provider"]): string {
  return provider === "both" ? "Native and Polaris" : provider === "polaris" ? "Polaris" : "Native";
}
/** How often it runs, in the same words the rest of the app uses. */
function cadenceWords(recurrence: Watch["recurrence"]): string {
  if (recurrence.kind === "manual") return "Runs only when you ask";
  if (recurrence.kind === "daily") return `Daily${recurrence.local_time ? ` at ${recurrence.local_time}` : ""}`;
  if (recurrence.kind === "weekday") {
    const days = recurrence.weekdays.map((day) => label(day)).join(", ");
    return `Weekly${days ? ` on ${days}` : ""}${recurrence.local_time ? ` at ${recurrence.local_time}` : ""}`;
  }
  return "On a set interval";
}

export default function WatchList({ error, watches }: { error: string; watches: Watch[] | null }) {
  return <>
    <div className="page-header">
      <div className="page-header-main"><div className="eyebrow">Continuous legal awareness</div><h1 className="headline">Watches</h1><p className="page-lede">A Watch is a standing question Themis.ai re-asks of public sources on a schedule. What each one finds arrives in Briefing.</p></div>
      <Link className="btn primary" href="/watches/new">New Watch</Link>
    </div>
    {error ? <p className="error" role="alert">{error}</p> : null}
    {!watches && !error ? <div className="loading">Loading Watches…</div> : null}
    {watches?.length === 0 ? <div className="empty-state" style={{ marginTop: 24 }}>No Watches yet. Create one to save a monitoring question.</div> : null}
    {watches?.length ? <div className="stack-list" style={{ marginTop: 24 }}>
      {watches.map((watch) => <Link className="card card-pad responsive-card" href={`/watches/${encodeURIComponent(watch.watch_id)}`} key={watch.watch_id}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}><h2>{watch.title}</h2><p className="muted" style={{ margin: "7px 0 0", lineHeight: 1.55 }}>{watch.standing_question}</p></div>
          <span className={`state-label ${stateClass[watch.status]}`}>{label(watch.status)}</span>
        </div>
        <div className="watch-card-foot">
          <span>{cadenceWords(watch.recurrence)} · Asks {providerNames(watch.provider)}</span>
          <span className="record-meta">Updated {formatDateTime(watch.updated_at)}</span>
        </div>
      </Link>)}
    </div> : null}
  </>;
}
