import Link from "next/link";
import type { Watch } from "@/lib/watchTypes";

const stateClass: Record<Watch["status"], string> = {
  draft: "state-agent", scanning: "state-agent", healthy: "state-healthy",
  paused: "state-attention", failed: "state-failure", needs_review: "state-attention",
};

function label(value: string) { return value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase()); }

export default function WatchList({ error, watches }: { error: string; watches: Watch[] | null }) {
  return <>
    <div className="page-header">
      <div><div className="record-meta">Briefing</div><h1>Watches</h1><p>Manage the public questions that CounselOS checks for you.</p></div>
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
        <div className="record-meta" style={{ marginTop: 14 }}>{label(watch.provider)} · {label(watch.recurrence.kind)} · Updated {new Date(watch.updated_at).toLocaleString()}</div>
      </Link>)}
    </div> : null}
  </>;
}
