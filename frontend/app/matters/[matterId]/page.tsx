"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import MatterWorkspace from "@/components/MatterWorkspace";
import { getMatter } from "@/lib/api";
import type { MatterDetail } from "@/lib/types";

export default function MatterPage() {
  const params = useParams<{ matterId: string }>();
  const searchParams = useSearchParams();
  const matterId = params.matterId;
  const initialPath = searchParams.get("file");
  const focusResearch = searchParams.get("focus") === "research";
  const [detail, setDetail] = useState<MatterDetail | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try { setError(""); setDetail(await getMatter(matterId)); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load the matter."); }
  }, [matterId]);

  useEffect(() => { void load(); }, [load]);

  if (error) {
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
