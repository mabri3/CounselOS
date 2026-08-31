from __future__ import annotations

import asyncio
import gzip
from datetime import datetime, timezone

import pytest

from app.intelligence.fetch import SafeHttpFetcher, UnsafeUrlError, _Response
from app.intelligence.outbound_policy import OutboundQueryPolicy, PublicResearchQuery
from app.intelligence.source_support import SourceSupportService
from app.models.awareness import (
    ForbiddenCorpus, PublicEntity, PublicWatchQuery, SafeFetchLimits, SafeFetchResult,
    SourceReference, Watch,
)


def watch_with(field: str, value: str, *, public_entities=()):
    fields = dict(
        standing_question="Public privacy updates", keywords=[], topics=[], jurisdictions=[],
        regulators=[], courts=[], industries=[], public_source_urls=[], public_entities=list(public_entities),
    )
    if field == "standing_question":
        fields[field] = value
    elif field == "public_source_urls":
        fields[field] = [value]
    elif field == "public_entities":
        fields[field] = [PublicEntity(name=value, explicitly_public=True)]
    else:
        fields[field] = [value]
    now = datetime.now(timezone.utc)
    return Watch(
        watch_id="w", path="w.md", title="W", standing_question=fields["standing_question"],
        public_query=PublicWatchQuery(**fields), purposes=["awareness"], created_at=now, updated_at=now,
    )


@pytest.mark.parametrize("field", [
    "standing_question", "keywords", "topics", "jurisdictions", "regulators", "courts",
    "industries",
])
def test_policy_checks_every_text_field_with_unicode_and_case(field):
    corpus = ForbiddenCorpus(terms=("Café Secret",))
    with pytest.raises(ValueError):
        OutboundQueryPolicy().prepare(watch_with(field, "CAFE\u0301 SECRET"), corpus)


@pytest.mark.parametrize("value", ["lawyer@private.example", "MATTER-ABC123", "/vault/03_Matters/secret", "distinctive internal excerpt"])
def test_policy_rejects_email_ids_paths_and_excerpts_before_any_network(value):
    corpus = ForbiddenCorpus(terms=("distinctive internal excerpt",))
    with pytest.raises(ValueError):
        OutboundQueryPolicy().prepare(watch_with("standing_question", value), corpus)


def test_explicit_public_entity_can_pass_even_if_name_is_in_local_corpus():
    entity = PublicEntity(name="Public Corp", entity_type="company", explicitly_public=True)
    watch = watch_with("standing_question", "Track Public Corp", public_entities=(entity,))
    outbound = OutboundQueryPolicy().prepare(watch, ForbiddenCorpus(terms=("PUBLIC CORP",)))
    assert outbound.public_entities[0].name == "Public Corp"


def test_policy_checks_public_source_urls_against_corpus():
    with pytest.raises(ValueError):
        OutboundQueryPolicy().prepare(
            watch_with("public_source_urls", "https://private-alias.example/public"),
            ForbiddenCorpus(terms=("PRIVATE-ALIAS",)),
        )


def test_matter_research_uses_same_private_data_policy_as_watches():
    policy = OutboundQueryPolicy()
    corpus = ForbiddenCorpus(terms=("Private Product",), fragments=("MAT-PRIVATE-123",))

    safe = policy.prepare_public(
        PublicResearchQuery(
            question="What public federal rules govern customer due diligence?",
            jurisdictions=("United States",),
        ),
        corpus,
    )

    assert safe.standing_question.startswith("What public federal rules")
    with pytest.raises(ValueError, match="private"):
        policy.prepare_public(
            PublicResearchQuery(question="What rules apply to MAT-PRIVATE-123?"),
            corpus,
        )
    with pytest.raises(ValueError, match="private company context"):
        policy.prepare_public(
            PublicResearchQuery(question="What rules apply to Private Product?"),
            corpus,
        )


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("standing_question", "What new EU rules affect online platform liability?"),
        ("standing_question", "What consumer credit regulations changed this quarter?"),
        ("topics", "platform governance"),
    ],
)
def test_demo_vault_classifications_do_not_block_public_legal_queries(
    app_context, field, value
):
    watch = watch_with(field, value)
    corpus = app_context.internal_knowledge.forbidden_corpus(watch)

    outbound = OutboundQueryPolicy().prepare(watch, corpus)

    if field == "standing_question":
        assert outbound.standing_question == value
    else:
        assert outbound.topics == (value,)


class ScriptedFetcher(SafeHttpFetcher):
    def __init__(self, responses):
        super().__init__(sleeper=lambda _: done())
        self.responses = list(responses)
        self.calls = 0

    async def _request_once(self, parsed, limits):
        self.calls += 1
        item = self.responses.pop(0)
        if isinstance(item, Exception):
            raise item
        return item


async def done():
    return None


