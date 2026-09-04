"use client";

import { useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import DataLoadStatus from "@/components/DataLoadStatus";
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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const loadGeneration = useRef(0);

  const latestMatterLoader = useMemo(() => createLatestRequestLoader(
    () => getMatter(matterId),
    (saved) => { setDetail(saved); setLoadError(""); },
    () => setLoadError("This matter is unavailable because its current data could not be loaded."),
  ), [matterId]);
  const load = useCallback(async () => {
    const generation = ++loadGeneration.current;
    setLoading(true); setLoadError("");
    try { await latestMatterLoader(); }
    finally {
      if (generation === loadGeneration.current) setLoading(false);
    }
  }, [latestMatterLoader]);

  useEffect(() => { setDetail(null); void load().catch(() => {}); }, [load]);

  if (!detail) {
    return <AppShell><main className="page"><DataLoadStatus error={loadError} loading={loading} loadingLabel="Orienting to the matter…" onRetry={load} /></main></AppShell>;
  }
  return (
    <AppShell>
      <div style={{ padding: "0 28px" }}><DataLoadStatus error={loadError} loading={loading} loadingLabel="Refreshing the matter…" onRetry={load} /></div>
      <MatterWorkspace detail={detail} focusResearch={focusResearch} initialPath={initialPath} onReload={load} />
    </AppShell>
  );
}
