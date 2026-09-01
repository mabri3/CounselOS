"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReviewAuthor } from "./types";

export const REVIEW_AUTHOR_PALETTE = ["#2F5597", "#7030A0", "#008272", "#A64B00", "#C0006F", "#5B6573", "#7A3E00", "#006B8F"] as const;
export const GENERATED_REVIEW_AUTHOR = "Themis.ai";
const KEY = "themis.ai.review-author";
const LEGACY_KEY = "counsel-os.review-author";

function currentAuthorName(name: string): string {
  return name === "Themis" ? GENERATED_REVIEW_AUTHOR : name;
}

export function authorId(name: string): string {
  return ["Themis", GENERATED_REVIEW_AUTHOR].includes(name) ? "author-themis" : `author-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

export function displayReviewAuthor(name: string, id = ""): string {
  return id === "author-themis" ? GENERATED_REVIEW_AUTHOR : currentAuthorName(name);
}

export function useReviewAuthor(defaultName = "Themis.ai") {
  const fallback = currentAuthorName(defaultName.trim()) || GENERATED_REVIEW_AUTHOR;
  const [name, setNameState] = useState(fallback);
  useEffect(() => {
    const stored = sessionStorage.getItem(KEY)?.trim() || sessionStorage.getItem(LEGACY_KEY)?.trim();
    const current = currentAuthorName(stored || fallback);
    sessionStorage.setItem(KEY, current);
    setNameState(current);
  }, [fallback]);
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
