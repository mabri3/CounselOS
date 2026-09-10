import Link from "next/link";
import { STAGES, matterIsAgentWorking } from "@/lib/design";
import type { Decision, Matter } from "@/lib/types";
import styles from "./TodayPhase2.module.css";
export default function PracticeRail({ matters, decisions }: { matters: Matter[]; decisions: Decision[] }) {
  const open = matters.filter(matter => matter.status !== "closed");
  const withThemis = open.filter(matter => matterIsAgentWorking(matter) || matter.work_state.next_actor === "themis").length;
  return <section className={styles.practice} aria-labelledby="practice-title">
    <h2 id="practice-title">The practice</h2>
    <div className={styles.practicePanel}>
      <div className={styles.stages}>{STAGES.map(stage => <div key={stage.id}><span>{stage.label}</span><strong>{matters.filter(matter => matter.status === stage.id).length}</strong></div>)}</div>
      <div className={styles.practiceFacts}><div><span>In flight</span><strong>{open.length} <small>matters</small></strong></div><div><span>Decisions recorded</span><strong>{decisions.length} <small>recorded</small></strong></div></div>
    </div>
    <div className={styles.agentActivity}><span className={styles.spark}>✧</span><div><span className={styles.eyebrow}>Themis.ai work</span><p>{withThemis ? `${withThemis} ${withThemis === 1 ? "matter is" : "matters are"} with Themis.ai.` : "Nothing is with Themis.ai right now."}</p><Link href="/agents">View all agents →</Link></div></div>
    <Link className={styles.textAction} href="/workspace">Open the workspace →</Link>
  </section>;
}
