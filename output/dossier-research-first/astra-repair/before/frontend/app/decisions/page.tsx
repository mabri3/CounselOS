"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import DataLoadStatus from "@/components/DataLoadStatus";
import styles from "@/components/DecisionsPhase2.module.css";
import DecisionTable from "@/components/DecisionTable";
import LinkifiedText from "@/components/LinkifiedText";
import ReviewPacketPanel from "@/components/ReviewPacketPanel";
import { auditDecisions, getDecisions, getMatters, getSettings } from "@/lib/api";
import { configuredLawyerName, isDecisionByConfiguredLawyer } from "@/lib/decisionFilters";
import { decisionNeedsReview, formatLongDate } from "@/lib/design";
import type { Decision, Matter, WorkspaceSettings } from "@/lib/types";
import { getReviewPackets } from "@/lib/watchApi";
import type { ReviewPacket } from "@/lib/watchTypes";

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
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [packets, setPackets] = useState<ReviewPacket[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<string | null>(null);
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLoadError("");
      const [decisionData, matterData, packetData, workspaceSettings] = await Promise.all([
        getDecisions(),
        getMatters(),
        getReviewPackets({ limit: 100 }),
        getSettings(),
      ]);
      setDecisions(decisionData.decisions);
      setMatters(matterData.matters);
      setPackets(packetData.items);
      setSettings(workspaceSettings);
      setLoaded(true);
    } catch {
      setLoadError("The decision register is unavailable because its current data could not be loaded.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    setSelectedDecision(new URLSearchParams(window.location.search).get("decision"));
    setSelectedPacket(new URLSearchParams(window.location.search).get("packet"));
  }, []);

  useEffect(() => {
    if (!selectedDecision || !decisions.length) return;
    document.getElementById(`decision-${selectedDecision}`)?.scrollIntoView({ block: "center" });
  }, [decisions, selectedDecision]);

  const visible = useMemo(() => {
    if (filter === "all") return decisions;
    if (filter === "needs_review") return decisions.filter(decisionNeedsReview);
    const lawyerName = configuredLawyerName(settings);
    return decisions.filter((decision) => isDecisionByConfiguredLawyer(decision.decision_maker, lawyerName));
  }, [decisions, filter, settings]);

  const flagged = decisions.filter(decisionNeedsReview).length;
  const matterTitles = useMemo(
    () => Object.fromEntries(matters.map((matter) => [matter.matter_id, matter.title])),
    [matters],
  );

  /** A matter waiting on judgment is an open recommendation, not a decision. */
  const openRecommendations = matters.filter((matter) => matter.status === "explore");

  return (
    <AppShell>
      <main className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1>Recorded decisions</h1>
            <p>{loaded ? `${decisions.length} recorded${flagged ? ` · ${flagged} need review` : ""}` : loadError ? "Current decision data is unavailable." : "Loading decisions…"}</p>
          </div>
          {loaded ? <div className={styles.controls}>
            <fieldset className="segmented">
              <legend className="sr-only">Decision filter</legend>
              {[
                ["all", "All"],
                ["needs_review", "Needs review"],
                ["mine", "Mine (configured lawyer)"],
              ].map(([value, label]) => (
                <span className="segmented-option" key={value}>
                  <input checked={filter === value} className="segmented-input" id={`decision-filter-${value}`} name="decision-filter" onChange={() => setFilter(value)} type="radio" value={value} />
                  <label htmlFor={`decision-filter-${value}`}>{label}</label>
                </span>
              ))}
            </fieldset>
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
              {busy ? "Checking…" : "Check sources again"}
            </button>
          </div> : null}
        </div>

        <DataLoadStatus error={loadError} loading={loading} loadingLabel={loaded ? "Refreshing the decision register…" : "Loading the decision register…"} onRetry={load} />
        {error ? <div className="error">{error}</div> : null}

        {loaded && openRecommendations.length ? (
          <div className={styles.recommendations}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <span className="agent-label">
                <span className="agent-mark" />
                <span className="record-meta" style={{ color: "var(--agent)" }}>
                  {openRecommendations.length} open recommendation{openRecommendations.length === 1 ? "" : "s"} · Agent work
                </span>
              </span>
            </div>
            <div className="recommendation-grid">
              {openRecommendations.map((matter) => (
                <div className="recommendation-card" key={matter.matter_id}>
                  <div>
                    <div className="recommendation-text">
                      <LinkifiedText text={matter.next_action || matter.title} />
                    </div>
                    <div className="recommendation-source">
                      {matter.title} · updated {formatLongDate(matter.updated_at)}
                    </div>
                  </div>
                  <Link className="btn agent tiny" href={`/matters/${encodeURIComponent(matter.matter_id)}`}>Review</Link>
                </div>
              ))}
            </div>
          </div>
        ) : null}



        {loaded ? (
          <div className={styles.register} role="region" aria-label="Recorded decisions table" tabIndex={0}><DecisionTable decisions={visible} matterTitles={matterTitles} packets={packets} selectedDecision={selectedDecision} /></div>
        ) : null}

        {loaded ? <section className={styles.packets}><h2>Decision review packets</h2>{packets.length ? packets.map((packet) => <details key={packet.packet_id} open={selectedPacket === packet.packet_id}><summary>{packet.status === "open" ? "Needs review" : packet.status === "monitoring" ? "Monitoring" : "Resolved"} · {packet.what_happened}</summary><ReviewPacketPanel presentation="phase2" packet={packet} matterId={packet.affected_matters[0]} onChanged={load} /></details>) : <p>No review packets</p>}</section> : null}

        {loaded ? <p style={{ font: "400 13.5px/1.5 var(--sans)", color: "var(--ink-4)", marginTop: 14, maxWidth: "90ch" }}>
          Recommendations stay separate from recorded decisions until a lawyer records the decision.
        </p> : null}
      </main>
    </AppShell>
  );
}
