"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { researchQueueAggregate, researchSupportLabel } from "@/lib/researchQueue";
import type { ResearchRun } from "@/lib/types";
import MatterIcon from "@/components/workspace/MatterIcon";
import matterStyles from "@/components/workspace/MatterWork.module.css";
import phase2Styles from "@/components/ResearchPhase2.module.css";

type SavedQuestion = { id: string; text: string };

type ResearchQueuePanelProps = {
  items: ResearchRun[];
  mode?: "controls" | "summary";
  busy?: boolean;
  enteredQuestion?: string;
  savedQuestions?: SavedQuestion[];
  selectedQuestion?: string;
  packetHref?: (path: string) => string;
  onEnteredQuestion?: (value: string) => void;
  onMove?: (runId: string, direction: -1 | 1) => Promise<void>;
  onResume?: () => Promise<void>;
  onStop?: () => Promise<void>;
  onRetry?: (runId: string) => Promise<void>;
  onRun?: () => Promise<void>;
  onContinueFromPartial?: (item: ResearchRun) => void;
  onUpdateDraftFromSavedResearch?: () => void;
  onSelectedQuestion?: (value: string) => void;
  showDraftSnapshotNotice?: boolean;
};

export default function ResearchQueuePanel({
  items,
  mode = "controls",
  presentation = "matter",
  busy = false,
  enteredQuestion = "",
  savedQuestions = [],
  selectedQuestion = "",
  packetHref = (path) => `?file=${encodeURIComponent(path)}`,
  onEnteredQuestion,
  onMove,
  onResume,
  onStop,
  onRetry,
  onRun,
  onContinueFromPartial,
  onUpdateDraftFromSavedResearch,
  onSelectedQuestion,
  showDraftSnapshotNotice = false,
}: ResearchQueuePanelProps & { presentation?: "matter" | "phase2" }) {
  const styles = presentation === "phase2" ? phase2Styles : matterStyles;
  const pending = items.filter((item) => item.state === "queued");
  const interrupted = items.some((item) => item.state === "interrupted");
  const active = items.some((item) => item.state === "queued" || item.state === "running");
  const canControl = mode === "controls";
  const aggregate = researchQueueAggregate(items);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!items.some((item) => item.state === "running")) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [items]);

  return <section className={styles.researchQueue} aria-label="Research queue">
    <header className={styles.queueHeader}><div><div className={`field-label ${styles.panelLabel}`}>Research queue</div><p className={`setting-help ${styles.queueSummary}`} role="status">{aggregate.runCount} {aggregate.runCount === 1 ? "run" : "runs"} · {aggregate.activeCount} active · {aggregate.savedPacketCount} saved {aggregate.savedPacketCount === 1 ? "packet" : "packets"}</p></div><span className={styles.queueSupportCount}>{aggregate.supportCount} saved {aggregate.supportCount === 1 ? "source" : "sources"}</span></header>
    {showDraftSnapshotNotice ? <div className={`matter-lifecycle-action ${styles.snapshotNotice}`}>
      <span>This draft is a saved snapshot</span>
      <p>New research does not change this draft automatically.</p>
      <button className="btn quiet compact" disabled={busy || !onUpdateDraftFromSavedResearch || aggregate.savedPacketCount === 0} onClick={onUpdateDraftFromSavedResearch} type="button">Update draft from saved research</button>
    </div> : null}
    {canControl ? <div className={`btn-row ${styles.queueControls}`}>
      <select className="select-input" onChange={(event) => onSelectedQuestion?.(event.target.value)} value={selectedQuestion}>
        <option value="">Select a saved question</option>
        {savedQuestions.map((item) => <option key={item.id} value={item.text}>{item.text}</option>)}
      </select>
      <input className="text-input" onChange={(event) => onEnteredQuestion?.(event.target.value)} placeholder="Or enter a research question" value={enteredQuestion} />
      <button className="btn agent compact" disabled={busy || !onRun} onClick={() => void onRun?.()}>Run research</button>
      {interrupted ? <button className="btn compact" disabled={busy || !onResume} onClick={() => void onResume?.()}>Resume research</button> : null}
      {active ? <button className="btn quiet compact" disabled={busy || !onStop} onClick={() => void onStop?.()}>Stop research</button> : null}
    </div> : null}
    <div className={styles.queueItems}>
      {items.map((item) => {
        const packetPath = item.results?.[0]?.path;
        const partial = item.state === "completed" && item.status.startsWith("Partial");
        return <div className={`setting-help ${styles.queueItem}`} key={item.run_id}>
          <span className={styles.queueIcon}><MatterIcon name={partial ? "sparkles" : item.state === "completed" ? "book" : item.state === "failed" ? "history" : "search"} size={22} /></span><div className={styles.queueItemTitle}><span>{item.question ?? item.questions?.[0] ?? "Research question"}</span><span className={styles.queueMetadata}>Queue order {item.queue_order ?? item.priority ?? "—"} · {item.run_id} · Support: {researchSupportLabel(item)}</span></div>
          <span className={styles.queueState} data-state={partial ? "partial" : item.state}>{researchQueueStateWord(item)}</span>
          <div className={styles.queueItemActions}>{item.state === "running" ? <span className={styles.queueNotice}>{researchElapsed(item, now)} elapsed{packetPath ? " · saved packet available" : ""}</span> : null}
          {partial ? <span className={styles.queueNotice}>Partial research is saved</span> : null}
          {canControl && item.state === "queued" ? <>
            <button className="btn compact" disabled={busy || !onMove || pending[0]?.run_id === item.run_id} onClick={() => void onMove?.(item.run_id, -1)}>Up</button>
            <button className="btn compact" disabled={busy || !onMove || pending.at(-1)?.run_id === item.run_id} onClick={() => void onMove?.(item.run_id, 1)}>Down</button>
          </> : null}
          {packetPath ? <Link href={packetHref(packetPath)}>Open packet</Link> : null}
          {item.state === "failed" ? <button className="btn quiet compact" disabled={busy || !onRetry} onClick={() => void onRetry?.(item.run_id)} type="button">Retry</button> : null}
          {partial && onContinueFromPartial ? <button className="btn quiet compact" onClick={() => onContinueFromPartial(item)} type="button">Continue from saved research</button> : null}</div>
        </div>;
      })}
    </div>
  </section>;
}

function researchElapsed(item: ResearchRun, now: number): string {
  const started = Date.parse(item.started_at || item.created_at || "");
  const seconds = Number.isFinite(started) ? Math.max(0, Math.floor((now - started) / 1000)) : 0;
  const minutes = Math.floor(seconds / 60);
  return minutes ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}

function researchQueueStateWord(item: ResearchRun): string {
  if (item.state === "completed") return item.status.startsWith("Partial") ? "Partial" : "Complete";
  return { queued: "Queued", running: "Running", failed: "Failed", interrupted: "Stopped" }[item.state];
}
