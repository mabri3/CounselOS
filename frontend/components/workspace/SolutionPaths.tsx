"use client";
import ReactMarkdown from "react-markdown";
import styles from "./SolutionPaths.module.css";
import SavedSourcePassage from "./SavedSourcePassage";
import { useEffect, useState } from "react";
import { getSolutionPaths, actOnSolutionPath } from "@/lib/workspaceApi";
import { request } from "@/lib/api";
import type { SolutionPath, SolutionPathState } from "@/lib/workspaceTypes";

export default function SolutionPaths({matterId, conversationId, workingPathId, refresh, disabled = false, onSelect, onCompare}: {matterId:string; conversationId?:string|null; workingPathId?:string|null; refresh?:number; disabled?:boolean; onSelect:(id:string,isMainline?:boolean)=>void; onCompare?:(ids:string[],titles:string[])=>void}) {
 const [saved,setSaved]=useState<SolutionPathState|null>(null);
 const [error,setError]=useState(""); const [notice,setNotice]=useState(""); const [busy,setBusy]=useState(false);
 const [note,setNote]=useState<{warning?:string;payload?:{current_task:string;next_action:string;findings?:{text:string;status:string}[];open_items?:{text:string}[];pending_effects?:{text:string}[]}}|null>(null); const [comparison,setComparison]=useState<{title:string;conditions:string[];assumptions:{text:string}[]}[]>([]); const [selected,setSelected]=useState<string[]>([]);
 const load=()=>getSolutionPaths(matterId,conversationId).then(value=>{setSaved(value);const isMainline=value.working_path_id===value.state.mainline_path_id;if(value.working_path_id && (isMainline ? Boolean(workingPathId) : value.working_path_id!==workingPathId))onSelect(value.working_path_id,isMainline);}).catch(e=>setError(e.message));
 useEffect(()=>{void load();},[matterId,conversationId,workingPathId,refresh]);
 async function act(action:string,path:SolutionPath) { if(!saved || disabled)return false;setBusy(true);setError("");try {
  const values=action==="select_working_path"?{path_id:path.scenario_id}:action==="archive_path"?{path_id:path.scenario_id,expected_path_revision:path.revision}:{path_id:path.scenario_id,expected_path_revision:path.revision,expected_mainline_revision:saved.state.revision};
  const result=await actOnSolutionPath(matterId,action,values,conversationId);
  if(result.data.state==="conflict"){
   const latest=await getSolutionPaths(matterId,conversationId);setSaved(latest);
   const current=latest.paths.find(item=>item.scenario_id===path.scenario_id);if(current)await view(current);
   setNotice("This approach changed. Review the updated details before trying again.");return false;
  }
  else {setNotice(action==="select_working_path"?"Working path selected.":`Saved. Dossier: ${projectionLabel(result.data.projection_state)}.`);if(action!=="archive_path")onSelect(path.scenario_id,action==="promote_path" || action==="restore_path" || path.scenario_id===saved.state.mainline_path_id);}
  await load();return true;
 }catch(e){setError(e instanceof Error?e.message:"Path action failed.");return false;}finally{setBusy(false);}}
 const projectionLabel=(value:string|undefined|null)=>({applied:"updated",review_required:"review needed",pending:"update pending",historical:"historical update",not_required:"unchanged"}[value??""] ?? "unchanged");
 const [renaming,setRenaming]=useState(false); const [titleDraft,setTitleDraft]=useState("");
 const [viewed,setViewed]=useState<SolutionPath|null>(null);
 const [description,setDescription]=useState<{hypothesis_summary?:string;analysis?:string;proposed_fact_changes?:{text:string}[]}|null>(null);
 async function view(path:SolutionPath) {
  setRenaming(false);setTitleDraft(path.title);setViewed(path);setDescription(null);setNote(null);setError("");setNotice("");
  try {
   const detail=await request<{revision:string;unresolved_conditions:string[];hypothesis_summary?:string;analysis?:string;proposed_fact_changes?:{text:string}[]}>(`/matters/${encodeURIComponent(matterId)}/workspace/scenarios/${encodeURIComponent(path.scenario_id)}`);
   setDescription(detail);setViewed({...path,revision:detail.revision,unresolved_conditions:detail.unresolved_conditions});
  }
  catch(e){setError(e instanceof Error?e.message:"Details unavailable.");}
 }
 async function rename() {
  if(!viewed || busy || disabled || !titleDraft.trim())return;
  setBusy(true);setError("");
  try {
   await actOnSolutionPath(matterId,"update_path",{path_id:viewed.scenario_id,expected_path_revision:viewed.revision,title:titleDraft.trim()},conversationId);
   const latest=await getSolutionPaths(matterId,conversationId);setSaved(latest);
   const updated=latest.paths.find(p=>p.scenario_id===viewed.scenario_id);
   if(updated)await view(updated);
   setNotice("Approach renamed.");
  }catch(e){setError(e instanceof Error?e.message:"Rename failed. Reopen Details and try again.");}
  finally{setBusy(false);}
 }
 const paths=[...(saved?.paths ?? [])].sort((a,b)=>Number(b.role==="mainline")-Number(a.role==="mainline"));
 const comparisonIds=selected.filter(id=>paths.some(p=>p.scenario_id===id));
 function toggle(id:string) {setSelected(comparisonIds.includes(id)?comparisonIds.filter(p=>p!==id):[...comparisonIds,id]);}
 return <details className={styles.panel} name="experimental-tools" onToggle={e=>{if(e.target===e.currentTarget && e.currentTarget.open)void load();}}><summary>Approaches</summary>
 {error&&<p role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}
 {!viewed ? <div className={styles.overview}>
 <p className={styles.hint}>{paths.length<2 ? "Explore an alternative in chat to compare it with your current approach." : "Choose approaches to compare. Open Details to change your current approach."}</p>
 <div className={styles.choices}>{paths.map(path=><div className={styles.choice} key={path.scenario_id}>
 <label className={styles.selection}><input type="checkbox" checked={comparisonIds.includes(path.scenario_id)} onChange={()=>toggle(path.scenario_id)}/><span>{path.title}<small>{path.role==="mainline"?"Current approach":"Alternative"}</small></span></label>
 <button className={styles.detailButton} disabled={busy || disabled} aria-label={`Details for ${path.title}`} onClick={()=>void view(path)}>Details</button>
 </div>)}</div>
 <button className={styles.compare} disabled={comparisonIds.length<2 || busy || disabled} onClick={event=>{if(onCompare){onCompare(comparisonIds,comparisonIds.map(id=>paths.find(p=>p.scenario_id===id)!.title));event.currentTarget.closest("details")?.removeAttribute("open");}else void actOnSolutionPath(matterId,"compare_paths",{path_ids:comparisonIds},conversationId).then(result=>setComparison((result.data as unknown as {paths:{title:string;conditions:string[];assumptions:{text:string}[]}[]}).paths)).catch(e=>setError(e.message));}}>Compare these approaches</button>
 {comparison.length>0&&<section aria-label="Selected path comparison">{comparison.map((p,i)=><div key={i}><h4>{i+1}. {p.title}</h4>{p.assumptions.map((a,j)=><p key={j}>{a.text}</p>)}{p.conditions.map((c,j)=><p key={j}>Open question: {c}</p>)}</div>)}</section>}
 </div> : <div className={styles.detail}>
 <button onClick={()=>{setViewed(null);setNote(null);}}>← All approaches</button>
 <h3>{viewed.title}</h3>
 {renaming ? <form className={styles.rename} onSubmit={e=>{e.preventDefault();void rename();}}>
 <label>Approach name<input value={titleDraft} maxLength={200} onChange={e=>setTitleDraft(e.target.value)} autoFocus disabled={busy || disabled}/></label>
 <button disabled={busy || disabled || !titleDraft.trim()}>Save name</button>
 <button type="button" disabled={busy} onClick={()=>setRenaming(false)}>Cancel</button>
 </form> : <button disabled={busy || disabled} onClick={()=>setRenaming(true)}>Rename approach</button>}
 <p>{viewed.role==="mainline" ? "This is your current approach." : "This is an alternative for discussion. Its assumptions are not recorded facts."}</p>
 <div className={styles.pathActions} aria-label="Approach actions">
 <button disabled={busy || disabled} onClick={()=>void act("select_working_path",viewed)}>Discuss this approach</button>
 {viewed.role!=="mainline"&&<><p>Making this current keeps the previous approach available as an alternative. It does not confirm assumptions or record a formal decision.</p><button disabled={busy || disabled} onClick={()=>void act("promote_path",viewed).then(ok=>{if(ok)setViewed(null);})}>Make this our current approach</button></>}
 </div>
 {description===null ? <p>Loading details…</p> : <>
 {description.hypothesis_summary ? <p>{description.hypothesis_summary}</p> : description.analysis ? <ReactMarkdown>{description.analysis}</ReactMarkdown> : <p>No summary has been saved yet. Ask Themis to develop this approach.</p>}
 {!!description.proposed_fact_changes?.length && <><h4>What changes</h4><ul>{description.proposed_fact_changes.map((a,i)=><li key={i}>{a.text}</li>)}</ul></>}
 </>}
 {!!viewed.unresolved_conditions.length&&<><h4>Open questions</h4><ul>{viewed.unresolved_conditions.map((c,i)=><li key={i}>{c}</li>)}</ul></>}
 <details className={styles.more}><summary>More options</summary>
 {viewed.role!=="mainline"&&<button disabled={busy || disabled} onClick={()=>void act("archive_path",viewed).then(ok=>{if(ok)setViewed(null);})}>Archive this alternative</button>}
 <button onClick={()=>void request<NonNullable<typeof note>>(`/matters/${encodeURIComponent(matterId)}/workspace/paths/${encodeURIComponent(viewed.scenario_id)}/memory`).then(setNote).catch(e=>setError(e.message))}>View saved working note</button>
 <SavedSourcePassage matterId={matterId}/>
 {note!==null&&<section aria-label="Saved working note"><p>Saved guidance for continuing this discussion.</p>{note.warning&&<p>{note.warning}</p>}{note.payload ? <><p>{note.payload.current_task}</p><h4>Next step</h4><p>{note.payload.next_action}</p>{note.payload.findings?.map((f,i)=><p key={i}>{f.text} ({f.status})</p>)}{[...(note.payload.open_items??[]),...(note.payload.pending_effects??[])].map((item,i)=><p key={i}>{item.text}</p>)}</> : <p>No working note is available for this approach.</p>}</section>}
 </details></div>}
 </details>;
}
