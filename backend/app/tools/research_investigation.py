"""Investigation tools accept payloads only; authorization is server-owned."""
from app.services.research_collection import ResearchCollection


def authorized(context):
    access = context.investigation
    if not isinstance(access, ResearchCollection) or access.app is not context.app:
        raise ValueError("This tool needs an authorized main-agent investigation.")
    access.validate(context.matter_id)
    # The persisted run owns scope. Also retain exclusions passed by the current harness.
    frozen = access.run.setdefault("frozen_context", {})
    for key in ("excluded_paths", "excluded_reference_ids"):
        frozen[key] = sorted(set(frozen.get(key, [])) | set(context.frozen_context.get(key, [])))
    return access


async def collect_research_evidence(context, arguments):
    data = await authorized(context).collect(arguments)
    return {"summary": "Collection result saved.", "data": data}


async def read_research_source(context, arguments):
    data = await authorized(context).read_with_continuation(arguments)
    return {"summary": "Read saved source passage.", "data": data}


async def search_research_sources(context, arguments):
    data = authorized(context).search_sources(arguments)
    return {"summary": "Searched this matter's saved sources.", "data": data}
