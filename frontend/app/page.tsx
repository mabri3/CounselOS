"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import BriefingList from "@/components/BriefingList";
import NewMatterForm from "@/components/NewMatterForm";
import PracticeRail from "@/components/PracticeRail";
import TodayChat from "@/components/TodayChat";
import { createMatter, getAutomations, getDecisions, getMatters } from "@/lib/api";
import { buildBriefing } from "@/lib/briefing";
import { formatLongDate } from "@/lib/design";
import { getReviewPackets } from "@/lib/watchApi";
import type { Decision, Matter, Schedule } from "@/lib/types";
import type { ReviewPacket } from "@/lib/watchTypes";

/** Canvas 3a — Today is the front door. The command centre is one click down. */
export default function TodayPage() {
  const router = useRouter();
  const [matters, setMatters] = useState<Matter[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [reviewPackets, setReviewPackets] = useState<ReviewPacket[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [matterData, decisionData, automationData, packetData] = await Promise.all([
        getMatters(),
        getDecisions(),
        getAutomations(),
        getReviewPackets({ limit: 100 }),
      ]);
      setMatters(matterData.matters);
      setDecisions(decisionData.decisions);
      setSchedules(automationData.schedules);
      setReviewPackets(packetData.items);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load today.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const briefing = useMemo(
    () => buildBriefing(matters, decisions, schedules, reviewPackets),
    [matters, decisions, schedules, reviewPackets],
  );

  const today = formatLongDate(new Date());

  return (
    <AppShell>
      <main className="page">
        <div style={{ maxWidth: 1324 }}>
          <div className="day">{today}</div>
          {loaded ? <h1 className="headline">{briefing.headline}</h1> : <h1 className="headline">Reading the vault…</h1>}
          <p className="subhead">{loaded ? briefing.subhead : "One moment."}</p>

          {error ? <p className="error">{error}</p> : null}
          {!loaded && !error ? <div className="loading">Loading the briefing…</div> : null}
          {loaded && !error ? (
            <div className="today-grid">
              <div className="today-col">
                <BriefingList items={briefing.items} />

                {briefing.comingUp.length ? (
                  <section className="card">
                    <div className="quiet-head">
                      <span className="quiet-head-title">Your other matters</span>
                      <span className="quiet-head-count">
                        Showing {briefing.comingUp.length} of {briefing.comingUpTotal}
                      </span>
                      <Link className="quiet-head-link" href="/matters">All matters →</Link>
                    </div>
                    <div className="quiet-list quiet-inset">
                      {briefing.comingUp.map((item) => (
                        <Link className="quiet-row" href={item.href} key={item.id}>
                          <span style={{ flex: 1 }}>{item.text}</span>
                          <span>{item.when}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <PracticeRail decisions={decisions} matters={matters} />
            </div>
          ) : null}

          <div className="today-start" style={{ maxWidth: 1000 }}>
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
            <TodayChat onRefresh={load} />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
