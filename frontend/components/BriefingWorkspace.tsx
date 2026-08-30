"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BriefingItemList from "@/components/BriefingItemList";
import BriefingQueryBar from "@/components/BriefingQueryBar";
import { formatDateTime } from "@/lib/design";
import { createSavedView, createSavedViewDigest, deleteSavedView, getBriefingItems, getDigests, getSavedViews, scheduleSavedViewDigest, updateSavedView } from "@/lib/watchApi";
import type { BriefingQuery, Digest, SavedView } from "@/lib/watchTypes";

type RawParams = Record<string, string | string[] | undefined>;
const repeated = ["watch", "source", "topic", "jurisdiction", "source_type", "source_role", "status"] as const;
const defaults: BriefingQuery = { q: "", watch: [], source: [], topic: [], jurisdiction: [], source_type: [], source_role: [], status: [], read: "any", saved: "any", company_connection: "any", packet: "any", impact: null, legal_status: null, sort: "newest", group: "none", view: null, cursor: null, limit: 25 };

function values(raw: RawParams, key: string): string[] { const value = raw[key]; return Array.isArray(value) ? value : value ? [value] : []; }
function parseQuery(raw: RawParams): BriefingQuery {
  const scalar = (key: string) => values(raw, key)[0];
  return { ...defaults, q: scalar("q") ?? "", watch: values(raw, "watch"), source: values(raw, "source"), topic: values(raw, "topic"), jurisdiction: values(raw, "jurisdiction"), source_type: values(raw, "source_type") as BriefingQuery["source_type"], source_role: values(raw, "source_role") as BriefingQuery["source_role"], status: values(raw, "status") as BriefingQuery["status"], read: (scalar("read") as BriefingQuery["read"]) || "any", saved: (scalar("saved") as BriefingQuery["saved"]) || "any", company_connection: (scalar("company_connection") as BriefingQuery["company_connection"]) || "any", packet: (scalar("packet") as BriefingQuery["packet"]) || "any", impact: (scalar("impact") as BriefingQuery["impact"]) || null, legal_status: scalar("legal_status") || null, sort: (scalar("sort") as BriefingQuery["sort"]) || "newest", group: (scalar("group") as BriefingQuery["group"]) || "none", view: scalar("view") || null, cursor: scalar("cursor") || null, limit: Number(scalar("limit")) || 25 };
}
function toParams(query: BriefingQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  for (const key of repeated) for (const value of query[key] as string[]) params.append(key, value);
  for (const key of ["read", "saved", "company_connection", "packet", "sort", "group"] as const) params.set(key, query[key]);
  if (query.impact) params.set("impact", query.impact); if (query.legal_status) params.set("legal_status", query.legal_status);
  if (query.view) params.set("view", query.view); if (query.cursor) params.set("cursor", query.cursor); params.set("limit", String(query.limit));
  return params;
}

