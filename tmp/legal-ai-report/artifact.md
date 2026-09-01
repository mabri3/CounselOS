# Template execution contract

## Reference

- Retained DOCX: `/Users/bharris/Programs/counsel-os-mvp/output/research/legal-ai-small-team-market-research.docx`
- SHA-256: `bf45c6a1d77acdab7f3ddc4a24f7a0068d4b99447c387ab1a70724621e2a5665`
- Rendered reference: `/Users/bharris/Programs/counsel-os-mvp/tmp/legal-ai-report/rendered/`
- Page count: 7
- Section count: 1
- Style evidence: `/Users/bharris/Programs/counsel-os-mvp/tmp/legal-ai-report/template-style-evidence.json`

## Page system

- US Letter, portrait, 8.5 by 11 inches.
- Margins: 1 inch on every side.
- Header and footer distance: 0.492 inch.
- One section. No different first-page header. No odd/even variation.
- Header: left aligned, 8.5 pt Calibri bold, muted gray, all caps.
- Footer: right aligned, 8.5 pt Calibri, muted gray, with a real PAGE field.

## Typography and color

- Font family: Calibri throughout.
- Body: 11 pt, dark navy `0B2545`, 1.1 line spacing, 6 pt after.
- Report label: 10 pt bold, blue `2E74B5`.
- Main title: 22 pt bold, dark navy `0B2545`, single spacing.
- Subtitle: 13 pt, muted gray `5B6573`.
- Heading 1: real Heading 1 style, 16 pt bold blue `2E74B5`, 16 pt before, 8 pt after, keep with next.
- Heading 2: real Heading 2 style, 13 pt bold blue `2E74B5`, 12 pt before, 6 pt after, keep with next.
- Hyperlinks: blue `2E74B5`, underlined.
- Table header fill: light blue `E8EEF5`.
- Metadata label fill: light gray `F2F4F7`.
- Callout fill: `F4F6F9`; callout heading dark blue `1F4D78`.

## Lists and tables

- Use the source document's real List Bullet and List Number styles.
- Use fixed-width tables with explicit DXA geometry totaling 9360 DXA.
- Table indent: 120 DXA. Default cell margins: top/bottom 80 DXA, left/right 120 DXA.
- Header rows repeat. Rows expand naturally. Cells are vertically centered.
- Use tables only for true comparisons. Use prose and bullets for conclusions and recommendations.

## Components and flow

- Page 1 uses the source masthead pattern: report label, large title, subtitle, metadata table, and one lead callout.
- Later pages use a restrained market-research pattern with blue section headings, short prose, customer-voice evidence, comparison tables, bullets, and occasional callouts.
- Every page uses the recurring header and footer.
- The body is market-first: market structure, observed use cases, product-by-product customer voices, buying choices, and unmet needs.
- The Themis comparison is limited to one short closing section.
- The final section is a curated source appendix, not the complete 203-record register.

## Slot map

- `word/document.xml` body: rewrite allowed. The complete body is the editable content slot for the new strategic report.
- `word/header1.xml`: preserve the component and formatting; update product label text only if needed.
- `word/footer1.xml`: preserve the component, wording, and PAGE field.
- `word/styles.xml`, `word/numbering.xml`, theme, settings, and relationships: preserve and reuse.
- Core properties: rewrite title, subject, and keywords; preserve author as CounselOS.
- No images, comments, footnotes, or content controls are present.

## Package preservation

- The retained DOCX is read-only and must remain byte-for-byte unchanged.
- Start from a working copy of the reference.
- Preserve section geometry, headers, footers, styles, numbering, theme, settings, and PAGE-field relationships.
- Replace the source body in the working copy because the user requested a full strategic rewrite.

## Fidelity gates

- The new report must remain visibly derived from the seven-page reference: same masthead, typography, colors, table treatment, header, footer, and page rhythm.
- The new report may be longer because it adds a market map, six product profiles, cross-product buying patterns, unmet needs, a short Themis comparison, and a curated evidence appendix.
- No complete raw-record dump belongs in the main report. The raw corpus remains a separate audit artifact.
- Render every page and inspect at 100 percent. Fail for clipped text, dense walls of tables, broken links, inconsistent page furniture, or unexplained layout drift.
- Recheck the retained reference SHA-256 before delivery.
