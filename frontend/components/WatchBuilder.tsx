"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import SourceRoleEditor from "@/components/SourceRoleEditor";
import WatchScanPreview from "@/components/WatchScanPreview";
import { formatDateTime } from "@/lib/design";
import { activateWatch, createWatchDraft, getProviderCapabilities, getWatch, getWatchRuns, pauseWatch, scanWatch, updateWatch } from "@/lib/watchApi";
import type { AttentionState, InternalScope, ProviderCapability, ProviderSelection, Scan, ScheduleRecurrence, Watch, WatchPurpose } from "@/lib/watchTypes";

type EditableWatch = Pick<Watch, "title" | "standing_question" | "public_query" | "purposes" | "sources" | "internal_scope" | "provider" | "recurrence" | "briefing" | "review">;
const purposes: { id: WatchPurpose; label: string }[] = [{ id: "awareness", label: "Awareness" }, { id: "company_impact", label: "Company impact" }, { id: "decision_maintenance", label: "Decision maintenance" }];
const weekdays: ScheduleRecurrence["weekdays"] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const empty: EditableWatch = {
  title: "", standing_question: "", purposes: ["awareness"], provider: "native", sources: [],
  public_query: { standing_question: "", keywords: [], topics: [], jurisdictions: [], regulators: [], courts: [], industries: [], public_source_urls: [], public_entities: [] },
  internal_scope: { product_ids: [], company_paths: [], matter_ids: [], decision_ids: [], mitigation_ids: [], lookback_days: 90 },
  recurrence: { kind: "daily", interval_seconds: null, local_time: "08:00", time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", weekdays: [] },
  briefing: { create_items: true, create_digest: false, saved_view_id: null }, review: { enabled: true, default_attention: "monitor" },
};
const split = (value: string) => value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
const join = (value: string[]) => value.join(", ");
const titleCase = (value: string) => value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
function editableWatch(watch: Watch): EditableWatch {
  return {
    title: watch.title,
    standing_question: watch.standing_question,
    public_query: watch.public_query,
    purposes: watch.purposes,
    sources: watch.sources,
    internal_scope: watch.internal_scope,
    provider: watch.provider,
    recurrence: watch.recurrence,
    briefing: watch.briefing,
    review: watch.review,
  };
}

export default function WatchBuilder({ watchId }: { watchId?: string }) {
  const router = useRouter();
  const [record, setRecord] = useState<Watch | null>(null);
  const [draft, setDraft] = useState<EditableWatch>(empty);
  const [runs, setRuns] = useState<Scan[]>([]);
  const [providers, setProviders] = useState<ProviderCapability[]>([]);
  const [loading, setLoading] = useState(!!watchId);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [capabilities, watch, history] = await Promise.all([
        getProviderCapabilities(), watchId ? getWatch(watchId) : Promise.resolve(null), watchId ? getWatchRuns(watchId, { limit: 20 }) : Promise.resolve({ items: [], next_cursor: null, total: 0 }),
      ]);
      setProviders(capabilities.items);
      if (watch) { setRecord(watch); setDraft(editableWatch(watch)); setRuns(history.items); }
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load the Watch."); }
    finally { setLoading(false); }
  }, [watchId]);
  useEffect(() => { void load(); }, [load]);

  function patch(change: Partial<EditableWatch>) { setDraft((current) => ({ ...current, ...change })); setNotice(""); }
  function patchQuery(key: keyof EditableWatch["public_query"], value: unknown) { patch({ public_query: { ...draft.public_query, [key]: value } }); }
  function patchScope(key: keyof InternalScope, value: string[] | number) { patch({ internal_scope: { ...draft.internal_scope, [key]: value } }); }

  function normalized(): EditableWatch {
    const standing = draft.standing_question.trim();
    return {
      title: draft.title.trim(),
      standing_question: standing,
      public_query: { ...draft.public_query, standing_question: draft.public_query.standing_question.trim() || standing, public_source_urls: draft.sources.filter((source) => source.role !== "excluded").map((source) => source.canonical_url).filter((url) => /^https:\/\//.test(url)) },
      purposes: draft.purposes,
      sources: draft.sources,
      internal_scope: draft.internal_scope,
      provider: draft.provider,
      recurrence: draft.recurrence,
      briefing: draft.briefing,
      review: draft.review,
    };
  }

  async function save(): Promise<Watch> {
    const payload = normalized();
    if (!payload.title || !payload.standing_question || !payload.public_query.standing_question) throw new Error("Add a title, standing question, and public query before saving.");
    if (!payload.purposes.length) throw new Error("Select at least one purpose.");
    if (payload.sources.some((source) => !source.name.trim() || !/^https:\/\//.test(source.canonical_url))) throw new Error("Each named source needs a name and a public HTTPS URL.");
    if (!record) {
      const created = await createWatchDraft({ title: payload.title, standing_question: payload.standing_question, public_query: payload.public_query, purposes: payload.purposes, provider: payload.provider });
      const updated = await updateWatch(created.watch_id, { expected_revision: created.revision, sources: payload.sources, internal_scope: payload.internal_scope, recurrence: payload.recurrence, briefing: payload.briefing, review: payload.review });
      setRecord(updated); setDraft(editableWatch(updated)); return updated;
    }
    const updated = await updateWatch(record.watch_id, { expected_revision: record.revision, ...payload });
    setRecord(updated); setDraft(editableWatch(updated)); return updated;
  }

  async function act(action: "save" | "scan" | "start" | "pause") {
    setBusy(action); setError(""); setNotice("");
    try {
      const saved = await save();
      if (action === "save") { setNotice("Draft saved. The Watch remains disabled."); if (!watchId) router.push(`/watches/${encodeURIComponent(saved.watch_id)}`); return; }
      if (action === "scan") {
        const result = await scanWatch(saved.watch_id, { mode: saved.enabled ? "manual" : "draft" });
        const refreshed = await getWatch(saved.watch_id); setRecord(refreshed); setDraft(editableWatch(refreshed));
        setRuns((current) => [result.scan, ...current.filter((run) => run.scan_id !== result.scan.scan_id)]);
        setNotice("Scan saved. The schedule state did not change."); if (!watchId) router.push(`/watches/${encodeURIComponent(saved.watch_id)}`); return;
      }
      if (action === "start") { const result = await activateWatch(saved.watch_id, { expected_revision: saved.revision }); setRecord(result.watch); setDraft(editableWatch(result.watch)); setNotice("Watch started. Its schedule is active."); if (!watchId) router.push(`/watches/${encodeURIComponent(saved.watch_id)}`); return; }
      const paused = await pauseWatch(saved.watch_id, { expected_revision: saved.revision }); setRecord(paused); setDraft(editableWatch(paused)); setNotice("Watch paused. Saved settings are unchanged.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The Watch action failed."); }
    finally { setBusy(""); }
  }

  if (loading) return <div className="loading">Loading Watch…</div>;
  if (error && watchId && !record) return <><p className="error" role="alert">{error}</p><Link className="btn" href="/watches">Back to Watches</Link></>;
  const status = record?.status ?? "draft";
  const statusClass = status === "failed" ? "state-failure" : status === "healthy" ? "state-healthy" : status === "draft" || status === "scanning" ? "state-agent" : "state-attention";

  return <>
    <div className="page-header"><div><div className="record-meta">Briefing · Watch Builder</div><h1>{record ? draft.title || "Edit Watch" : "New Watch"}</h1><p>Define one public monitoring assignment. You can save or scan it without starting a schedule.</p></div><div className="btn-row"><span className={`state-label ${statusClass}`}>{titleCase(status)}</span><Link className="btn quiet" href="/watches">All Watches</Link></div></div>
    {error ? <p className="error" role="alert">{error}</p> : null}{notice ? <div className="warning-callout" role="status" style={{ marginTop: 16 }}>{notice}</div> : null}
    <div className="stack-list" style={{ marginTop: 24 }}>
      <section className="card card-pad"><h2>Assignment</h2><p className="muted">State what to watch and why it matters.</p>
        <div style={{ display: "grid", gap: 14 }}><label className="field-label">Watch title<input autoFocus={!watchId} className="text-input" onChange={(event) => patch({ title: event.target.value })} value={draft.title} /></label><label className="field-label">Standing question<textarea className="text-input" onChange={(event) => { patch({ standing_question: event.target.value }); if (!draft.public_query.standing_question || draft.public_query.standing_question === draft.standing_question) patchQuery("standing_question", event.target.value); }} rows={3} value={draft.standing_question} /></label><label className="field-label">Public query<textarea className="text-input" onChange={(event) => patchQuery("standing_question", event.target.value)} rows={3} value={draft.public_query.standing_question} /><span className="small muted">Only public collection terms and public entities belong here.</span></label></div>
        <fieldset style={{ border: 0, padding: 0, margin: "18px 0 0" }}><legend className="field-label">Purpose</legend>{purposes.map((purpose) => <label className="checkbox-row" key={purpose.id}><input checked={draft.purposes.includes(purpose.id)} onChange={() => patch({ purposes: draft.purposes.includes(purpose.id) ? draft.purposes.filter((item) => item !== purpose.id) : [...draft.purposes, purpose.id] })} type="checkbox" />{purpose.label}</label>)}</fieldset>
      </section>
      <section className="card card-pad"><h2>Public topics and scope</h2><p className="muted">Use commas to separate values.</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>{(["keywords", "topics", "jurisdictions", "regulators", "courts", "industries"] as const).map((key) => <label className="field-label" key={key}>{titleCase(key)}<input className="text-input" onChange={(event) => patchQuery(key, split(event.target.value))} value={join(draft.public_query[key])} /></label>)}</div></section>
      <section className="card card-pad"><h2>Named sources and roles</h2><p className="muted">Source type states what a source is. Role states how this Watch uses it.</p><SourceRoleEditor onChange={(sources) => patch({ sources })} sources={draft.sources} /></section>
      <section className="card card-pad"><h2>Provider</h2><p className="muted">The choice is saved on this Watch. A provider failure does not change it.</p><div className="btn-row">{(["native", "polaris", "both"] as ProviderSelection[]).map((provider) => <button aria-pressed={draft.provider === provider} className={`btn ${draft.provider === provider ? "primary" : ""}`} key={provider} onClick={() => patch({ provider })} type="button">{provider === "native" ? "Counsel OS native" : titleCase(provider)}</button>)}</div>{providers.filter((provider) => !provider.available || provider.warning).map((provider) => <p className="warning-callout" key={provider.provider_id}><strong>{provider.label}:</strong> {provider.warning || "Not available."}</p>)}</section>
      <section className="card card-pad"><h2>Internal matching scope</h2><p className="muted">This private scope stays inside Counsel OS. Use commas to separate record IDs or paths.</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>{(["product_ids", "company_paths", "matter_ids", "decision_ids", "mitigation_ids"] as const).map((key) => <label className="field-label" key={key}>{titleCase(key)}<input className="text-input" onChange={(event) => patchScope(key, split(event.target.value))} value={join(draft.internal_scope[key])} /></label>)}<label className="field-label">Lookback days<input className="text-input" min={1} onChange={(event) => patchScope("lookback_days", Number(event.target.value))} type="number" value={draft.internal_scope.lookback_days} /></label></div></section>
      <ScheduleSection draft={draft} patch={patch} />
      <section className="card card-pad"><h2>Briefing and review behavior</h2><label className="checkbox-row"><input checked={draft.briefing.create_items} onChange={(event) => patch({ briefing: { ...draft.briefing, create_items: event.target.checked } })} type="checkbox" />Create Briefing items</label><label className="checkbox-row"><input checked={draft.briefing.create_digest} onChange={(event) => patch({ briefing: { ...draft.briefing, create_digest: event.target.checked } })} type="checkbox" />Create a digest</label><label className="checkbox-row"><input checked={draft.review.enabled} onChange={(event) => patch({ review: { ...draft.review, enabled: event.target.checked } })} type="checkbox" />Create review connections when company work may be affected</label><label className="field-label" style={{ marginTop: 12 }}>Default attention<select className="select-input" disabled={!draft.review.enabled} onChange={(event) => patch({ review: { ...draft.review, default_attention: event.target.value as AttentionState } })} value={draft.review.default_attention}><option value="briefing_only">Briefing only</option><option value="monitor">Monitor</option><option value="this_week">This week</option><option value="required">Required</option></select></label></section>
      <div className="card card-pad"><div className="btn-row"><button className="btn" disabled={!!busy} onClick={() => void act("save")} type="button">{busy === "save" ? "Saving…" : "Save draft"}</button><button className="btn agent" disabled={!!busy} onClick={() => void act("scan")} type="button">{busy === "scan" ? "Scanning…" : "Scan now"}</button>{record?.enabled ? <button className="btn review" disabled={!!busy} onClick={() => void act("pause")} type="button">{busy === "pause" ? "Pausing…" : "Pause schedule"}</button> : <button className="btn primary" disabled={!!busy} onClick={() => void act("start")} type="button">{busy === "start" ? "Starting…" : "Start Watch"}</button>}</div><p className="small muted" style={{ margin: "12px 0 0" }}>Start Watch is the only action that enables a schedule. Scan now saves first and does not activate one.</p></div>
      <WatchScanPreview scan={runs[0] ?? null} />
      {record ? <section className="card card-pad"><h2>Run history</h2>{runs.length ? <div className="row-list" style={{ margin: "12px -20px -18px" }}>{runs.map((run) => <div className="row" key={run.scan_id}><div style={{ flex: 1 }}><strong>{titleCase(run.mode)} scan</strong><div className="record-meta" style={{ marginTop: 6 }}>{formatDateTime(run.started_at)} · {run.scan_id}</div></div><span className={`state-label ${run.status === "success" ? "state-healthy" : run.status === "failed" ? "state-failure" : run.status === "running" ? "state-agent" : "state-attention"}`}>{titleCase(run.status)}</span></div>)}</div> : <p className="muted">No scans yet.</p>}</section> : null}
    </div>
  </>;
}

function ScheduleSection({ draft, patch }: { draft: EditableWatch; patch: (change: Partial<EditableWatch>) => void }) {
  const recurrence = draft.recurrence;
  function set(change: Partial<ScheduleRecurrence>) { patch({ recurrence: { ...recurrence, ...change } }); }
  function kind(value: ScheduleRecurrence["kind"]) {
    if (value === "manual") set({ kind: value, interval_seconds: null, local_time: null, time_zone: null, weekdays: [] });
    else if (value === "interval") set({ kind: value, interval_seconds: recurrence.interval_seconds || 86400, local_time: null, time_zone: null, weekdays: [] });
    else set({ kind: value, interval_seconds: null, local_time: recurrence.local_time || "08:00", time_zone: recurrence.time_zone || "UTC", weekdays: value === "weekday" ? recurrence.weekdays.length ? recurrence.weekdays : ["monday"] : [] });
  }
  return <section className="card card-pad"><h2>Cadence and time zone</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}><label className="field-label">Cadence<select className="select-input" onChange={(event) => kind(event.target.value as ScheduleRecurrence["kind"])} value={recurrence.kind}><option value="manual">Manual only</option><option value="interval">Interval</option><option value="daily">Daily</option><option value="weekday">Selected weekdays</option></select></label>{recurrence.kind === "interval" ? <label className="field-label">Every (hours)<input className="text-input" min={1} onChange={(event) => set({ interval_seconds: Number(event.target.value) * 3600 })} type="number" value={(recurrence.interval_seconds || 3600) / 3600} /></label> : null}{recurrence.kind === "daily" || recurrence.kind === "weekday" ? <><label className="field-label">Local time<input className="text-input" onChange={(event) => set({ local_time: event.target.value })} type="time" value={recurrence.local_time || "08:00"} /></label><label className="field-label">IANA time zone<input className="text-input" onChange={(event) => set({ time_zone: event.target.value })} value={recurrence.time_zone || "UTC"} /></label></> : null}</div>{recurrence.kind === "weekday" ? <fieldset style={{ border: 0, padding: 0, margin: "16px 0 0" }}><legend className="field-label">Run on</legend><div className="btn-row">{weekdays.map((day) => <label className="checkbox-row" key={day}><input checked={recurrence.weekdays.includes(day)} onChange={() => set({ weekdays: recurrence.weekdays.includes(day) ? recurrence.weekdays.filter((item) => item !== day) : [...recurrence.weekdays, day] })} type="checkbox" />{titleCase(day)}</label>)}</div></fieldset> : null}</section>;
}
