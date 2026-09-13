from __future__ import annotations

import re
import unicodedata
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from app.models.awareness import ForbiddenCorpus, InternalRecord, InternalScope, Watch
from app.services.vault import VaultService


_EMAIL = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE)
_ID_KEYS = {"product_id", "product_ids", "matter_id", "decision_id", "mitigation_id"}
_IDENTITY_KEYS = {
    "company_name", "aliases", "alias", "products", "product", "product_name",
    "product_names", "service_name",
}


class InternalKnowledgeService:
    """Loads private knowledge directly from the vault on every call."""

    def __init__(self, vault: VaultService):
        self.vault = vault

    def snapshot(self, internal_scope: InternalScope) -> "InternalSnapshot":
        from app.models.awareness import InternalSnapshot

        records: dict[str, InternalRecord] = {}
        warnings: list[str] = []

        def add(path: str, record_type: str, record_id: str | None = None) -> None:
            if path in records or not self.vault.exists(path):
                return
            try:
                document = self.vault.read_document(path)
                metadata = document.get("metadata", {})
                title = str(metadata.get("title") or document["name"])
                rid = record_id or self._record_id(metadata, path)
                text = self._search_text(metadata, str(document.get("content", "")))
                records[path] = InternalRecord(
                    record_id=rid, record_type=record_type, path=path, title=title, text=text
                )
                for linked in self._linked_paths(metadata):
                    add(linked, self._type_for_path(linked))
            except (OSError, UnicodeError, ValueError) as exc:
                warnings.append(f"{path}: {exc}")

        add("00_System/company.md", "policy", "company")
        for path in self._files("02_Company_Knowledge"):
            add(path, self._type_for_path(path))
        for path in internal_scope.company_paths:
            add(path, self._type_for_path(path))

        matter_roots = self._matter_roots(set(internal_scope.matter_ids))
        for root, matter_id in matter_roots:
            for name in ("matter.md", "facts.md"):
                add(f"{root}/{name}", "matter", matter_id)
            for folder in ("documents", "source-documents"):
                for path in self._files(f"{root}/{folder}"):
                    add(path, "document")
            for path in self._files(f"{root}/decisions"):
                data = self.vault.read_markdown(path)["metadata"]
                decision_id = str(data.get("decision_id") or Path(path).stem)
                if not internal_scope.decision_ids or decision_id in internal_scope.decision_ids:
                    add(path, "decision", decision_id)
            for path in self._files(f"{root}/mitigations"):
                data = self.vault.read_markdown(path)["metadata"]
                mitigation_id = str(data.get("mitigation_id") or Path(path).stem)
                if not internal_scope.mitigation_ids or mitigation_id in internal_scope.mitigation_ids:
                    add(path, "mitigation", mitigation_id)

        # Explicit IDs can point outside the selected matter set.
        wanted = set(internal_scope.decision_ids) | set(internal_scope.mitigation_ids)
        if wanted:
            for path in self._files("03_Matters"):
                if "/decisions/" not in path and "/mitigations/" not in path:
                    continue
                data = self.vault.read_markdown(path)["metadata"]
                rid = self._record_id(data, path)
                if rid in wanted:
                    add(path, "decision" if "/decisions/" in path else "mitigation", rid)

        return InternalSnapshot(
            records=list(records.values()), created_at=datetime.now(UTC), warnings=warnings
        )

    def forbidden_corpus(self, watch: Watch) -> ForbiddenCorpus:
        """Build a fail-closed set of normalized private identifiers."""
        terms: set[str] = set()
        fragments: set[str] = set()
        paths = [*(["00_System/company.md"] if self.vault.exists("00_System/company.md") else []), *self._files("02_Company_Knowledge"), *self._files("03_Matters")]
        for path in paths:
            self._add_variants(fragments, path)
            document = self.vault.read_document(path)  # A read or parse failure must propagate.
            metadata = document.get("metadata", {})
            content = str(document.get("content", ""))
            for key, value in self._walk(metadata):
                if key in _IDENTITY_KEYS:
                    for item in self._strings(value):
                        self._add_variants(terms, item)
                elif key in _ID_KEYS:
                    for item in self._strings(value):
                        self._add_variants(fragments, item)
            for email in _EMAIL.findall(self._search_text(metadata, content)):
                self._add_variants(fragments, email)
            for excerpt in self._distinctive_excerpts(content):
                self._add_variants(fragments, excerpt)

        scope = watch.internal_scope
        for item in [*scope.product_ids, *scope.matter_ids, *scope.decision_ids, *scope.mitigation_ids, *scope.company_paths]:
            self._add_variants(fragments, item)
        for path in scope.company_paths:
            self.vault.read_document(path)  # Prove each configured path is readable.

        term_values = tuple(sorted(value for value in terms if value))
        fragment_values = tuple(sorted(value for value in fragments if value))
        return ForbiddenCorpus(
            terms=term_values,
            fragments=fragment_values,
            proved_no_private_identifiers=not term_values and not fragment_values,
        )

    def _files(self, root: str) -> list[str]:
        return sorted(self.vault.relative(path) for path in self.vault.iter_files(root))

    def _matter_roots(self, wanted: set[str]) -> list[tuple[str, str]]:
        roots: list[tuple[str, str]] = []
        for path in self._files("03_Matters"):
            if not path.endswith("/matter.md"):
                continue
            data = self.vault.read_markdown(path)["metadata"]
            matter_id = str(data.get("matter_id") or Path(path).parent.name)
            if not wanted or matter_id in wanted:
                roots.append((str(Path(path).parent.as_posix()), matter_id))
        return roots

    @staticmethod
    def _record_id(metadata: dict[str, Any], path: str) -> str:
        for key in ("decision_id", "mitigation_id", "matter_id", "product_id", "policy_id", "document_id"):
            if metadata.get(key):
                return str(metadata[key])
        return path

    @staticmethod
    def _type_for_path(path: str) -> str:
        if "/decisions/" in path:
            return "decision"
        if "/mitigations/" in path:
            return "mitigation"
        if path.startswith("03_Matters/"):
            return "document"
        if "product" in path.lower():
            return "product"
        return "policy"

    @staticmethod
    def _linked_paths(metadata: dict[str, Any]) -> list[str]:
        value = metadata.get("linked_paths", [])
        return [str(item) for item in value] if isinstance(value, list) else []

    @staticmethod
    def _search_text(metadata: dict[str, Any], content: str) -> str:
        return f"{metadata}\n{content}".strip()

    @staticmethod
    def _walk(value: Any, key: str = ""):
        if isinstance(value, dict):
            for child_key, child in value.items():
                yield from InternalKnowledgeService._walk(child, str(child_key).lower())
        else:
            yield key, value

    @staticmethod
    def _strings(value: Any) -> list[str]:
        if isinstance(value, str):
            return [value]
        if isinstance(value, (list, tuple, set)):
            return [str(item) for item in value if isinstance(item, (str, int))]
        return [str(value)] if isinstance(value, int) else []

    @staticmethod
    def _add_variants(values: set[str], value: str) -> None:
        clean = " ".join(value.split())
        if not clean:
            return
        folded = unicodedata.normalize("NFKC", clean).casefold()
        values.update({clean, clean.lower(), clean.upper(), folded})

    @staticmethod
    def _distinctive_excerpts(content: str) -> list[str]:
        lines = [" ".join(line.lstrip("#-* ").split()) for line in content.splitlines()]
        return [line[:240] for line in lines if 48 <= len(line) <= 240 and len(set(line.casefold().split())) >= 7][:8]
