"""Resumable, page-preserving extraction for the source library.

The child process writes one small text file per page plus a durable progress
record. It never returns page bodies through stdout, so a 1,000-page source
costs the parent one small JSON summary per invocation.
"""
from __future__ import annotations

import asyncio
import json
import os
import signal
import subprocess
import sys
from pathlib import Path

from app.models.source_library import MAX_LIBRARY_PAGES, MAX_SECTION_CHARS, MAX_UNIT_CHARS, MAX_SOURCE_CHARS

INVOCATION_SECONDS = 45
MAX_OCR_PAGES = 6
OCR_SECONDS = 8


def page_file(staging: Path, page: int) -> Path:
    return staging / f"p{page:06d}.txt"


def extract_pages(pdf_path: str, staging: str, start_page: int, target_page: int | None) -> dict:
    """Extract native text (and bounded OCR) into per-page files under staging."""
    import pymupdf as fitz

    directory = Path(staging)
    directory.mkdir(parents=True, exist_ok=True)
    progress_path = directory / "progress.json"
    progress = json.loads(progress_path.read_text()) if progress_path.exists() else {"pages": [], "warnings": []}
    done = {entry["page"] for entry in progress["pages"] if entry.get("complete", entry.get("method") != "unread" and "ceiling" not in entry.get("warning", ""))}
    document = fitz.open(stream=Path(pdf_path).read_bytes())
    if document.needs_pass:
        progress["warnings"].append("Encrypted document needs a password; no text extracted.")
        progress.update(page_count=0, next_page=None, state="unavailable")
        _save(progress_path, progress)
        return _summary(progress)
    count = min(len(document), MAX_LIBRARY_PAGES)
    progress["page_count"] = len(document)
    if len(document) > MAX_LIBRARY_PAGES:
        progress["warnings"].append(f"Source has {len(document)} pages; this build extracts the first {MAX_LIBRARY_PAGES}.")
    order = [target_page] if target_page else list(range(max(1, start_page), count + 1))
    ocr_used = 0
    stored_chars = sum(entry.get("chars", 0) for entry in progress["pages"])
    for number in order:
        if number in done or number < 1 or number > count:
            continue
        previous = next((entry for entry in progress["pages"] if entry["page"] == number), {})
        allowance = MAX_SOURCE_CHARS - stored_chars + previous.get("chars", 0)
        if allowance <= 1:
            progress["warnings"].append("Source storage ceiling reached; remaining pages are not extracted.")
            break
        method, warning, image, complete = "pdf_text", "", None, True
        try:
            page = document[number - 1]
            text = page.get_text("text")
            image_area = sum(
                max(0, block["bbox"][2] - block["bbox"][0]) * max(0, block["bbox"][3] - block["bbox"][1])
                for block in page.get_text("dict")["blocks"] if block.get("type") == 1
            )
            if len(text.strip()) < 40 or image_area > page.rect.width * page.rect.height * 0.3:
                if ocr_used >= MAX_OCR_PAGES:
                    progress["next_page"] = number
                    progress["warnings"].append(f"Page {number}: OCR budget for this invocation is spent.")
                    break
                ocr_used += 1
                scale = min(2, 3500 / max(page.rect.width, page.rect.height))
                pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
                image = str(directory / f"p{number:06d}.png")
                pixmap.save(image)
                try:
                    completed = subprocess.run(["tesseract", image, "stdout", "--psm", "6"],
                                               capture_output=True, timeout=OCR_SECONDS, check=True)
                    text, method = completed.stdout.decode("utf-8", errors="replace"), "ocr"
                    warning = "OCR may misread numbers or negation; check the page image."
                except (FileNotFoundError, subprocess.SubprocessError):
                    method, warning, complete = "unread", "OCR unavailable or failed; the page image is retained.", False
                    text = text if text.strip() else ""
            if method == "ocr" and not text.strip():
                method, warning, complete = "unread", "OCR returned no text; the page image is retained.", False
            cap = min(MAX_UNIT_CHARS, allowance)
            if len(text.strip()) + 1 > cap:
                text, warning, complete = text.strip()[:max(0, cap - 1)], "Page or source character ceiling reached; retained text is partial.", False
        except Exception as exc:  # A single bad page must not lose the rest.
            text, method, warning, complete = "", "unread", f"Extraction failed: {type(exc).__name__}.", False
        page_file(directory, number).write_text(text, encoding="utf-8")
        chars = len(text.strip()) + 1
        stored_chars += chars - previous.get("chars", 0)
        progress["pages"] = [entry for entry in progress["pages"] if entry["page"] != number]
        progress["pages"].append({"page": number, "method": method, "warning": warning,
                                  "image": image, "chars": chars, "complete": complete})
        progress["pages"].sort(key=lambda entry: entry["page"])
        if complete:
            done.add(number)
        _save(progress_path, progress)
    remaining = [number for number in range(1, count + 1) if number not in done]
    progress["next_page"] = remaining[0] if remaining else None
    progress["unread_pages"] = len(document) - len(done)
    progress["state"] = "partial" if progress["unread_pages"] else "complete"
    _save(progress_path, progress)
    return _summary(progress)


