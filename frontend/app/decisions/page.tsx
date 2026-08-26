"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import DecisionTable from "@/components/DecisionTable";
import { auditDecisions, getDecisions } from "@/lib/api";
import type { Decision } from "@/lib/types";

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try { setError(""); setDecisions((await getDecisions()).decisions); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load decisions."); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(
    () => filter === "all" ? decisions : decisions.filter((decision) => decision.review_status === filter),
    [decisions, filter],
  );
  const flagged = decisions.filter((decision) => decision.review_status !== "fresh").length;

  return (
    <AppShell>
      <main className="page">
        <div className="page-header">
          <div>
            <div className="eyebrow">Institutional memory</div>
            <h1>Decision Register</h1>
            <p className="muted">Past advice becomes usable precedent—and visible review work when its assumptions may have drifted.</p>
          </div>
          <button
            className="button amber"
            disabled={busy}
            onClick={async () => { setBusy(true); try { await auditDecisions(); await load(); } finally { setBusy(false); } }}
          >
            {busy ? "Auditing…" : "Audit decisions now"}
          </button>
        </div>
        <div className="attention-strip">
          <div>
            <div className="attention-title">{flagged} decision{flagged === 1 ? "" : "s"} currently need counsel review</div>
            <div className="small muted">The MVP checks elapsed review dates, age, missing linked sources, and linked files modified after the decision.</div>
          </div>
        </div>
        <div className="toolbar">
          <div className="toolbar-left">
            {[
              ["all", "All"],
              ["stale", "Stale"],
              ["review_recommended", "Review recommended"],
              ["fresh", "Fresh"],
            ].map(([value, label]) => (
              <button className={`button compact ${filter === value ? "primary" : ""}`} key={value} onClick={() => setFilter(value)}>{label}</button>
            ))}
          </div>
          <div className="small faint">Prioritized by review status, then age</div>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <DecisionTable decisions={visible} />
      </main>
    </AppShell>
  );
}
