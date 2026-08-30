import AppShell from "@/components/AppShell";
import SkillBuilder from "@/components/SkillBuilder";

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ goal?: string }>;
}) {
  const { goal = "" } = await searchParams;
  return (
    <AppShell>
      <SkillBuilder initialGoal={goal} />
    </AppShell>
  );
}
