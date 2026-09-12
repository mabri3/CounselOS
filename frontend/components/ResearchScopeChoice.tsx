"use client";

import { useEffect, useRef, useState } from "react";
import { getResearchOptions, startResearchRun } from "@/lib/api";
import type { ResearchRun } from "@/lib/types";
import type { ResearchScope, ResearchOptions } from "@/lib/researchScope";
import styles from "./ResearchScopeChoice.module.css";

export function ResearchScopeFields({ value, onChange, options, disabled, compact = false }: {
  value: ResearchScope; onChange: (value: ResearchScope) => void; options: ResearchOptions; disabled?: boolean; compact?: boolean;
}) {
  if (compact) return <fieldset disabled={disabled} className={styles.compact}>
    <legend>What sources should I use?</legend>
    <label className={styles.check}><input type="checkbox" checked={value.external} disabled={!options.provider_ids.length && !options.native_available && !options.firecrawl_available} onChange={event => onChange({ ...value, external: event.target.checked })} /> External sources</label>
    <label className={styles.check}><input type="checkbox" checked={value.other_matters} onChange={event => onChange({ ...value, other_matters: event.target.checked })} /> Other matters</label>
    <p>Leave both unchecked to review only this matter.</p>
  </fieldset>;

  return <fieldset disabled={disabled} className={styles.fields}>
    <legend>Where should I look?</legend>
    <p>This matter is always included. Choose extra sources for this request only.</p>
    <label className={styles.check}><input type="checkbox" checked={value.external} disabled={!options.provider_ids.length && !options.native_available && !options.firecrawl_available} onChange={event => onChange({ ...value, external: event.target.checked })} /> External sources</label>
    <label className={styles.check}><input type="checkbox" checked={value.other_matters} onChange={event => onChange({ ...value, other_matters: event.target.checked })} /> Search other active matters</label>
    {value.external && <p>{value.allow_followup_queries ? "Themis will turn your question into focused searches, compare relevant sources, and follow important gaps." : "Themis will plan focused searches from your question. Follow-up searches are off in Research options."}</p>}
    <details><summary>Research options</summary>
    {value.external && <label className={styles.query}>Public research topic
      <textarea value={value.public_query} maxLength={2000} onChange={event => onChange({ ...value, public_query: event.target.value })} placeholder="Legal topic and jurisdiction. Do not include private names or facts." />
      <span>{value.allow_followup_queries ? "Themis will use this topic to plan distinct searches, compare relevant sources, and follow important gaps. This is not a limit of one search." : "This topic guides the initial research. Follow-up searches are off; you can enable them in Research options."} Private matter details stay with the analysis model.</span>
    </label>}

    {options.main_model_selection && <p>Main analysis: {options.main_model_selection.provider} · {options.main_model_selection.model}. Saved for this run.</p>}
    {options.model_selection && <p>Collection model: {options.model_selection.provider} · {options.model_selection.model} · {options.model_selection.reasoning_effort || "default"} effort. This selection is saved for this run.</p>}
    <p>{options.cost_notice}</p>
    {options.model_selection ? <>
      <label>Search method<select value={value.native ? "native" : "configured"} onChange={event => onChange({...value, native:event.target.value === "native"})}>
        <option value="native">Native search first</option><option value="configured">Configured search services</option>
      </select></label>
      {value.native ? <>
        <p>{options.native_available ? "Use the selected provider's web search. Read pages directly, then use Playwright when needed." : "Native search is not supported for this provider. Enable Firecrawl fallback to search externally."}</p>
        <label className={styles.check}><input type="checkbox" checked={value.allow_firecrawl === true} disabled={!options.firecrawl_available} onChange={event => onChange({...value, allow_firecrawl:event.target.checked})}/>Allow Firecrawl fallback — may incur charges</label>
        {!options.firecrawl_available && <p>Firecrawl is not configured.</p>}
      </> : <p>Providers: {options.provider_ids.join(" → ") || "None configured"}.</p>}
    </> : <p>Providers: {options.provider_ids.join(" → ") || "None configured"}. A fallback is used if the first provider does not retrieve sources.</p>}
    {options.allow_followup_queries !== undefined && <><label className={styles.check}><input type="checkbox" checked={value.allow_followup_queries === true} onChange={event => onChange({...value, allow_followup_queries:event.target.checked})} /> Include focused follow-up searches for this question</label><p>Up to 3 batches, 4 requests per batch, 16 source fetches, and 10 active minutes. Fetched PDFs are read up to 30 pages, and OCR to 6 pages per attempt. Sources already saved to this matter are extracted to their full length and searched separately. Coverage gaps remain visible.</p></>}
    <p>{options.sensitivity_notice}</p>
    </details>
    <p>Neither selected means this matter only. Normal model usage can still have costs.</p>
  </fieldset>;
}

export function useResearchScope(ownerMatterId: string) {
  const [pending, setPending] = useState<{ matterId: string; question: string; key?: string; issueId?: string; options: ResearchOptions } | null>(null);
  const [value, setValue] = useState<ResearchScope>({ external: false, other_matters: false, public_query: "", provider_ids: [] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const resolve = useRef<((run: ResearchRun | null) => void) | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const owner = useRef(ownerMatterId);
  owner.current = ownerMatterId;
  useEffect(() => {
    if (pending) dialog.current?.showModal();
  }, [pending]);
  useEffect(() => {
    setPending(null);
    return () => { resolve.current?.(null); resolve.current = null; };
  }, [ownerMatterId]);

  async function startScopedResearch(matterId: string, question = "", key?: string, issueId?: string): Promise<ResearchRun | null> {
    const options = await getResearchOptions(matterId);
    if (owner.current !== matterId) return null;
    setValue({ external: false, other_matters: false, public_query: "", provider_ids: options.provider_ids, native:options.native_available === true, allow_firecrawl:false, model_selection:options.model_selection, main_model_selection:options.main_model_selection, collector_model_selection:options.collector_model_selection, allow_followup_queries:options.allow_followup_queries === true });
    setError("");
    return new Promise(done => {
      resolve.current?.(null);
      resolve.current = done;
      setPending({ matterId, question, key: key ?? `research-ui:${crypto.randomUUID()}`, issueId, options });
    });
  }
  function finish(run: ResearchRun | null) {
    resolve.current?.(run); resolve.current = null; setPending(null);
  }
  const researchScopeDialog = pending ? <dialog aria-labelledby="research-source-heading" className={styles.dialog} ref={dialog} onCancel={event => { event.preventDefault(); if (!busy) finish(null); }}>
    <form onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError("");
      try { finish(await startResearchRun(pending.matterId, pending.question, pending.key, pending.issueId, value)); }
      catch (caught) { setError(caught instanceof Error ? caught.message : "Research could not start."); }
      finally { setBusy(false); }
    }}>
      <h2 id="research-source-heading">Choose research sources</h2><p>{pending.question}</p>
      <ResearchScopeFields value={value} onChange={setValue} options={pending.options} disabled={busy} />
      {error && <p role="alert">{error}</p>}
      <div className={styles.actions}><button type="button" className="btn" disabled={busy} onClick={() => finish(null)}>Cancel</button>
      <button type="submit" className="btn primary" disabled={busy || (value.external && !value.public_query.trim())}>{busy ? "Starting…" : "Start research"}</button></div>
    </form>
  </dialog> : null;
  return { startScopedResearch, researchScopeDialog };
}
