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
  const [detail, setDetail] = useState<MatterDetail | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try { setError(""); setDetail(await getMatter(matterId)); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load the matter."); }
  }, [matterId]);

  useEffect(() => { void load(); }, [load]);

  return (
    <AppShell>
      <main className="page">
        {error ? <div className="card empty-state error">{error}</div> : null}
        {!detail && !error ? <div className="loading">Orienting to the matter…</div> : null}
        {detail ? <MatterWorkspace detail={detail} initialPath={initialPath} onReload={load} /> : null}
      </main>
    </AppShell>
  );
}
