import styles from "@/components/WatchesPhase2.module.css";
import AppShell from "@/components/AppShell";
import WatchBuilder from "@/components/WatchBuilder";

export default function NewWatchPage() {
  return <AppShell><main className={styles.page}><WatchBuilder presentation="phase2" /></main></AppShell>;
}
