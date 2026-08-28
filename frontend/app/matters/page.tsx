"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import LinkifiedText from "@/components/LinkifiedText";
import MattersTable from "@/components/MattersTable";
import MattersTimeline from "@/components/MattersTimeline";
import { getMatters, moveMatter } from "@/lib/api";
import { STAGES, dueWord, role, signalFor } from "@/lib/design";
import type { Matter, StageId } from "@/lib/types";

type CountFilter = "" | "Overdue" | "Waiting on you" | "Themis is working" | "Nothing owed";

/**
 * Canvas 5a. Four counts that are also filters, a coloured spine and a
 * one-word verdict per stage, and each matter's next action in the row rather
 * than a description of it.
 */
export default function MattersPage() {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [countFilter, setCountFilter] = useState<CountFilter>("");
  const [scope, setScope] = useState("All");
  const [view, setView] = useState<"stages" | "table" | "timeline">("stages");
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
    const words = matters.map((matter) => signalFor(matter).word);
    return [
      { key: "Overdue" as const, n: words.filter((word) => word === "Overdue").length, label: "overdue", color: role.failure, tint: role.failureTint },
      { key: "Waiting on you" as const, n: words.filter((word) => word === "Waiting on you").length, label: "waiting on you", color: role.attentionDeep, tint: role.attentionTint },
      { key: "Themis is working" as const, n: words.filter((word) => word === "Themis is working").length, label: "Themis is working", color: role.agent, tint: role.agentTint },
      { key: "Nothing owed" as const, n: words.filter((word) => !word).length, label: "nothing owed", color: role.quiet, tint: role.quietTint },
    ];
  }, [matters]);

  const visible = useMemo(() => {
    return matters.filter((matter) => {
      const word = signalFor(matter).word;
      if (countFilter === "Nothing owed" && word) return false;
      if (countFilter && countFilter !== "Nothing owed" && word !== countFilter) return false;
      if (scope === "Mine" && !matter.legal_owner.toLowerCase().includes("harris")) return false;
      if (scope === "High risk" && matter.risk_level.toLowerCase() !== "high") return false;
      if (scope !== "All" && scope !== "Mine" && scope !== "High risk") {
        const haystack = `${matter.matter_type} ${matter.product_area}`.toLowerCase();
        if (!haystack.includes(scope.toLowerCase())) return false;
      }
      return true;
    });
  }, [matters, countFilter, scope]);

  const inFlight = matters.filter((matter) => matter.status !== "closed").length;
  const closed = matters.length - inFlight;

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
              <button className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")} title="See matters ordered by target date." type="button">Timeline</button>
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
            >
              <b style={{ color: stat.color }}>{stat.n}</b>
              <span style={{ color: stat.color }}>{stat.label}</span>
            </button>
          ))}
          <span style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <span style={{ font: "400 13.5px var(--sans)", color: "var(--ink-5)" }}>Filter</span>
            {["All", "Mine", "Privacy", "Commercial", "High risk"].map((option) => (
              <button
                className={`chip ${scope === option ? "active" : ""}`}
                key={option}
                onClick={() => setScope(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className="error">{error}</p> : null}
        {!loaded && !error ? <div className="loading">Loading matters…</div> : null}

        {view === "stages" ? (
          <div className="stage-groups" style={{ marginTop: 24 }}>
            {loaded && STAGES.map((stage) => {
            const items = visible.filter((matter) => matter.status === stage.id);
            const signals = items.map(signalFor);
            const needs = signals.filter((signal) => signal.word === "Waiting on you" || signal.word === "Overdue").length;
            const working = signals.some((signal) => signal.word === "Themis is working");
            const spine = needs > 0 ? role.attention : working ? role.agent : stage.id === "closed" ? "#d6d1c7" : role.healthy;
            const over = overGroup === stage.id;
            const acceptsDrop = stage.id !== "closed";

            return (
              <section
                className="stage-group"
                key={stage.id}
                style={{ background: over ? "#FAEDCB" : "transparent" }}
                onDragOver={(event) => { if (acceptsDrop) { event.preventDefault(); setOverGroup(stage.id); } }}
                onDragLeave={() => setOverGroup((current) => (current === stage.id ? null : current))}
                onDrop={(event) => { event.preventDefault(); if (acceptsDrop) void drop(stage.id); }}
              >
                <div className="stage-spine" style={{ background: spine }} />
                <div className="stage-body">
                  <header className="stage-head" style={{ background: needs > 0 ? role.attentionTint : "#f2efe8" }}>
                    <span className="stage-head-label">{stage.label}</span>
                    <span className="stage-head-sub">{stage.sub}</span>
                    <span style={{ flex: 1 }} />
                    <span
                      className="stage-head-note"
                      style={{ color: needs > 0 ? role.attentionDeep : working ? role.agent : "var(--ink-4)" }}
                    >
                      {needs > 0
                        ? needs === 1 ? "1 needs you" : `${needs} need you`
                        : working ? "Themis is working" : "Nothing owed"}
                    </span>
                    <span className="stage-head-count">{items.length}</span>
                  </header>

                  {items.length === 0 ? (
                    <div className="stage-empty">Nothing here.</div>
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
                          background: signal.bg,
                          borderLeftColor: signal.rail,
                          opacity: dragId === matter.matter_id ? 0.4 : 1,
                        }}
                        onDragStart={() => setDragId(matter.matter_id)}
                        onDragEnd={() => { setDragId(null); setOverGroup(null); }}
                      >
                        <Link href={`/matters/${encodeURIComponent(matter.matter_id)}`} style={{ flex: 1.4, minWidth: 0 }}>
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
                          <span className="matter-row-next"><LinkifiedText text={matter.next_action || "No next action recorded."} /></span>
                        </div>
                        <span className="matter-row-owner">{matter.legal_owner || "Unassigned"}</span>
                        <span className="matter-row-due" style={{ color: due.color }}>{due.text}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
            })}
          </div>
        ) : loaded && view === "table" ? (
          <div style={{ marginTop: 24 }}><MattersTable matters={visible} /></div>
        ) : loaded ? (
          <div style={{ marginTop: 24 }}><MattersTimeline matters={visible} /></div>
        ) : null}
      </main>
    </AppShell>
  );
}
