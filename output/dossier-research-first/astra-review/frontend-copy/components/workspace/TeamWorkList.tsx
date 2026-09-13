"use client";

import type { TeamView, TeamWorkListProps } from "@/lib/continuityTypes";
import { TEAM_VIEW_LABELS } from "@/lib/teamPresentation";

const views = Object.keys(TEAM_VIEW_LABELS) as TeamView[];

export default function TeamWorkList({ items, view, loading = false, error, onViewChange, onOpenTarget }: TeamWorkListProps) {
  const visible = items.filter((item) => item.queue === view);
  return <section className="team-work" aria-labelledby="team-work-title">
    <style>{css}</style>
    <div className="team-work__header"><div><p className="eyebrow">Work</p><h2 id="team-work-title">Team work</h2></div>
      <fieldset className="segmented"><legend className="sr-only">Team work view</legend>{views.map((option) => <span className="segmented-option" key={option}><input className="segmented-input" type="radio" id={`team-view-${option}`} name="team-work-view" checked={view === option} onChange={() => onViewChange(option)} /><label htmlFor={`team-view-${option}`}>{TEAM_VIEW_LABELS[option]}</label></span>)}</fieldset>
    </div>
    {error ? <p className="team-work__notice failure" role="alert">Failed: {error}</p> : null}
    {loading ? <p className="muted" role="status">{visible.length ? "Refreshing team work… Current items remain visible." : "Loading team work…"}</p> : null}
    {visible.length ? <div className="team-work__rows">{visible.map((item) => <article className="team-work__row" key={item.item_id}>
      <div><p className="team-work__matter">{item.matter_title}</p><h3>{item.title}</h3><p className="small muted">{item.state} · {item.action.reason}</p>{item.action.owner_name ? <p className="small">Owner: {item.action.owner_name}</p> : null}</div>
      <button className="btn quiet compact" type="button" onClick={() => onOpenTarget(item.action.target)}>{item.action.label}</button>
    </article>)}</div> : !loading ? <p className="muted">No items in {TEAM_VIEW_LABELS[view].toLowerCase()}.</p> : null}
  </section>;
}

const css = `
.team-work { min-width: 0; display: grid; gap: 12px; }
.team-work__header { display: flex; align-items: end; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.team-work h2, .team-work h3, .team-work p { margin: 0; }
.team-work__rows { display: grid; gap: 8px; }
.team-work__row { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 13px 14px; border: 1px solid var(--line); border-radius: 8px; background: var(--raised); }
.team-work__row h3 { margin: 2px 0 5px; font: 600 16px/1.35 var(--sans); overflow-wrap: anywhere; }
.team-work__matter { font: 500 12.5px var(--sans); color: var(--ink-4); }
.team-work__notice { margin: 0; padding: 9px 11px; border-radius: 7px; }
.team-work__notice.failure { color: var(--failure); background: var(--failure-wash); border: 1px solid var(--failure-edge); }
@media (max-width: 620px) { .team-work__header { align-items: stretch; } .team-work__header .segmented { width: 100%; flex-wrap: wrap; } .team-work__header .segmented label { display: block; } .team-work__row { align-items: stretch; flex-direction: column; } .team-work__row .btn { width: 100%; } }
`;
