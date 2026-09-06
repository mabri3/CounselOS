"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import BriefingList from "@/components/BriefingList";
import DataLoadStatus from "@/components/DataLoadStatus";
import NewMatterForm from "@/components/NewMatterForm";
import PracticeRail from "@/components/PracticeRail";
import TodayChat from "@/components/TodayChat";
import { request, createMatter, getAutomations, getDecisions, getMatters } from "@/lib/api";
import { buildBriefing } from "@/lib/briefing";
import { formatLongDate } from "@/lib/design";
import { getReviewPackets } from "@/lib/watchApi";
import type { Decision, Matter, Schedule } from "@/lib/types";
import type { ReviewPacket } from "@/lib/watchTypes";

import { continuityKey, targetUrl, useContinuityIdentity } from "@/lib/continuityApi";
import OrientationSummary from "@/components/workspace/OrientationSummary";
import TeamWorkList from "@/components/workspace/TeamWorkList";
import type { Orientation, TeamWorkItem, TeamView } from "@/lib/continuityTypes";

/** Canvas 3a — Today is the front door. The command centre is one click down. */
export default function TodayPage() {
  const router = useRouter();
  const { identity } = useContinuityIdentity();
  const [orientations, setOrientations] = useState<Orientation[]>([]);
  const [teamItems, setTeamItems] = useState<TeamWorkItem[]>([]);
  const [teamView, setTeamView] = useState<TeamView>("my_work");
  const [continuityError, setContinuityError] = useState("");
  const [continuityLoading, setContinuityLoading] = useState(false);
  const viewerKey = identity ? continuityKey(identity.roster.vault_key, identity.actor.person_id, "today", "view") : "";
  useEffect(() => { if (viewerKey) setTeamView((localStorage.getItem(viewerKey) || "my_work") as TeamView); }, [viewerKey]);
  const loadContinuity = useCallback(async () => {
    if (!identity) return;
    const headers = { "X-Themis-Person-Id": identity.actor.mode === "demo" ? identity.actor.person_id : "" };
    setContinuityLoading(true); setContinuityError("");
    try {
      const [nextOrientations, nextWork] = await Promise.all([request<Orientation[]>("/team/orientations", { headers }), request<TeamWorkItem[]>(`/team/work?view=${teamView}`, { headers })]);
      return { nextOrientations, nextWork };
    } catch (error) { setContinuityError(error instanceof Error ? error.message : "Saved next actions could not load."); }
    finally { setContinuityLoading(false); }
  }, [identity, teamView]);
  useEffect(() => { let active = true; setOrientations([]); setTeamItems([]); void loadContinuity().then(result => { if (active && result) { setOrientations(result.nextOrientations); setTeamItems(result.nextWork); } }); return () => { active = false; }; }, [loadContinuity]);
  const refreshContinuity = () => { void loadContinuity().then(result => { if (result) { setOrientations(result.nextOrientations); setTeamItems(result.nextWork); } }); };
  const [matters, setMatters] = useState<Matter[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [reviewPackets, setReviewPackets] = useState<ReviewPacket[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [today, setToday] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLoadError("");
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
      setLoaded(true);
    } catch {
      setLoadError("Today is unavailable because the current workspace data could not be loaded.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  // Static HTML may have been built on an earlier day or in another timezone.
  useEffect(() => { setToday(formatLongDate(new Date())); }, []);

  const briefing = useMemo(
    () => buildBriefing(matters, decisions, schedules, reviewPackets),
    [matters, decisions, schedules, reviewPackets],
  );
  const orientationsByMatterId = new Map(orientations.map((orientation) => [orientation.matter_id, orientation]));
  const attentionItems = briefing.items.map((item) => {
    return item.id.startsWith("matter-")
      ? orientationsByMatterId.get(item.id.slice("matter-".length)) ?? null
      : null;
  });
  const attentionOrientationIds = new Set(attentionItems.flatMap((orientation) => orientation ? [orientation.matter_id] : []));
  const otherOrientationCount = orientations.filter((orientation) => !attentionOrientationIds.has(orientation.matter_id)).length;

  return (
    <AppShell>
      <main className="page">
        <div style={{ maxWidth: 1324 }}>
          <div className="day">{today}</div>
          {loaded ? <h1 className="headline">{briefing.headline}</h1> : <h1 className="headline">Today</h1>}
          <p className="subhead">{loaded ? briefing.subhead : loadError ? "Current workspace data is unavailable." : "Reading the vault…"}</p>

          <DataLoadStatus error={loadError} loading={loading} loadingLabel={loaded ? "Refreshing the briefing…" : "Loading the briefing…"} onRetry={load} />
          {loaded ? (
            <div className="today-grid">
              <div className="today-col">
                {continuityError ? <DataLoadStatus error={continuityError} loading={continuityLoading} loadingLabel="Reading saved next actions…" onRetry={refreshContinuity} /> : null}
                {identity?.roster.enabled ? <TeamWorkList items={teamItems} view={teamView} loading={continuityLoading} onViewChange={view => { setTeamView(view); localStorage.setItem(viewerKey, view); }} onOpenTarget={target => router.push(targetUrl(target))} /> : null}
                {attentionItems.map((orientation, index) => orientation ? <div key={orientation.matter_id}><Link href={`/matters/${encodeURIComponent(orientation.matter_id)}`} className="quiet-head-link">{matters.find(m => m.matter_id === orientation.matter_id)?.title || orientation.matter_id}</Link><OrientationSummary orientation={orientation} compact onOpenTarget={target => router.push(targetUrl(target))} onRefresh={refreshContinuity} /></div> : <BriefingList key={briefing.items[index].id} items={[briefing.items[index]]} startIndex={index} />)}
                {otherOrientationCount > 0 ? <section className="card">
                  <div className="quiet-head">
                    <span className="quiet-head-title">Other matter orientations</span>
                    <span className="quiet-head-count">{otherOrientationCount} available outside today&apos;s attention list</span>
                    <Link className="quiet-head-link" href="/matters">All matters →</Link>
                  </div>
                </section> : null}

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

          {loaded ? <div className="today-start" style={{ maxWidth: 1000 }}>
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
          </div> : null}
        </div>
      </main>
    </AppShell>
  );
}
