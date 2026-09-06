import styles from "@/components/WatchesPhase2.module.css";
import Link from "next/link";
import DataLoadStatus from "@/components/DataLoadStatus";
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

export default function WatchList({ error, loading, onRetry, watches }: { error: string; loading: boolean; onRetry: () => void | Promise<void>; watches: Watch[] | null }) {
  return <div className={styles.index}>
    <div className={styles.header}>
      <div><h1 className={styles.heading}>Standing questions, kept in view</h1><p className={styles.lede}>Watches keep the questions that matter on your radar.<br />What each one finds arrives in Briefing.</p></div>
      <Link className="btn primary" href="/watches/new">+ New Watch</Link>
    </div>
    <DataLoadStatus error={error} loading={loading} loadingLabel={watches ? "Refreshing Watches…" : "Loading Watches…"} onRetry={onRetry} />
    {watches?.length === 0 ? <div className={styles.empty}><span aria-hidden="true" className={styles.emptyIcon}>⌕</span><h2>No Watches yet</h2><p>Create one to save a monitoring question.</p><Link className="btn primary" href="/watches/new">+ New Watch</Link></div> : null}
    {watches?.length ? <div aria-label="Watches" className={styles.tableWrap} role="region" tabIndex={0}><table className={styles.table}><thead><tr><th>Watch</th><th>Standing question</th><th>Provider</th><th>Cadence</th><th>Last successful scan</th><th>Status</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>
      {watches.map((watch) => <tr key={watch.watch_id}><td><Link href={`/watches/${encodeURIComponent(watch.watch_id)}`}>{watch.title}</Link></td><td>{watch.standing_question}</td><td>{providerNames(watch.provider)}</td><td>{cadenceWords(watch.recurrence)}</td><td>{watch.last_successful_scan_at ? formatDateTime(watch.last_successful_scan_at) : "No successful scan yet"}</td><td><span className={`state-label ${stateClass[watch.status]}`}>{watch.enabled && watch.status === "healthy" ? "Active" : label(watch.status)}</span></td><td><Link aria-label={`Open ${watch.title}`} href={`/watches/${encodeURIComponent(watch.watch_id)}`}>Open ›</Link></td></tr>)}
    </tbody></table></div> : null}
    <section className={styles.explanation}><h2>Save draft, Scan now, or Start Watch</h2><dl><dt>Save draft</dt><dd>Save your question and refine it later.</dd><dt>Scan now</dt><dd>Save the draft, then run a one-time check. The schedule state stays the same.</dd><dt>Start Watch</dt><dd>Begin ongoing monitoring on your chosen schedule.</dd></dl></section>
  </div>;
}
