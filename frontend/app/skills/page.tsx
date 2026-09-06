"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/components/TemplatesPhase2.module.css";
import AppShell from "@/components/AppShell";
import SkillBuilder from "@/components/SkillBuilder";
import OutputTemplateLibrary from "@/components/workspace/OutputTemplateLibrary";
import OutputTemplateEditor from "@/components/workspace/OutputTemplateEditor";
import { templateCommand, workspaceCommand, getWorkspace } from "@/lib/workspaceApi";
import { getMatters, startChatRun, getChatRun } from "@/lib/api";
import type { Matter } from "@/lib/types";
import type { OutputTemplate, DraftResult, WorkProductReference } from "@/lib/workspaceTypes";

export default function SkillsPage() {
  const [section, setSection] = useState<"templates" | "skills">("templates");
  const [editorVisible, setEditorVisible] = useState(false);
  const artifactMatters = useRef(new Map<string, string>());
  const [goal, setGoal] = useState("");
  const [templates, setTemplates] = useState<OutputTemplate[]>([]);
  const [editing, setEditing] = useState<OutputTemplate | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [matterId, setMatterId] = useState("");
  const [error, setError] = useState("");
  async function refresh() { setTemplates(await templateCommand<OutputTemplate[]>()); }
  useEffect(() => { const initialGoal = new URLSearchParams(window.location.search).get("goal") ?? ""; setGoal(initialGoal); if (initialGoal) setSection("skills"); void Promise.all([templateCommand<OutputTemplate[]>(), getMatters()]).then(([saved, records]) => { setTemplates(saved); setSelectedId(saved[0]?.template_id ?? null); setMatters(records.matters); }).catch(cause => setError(String(cause))); }, []);
  async function preview(template: OutputTemplate, overrides: Record<string, string>): Promise<DraftResult> {
    if (!matterId) throw new Error("Select a matter for the preview.");
    const originatingMatter = matterId;
    const scope = await getWorkspace(originatingMatter);
    let run = await startChatRun(originatingMatter, { message: `Create an editable preview using ${template.name} for this matter.`, output_type: template.output_type, template_id: template.template_id, template_overrides: overrides, preview: true, workspace_action: "draft", expected_question_revision: scope.question.revision, source_action_key: `template-preview:${crypto.randomUUID()}` });
    while (["queued", "running"].includes(run.state)) { await new Promise(resolve => window.setTimeout(resolve, 1000)); run = await getChatRun(originatingMatter, run.run_id); }
    const artifacts = await workspaceCommand<WorkProductReference[]>(originatingMatter, "/drafts");
    const artifact = artifacts.find(item => item.source_run_id === run.run_id) ?? null;
    if (artifact) artifactMatters.current.set(artifact.path, originatingMatter);
    return { run_id: run.run_id, state: run.state, artifact };
  }
  const openArtifact = (path: string) => { window.location.href = `/matters/${encodeURIComponent(artifactMatters.current.get(path) ?? matterId)}?view=draft&file=${encodeURIComponent(path)}`; };
  const showEditor = (template: OutputTemplate) => { setEditing(template); setEditorVisible(true); };
  const previewContext = <label className={styles.matter}>Matter for preview <select value={matterId} onChange={event => setMatterId(event.target.value)}><option value="">Select a matter</option>{matters.map(matter => <option key={matter.matter_id} value={matter.matter_id}>{matter.title}</option>)}</select></label>;
  return <AppShell><main className={styles.page}>
    {!editorVisible && section === "templates" ? <><h1 className={styles.heading}>Output templates</h1><p className={styles.lede}>Choose how the business receives legal work.</p></> : null}
    <nav className={styles.tabs} aria-label="Skills sections"><button type="button" aria-pressed={section === "templates"} onClick={() => setSection("templates")}>Output templates</button><button type="button" aria-pressed={section === "skills"} onClick={() => setSection("skills")}>Reusable skills</button></nav>
    {error ? <p role="alert" className="error">{error}</p> : null}
    <div hidden={section !== "templates"}>
    <div hidden={!editorVisible}><button type="button" className={`btn quiet ${styles.back}`} onClick={() => setEditorVisible(false)}>‹ Back to templates</button>
    {editing ? <OutputTemplateEditor presentation="phase2" previewContext={previewContext} previewReady={!!matterId} template={editing} onCancel={() => setEditorVisible(false)} onSave={async (changes, expected_revision) => { const saved = await templateCommand<OutputTemplate>(`/${editing.template_id}`, "PUT", { ...changes, expected_revision }); setEditing(saved); await refresh().catch(cause => setError(`Template saved. The library could not refresh: ${String(cause)}`)); return saved; }} onPreview={preview} onOpenArtifact={openArtifact} /> : null}</div><div hidden={editorVisible}><OutputTemplateLibrary presentation="phase2" previewContext={previewContext} previewReady={!!matterId} templates={templates} selectedTemplateId={selectedId} onSelect={item => setSelectedId(item.template_id)} onEdit={showEditor} onCreate={() => void templateCommand<OutputTemplate>("", "POST", { template_id: `custom-${crypto.randomUUID().slice(0, 8)}`, name: "New output template", output_type: "general", instructions: "Give a useful first draft for the selected matter.", section_outline: "## Short answer\n## Analysis\n## Next steps" }).then(async saved => { await refresh(); showEditor(saved); }).catch(cause => setError(String(cause)))} onDuplicate={async item => { const saved = await templateCommand<OutputTemplate>(`/${item.template_id}/duplicate`, "POST", { new_template_id: `${item.template_id}-copy-${crypto.randomUUID().slice(0, 8)}`, name: `${item.name} copy` }); await refresh(); showEditor(saved); return saved; }} onSetDefault={async item => { await templateCommand("/default", "POST", { output_type: item.output_type, template_id: item.template_id }); await refresh(); }} onPreview={preview} onOpenArtifact={openArtifact} /></div></div>
    <div hidden={section !== "skills"}><SkillBuilder key={goal} initialGoal={goal} presentation="phase2" /></div>
  </main></AppShell>;
}
