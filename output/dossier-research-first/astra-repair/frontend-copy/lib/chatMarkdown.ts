/** Separate standalone bold section labels in chat without rewriting stored prose. */
export function separateChatSections(text: string): string {
  let fence: { marker: string; length: number } | null = null;
  return text.split('\n').map(line => {
    const boundary = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (boundary) {
      if (!fence) fence = { marker: boundary[1][0], length: boundary[1].length };
      else if (boundary[1][0] === fence.marker && boundary[1].length >= fence.length && !boundary[2].trim()) fence = null;
      return line;
    }
    if (!fence && /^\*\*[^*\n]+\*\*[ \t]*$/.test(line)) return `\n${line}\n`;
    return line;
  }).join('\n');
}
