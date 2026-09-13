"""Bounded local PDF/image extraction. Runs in a disposable child process."""
import asyncio
import json
import os
from pathlib import Path
import signal
import subprocess
import sys

MAX_BYTES = 5 * 1024 * 1024
MAX_PAGES = 30
MAX_OCR_PAGES = 6


def extract_local(path, output_dir):
    import pymupdf as fitz
    document = fitz.open(path)
    if document.needs_pass:
        return {"pages": [], "warnings": ["Encrypted document needs a password; no evidence extracted."], "content_truncated": True}
    progress_path = Path(output_dir) / "extraction-progress.json"
    progress = json.loads(progress_path.read_text()) if progress_path.exists() else {}
    pages, warnings, ocr_count = progress.get("pages", []), progress.get("warnings", []), progress.get("ocr_pages", 0)
    count = min(len(document), MAX_PAGES)
    for index in range(len(pages), count):
        try:
            page = document[index]
            text = page.get_text("text")
            method, image_path = "pdf_text", None
            image_area = sum(max(0, block["bbox"][2] - block["bbox"][0]) * max(0, block["bbox"][3] - block["bbox"][1])
                             for block in page.get_text("dict")["blocks"] if block.get("type") == 1)
            if len(text.strip()) < 40 or image_area > page.rect.width * page.rect.height * 0.3:
                if ocr_count >= MAX_OCR_PAGES:
                    warnings.append(f"Page {index + 1}: OCR budget exhausted.")
                    pages.append({"page": index + 1, "text": text, "method": "unread", "warning": "OCR limit"})
                    continue
                ocr_count += 1
                scale = min(2, 3500 / max(page.rect.width, page.rect.height))
                pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
                image_path = str(Path(output_dir) / f"page-{index + 1}.png")
                pixmap.save(image_path)
                try:
                    result = subprocess.run(["tesseract", image_path, "stdout", "--psm", "6"], capture_output=True, timeout=8, check=True)
                    text, method = result.stdout.decode("utf-8", errors="replace"), "ocr"
                except (FileNotFoundError, subprocess.SubprocessError):
                    warnings.append(f"Page {index + 1}: OCR unavailable or failed; page image retained.")
                    method = "unread"
            pages.append({"page": index + 1, "text": text[:20000], "method": method,
                          "image_path": image_path, "content_truncated": len(text) > 20000,
                          "warning": "OCR may misread numbers or negation; check the page image." if method == "ocr" else ""})
        except Exception as exc:
            pages.append({"page": index + 1, "text": "", "method": "unread", "warning": type(exc).__name__})
            warnings.append(f"Page {index + 1}: extraction failed.")
        finally:
            temporary = progress_path.with_suffix(".tmp")
            temporary.write_text(json.dumps({"pages": pages, "warnings": warnings, "ocr_pages": ocr_count}))
            temporary.replace(progress_path)
    return {"pages": pages, "warnings": warnings, "page_count": len(document), "ocr_pages": ocr_count,
            "content_truncated": len(document) > count or any(p.get("content_truncated") or p["method"] == "unread" for p in pages)}


async def extract_document(data, settings, *, source_key, source_directory=None):
    if len(data) > MAX_BYTES:
        raise ValueError("Document exceeds the 5 MB extraction limit.")
    from app.services.vault import VaultService
    vault = VaultService(Path(settings.vault_path))
    relative = f"{source_directory or '00_System/cache/research-pages'}/{source_key}"
    folder = vault.resolve(relative)
    folder.mkdir(parents=True, exist_ok=True)
    input_path = folder / "source.bin"
    # The immutable fetched copy also supports inspection when extraction fails.
    vault.write_bytes(f"{relative}/source.bin", data)
    process = await asyncio.create_subprocess_exec(sys.executable, "-m", __name__, str(input_path), str(folder),
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.DEVNULL, start_new_session=True)
    try:
        stdout, _ = await asyncio.wait_for(process.communicate(), 45)
        if process.returncode or len(stdout) > 1000000:
            raise ValueError("Document extraction failed or exceeded output bounds.")
        result = json.loads(stdout)
        for page in result["pages"]:
            if page.get("image_path"):
                page["image_path"] = vault.relative(Path(page["image_path"]))
        result["original_file_path"] = f"{relative}/source.bin"
        return result
    except asyncio.TimeoutError:
        progress_path = folder / "extraction-progress.json"
        result = json.loads(progress_path.read_text()) if progress_path.exists() else {"pages": [], "warnings": []}
        for page in result["pages"]:
            if page.get("image_path"):
                page["image_path"] = vault.relative(Path(page["image_path"]))
        result["warnings"].append("Document extraction reached its 45-second limit; completed pages and fetched file remain available.")
        return {**result, "original_file_path": f"{relative}/source.bin", "content_truncated": True}
    finally:
        if process.returncode is None:
            os.killpg(process.pid, signal.SIGKILL)
            await process.wait()


if __name__ == "__main__":
    try:
        print(json.dumps(extract_local(sys.argv[1], sys.argv[2])))
    except Exception as exc:
        print(json.dumps({"pages": [], "warnings": [f"Document extraction failed: {type(exc).__name__}."], "content_truncated": True}))
