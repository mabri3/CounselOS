"""Create a deterministic, de-duplicated raw Reddit evidence corpus."""

from __future__ import annotations

import json
from pathlib import Path


RAW_DIR = Path("output/research/raw")
OUT = RAW_DIR / "legal-ai-reddit-source-corpus.jsonl"


def usable(value: object) -> bool:
    return value not in (None, "", "not stated", [], {})


def score(record: dict) -> int:
    return sum(1 for value in record.values() if usable(value))


def normalized_url(value: str) -> str:
    return value.rstrip("/")


def main() -> None:
    grouped: dict[str, list[tuple[Path, dict]]] = {}
    for path in sorted(RAW_DIR.glob("*.jsonl")):
        if path == OUT:
            continue
        for line_number, line in enumerate(path.read_text().splitlines(), 1):
            if not line.strip():
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError as exc:
                raise SystemExit(f"Invalid JSON at {path}:{line_number}: {exc}") from exc
            url = record.get("url")
            if not isinstance(url, str) or not url:
                raise SystemExit(f"Missing URL at {path}:{line_number}")
            grouped.setdefault(normalized_url(url), []).append((path, record))

    consolidated = []
    for source_id, url in enumerate(sorted(grouped), 1):
        records = grouped[url]
        canonical = dict(max((record for _, record in records), key=score))
        canonical["url"] = url
        canonical["source_id"] = f"reddit-{source_id:03d}"
        canonical["raw_record_count"] = len(records)
        canonical["raw_files"] = sorted({path.name for path, _ in records})
        consolidated.append(canonical)

    OUT.write_text("".join(json.dumps(record, ensure_ascii=False, sort_keys=True) + "\n" for record in consolidated))
    print(f"Wrote {len(consolidated)} unique sources to {OUT}")


if __name__ == "__main__":
    main()
