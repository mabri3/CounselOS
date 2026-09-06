"use client";

import Link from "next/link";
import styles from "@/components/PortfolioPhase2.module.css";
import { useState } from "react";
import LinkifiedText from "@/components/LinkifiedText";
import { repairMatterConsistency } from "@/lib/api";
import { STAGES, consistencyIssueIsSafelyRepairable, consistencyIssueLabel, isWaitingSignal, matterNextAction, matterNextOwner, role, signalFor, dueWord } from "@/lib/design";
import type { Matter, StageId } from "@/lib/types";

/**
 * Canvas 3b — the board, one layer down from Today and much quieter.
 * Plain stage names, one line of reasoning per card, drag to move.
 */
export default function StageBoard({
  matters,
  onMove,
}: {
  matters: Matter[];
  onMove: (matterId: string, stage: StageId) => Promise<void>;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);
  const [repairing, setRepairing] = useState<string | null>(null);
  const [repairError, setRepairError] = useState<{ matterId: string; message: string } | null>(null);

  async function repair(matterId: string) {
    setRepairing(matterId);
    setRepairError(null);
    try {
      await repairMatterConsistency(matterId, "Lawyer");
      window.location.reload();
    } catch (caught) {
      setRepairError({
        matterId,
        message: caught instanceof Error ? caught.message : "Could not repair the lifecycle stage.",
      });
      setRepairing(null);
    }
  }

  return (
    <div className={styles.board}>
      {STAGES.map((stage) => {
        const items = matters.filter((matter) => matter.status === stage.id);
        const signals = items.map(signalFor);
        const overdue = signals.filter((signal) => signal.kind === "overdue").length;
        const waiting = signals.filter((signal) => isWaitingSignal(signal.kind)).length;
        const needsAssignment = signals.filter((signal) => signal.kind === "needs_assignment").length;
        const attentionParts = [
          overdue ? `${overdue} overdue` : "",
          waiting ? `${waiting} waiting` : "",
          needsAssignment ? `${needsAssignment} ${needsAssignment === 1 ? "needs" : "need"} assignment` : "",
        ].filter(Boolean);
        const signalColor = overdue > 0 ? role.failure : role.attention;
        const over = overColumn === stage.id;
        const acceptsDrop = stage.id !== "closed";

        return (
          <section
            className="board-column"
            key={stage.id}
            style={{ background: over ? "var(--rail)" : "transparent" }}
            onDragOver={(event) => { if (acceptsDrop) { event.preventDefault(); setOverColumn(stage.id); } }}
            onDragLeave={() => setOverColumn((current) => (current === stage.id ? null : current))}
            onDrop={async (event) => {
              event.preventDefault();
              setOverColumn(null);
              const matterId = event.dataTransfer.getData("text/matter-id") || dragId;
              setDragId(null);
              if (matterId && acceptsDrop && matters.some((matter) => matter.matter_id === matterId && matter.status !== "closed")) await onMove(matterId, stage.id);
            }}
          >
            <header
              className="board-head"

              title={stage.sub}
            >
              <span style={{ color: attentionParts.length > 0 ? "var(--ink)" : "var(--ink-4)" }}>{stage.label}</span>
              <span aria-label={`${items.length} ${items.length === 1 ? "matter" : "matters"}`}>{items.length}</span>
            </header>

            {attentionParts.length > 0 ? (
              <span className="signal" style={{ padding: "0 6px", color: overdue > 0 ? role.failure : role.attentionDeep }}>
                <span className="dot sm" style={{ background: signalColor }} />
                {attentionParts.join(" · ")}
              </span>
            ) : null}

            {items.length === 0 ? <p className={styles.emptyStage}>No matters in this stage.</p> : null}
            {items.map((matter) => {
              const signal = signalFor(matter);
              const due = dueWord(matter);
              return (
                <article
                  className="board-card"
                  draggable={matter.status !== "closed"}
                  key={matter.matter_id}
                  style={{
                    background: "white",
                    borderLeftColor: signal.rail,
                    opacity: dragId === matter.matter_id ? 0.4 : 1,
                  }}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/matter-id", matter.matter_id);
                    setDragId(matter.matter_id);
                  }}
                  onDragEnd={() => { setDragId(null); setOverColumn(null); }}
                >
                  {signal.word ? (
                    <span
                      className="signal"
                      style={{ marginBottom: 6, color: signal.wordColor, fontSize: 13 }}
                      title={signal.word}
                    >
                      <span className="dot sm" style={{ background: signal.rail }} />
                      {signal.word}
                    </span>
                  ) : null}
                  <Link className="board-card-title" href={`/matters/${encodeURIComponent(matter.matter_id)}`}>
                    {matter.title}
                  </Link>
                  <span className="board-card-why">
                    {matter.status === "closed"
                      ? <span aria-label="No active next action">—</span>
                      : <LinkifiedText text={matterNextAction(matter)} />}
                  </span>
                  <span className="board-card-foot">
                    <span>{matterNextOwner(matter)}</span>
                    <span style={{ color: due.color }}>{due.text}</span>
                  </span>
                  {matter.status !== "closed" ? (
                    <details className={styles.moveControl}>
                      <summary>Move matter</summary>
                      <select aria-label={`Move ${matter.title} to stage`} value={matter.status} onChange={(event) => void onMove(matter.matter_id, event.target.value as StageId)}>
                        {STAGES.filter((target) => target.id !== "closed").map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}
                      </select>
                    </details>
                  ) : null}
                  {(matter.consistency_issues ?? []).map((issue) => (
                    <div key={issue.code} style={{ marginTop: 8, padding: 8, background: role.attentionTint, color: role.attentionDeep }}>
                      <strong>Consistency issue: {consistencyIssueLabel(issue)}</strong>
                      <div style={{ marginTop: 3 }}>{issue.summary}</div>
                      <div style={{ marginTop: 5, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Link href={`/matters/${encodeURIComponent(matter.matter_id)}`}>Review matter</Link>
                        {consistencyIssueIsSafelyRepairable(issue) ? (
                          <button className="btn compact" disabled={repairing === matter.matter_id} onClick={() => void repair(matter.matter_id)} type="button">
                            {repairing === matter.matter_id ? "Repairing…" : "Repair safe stage mismatch"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </article>
              );
            })}
            {repairError && items.some((matter) => matter.matter_id === repairError.matterId)
              ? <span className="error">{repairError.message}</span>
              : null}
          </section>
        );
      })}
    </div>
  );
}
