"""Separate saved execution inputs, retaining the exact original source files.

Run from backend: .venv/bin/python scripts/compact_execution_inputs.py --vault /absolute/path --apply
Without --apply, report the proposed size change without writing files.
"""
from __future__ import annotations

import argparse
from hashlib import sha256
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import frontmatter
from app.services.execution_inputs import ExecutionInputs, RECORD_TYPES, ROOT
from app.services.vault import VaultService
from app.vault_manager import VaultManager


def compact(vault: VaultService, *, apply: bool = False) -> list[dict]:
    store = vault.execution_inputs if apply else ExecutionInputs(vault.resolve, lambda path, data: path)
    changes = []
    for path in sorted(vault.iter_files("03_Matters", {".md"})):
        if not path.name.startswith(("CONV-", "RUN-", "DOR-")):
            continue
        relative = vault.relative(path)
        raw = path.read_bytes()
        post = frontmatter.loads(raw.decode())
        if post.metadata.get("record_type") not in RECORD_TYPES:
            continue
        original_metadata = store.restore(post.metadata)
        compact_metadata = store.separate(original_metadata)
        if compact_metadata == post.metadata:
            continue
        updated = frontmatter.dumps(frontmatter.Post(post.content, **compact_metadata)).encode()
        original_hash = sha256(raw).hexdigest()
        backup = f"{ROOT}/originals/{original_hash}.md"
        if apply:
            if store.restore(compact_metadata) != original_metadata:
                raise ValueError(f"Execution input round-trip failed: {relative}")
            if path.read_bytes() != raw:
                raise ValueError(f"Record changed during compaction: {relative}")
            if not vault.exists(backup):
                vault.write_bytes(backup, raw)
            vault.write_bytes(relative, updated)
            restored = vault.read_markdown(relative)
            if restored["metadata"] != original_metadata or restored["content"] != post.content:
                vault.write_bytes(relative, raw)
                raise ValueError(f"Compacted record did not preserve its contents: {relative}")
        item = {"path": relative, "before": len(raw), "after": len(updated),
                "before_sha256": original_hash, "after_sha256": sha256(updated).hexdigest(), "original": backup}
        changes.append(item)
        print(json.dumps(item), flush=True)
    return changes


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vault", type=Path, required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    root = VaultManager(args.vault).load(str(args.vault))
    compact(VaultService(root), apply=args.apply)
