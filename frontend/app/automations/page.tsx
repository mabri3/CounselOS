"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import AutomationPanel from "@/components/AutomationPanel";
import { createSchedule, getAutomations, runSchedule, updateSchedule } from "@/lib/api";
import { scheduleIsFailing, scheduleIsPaused } from "@/lib/design";
import type { AgentDefinition, Schedule } from "@/lib/types";

/** Canvas 2d. */
export default function AutomationsPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [busySchedule, setBusySchedule] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const data = await getAutomations();
      setSchedules(data.schedules);
      setAgents(data.agents);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load automations.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const failing = schedules.filter(scheduleIsFailing).length;
  const paused = schedules.filter((schedule) => !scheduleIsFailing(schedule) && scheduleIsPaused(schedule)).length;
  const running = schedules.length - failing - paused;

  return (
    <AppShell>
      <main className="page narrow">
        <header className="page-header">
          <div className="page-header-main">
            <div className="eyebrow">Standing work</div>
            <h1 className="headline">Automations</h1>
            <p className="page-lede">
              Jobs Themis.ai runs on its own, on a schedule. They watch folders, scan sources, and re-check
              recorded decisions, then bring what they find to you.
              <strong> An automation never sends anything and never records a decision.</strong>
            </p>
          </div>
        </header>

        {schedules.length ? (
          <div className="stat-chips" style={{ marginTop: 20 }}>
            <span className="stat-chip static"><b>{running}</b><span>running on schedule</span></span>
            <span className="stat-chip static"><b>{paused}</b><span>paused</span></span>
            <span className="stat-chip static" style={{ color: failing ? "var(--failure)" : undefined }}>
              <b>{failing}</b><span>failed on the last run</span>
            </span>
          </div>
        ) : null}

        {error ? <p className="error">{error}</p> : null}

        <div style={{ marginTop: 24 }}>
          <AutomationPanel
            agents={agents}
            busySchedule={busySchedule}
            onCreate={async (payload) => { await createSchedule(payload); await load(); }}
            onRun={async (scheduleId) => {
              setBusySchedule(scheduleId);
              setError("");
              try { await runSchedule(scheduleId); await load(); }
              catch (caught) { setError(caught instanceof Error ? caught.message : "Could not run the automation."); }
              finally { setBusySchedule(null); }
            }}
            onUpdate={async (scheduleId, enabled) => {
              setBusySchedule(scheduleId);
              setError("");
              try {
                const schedule = schedules.find((item) => item.schedule_id === scheduleId);
                const payload = schedule && "revision" in schedule
                  ? { enabled, expected_revision: schedule.revision }
                  : { enabled };
                await updateSchedule(scheduleId, payload);
                await load();
              }
              catch (caught) { setError(caught instanceof Error ? caught.message : "Could not update the automation."); }
              finally { setBusySchedule(null); }
            }}
            schedules={schedules}
          />
        </div>
      </main>
    </AppShell>
  );
}
