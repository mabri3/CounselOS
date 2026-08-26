import Link from "next/link";

export default function AttentionStrip({ staleCount }: { staleCount: number }) {
  if (staleCount === 0) return null;
  return (
    <div className="attention-strip">
      <div>
        <div className="attention-title">Attention required</div>
        <div className="small muted">
          {staleCount} recorded decision{staleCount === 1 ? "" : "s"} may need review because time, policy, or linked source context changed.
        </div>
      </div>
      <Link className="button amber compact" href="/decisions">
        Review decisions
      </Link>
    </div>
  );
}
