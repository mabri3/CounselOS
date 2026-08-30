"use client";

import type { BriefingGroup, BriefingQuery, BriefingSort } from "@/lib/watchTypes";

const sorts: { value: BriefingSort; label: string }[] = [
  { value: "newest", label: "Newest" }, { value: "relevance", label: "Relevance" },
  { value: "potential_impact", label: "Potential impact" }, { value: "primary_sources", label: "Primary sources first" },
  { value: "effective_date", label: "Effective date" }, { value: "unread", label: "Unread first" },
  { value: "connected_decisions", label: "Connected decisions" },
];
const groups: { value: BriefingGroup; label: string }[] = [
  { value: "none", label: "No groups" }, { value: "watch", label: "Watch" }, { value: "topic", label: "Topic" },
  { value: "source", label: "Source" }, { value: "jurisdiction", label: "Jurisdiction" }, { value: "date", label: "Date" },
  { value: "product", label: "Product" }, { value: "affected_decision", label: "Affected decision" },
];

export default function BriefingQueryBar({ query, onChange, onApply }: {
  query: BriefingQuery;
  onChange: (patch: Partial<BriefingQuery>) => void;
  onApply: () => void;
}) {
  return (
    <form className="filter-bar" onSubmit={(event) => { event.preventDefault(); onApply(); }}>
      <label style={{ flex: "1 1 260px" }}>Search
        <input className="text-input" onChange={(event) => onChange({ q: event.target.value })} placeholder="Search developments" value={query.q} />
      </label>
      <label>Read state
        <select className="select-input" onChange={(event) => onChange({ read: event.target.value as BriefingQuery["read"] })} value={query.read}>
          <option value="any">Any</option><option value="no">Unread</option><option value="yes">Read</option>
        </select>
      </label>
      <label>Saved state
        <select className="select-input" onChange={(event) => onChange({ saved: event.target.value as BriefingQuery["saved"] })} value={query.saved}>
          <option value="any">Any</option><option value="yes">Saved</option><option value="no">Not saved</option>
        </select>
      </label>
      <label>Sort
        <select className="select-input" onChange={(event) => onChange({ sort: event.target.value as BriefingSort })} value={query.sort}>
          {sorts.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label>Group
        <select className="select-input" onChange={(event) => onChange({ group: event.target.value as BriefingGroup })} value={query.group}>
          {groups.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <details style={{ flexBasis: "100%" }}>
        <summary style={{ cursor: "pointer", font: "600 13px var(--sans)" }}>More filters</summary>
        <div className="filter-bar" style={{ border: 0, padding: "12px 0 0" }}>
          <ListField label="Watch IDs" value={query.watch} onChange={(watch) => onChange({ watch })} />
          <ListField label="Topics" value={query.topic} onChange={(topic) => onChange({ topic })} />
          <ListField label="Jurisdictions" value={query.jurisdiction} onChange={(jurisdiction) => onChange({ jurisdiction })} />
          <ListField label="Sources" value={query.source} onChange={(source) => onChange({ source })} />
          <ListField label="Source types" value={query.source_type} onChange={(source_type) => onChange({ source_type: source_type as BriefingQuery["source_type"] })} />
          <ListField label="Watch roles" value={query.source_role} onChange={(source_role) => onChange({ source_role: source_role as BriefingQuery["source_role"] })} />
          <ListField label="Attention states" value={query.status} onChange={(status) => onChange({ status: status as BriefingQuery["status"] })} />
          <label>Company connection<select className="select-input" value={query.company_connection} onChange={(e) => onChange({ company_connection: e.target.value as BriefingQuery["company_connection"] })}><option value="any">Any</option><option value="yes">Connected</option><option value="no">Not connected</option></select></label>
          <label>Review packet<select className="select-input" value={query.packet} onChange={(e) => onChange({ packet: e.target.value as BriefingQuery["packet"] })}><option value="any">Any</option><option value="none">None</option><option value="connected">Connected</option><option value="required">Required</option></select></label>
          <label>Potential impact<select className="select-input" value={query.impact ?? ""} onChange={(e) => onChange({ impact: (e.target.value || null) as BriefingQuery["impact"] })}><option value="">Any</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          <label>Legal status<input className="text-input" value={query.legal_status ?? ""} onChange={(e) => onChange({ legal_status: e.target.value || null })} /></label>
        </div>
      </details>
      <div className="filter-bar-actions"><button className="btn primary" type="submit">Apply</button></div>
    </form>
  );
}

function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return <label>{label}<input className="text-input" value={value.join(", ")} onChange={(event) => onChange(event.target.value.split(",").map((part) => part.trim()).filter(Boolean))} /></label>;
}
