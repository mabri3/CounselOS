"use client";

import styles from "./ExperimentalChat.module.css";

const options = [
  { label: "Get a quick answer with support", detail: "A concise view, linked sources, and key unknowns.", message: "Give me a quick answer with support for this matter, using the saved intake. Link sources beside the claims they support and state the key unknowns." },
  { label: "Explore the affected laws", detail: "Work through the relevant rules and how they apply.", message: "Explore the affected laws for this matter using the saved intake. Start with the most material issue, explain how the rules apply, and link the supporting sources." },
  { label: "Create a document", detail: "Prepare a memo, email, or another work product.", message: "Help me create a document from this matter using the saved intake and existing templates. If the document type or audience is unclear, ask me to choose before drafting." },
];

export default function ExperimentalNextSteps({ disabled, onChoose }: { disabled: boolean; onChoose: (message: string) => Promise<void> }) {
  return <section className={styles.nextSteps} aria-label="Next steps">
    <h2>What would you like to do next?</h2>
    <p>Choose an option, or tell me in your own words.</p>
    <div className={styles.nextStepOptions}>{options.map(option => <button type="button" key={option.label} className={styles.choiceButton} disabled={disabled} onClick={() => void onChoose(option.message)}>
      <span><strong>{option.label}</strong><small>{option.detail}</small></span><span aria-hidden="true">→</span>
    </button>)}</div>
  </section>;
}
