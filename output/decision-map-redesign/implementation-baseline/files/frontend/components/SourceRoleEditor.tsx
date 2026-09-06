import type { AuthorityStatus, SourceRole, SourceType, WatchSource } from "@/lib/watchTypes";

const roles: SourceRole[] = ["primary", "secondary", "discovery_only", "excluded"];
const types: SourceType[] = ["case", "statute", "regulation", "regulator_material", "government_publication", "secondary_legal_analysis", "periodical", "industry_reporting", "company_statement", "market_signal", "other"];
const authority: AuthorityStatus[] = ["binding", "persuasive", "proposed", "official_nonbinding", "none", "unknown"];
const label = (value: string) => value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());

export default function SourceRoleEditor({ onChange, sources }: { onChange: (sources: WatchSource[]) => void; sources: WatchSource[] }) {
  function patch(index: number, change: Partial<WatchSource>) { onChange(sources.map((source, itemIndex) => itemIndex === index ? { ...source, ...change } : source)); }
  function add() {
    onChange([...sources, { source_id: `source-${Date.now()}`, name: "", canonical_url: "https://", publisher: "", jurisdiction: "", source_type: "other", role: "discovery_only", authority_status: "unknown", coverage_status: "configured" }]);
  }
  return <div className="stack-list">
    {sources.map((source, index) => <div className="card card-pad responsive-card" key={source.source_id}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <label className="field-label">Source name<input className="text-input" onChange={(event) => patch(index, { name: event.target.value })} value={source.name} /></label>
        <label className="field-label">Public URL<input className="text-input" onChange={(event) => patch(index, { canonical_url: event.target.value })} type="url" value={source.canonical_url} /></label>
        <label className="field-label">Publisher<input className="text-input" onChange={(event) => patch(index, { publisher: event.target.value })} value={source.publisher} /></label>
        <label className="field-label">Jurisdiction<input className="text-input" onChange={(event) => patch(index, { jurisdiction: event.target.value })} value={source.jurisdiction} /></label>
        <label className="field-label">Source type<select className="select-input" onChange={(event) => patch(index, { source_type: event.target.value as SourceType })} value={source.source_type}>{types.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
        <label className="field-label">Role for this Watch<select className="select-input" onChange={(event) => patch(index, { role: event.target.value as SourceRole })} value={source.role}>{roles.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
        <label className="field-label">Legal authority<select className="select-input" onChange={(event) => patch(index, { authority_status: event.target.value as AuthorityStatus })} value={source.authority_status}>{authority.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
      </div>
      <button className="btn quiet compact" onClick={() => onChange(sources.filter((_, itemIndex) => itemIndex !== index))} style={{ marginTop: 12 }} type="button">Remove source</button>
    </div>)}
    <button className="btn agent" onClick={add} type="button">Add named source</button>
  </div>;
}
