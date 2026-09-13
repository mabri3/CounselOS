import { $getRoot } from "lexical";

export function isModifiedDocumentEnd(event: Pick<KeyboardEvent, "key" | "altKey" | "ctrlKey" | "metaKey">): boolean {
  return event.key === "End" && !event.altKey && (event.ctrlKey || event.metaKey);
}

export function moveSelectionToDocumentEnd(): void {
  $getRoot().selectEnd();
}
