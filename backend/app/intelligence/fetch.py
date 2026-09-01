from __future__ import annotations

import asyncio
import hashlib
import ipaddress
import socket
import ssl
import zlib
from dataclasses import dataclass
from email.message import Message
from urllib.parse import urljoin, urlsplit

from app.models.awareness import SafeFetchLimits, SafeFetchResult


ALLOWED_CONTENT_TYPES = {
    "text/html", "text/plain", "application/rss+xml", "application/atom+xml",
    "application/xml", "text/xml", "application/json", "application/feed+json",
}
REDIRECTS = {301, 302, 303, 307, 308}
RETRYABLE = {429, 500, 502, 503, 504}


class UnsafeUrlError(ValueError):
    pass


@dataclass(frozen=True)
class _Response:
    status: int
    headers: dict[str, str]
    body: bytes


def _approved_ip(raw: str) -> bool:
    ip = ipaddress.ip_address(raw.split("%", 1)[0])
    return not (
        ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast
        or ip.is_reserved or ip.is_unspecified
    )


class SafeHttpFetcher:
    """HTTPS fetcher with DNS pinning and redirect-by-redirect SSRF checks."""

    def __init__(self, *, resolver=None, connector=None, sleeper=asyncio.sleep):
        self._resolver = resolver or self._resolve
        self._connector = connector or self._connect
        self._sleep = sleeper

    async def fetch(self, url: str, limits: SafeFetchLimits | None = None) -> SafeFetchResult:
        limits = limits or SafeFetchLimits()
        requested = url
        current = url
        redirects = 0
        deadline = asyncio.get_running_loop().time() + limits.run_timeout_seconds
        while True:
            parsed = self._validate_url(current)
            response = await self._request_with_retries(parsed, limits, deadline)
            if response.status in REDIRECTS:
                location = response.headers.get("location")
                if not location:
                    raise UnsafeUrlError("redirect response has no location")
                if redirects >= limits.max_redirects:
                    raise UnsafeUrlError("redirect limit exceeded")
                redirects += 1
                current = urljoin(current, location)
                continue
            if response.status >= 400:
                raise RuntimeError(f"HTTP {response.status}")
            content_type = response.headers.get("content-type", "").split(";", 1)[0].strip().lower()
            if content_type not in ALLOWED_CONTENT_TYPES:
                raise ValueError(f"unsupported content type: {content_type or 'missing'}")
            decoded = self._decode(response.body, response.headers.get("content-encoding", ""), limits)
            charset = self._charset(response.headers.get("content-type", ""))
            text = decoded.decode(charset, errors="replace")
            return SafeFetchResult(
                requested_url=requested, final_url=current, status_code=response.status,
                content_type=content_type, content_hash=hashlib.sha256(decoded).hexdigest(),
                excerpt=text[: limits.max_excerpt_characters],
                warnings=["stored excerpt was truncated"] if len(text) > limits.max_excerpt_characters else [],
            )

    @staticmethod
    def _validate_url(url: str):
        parsed = urlsplit(url)
        if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
            raise UnsafeUrlError("only credential-free HTTPS URLs are allowed")
        if parsed.port not in (None, 443):
            raise UnsafeUrlError("only the standard HTTPS port is allowed")
        try:
            literal_ip = ipaddress.ip_address(parsed.hostname.split("%", 1)[0])
        except ValueError:
            literal_ip = None
        if literal_ip is not None and not _approved_ip(str(literal_ip)):
            raise UnsafeUrlError("local or private network targets are blocked")
        return parsed

    async def _request_with_retries(self, parsed, limits, deadline: float) -> _Response:
        last_error: Exception | None = None
        for attempt in range(3):
            remaining = deadline - asyncio.get_running_loop().time()
            if remaining <= 0:
                raise TimeoutError("provider run timeout exceeded")
            try:
                response = await asyncio.wait_for(
                    self._request_once(parsed, limits),
                    timeout=min(limits.request_timeout_seconds, remaining),
                )
                if response.status not in RETRYABLE or attempt == 2:
                    return response
                delay = self._retry_delay(response.headers, attempt)
            except (TimeoutError, asyncio.TimeoutError, ConnectionError, OSError) as exc:
                last_error = exc
                if attempt == 2:
                    raise
                delay = min(0.25 * (2**attempt), 1.0)
            await self._sleep(min(delay, max(0.0, deadline - asyncio.get_running_loop().time())))
        raise RuntimeError("request failed") from last_error

    @staticmethod
    def _retry_delay(headers: dict[str, str], attempt: int) -> float:
        try:
            return min(30.0, max(0.0, float(headers.get("retry-after", ""))))
        except ValueError:
            return min(0.25 * (2**attempt), 1.0)

    async def _request_once(self, parsed, limits: SafeFetchLimits) -> _Response:
        addresses = await self._resolver(parsed.hostname, parsed.port or 443)
        unique = tuple(dict.fromkeys(addresses))
        if not unique or any(not _approved_ip(address) for address in unique):
            raise UnsafeUrlError("DNS returned a local, private, or invalid address")
        selected = unique[0]
        reader, writer = await self._connector(selected, parsed.port or 443, parsed.hostname)
        try:
            peer = writer.get_extra_info("peername")
            if peer and ipaddress.ip_address(str(peer[0]).split("%", 1)[0]) != ipaddress.ip_address(selected.split("%", 1)[0]):
                raise UnsafeUrlError("connected peer differs from the approved DNS address")
            target = parsed.path or "/"
            if parsed.query:
                target += "?" + parsed.query
            request = (
                f"GET {target} HTTP/1.1\r\nHost: {parsed.hostname}\r\n"
                "Accept: text/html,text/plain,application/rss+xml,application/atom+xml,application/json\r\n"
                "Accept-Encoding: gzip, deflate\r\nConnection: close\r\nUser-Agent: Themis.ai/1\r\n\r\n"
            )
            writer.write(request.encode("ascii"))
            await writer.drain()
            head = await reader.readuntil(b"\r\n\r\n")
            status, headers = self._parse_head(head)
            body = await self._read_body(reader, headers, limits.max_compressed_bytes)
            return _Response(status, headers, body)
        finally:
            writer.close()
            try:
                await writer.wait_closed()
            except Exception:
                pass

    @staticmethod
    async def _resolve(host: str, port: int) -> list[str]:
        infos = await asyncio.get_running_loop().getaddrinfo(host, port, type=socket.SOCK_STREAM)
        return [info[4][0] for info in infos]

    @staticmethod
    async def _connect(ip: str, port: int, hostname: str):
        context = ssl.create_default_context()
        return await asyncio.open_connection(ip, port, ssl=context, server_hostname=hostname)

    @staticmethod
    def _parse_head(head: bytes) -> tuple[int, dict[str, str]]:
        lines = head.decode("iso-8859-1").split("\r\n")
        parts = lines[0].split(" ", 2)
        if len(parts) < 2 or not parts[1].isdigit():
            raise ConnectionError("invalid HTTP response")
        headers: dict[str, str] = {}
        for line in lines[1:]:
            if ":" in line:
                key, value = line.split(":", 1)
                headers[key.strip().lower()] = value.strip()
        return int(parts[1]), headers

    @staticmethod
    async def _read_body(reader, headers: dict[str, str], cap: int) -> bytes:
        if headers.get("transfer-encoding", "").lower() == "chunked":
            chunks = bytearray()
            while True:
                size_line = await reader.readline()
                size = int(size_line.split(b";", 1)[0], 16)
                if size == 0:
                    await reader.readline()
                    break
                if len(chunks) + size > cap:
                    raise ValueError("compressed response exceeds size limit")
                chunks.extend(await reader.readexactly(size))
                await reader.readexactly(2)
            return bytes(chunks)
        length = headers.get("content-length")
        if length is not None:
            try:
                expected = int(length)
            except ValueError as exc:
                raise ConnectionError("invalid Content-Length header") from exc
            if expected < 0:
                raise ConnectionError("invalid Content-Length header")
            if expected > cap:
                raise ValueError("compressed response exceeds size limit")
            try:
                return await reader.readexactly(expected)
            except asyncio.IncompleteReadError as exc:
                raise ConnectionError(
                    f"response ended before Content-Length: expected {expected} bytes, "
                    f"received {len(exc.partial)}"
                ) from exc

        body = bytearray()
        while True:
            chunk = await reader.read(min(64 * 1024, cap - len(body) + 1))
            if not chunk:
                return bytes(body)
            body.extend(chunk)
            if len(body) > cap:
                raise ValueError("compressed response exceeds size limit")

    @staticmethod
    def _decode(body: bytes, encoding: str, limits: SafeFetchLimits) -> bytes:
        encoding = encoding.lower().strip()
        if encoding == "gzip":
            inflater = zlib.decompressobj(16 + zlib.MAX_WBITS)
            decoded = inflater.decompress(body, limits.max_decompressed_bytes + 1)
            if inflater.unconsumed_tail or len(decoded) > limits.max_decompressed_bytes:
                raise ValueError("decompressed response exceeds size limit")
            decoded += inflater.flush(limits.max_decompressed_bytes + 1 - len(decoded))
        elif encoding == "deflate":
            inflater = zlib.decompressobj()
            decoded = inflater.decompress(body, limits.max_decompressed_bytes + 1)
            if inflater.unconsumed_tail or len(decoded) > limits.max_decompressed_bytes:
                raise ValueError("decompressed response exceeds size limit")
            decoded += inflater.flush(limits.max_decompressed_bytes + 1 - len(decoded))
        elif encoding in {"", "identity"}:
            decoded = body
        else:
            raise ValueError(f"unsupported content encoding: {encoding}")
        if len(decoded) > limits.max_decompressed_bytes:
            raise ValueError("decompressed response exceeds size limit")
        return decoded

    @staticmethod
    def _charset(content_type: str) -> str:
        message = Message()
        message["content-type"] = content_type
        return message.get_content_charset() or "utf-8"
