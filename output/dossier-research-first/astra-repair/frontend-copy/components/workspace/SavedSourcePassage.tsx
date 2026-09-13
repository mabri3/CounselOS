"use client";
import {useId,useState} from "react";
import {request,rawFileUrl} from "@/lib/api";
type Source={source_id:string;source_version:string;title:string;page_count:number|null;extraction_state:string;original_path:string};
type Passage={text?:string;page_image_path?:string;original_file_path?:string;page_number?:number;extraction_method?:string;next_read?:{unit_id:string;start:number}};
export default function SavedSourcePassage({matterId}:{matterId:string}) {
 const sourceSelectId=useId();
 const [sources,setSources]=useState<Source[]>([]);const [selected,setSelected]=useState<Source|null>(null);const [page,setPage]=useState(1);const [passage,setPassage]=useState<Passage|null>(null);const [error,setError]=useState("");
 const base=`/matters/${encodeURIComponent(matterId)}/workspace/saved-sources`;
 async function read(unit?:string,start=0){if(!selected)return;try{setError("");setPassage(await request<Passage>(`${base}/passage?source_id=${encodeURIComponent(selected.source_id)}&source_version=${encodeURIComponent(selected.source_version)}&unit_id=${unit ?? `${selected.page_count ? "p":"s"}${String(page).padStart(6,"0")}`}&start=${start}`));}catch(e){setError(e instanceof Error?e.message:"Passage unavailable.");}}
 return <details onToggle={e=>{if(e.currentTarget.open)void request<{sources:Source[]}>(base).then(r=>setSources(r.sources)).catch(e=>setError(e.message));}}><summary>Read saved evidence</summary>
 <label htmlFor={sourceSelectId}>Saved source</label><select id={sourceSelectId} value={selected?.source_version ?? ""} onChange={e=>{setSelected(sources.find(s=>s.source_version===e.target.value)??null);setPassage(null);}}><option value="">Choose a source</option>{sources.map(s=><option key={s.source_id+s.source_version} value={s.source_version}>{s.title} — {s.extraction_state} · {s.source_version.slice(0,8)}</option>)}</select>
 <label>Page or section number<input type="number" min={1} max={selected?.page_count??1000} value={page} onChange={e=>setPage(Number(e.target.value))}/></label><button disabled={!selected} onClick={()=>void read()}>Read passage</button>
 {selected&&<a href={rawFileUrl(selected.original_path)} target="_blank" rel="noreferrer">Open original</a>}{error&&<p role="alert">{error}</p>}
 {passage&&<><p>{selected?.page_count ? "Page" : "Section"} {passage.page_number??page} · {passage.extraction_method??"Text unavailable"}</p><pre style={{whiteSpace:"pre-wrap"}}>{passage.text}</pre>{passage.page_image_path&&<a href={rawFileUrl(passage.page_image_path)} target="_blank" rel="noreferrer">Open page image</a>}{passage.next_read&&<button onClick={()=>void read(passage.next_read?.unit_id,passage.next_read?.start)}>Continue passage</button>}</>}
 </details>;
}
