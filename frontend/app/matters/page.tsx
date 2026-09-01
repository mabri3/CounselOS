"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import LinkifiedText from "@/components/LinkifiedText";
import MattersTable from "@/components/MattersTable";
import { getMatters, moveMatter } from "@/lib/api";
import { RISK_DEFINITION, STAGES, dueWord, isWaitingSignal, matterNextAction, matterNextOwner, riskLabel, role, signalCellTint, signalFor } from "@/lib/design";
import type { Matter, StageId } from "@/lib/types";

type CountFilter = "" | "Overdue" | "Waiting" | "With Themis.ai" | "Needs assignment" | "No action needed";

/**
 * Canvas 5a. Five counts that are also filters, a coloured spine and a
 * one-word verdict per stage, and each matter's next action in the row rather
 * than a description of it.
 */
export default function MattersPage() {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [countFilter, setCountFilter] = useState<CountFilter>("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [view, setView] = useState<"stages" | "table">("table");
  const [collapsedStages, setCollapsedStages] = useState<Partial<Record<StageId, boolean>>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const [overGroup, setOverGroup] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try { setError(""); setMatters((await getMatters()).matters); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load matters."); }
    finally { setLoaded(true); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const stats = useMemo(() => {
    return [
      { key: "Overdue" as const, n: matters.filter((matter) => matter.work_state.signal.kind === "overdue").length, label: "overdue", color: role.failure, tint: role.failureWash },
      { key: "Waiting" as const, n: matters.filter((matter) => isWaitingSignal(matter.work_state.signal.kind)).length, label: "waiting", color: role.attentionDeep, tint: role.attentionWash },
      { key: "With Themis.ai" as const, n: matters.filter((matter) => ["queued", "running"].includes(matter.work_state.execution_state) || matter.work_state.next_actor === "themis").length, label: "with Themis.ai", color: role.agent, tint: role.agentWash },
      { key: "Needs assignment" as const, n: matters.filter((matter) => matter.work_state.next_actor === "unassigned").length, label: "needs assignment", color: role.attentionDeep, tint: role.attentionWash },
      { key: "No action needed" as const, n: matters.filter((matter) => matter.status !== "closed" && matter.work_state.signal.kind === "none").length, label: "no action needed", color: role.quiet, tint: role.quietWash },
    ];
  }, [matters]);

  const owners = useMemo(() => uniqueValues(matters.map((matter) => ownerLabel(matter.legal_owner))), [matters]);
  const areas = useMemo(() => uniqueValues(matters.map((matter) => matter.product_area)), [matters]);
  const risks = useMemo(() => uniqueValues(matters.map((matter) => riskLabel(matter.risk_level))), [matters]);

  const visible = useMemo(() => {
    return matters.filter((matter) => {
      const { next_actor: actor, execution_state: execution, signal } = matter.work_state;
      if (countFilter === "Overdue" && signal.kind !== "overdue") return false;
      if (countFilter === "Waiting" && !isWaitingSignal(signal.kind)) return false;
      if (countFilter === "With Themis.ai" && !(["queued", "running"].includes(execution) || actor === "themis")) return false;
      if (countFilter === "Needs assignment" && actor !== "unassigned") return false;
      if (countFilter === "No action needed" && (matter.status === "closed" || signal.kind !== "none")) return false;
      if (ownerFilter && ownerLabel(matter.legal_owner) !== ownerFilter) return false;
      if (areaFilter && matter.product_area !== areaFilter) return false;
      if (riskFilter && riskLabel(matter.risk_level) !== riskFilter) return false;
      return true;
    });
  }, [matters, countFilter, ownerFilter, areaFilter, riskFilter]);

  const inFlight = matters.filter((matter) => matter.status !== "closed").length;
  const closed = matters.length - inFlight;
  const filtersActive = Boolean(countFilter || ownerFilter || areaFilter || riskFilter);
  const activeFilters = [
    countFilter,
    ownerFilter ? `Owner: ${ownerFilter}` : "",
    areaFilter ? `Area: ${areaFilter}` : "",
    riskFilter ? `Risk: ${riskFilter}` : "",
  ].filter(Boolean);

  async function drop(stage: StageId) {
    const matterId = dragId;
    setDragId(null);
    setOverGroup(null);
    if (!matterId) return;
    setError("");
    try {
      await moveMatter(matterId, stage, "Moved on the matters list");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not move the matter.");
    }
  }

  function toggleStage(stage: StageId) {
    setCollapsedStages((current) => ({ ...current, [stage]: !current[stage] }));
  }

  return (
    <AppShell>
      <main className="page">
        <div className="page-header">
          <div>
            <h1>Matters</h1>
            <p>{inFlight} in flight, {closed} closed.</p>
          </div>
          <div className="btn-row">
            <div className="segmented">
              <button className={view === "stages" ? "active" : ""} onClick={() => setView("stages")} title="Group matters by their current workflow stage." type="button">Stages</button>
              <button className={view === "table" ? "active" : ""} onClick={() => setView("table")} title="Compare and sort matters in rows." type="button">Table</button>
            </div>
            <Link className="btn primary" href="/workspace">New matter</Link>
          </div>
        </div>

        <div className="stat-chips" style={{ marginTop: 20 }}>
          {stats.map((stat) => (
            <button
              className={`stat-chip ${countFilter === stat.key ? "active" : ""}`}
              key={stat.key}
              style={{ background: stat.tint }}
              onClick={() => setCountFilter((current) => (current === stat.key ? "" : stat.key))}
              aria-pressed={countFilter === stat.key}
              type="button"
            >
              <b style={{ color: stat.color }}>{stat.n}</b>
              <span style={{ color: stat.color }}>{stat.label}</span>
            </button>
          ))}
          <span style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
            <label className="field-label">
              Owner
              <select aria-label="Filter matters by owner" className="select-input" onChange={(event) => setOwnerFilter(event.target.value)} value={ownerFilter}>
                <option value="">All owners</option>
                {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
              </select>
            </label>
            <label className="field-label">
              Area
              <select aria-label="Filter matters by area" className="select-input" onChange={(event) => setAreaFilter(event.target.value)} value={areaFilter}>
                <option value="">All areas</option>
                {areas.map((area) => <option key={area} value={area}>{area}</option>)}
              </select>
            </label>
            <label className="field-label" title={RISK_DEFINITION}>
              Risk
              <select aria-describedby="risk-definition" aria-label="Filter matters by risk" className="select-input" onChange={(event) => setRiskFilter(event.target.value)} value={riskFilter}>
                <option value="">All risk levels</option>
                {risks.map((risk) => <option key={risk} value={risk}>{risk}</option>)}
              </select>
            </label>
          </div>
        </div>
        <p id="risk-definition" style={{ margin: "8px 0 0", font: "400 13.5px var(--sans)", color: "var(--ink-5)" }}>{RISK_DEFINITION}</p>

        {filtersActive ? (
          <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center", font: "400 13.5px var(--sans)", color: "var(--ink-4)" }}>
            <span>Active filters: {activeFilters.join(" · ")}</span>
            <button className="btn" onClick={() => { setCountFilter(""); setOwnerFilter(""); setAreaFilter(""); setRiskFilter(""); }} type="button">Clear filters</button>
          </div>
        ) : null}

        {error ? <p className="error">{error}</p> : null}
        {!loaded && !error ? <div className="loading">Loading matters…</div> : null}

        {view === "stages" ? (
          <div className="stage-groups" style={{ marginTop: 24 }}>
            {loaded && STAGES.map((stage) => {
            const items = visible.filter((matter) => matter.status === stage.id);
            const signals = items.map(signalFor);
            const overdue = signals.filter((signal) => signal.kind === "overdue").length;
            const waiting = signals.filter((signal) => isWaitingSignal(signal.kind)).length;
            const needsAssignment = signals.filter((signal) => signal.kind === "needs_assignment").length;
            const attentionParts = [
              overdue ? `${overdue} overdue` : "",
              waiting ? `${waiting} waiting` : "",
              needsAssignment ? `${needsAssignment} ${needsAssignment === 1 ? "needs" : "need"} assignment` : "",
            ].filter(Boolean);
            const signalTextColor = overdue > 0 ? role.failure : role.attentionDeep;
            const over = overGroup === stage.id;
            const acceptsDrop = stage.id !== "closed";
            const collapsed = Boolean(collapsedStages[stage.id]);
            const contentId = `stage-${stage.id}-matters`;

            return (
              <section
                className="stage-group"
                key={stage.id}
                style={{ background: over ? "#FAEDCB" : "transparent" }}
                onDragOver={(event) => { if (acceptsDrop) { event.preventDefault(); setOverGroup(stage.id); } }}
                onDragLeave={() => setOverGroup((current) => (current === stage.id ? null : current))}
                onDrop={(event) => { event.preventDefault(); if (acceptsDrop) void drop(stage.id); }}
              >
                <div className="stage-spine" style={{ background: "#d6d1c7" }} />
                <div className="stage-body">
                  <header className="stage-head" style={{ background: "#f2efe8" }}>
                    <button
                      aria-controls={contentId}
                      aria-expanded={!collapsed}
                      className="stage-toggle"
                      onClick={() => toggleStage(stage.id)}
                      title={`${collapsed ? "Expand" : "Collapse"} ${stage.label}`}
                      type="button"
                    >
                      <span aria-hidden="true" className={`stage-toggle-icon ${collapsed ? "" : "open"}`}>›</span>
                      <span className="stage-head-label">{stage.label}</span>
                      <span className="stage-head-sub">{stage.sub}</span>
                    </button>
                    <span style={{ flex: 1 }} />
                    <span
                      className="stage-head-note"
                      style={{ color: attentionParts.length > 0 ? signalTextColor : "var(--ink-4)" }}
                    >
                      {attentionParts.length > 0
                        ? attentionParts.join(" · ")
                        : stage.id === "closed" ? "Closed" : "No action needed"}
                    </span>
                    <span aria-label={`${items.length} ${items.length === 1 ? "matter" : "matters"}`} className="stage-head-count">{items.length}</span>
                  </header>

                  <div hidden={collapsed} id={contentId}>
                    {items.length === 0 ? (
                      <div className="stage-empty">{filtersActive ? "No matters match these filters." : "No matters in this stage."}</div>
                    ) : null}

                    {items.map((matter) => {
                      const signal = signalFor(matter);
                      const due = dueWord(matter);
                      return (
                        <div
                          className="matter-row"
                          draggable
                          key={matter.matter_id}
                          style={{
                            background: "#fffefb",
                            borderLeftColor: signal.rail,
                            opacity: dragId === matter.matter_id ? 0.4 : 1,
                          }}
                          onDragStart={() => setDragId(matter.matter_id)}
                          onDragEnd={() => { setDragId(null); setOverGroup(null); }}
                        >
                          <Link
                            className="matter-title-cell"
                            href={`/matters/${encodeURIComponent(matter.matter_id)}`}
                            style={{ background: signalCellTint(signal.kind), flex: 1.4, minWidth: 0 }}
                          >
                            <span className="matter-row-title">{matter.title}</span>
                            <span className="matter-row-type">
                              {matter.matter_type.replaceAll("_", " ")}
                              {matter.product_area ? ` · ${matter.product_area}` : ""}
                            </span>
                          </Link>
                          <div style={{ flex: 1.6, minWidth: 0 }}>
                            {signal.word ? (
                              <span className="signal" style={{ marginBottom: 3, color: signal.wordColor, fontSize: 13 }}>
                                <span className="dot sm" style={{ background: signal.rail }} />
                                {signal.word}
                              </span>
                            ) : null}
                            <span className="matter-row-next">
                              {matter.status === "closed"
                                ? <span aria-label="No active next action">—</span>
                                : <LinkifiedText text={matterNextAction(matter)} />}
                            </span>
                          </div>
                          <span className="matter-row-owner">{matterNextOwner(matter)}</span>
                          <span className="matter-row-due" style={{ color: due.color }}>{due.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
            })}
          </div>
        ) : loaded ? (
          <div style={{ marginTop: 24 }}><MattersTable matters={visible} /></div>
        ) : null}
      </main>
    </AppShell>
  );
}

function uniqueValues(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((left, right) => left.localeCompare(right));
}

function ownerLabel(value: string): string {
  return value.trim() || "Unassigned";
}
