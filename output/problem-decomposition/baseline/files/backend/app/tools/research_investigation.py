"""Investigation tools accept payloads only; authorization is server-owned."""
from app.services.research_collection import ResearchCollection


def authorized(context):
    access = context.investigation
    if not isinstance(access, ResearchCollection) or access.app is not context.app:
        raise ValueError("This tool needs an authorized main-agent investigation.")
    access.validate(context.matter_id)
    return access


async def collect_research_evidence(context, arguments):
    data = await authorized(context).collect(arguments)
    return {"summary": "Collection result saved.", "data": data}


async def read_research_source(context, arguments):
    data = authorized(context).read(arguments)
    return {"summary": "Read saved source passage.", "data": data}
