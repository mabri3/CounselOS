"use client";

import Link from "next/link";
import { formatShortDate } from "@/lib/design";
import type { BriefingGroup, BriefingItem } from "@/lib/watchTypes";

function groupNames(item: BriefingItem, group: BriefingGroup): string[] {
  if (group === "watch") return [item.watch_id];
  if (group === "topic") return item.topics.length ? item.topics : ["No topic"];
  if (group === "source") return item.sources.length ? item.sources.map((source) => source.publisher || source.title) : ["No source"];
  if (group === "jurisdiction") return item.jurisdictions.length ? item.jurisdictions : ["No jurisdiction"];
  if (group === "date") return [formatShortDate(item.published_at || item.created_at)];
  if (group === "product") return item.company_connection?.products.length ? item.company_connection.products : ["No connected product"];
  if (group === "affected_decision") return item.company_connection?.decisions.length ? item.company_connection.decisions : ["No affected decision"];
  return [""];
}

export default function BriefingItemList({ items, group, queryString }: { items: BriefingItem[]; group: BriefingGroup; queryString: string }) {
  if (!items.length) return <div className="empty-state">No developments match this view.</div>;
  const grouped = new Map<string, BriefingItem[]>();
  for (const item of items) for (const name of groupNames(item, group)) grouped.set(name, [...(grouped.get(name) ?? []), item]);
  return <div className="stack-list">{[...grouped].map(([name, entries]) => <section key={name || "all"} aria-label={name || "Briefing items"}>
    {name && <h2 style={{ font: "600 14px var(--sans)", color: "var(--ink-3)", margin: "16px 2px 8px" }}>{name}</h2>}
    <div className="card">{entries.map((item) => <Link className="row" href={`/briefing/${encodeURIComponent(item.item_id)}${queryString ? `?${queryString}` : ""}`} key={item.item_id} style={{ display: "block", padding: "16px 18px", textDecoration: "none", background: item.read ? "var(--raised)" : "var(--attention-wash)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span className={item.read ? "state-label" : "state-label state-attention"}>{item.read ? "Read" : "Unread"}</span><span className="faint">{formatShortDate(item.published_at || item.created_at)}</span></div>
      <div className="brief-title" style={{ marginTop: 9 }}>{item.title}</div>
      <p className="brief-why" style={{ marginBottom: 0 }}>{item.summary}</p>
      <div style={{ marginTop: 10, font: "500 12.5px var(--sans)", color: "var(--ink-4)" }}>{item.saved ? "Saved · " : ""}{item.watch_id} · {item.legal_status}</div>
    </Link>)}</div>
  </section>)}</div>;
}
