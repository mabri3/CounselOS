"use client";

import styles from "./BriefingPhase2.module.css";
import type { BriefingGroup, BriefingQuery, BriefingSort } from "@/lib/watchTypes";

/** Order and grouping read as instructions to the list, not as database words. */
const sorts: { value: BriefingSort; label: string }[] = [
  { value: "newest", label: "Newest first" }, { value: "relevance", label: "Best match" },
  { value: "potential_impact", label: "Biggest potential impact" }, { value: "primary_sources", label: "Primary sources first" },
  { value: "effective_date", label: "Soonest effective date" }, { value: "unread", label: "Unread first" },
  { value: "connected_decisions", label: "Connected to a decision" },
];
const groups: { value: BriefingGroup; label: string }[] = [
  { value: "none", label: "Don't group" }, { value: "watch", label: "Watch" }, { value: "topic", label: "Topic" },
  { value: "source", label: "Source" }, { value: "jurisdiction", label: "Jurisdiction" }, { value: "date", label: "Date" },
  { value: "product", label: "Product" }, { value: "affected_decision", label: "Affected decision" },
];

export default function BriefingQueryBar({ query, onChange, onApply, onClear, filtered }: {
  query: BriefingQuery;
  onChange: (patch: Partial<BriefingQuery>) => void;
  onApply: () => void;
  onClear: () => void;
  filtered: boolean;
}) {
  return (
    <form className={`${styles.query} query-bar`} onSubmit={(event) => { event.preventDefault(); onApply(); }}>
      <div className="query-bar-row">
        <label className="query-bar-search"><span>Search these developments</span>
          <input className="text-input" onChange={(event) => onChange({ q: event.target.value })} placeholder="Words in the title or summary" value={query.q} />
        </label>
        <div className="query-bar-controls">
          <label><span>Show</span>
            <select className="select-input" onChange={(event) => onChange({ read: event.target.value as BriefingQuery["read"] })} value={query.read}>
              <option value="any">Everything</option><option value="no">Unread only</option><option value="yes">Already read</option>
            </select>
          </label>
          <label><span>Saved</span>
            <select className="select-input" onChange={(event) => onChange({ saved: event.target.value as BriefingQuery["saved"] })} value={query.saved}>
              <option value="any">Everything</option><option value="yes">Saved only</option><option value="no">Not saved</option>
            </select>
          </label>
          <label><span>Order by</span>
            <select className="select-input" onChange={(event) => onChange({ sort: event.target.value as BriefingSort })} value={query.sort}>
              {sorts.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label><span>Group by</span>
            <select className="select-input" onChange={(event) => onChange({ group: event.target.value as BriefingGroup })} value={query.group}>
              {groups.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
        <div className="query-bar-actions">
          {filtered ? <button className="btn compact" onClick={onClear} type="button">Clear filters</button> : null}
          <button className="btn primary compact" type="submit">Apply</button>
        </div>
      </div>

      <details className="query-more">
        <summary>Narrow this further</summary>
        <p className="query-more-help">
          Type one or more values, separated by commas. Leave a field empty to include everything.
        </p>
        <div className="query-more-grid">
          <ListField label="Watches" hint="Watch id, e.g. alternative-data" value={query.watch} onChange={(watch) => onChange({ watch })} />
          <ListField label="Topics" hint="e.g. data use" value={query.topic} onChange={(topic) => onChange({ topic })} />
          <ListField label="Jurisdictions" hint="e.g. United States" value={query.jurisdiction} onChange={(jurisdiction) => onChange({ jurisdiction })} />
          <ListField label="Sources" hint="Publisher or source name" value={query.source} onChange={(source) => onChange({ source })} />
          <ListField label="Source types" hint="case, statute, regulation…" value={query.source_type} onChange={(source_type) => onChange({ source_type: source_type as BriefingQuery["source_type"] })} />
          <ListField label="Watch roles" hint="primary, secondary, discovery_only, excluded" value={query.source_role} onChange={(source_role) => onChange({ source_role: source_role as BriefingQuery["source_role"] })} />
          <ListField label="Attention levels" hint="briefing_only, monitor, this_week, required" value={query.status} onChange={(status) => onChange({ status: status as BriefingQuery["status"] })} />
          <label><span>Connected to your company</span>
            <select className="select-input" value={query.company_connection} onChange={(e) => onChange({ company_connection: e.target.value as BriefingQuery["company_connection"] })}>
              <option value="any">Everything</option><option value="yes">Connected</option><option value="no">Not connected</option>
            </select>
          </label>
          <label><span>Review packet</span>
            <select className="select-input" value={query.packet} onChange={(e) => onChange({ packet: e.target.value as BriefingQuery["packet"] })}>
              <option value="any">Everything</option><option value="none">No packet</option><option value="connected">Has a packet</option><option value="required">Needs your review</option>
            </select>
          </label>
          <label><span>Potential impact</span>
            <select className="select-input" value={query.impact ?? ""} onChange={(e) => onChange({ impact: (e.target.value || null) as BriefingQuery["impact"] })}>
              <option value="">Any level</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </label>
          <label><span>Legal status</span>
            <input className="text-input" placeholder="Words in the stored status" value={query.legal_status ?? ""} onChange={(e) => onChange({ legal_status: e.target.value || null })} />
          </label>
        </div>
      </details>
    </form>
  );
}

function ListField({ label, hint, value, onChange }: { label: string; hint: string; value: string[]; onChange: (value: string[]) => void }) {
  return <label><span>{label}</span>
    <input className="text-input" placeholder={hint} value={value.join(", ")} onChange={(event) => onChange(event.target.value.split(",").map((part) => part.trim()).filter(Boolean))} />
  </label>;
}
