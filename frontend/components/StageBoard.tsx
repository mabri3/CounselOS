"use client";

import Link from "next/link";
import { useState } from "react";
import LinkifiedText from "@/components/LinkifiedText";
import { STAGES, role, signalFor, dueWord } from "@/lib/design";
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

  return (
    <div className="board">
      {STAGES.map((stage) => {
        const items = matters.filter((matter) => matter.status === stage.id);
        const signals = items.map(signalFor);
        const needs = signals.filter((signal) => signal.word === "Waiting on you" || signal.word === "Overdue").length;
        const working = signals.some((signal) => signal.word === "Themis is working");
        const over = overColumn === stage.id;
        const acceptsDrop = stage.id !== "closed";

        return (
          <section
            className="board-column"
            key={stage.id}
            style={{ background: over ? "#FAEDCB" : "transparent" }}
            onDragOver={(event) => { if (acceptsDrop) { event.preventDefault(); setOverColumn(stage.id); } }}
            onDragLeave={() => setOverColumn((current) => (current === stage.id ? null : current))}
            onDrop={async (event) => {
              event.preventDefault();
              setOverColumn(null);
              const matterId = event.dataTransfer.getData("text/matter-id") || dragId;
              setDragId(null);
              if (matterId && acceptsDrop) await onMove(matterId, stage.id);
            }}
          >
            <header
              className="board-head"
              style={{ borderBottom: needs > 0 ? `2px solid ${role.attention}` : "1px solid var(--line)" }}
              title={stage.sub}
            >
              <span style={{ color: needs > 0 ? "var(--ink)" : "var(--ink-4)" }}>{stage.label}</span>
              <span>{items.length}</span>
            </header>

            {needs > 0 ? (
              <span className="signal" style={{ padding: "0 6px", color: role.attentionDeep }}>
                <span className="dot sm" style={{ background: role.attention }} />
                {needs === 1 ? "1 needs you" : `${needs} need you`}
              </span>
            ) : working ? (
              <span className="signal" style={{ padding: "0 6px", color: role.agent }}>
                <span className="dot sm" style={{ background: role.agent }} />
                Themis is working
              </span>
            ) : null}

            {items.map((matter) => {
              const signal = signalFor(matter);
              const due = dueWord(matter);
              return (
                <article
                  className="board-card"
                  draggable
                  key={matter.matter_id}
                  style={{
                    background: signal.bg,
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
                      title={signal.word === "Waiting on you" ? "Research is done. This matter needs your judgment." : signal.word === "Themis is working" ? "The agent is researching or drafting this matter." : "The target date has passed."}
                    >
                      <span className="dot sm" style={{ background: signal.rail }} />
                      {signal.word}
                    </span>
                  ) : null}
                  <Link className="board-card-title" href={`/matters/${encodeURIComponent(matter.matter_id)}`}>
                    {matter.title}
                  </Link>
                  <span className="board-card-why"><LinkifiedText text={matter.next_action || matter.description} /></span>
                  <span className="board-card-foot">
                    <span>{matter.legal_owner || "Unassigned"}</span>
                    <span style={{ color: due.color }}>{due.text}</span>
                  </span>
                </article>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
