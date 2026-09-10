---
tool_id: read_research_source
handler: read_research_source
description: Read exact saved text from a source_id in this investigation, including
  library units and local snapshots. No URL or path is accepted; fetch a public URL
  through collect_research_evidence first, or locate saved material with search_research_sources.
  Default/max max_chars is 6000 characters, not words or an end offset. Prefer the
  default to a tiny prefix. start/end are zero-based character offsets, with end exclusive.
  For a library source, pass unit_id (and source_version) exactly as a search hit
  or a returned next_read gives them; the response carries next_read for the rest
  of that unit and for the next unit when a paragraph or exception crosses a page.
  Omitting source_version uses the version this run pinned; the newest published version
  is never substituted silently. For uninterrupted continuation in a legacy run source,
  set start to the previous end and omit page_number and find_text; overlap by starting
  earlier when a clause crosses a boundary. page_number is one-based and overrides
  start, bounds text to that extracted page, and errors for missing pages. find_text
  is case-sensitive literal matching, ignores start, and selects the first occurrence
  in the whole source or selected page with up to 500 preceding characters. Omit it
  to continue or find later occurrences by offset reads. has_more_in_unit refers to
  the selected unit; extraction_complete separately reports whether the whole source
  was extracted. paragraph_continues means the passage is cut mid-paragraph; follow
  next_read before treating it as the whole provision. not_found means that exact
  text or unit was absent in the searched scope; rephrase with exact wording or read
  offsets. stale_source means the saved text no longer matches its published hash
  and is not current evidence. unavailable means extraction or support is missing;
  the original file and page image remain listed. A start at/past text end is an error.
  Identical reads reuse saved passages. Read the relevant complete provision and material
  definitions, exceptions or cross-references before citing; otherwise state the remaining
  gap and deliver useful advice. To extract an unextracted page of a pinned library
  source, set continue_extraction to true and optionally page_number. This makes one
  bounded local attempt and returns a newly pinned version plus next_read; old versions
  stay readable. Do not refetch or loop automatically.
parameters:
  additionalProperties: false
  properties:
    source_id:
      description: Exact source_id returned by this run's collection, source search,
        or investigation read_file. No URL, file path, or request_key.
      maxLength: 160
      minLength: 1
      title: Source Id
      type: string
    source_version:
      anyOf:
      - maxLength: 64
        type: string
      - type: 'null'
      default: null
      description: Exact source_version from a search hit or earlier read. Omit to
        use the version this run already pinned for that source_id; the newest published
        version is never substituted silently.
      title: Source Version
    unit_id:
      anyOf:
      - maxLength: 64
        type: string
      - type: 'null'
      default: null
      description: Exact unit_id (a page like p000900 or a section like s000012) from
        a search hit or a returned next_read. Reads one library unit. Omit for a legacy
        run source that has no units.
      title: Unit Id
    page_number:
      anyOf:
      - maximum: 1000
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
      description: Zero-based character offset. With unit_id it is an offset in that
        unit's saved body; otherwise an absolute offset in the saved source text,
        not bytes or words, and used only without page_number/find_text. Continue
        at the returned end; use a slightly earlier start for overlap. At or past
        the saved text end is an error.
      maximum: 20000000
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
    continue_extraction:
      default: false
      description: Explicitly continue local extraction for a source already pinned
        by this run. Optionally set page_number to extract that page. One bounded
        invocation only; returns a newly pinned version and next_read. Old versions
        remain readable. Does not fetch or spend model evidence budget.
      title: Continue Extraction
      type: boolean
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
