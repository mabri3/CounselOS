"use client";

import { use } from "react";
import styles from "@/components/WatchesPhase2.module.css";
import AppShell from "@/components/AppShell";
import WatchBuilder from "@/components/WatchBuilder";

export default function WatchPage({ params }: { params: Promise<{ watchId: string }> }) {
  const { watchId } = use(params);
  return <AppShell><main className={styles.page}><WatchBuilder presentation="phase2" watchId={watchId} /></main></AppShell>;
}
