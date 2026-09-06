"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "@/components/WatchesPhase2.module.css";
import AppShell from "@/components/AppShell";
import WatchList from "@/components/WatchList";
import { getWatches } from "@/lib/watchApi";
import type { Watch } from "@/lib/watchTypes";

export default function WatchesPage() {
  const [watches, setWatches] = useState<Watch[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setLoadError("");
    try { setWatches((await getWatches({ limit: 100 })).items); }
    catch { setLoadError("Watches are unavailable because their current data could not be loaded."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  return <AppShell><main className={styles.page}>
    <WatchList error={loadError} loading={loading} onRetry={load} watches={watches} />
  </main></AppShell>;
}
