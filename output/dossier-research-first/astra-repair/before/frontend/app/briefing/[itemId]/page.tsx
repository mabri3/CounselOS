import BriefingReader from "@/components/BriefingReader";

export default async function BriefingItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ itemId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ itemId }, query] = await Promise.all([params, searchParams]);
  return <BriefingReader itemId={itemId} returnQuery={query} />;
}
