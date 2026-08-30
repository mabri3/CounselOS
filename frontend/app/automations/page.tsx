"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import AutomationPanel from "@/components/AutomationPanel";
import { createSchedule, getAutomations, runSchedule, updateSchedule } from "@/lib/api";
import { scheduleIsFailing } from "@/lib/design";
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

  const running = schedules.filter((schedule) => schedule.enabled === 1 && !scheduleIsFailing(schedule)).length;
  const failing = schedules.filter(scheduleIsFailing).length;

  return (
    <AppShell>
      <main className="page narrow">
        <div className="page-header">
          <div>
            <h1>Automations</h1>
            <p>
              {running} running.{" "}
              {failing === 0 ? "No failed runs." : `${failing} failed automation${failing === 1 ? "" : "s"}.`}
            </p>
          </div>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <div style={{ marginTop: 22 }}>
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
