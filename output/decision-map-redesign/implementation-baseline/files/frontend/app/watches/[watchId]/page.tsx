"use client";

import { use } from "react";
import AppShell from "@/components/AppShell";
import WatchBuilder from "@/components/WatchBuilder";

export default function WatchPage({ params }: { params: Promise<{ watchId: string }> }) {
  const { watchId } = use(params);
  return <AppShell><main className="page narrow"><WatchBuilder watchId={watchId} /></main></AppShell>;
}
