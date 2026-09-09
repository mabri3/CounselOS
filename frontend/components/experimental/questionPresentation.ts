type Question = { text: string; choices: { label: string }[] };

function plainLabel(line: string): string {
    const trimmed = line.trim();
    return trimmed.startsWith("**") && trimmed.endsWith("**")
        ? trimmed.slice(2, -2).trim() : trimmed;
}

/** Hide only a complete, matching trailing question already shown by a card. */
export function proseWithoutRepeatedQuestion(text: string, questions: Question[]): string {
    for (const question of questions) {
        const lines = text.split("\n");
        const nonempty = lines.map((line, index) => ({ line, index })).filter(item => item.line.trim());
        const count = question.choices.length;
        const candidate = nonempty[nonempty.length - count - 1];
        if (count && candidate && plainLabel(candidate.line) === question.text.trim()) {
            const choices = nonempty.slice(-count);
            const matches = choices.every((item, index) => {
                const bullet = item.line.trim().match(/^(?:[-*+] |\d+[.)] )(.+)$/);
                return bullet && plainLabel(bullet[1]) === question.choices[index].label.trim();
            });
            // Never rewrite a fenced example, source annotation, or a partial match.
            if (matches && !lines.slice(0, candidate.index + 1).some(line => /^\s*(```|~~~)/.test(line))) {
                text = lines.slice(0, candidate.index).join("\n").trimEnd();
                continue;
            }
        }
        const last = nonempty.at(-1);
        if (last && plainLabel(last.line) === question.text.trim()
            && !lines.some(line => /^\s*(```|~~~)/.test(line))) {
            text = lines.slice(0, last.index).join("\n").trimEnd();
        }
    }
    return text;
}
