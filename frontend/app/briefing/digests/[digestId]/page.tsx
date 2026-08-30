import BriefingReader from "@/components/BriefingReader";

export default async function DigestPage({ params }: { params: Promise<{ digestId: string }> }) {
  const { digestId } = await params;
  return <BriefingReader digestId={digestId} />;
}
