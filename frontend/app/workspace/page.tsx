"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import LinkifiedText from "@/components/LinkifiedText";
import NewMatterForm from "@/components/NewMatterForm";
import StageBoard from "@/components/StageBoard";
import { createMatter, getAutomations, getDecisions, getMatters, moveMatter } from "@/lib/api";
import { decisionNeedsReview, formatDateTime, matterAwaitsJudgment, role, scheduleIsFailing } from "@/lib/design";
import type { Decision, Matter, Schedule, StageId } from "@/lib/types";

/** Canvas 3b — the command centre, calmed rather than cut. */
export default function WorkspacePage() {
  const router = useRouter();
  const [matters, setMatters] = useState<Matter[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [creating, setCreating] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [matterData, decisionData, automationData] = await Promise.all([
        getMatters(),
        getDecisions(),
        getAutomations(),
      ]);
      setMatters(matterData.matters);
      setDecisions(decisionData.decisions);
      setSchedules(automationData.schedules);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load the workspace.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const inFlight = matters.filter((matter) => matter.status !== "closed").length;
  const needsYou = matters.filter(matterAwaitsJudgment).length;
  const failing = schedules.filter(scheduleIsFailing);

  const quarter = useMemo(
    () => [
      { n: String(matters.filter((matter) => matter.status === "closed").length), label: "matters closed", color: role.ink },
      { n: String(inFlight), label: "matters in flight", color: role.ink },
      { n: String(decisions.length), label: "decisions recorded", color: role.ink },
      {
        n: String(decisions.filter(decisionNeedsReview).length),
        label: "decisions need review",
        color: role.attentionDeep,
      },
    ],
    [matters, decisions, inFlight],
  );

  const activity = schedules
    .filter((schedule) => schedule.last_run_at)
    .sort((a, b) => String(b.last_run_at).localeCompare(String(a.last_run_at)))
    .slice(0, 4);

  return (
    <AppShell>
      <main className="page">
        <div className="page-header">
          <div>
            <h1>Workspace</h1>
            <p>
              {inFlight} matter{inFlight === 1 ? "" : "s"} in flight.{" "}
              {needsYou} {needsYou === 1 ? "matter awaits" : "matters await"} your judgment.
            </p>
          </div>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <div style={{ marginTop: 20 }}>
          <NewMatterForm
            busy={creating}
            onCreate={async (payload) => {
              setCreating(true);
              try {
                const matter = await createMatter(payload);
                router.push(`/matters/${encodeURIComponent(matter.matter_id)}`);
              }
              finally { setCreating(false); }
            }}
          />
        </div>

        <section style={{ marginTop: 26 }}>
          <div className="section-heading">The board</div>
          <div className="legend" style={{ margin: "4px 0 14px" }}>
            <span style={{ font: "400 14px var(--sans)", color: "var(--ink-4)" }}>Drag to move active work. Close a matter from its page after delivery.</span>
            <span className="legend-item"><span className="dot" style={{ background: role.failure }} />Overdue</span>
            <span className="legend-item"><span className="dot" style={{ background: role.attention }} />Waiting on you</span>
            <span className="legend-item"><span className="dot" style={{ background: role.agent }} />Themis.ai is working</span>
            <span className="legend-item"><span className="dot" style={{ background: "#d6d1c7" }} />No action needed</span>
          </div>
          {loaded ? (
            <StageBoard
              matters={matters}
              onMove={async (matterId, stage: StageId) => {
                setError("");
                try {
                  await moveMatter(matterId, stage, "Moved on the board");
                  await load();
                } catch (caught) {
                  setError(caught instanceof Error ? caught.message : "Could not move the matter.");
                }
              }}
            />
          ) : (
            <div className="loading">Loading the board…</div>
          )}
        </section>

        <section
          style={{
            marginTop: 34,
            paddingTop: 22,
            borderTop: "1px solid var(--line-soft)",
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1.15fr)",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div>
            <div className="section-heading">This quarter</div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
              {quarter.map((entry) => (
                <div className="quarter-row" key={entry.label}>
                  <b style={{ color: entry.color }}>{entry.n}</b>
                  <span>{entry.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="section-heading">What the agents did</span>
              <Link href="/automations" style={{ font: "400 14px var(--sans)", color: "var(--ink-2)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                All activity
              </Link>
            </div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column" }}>
              {activity.length === 0 ? (
                <div style={{ padding: "10px 0", font: "400 15px var(--sans)", color: "var(--ink-5)" }}>
                  No automation has run yet.
                </div>
              ) : null}
              {activity.map((schedule) => (
                <div className="activity-row" key={schedule.schedule_id}>
                  <span
                    className="dot sm"
                    style={{ background: scheduleIsFailing(schedule) ? role.failure : role.healthy, alignSelf: "center" }}
                  />
                  <span style={{ flex: 1 }}><LinkifiedText text={`${schedule.title} · ${schedule.last_status || "ran"}`} /></span>
                  <span style={{ flex: "none", font: "400 14px var(--sans)", color: "var(--ink-5)" }}>
                    {formatDateTime(schedule.last_run_at)}
                  </span>
                </div>
              ))}
              {failing.map((schedule) => (
                <div key={schedule.schedule_id} style={{ padding: "10px 0", font: "400 14px var(--sans)", color: role.failure }}>
                  <LinkifiedText text={schedule.title} /> has been failing —{" "}
                  <Link href="/automations" style={{ color: role.failure, textDecoration: "underline", textUnderlineOffset: 3 }}>
                    reconnect it
                  </Link>.
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
