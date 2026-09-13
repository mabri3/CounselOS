export function normalizeSavedMarkdown(content: string): string {
  return content.replace(/\r?\n$/, "");
}

export function savedMarkdownMatches(submitted: string, canonical: string): boolean {
  return normalizeSavedMarkdown(submitted) === normalizeSavedMarkdown(canonical);
}
