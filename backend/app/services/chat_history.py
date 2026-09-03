from __future__ import annotations

import re
from datetime import date
from typing import Any

from yaml import YAMLError

from app.services.matters import MatterService
from app.services.vault import VaultService
from app.utils.ids import new_id
from app.utils.time import iso_now


_CONVERSATION_ID = re.compile(r"^CONV-\d{8}-[a-f0-9]{6}$")
_DAY = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class ChatHistoryService:
    """Stores matter conversations and daily workspace chats as Markdown records."""

    def __init__(self, vault: VaultService, matters: MatterService):
        self.vault = vault
        self.matters = matters

    def list(self, matter_id: str) -> list[dict[str, Any]]:
        directory = self.vault.resolve(self._matter_directory(matter_id))
        if not directory.exists():
            return []
        conversations = [
            self._summary(self.vault.read_markdown(self.vault.relative(path)))
            for path in directory.glob("CONV-*.md")
        ]
        return sorted(conversations, key=lambda item: item["updated_at"], reverse=True)

    def get(self, matter_id: str, conversation_id: str) -> dict[str, Any]:
        document = self.vault.read_markdown(self._matter_path(matter_id, conversation_id))
        metadata = document["metadata"]
        if (
            metadata.get("conversation_id") != conversation_id
            or metadata.get("matter_id") != matter_id
            or str(metadata.get("scope") or "matter") != "matter"
        ):
            raise KeyError(f"Conversation not found: {conversation_id}")
        return {
            **self._summary(document),
            "path": document["path"],
            "messages": self._messages(metadata),
        }

    def append(
        self,
        matter_id: str,
        conversation_id: str | None,
        *,
        role: str,
        content: str,
        trace: list[dict[str, Any]] | None = None,
        cards: list[dict[str, Any]] | None = None,
        attachments: list[dict[str, Any]] | None = None,
        card_action: dict[str, Any] | None = None,
        applied_skills: list[dict[str, str]] | None = None,
        operation_results: list[dict[str, Any]] | None = None,
        run_id: str | None = None,
        source_ids: list[str] | None = None,
        conversation_kind: str | None = None,
        intake_state: str | None = None,
        active_agent_id: str | None = None,
    ) -> dict[str, Any]:
        if role not in {"user", "assistant"}:
            raise ValueError(f"Unsupported chat role: {role}")
        now = iso_now()
        if conversation_id:
            conversation = self.get(matter_id, conversation_id)
            if (
                conversation.get("conversation_kind") == "intake"
                and (
                    conversation.get("intake_state") != "active"
                    or self.matters.get(matter_id).get("intake_state") == "complete"
                )
                and (card_action or {}).get("action")
                in {"answer", "answer_set", "skip", "stop"}
            ):
                raise ValueError("Intake is complete. Historical questions cannot be changed.")
            messages = conversation["messages"]
            created_at = conversation["created_at"]
            title = conversation["title"]
            conversation_kind = conversation.get("conversation_kind", conversation_kind)
            intake_state = conversation.get("intake_state", intake_state)
            active_agent_id = conversation.get("active_agent_id", active_agent_id)
        else:
            conversation_id = new_id("CONV")
            messages = []
            created_at = now
            title = self._title(content)
        messages.append(
            {
                "message_id": new_id("MSG"),
                "role": role,
                "content": content,
                "created_at": now,
                "trace": trace or [],
                "cards": cards or [],
                "attachments": attachments or [],
                "card_action": card_action,
                "applied_skills": applied_skills or [],
                "operation_results": operation_results or [],
                "run_id": run_id,
                "source_ids": source_ids or [],
            }
        )
        path = self._matter_path(matter_id, conversation_id)
        self.vault.write_markdown(
            path,
            self._render(messages, heading="# Matter chat"),
            {
                "conversation_id": conversation_id,
                "matter_id": matter_id,
                "scope": "matter",
                "record_type": "chat_transcript",
                "title": title,
                "created_at": created_at,
                "updated_at": now,
                "immutable": True,
                "messages": messages,
                "conversation_kind": conversation_kind or "general",
                "intake_state": intake_state,
                "active_agent_id": active_agent_id or "counsel-copilot",
            },
        )
        return self.get(matter_id, conversation_id)

    def update_state(
        self,
        matter_id: str,
        conversation_id: str,
        *,
        intake_state: str,
        active_agent_id: str,
    ) -> dict[str, Any]:
        conversation = self.get(matter_id, conversation_id)
        if conversation.get("intake_state") == "complete" and intake_state == "active":
            raise ValueError("Completed intake cannot become active again.")
        document = self.vault.read_markdown(conversation["path"])
        metadata = document["metadata"]
        metadata.update(
            {
                "intake_state": intake_state,
                "active_agent_id": active_agent_id,
                "updated_at": iso_now(),
            }
        )
        self.vault.write_markdown(conversation["path"], document["content"], metadata)
        return self.get(matter_id, conversation_id)

    def bind_run_to_message(
        self,
        matter_id: str,
        conversation_id: str,
        message_id: str,
        run_id: str,
    ) -> dict[str, Any]:
        conversation = self.get(matter_id, conversation_id)
        message = next(
            (item for item in conversation["messages"] if item.get("message_id") == message_id),
            None,
        )
        if message is None or message.get("role") != "user":
            raise KeyError(f"User message not found: {message_id}")
        if message.get("run_id") not in {None, run_id}:
            raise ValueError("The message already belongs to another chat run.")
        message["run_id"] = run_id
        document = self.vault.read_markdown(conversation["path"])
        metadata = document["metadata"]
        metadata.update({"messages": conversation["messages"], "updated_at": iso_now()})
        self.vault.write_markdown(
            conversation["path"],
            self._render(conversation["messages"], heading="# Matter chat"),
            metadata,
        )
        return self.get(matter_id, conversation_id)

    def find_run_message(self, matter_id: str, conversation_id: str, run_id: str, role: str) -> dict[str, Any] | None:
        conversation = self.get(matter_id, conversation_id)
        return next(
            (message for message in conversation["messages"] if message.get("run_id") == run_id and message.get("role") == role),
            None,
        )

    def find_conversation_for_run(self, matter_id: str, run_id: str) -> str | None:
        for conversation in self.list(matter_id):
            full = self.get(matter_id, conversation["conversation_id"])
            if any(message.get("run_id") == run_id for message in full["messages"]):
                return str(conversation["conversation_id"])
        return None

    def upsert_run_assistant(
        self,
        matter_id: str,
        conversation_id: str,
        run_id: str,
        *,
        content: str,
        trace: list[dict[str, Any]] | None = None,
        cards: list[dict[str, Any]] | None = None,
        applied_skills: list[dict[str, str]] | None = None,
        operation_results: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        conversation = self.get(matter_id, conversation_id)
        existing = next(
            (message for message in conversation["messages"] if message.get("run_id") == run_id and message.get("role") == "assistant"),
            None,
        )
        if existing is None:
            return self.append(
                matter_id, conversation_id, role="assistant", content=content,
                trace=trace, cards=cards, applied_skills=applied_skills,
                operation_results=operation_results,
                run_id=run_id,
            )
        existing.update({
            "content": content,
            "trace": trace or [],
            "cards": cards or [],
            "applied_skills": applied_skills or [],
            "operation_results": operation_results or [],
            "updated_at": iso_now(),
        })
        document = self.vault.read_markdown(conversation["path"])
        metadata = document["metadata"]
        metadata.update({"messages": conversation["messages"], "updated_at": iso_now()})
        self.vault.write_markdown(
            conversation["path"], self._render(conversation["messages"], heading="# Matter chat"), metadata,
        )
        return self.get(matter_id, conversation_id)

    def list_daily(self) -> list[dict[str, Any]]:
        directory = self.vault.resolve("00_System/conversations")
        if not directory.exists():
            return []
        conversations = []
        for path in directory.glob("????-??-??.md"):
            try:
                conversation = self.get_daily(path.stem)
            except (KeyError, FileNotFoundError, ValueError):
                continue
            conversations.append({
                key: conversation[key]
                for key in ("day", "title", "created_at", "updated_at", "message_count")
            })
        return sorted(conversations, key=lambda item: item["day"], reverse=True)

    def get_daily(self, day: str) -> dict[str, Any]:
        day = self._valid_day(day)
        document = self.vault.read_markdown(self._daily_path(day))
        metadata = document["metadata"]
        if metadata.get("scope") != "workspace_day" or metadata.get("day") != day:
            raise KeyError(f"Daily conversation not found: {day}")
        return {
            **self._daily_summary(document),
            "path": document["path"],
            "messages": self._messages(metadata),
        }

    def append_daily(
        self,
        day: str,
        *,
        role: str,
        content: str,
        trace: list[dict[str, Any]] | None = None,
        cards: list[dict[str, Any]] | None = None,
        attachments: list[dict[str, Any]] | None = None,
        card_action: dict[str, Any] | None = None,
        applied_skills: list[dict[str, str]] | None = None,
        operation_results: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        if role not in {"user", "assistant"}:
            raise ValueError(f"Unsupported chat role: {role}")
        day = self._valid_day(day)
        now = iso_now()
        try:
            conversation = self.get_daily(day)
            messages = conversation["messages"]
            created_at = conversation["created_at"]
        except FileNotFoundError:
            messages = []
            created_at = now
        messages.append(
            {
                "message_id": new_id("MSG"),
                "role": role,
                "content": content,
                "created_at": now,
                "trace": trace or [],
                "cards": cards or [],
                "attachments": attachments or [],
                "card_action": card_action,
                "applied_skills": applied_skills or [],
                "operation_results": operation_results or [],
            }
        )
        path = self._daily_path(day)
        self.vault.write_markdown(
            path,
            self._render(messages, heading=f"# Workspace chat — {day}"),
            {
                "scope": "workspace_day",
                "record_type": "chat_transcript",
                "day": day,
                "title": day,
                "created_at": created_at,
                "updated_at": now,
                "immutable": True,
                "messages": messages,
            },
        )
        return self.get_daily(day)

    def recent_user_messages(self, limit: int = 100) -> list[dict[str, str]]:
        bounded_limit = max(0, min(limit, 100))
        if bounded_limit == 0:
            return []
        paths = list(self.vault.resolve("00_System/conversations").glob("*.md"))
        matters_root = self.vault.resolve("03_Matters")
        if matters_root.exists():
            paths.extend(matters_root.glob("*/conversations/CONV-*.md"))
        messages: list[dict[str, str]] = []
        for path in paths:
            try:
                document = self.vault.read_markdown(self.vault.relative(path))
            except (OSError, ValueError, YAMLError):
                continue
            metadata = document["metadata"]
            scope = (
                str(metadata.get("matter_id"))
                if metadata.get("scope") == "matter"
                else str(metadata.get("day") or "Today")
            )
            for message in metadata.get("messages") or []:
                if not isinstance(message, dict) or message.get("role") != "user":
                    continue
                message_id = str(message.get("message_id") or "")
                content = str(message.get("content") or "")
                created_at = str(message.get("created_at") or "")
                if not message_id or not content:
                    continue
                messages.append(
                    {
                        "message_id": message_id,
                        "content": content,
                        "created_at": created_at,
                        "scope": scope,
                    }
                )
        messages.sort(key=lambda item: item["created_at"], reverse=True)
        return messages[:bounded_limit]

    def _matter_path(self, matter_id: str, conversation_id: str) -> str:
        if not _CONVERSATION_ID.fullmatch(conversation_id):
            raise KeyError(f"Conversation not found: {conversation_id}")
        return f"{self._matter_directory(matter_id)}/{conversation_id}.md"

    def _matter_directory(self, matter_id: str) -> str:
        return f"{self.matters.matter_path(matter_id)}/conversations"

    @staticmethod
    def _daily_path(day: str) -> str:
        return f"00_System/conversations/{day}.md"

    @staticmethod
    def _valid_day(value: str) -> str:
        if not _DAY.fullmatch(value):
            raise ValueError("Day must use YYYY-MM-DD format.")
        try:
            return date.fromisoformat(value).isoformat()
        except ValueError as exc:
            raise ValueError("Day must be a real calendar date.") from exc

    @staticmethod
    def _summary(document: dict[str, Any]) -> dict[str, Any]:
        metadata = document["metadata"]
        messages = metadata.get("messages") or []
        return {
            "conversation_id": metadata.get("conversation_id", ""),
            "title": metadata.get("title", "Chat"),
            "created_at": metadata.get("created_at", ""),
            "updated_at": metadata.get("updated_at", ""),
            "message_count": len(messages),
            "conversation_kind": metadata.get("conversation_kind", "general"),
            "intake_state": metadata.get("intake_state"),
            "active_agent_id": metadata.get("active_agent_id", "counsel-copilot"),
        }

    @staticmethod
    def _daily_summary(document: dict[str, Any]) -> dict[str, Any]:
        metadata = document["metadata"]
        messages = metadata.get("messages") or []
        return {
            "day": metadata.get("day", ""),
            "title": metadata.get("title", metadata.get("day", "Daily chat")),
            "created_at": metadata.get("created_at", ""),
            "updated_at": metadata.get("updated_at", ""),
            "message_count": len(messages),
        }

    @staticmethod
    def _messages(metadata: dict[str, Any]) -> list[dict[str, Any]]:
        messages: list[dict[str, Any]] = []
        for raw in metadata.get("messages") or []:
            if not isinstance(raw, dict):
                continue
            message = dict(raw)
            message.setdefault("applied_skills", [])
            message.setdefault("source_ids", [])
            message.setdefault("operation_results", [])
            messages.append(message)
        return messages

    @staticmethod
    def _title(content: str) -> str:
        title = " ".join(content.split()).strip()
        return (title[:57] + "…") if len(title) > 58 else (title or "Chat")

    @staticmethod
    def _render(messages: list[dict[str, Any]], *, heading: str) -> str:
        sections = [heading]
        for message in messages:
            speaker = "You" if message["role"] == "user" else "Themis.ai"
            sections.append(f"## {speaker} · {message['created_at']}\n\n{message['content']}")
            trace = message.get("trace") or []
            if trace:
                actions = "\n".join(
                    f"- {'✓' if item.get('status') == 'success' else '!'} {item.get('summary', '')}"
                    for item in trace
                )
                sections[-1] += f"\n\n### Actions\n\n{actions}"
        return "\n\n".join(sections) + "\n"
