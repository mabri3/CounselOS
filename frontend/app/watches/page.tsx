"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import WatchList from "@/components/WatchList";
import { getWatches } from "@/lib/watchApi";
import type { Watch } from "@/lib/watchTypes";

export default function WatchesPage() {
  const [watches, setWatches] = useState<Watch[] | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try { setError(""); setWatches((await getWatches({ limit: 100 })).items); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load Watches."); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  return <AppShell><main className="page narrow">
    <WatchList error={error} watches={watches} />
  </main></AppShell>;
}
