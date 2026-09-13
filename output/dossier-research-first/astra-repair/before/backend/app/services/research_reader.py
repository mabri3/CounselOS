"""Read public sources with bounded, DNS-checked fetches and optional fallbacks."""
import hashlib
from datetime import UTC, datetime
from html.parser import HTMLParser

import httpx

from app.intelligence.fetch import SafeHttpFetcher, UnsafeUrlError, ALLOWED_CONTENT_TYPES
from app.models.awareness import SafeFetchLimits


class PageText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.hidden = 0
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            href = dict(attrs).get("href")
            if href:
                self.links.append(href)
        if tag in {"script", "style", "noscript"}:
            self.hidden += 1

    def handle_endtag(self, tag):
        if tag in {"script", "style", "noscript"}:
            self.hidden = max(0, self.hidden - 1)

    def handle_data(self, data):
        if not self.hidden and data.strip():
            self.parts.append(data.strip())


def plain_text(text):
    parser = PageText()
    parser.feed(text)
    return " ".join(parser.parts)


async def browser_read(url):
    from playwright.async_api import async_playwright
    # Every browser request is fetched through the existing DNS-pinned fetcher.
    # The browser itself never makes network connections or uses saved sessions.
    fetcher = SafeHttpFetcher(allowed_content_types={"text/html", "text/plain", "text/css", "application/javascript", "text/javascript", "application/json"})
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        try:
            context = await browser.new_context(service_workers="block", accept_downloads=False)
            async def route_request(route):
                if route.request.method != "GET":
                    await route.abort()
                    return
                try:
                    fetched = await fetcher.fetch(route.request.url, SafeFetchLimits(
                        run_timeout_seconds=8, request_timeout_seconds=5, max_excerpt_characters=200000))
                    await route.fulfill(status=200, content_type=fetched.content_type, body=fetched.excerpt)
                except Exception:
                    await route.abort()
            await context.route("**/*", route_request)
            await context.route_web_socket("**/*", lambda socket: socket.close())
            page = await context.new_page()
            await page.goto(url, wait_until="networkidle", timeout=15000)
            return (await page.locator("body").inner_text())[:100001]
        finally:
            await browser.close()


