from __future__ import annotations

import re

from app.models.awareness import DevelopmentBatch, InternalSnapshot, MatchConnection, MatchResult


_WORDS = re.compile(r"[\w-]+", re.UNICODE)
_STOP = {"about", "after", "before", "from", "have", "into", "that", "their", "this", "with", "will", "would", "legal", "company"}


class AwarenessMatcher:
    """Matches public developments to private records without network access."""

    def match(self, developments: DevelopmentBatch, snapshot: InternalSnapshot) -> MatchResult:
        connections: list[MatchConnection] = []
        warnings = [*developments.warnings, *snapshot.warnings]
        for development in developments.developments:
            public_text = " ".join(
                [development.title, development.summary, development.official_identifier or "", *(obs.text for obs in development.observations)]
            )
            public_folded = public_text.casefold()
            public_terms = self._terms(public_text)
            matched: list[str] = []
            evidence: list[str] = []
            types: set[str] = set()
            explicit = False
            for record in snapshot.records:
                identifiers = {record.record_id.casefold(), record.path.casefold()}
                direct = any(identifier and identifier in public_folded for identifier in identifiers)
                overlap = sorted(public_terms & self._terms(f"{record.title} {record.text}"))
                lexical = len(overlap) >= 2 or any(len(term) >= 9 for term in overlap)
                if not direct and not lexical:
                    continue
                matched.append(record.record_id)
                types.add(record.record_type)
                if direct:
                    explicit = True
                    evidence.append(f"Explicit link to {record.record_id} ({record.path}).")
                else:
                    evidence.append(f"Lexical overlap with {record.record_id}: {', '.join(overlap[:6])}.")

            state, reason = self._attention(public_folded, types, explicit, bool(matched))
            connections.append(MatchConnection(
                development_id=development.development_id,
                internal_record_ids=matched,
                attention_state=state,
                reason=reason,
                evidence=evidence[:12] or ["No current local company connection was found."],
            ))
        return MatchResult(connections=connections, warnings=warnings)

    @staticmethod
    def _terms(text: str) -> set[str]:
        return {word.casefold() for word in _WORDS.findall(text) if len(word) >= 4 and word.casefold() not in _STOP}

    @staticmethod
    def _attention(text: str, types: set[str], explicit: bool, matched: bool) -> tuple[str, str]:
        if not matched:
            return "briefing_only", "Useful external reading; no current internal record matched."
        urgent = any(term in text for term in ("effective immediately", "takes effect today", "deadline today", "enforcement action"))
        if "decision" in types and urgent:
            return "required", "A current decision is connected to a development that needs review today."
        if "decision" in types:
            return "this_week", "A prior decision may need lawyer review this week."
        if explicit:
            return "this_week", "The development explicitly links to current company work."
        return "monitor", "Current company context overlaps; monitor for a material change."
