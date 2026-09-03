"use client";

import { useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import MatterWorkspace from "@/components/MatterWorkspace";
import { getMatter } from "@/lib/api";
import { createLatestRequestLoader } from "@/lib/latestRequest";
import type { MatterDetail } from "@/lib/types";

export default function MatterPage({ params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = use(params);
  const searchParams = useSearchParams();
  const initialPath = searchParams.get("file");
  const focusResearch = searchParams.get("focus") === "research";
  const [detail, setDetail] = useState<MatterDetail | null>(null);
  const [error, setError] = useState("");

  const latestMatterLoader = useMemo(() => createLatestRequestLoader(
    () => getMatter(matterId),
    (saved) => { setDetail(saved); setError(""); },
    (caught) => setError(caught instanceof Error ? caught.message : "Could not load the matter."),
  ), [matterId]);
  const load = useCallback(async () => { await latestMatterLoader(); }, [latestMatterLoader]);

  useEffect(() => { setDetail(null); void load().catch(() => {}); }, [load]);

  if (error && !detail) {
    return <AppShell><main className="page"><p className="error">{error}</p></main></AppShell>;
  }
  if (!detail) {
    return <AppShell><main className="page"><div className="loading">Orienting to the matter…</div></main></AppShell>;
  }
  return (
    <AppShell>
      <MatterWorkspace detail={detail} focusResearch={focusResearch} initialPath={initialPath} onReload={load} />
    </AppShell>
  );
}
