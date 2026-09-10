"use client";

import Link from "next/link";
import styles from "./BriefingPhase2.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import BriefingItemList from "@/components/BriefingItemList";
import BriefingQueryBar from "@/components/BriefingQueryBar";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DataLoadStatus from "@/components/DataLoadStatus";
import { formatDateTime } from "@/lib/design";
import { createSavedView, createSavedViewDigest, deleteSavedView, getBriefingItems, getDigests, getSavedViews, getWatches, scheduleSavedViewDigest, updateSavedView } from "@/lib/watchApi";
import type { BriefingQuery, Digest, SavedView } from "@/lib/watchTypes";

type RawParams = Record<string, string | string[] | undefined>;
type Counts = { all: number; unread: number; review: number; saved: number };
const repeated = ["watch", "source", "topic", "jurisdiction", "source_type", "source_role", "status"] as const;
const defaults: BriefingQuery = { q: "", watch: [], source: [], topic: [], jurisdiction: [], source_type: [], source_role: [], status: [], read: "any", saved: "any", company_connection: "any", packet: "any", impact: null, legal_status: null, sort: "newest", group: "none", view: null, cursor: null, limit: 25 };

function values(raw: RawParams, key: string): string[] { const value = raw[key]; return Array.isArray(value) ? value : value ? [value] : []; }
/** The URL is the source of truth once the lawyer starts filtering. */
function rawFrom(params: URLSearchParams): RawParams {
  const raw: RawParams = {};
  for (const key of new Set(params.keys())) {
    const all = params.getAll(key);
    raw[key] = all.length > 1 ? all : all[0];
  }
  return raw;
}
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

/** True when the lawyer has narrowed the list past the plain default view. */
function isFiltered(query: BriefingQuery): boolean {
  if (query.q || query.view || query.impact || query.legal_status) return true;
  if (query.read !== "any" || query.saved !== "any" || query.company_connection !== "any" || query.packet !== "any") return true;
  return repeated.some((key) => (query[key] as string[]).length > 0);
}

const SORT_WORD: Record<string, string> = {
  newest: "newest first", relevance: "best match", potential_impact: "biggest potential impact",
  primary_sources: "primary sources first", effective_date: "soonest effective date",
  unread: "unread first", connected_decisions: "connected to a decision",
};

