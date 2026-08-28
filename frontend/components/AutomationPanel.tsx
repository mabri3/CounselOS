"use client";

import { useEffect, useState } from "react";
import LinkifiedText from "@/components/LinkifiedText";
import { cadence, role, scheduleIsFailing } from "@/lib/design";
import type { AgentDefinition, Schedule } from "@/lib/types";

/**
 * Canvas 2d — automations led by what each one did for you, not by its cron
 * expression. The schedule is the small print underneath.
 */
export default function AutomationPanel({
  schedules,
  agents,
  busySchedule,
  onRun,
  onCreate,
}: {
  schedules: Schedule[];
  agents: AgentDefinition[];
  busySchedule: string | null;
  onRun: (scheduleId: string) => Promise<void>;
  onCreate: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [instructions, setInstructions] = useState("");
  const [title, setTitle] = useState("");
  const [agentId, setAgentId] = useState(agents[0]?.agent_id ?? "");
  const [everyMinutes, setEveryMinutes] = useState(60);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!agents.some((agent) => agent.agent_id === agentId)) {
      setAgentId(agents[0]?.agent_id ?? "");
    }
  }, [agentId, agents]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {schedules.length === 0 ? (
          <div className="empty-state">Nothing runs on a schedule yet.</div>
        ) : null}

        {schedules.map((schedule) => {
          const failing = scheduleIsFailing(schedule);
          const paused = schedule.enabled !== 1;
          const color = failing ? role.failure : paused ? role.quiet : role.healthy;
          const status = failing ? "Failing" : paused ? "Paused" : schedule.last_run_at ? "Healthy" : "Never run";

          return (
            <div className={`automation-card ${failing ? "failing" : ""}`} key={schedule.schedule_id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20 }}>
                <span style={{ font: "600 17px var(--serif)", color: "var(--ink)" }}><LinkifiedText text={schedule.title} /></span>
                <span className="signal" style={{ flex: "none", fontWeight: 500, color }}>
                  <span className="dot" style={{ background: color }} />
                  {status}
                </span>
              </div>

              <p className="automation-effect"><LinkifiedText text={schedule.instructions} /></p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginTop: 12 }}>
                <span className="automation-plain">
                  Runs {cadence(schedule.interval_seconds)} as{" "}
                  {agents.find((agent) => agent.agent_id === schedule.agent_id)?.name ?? schedule.agent_id}
                  {schedule.last_run_at ? ` · last ran ${String(schedule.last_run_at).slice(0, 16).replace("T", " ")}` : ""}
                  {schedule.watch_path ? ` · watching ${schedule.watch_path}` : ""}
                </span>
                <button
                  className={`btn tiny ${failing ? "primary" : ""}`}
                  disabled={busySchedule === schedule.schedule_id}
                  onClick={() => void onRun(schedule.schedule_id)}
                >
                  {busySchedule === schedule.schedule_id ? "Running…" : failing ? "Run and reconnect" : "Run now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {open ? (
        <form
          className="card card-pad"
          style={{ marginTop: 16 }}
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            try {
              await onCreate({
                title,
                agent_id: agentId,
                instructions,
                kind: "agent_prompt",
                interval_seconds: Math.max(60, everyMinutes * 60),
                enabled: true,
              });
              setTitle("");
              setInstructions("");
              setOpen(false);
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Could not create the automation.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <h2>Describe it in plain language</h2>
            <button className="btn compact quiet" type="button" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div className="field-label">What it does for you</div>
              <textarea
                aria-label="What the automation does"
                className="text-input prose"
                onChange={(event) => setInstructions(event.target.value)}
                placeholder="Check decisions older than 90 days against changed sources and flag anything that moved."
                required
                value={instructions}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
              <div>
                <div className="field-label">Name it</div>
                <input aria-label="Automation name" className="text-input" onChange={(event) => setTitle(event.target.value)} required value={title} />
              </div>
              <div>
                <div className="field-label">Which agent</div>
                <select aria-label="Automation agent" className="select-input" disabled={!agents.length} onChange={(event) => setAgentId(event.target.value)} value={agentId}>
                  {agents.map((agent) => <option key={agent.agent_id} value={agent.agent_id}>{agent.name}</option>)}
                </select>
              </div>
              <div>
                <div className="field-label">Every (minutes)</div>
                <input
                  aria-label="Automation interval in minutes"
                  className="text-input"
                  min={1}
                  onChange={(event) => setEveryMinutes(Number(event.target.value))}
                  type="number"
                  value={everyMinutes}
                />
              </div>
            </div>
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <button className="btn primary" disabled={busy || !agentId} type="submit">
              {busy ? "Creating…" : "Create the automation"}
            </button>
          </div>
        </form>
      ) : (
        <div className="intake-bar" style={{ marginTop: 16 }}>
          <span
            onClick={() => setOpen(true)}
            style={{ flex: 1, font: "400 15px var(--serif)", color: "var(--ink-5)", cursor: "text" }}
          >
            Describe something you want done on a schedule…
          </span>
          <button className="btn primary" onClick={() => setOpen(true)}>New automation</button>
        </div>
      )}
    </>
  );
}
