"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Matter, Stage } from "@/lib/types";

export default function KanbanBoard({
  matters,
  stages,
  busyMatter,
  onMove,
  onResearch,
}: {
  matters: Matter[];
  stages: Stage[];
  busyMatter: string | null;
  onMove: (matterId: string, stage: string) => Promise<void>;
  onResearch: (matterId: string) => Promise<void>;
}) {
  const router = useRouter();
  const [dragOver, setDragOver] = useState<string | null>(null);

  return (
    <div className="kanban-wrap">
      <div className="kanban">
        {stages.map((stage) => {
          const columnMatters = matters.filter((matter) => matter.status === stage.id);
          return (
            <section
              className={`kanban-column ${dragOver === stage.id ? "drag-over" : ""}`}
              key={stage.id}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(stage.id);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={async (event) => {
                event.preventDefault();
                setDragOver(null);
                const matterId = event.dataTransfer.getData("text/matter-id");
                if (matterId) await onMove(matterId, stage.id);
              }}
            >
              <header className="column-header">
                <div>
                  <div className="column-label">{stage.label}</div>
                  <div className="column-description">{stage.description}</div>
                </div>
                <span className="count">{columnMatters.length}</span>
              </header>
              {columnMatters.map((matter) => (
                <article
                  className="matter-card"
                  draggable
                  key={matter.matter_id}
                  onDragStart={(event) => event.dataTransfer.setData("text/matter-id", matter.matter_id)}
                  onClick={() => router.push(`/matters/${matter.matter_id}`)}
                >
                  <div className="card-top">
                    <div className="card-title">{matter.title}</div>
                    <span className={`badge ${matter.risk_level?.toLowerCase()}`}>{matter.risk_level}</span>
                  </div>
                  <div className="card-description">{matter.description}</div>
                  <div className="meta-row">
                    <span className="badge">{matter.priority}</span>
                    {matter.required_work_items ? <span className="badge medium">{matter.required_work_items} required</span> : null}
                    {matter.target_date ? <span className="badge">Due {String(matter.target_date).slice(0, 10)}</span> : null}
                  </div>
                  <div className="next-action">
                    <span className="eyebrow">Next</span>
                    <div style={{ marginTop: 4 }}>{matter.next_action}</div>
                  </div>
                  <div className="card-actions">
                    {(matter.status === "intake" || matter.status === "research") && (
                      <button
                        className="button amber compact"
                        disabled={busyMatter === matter.matter_id}
                        onClick={async (event) => {
                          event.stopPropagation();
                          await onResearch(matter.matter_id);
                        }}
                      >
                        {busyMatter === matter.matter_id ? "Researching…" : "Run research"}
                      </button>
                    )}
                    <button className="button compact" onClick={(event) => { event.stopPropagation(); router.push(`/matters/${matter.matter_id}`); }}>
                      Open
                    </button>
                  </div>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
