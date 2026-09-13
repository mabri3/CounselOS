"use client";

import { useEffect, useRef, useState } from "react";
import { addDossierIssueWebResearch, getResearchRun } from "@/lib/api";
import { dossierStateWord } from "@/lib/dossierRequests";
import type { DossierIssueStatus, ResearchRun } from "@/lib/types";
import { useResearchScope } from "./ResearchScopeChoice";
import styles from "./DossierResearchCard.module.css";

export default function DossierIssueWebResearch({ matterId, requestId, planRevision, issue, included, publicQuery, disabled, onOpenDocument, onRefresh }: {
  matterId: string; requestId: string; planRevision: string; issue: DossierIssueStatus;
  included: boolean; publicQuery: string; disabled?: boolean;
  onOpenDocument?: (path: string) => void; onRefresh?: () => void | Promise<void>;
}) {
  const { startScopedResearch, researchScopeDialog } = useResearchScope(matterId);
  const [run, setRun] = useState<ResearchRun | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const refresh = useRef(onRefresh);
  refresh.current = onRefresh;
  const runId = run?.run_id || issue.web_run_id;

  useEffect(() => {
    if (!runId) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const next = await getResearchRun(matterId, runId!);
        if (stopped) return;
        setRun(next); setError("");
        if (["queued", "running"].includes(next.state)) timer = setTimeout(poll, 2000);
        else await refresh.current?.();
      } catch (caught) {
        if (!stopped) {
          setError(caught instanceof Error ? caught.message : "Web research progress could not refresh.");
          timer = setTimeout(poll, 4000);
        }
      }
    }
    void poll();
    return () => { stopped = true; clearTimeout(timer); };
  }, [matterId, runId]);

  async function addWeb() {
    setBusy(true); setError("");
    try {
      const next = await startScopedResearch(matterId, issue.title, undefined, issue.issue_id, {
        external: true, publicQuery,
        onStart: scope => addDossierIssueWebResearch(matterId, requestId, issue.issue_id, planRevision, scope),
      });
      if (next) { setRun(next); await refresh.current?.(); }
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Web research could not start."); }
    finally { setBusy(false); }
  }

  const partial = run?.publication?.state === "partial" || run?.state === "completed" && /^Partial\b/i.test(run.status);
  return <section className={styles.webResearch} aria-label={`Web research: ${issue.title}`}>
    {runId ? <>
      <p role="status">Web search · {run ? partial ? "Partial" : dossierStateWord(run.state) : "Loading…"}</p>
      {run?.state === "queued" && <p>Starts after the current research finishes.</p>}
      {run && <p>{run.status}</p>}
      {run?.results?.filter(result => result.path).map(result => <button className="text-button" type="button" key={result.path} onClick={() => onOpenDocument?.(result.path)}>Open web research</button>)}
    </> : included ? <p>Web search included</p> : <button className="btn tiny quiet" type="button" disabled={disabled || busy} onClick={() => void addWeb()}>{busy ? "Choosing sources…" : "Add web search"}</button>}
    {error && <p className={styles.error} role="alert">{error}</p>}
    {researchScopeDialog}
  </section>;
}
