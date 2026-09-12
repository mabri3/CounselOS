export type MarkdownSection = { text: string; summary?: string };

/** Remove application markers from parsed HTML only, never code or saved text. */
export function hideDossierMarkers() {
  type MarkdownNode = { type: string; value?: string; children?: MarkdownNode[] };
  return function visit(node: MarkdownNode): void {
    if (node.type === 'html' && node.value) {
      node.value = node.value.replace(/<!-- (?:issue:ISS-[A-Za-z0-9_-]+|alternative:SCN-[A-Za-z0-9_-]+|retained-issue:ISS-[A-Za-z0-9_-]+:(?:start|end)|saved-issue-analysis:(?:start|end)) -->/g, '');
    }
    node.children?.forEach(visit);
  };
}

/** Support plain Markdown disclosures without enabling arbitrary HTML. */
export function markdownDisclosures(text: string): MarkdownSection[] {
  const lines = text.split('\n');
  const sections: MarkdownSection[] = [];
  let start = 0;
  let opening = -1;
  let depth = 0;
  let summary = '';
  let fence: { marker: string; length: number } | null = null;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const boundary = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (boundary) {
      if (!fence) fence = { marker: boundary[1][0], length: boundary[1].length };
      else if (boundary[1][0] === fence.marker && boundary[1].length >= fence.length && !boundary[2].trim()) fence = null;
      continue;
    }
    if (fence) continue;
    if (line === '<details>') {
      if (depth) { depth++; continue; }
      const label = lines[index + 1]?.match(/^<summary>([^\n]*)<\/summary>$/);
      if (!label) continue;
      opening = index;
      summary = label[1].replace(/&(amp|lt|gt|quot|#x27);/g, (_, entity: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#x27': "'" })[entity] || '');
      depth = 1;
      index++;
    } else if (line === '</details>' && depth) {
      depth--;
      if (depth) continue;
      if (opening > start) sections.push({ text: lines.slice(start, opening).join('\n') });
      sections.push({ summary, text: lines.slice(opening + 2, index).join('\n') });
      start = index + 1;
      opening = -1;
    }
  }
  if (start < lines.length) sections.push({ text: lines.slice(start).join('\n') });
  return sections;
}
