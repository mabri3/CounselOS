"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { researchQueueAggregate, researchSupportLabel } from "@/lib/researchQueue";
import type { ResearchRun } from "@/lib/types";

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
}: ResearchQueuePanelProps) {
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

  return <section className="agent-note" aria-label="Research queue" style={{ margin: "12px 18px", padding: 14 }}>
    <div className="field-label">Research queue</div>
    <p className="setting-help" role="status">
      {aggregate.runCount} {aggregate.runCount === 1 ? "run" : "runs"} · {aggregate.activeCount} active · {aggregate.savedPacketCount} saved {aggregate.savedPacketCount === 1 ? "packet" : "packets"} · {aggregate.supportCount} saved support {aggregate.supportCount === 1 ? "source" : "sources"}
    </p>
    {showDraftSnapshotNotice ? <div className="matter-lifecycle-action">
      <span>This draft is a saved snapshot</span>
      <p>New research does not change this draft automatically.</p>
      <button className="btn quiet compact" disabled={busy || !onUpdateDraftFromSavedResearch || aggregate.savedPacketCount === 0} onClick={onUpdateDraftFromSavedResearch} type="button">Update draft from saved research</button>
    </div> : null}
    {canControl ? <div className="btn-row" style={{ marginTop: 8 }}>
      <select className="select-input" onChange={(event) => onSelectedQuestion?.(event.target.value)} value={selectedQuestion}>
        <option value="">Select a saved question</option>
        {savedQuestions.map((item) => <option key={item.id} value={item.text}>{item.text}</option>)}
      </select>
      <input className="text-input" onChange={(event) => onEnteredQuestion?.(event.target.value)} placeholder="Or enter a research question" value={enteredQuestion} />
      <button className="btn agent compact" disabled={busy || !onRun} onClick={() => void onRun?.()}>Run research</button>
      {interrupted ? <button className="btn compact" disabled={busy || !onResume} onClick={() => void onResume?.()}>Resume research</button> : null}
      {active ? <button className="btn quiet compact" disabled={busy || !onStop} onClick={() => void onStop?.()}>Stop research</button> : null}
    </div> : null}
    <div style={{ marginTop: 8 }}>
      {items.map((item) => {
        const packetPath = item.results?.[0]?.path;
        const partial = item.state === "completed" && item.status.startsWith("Partial");
        return <div className="setting-help" key={item.run_id} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span><strong>{researchQueueStateWord(item)}</strong> · order {item.queue_order ?? item.priority ?? "—"} · {item.run_id} · {item.question ?? item.questions?.[0] ?? "Research question"}</span>
          <span>Support: {researchSupportLabel(item)}</span>
          {item.state === "running" ? <span>{researchElapsed(item, now)} elapsed{packetPath ? " · saved packet available" : ""} · You can continue elsewhere while research runs.</span> : null}
          {partial ? <span>Partial research is saved. You can use the packet to continue drafting.</span> : null}
          {canControl && item.state === "queued" ? <>
            <button className="btn compact" disabled={busy || !onMove || pending[0]?.run_id === item.run_id} onClick={() => void onMove?.(item.run_id, -1)}>Up</button>
            <button className="btn compact" disabled={busy || !onMove || pending.at(-1)?.run_id === item.run_id} onClick={() => void onMove?.(item.run_id, 1)}>Down</button>
          </> : null}
          {packetPath ? <Link href={packetHref(packetPath)}>Open packet</Link> : null}
          {item.state === "failed" ? <button className="btn quiet compact" disabled={busy || !onRetry} onClick={() => void onRetry?.(item.run_id)} type="button">Retry</button> : null}
          {partial && onContinueFromPartial ? <button className="btn quiet compact" onClick={() => onContinueFromPartial(item)} type="button">Continue from saved research</button> : null}
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
