"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LinkifiedText from "@/components/LinkifiedText";
import { cadence, formatDateTime, scheduleIsFailing, scheduleIsPaused } from "@/lib/design";
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

/** What each kind of automation is, in the lawyer's words. */
const KIND_LABEL: Record<string, string> = {
  inbox_watch: "Watches a folder",
  decision_audit: "Audits recorded decisions",
  watch_scan: "Scans a Watch",
  briefing_digest: "Builds a Briefing digest",
  agent_prompt: "Runs your instructions",
};

function effectOf(schedule: Schedule): string {
  if (schedule.kind === "watch_scan") return "Scan this Watch for new public developments and update its Briefing.";
  if (schedule.kind === "briefing_digest") return "Freeze a saved Briefing view into a dated digest.";
  return schedule.instructions;
}

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

  /* Failed runs first: that is the only group that needs the lawyer today. */
  const failing = schedules.filter(scheduleIsFailing);
  const paused = schedules.filter((schedule) => !scheduleIsFailing(schedule) && scheduleIsPaused(schedule));
  const running = schedules.filter((schedule) => !scheduleIsFailing(schedule) && !scheduleIsPaused(schedule));

  const sections: { key: string; title: string; help: string; entries: Schedule[] }[] = [
    { key: "failing", title: "Failed on its last run", help: "These stopped doing their job. Read the message, fix the cause, then retry.", entries: failing },
    { key: "running", title: "Running on schedule", help: "These are working. Nothing is asked of you.", entries: running },
    { key: "paused", title: "Paused", help: "These keep their settings but will not run until you resume them.", entries: paused },
  ];

  return (
    <>
      {schedules.length === 0 ? (
        <div className="empty-state">
          Nothing runs on a schedule yet. Describe the job below and Counsel OS will run it for you.
        </div>
      ) : null}

      {sections.filter((section) => section.entries.length).map((section) => (
        <section className="automation-section" key={section.key}>
          <div className="automation-section-head">
            <h2>{section.title}</h2>
            <p>{section.help}</p>
          </div>
          <div className="automation-list">
            {section.entries.map((schedule) => {
              const isFailing = scheduleIsFailing(schedule);
              const isPaused = scheduleIsPaused(schedule);
              const status = isFailing ? "Failing" : isPaused ? "Paused" : schedule.last_run_at ? "Healthy" : "Never run";
              const stateClass = isFailing ? "state-failure" : isPaused ? "state-quiet" : schedule.last_run_at ? "state-healthy" : "state-quiet";
              const cardClass = isFailing ? "failing" : isPaused ? "paused" : "running";
              const watchId = "target_watch_id" in schedule ? schedule.target_watch_id : null;
              const failureMessage = "last_message" in schedule ? schedule.last_message : "";
              const agentName = agents.find((agent) => agent.agent_id === schedule.agent_id)?.name ?? schedule.agent_id;

              return (
                <article className={`automation-card ${cardClass}`} key={schedule.schedule_id}>
                  <div className="automation-card-head">
                    <div style={{ minWidth: 0 }}>
                      <div className="automation-kicker">{KIND_LABEL[schedule.kind] ?? "Runs on a schedule"}</div>
                      <h3 className="automation-title"><LinkifiedText text={schedule.title} /></h3>
                    </div>
                    <span className={`state-label ${stateClass}`} style={{ flex: "none" }}>{status}</span>
                  </div>

                  <p className="automation-effect"><LinkifiedText text={effectOf(schedule)} /></p>

                  {isFailing && failureMessage ? (
                    <div className="automation-failure">Last run reported: {failureMessage}</div>
                  ) : null}

                  <dl className="automation-facts">
                    <div className="automation-fact"><dt>Runs</dt><dd>{cadence(schedule.interval_seconds)}</dd></div>
                    <div className="automation-fact"><dt>Acting as</dt><dd>{agentName}</dd></div>
                    <div className="automation-fact"><dt>Last run</dt><dd>{schedule.last_run_at ? formatDateTime(schedule.last_run_at) : "Never"}</dd></div>
                    <div className="automation-fact"><dt>Next run</dt><dd>{isPaused ? "Paused" : schedule.next_run_at ? formatDateTime(schedule.next_run_at) : "Not scheduled"}</dd></div>
                    {watchId ? (
                      <div className="automation-fact"><dt>Watch</dt><dd><Link href={`/watches/${encodeURIComponent(watchId)}`}>Open Watch</Link></dd></div>
                    ) : !watchId && schedule.watch_path ? (
                      <div className="automation-fact"><dt>Folder</dt><dd>{schedule.watch_path}</dd></div>
                    ) : null}
                  </dl>

                  <div className="automation-actions">
                    <button
                      className="btn tiny"
                      disabled={busySchedule === schedule.schedule_id}
                      onClick={() => void onUpdate(schedule.schedule_id, isPaused)}
                      type="button"
                    >
                      {isPaused ? "Resume schedule" : "Pause schedule"}
                    </button>
                    <button
                      className={`btn tiny ${isFailing ? "primary" : ""}`}
                      disabled={busySchedule === schedule.schedule_id}
                      onClick={() => void onRun(schedule.schedule_id)}
                      type="button"
                    >
                      {busySchedule === schedule.schedule_id ? "Running…" : isFailing ? "Retry now" : "Run it now"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div className="automation-compose">
        {open ? (
          <form
            className="card card-pad"
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginBottom: 18 }}>
              <div>
                <h2 className="form-heading">Describe it in plain language</h2>
                <p className="form-heading-help">Say what you want done and how often. Counsel OS turns it into a standing job you can pause at any time.</p>
              </div>
              <button className="btn compact quiet" type="button" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                <p className="form-help">Write it as an instruction. This text is what the agent follows on every run.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                <div>
                  <div className="field-label">Name it</div>
                  <input aria-label="Automation name" className="text-input" onChange={(event) => setTitle(event.target.value)} placeholder="Weekly decision review" required value={title} />
                  <p className="form-help">How it appears in this list.</p>
                </div>
                <div>
                  <div className="field-label">Which agent runs it</div>
                  <select aria-label="Automation agent" className="select-input" disabled={!agents.length} onChange={(event) => setAgentId(event.target.value)} value={agentId}>
                    {agents.map((agent) => <option key={agent.agent_id} value={agent.agent_id}>{agent.name}</option>)}
                  </select>
                  <p className="form-help">{selectedAgent ? selectedAgent.description : "The agent decides which tools this job may use."}</p>
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
                {scheduleCadence !== "hourly" ? <div><div className="field-label">Run at</div><input aria-label="Automation time" className="text-input" onChange={(event) => setRunTime(event.target.value)} type="time" value={runTime} /><p className="form-help">Your local time.</p></div> : null}
              </div>
            </div>
            {error ? <p className="error">{error}</p> : null}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
              <button className="btn primary" disabled={busy || !agentId} type="submit">
                {busy ? "Creating…" : "Create the automation"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="automation-compose-help">Want something to happen on its own? Describe it and it will run on a schedule.</p>
            <div className="intake-bar">
              <span
                onClick={() => setOpen(true)}
                style={{ flex: 1, font: "400 15px var(--serif)", color: "var(--ink-5)", cursor: "text" }}
              >
                Describe something you want done on a schedule…
              </span>
              <button className="btn primary" onClick={() => setOpen(true)} type="button">New automation</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