@pytest.mark.asyncio
async def test_fetch_retry_bounds_and_400_behavior():
    limits = SafeFetchLimits()
    no_retry = ScriptedFetcher([_Response(400, {"content-type": "text/plain"}, b"bad")])
    with pytest.raises(RuntimeError, match="400"):
        await no_retry.fetch("https://example.com", limits)
    assert no_retry.calls == 1

    retry = ScriptedFetcher([
        _Response(429, {"retry-after": "0"}, b""),
        _Response(200, {"content-type": "text/plain"}, b"ok"),
    ])
    assert (await retry.fetch("https://example.com", limits)).excerpt == "ok"
    assert retry.calls == 2

    failures = ScriptedFetcher([ConnectionError("x"), TimeoutError("x"), _Response(500, {}, b"")])
    with pytest.raises(RuntimeError, match="500"):
        await failures.fetch("https://example.com", limits)
    assert failures.calls == 3


@pytest.mark.asyncio
async def test_fetch_content_type_compressed_decompressed_and_excerpt_caps():
    with pytest.raises(ValueError, match="content type"):
        await ScriptedFetcher([_Response(200, {"content-type": "image/png"}, b"x")]).fetch("https://example.com")
    limits = SafeFetchLimits(max_compressed_bytes=20, max_decompressed_bytes=4, max_excerpt_characters=3)
    with pytest.raises(ValueError, match="decompressed"):
        await ScriptedFetcher([_Response(200, {"content-type": "text/plain", "content-encoding": "gzip"}, gzip.compress(b"12345"))]).fetch("https://example.com", limits)
    result = await ScriptedFetcher([_Response(200, {"content-type": "text/plain"}, b"abcdef")]).fetch(
        "https://example.com", SafeFetchLimits(max_excerpt_characters=3)
    )
    assert result.excerpt == "abc"
    assert result.warnings


@pytest.mark.asyncio
@pytest.mark.parametrize("headers", [{"content-length": "11"}, {}])
async def test_non_chunked_body_waits_for_all_stream_segments(headers):
    reader = asyncio.StreamReader()
    reader.feed_data(b"hello ")

    async def feed_later():
        await asyncio.sleep(0)
        reader.feed_data(b"world")
        reader.feed_eof()

    feeder = asyncio.create_task(feed_later())
    body = await SafeHttpFetcher._read_body(reader, headers, cap=32)
    await feeder

    assert body == b"hello world"


@pytest.mark.asyncio
@pytest.mark.parametrize("headers", [{"content-length": "4"}, {}])
async def test_non_chunked_body_rejects_over_cap_stream(headers):
    reader = asyncio.StreamReader()
    reader.feed_data(b"four")
    reader.feed_eof()

    with pytest.raises(ValueError, match="compressed response exceeds size limit"):
        await SafeHttpFetcher._read_body(reader, headers, cap=3)


def test_fetch_rejects_unsafe_schemes_ports_and_literal_networks():
    for url in ("file:///tmp/x", "http://example.com", "https://127.0.0.1", "https://169.254.1.1", "https://example.com:444"):
        with pytest.raises(UnsafeUrlError):
            SafeHttpFetcher._validate_url(url)


@pytest.mark.asyncio
async def test_fetch_rejects_mixed_dns_and_peer_change():
    async def mixed(host, port):
        return ["93.184.216.34", "10.0.0.1"]

    fetcher = SafeHttpFetcher(resolver=mixed)
    with pytest.raises(UnsafeUrlError, match="DNS"):
        await fetcher._request_once(SafeHttpFetcher._validate_url("https://example.com"), SafeFetchLimits())

    class Writer:
        def get_extra_info(self, key): return ("93.184.216.35", 443)
        def close(self): pass
        async def wait_closed(self): pass

    async def resolver(host, port): return ["93.184.216.34"]
    async def connector(ip, port, hostname): return object(), Writer()
    with pytest.raises(UnsafeUrlError, match="peer"):
        await SafeHttpFetcher(resolver=resolver, connector=connector)._request_once(
            SafeHttpFetcher._validate_url("https://example.com"), SafeFetchLimits()
        )


@pytest.mark.asyncio
async def test_redirect_is_revalidated_and_private_target_is_blocked():
    fetcher = ScriptedFetcher([_Response(302, {"location": "https://127.0.0.1/private"}, b"")])
    with pytest.raises(UnsafeUrlError):
        await fetcher.fetch("https://example.com")
    assert fetcher.calls == 1


class SupportFetcher:
    def __init__(self, text): self.text = text
    async def fetch(self, url, limits):
        return SafeFetchResult(
            requested_url=url, final_url=url, status_code=200, content_type="text/plain",
            content_hash="b" * 64, excerpt=self.text,
        )


@pytest.mark.asyncio
async def test_source_support_is_verified_only_by_stored_claim_or_locator():
    source = SourceReference(title="S", canonical_url="https://example.com", excerpt="specific claim", support_state="supplied")
    verified = await SourceSupportService(SupportFetcher("The specific claim is here.")).check(source)
    assert verified.state == "verified"
    retrieved = await SourceSupportService(SupportFetcher("Other public text")).check(source)
    assert retrieved.state == "retrieved"
