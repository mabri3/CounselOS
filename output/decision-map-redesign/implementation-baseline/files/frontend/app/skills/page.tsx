"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import SkillBuilder from "@/components/SkillBuilder";
import OutputTemplateLibrary from "@/components/workspace/OutputTemplateLibrary";
import OutputTemplateEditor from "@/components/workspace/OutputTemplateEditor";
import { templateCommand, workspaceCommand, getWorkspace } from "@/lib/workspaceApi";
import { getMatters, startChatRun, getChatRun } from "@/lib/api";
import type { Matter } from "@/lib/types";
import type { OutputTemplate, DraftResult, WorkProductReference } from "@/lib/workspaceTypes";

export default function SkillsPage() {
  const [goal, setGoal] = useState("");
  const [templates, setTemplates] = useState<OutputTemplate[]>([]);
  const [editing, setEditing] = useState<OutputTemplate | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [matterId, setMatterId] = useState("");
  const [error, setError] = useState("");
  async function refresh() { setTemplates(await templateCommand<OutputTemplate[]>()); }
  useEffect(() => { setGoal(new URLSearchParams(window.location.search).get("goal") ?? ""); void Promise.all([templateCommand<OutputTemplate[]>(), getMatters()]).then(([saved, records]) => { setTemplates(saved); setMatters(records.matters); }).catch(cause => setError(String(cause))); }, []);
  async function preview(template: OutputTemplate, overrides: Record<string, string>): Promise<DraftResult> {
    if (!matterId) throw new Error("Select a matter for the preview.");
    const scope = await getWorkspace(matterId);
    let run = await startChatRun(matterId, { message: `Create an editable preview using ${template.name} for this matter.`, output_type: template.output_type, template_id: template.template_id, template_overrides: overrides, preview: true, expected_question_revision: scope.question.revision, source_action_key: `template-preview:${crypto.randomUUID()}` });
    while (["queued", "running"].includes(run.state)) { await new Promise(resolve => window.setTimeout(resolve, 1000)); run = await getChatRun(matterId, run.run_id); }
    const artifacts = await workspaceCommand<WorkProductReference[]>(matterId, "/drafts");
    return { run_id: run.run_id, state: run.state, artifact: artifacts.find(item => item.source_run_id === run.run_id) ?? null };
  }
  const openArtifact = (path: string) => { window.location.href = `/matters/${encodeURIComponent(matterId)}?file=${encodeURIComponent(path)}`; };
  return <AppShell><main className="page"><h1>Output templates</h1><p>Choose how your business receives legal work. Each draft keeps the template version used to create it.</p>
    {error ? <p role="alert" className="error">{error}</p> : null}
    <label>Matter for preview <select value={matterId} onChange={event => setMatterId(event.target.value)}><option value="">Select a matter</option>{matters.map(matter => <option key={matter.matter_id} value={matter.matter_id}>{matter.title}</option>)}</select></label>
    {editing ? <OutputTemplateEditor template={editing} onCancel={() => setEditing(null)} onSave={async (changes, expected_revision) => { const saved = await templateCommand<OutputTemplate>(`/${editing.template_id}`, "PUT", { ...changes, expected_revision }); await refresh(); setEditing(saved); return saved; }} onPreview={preview} onOpenArtifact={openArtifact} /> : <OutputTemplateLibrary templates={templates} selectedTemplateId={selectedId} onSelect={item => setSelectedId(item.template_id)} onEdit={setEditing} onCreate={() => void templateCommand<OutputTemplate>("", "POST", { template_id: `custom-${crypto.randomUUID().slice(0, 8)}`, name: "New output template", output_type: "general", instructions: "Give a useful first draft for the selected matter.", section_outline: "## Short answer\n## Analysis\n## Next steps" }).then(async saved => { await refresh(); setEditing(saved); }).catch(cause => setError(String(cause)))} onDuplicate={async item => { const saved = await templateCommand<OutputTemplate>(`/${item.template_id}/duplicate`, "POST", { new_template_id: `${item.template_id}-copy-${crypto.randomUUID().slice(0, 8)}`, name: `${item.name} copy` }); await refresh(); setEditing(saved); return saved; }} onSetDefault={async item => { await templateCommand("/default", "POST", { output_type: item.output_type, template_id: item.template_id }); await refresh(); }} onPreview={preview} onOpenArtifact={openArtifact} />}
    <details><summary>Reusable skills</summary><SkillBuilder key={goal} initialGoal={goal} /></details>
  </main></AppShell>;
}
