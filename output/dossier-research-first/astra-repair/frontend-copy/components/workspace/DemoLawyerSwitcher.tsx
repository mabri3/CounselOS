"use client";

import type { DemoLawyerSwitcherProps } from "@/lib/continuityTypes";

export default function DemoLawyerSwitcher({ roster, actor, busy = false, onSwitch }: DemoLawyerSwitcherProps) {
  const people = roster.people ?? [];
  if (!roster.enabled || people.length === 0) return null;
  return <section className="demo-lawyer-switcher" aria-labelledby="demo-lawyer-title">
    <style>{css}</style>
    <div><p className="eyebrow">Local demo</p><h2 id="demo-lawyer-title">View as</h2></div>
    <label className="sr-only" htmlFor="demo-lawyer-person">View workspace as</label>
    <select id="demo-lawyer-person" className="select-input" value={actor.person_id} disabled={busy} onChange={(event) => void onSwitch(event.target.value)}>
      {people.map((person) => <option key={person.person_id} value={person.person_id}>{person.display_name}{person.specialty ? ` · ${person.specialty}` : ""} · {person.person_id}</option>)}
    </select>
    <details className="demo-lawyer-switcher__help">
      <summary>About</summary>
      <p className="small muted">This changes the local demo view. It is not a sign-in or access control.</p>
    </details>
  </section>;
}

const css = `
.demo-lawyer-switcher { position:relative; min-width:0; flex:none; display:grid; grid-template-columns:auto minmax(130px, 170px) auto; align-items:center; gap:6px; padding:4px 6px; border:1px solid var(--line); border-radius:var(--radius); background:var(--raised); }
.demo-lawyer-switcher h2 { margin:1px 0 0; font:600 13px/1.1 var(--sans); }
.demo-lawyer-switcher p { margin:0; }
.demo-lawyer-switcher .eyebrow { font-size:9px; line-height:1.1; }
.demo-lawyer-switcher .select-input { min-width:0; width:100%; padding:6px 8px; }
.demo-lawyer-switcher__help { position:relative; }
.demo-lawyer-switcher__help summary { cursor:pointer; color:var(--ink-3); font:500 12px var(--sans); }
.demo-lawyer-switcher__help p { position:absolute; right:0; top:calc(100% + 7px); z-index:1; width:230px; padding:9px 10px; border:1px solid var(--line); border-radius:var(--radius); background:var(--raised); box-shadow:0 5px 14px rgba(27,26,23,.12); }
@media (max-width: 820px) { .demo-lawyer-switcher { grid-template-columns:auto minmax(96px, 130px) auto; gap:4px; padding:3px 5px; } .demo-lawyer-switcher h2 { font-size:12px; } .demo-lawyer-switcher .eyebrow { font-size:8px; } .demo-lawyer-switcher__help summary { font-size:11px; } }
@media (max-width: 620px) { .demo-lawyer-switcher { grid-template-columns:auto minmax(88px, 102px) 14px; gap:3px; padding:3px 4px; } .demo-lawyer-switcher h2 { font-size:10px; } .demo-lawyer-switcher .eyebrow { font-size:8px; } .demo-lawyer-switcher .select-input { padding:5px 4px; font-size:12px; } .demo-lawyer-switcher__help summary { width:14px; font-size:0; line-height:1; } .demo-lawyer-switcher__help summary::after { content:"?"; font-size:12px; } }
`;
