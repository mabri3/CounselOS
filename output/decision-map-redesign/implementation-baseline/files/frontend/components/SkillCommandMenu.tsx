"use client";

import { skillCommandMatches } from "@/lib/skills";
import type { SkillDefinition } from "@/lib/types";

export default function SkillCommandMenu({
  input,
  skills,
  onSelect,
}: {
  input: string;
  skills: SkillDefinition[];
  onSelect: (skill: SkillDefinition) => void;
}) {
  const matches = skillCommandMatches(input, skills);
  if (!matches.length) return null;
  return (
    <div aria-label="Skill commands" className="skill-command-menu" role="listbox">
      {matches.map((skill) => (
        <button key={skill.skill_id} onClick={() => onSelect(skill)} role="option">
          <span className="mono">/{skill.skill_id}</span>
          <span><b>{skill.name}</b>{skill.description}</span>
        </button>
      ))}
    </div>
  );
}
