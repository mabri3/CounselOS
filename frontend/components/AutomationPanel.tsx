"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LinkifiedText from "@/components/LinkifiedText";
import { cadence, formatDateTime, role, scheduleIsFailing } from "@/lib/design";
import type { AgentDefinition, Schedule } from "@/lib/types";

type ScheduleCadence = "hourly" | "daily" | "weekly";
type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

const WEEKDAYS: { value: Weekday; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

/**
 * Canvas 2d — automations led by what each one did for you, not by its cron
 * expression. The schedule is the small print underneath.
 */
export default function AutomationPanel({
  schedules,
  agents,
  busySchedule,
  onRun,
  onUpdate,
  onCreate,
}: {
  schedules: Schedule[];
  agents: AgentDefinition[];
  busySchedule: string | null;
  onRun: (scheduleId: string) => Promise<void>;
  onUpdate: (scheduleId: string, enabled: boolean) => Promise<void>;
  onCreate: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [instructions, setInstructions] = useState("");
  const [title, setTitle] = useState("");
  const [agentId, setAgentId] = useState(agents[0]?.agent_id ?? "");
  const [scheduleCadence, setScheduleCadence] = useState<ScheduleCadence>("hourly");
  const [runTime, setRunTime] = useState("09:00");
  const [runDay, setRunDay] = useState<Weekday>("monday");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!agents.some((agent) => agent.agent_id === agentId)) {
      setAgentId(agents[0]?.agent_id ?? "");
    }
  }, [agentId, agents]);

  const selectedAgent = agents.find((agent) => agent.agent_id === agentId);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {schedules.length === 0 ? (
          <div className="empty-state">Nothing runs on a schedule yet.</div>
        ) : null}

        {schedules.map((schedule) => {
          const failing = scheduleIsFailing(schedule);
          const paused = schedule.enabled === false || schedule.enabled === 0;
          const color = failing ? role.failure : paused ? role.quiet : role.healthy;
          const status = failing ? "Failing" : paused ? "Paused" : schedule.last_run_at ? "Healthy" : "Never run";
          const watchId = "target_watch_id" in schedule ? schedule.target_watch_id : null;
          const effect = schedule.kind === "watch_scan"
            ? "Scan this Watch for new public developments and update its Briefing."
            : schedule.kind === "briefing_digest"
              ? "Create a saved-view digest for the Briefing."
              : schedule.instructions;

          return (
            <div className={`automation-card ${failing ? "failing" : ""}`} key={schedule.schedule_id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20 }}>
                <span style={{ font: "600 17px var(--serif)", color: "var(--ink)" }}><LinkifiedText text={schedule.title} /></span>
                <span className="signal" style={{ flex: "none", fontWeight: 500, color }}>
                  <span className="dot" style={{ background: color }} />
                  {status}
                </span>
              </div>

              <p className="automation-effect"><LinkifiedText text={effect} /></p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginTop: 12 }}>
                <span className="automation-plain">
                  Runs {cadence(schedule.interval_seconds)} as{" "}
                  {agents.find((agent) => agent.agent_id === schedule.agent_id)?.name ?? schedule.agent_id}
                  {schedule.last_run_at ? ` · last ran ${formatDateTime(schedule.last_run_at)}` : ""}
                  {watchId ? <> · <Link href={`/watches/${encodeURIComponent(watchId)}`}>Open Watch</Link></> : null}
                  {!watchId && schedule.watch_path ? ` · watching ${schedule.watch_path}` : ""}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn tiny"
                    disabled={busySchedule === schedule.schedule_id}
                    onClick={() => void onUpdate(schedule.schedule_id, paused)}
                  >
                    {paused ? "Resume schedule" : "Pause schedule"}
                  </button>
                  <button
                    className={`btn tiny ${failing ? "primary" : ""}`}
                    disabled={busySchedule === schedule.schedule_id}
                    onClick={() => void onRun(schedule.schedule_id)}
                  >
                    {busySchedule === schedule.schedule_id ? "Running…" : failing ? "Retry now" : "Run it now"}
                  </button>
                </div>
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
              const intervalSeconds = scheduleCadence === "hourly" ? 3600 : scheduleCadence === "daily" ? 86400 : 604800;
              const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
              const recurrence = scheduleCadence === "hourly"
                ? { kind: "interval", interval_seconds: intervalSeconds, local_time: null, time_zone: null, weekdays: [] }
                : scheduleCadence === "daily"
                  ? { kind: "daily", interval_seconds: null, local_time: runTime, time_zone: timeZone, weekdays: [] }
                  : { kind: "weekday", interval_seconds: null, local_time: runTime, time_zone: timeZone, weekdays: [runDay] };
              await onCreate({
                title,
                agent_id: agentId,
                instructions,
                kind: "agent_prompt",
                interval_seconds: intervalSeconds,
                recurrence,
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
              <div>
                <div className="field-label">Name it</div>
                <input aria-label="Automation name" className="text-input" onChange={(event) => setTitle(event.target.value)} required value={title} />
              </div>
              <div>
                <div className="field-label">Which agent</div>
                <select aria-label="Automation agent" className="select-input" disabled={!agents.length} onChange={(event) => setAgentId(event.target.value)} value={agentId}>
                  {agents.map((agent) => <option key={agent.agent_id} value={agent.agent_id}>{agent.name}</option>)}
                </select>
                {selectedAgent ? <div className="faint" style={{ marginTop: 6 }}>{selectedAgent.description}</div> : null}
              </div>
              <div>
                <div className="field-label">How often</div>
                <select aria-label="Automation schedule" className="select-input" onChange={(event) => setScheduleCadence(event.target.value as ScheduleCadence)} value={scheduleCadence}>
                  <option value="hourly">Every hour</option>
                  <option value="daily">Every day</option>
                  <option value="weekly">Every week</option>
                </select>
              </div>
              {scheduleCadence === "weekly" ? <div><div className="field-label">Run on</div><select aria-label="Automation day" className="select-input" onChange={(event) => setRunDay(event.target.value as Weekday)} value={runDay}>{WEEKDAYS.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}</select></div> : null}
              {scheduleCadence !== "hourly" ? <div><div className="field-label">Run at</div><input aria-label="Automation time" className="text-input" onChange={(event) => setRunTime(event.target.value)} type="time" value={runTime} /></div> : null}
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
