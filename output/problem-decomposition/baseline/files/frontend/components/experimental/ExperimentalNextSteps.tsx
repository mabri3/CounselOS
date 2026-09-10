"use client";

import styles from "./ExperimentalChat.module.css";
import { matterNextSteps } from "./nextSteps";
import type { MatterDetail } from "@/lib/types";
import type { WorkspaceSnapshot } from "@/lib/workspaceTypes";

export default function ExperimentalNextSteps({ matter, workspace, disabled, onChoose }: { matter: MatterDetail | null; workspace: WorkspaceSnapshot | null; disabled: boolean; onChoose: (message: string) => Promise<void> }) {
  const options = matterNextSteps(matter, workspace);
  if (!options.length) return null;
  return <section className={styles.nextSteps} aria-label="Next steps">
    <h2>Next steps for this matter</h2>
    <p>From the saved matter summary and unfinished work. Choose a step, or tell me in your own words.</p>
    <div className={styles.nextStepOptions}>{options.map(option => <button type="button" key={option.id} className={styles.choiceButton} disabled={disabled} onClick={() => void onChoose(option.message)}>
      <span><strong>{option.label}</strong><small>{option.detail}</small></span><span aria-hidden="true">→</span>
    </button>)}</div>
  </section>;
}
