import { autoLinkUrlMatcher } from "@lexical/link";
import { Fragment } from "react";

/** Turns plain web addresses into safe links without changing the surrounding text. */
export default function LinkifiedText({ text }: { text: string }) {
  const parts: Array<{ text: string; url?: string }> = [];
  let remaining = text;

  while (remaining) {
    const match = autoLinkUrlMatcher(remaining);
    if (!match) {
      parts.push({ text: remaining });
      break;
    }
    if (match.index > 0) parts.push({ text: remaining.slice(0, match.index) });
    parts.push({ text: match.text, url: match.url });
    remaining = remaining.slice(match.index + match.length);
  }

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part.url ? (
            <a
              className="auto-link"
              href={part.url}
              onClick={(event) => event.stopPropagation()}
              rel="noreferrer"
              target="_blank"
            >
              {part.text}
            </a>
          ) : part.text}
        </Fragment>
      ))}
    </>
  );
}
