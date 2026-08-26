"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import AttentionStrip from "@/components/AttentionStrip";
import KanbanBoard from "@/components/KanbanBoard";
import NewMatterForm from "@/components/NewMatterForm";
import { createMatter, getDecisions, getMatters, moveMatter, runResearch } from "@/lib/api";
import type { Matter, Stage } from "@/lib/types";

export default function CommandCenterPage() {
  const router = useRouter();
  const [matters, setMatters] = useState<Matter[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [staleCount, setStaleCount] = useState(0);
  const [busyMatter, setBusyMatter] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [matterData, decisionData] = await Promise.all([getMatters(), getDecisions()]);
      setMatters(matterData.matters);
      setStages(matterData.stages);
      setStaleCount(decisionData.decisions.filter((decision) => decision.review_status !== "fresh").length);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load the command center.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <AppShell>
      <main className="page">
        <div className="page-header">
          <div>
            <div className="eyebrow">Legal work orchestration</div>
            <h1>What needs counsel judgment next?</h1>
            <p className="muted">The board moves work from raw request to researched, organized, decision-ready output.</p>
          </div>
          <NewMatterForm
            busy={creating}
            onCreate={async (payload) => {
              setCreating(true);
              try { await createMatter(payload); await load(); }
              finally { setCreating(false); }
            }}
          />
        </div>
        <AttentionStrip staleCount={staleCount} />
        {error ? <p className="error">{error}</p> : null}
        {stages.length === 0 && !error ? <div className="loading">Loading legal workflow…</div> : null}
        {stages.length > 0 ? (
          <KanbanBoard
            matters={matters}
            stages={stages}
            busyMatter={busyMatter}
            onMove={async (matterId, stage) => {
              setBusyMatter(matterId);
              try { await moveMatter(matterId, stage, "Moved on the command center"); await load(); }
              finally { setBusyMatter(null); }
            }}
            onResearch={async (matterId) => {
              setBusyMatter(matterId);
              try {
                const result = await runResearch(matterId);
                router.push(`/matters/${encodeURIComponent(matterId)}?file=${encodeURIComponent(result.path)}`);
              }
              finally { setBusyMatter(null); }
            }}
          />
        ) : null}
      </main>
    </AppShell>
  );
}
