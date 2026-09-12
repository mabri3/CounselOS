"""One bounded dossier writer with optional reads of its frozen matter records."""
import asyncio
from copy import deepcopy
import json

from app.agents.dispatch_budget import BoundedDispatch
from app.services.dossier_records import DossierRecordReader, READ_GUIDANCE, READ_TOOL


async def complete_dossier(app, resolved, state, messages, *, snapshot=None):
    timeout = app.settings.dossier_timeout_seconds
    async with app.provider_router.isolated(resolved, timeout_seconds=timeout) as provider:
        bounded = BoundedDispatch(provider, state, app.settings.model_dispatch_max_bytes)
        if snapshot is None:
            return await asyncio.wait_for(bounded.complete(messages, tools=None), timeout=timeout)
        return await _read_and_write(bounded, state, messages, DossierRecordReader(snapshot), timeout)


async def _read_and_write(provider, state, messages, reader, timeout):
    messages = deepcopy(messages)
    messages[0]["content"] += "\n\n" + READ_GUIDANCE
    loop = asyncio.get_running_loop()
    deadline = loop.time() + timeout
    # Reserve part of the same five-minute allowance for an answer-only attempt.
    read_deadline = deadline - min(60, timeout * .25)
    reads, admitted = 0, 0
    last_reply = None
    for turn in range(5):
        can_read = turn < 4 and reads < 8 and admitted < 48000 and loop.time() < read_deadline
        allowance = (read_deadline if can_read else deadline) - loop.time()
        if allowance <= 0:
            break
        if not can_read:
            messages.append({"role": "user", "content": "Saved-record reading is complete. Return the requested finished work now using the material available. No further tools."})
        try:
            reply = await asyncio.wait_for(provider.complete(messages, tools=[READ_TOOL] if can_read else None), timeout=allowance)
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            state.frozen_context.setdefault("dossier_read_warnings", []).append(
                "Saved-record reading or writing did not complete (" + type(exc).__name__ + ").")
            if not can_read:
                if last_reply and last_reply.content.strip():
                    state.frozen_context["dossier_partial_output"] = last_reply.content
                raise
            # A failed read stage must still make the final answer-only attempt.
            reads = 8
            continue
        last_reply = reply if reply.content.strip() else last_reply
        if not reply.tool_calls:
            return reply
        messages.append({"role": "assistant", "content": reply.content or None,
            "tool_calls": [{"id": c.id, "type": "function", "function": {"name": c.name,
                "arguments": json.dumps(c.arguments)}} for c in reply.tool_calls]})
        for call in reply.tool_calls:
            try:
                if call.name != "read_dossier_record":
                    raise ValueError("Only captured-record reads are allowed. No changes or external research.")
                if not can_read or reads >= 8:
                    raise ValueError("Saved-record read limit reached. Finish from the material available.")
                reads += 1
                result = reader.execute(call.arguments)
                text = json.dumps(result, ensure_ascii=False, default=str)
                if admitted + len(text.encode()) > 48000:
                    raise ValueError("Saved-record evidence allowance reached. Finish from the material available.")
                admitted += len(text.encode())
                state.frozen_context.setdefault("dossier_record_reads", []).append({
                    "status": "success", "tool": call.name,
                    "arguments": call.arguments, "record_id": result.get("record_id"),
                    "start": result.get("start"), "end": result.get("end"), "matches": result.get("matches")})
            except Exception as exc:
                text = json.dumps({"error": str(exc), "use_available_material": True})
                state.frozen_context.setdefault("dossier_record_reads", []).append({
                    "status": "error", "tool": call.name, "arguments": call.arguments, "error": str(exc)})
                warning = "A requested saved-record read was unavailable. The writer used the material available."
                warnings = state.frozen_context.setdefault("dossier_read_warnings", [])
                if warning not in warnings:
                    warnings.append(warning)
            messages.append({"role": "tool", "tool_call_id": call.id, "name": call.name, "content": text})
    if last_reply and last_reply.content.strip():
        state.frozen_context["dossier_partial_output"] = last_reply.content
    raise TimeoutError("Dossier execution limit reached without a finished answer")