async def read_source(url, settings, *, allow_firecrawl=False, source_directory=None, cache_path=None, on_fetched=None, fallback_call=None):
    fetcher = SafeHttpFetcher(allowed_content_types=ALLOWED_CONTENT_TYPES | {"application/pdf", "application/octet-stream", "image/png", "image/jpeg", "image/tiff"})
    fetcher._validate_url(url)
    text, method = "", "direct_fetch"
    upstream_truncated = False
    links = []
    from pathlib import Path
    from app.services.vault import VaultService
    from app.intelligence.fetch import BinaryFetchResult
    vault = VaultService(Path(settings.vault_path))
    cache = vault.read_markdown(cache_path)["metadata"] if cache_path and vault.exists(cache_path) else None
    def save_result(result):
        if cache_path and vault.exists(cache_path):
            vault.update_markdown(cache_path, metadata_updates={"extracted_result": result})
        return result
    if cache and cache.get("extracted_result"):
        binary = vault.resolve(cache["binary_path"]).read_bytes()
        if cache.get("url") != url or hashlib.sha256(binary).hexdigest() != cache["binary_hash"]:
            raise ValueError("Saved fetched source changed.")
        return cache["extracted_result"]
    durable_write_failed = False
    try:
        if cache:
            binary = vault.resolve(cache["binary_path"]).read_bytes()
            if cache.get("url") != url or hashlib.sha256(binary).hexdigest() != cache["binary_hash"]:
                raise UnsafeUrlError("Saved fetched source hash changed.")
            fetched = BinaryFetchResult(url, cache["final_url"], cache["content_type"], binary, cache.get("charset", "utf-8"))
        else:
            fetched = await fetcher.fetch_binary(url, SafeFetchLimits(run_timeout_seconds=10, request_timeout_seconds=5, max_excerpt_characters=100001))
            durable_write_failed = True
            if cache_path:
                binary_path = vault.write_bytes(cache_path + ".bin", fetched.body)
                vault.write_markdown(cache_path, "Fetched source bytes; extraction is separate.", {"record_type": "research_fetch", "url": url, "final_url": fetched.final_url, "content_type": fetched.content_type, "charset": fetched.charset, "binary_path": binary_path, "binary_hash": hashlib.sha256(fetched.body).hexdigest()})
            if on_fetched:
                on_fetched()
            durable_write_failed = False
        binary = fetched.body
        if binary.startswith(b"%PDF-") or fetched.content_type == "application/pdf" or fetched.content_type.startswith("image/"):
            from app.services.research_documents import extract_document
            extracted = await extract_document(binary, settings, source_key=hashlib.sha256(binary).hexdigest(), source_directory=source_directory)
            sections, pages, offset = [], [], 0
            for page in extracted["pages"]:
                section = f"Page {page['page']} ({page['method']})\n{page['text']}\n"
                if offset + len(section) > 100000:
                    extracted["content_truncated"] = True
                    break
                pages.append({**page, "start": offset, "end": offset + len(section)})
                sections.append(section)
                offset += len(section)
            text = "".join(sections)
            return save_result({"content": text, "retrieved_content": text, "available_excerpt": text[:1200],
                    "support_state": "retrieved" if any(p["text"].strip() for p in pages) else "unverified_lead",
                    "retrieved_at": datetime.now(UTC).isoformat(), "source_hash": hashlib.sha256(text.encode()).hexdigest(),
                    "retrieval_method": "document_extraction", "pages": pages, "extraction_warnings": extracted["warnings"],
                    "original_file_path": extracted.get("original_file_path"), "final_url": fetched.final_url,
                    "content_truncated": extracted["content_truncated"]})
        if fetched.content_type == "application/octet-stream":
            raise ValueError("Unsupported binary source")
        decoded = binary.decode(fetched.charset, errors="replace")
        upstream_truncated = len(decoded) > 100000
        if fetched.content_type == "text/html":
            from urllib.parse import urljoin
            parser = PageText()
            parser.feed(decoded)
            links = list(dict.fromkeys(urljoin(fetched.final_url, link) for link in parser.links if not link.startswith(("javascript:", "data:"))))[:100]
        text = plain_text(decoded) if fetched.content_type == "text/html" else decoded
    except UnsafeUrlError:
        raise
    except Exception:
        if durable_write_failed:
            raise
    if len(text.strip()) < 200:
        try:
            text = await fallback_call("browser", lambda: browser_read(url)) if fallback_call else await browser_read(url)
            method = "playwright"
        except Exception:
            pass
    if len(text.strip()) < 200 and allow_firecrawl and settings.firecrawl_api_key:
        async def scrape():
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post("https://api.firecrawl.dev/v2/scrape",
                    headers={"Authorization": f"Bearer {settings.firecrawl_api_key}"},
                    json={"url": url, "formats": ["markdown"]})
                response.raise_for_status()
                payload = response.json()
                return str(payload.get("data", {}).get("markdown", ""))[:100001] if payload.get("success") is True else ""
        scraped = await fallback_call("firecrawl", scrape) if fallback_call else await scrape()
        if scraped:
            text, method = scraped, "firecrawl"
    if len(text.strip()) < 200:
        raise ValueError("No readable page content retrieved")
    content_truncated = upstream_truncated or len(text) > 100000
    text = text[:100000]
    return save_result({"content": text, "retrieved_content": text, "available_excerpt": text,
            "support_state": "retrieved", "retrieved_at": datetime.now(UTC).isoformat(),
            "source_hash": hashlib.sha256(text.encode()).hexdigest(), "retrieval_method": method,
            "content_truncated": content_truncated, "links": links})
