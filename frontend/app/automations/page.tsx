"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import AutomationPanel from "@/components/AutomationPanel";
import { createSchedule, getAutomations, runSchedule } from "@/lib/api";
import type { AgentDefinition, Schedule } from "@/lib/types";

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

  return (
    <AppShell>
      <main className="page">
        <div className="page-header">
          <div>
            <div className="eyebrow">Background assistance</div>
            <h1>Agents & Automations</h1>
            <p className="muted">Define the work in Markdown or natural language, inspect it, and run it on a visible schedule.</p>
          </div>
          <span className="status-pill">{agents.length} hot-loaded agents</span>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <AutomationPanel
          schedules={schedules}
          agents={agents}
          busySchedule={busySchedule}
          onRun={async (scheduleId) => {
            setBusySchedule(scheduleId);
            try { await runSchedule(scheduleId); await load(); }
            finally { setBusySchedule(null); }
          }}
          onCreate={async (payload) => { await createSchedule(payload); await load(); }}
        />
      </main>
    </AppShell>
  );
}
