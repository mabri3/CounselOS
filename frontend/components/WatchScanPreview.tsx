import type { Scan } from "@/lib/watchTypes";

const label = (value: string) => value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
const state = (value: string) => value === "failed" ? "state-failure" : value === "success" ? "state-healthy" : value === "running" ? "state-agent" : "state-attention";

function count(total: number, noun: string) { return `${total} ${noun}${total === 1 ? "" : "s"}`; }

export default function WatchScanPreview({ scan }: { scan: Scan | null }) {
  if (!scan) return null;
  const samples = scan.provider_results.flatMap((result) => result.candidates.map((candidate) => ({ ...candidate, provider: result.provider_id })));
  return <section className="agent-note" aria-labelledby="scan-preview-heading">
    <div className="agent-label"><span className="agent-mark" />Durable scan preview</div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 10 }}><h2 id="scan-preview-heading">Scan results</h2><span className={`state-label ${state(scan.status)}`}>{label(scan.status)}</span></div>
    <p className="muted" style={{ margin: "8px 0 0" }}>{count(scan.development_count, "development")} · {count(scan.briefing_item_count, "Briefing item")} · {count(scan.review_packet_count, "review connection")}</p>
    <h3 style={{ marginTop: 20 }}>Provider outcomes</h3>
    <div className="stack-list" style={{ marginTop: 10 }}>{scan.provider_results.map((result) => <div className="card card-pad" key={result.provider_id}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><strong>{label(result.provider_id)}</strong><span className={`state-label ${state(result.status)}`}>{label(result.status)}</span></div>
      {result.warnings.length ? <ul>{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : <p className="small muted" style={{ margin: "8px 0 0" }}>No provider warnings.</p>}
    </div>)}</div>
    <h3 style={{ marginTop: 20 }}>Source coverage</h3>
    {scan.source_coverage.length ? <ul>{scan.source_coverage.map((coverage, index) => <li key={`${coverage.source_id ?? coverage.url}-${index}`}><strong>{label(coverage.status)}:</strong> {coverage.message || coverage.url || coverage.source_id}</li>)}</ul> : <p className="muted">No source coverage was reported.</p>}
    {scan.warnings.length ? <div className="warning-callout"><strong>Warnings</strong><ul>{scan.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div> : null}
    <h3 style={{ marginTop: 20 }}>Sample items</h3>
    {samples.length ? <div className="stack-list" style={{ marginTop: 10 }}>{samples.slice(0, 5).map((item, index) => <article className="card card-pad" key={`${item.provider}-${item.canonical_url}-${index}`}><div className="record-meta">{label(item.provider)}</div><strong>{item.title}</strong><p className="muted" style={{ margin: "6px 0 0" }}>{item.summary}</p>{item.canonical_url ? <a className="auto-link" href={item.canonical_url} rel="noreferrer" target="_blank">Read source</a> : null}</article>)}</div> : <p className="muted">No sample items were returned.</p>}
  </section>;
}
