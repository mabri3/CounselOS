"use client";
import { useEffect, useState } from "react";
import { request } from "@/lib/api";
import styles from "./ExperimentalChat.module.css";
type Skill = {
    name: string;
    scope?: "shared" | "page_only";
    content: string;
    revision: string;
    path: string;
};
const displayName = (name: string) => name === "dossier-generation" ? "Dossier generation" : name;
export default function ExperimentalSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [busy, setBusy] = useState(false);
    useEffect(() => { void request<{
        skills: Skill[];
    }>("/experimental-chat/skills").then(value => setSkills(value.skills)).catch(e => setError(e.message)); }, []);
    return <details name="experimental-tools" className={styles.skillsMenu}><summary>Skills</summary><p>Matter paths applies to both matter conversations. Dossier generation applies to manual and automatic dossier generation. Other guidance applies only to this page. Saved changes apply to new requests.</p>{error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}{skills.map(skill => <details key={skill.name}><summary>{displayName(skill.name)} — {skill.scope === "shared" ? "Shared" : "This page"}</summary><label htmlFor={`skill-${skill.name}`}>Editable instructions</label><textarea id={`skill-${skill.name}`} rows={12} value={skill.content} onChange={e => setSkills(current => current.map(item => item.name === skill.name ? { ...item, content: e.target.value } : item))}/><button disabled={busy} onClick={async () => { setBusy(true); setError(""); setNotice(""); try {
        const saved = await request<Skill>(`/experimental-chat/skills/${skill.name}`, { method: "PUT", body: JSON.stringify({ content: skill.content, expected_revision: skill.revision }) });
        setSkills(current => current.map(item => item.name === skill.name ? saved : item));
        setNotice(`${displayName(skill.name)} saved.`);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Could not save skill.");
    }
    finally {
        setBusy(false);
    } }}>Save {displayName(skill.name)}</button></details>)}</details>;
}
