export function questionProgressLabel(current?: number | null, total?: number | null): string {
  return typeof current === "number" && typeof total === "number"
    && Number.isInteger(current) && Number.isInteger(total) && current >= 1 && total >= current
    ? `${current} of ${total}`
    : "Follow-up";
}

export function effectiveQuestionMode(
  selectionMode: "single" | "multiple" | "free_text",
  choiceCount: number,
): "single" | "multiple" | "free_text" {
  return selectionMode !== "free_text" && choiceCount === 0 ? "free_text" : selectionMode;
}

export function choiceNeedsDetail(value: string, label: string): boolean {
  const normalizedValue = value.trim().toLowerCase();
  const normalizedLabel = label.trim().toLowerCase();
  return ["partly", "other", "change"].includes(normalizedValue)
    || /^(?:partly|something else|other)\b/.test(normalizedLabel);
}

export function questionModeStorageKey(matterId: string): string {
  return `themis.ai:question-mode:${matterId}`;
}

export function legacyQuestionModeStorageKey(matterId: string): string {
  return `counsel-os:question-mode:${matterId}`;
}

export function groupedAnswerText(
  questions: Array<{ question_id: string; text: string; choices: Array<{ value: string; label: string }> }>,
  answers: Record<string, { action: "answer" | "skip"; values: string[]; text: string }>,
  stopAfterAnswers = false,
): string {
  const lines = questions.map((question) => {
    const answer = answers[question.question_id];
    if (!answer || answer.action === "skip") return `- ${question.text}\n  Skipped`;
    const labels = answer.values.map((value) => question.choices.find((choice) => choice.value === value)?.label ?? value);
    return `- ${question.text}\n  ${answer.text || labels.join(", ")}`;
  });
  const instruction = stopAfterAnswers
    ? "Use these answers together, update the matter, and complete intake without asking more questions."
    : "Use these answers together, update the matter, and reprioritize any questions that remain.";
  return `Answers to the prioritized intake questions:\n${lines.join("\n")}\n\n${instruction}`;
}
