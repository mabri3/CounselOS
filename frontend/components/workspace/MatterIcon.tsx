import type { CSSProperties } from "react";

export type MatterIconName = "book" | "chat" | "file" | "folder" | "map" | "sparkles" | "scale" | "user" | "history" | "search" | "eye" | "chevron" | "check";
const paths: Record<MatterIconName, string> = {
  book: "M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v15",
  chat: "M21 11a9 8 0 0 1-9 8H7l-5 3 2-6a8 8 0 0 1-1-5 9 8 0 0 1 18 0ZM7 11h.01M12 11h.01M17 11h.01",
  file: "M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8M8 16h8",
  folder: "M3 5h7l2 3h9v13H3V5Z",
  map: "M12 7v5M5 17v-5h14v5M9 2h6v5H9ZM2 17h6v5H2Zm14 0h6v5h-6Z",
  sparkles: "m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2ZM20 2v4M18 4h4",
  scale: "M12 3v18M7 21h10M4 7h16M6 7l-4 9h8L6 7Zm12 0-4 9h8l-4-9Z",
  user: "M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 22v-3a9 7 0 0 1 18 0v3H3Z",
  history: "M3 10a9 9 0 1 1 2 9M3 4v6h6M12 6v6l4 2",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 7 7",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Zm15 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  chevron: "m9 5 7 7-7 7",
  check: "m4 12 5 5L20 6",
};
export default function MatterIcon({ name, size = 22, className, style }: { name: MatterIconName; size?: number; className?: string; style?: CSSProperties }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ flexShrink: 0, ...style }}><path d={paths[name]} /></svg>;
}
