const paths: Record<string, string> = {
  Today: "M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9",
  Briefing: "M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7",
  Workspace: "M3 7h7l2-3h9v16H3z",
  Matters: "M3 6h7l2 3h9v11H3z",
  Decisions: "M12 3v18M7 21h10M4 7h16M6 7l-4 8h8zM18 7l-4 8h8z",
  Skills: "m2 8 10-5 10 5-10 5zM6 10v7l6 3 6-3v-7M22 8v8",
  "Experimental chat": "M4 5h16v11H7l-3 3zM8 9h8M8 12h5",
  Automations: "m13 2-9 12h7l-1 8 10-13h-7z",
  Agents: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 22v-3a8 8 0 0 1 16 0v3",
  Settings: "M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1zM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
};
export default function Phase2Icon({ name, size = 21 }: { name: string; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name] ?? paths.Briefing} /></svg>;
}
