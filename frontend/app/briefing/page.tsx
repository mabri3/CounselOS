import BriefingWorkspace from "@/components/BriefingWorkspace";

export default async function BriefingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <BriefingWorkspace initialSearchParams={await searchParams} />;
}
