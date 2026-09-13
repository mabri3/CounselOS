---
tool_id: search_research_sources
handler: search_research_sources
description: 'Search this matter''s saved source library for likely evidence, then read the
  controlling passage before treating any snippet as support. Terms are whitespace-separated
  and matched case-insensitively as substrings; ANY term can match. This is not phrase, Boolean
  or semantic search, so use distinctive wording from the source itself. Only sources already
  registered for this matter are searched; this tool never fetches anything. Each hit returns
  source_id, source_version, unit_id, page or section locator, a body offset, a snippet of
  at most 400 characters, the extraction state, and next_read arguments to pass straight to
  read_research_source. A snippet is a relevance cue, never a citation. Searching a source
  pins its version for this run, so later reads and citations resolve to the same text. results_omitted
  true means more hits matched than were returned; narrow the query or raise limit to at most
  10. status not_found means no registered source unit contains those terms - it does not
  mean the rule does not exist; try the source''s own wording or read the source catalog.
  Example: search_research_sources {"query": "notice regulator published order"} returns a
  hit like {"source_id": "SRC-4F2A", "source_version": "9c1e...", "unit_id": "p000900", "page_number":
  900, "body_offset": 120}; read it with read_research_source {"source_id": "SRC-4F2A", "source_version":
  "9c1e...", "unit_id": "p000900", "start": 120}, then follow the returned next_read while
  paragraph_continues is true.'
parameters:
  additionalProperties: false
  description: Bounded model payload for search_research_sources.
  properties:
    query:
      description: Whitespace-separated terms matched case-insensitively as substrings against
        saved source text. ANY term can match; this is not phrase, Boolean or semantic search.
        Use distinctive wording from the source itself.
      maxLength: 2000
      minLength: 1
      title: Query
      type: string
    source_id:
      anyOf:
      - maxLength: 160
        type: string
      - type: 'null'
      default: null
      description: Restrict the search to one registered source_id from this matter's source
        library. Omit to search every registered source.
      title: Source Id
    source_version:
      anyOf:
      - maxLength: 64
        type: string
      - type: 'null'
      default: null
      description: Restrict the search to one exact source_version. Requires source_id. Omit
        to use the version pinned by this run, or the current published version.
      title: Source Version
    limit:
      default: 5
      description: Maximum hits to return. Default 5, maximum 10. Each hit is a locator plus
        a short snippet, not the passage itself; read the unit before treating a snippet as
        support.
      maximum: 10
      minimum: 1
      title: Limit
      type: integer
  required:
  - query
  title: SourceSearchRequest
  type: object
---
Declarative investigation tool; requires server authorization.
