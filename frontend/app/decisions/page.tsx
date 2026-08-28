"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import DecisionTable from "@/components/DecisionTable";
import LinkifiedText from "@/components/LinkifiedText";
import { auditDecisions, getDecisions, getMatters } from "@/lib/api";
import { formatDay } from "@/lib/design";
import type { Decision, Matter } from "@/lib/types";

/**
 * Canvas 1f. Two shapes on one page, and they never meet: open agent
 * recommendations sit above the register, dashed and tinted iris; recorded
 * decisions sit in the table, solid and attributed.
 */
export default function DecisionsPage() {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [decisionData, matterData] = await Promise.all([getDecisions(), getMatters()]);
      setDecisions(decisionData.decisions);
      setMatters(matterData.matters);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load decisions.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    setSelectedDecision(new URLSearchParams(window.location.search).get("decision"));
  }, []);

  useEffect(() => {
    if (!selectedDecision || !decisions.length) return;
    document.getElementById(`decision-${selectedDecision}`)?.scrollIntoView({ block: "center" });
  }, [decisions, selectedDecision]);

  const visible = useMemo(() => {
    if (filter === "all") return decisions;
    if (filter === "needs_review") return decisions.filter((decision) => decision.review_status !== "fresh");
    return decisions.filter((decision) => decision.decision_maker.toLowerCase().includes("harris"));
  }, [decisions, filter]);

  const flagged = decisions.filter((decision) => decision.review_status !== "fresh").length;

  /** A matter waiting on judgment is an open recommendation, not a decision. */
  const openRecommendations = matters.filter((matter) => matter.status === "explore");

  return (
    <AppShell>
      <main className="page">
        <div className="page-header">
          <div>
            <h1>Decision register</h1>
            <p>{decisions.length} recorded · {flagged} flagged for review</p>
          </div>
          <div className="btn-row">
            <div className="segmented">
              {[
                ["all", "All"],
                ["needs_review", "Needs review"],
                ["mine", "Mine"],
              ].map(([value, label]) => (
                <button className={filter === value ? "active" : ""} key={value} onClick={() => setFilter(value)}>
                  {label}
                </button>
              ))}
            </div>
            <button
              className="btn"
              disabled={busy}
              title="Check whether linked source files or review dates make a recorded decision due for review."
              onClick={async () => {
                setBusy(true);
                setError("");
                try { await auditDecisions(); await load(); }
                catch (caught) { setError(caught instanceof Error ? caught.message : "Could not audit decisions."); }
                finally { setBusy(false); }
              }}
            >
              {busy ? "Auditing…" : "Recheck against sources"}
            </button>
          </div>
        </div>

        {error ? <p className="error">{error}</p> : null}

        {openRecommendations.length ? (
          <div className="recommendation-band" style={{ marginTop: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <span className="agent-label">
                <span className="agent-mark" />
                <span className="record-meta" style={{ color: "var(--agent)" }}>
                  {openRecommendations.length} open recommendation{openRecommendations.length === 1 ? "" : "s"} · nothing is recorded until you record it
                </span>
              </span>
              <span style={{ font: "400 11px var(--sans)", color: "#7d78c9" }}>
                Dashed, tinted, never in the table below
              </span>
            </div>
            <div className="recommendation-grid">
              {openRecommendations.map((matter) => (
                <div className="recommendation-card" key={matter.matter_id}>
                  <div>
                    <div style={{ font: "400 13px/1.5 var(--sans)", color: "var(--ink-2)" }}>
                      <LinkifiedText text={matter.next_action || matter.title} />
                    </div>
                    <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-5)", marginTop: 4 }}>
                      {matter.title} · updated {formatDay(matter.updated_at)}
                    </div>
                  </div>
                  <Link className="btn agent tiny" href={`/matters/${encodeURIComponent(matter.matter_id)}`}>Review</Link>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <DecisionTable decisions={visible} selectedDecision={selectedDecision} />

        <p style={{ font: "400 11.5px/1.5 var(--sans)", color: "var(--ink-5)", marginTop: 12, maxWidth: "90ch" }}>
          Recorded decisions are ink on paper: solid border, serif, a real date, a named human. Recommendations are
          dashed, tinted iris, and sit outside the table entirely — there is no visual path from one to the other
          except the act of recording.
        </p>
      </main>
    </AppShell>
  );
}