def _save(path: Path, progress: dict) -> None:
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(progress), encoding="utf-8")
    temporary.replace(path)


def _summary(progress: dict) -> dict:
    return {key: progress.get(key) for key in ("page_count", "next_page", "unread_pages", "state", "warnings")} | {
        "extracted": len(progress.get("pages", []))}


async def run_page_extraction(pdf_path: Path, staging: Path, *, start_page: int = 1, target_page: int | None = None) -> dict:
    """Run one bounded extraction invocation. Completed pages survive a timeout."""
    staging.mkdir(parents=True, exist_ok=True)
    process = await asyncio.create_subprocess_exec(
        sys.executable, "-m", __name__, str(pdf_path), str(staging), str(start_page), str(target_page or 0),
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.DEVNULL, start_new_session=True)
    timed_out = False
    try:
        stdout, _ = await asyncio.wait_for(process.communicate(), INVOCATION_SECONDS)
        if process.returncode == 0 and len(stdout) <= 200_000:
            try:
                return json.loads(stdout)
            except ValueError:
                pass
    except asyncio.TimeoutError:
        timed_out = True
    finally:
        if process.returncode is None:
            os.killpg(process.pid, signal.SIGKILL)
            await process.wait()
    progress_path = staging / "progress.json"
    progress = json.loads(progress_path.read_text()) if progress_path.exists() else {"pages": [], "warnings": []}
    progress["state"] = "partial"
    if timed_out:
        progress.setdefault("warnings", []).append(
            f"Extraction reached its {INVOCATION_SECONDS}-second limit; completed pages and the original file remain available.")
    else:
        progress.setdefault("warnings", []).append("Extraction ended early; completed pages remain available.")
    return _summary(progress)


def html_storage_text(raw: str) -> str:
    """Extract admitted HTML with block boundaries, independently of model read caps."""
    from html.parser import HTMLParser
    class Blocks(HTMLParser):
        def __init__(self):
            super().__init__()
            self.parts, self.hidden = [], 0
        def handle_starttag(self, tag, attrs):
            if tag in {"script", "style", "noscript"}:
                self.hidden += 1
            if not self.hidden and tag in {"p", "div", "section", "article", "li", "br", "tr", "h1", "h2", "h3", "h4", "h5", "h6"}:
                self.parts.append("\n\n")
        def handle_endtag(self, tag):
            if tag in {"script", "style", "noscript"}:
                self.hidden = max(0, self.hidden - 1)
            elif not self.hidden and tag in {"p", "div", "section", "article", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6"}:
                self.parts.append("\n\n")
        def handle_data(self, data):
            if not self.hidden:
                self.parts.append(" ".join(data.split()) + " ")
    parser = Blocks()
    parser.feed(raw)
    return "\n\n".join(block.strip() for block in "".join(parser.parts).split("\n\n") if block.strip())


def split_sections(text: str) -> list[dict]:
    """Split reflowable text into deterministic storage units at paragraph edges."""
    paragraphs = [block for block in text.split("\n\n")]
    units: list[dict] = []
    current: list[str] = []
    size = 0

    def flush(continues_next: bool = False) -> None:
        nonlocal current, size
        if not current:
            return
        units.append({"text": "\n\n".join(current), "continues_next": continues_next,
                      "continues_previous": bool(units) and units[-1]["continues_next"]})
        current, size = [], 0

    for paragraph in paragraphs:
        if len(paragraph) > MAX_SECTION_CHARS:
            flush()
            for index in range(0, len(paragraph), MAX_SECTION_CHARS):
                chunk = paragraph[index:index + MAX_SECTION_CHARS]
                units.append({"text": chunk, "continues_next": index + MAX_SECTION_CHARS < len(paragraph),
                              "continues_previous": index > 0})
            continue
        addition = len(paragraph) + (2 if current else 0)
        if size + addition > MAX_SECTION_CHARS:
            flush()
            addition = len(paragraph)
        current.append(paragraph)
        size += addition
    flush()
    return units or [{"text": text, "continues_next": False, "continues_previous": False}]


if __name__ == "__main__":
    try:
        target = int(sys.argv[4]) or None
        print(json.dumps(extract_pages(sys.argv[1], sys.argv[2], int(sys.argv[3]), target)))
    except Exception as exc:
        print(json.dumps({"state": "unavailable", "warnings": [f"Extraction failed: {type(exc).__name__}."],
                          "page_count": None, "next_page": None, "unread_pages": 0, "extracted": 0}))
