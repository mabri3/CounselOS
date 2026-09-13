"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import styles from "./storage.module.css";
import { changeMatterStorage, getStoredMatters, type MatterStorageView, type StoredMatter } from "@/lib/api";

export default function MatterStoragePage() {
  const [view, setView] = useState<MatterStorageView>("active");
  const [matters, setMatters] = useState<StoredMatter[]>([]);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try { setMatters((await getStoredMatters(view)).matters); setError(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load matters."); }
    finally { setLoading(false); }
  }, [view]);
  useEffect(() => { void load(); }, [load]);
  async function change(matter: StoredMatter, action: "archive" | "trash" | "restore") {
    setBusy(true); setError(""); setMessage("");
    try {
      await changeMatterStorage(matter.matter_id, action);
      setMessage(`${matter.title}: ${action === "archive" ? "archived" : action === "trash" ? "moved to trash" : "restored to active matters"}.`);
      await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not change this matter."); }
    finally { setBusy(false); }
  }
  const visible = matters.filter(matter => matter.title.toLowerCase().includes(search.toLowerCase()));
  return <AppShell><main className={`page ${styles.page}`}>
    <div className="page-header"><div><h1>Archive &amp; trash</h1><p>Keep inactive matters out of your daily work. Restore them at any time.</p></div><Link className="btn" href="/experimental/chat">Back to chat</Link></div>
    <p>Archive keeps a matter in place. Trash moves its whole folder into <code>99_Trash/</code> in this vault. Files and history are kept. Nothing is permanently deleted.</p>
    <fieldset className="segmented" disabled={busy || loading}><legend className="sr-only">Matter storage views</legend>{(["active", "archived", "trash"] as const).map(value => <span className="segmented-option" key={value}><input className="segmented-input" type="radio" id={`storage-${value}`} name="storage-view" checked={view === value} onChange={() => { setView(value); setMessage(""); }}/><label htmlFor={`storage-${value}`}>{value === "active" ? "Active" : value === "archived" ? "Archived" : "Trash"}</label></span>)}</fieldset>
    <p><input className="text-input" aria-label="Find stored matter" type="search" placeholder="Find a matter…" value={search} onChange={event => setSearch(event.target.value)}/></p>
    {error && <p role="alert">{error} <button className="btn" onClick={() => void load()} disabled={busy}>Retry</button></p>}
    {message && <p role="status">{message}</p>}
    {loading ? <p role="status">Loading matters…</p> : <>
      {visible.length === 0 && <p>No {view === "trash" ? "trashed" : view} matters{search ? " match this search" : ""}.</p>}
      {visible.map(matter => <section className="rail-card" key={matter.matter_id} aria-label={matter.title}>
        <h2>{matter.title}</h2><p>{matter.state === "active" ? "Active" : matter.state === "archived" ? "Archived" : "In trash"} · <code>{matter.path}</code></p>
        <div className="btn-row">
          {view === "active" && <Link className="btn" href={`/experimental/chat?matter=${encodeURIComponent(matter.matter_id)}`}>Open matter</Link>}
          {view === "active" && <button className="btn" disabled={busy} onClick={() => void change(matter, "archive")}>Archive</button>}
          {view !== "active" && <button className="btn" disabled={busy} onClick={() => void change(matter, "restore")}>Restore</button>}
          {view !== "trash" && <button className="btn" disabled={busy} onClick={() => void change(matter, "trash")}>Move to trash</button>}
        </div>
      </section>)}
    </>}
  </main></AppShell>;
}
