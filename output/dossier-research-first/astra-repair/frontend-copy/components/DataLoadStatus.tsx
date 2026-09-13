"use client";

import { useState } from "react";

type Props = {
  error: string;
  loading: boolean;
  loadingLabel: string;
  onRetry: () => void | Promise<void>;
  retryingLabel?: string;
};

/** Shared, announced feedback for a screen's read-only data request. */
export default function DataLoadStatus({
  error,
  loading,
  loadingLabel,
  onRetry,
  retryingLabel = "Retrying…",
}: Props) {
  const [retrying, setRetrying] = useState(false);
  const busy = loading || retrying;
  if (!busy && !error) return null;

  async function retry() {
    setRetrying(true);
    try {
      await onRetry();
    } catch {
      // The parent owns and announces the request error.
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div
      aria-atomic="true"
      aria-busy={busy}
      aria-live="polite"
      className={error && !busy ? "error data-load-status" : "loading data-load-status"}
      role="status"
    >
      <span>{retrying ? retryingLabel : loading ? loadingLabel : error}</span>
      {error && !busy ? (
        <button className="btn tiny quiet" onClick={() => void retry()} type="button">
          Retry
        </button>
      ) : null}
    </div>
  );
}