export default function BriefingWorkspace({ initialSearchParams }: { initialSearchParams: RawParams }) {
  const router = useRouter();
  const [query, setQuery] = useState(() => parseQuery(initialSearchParams));
  const [items, setItems] = useState<Awaited<ReturnType<typeof getBriefingItems>> | null>(null);
  const [views, setViews] = useState<SavedView[]>([]); const [digests, setDigests] = useState<Digest[]>([]);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const [viewEditor, setViewEditor] = useState<{ mode: "save" | "rename"; name: string; viewId?: string } | null>(null);
  const queryString = useMemo(() => toParams(query).toString(), [query]);

  useEffect(() => { let live = true; setError(""); Promise.all([getBriefingItems(query), getSavedViews(), getDigests()]).then(([page, viewPage, digestPage]) => { if (!live) return; setItems(page); setViews(viewPage.items); setDigests(digestPage.items); if (page.resolved_query) setQuery(page.resolved_query); }).catch((reason: unknown) => live && setError(message(reason))); return () => { live = false; }; }, [initialSearchParams]);

  async function act(action: () => Promise<void>) { setBusy(true); setError(""); try { await action(); } catch (reason) { setError(message(reason)); } finally { setBusy(false); } }
  function apply(next = query) { router.push(`/briefing?${toParams({ ...next, cursor: null }).toString()}`); }
  async function saveView(name: string) { await act(async () => { const view = await createSavedView({ name, query: { ...query, view: null, cursor: null }, display: {} }); setViews((current) => [...current, view]); setViewEditor(null); apply({ ...view.query, view: view.view_id }); }); }
  async function rename(view: SavedView, name: string) { await act(async () => { const updated = await updateSavedView(view.view_id, { expected_revision: view.revision, name }); setViews((current) => current.map((entry) => entry.view_id === updated.view_id ? updated : entry)); setViewEditor(null); }); }
  async function remove(view: SavedView) { if (!window.confirm(`Delete saved view “${view.name}”? Past digests will stay available.`)) return; await act(async () => { await deleteSavedView(view.view_id, view.revision); setViews((current) => current.filter((entry) => entry.view_id !== view.view_id)); if (query.view === view.view_id) apply({ ...defaults }); }); }
  async function digestNow(view: SavedView) { await act(async () => { const digest = await createSavedViewDigest(view.view_id); setDigests((current) => [digest, ...current]); router.push(`/briefing/digests/${encodeURIComponent(digest.digest_id)}`); }); }
  async function schedule(view: SavedView) { await act(async () => { await scheduleSavedViewDigest(view.view_id, { enabled: true, expected_revision: view.revision, recurrence: { kind: "daily", local_time: "08:00", time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, weekdays: [] } }); }); }

  return <main className="page">
    <header className="page-header"><div><div className="eyebrow">Briefing</div><h1 className="headline">For You</h1><p className="deck">Useful legal developments. Reading here does not add work to Today.</p></div><div className="btn-row"><Link className="btn" href="/watches">Watches</Link><button className="btn primary" disabled={busy} onClick={() => setViewEditor({ mode: "save", name: "" })} type="button">Save this view</button></div></header>
    {viewEditor?.mode === "save" ? <ViewNameForm busy={busy} label="Saved view name" name={viewEditor.name} onCancel={() => setViewEditor(null)} onChange={(name) => setViewEditor({ mode: "save", name })} onSave={(name) => saveView(name)} /> : null}
    {error && <div className="error" role="alert">{error}</div>}
    <BriefingQueryBar query={query} onChange={(patch) => setQuery((current) => ({ ...current, ...patch }))} onApply={() => apply()} />
    <div className="list-reader-layout" style={{ marginTop: 20 }}>
      <div className="list-reader-list"><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, font: "500 13px var(--sans)", color: "var(--ink-4)" }}><span>{items ? `${items.total} developments` : "Loading developments…"}</span>{query.view && <span>Saved view restored</span>}</div>{items && <BriefingItemList group={query.group} items={items.items} queryString={queryString} />}</div>
      <aside className="list-reader-reader stack-list" aria-label="Saved Briefing views and digests">
        <section className="card responsive-card" style={{ padding: 18 }}><h2 style={heading}>Saved views</h2>{views.length === 0 ? <p className="faint">No saved views yet.</p> : views.map((view) => <div className="row" key={view.view_id} style={{ display: "block", padding: "12px 0" }}><button className="btn quiet" onClick={() => apply({ ...view.query, view: view.view_id, cursor: null })} type="button">{view.name}</button>{viewEditor?.mode === "rename" && viewEditor.viewId === view.view_id ? <ViewNameForm busy={busy} label={`New name for ${view.name}`} name={viewEditor.name} onCancel={() => setViewEditor(null)} onChange={(name) => setViewEditor({ mode: "rename", name, viewId: view.view_id })} onSave={(name) => rename(view, name)} /> : <div className="btn-row" style={{ marginTop: 8 }}><button className="btn tiny" onClick={() => setViewEditor({ mode: "rename", name: view.name, viewId: view.view_id })} type="button">Rename</button><button className="btn tiny" onClick={() => digestNow(view)}>Digest now</button><button className="btn tiny" onClick={() => schedule(view)}>Schedule daily</button><button className="btn tiny" onClick={() => remove(view)}>Delete</button></div>}</div>)}</section>
        <section className="card responsive-card" style={{ padding: 18 }}><h2 style={heading}>Digests</h2>{digests.length === 0 ? <p className="faint">No digests yet.</p> : digests.map((digest) => <Link href={`/briefing/digests/${encodeURIComponent(digest.digest_id)}`} key={digest.digest_id} className="row" style={{ display: "block", padding: "11px 0", textDecoration: "none" }}><strong>{digest.title}</strong><div className="faint" style={{ marginTop: 4 }}>{digest.item_ids.length} items · {formatDateTime(digest.created_at)}</div></Link>)}</section>
        <section className="card responsive-card" style={{ padding: 18 }}><h2 style={heading}>Briefing tools</h2><div className="btn-row"><Link className="btn" href="/watches">Watches</Link><Link className="btn" href="/watches">Sources</Link></div></section>
      </aside>
    </div>
  </main>;
}

const heading = { margin: "0 0 10px", font: "600 18px var(--serif)" };
function ViewNameForm({ busy, label, name, onCancel, onChange, onSave }: { busy: boolean; label: string; name: string; onCancel: () => void; onChange: (name: string) => void; onSave: (name: string) => Promise<void> }) {
  const trimmed = name.trim();
  return <form className="filter-bar" onSubmit={(event) => { event.preventDefault(); if (trimmed) void onSave(trimmed); }} style={{ marginTop: 12 }}>
    <label>{label}<input autoFocus className="text-input" onChange={(event) => onChange(event.target.value)} required value={name} /></label>
    <div className="filter-bar-actions"><button className="btn primary compact" disabled={busy || !trimmed} type="submit">{busy ? "Saving…" : "Save"}</button><button className="btn compact" disabled={busy} onClick={onCancel} type="button">Cancel</button></div>
  </form>;
}
function message(reason: unknown): string { return reason instanceof Error ? reason.message : "The Briefing request failed."; }