export default function BriefingWorkspace({ initialSearchParams }: { initialSearchParams: RawParams }) {
  const router = useRouter();
  const search = useSearchParams();
  const searchKey = search.toString();
  const [query, setQuery] = useState(() => parseQuery(initialSearchParams));
  const [items, setItems] = useState<Awaited<ReturnType<typeof getBriefingItems>> | null>(null);
  const [views, setViews] = useState<SavedView[]>([]); const [digests, setDigests] = useState<Digest[]>([]);
  const [watchNames, setWatchNames] = useState<Record<string, string>>({});
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true); const [loadError, setLoadError] = useState("");
  const [error, setError] = useState(""); const [notice, setNotice] = useState(""); const [busy, setBusy] = useState(false);
  const [viewEditor, setViewEditor] = useState<{ mode: "save" | "rename"; name: string; viewId?: string } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<SavedView | null>(null);
  const loadGeneration = useRef(0);
  const queryString = useMemo(() => toParams(query).toString(), [query]);
  const activeView = views.find((view) => view.view_id === query.view) ?? null;

  const load = useCallback(async () => {
    const generation = ++loadGeneration.current;
    setLoading(true); setLoadError("");
    const requested = parseQuery(rawFrom(new URLSearchParams(searchKey)));
    setQuery(requested);
    try {
      const [page, viewPage, digestPage] = await Promise.all([getBriefingItems(requested), getSavedViews(), getDigests()]);
      if (generation !== loadGeneration.current) return;
      setItems(page); setViews(viewPage.items); setDigests(digestPage.items);
      if (page.resolved_query) setQuery(page.resolved_query);
    } catch {
      if (generation === loadGeneration.current) setLoadError("Briefing is unavailable because its current data could not be loaded.");
    } finally {
      if (generation === loadGeneration.current) setLoading(false);
    }
  }, [searchKey]);

  useEffect(() => {
    void load();
  }, [load]);

  /* Watch names and the count chips are orientation. Neither may break the list. */
  useEffect(() => {
    let live = true;
    getWatches({ limit: 100 })
      .then((page) => live && setWatchNames(Object.fromEntries(page.items.map((watch) => [watch.watch_id, watch.title]))))
      .catch(() => undefined);
    Promise.all([
      getBriefingItems({ limit: 1 }), getBriefingItems({ limit: 1, read: "no" }),
      getBriefingItems({ limit: 1, packet: "required" }), getBriefingItems({ limit: 1, saved: "yes" }),
    ])
      .then(([all, unread, review, saved]) => live && setCounts({ all: all.total, unread: unread.total, review: review.total, saved: saved.total }))
      .catch(() => undefined);
    return () => { live = false; };
  }, [searchKey]);

  async function act(action: () => Promise<void>) { setBusy(true); setError(""); setNotice(""); try { await action(); } catch (reason) { setError(message(reason)); } finally { setBusy(false); } }
  function apply(next = query) { router.push(`/briefing?${toParams({ ...next, cursor: null }).toString()}`); }
  async function saveView(name: string) { await act(async () => { const view = await createSavedView({ name, query: { ...query, view: null, cursor: null }, display: {} }); setViews((current) => [...current, view]); setViewEditor(null); apply({ ...view.query, view: view.view_id }); }); }
  async function rename(view: SavedView, name: string) { await act(async () => { const updated = await updateSavedView(view.view_id, { expected_revision: view.revision, name }); setViews((current) => current.map((entry) => entry.view_id === updated.view_id ? updated : entry)); setViewEditor(null); }); }
  function remove(view: SavedView) { setDeleteConfirmation(view); }
  async function confirmRemove(view: SavedView) {
    setBusy(true); setError(""); setNotice("");
    try {
      await deleteSavedView(view.view_id, view.revision);
      setViews((current) => current.filter((entry) => entry.view_id !== view.view_id));
      if (query.view === view.view_id) apply({ ...defaults });
    } catch (reason) {
      const failure = message(reason);
      setError(failure);
      throw new Error(failure);
    } finally { setBusy(false); }
  }
  async function digestNow(view: SavedView) { await act(async () => { const digest = await createSavedViewDigest(view.view_id); setDigests((current) => [digest, ...current]); router.push(`/briefing/digests/${encodeURIComponent(digest.digest_id)}`); }); }
  async function schedule(view: SavedView) { await act(async () => { await scheduleSavedViewDigest(view.view_id, { enabled: true, expected_revision: view.revision, recurrence: { kind: "daily", local_time: "08:00", time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, weekdays: [] } }); setNotice(`“${view.name}” will make a digest every day at 8:00 AM. Manage it on Automations.`); }); }

  /* Chips are filters, the same way the Matters counts are filters. */
  const chips: { key: string; label: string; count?: number; active: boolean; next: BriefingQuery }[] = [
    { key: "all", label: "Everything", count: counts?.all, active: !isFiltered(query), next: { ...defaults, sort: query.sort, group: query.group } },
    { key: "review", label: "Needs your review", count: counts?.review, active: query.packet === "required", next: { ...defaults, sort: query.sort, group: query.group, packet: "required" } },
    { key: "unread", label: "Unread", count: counts?.unread, active: query.read === "no", next: { ...defaults, sort: query.sort, group: query.group, read: "no" } },
    { key: "saved", label: "Saved", count: counts?.saved, active: query.saved === "yes", next: { ...defaults, sort: query.sort, group: query.group, saved: "yes" } },
  ];

  return <AppShell><main className={styles.overview}>
    <header className="page-header">
      <div className="page-header-main">
        <div className="eyebrow">Briefing overview</div>
        <h1 className="headline">Stay current without losing your place</h1>
        <p className="page-lede">
          Track the developments that matter to your work.
        </p>
      </div>
      <div className={styles.saveView}>
        <button className="btn primary" disabled={busy || !items} onClick={() => setViewEditor({ mode: "save", name: "" })} type="button">Save this view</button>
      </div>
    </header>

    {viewEditor?.mode === "save" && items ? <ViewNameForm busy={busy} help="A saved view remembers this exact search so you can return to it, or turn it into a daily digest." label="Name this view" name={viewEditor.name} onCancel={() => setViewEditor(null)} onChange={(name) => setViewEditor({ mode: "save", name })} onSave={(name) => saveView(name)} /> : null}
    <DataLoadStatus error={loadError} loading={loading} loadingLabel={items ? "Refreshing Briefing…" : "Reading your Watches…"} onRetry={load} />
    {error && <div className="error" role="alert">{error}</div>}
    {notice && <div className="warning-callout" style={{ marginTop: 14 }} role="status">{notice}</div>}

    {items ? <>
    <div className="stat-chips" style={{ marginTop: 20 }}>
      {chips.map((chip) => <button
        className={`stat-chip ${chip.active ? "active" : ""}`}
        key={chip.key} onClick={() => apply(chip.next)} type="button"
      >
        <b>{chip.count ?? "—"}</b><span>{chip.label}</span>
      </button>)}
    </div>

    <BriefingQueryBar
      query={query}
      filtered={isFiltered(query)}
      onChange={(patch) => setQuery((current) => ({ ...current, ...patch }))}
      onApply={() => apply()}
      onClear={() => apply({ ...defaults })}
    />

    <div className={styles.overviewContents}>
      <div className="work-main">
        <div className="query-summary">
          <span className="query-summary-count">
            {items ? `${items.total} ${items.total === 1 ? "development" : "developments"}` : "Loading developments…"}
            {activeView ? ` in “${activeView.name}”` : ""}
          </span>
          <span className="query-summary-note">Ordered by {SORT_WORD[query.sort] ?? query.sort}</span>
        </div>
        <BriefingItemList group={query.group} items={items.items} queryString={queryString} watchNames={watchNames} />
      </div>

      <aside className={styles.rail} aria-label="Saved views, digests and Watches">
        <section className="rail-card">
          <div className={styles.railHeading}><h2 className="rail-card-title">Saved views</h2><Link href="/watches">Manage watches</Link></div>
          <p className="rail-card-help">A saved view remembers a search. Open one to return to it, or turn it into a digest.</p>
          {views.length === 0
            ? <p className="rail-card-empty">You haven&apos;t saved a view yet. Set the filters above, then choose <strong>Save this view</strong>.</p>
            : <div className="rail-card-body">{views.map((view) => <div className="rail-entry" key={view.view_id}>
              <button className="rail-entry-name" onClick={() => apply({ ...view.query, view: view.view_id, cursor: null })} type="button">{view.name}</button>
              {query.view === view.view_id ? <div className="rail-entry-meta">Showing now</div> : null}
              {viewEditor?.mode === "rename" && viewEditor.viewId === view.view_id
                ? <ViewNameForm busy={busy} label={`New name for ${view.name}`} name={viewEditor.name} onCancel={() => setViewEditor(null)} onChange={(name) => setViewEditor({ mode: "rename", name, viewId: view.view_id })} onSave={(name) => rename(view, name)} />
                : <details className={styles.viewMenu}><summary aria-label={`Actions for ${view.name}`}>•••</summary><div className="rail-entry-actions">
                  <button className="btn tiny" disabled={busy} onClick={() => digestNow(view)} type="button">Make a digest now</button>
                  <button className="btn tiny" disabled={busy} onClick={() => schedule(view)} type="button">Digest daily at 8 AM</button>
                  <button className="btn tiny" onClick={() => setViewEditor({ mode: "rename", name: view.name, viewId: view.view_id })} type="button">Rename</button>
                  <button className="btn tiny" disabled={busy} onClick={() => remove(view)} type="button">Delete</button>
                </div></details>}
            </div>)}</div>}
        </section>

        <section className="rail-card">
          <h2 className="rail-card-title">Digests</h2>
          <p className="rail-card-help">A digest saves a summary and item list for one date. Its links open current item records.</p>
          {digests.length === 0
            ? <p className="rail-card-empty">No digest yet. Save a view, then choose <strong>Make a digest now</strong>.</p>
            : <div className="rail-card-body">{digests.map((digest) => <div className="rail-entry" key={digest.digest_id}>
              <Link className="rail-entry-name" href={`/briefing/digests/${encodeURIComponent(digest.digest_id)}`}>{digest.title}</Link>
              <div className="rail-entry-meta">{digest.item_ids.length} {digest.item_ids.length === 1 ? "item" : "items"} · {formatDateTime(digest.created_at)}</div>
            </div>)}</div>}
        </section>

        <section className="rail-card">
          <h2 className="rail-card-title">Where this comes from</h2>
          <p className="rail-card-help">Watches are the standing searches that fill this page. Change what a Watch looks for and this list changes with it.</p>
          <div className="btn-row" style={{ marginTop: 13 }}>
            <Link className="btn compact" href="/watches">All Watches</Link>
            <Link className="btn compact" href="/watches/new">New Watch</Link>
          </div>
        </section>
      </aside>
    </div>
    </> : null}
  </main>{deleteConfirmation ? <ConfirmationDialog
    confirmLabel="Delete saved view"
    description={`Delete saved view “${deleteConfirmation.name}”? Past digests will stay available.`}
    onCancel={() => setDeleteConfirmation(null)}
    onConfirm={() => confirmRemove(deleteConfirmation)}
    title="Delete saved view?"
  /> : null}</AppShell>;
}

function ViewNameForm({ busy, help, label, name, onCancel, onChange, onSave }: { busy: boolean; help?: string; label: string; name: string; onCancel: () => void; onChange: (name: string) => void; onSave: (name: string) => Promise<void> }) {
  const trimmed = name.trim();
  return <form className="filter-bar" onSubmit={(event) => { event.preventDefault(); if (trimmed) void onSave(trimmed); }} style={{ marginTop: 12 }}>
    <label style={{ flex: "1 1 240px" }}>{label}<input autoFocus className="text-input" onChange={(event) => onChange(event.target.value)} required value={name} />
      {help ? <span className="form-help">{help}</span> : null}
    </label>
    <div className="filter-bar-actions"><button className="btn primary compact" disabled={busy || !trimmed} type="submit">{busy ? "Saving…" : "Save"}</button><button className="btn compact" disabled={busy} onClick={onCancel} type="button">Cancel</button></div>
  </form>;
}
function message(reason: unknown): string { return reason instanceof Error ? reason.message : "The Briefing request failed."; }
