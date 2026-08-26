"use client";

import { FormEvent, useState } from "react";
import type { AgentDefinition, Schedule } from "@/lib/types";

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
  const [title, setTitle] = useState("");
  const [agentId, setAgentId] = useState("counsel-copilot");
  const [kind, setKind] = useState("agent_prompt");
  const [minutes, setMinutes] = useState(60);
  const [instructions, setInstructions] = useState("");
  const [creating, setCreating] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setCreating(true);
    try {
      await onCreate({
        title,
        agent_id: agentId,
        kind,
        instructions,
        interval_seconds: Math.max(10, minutes * 60),
        watch_path: kind === "inbox_watch" ? "04_Inbox" : null,
        enabled: true,
      });
      setTitle("");
      setInstructions("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="split-grid">
      <section className="card list-card">
        <div className="page-header" style={{ marginBottom: 6 }}>
          <div><div className="eyebrow">Runtime</div><h2>Scheduled work</h2></div>
        </div>
        {schedules.map((schedule) => (
          <div className="list-item" key={schedule.schedule_id}>
            <div className="list-item-head">
              <div>
                <div className="table-title">{schedule.title}</div>
                <div className="small muted">{schedule.kind.replaceAll("_", " ")} · {schedule.agent_id} · every {Math.round(schedule.interval_seconds / 60)} min</div>
              </div>
              <span className={`badge ${schedule.last_status === "error" ? "high" : schedule.enabled ? "fresh" : ""}`}>
                {schedule.enabled ? schedule.last_status : "disabled"}
              </span>
            </div>
            <p className="small muted" style={{ margin: "9px 0" }}>{schedule.instructions}</p>
            <div className="button-row">
              <button className="button compact" disabled={busySchedule === schedule.schedule_id} onClick={() => void onRun(schedule.schedule_id)}>
                {busySchedule === schedule.schedule_id ? "Running…" : "Run now"}
              </button>
              {schedule.watch_path ? <span className="badge">{schedule.watch_path}</span> : null}
              {schedule.last_run_at ? <span className="small faint">Last: {String(schedule.last_run_at).slice(0, 16)}</span> : null}
            </div>
          </div>
        ))}
      </section>

      <section className="card form-card" style={{ marginBottom: 0 }}>
        <div className="eyebrow">No cron syntax required</div>
        <h2>Create an automation</h2>
        <p className="small muted">The chat can create the same Markdown schedule. This form makes the runtime visible and testable.</p>
        <form onSubmit={submit}>
          <div className="field" style={{ marginBottom: 12 }}>
            <label htmlFor="schedule-title">Name</label>
            <input id="schedule-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label htmlFor="schedule-agent">Agent</label>
            <select id="schedule-agent" value={agentId} onChange={(event) => setAgentId(event.target.value)}>
              {agents.map((agent) => <option value={agent.agent_id} key={agent.agent_id}>{agent.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label htmlFor="schedule-kind">Kind</label>
            <select id="schedule-kind" value={kind} onChange={(event) => setKind(event.target.value)}>
              <option value="agent_prompt">Agent prompt</option>
              <option value="inbox_watch">Inbox watcher</option>
              <option value="decision_audit">Decision audit</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label htmlFor="schedule-minutes">Run every (minutes)</label>
            <input id="schedule-minutes" type="number" min={1} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="schedule-instructions">Instructions</label>
            <textarea id="schedule-instructions" value={instructions} onChange={(event) => setInstructions(event.target.value)} required />
          </div>
          <button className="button primary" disabled={creating} type="submit">{creating ? "Creating…" : "Create schedule"}</button>
        </form>
      </section>
    </div>
  );
}
