import type { SkillDefinition } from "./types";

export function skillCommandMatches(input: string, skills: SkillDefinition[]): SkillDefinition[] {
  const value = input.trimStart();
  if (!value.startsWith("/") || /\s/.test(value)) return [];
  const query = value.slice(1).toLowerCase();
  return skills.filter((skill) =>
    skill.skill_id.startsWith(query) || skill.name.toLowerCase().includes(query),
  );
}

export function skillBuilderGoal(input: string): string | null {
  const value = input.trim();
  const explicitPhrase = /^(?:help me (?:make|create|build) a skill|turn this process into a skill)(?:\b|[.!?])/i;
  return explicitPhrase.test(value) ? input : null;
}
