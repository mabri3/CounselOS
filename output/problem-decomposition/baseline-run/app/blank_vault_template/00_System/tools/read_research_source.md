---
tool_id: read_research_source
handler: read_research_source
description: Read exact saved text from a source_id returned in this investigation,
  including local snapshots. No URL or path is accepted; fetch a public URL through
  collect_research_evidence first. Default/max max_chars is 6000 characters, not words
  or an end offset. Prefer the default to a tiny prefix. start/end are zero-based
  absolute character offsets, with end exclusive. For uninterrupted continuation,
  set start to the previous end and omit page_number and find_text; overlap by starting
  earlier when a clause crosses a boundary. page_number is one-based and overrides
  start, bounds text to that extracted page, and errors for missing pages. find_text
  is case-sensitive literal matching, ignores start, and selects the first occurrence
  in the whole source or selected page with up to 500 preceding characters. Omit it
  to continue or find later occurrences by offset reads. has_more refers to all saved
  text, not only the selected page. content_truncated reports upstream truncation
  and cannot be repaired by reading past the saved end. not_found means that exact
  text was absent in the searched scope; rephrase with exact wording or read offsets.
  unread means extraction/support is unavailable. A start at/past text end is an error.
  Identical reads reuse saved passages. Read the relevant complete provision and material
  definitions, exceptions or cross-references before citing; otherwise state the remaining
  gap and deliver useful advice.
parameters:
  additionalProperties: false
  properties:
    source_id:
      description: Exact source_id returned by this run's collection or investigation
        read_file. No URL, file path, or request_key.
      maxLength: 160
      minLength: 1
      title: Source Id
      type: string
    page_number:
      anyOf:
      - maximum: 30
        minimum: 1
        type: integer
      - type: 'null'
      default: null
      description: One-based page from the source's extracted pages. Overrides start
        and bounds the read to that page. To continue past a short page slice, omit
        page_number and find_text and set start to the returned absolute end.
      title: Page Number
    start:
      default: 0
      description: Zero-based absolute character offset in saved source text, not
        bytes, words, or a page-relative offset. Used only without page_number/find_text.
        Continue at returned end; use a slightly earlier start for overlap. At or
        past saved text end is an error.
      maximum: 100000
      minimum: 0
      title: Start
      type: integer
    max_chars:
      default: 6000
      description: Character count, not an end offset or word count. Default and maximum
        6000; omit for a normal passage. Avoid tiny prefix reads when the operative
        section is longer. The remaining evidence budget can reject a read.
      maximum: 6000
      minimum: 1
      title: Max Chars
      type: integer
    find_text:
      default: ''
      description: Case-sensitive literal substring, no regex or keyword syntax. Finds
        the first occurrence in the whole source (or selected page), ignoring start;
        returns up to 500 characters before it. On not_found, try exact source wording
        or offset reads. Omit this field when continuing at returned end.
      maxLength: 2000
      title: Find Text
      type: string
  required:
  - source_id
  title: ResearchSourceRead
  type: object
---
Declarative investigation tool; requires server authorization.

