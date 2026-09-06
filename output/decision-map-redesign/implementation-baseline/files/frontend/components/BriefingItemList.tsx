"use client";

import Link from "next/link";
import { formatShortDate } from "@/lib/design";
import type { BriefingGroup, BriefingItem } from "@/lib/watchTypes";

const IMPACT_WORD: Record<string, string> = { low: "Low impact", medium: "Medium impact", high: "High impact" };

function groupNames(item: BriefingItem, group: BriefingGroup, watchNames: Record<string, string>): string[] {
  if (group === "watch") return [watchNames[item.watch_id] ?? item.watch_id];
  if (group === "topic") return item.topics.length ? item.topics : ["No topic"];
  if (group === "source") return item.sources.length ? item.sources.map((source) => source.publisher || source.title) : ["No source"];
  if (group === "jurisdiction") return item.jurisdictions.length ? item.jurisdictions : ["No jurisdiction"];
  if (group === "date") return [formatShortDate(item.published_at || item.created_at)];
  if (group === "product") return item.company_connection?.products.length ? item.company_connection.products : ["No connected product"];
  if (group === "affected_decision") return item.company_connection?.decisions.length ? item.company_connection.decisions : ["No affected decision"];
  return [""];
}

/**
 * One row per development. Ochre is reserved for the items that actually need
 * the lawyer; unread is emphasis, not attention.
 */
export default function BriefingItemList({ items, group, queryString, watchNames }: {
  items: BriefingItem[];
  group: BriefingGroup;
  queryString: string;
  watchNames: Record<string, string>;
}) {
  if (!items.length) {
    return <div className="empty-state">
      No development matches this view. Widen the search, clear the filters, or check your Watches.
    </div>;
  }
  const grouped = new Map<string, BriefingItem[]>();
  for (const item of items) for (const name of groupNames(item, group, watchNames)) grouped.set(name, [...(grouped.get(name) ?? []), item]);

  return <div>{[...grouped].map(([name, entries]) => <section className="briefing-group" key={name || "all"} aria-label={name || "Developments"}>
    {name ? <div className="briefing-group-head">
      <h2>{name}</h2><span>{entries.length === 1 ? "1 development" : `${entries.length} developments`}</span>
    </div> : null}
    <div className="card">{entries.map((item) => {
      const needsReview = item.attention_state === "required" && Boolean(item.review_packet_id);
      const watch = watchNames[item.watch_id] ?? item.watch_id;
      return <Link
        className={`briefing-item ${item.read ? "read" : "unread"}${needsReview ? " review" : ""}`}
        href={`/briefing/${encodeURIComponent(item.item_id)}${queryString ? `?${queryString}` : ""}`}
        key={item.item_id}
      >
        <div className="briefing-item-meta">
          {formatShortDate(item.published_at || item.created_at)} · {watch}
          {item.jurisdictions.length ? ` · ${item.jurisdictions[0]}` : ""}
        </div>
        <div className="briefing-item-title">{item.title}</div>
        <p className="briefing-item-summary">{item.summary}</p>
        <div className="briefing-item-foot">
          {needsReview ? <span className="state-label state-attention">Needs your review</span> : null}
          {item.read ? <span className="state-label state-quiet">Read</span> : <span className="state-label state-plain">Unread</span>}
          {item.saved ? <span className="state-label state-quiet">Saved</span> : null}
          {item.potential_impact ? <span className="state-label state-quiet">{IMPACT_WORD[item.potential_impact] ?? item.potential_impact}</span> : null}
          {item.legal_status ? <span className="briefing-item-status">{item.legal_status}</span> : null}
        </div>
      </Link>;
    })}</div>
  </section>)}</div>;
}
