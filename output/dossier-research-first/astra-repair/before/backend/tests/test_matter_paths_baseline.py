import json
from pathlib import Path
import pytest
import pymupdf as fitz
from app.models.api import ChatRequest
from app.providers.base import ProviderReply
from tests.evals.matter_paths.corpus import dense_pdf


def test_dense_fixture_has_distinct_complete_page_text():
    data = dense_pdf(10, 'ORCHID')
    with fitz.open(stream=data, filetype='pdf') as doc:
        pages = [page.get_text() for page in doc]
    assert len(set(pages)) == 10
    assert min(map(len, pages)) >= 3000
    assert 'RARE-ORCHID-9' in pages[8]


@pytest.mark.asyncio
async def test_capture_baseline_dispatch(app_context):
    captures = []
    class Capture:
        async def complete(self, messages, tools=None):
            captures.append({'messages': messages, 'tools': tools})
            return ProviderReply(content='Synthetic baseline answer. No records changed.')
    app_context.runner.provider = Capture()
    await app_context.runner.run(ChatRequest(agent_id='counsel-copilot', matter_id='MAT-DEMO-RELAY', message='Explain the current matter.'))
    sizes = [len(json.dumps(item, ensure_ascii=False).encode()) for item in captures]
    output = Path(__file__).resolve().parents[2] / 'output/matter-memory-paths'
    output.mkdir(parents=True, exist_ok=True)
    (output / 'baseline-request-sizes.json').write_text(json.dumps({'bytes': sizes, 'engineering_ceiling':256000,'provider_usage':None,'method':'scripted provider actual dispatch capture'}, indent=2))
    assert captures
