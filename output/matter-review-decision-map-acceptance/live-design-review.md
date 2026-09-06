# Live in-app design review

September 5, 2026. Read-only review of `http://localhost:3000/` and
`http://localhost:3000/matters/MAT-20260904-abf788` in the **Codex in-app browser**.
Actual viewport: 1163 × 654 CSS pixels. No design variant or application edit
was made for this review.

## What was exercised

- Loaded Today and scrolled through all three attention cards, other-matter
  links, practice totals, the new-matter entry, and the workspace composer.
- Opened the reference Matter's existing Draft view, switched to Understand,
  scrolled the review items, and opened the first issue from All issues.
- Used keyboard Tab/Enter on issue navigation. Opened its decision map, switched
  from the two-record local view to the 34-record whole-matter view, and used
  Back to matter issue. No hypothetical run or chat request was submitted.
- Restored the original Draft view. No Save, Complete work, research, disposition,
  decision, adoption, or working-copy action was taken.

## Verified findings

1. **The visual style is calm and consistent.** Warm paper, serif headings,
   light borders, and restrained state colors follow `docs/DESIGN_LANGUAGE.md`.
   The main navigation and Understand/Discuss/Draft controls are easy to find.
2. **Today is hard to scan quickly.** One tall attention card occupies most of
   the first viewport. The other two need scrolling. Long questions, answer
   paragraphs, and repeated Discuss/Draft controls make the three cards read
   like three separate documents. The lower “Other matter orientations” and
   “Your other matters” sections repeat All matters links with a weak distinction.
3. **The main action needs stronger emphasis.** Most actions have the same small
   outlined treatment. Green Ready appears beside unassigned work or an amber
   stale-answer message, which makes the overall state less clear. State words
   exist, but their combined message needs a clearer order.
4. **The Matter's selected-work banner consumes useful reading space.** Its
   long title crowds the `open · Unassigned` text. The banner, view controls,
   business question, and answer push the next review action below the first
   654-pixel viewport; the orientation ends around Y=961.
5. **The new issue grouping is understandable, but legacy data makes it sparse.**
   The inspected issue has a paragraph-length title, no saved business effect,
   no claim-level source support, no linked questions, and no linked mitigation
   work. The page states these gaps honestly. It should not invent links or
   treat the existing legal conclusions as verified. Styling alone cannot fill
   these records or turn the saved jurisdiction discussion into a launch answer.
6. **The map navigation works, but full-text reading belongs in the detail/outline.**
   The local view showed two linked records. Whole matter showed 34. Canvas labels
   shorten long text; the selected detail and keyboard outline retain it. This
   is useful for orientation, not a substitute for reading the analysis.
7. **Secondary work sits far down Today.** New matter and the general composer
   are below the attention cards and practice totals. They are clear when reached,
   but users who mainly want to paste a new request must scroll to them.

## Possible directions, not generated variants

- **Compact work queue:** Today rows show matter, reason, owner, and one primary
  action. Expand a row to read its answer.
- **Reading-first matter:** Keep the question, a short answer, and next action
  together. Reduce the active-work banner to one slim strip.
- **Split review desk:** Put a narrow issue list beside one wide review panel on
  desktop. Open sources on demand and stack the panels on narrow screens.

## Evidence and limits

Screenshots in this directory:
`live-today-design.jpg`, `live-today-scroll-design.jpg`,
`live-today-bottom-design.jpg`, `live-today-composer-design.jpg`,
`live-matter-existing-draft-design.jpg`, `live-matter-understand-design.jpg`,
`live-matter-review-items-design.jpg`, `live-matter-issue-design.jpg`, and
`live-matter-map-design.jpg`.

This is a visual/read-only navigation review, not a legal review or a complete
accessibility audit. Native 200% zoom was unavailable during this review because the Mac was locked. The user subsequently chose to skip it.
The implementation's isolated acceptance fixture has richer linked records than
this reference matter; the two observations must not be treated as equivalent.
