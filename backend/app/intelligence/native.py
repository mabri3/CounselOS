from __future__ import annotations

import hashlib
import html
import re
import asyncio
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from urllib.parse import urlsplit

from app.models.awareness import (
    DevelopmentCandidate, OutboundWatchQuery, ProviderCheckpoint, ProviderScanResult,
    SafeFetchLimits, SourceCoverage, SourceReference,
)


_TITLE = re.compile(r"(?is)<title[^>]*>(.*?)</title>")
_TAG = re.compile(r"(?s)<[^>]+>")


class NativeIntelligenceProvider:
    provider_id = "native"
    label = "CounselOS native"

    def __init__(self, fetcher, search_service=None, *, limits: SafeFetchLimits | None = None,
                 max_discovery_urls: int = 50, max_candidates: int = 100, clock=time.monotonic):
        self.fetcher = fetcher
        self.search_service = search_service
        self.limits = limits or SafeFetchLimits()
        self.max_discovery_urls = max_discovery_urls
        self.max_candidates = max_candidates
        self._clock = clock

    async def scan(self, query: OutboundWatchQuery, checkpoint: ProviderCheckpoint | None) -> ProviderScanResult:
        urls = list(dict.fromkeys(str(url) for url in query.public_source_urls))
        warnings: list[str] = []
        coverage: list[SourceCoverage] = []
        candidates: list[DevelopmentCandidate] = []
        deadline = self._clock() + self.limits.run_timeout_seconds

        if self.search_service and len(urls) < self.max_discovery_urls:
            search_text = " ".join((query.standing_question, *query.keywords, *query.topics))
            remaining = deadline - self._clock()
            try:
                if remaining <= 0:
                    raise TimeoutError
                result = await asyncio.wait_for(self.search_service.search_external(search_text), timeout=remaining)
                if self._clock() >= deadline:
                    raise TimeoutError
                if result.get("warning"):
                    warnings.append(str(result["warning"]))
                for item in result.get("external", []):
                    url = item.get("url")
                    if isinstance(url, str) and url.startswith("https://") and url not in urls:
                        urls.append(url)
                        if len(urls) >= self.max_discovery_urls:
                            break
            except (TimeoutError, asyncio.TimeoutError):
                warnings.append("native provider run timeout reached during public discovery")
            except Exception as exc:
                warnings.append(f"public discovery failed: {exc}")

        if not urls:
            warnings.append("No usable public source URLs were available; public discovery is unavailable or returned no results.")

        for url in urls[: self.max_discovery_urls]:
            if len(candidates) >= self.max_candidates:
                warnings.append("candidate limit reached")
                break
            try:
                remaining = deadline - self._clock()
                if remaining <= 0:
                    raise TimeoutError
                fetched = await asyncio.wait_for(self.fetcher.fetch(url, self.limits), timeout=remaining)
                if self._clock() >= deadline:
                    raise TimeoutError
                parsed = self._candidates(fetched)
                candidates.extend(parsed[: self.max_candidates - len(candidates)])
                coverage.append(SourceCoverage(url=fetched.final_url, status="checked"))
            except (TimeoutError, asyncio.TimeoutError):
                coverage.append(SourceCoverage(url=url, status="failed", message="provider run timeout reached"))
                warnings.append("native provider run timeout reached; collected results were preserved")
                break
            except Exception as exc:
                coverage.append(SourceCoverage(url=url, status="failed", message=str(exc)))
                warnings.append(f"source failed: {url}: {exc}")

        now = datetime.now(timezone.utc)
        next_checkpoint = ProviderCheckpoint(
            provider_id="native", last_observed_at=now,
            state={"source_count": len(urls), "candidate_count": len(candidates)},
        )
        status = "partial" if warnings and candidates else "failed" if warnings and not candidates else "success"
        return ProviderScanResult(
            provider_id="native", status=status, next_checkpoint=next_checkpoint,
            source_coverage=coverage, candidates=candidates, warnings=warnings,
        )

    def _candidates(self, fetched) -> list[DevelopmentCandidate]:
        text = fetched.excerpt
        if fetched.content_type in {"application/rss+xml", "application/atom+xml", "application/xml", "text/xml"}:
            parsed = self._feed(text)
            if parsed:
                return parsed
        title_match = _TITLE.search(text)
        title = html.unescape(_TAG.sub("", title_match.group(1))).strip() if title_match else ""
        title = title or urlsplit(str(fetched.final_url)).hostname or "Public source"
        plain = " ".join(html.unescape(_TAG.sub(" ", text)).split())
        source = SourceReference(
            title=title, canonical_url=fetched.final_url, excerpt=plain[:12000], support_state="retrieved",
            warning="; ".join(fetched.warnings) or None,
        )
        return [DevelopmentCandidate(
            title=title, canonical_url=fetched.final_url, content_hash=fetched.content_hash,
            summary=plain[:1000], sources=[source], provider_observation=plain[:12000],
        )]

    @staticmethod
    def _feed(text: str) -> list[DevelopmentCandidate]:
        try:
            root = ET.fromstring(text)
        except ET.ParseError:
            return []
        output: list[DevelopmentCandidate] = []
        entries = root.findall(".//item") + root.findall(".//{*}entry")
        for entry in entries:
            title = (entry.findtext("title") or entry.findtext("{*}title") or "Untitled development").strip()
            link = entry.findtext("link") or entry.findtext("{*}link")
            if not link:
                link_node = entry.find("{*}link")
                link = link_node.get("href") if link_node is not None else None
            if not link or not link.startswith("https://"):
                continue
            summary = entry.findtext("description") or entry.findtext("{*}summary") or entry.findtext("{*}content") or ""
            summary = " ".join(_TAG.sub(" ", summary).split())[:12000]
            digest = hashlib.sha256((title + "\n" + summary).encode()).hexdigest()
            source = SourceReference(title=title, canonical_url=link, excerpt=summary, support_state="supplied")
            output.append(DevelopmentCandidate(
                title=title, canonical_url=link, content_hash=digest, summary=summary[:1000],
                sources=[source], provider_observation=summary,
            ))
        return output
