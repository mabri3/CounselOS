"use client";
import SavedSourcePassage from "./SavedSourcePassage";
import { useEffect, useState } from "react";
import { getSolutionPaths, actOnSolutionPath } from "@/lib/workspaceApi";
import { request } from "@/lib/api";
import type { SolutionPath, SolutionPathState } from "@/lib/workspaceTypes";

export default function SolutionPaths({matterId, conversationId, workingPathId, onSelect, onCompare}: {matterId:string; conversationId?:string|null; workingPathId?:string|null; onSelect:(id:string,isMainline?:boolean)=>void; onCompare?:(ids:string[])=>void}) {
 const [saved,setSaved]=useState<SolutionPathState|null>(null);
 const [error,setError]=useState(""); const [notice,setNotice]=useState(""); const [busy,setBusy]=useState(false);
 const [note,setNote]=useState<unknown>(null); const [comparison,setComparison]=useState<{title:string;conditions:string[];assumptions:{text:string}[]}[]>([]); const [selected,setSelected]=useState<string[]>([]);
 const load=()=>getSolutionPaths(matterId,conversationId).then(value=>{setSaved(value);if(value.working_path_id && (value.working_path_id!==workingPathId || value.working_path_id===value.state.mainline_path_id))onSelect(value.working_path_id,value.working_path_id===value.state.mainline_path_id);}).catch(e=>setError(e.message));
 useEffect(()=>{void load();},[matterId,conversationId,workingPathId]);
 async function act(action:string,path:SolutionPath) { if(!saved)return;setBusy(true);setError("");try {
  const values=action==="select_working_path"?{path_id:path.scenario_id}:action==="archive_path"?{path_id:path.scenario_id,expected_path_revision:path.revision}:{path_id:path.scenario_id,expected_path_revision:path.revision,expected_mainline_revision:saved.state.revision};
  const result=await actOnSolutionPath(matterId,action,values,conversationId);
  if(result.data.state==="conflict")setNotice("Changed elsewhere. Review the current direction.");
  else {setNotice(action==="select_working_path"?"Working path selected.":`Saved. Dossier: ${projectionLabel(result.data.projection_state)}.`);if(action!=="archive_path")onSelect(path.scenario_id,action==="promote_path" || action==="restore_path" || path.scenario_id===saved.state.mainline_path_id);}
  await load();
 }catch(e){setError(e instanceof Error?e.message:"Path action failed.");}finally{setBusy(false);}}
 const projectionLabel=(value:string|undefined|null)=>({applied:"updated",review_required:"review needed",pending:"update pending",historical:"historical update",not_required:"unchanged"}[value??""] ?? "unchanged");
 const main=saved?.paths.find(p=>p.role==="mainline");
 return <details name="experimental-tools" onToggle={e=>{if(e.currentTarget.open)void load();}}><summary>Solution paths — {main?.title ?? "No saved direction yet"}</summary>
 <p>Current direction: {main?.title ?? "Not yet developed"}. Working on: {saved?.paths.find(p=>p.scenario_id===(saved?.working_path_id ?? workingPathId))?.title ?? main?.title ?? "Current matter"}.</p>
 {saved?.projection_state && <p>Dossier: {projectionLabel(saved.projection_state)}.</p>}
 <p>Path assumptions remain hypothetical. Selection does not record a formal decision.</p>
 {error&&<p role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}
 {saved?.paths.map(path=><section key={path.scenario_id}><label><input type="checkbox" checked={selected.includes(path.scenario_id)} onChange={e=>setSelected(old=>e.target.checked?[...old,path.scenario_id]:old.filter(id=>id!==path.scenario_id))}/>{path.title}{saved.paths.filter(p=>p.title===path.title).length>1 ? ` (${path.scenario_id.slice(-6)})` : ""} — {path.role==="mainline"?"Current direction":"Alternative"}</label>
 {path.unresolved_conditions.map((c,i)=><p key={i}>Pending: {c}</p>)}
 <button disabled={busy} onClick={()=>void act("select_working_path",path)}>Work on this path</button>
 {path.role!=="mainline"&&<><button disabled={busy} onClick={()=>void act("promote_path",path)}>Use as direction</button><button disabled={busy} onClick={()=>void act("restore_path",path)}>Restore this direction</button><button disabled={busy} onClick={()=>void act("archive_path",path)}>Archive alternative</button></>}
 <button onClick={()=>void request(`/matters/${encodeURIComponent(matterId)}/workspace/paths/${encodeURIComponent(path.scenario_id)}/memory`).then(setNote).catch(e=>setError(e.message))}>Working note details</button></section>)}
 <button disabled={selected.length<2} onClick={()=>{if(onCompare)onCompare(selected);else void actOnSolutionPath(matterId,"compare_paths",{path_ids:selected},conversationId).then(result=>setComparison((result.data as unknown as {paths:{title:string;conditions:string[];assumptions:{text:string}[]}[]}).paths)).catch(e=>setError(e.message));}}>Compare selected paths</button>
 {comparison.length>0&&<section aria-label="Selected path comparison">{comparison.map((p,i)=><div key={i}><h4>{i+1}. {p.title}</h4>{p.assumptions.map((a,j)=><p key={j}>Assumption: {a.text}</p>)}{p.conditions.map((c,j)=><p key={j}>Pending: {c}</p>)}</div>)}</section>}
 <SavedSourcePassage matterId={matterId} />
 {note!==null&&<details open><summary>Generated working guidance</summary><pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(note,null,2)}</pre></details>}
 </details>;
}
