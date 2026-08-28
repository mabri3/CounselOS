"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import LinkifiedText from "@/components/LinkifiedText";
import BriefingList from "@/components/BriefingList";
import NewMatterForm from "@/components/NewMatterForm";
import TodayChat from "@/components/TodayChat";
import { createMatter, getAutomations, getDecisions, getMatters } from "@/lib/api";
import { buildBriefing } from "@/lib/briefing";
import type { Decision, Matter, Schedule } from "@/lib/types";

/** Canvas 3a — Today is the front door. The command centre is one click down. */
export default function TodayPage() {
  const router = useRouter();
  const [matters, setMatters] = useState<Matter[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [creating, setCreating] = useState(false);
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
      setError(caught instanceof Error ? caught.message : "Could not load today.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const briefing = useMemo(
    () => buildBriefing(matters, decisions, schedules),
    [matters, decisions, schedules],
  );

  const inFlight = matters.filter((matter) => matter.status !== "closed").length;
  const working = matters.filter((matter) => matter.status === "research" || matter.status === "generate").length;
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AppShell>
      <main className="page" style={{ paddingBottom: 0 }}>
        <div style={{ maxWidth: 1040 }}>
          <div className="day">{today}</div>
          {loaded ? <h1 className="headline">{briefing.headline}</h1> : <h1 className="headline">Reading the vault…</h1>}
          <p className="subhead">{loaded ? briefing.subhead : "One moment."}</p>

          {error ? <p className="error">{error}</p> : null}
          {!loaded && !error ? <div className="loading">Loading the briefing…</div> : null}
          {loaded && !error ? <BriefingList items={briefing.items} /> : null}

          {briefing.comingUp.length ? (
            <div style={{ marginTop: 22 }}>
              <div style={{ font: "600 15px var(--sans)", color: "var(--ink)" }}>Coming up — nothing to do yet</div>
              <div className="quiet-list" style={{ marginTop: 8 }}>
                {briefing.comingUp.map((item) => (
                  <div className="quiet-row" key={item.id}>
                    <span style={{ flex: 1 }}><LinkifiedText text={item.text} /></span>
                    <span>{item.when}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="today-start">
            <TodayChat onRefresh={load} />
            <NewMatterForm
              busy={creating}
              onCreate={async (payload) => {
                setCreating(true);
                try {
                  const matter = await createMatter(payload);
                  router.push(`/matters/${encodeURIComponent(matter.matter_id)}`);
                } finally {
                  setCreating(false);
                }
              }}
            />
          </div>
        </div>
      </main>

      <div className="footer-band">
        <div style={{ maxWidth: "70ch" }}>
          <div className="section-heading">The rest of the practice</div>
          <p style={{ margin: "5px 0 0", font: "400 15px/1.6 var(--sans)", color: "var(--ink-3)" }}>
            {inFlight} matter{inFlight === 1 ? "" : "s"} in flight, {working} being worked by an agent,{" "}
            {decisions.length} decision{decisions.length === 1 ? "" : "s"} on the record. Start a new matter, move the
            board, or see what ran overnight.
          </p>
        </div>
        <Link className="btn primary" href="/workspace">Open the workspace</Link>
      </div>
    </AppShell>
  );
}
