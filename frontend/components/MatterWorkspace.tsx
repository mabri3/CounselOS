"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import DocumentPanel from "@/components/DocumentPanel";
import MatterTree from "@/components/MatterTree";
import { moveMatter, uploadDocument } from "@/lib/api";
import type { MatterDetail, StageId } from "@/lib/types";

const stages: StageId[] = ["intake", "research", "explore", "generate", "respond", "closed"];

export default function MatterWorkspace({
  detail,
  initialPath,
  onReload,
}: {
  detail: MatterDetail;
  initialPath?: string | null;
  onReload: () => Promise<void>;
}) {
  const defaultPath = `${detail.path}/matter.md`;
  const [activePath, setActivePath] = useState<string | null>(initialPath ?? defaultPath);
  const [uploading, setUploading] = useState(false);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const requestedPath = initialPath?.startsWith(`${detail.path}/`) ? initialPath : defaultPath;
    setActivePath(requestedPath);
  }, [defaultPath, detail.path, initialPath]);

  async function upload(file: File) {
    setUploading(true);
    try {
      const result = await uploadDocument(detail.matter_id, file);
      await onReload();
      const extracted = result.extracted_path;
      const path = typeof extracted === "string" && extracted ? extracted : result.path;
      if (typeof path === "string") setActivePath(path);
    } finally {
      setUploading(false);
    }
  }

  async function changeStage(stage: StageId) {
    setMoving(true);
    try { await moveMatter(detail.matter_id, stage, "Changed from the matter workspace"); await onReload(); }
    finally { setMoving(false); }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow"><Link href="/">Command Center</Link> / {detail.matter_type.replaceAll("_", " ")}</div>
          <h1>{detail.title}</h1>
          <p className="muted">{detail.description}</p>
        </div>
        <div className="button-row">
          <select
            aria-label="Matter stage"
            disabled={moving}
            value={detail.status}
            onChange={(event) => void changeStage(event.target.value as StageId)}
            style={{ width: 150 }}
          >
            {stages.map((stage) => <option value={stage} key={stage}>{stage[0].toUpperCase() + stage.slice(1)}</option>)}
          </select>
          <span className={`badge ${detail.risk_level.toLowerCase()}`}>{detail.risk_level} risk</span>
        </div>
      </div>

      <section className="card orientation">
        <div className="orientation-block">
          <div className="eyebrow">What counsel needs to do</div>
          <div className="orientation-value">{detail.orientation.headline}</div>
        </div>
        <div className="orientation-block">
          <div className="eyebrow">Why now</div>
          <div className="orientation-value">{detail.orientation.why_now}</div>
        </div>
        <div className="orientation-block">
          <div className="eyebrow">Next concrete action</div>
          <div className="orientation-value">{detail.orientation.next_action || "Review the active matter record."}</div>
        </div>
      </section>

      <section className="card workspace">
        <aside className="pane">
          <header className="pane-header">
            <div>
              <div className="pane-title">Matter records</div>
              <div className="small faint">{detail.work_items.filter((item) => item.status !== "done").length} open work items</div>
            </div>
          </header>
          <div className="pane-body">
            <MatterTree
              tree={detail.tree}
              activePath={activePath}
              onSelect={setActivePath}
              onUpload={upload}
              uploading={uploading}
            />
          </div>
        </aside>

        <section className="pane">
          <header className="pane-header">
            <div>
              <div className="pane-title">Copilot & action feed</div>
              <div className="small faint">Direct answer · bounded tool loop</div>
            </div>
          </header>
          <div className="pane-body">
            <ChatPanel
              matterId={detail.matter_id}
              matterTitle={detail.title}
              activeFile={activePath}
              onRefresh={onReload}
            />
          </div>
        </section>

        <section className="pane">
          <header className="pane-header">
            <div style={{ minWidth: 0 }}>
              <div className="pane-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {activePath?.split("/").at(-1) ?? "Document workspace"}
              </div>
              <div className="small faint">Formatted drafting · Markdown source · original files</div>
            </div>
          </header>
          <div className="pane-body">
            <DocumentPanel activePath={activePath} onUpload={upload} />
          </div>
        </section>
      </section>
    </>
  );
}
