"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReviewAuthor } from "./types";

export const REVIEW_AUTHOR_PALETTE = ["#2F5597", "#7030A0", "#008272", "#A64B00", "#C0006F", "#5B6573", "#7A3E00", "#006B8F"] as const;
const KEY = "counsel-os.review-author";

export function authorId(name: string): string {
  return name === "Themis" ? "author-themis" : `author-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

export function useReviewAuthor(defaultName = "Themis") {
  const fallback = defaultName.trim() || "Themis";
  const [name, setNameState] = useState(fallback);
  useEffect(() => { setNameState(sessionStorage.getItem(KEY)?.trim() || fallback); }, [fallback]);
  const setName = useCallback((next: string) => {
    const clean = next.trim() || fallback;
    sessionStorage.setItem(KEY, clean);
    setNameState(clean);
  }, [fallback]);
  const asAuthor = useCallback((authors: ReviewAuthor[] = []): ReviewAuthor => {
    const id = authorId(name);
    return authors.find((item) => item.author_id === id) ?? { author_id: id, name, color: REVIEW_AUTHOR_PALETTE[authors.length % REVIEW_AUTHOR_PALETTE.length] };
  }, [name]);
  return { name, setName, asAuthor };
}
