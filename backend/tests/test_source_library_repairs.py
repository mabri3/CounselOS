"""Regression tests for the source-library review findings."""
import pytest
from test_main_agent_research import prepared_collection
from test_source_library_tools import upload, paged_pdf, MATTER, OTHER

@pytest.mark.asyncio
async def test_fetched_pdf_bin(app_context):
    a = prepared_collection(app_context)
    root = app_context.matters.matter_path(MATTER)
    cache = root + '/research/sources/probe.md'
    app_context.vault.write_bytes(cache + '.bin', paged_pdf(2, 2, 'late evidence marker'))
    result = await a._register_library_version({'source_id': 'SRC-PROBE', 'title': 'PDF', 'pages': [{'page': 1}], 'original_file_path': cache + '.bin'}, cache)
    assert result['extraction_state'] == 'complete'
    assert app_context.source_library.search(MATTER, 'late evidence marker')['hits']

@pytest.mark.asyncio
async def test_unpinned_read(app_context):
    r = await upload(app_context, 'secret.txt', b'UNSELECTED_MARKER operative evidence')
    a = prepared_collection(app_context)
    with pytest.raises(ValueError, match='not in this run'):
        a.read({'source_id': r['library_source_id'], 'source_version': r['library_source_version'], 'unit_id': 's000001'})

@pytest.mark.asyncio
async def test_cross_matter_original_registration(app_context):
    p = app_context.matters.matter_path(OTHER) + '/documents/secret.txt'
    app_context.vault.write_bytes(p, b'OTHER_MATTER_SECRET')
    lib = app_context.source_library
    with pytest.raises(ValueError):
        lib.register_saved_source(MATTER, p, source_id='SRC-CROSS', title='cross', source_kind='supplied')

@pytest.mark.asyncio
async def test_crash_before_manifest(app_context, monkeypatch):
    lib = app_context.source_library
    p = app_context.matters.matter_path(MATTER) + '/documents/crash.txt'
    app_context.vault.write_bytes(p, b'Crash recovery evidence')
    r = lib.register_saved_source(MATTER, p, source_id='SRC-CRASH', title='crash', source_kind='supplied')
    original = app_context.vault.write_markdown

    def fail(path, *args, **kwargs):
        if path.endswith('/manifest.md'):
            raise OSError('simulated crash')
        return original(path, *args, **kwargs)
    monkeypatch.setattr(app_context.vault, 'write_markdown', fail)
    with pytest.raises(OSError):
        await lib.extract_or_resume(MATTER, r['job_id'])
    monkeypatch.setattr(app_context.vault, 'write_markdown', original)
    resumed = await lib.extract_or_resume(MATTER, r['job_id'])
    assert resumed['extraction_state'] == 'complete' and resumed['source_version'] is not None
    assert lib.describe(MATTER, resumed['source_id'], resumed['source_version'])['units']

@pytest.mark.asyncio
async def test_multiple_versions_search(app_context):
    lib = app_context.source_library
    root = app_context.matters.matter_path(MATTER)
    for n in (1, 2):
        p = root + f'/documents/version{n}.txt'
        app_context.vault.write_bytes(p, f'SHARED_MARKER version {n}'.encode())
        r = lib.register_saved_source(MATTER, p, source_id='SRC-VERSIONS', title='version', source_kind='supplied')
        await lib.extract_or_resume(MATTER, r['job_id'])
    a = prepared_collection(app_context)
    hits = a.search_sources({'query': 'SHARED_MARKER'})['hits']
    assert len(hits) == 1 and 'version 2' in hits[0]['snippet']

@pytest.mark.asyncio
async def test_exclusion_through_registry(app_context):
    from app.tools.registry import ToolExecutionContext
    r = await upload(app_context, 'excluded.txt', b'EXCLUDED_MARKER confidential condition')
    a = prepared_collection(app_context)
    ctx = ToolExecutionContext(app=app_context, matter_id=MATTER, investigation=a, frozen_context={'excluded_paths': [app_context.source_library.describe(MATTER, r['library_source_id'], r['library_source_version'])['original_path']]})
    result = await app_context.tools.execute(app_context.agents.get('counsel-copilot'), ctx, 'search_research_sources', {'query': 'EXCLUDED_MARKER'})
    assert 'EXCLUDED_MARKER' not in str(result.data)
    assert not result.data['hits']

@pytest.mark.asyncio
async def test_manifest_cannot_be_edited(app_context):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from app.routers import files
    r = await upload(app_context, 'manifest.txt', b'Original evidence')
    p = app_context.source_library.manifest_path(MATTER, r['library_source_id'], r['library_source_version'])
    api = FastAPI()
    api.state.context = app_context
    api.include_router(files.router, prefix='/api')
    with TestClient(api) as c:
        response = c.put('/api/files', params={'path': p}, json={'content': 'Edited manifest', 'metadata': app_context.vault.read_markdown(p)['metadata']})
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_full_html_tail_is_registered(app_context, monkeypatch):
    from app.services.research_reader import read_source, SafeHttpFetcher
    from app.intelligence.fetch import BinaryFetchResult
    root = app_context.matters.matter_path(MATTER)
    cache = root + '/research/sources/html.md'
    body = ('<html><h1>Heading</h1>' + '<p>ordinary words in a paragraph</p>' * 5000 + '<p>TAIL_ONLY_MARKER</p></html>').encode()

    async def fetch(*args, **kwargs):
        return BinaryFetchResult('https://example.com', 'https://example.com', 'text/html', body, 'utf-8')
    monkeypatch.setattr(SafeHttpFetcher, 'fetch_binary', fetch)
    s = await read_source('https://example.com', app_context.settings, cache_path=cache)
    s.update(source_id='SRC-HTML', title='html', path=root + '/research/sources/html-source.md')
    app_context.vault.write_markdown(s['path'], s['content'], {})
    r = await prepared_collection(app_context)._register_library_version(s, cache)
    assert r['extraction_state'] == 'complete' and app_context.source_library.search(MATTER, 'TAIL_ONLY_MARKER')['status'] == 'hits'

@pytest.mark.asyncio
async def test_resource_ceiling_is_partial(app_context, monkeypatch):
    import app.services.source_library as module
    monkeypatch.setattr(module, 'MAX_SOURCE_CHARS', 100)
    r = await upload(app_context, 'oversize.txt', b'A' * 150 + b'TAIL_LOST')
    m = app_context.source_library.describe(MATTER, r['library_source_id'], r['library_source_version'])
    assert m['extraction_state'] == 'partial' and m['total_chars'] <= 100

def test_failed_ocr_is_partial_and_can_be_retried(tmp_path, monkeypatch):
    import pymupdf
    from app.services import source_extraction as ex
    pdf = pymupdf.open()
    pdf.new_page()
    p = tmp_path / 'blank.pdf'
    pdf.save(p)
    pdf.close()

    def fail(*a, **k):
        raise FileNotFoundError('no tesseract')
    monkeypatch.setattr(ex.subprocess, 'run', fail)
    first = ex.extract_pages(str(p), str(tmp_path / 'stage'), 1, None)
    calls = []

    def success(*a, **k):
        calls.append(1)
        raise AssertionError('should retry but never called')
    monkeypatch.setattr(ex.subprocess, 'run', success)
    second = ex.extract_pages(str(p), str(tmp_path / 'stage'), 1, 1)
    assert first['state'] == 'partial' and first['unread_pages'] == 1 and calls

@pytest.mark.asyncio
async def test_published_library_citations(app_context, monkeypatch):
    from test_source_library_lifecycle import test_assembled_lifecycle_answers_from_a_late_page_and_survives_restart
    await test_assembled_lifecycle_answers_from_a_late_page_and_survives_restart(app_context, monkeypatch)
    paths = [app_context.vault.relative(p) for p in app_context.vault.iter_files(app_context.matters.matter_path(MATTER), {'.md'})]
    packets = [app_context.vault.read_markdown(p) for p in paths if app_context.vault.read_markdown(p)['metadata'].get('source_records') is not None]
    for p in packets:
        meta = p['metadata']
        assert any(('/source-library/' in str(s.get('path')) for s in meta['source_records']))
        for source in meta['source_records']:
            if '/source-library/' not in str(source.get('path')):
                continue
            resolved = app_context.workspace_review.resolve_document(MATTER, {'document_id': source['source_id'], 'path': source['path'], 'revision': source['source_hash'], 'available_excerpt': source['available_excerpt'], 'origin': {'surface': 'evidence', 'workspace_view': 'understand'}})
            assert resolved['passage_state'] == 'exact'
            assert not resolved['document']['editable']
    assert packets

@pytest.mark.asyncio
async def test_1001_pages_report_one_unread_page(app_context):
    r = await upload(app_context, '1001.pdf', paged_pdf(1001, 1001, 'OMITTED_LAST_PAGE'))
    m = app_context.source_library.describe(MATTER, r['library_source_id'], r['library_source_version'])
    assert m['page_count'] == 1001 and m['extracted_unit_count'] == 1000 and (m['extraction_state'] == 'partial') and (m['unread_page_count'] == 1)

@pytest.mark.asyncio
async def test_targeted_continuation_is_pinned_and_replayed_without_charge(app_context, monkeypatch):
    import pymupdf
    from types import SimpleNamespace
    from app.services import source_extraction as extraction
    from app.tools.registry import ToolExecutionContext
    pdf = pymupdf.open()
    pdf.new_page()
    data = pdf.tobytes()
    pdf.close()

    async def local_worker(original, staging, *, target_page=None, **kwargs):
        return extraction.extract_pages(str(original), str(staging), 1, target_page)
    monkeypatch.setattr('app.services.source_library.run_page_extraction', local_worker)

    def fail(*args, **kwargs):
        raise FileNotFoundError('OCR not installed')
    monkeypatch.setattr(extraction.subprocess, 'run', fail)
    source = await upload(app_context, 'retry.pdf', data)
    a = prepared_collection(app_context)
    found = a.search_sources({'query': 'unread', 'source_id': source['library_source_id']})
    assert found['source']['extraction_state'] == 'partial'
    old = source['library_source_version']
    monkeypatch.setattr(extraction.subprocess, 'run', lambda *a, **k: SimpleNamespace(returncode=0, stdout=b'Recovered OCR evidence', stderr=''))
    context = ToolExecutionContext(app=app_context, matter_id=MATTER, investigation=a)
    args = {'source_id': source['library_source_id'], 'source_version': old, 'continue_extraction': True, 'page_number': 1}
    first = await app_context.tools.execute(app_context.agents.get('counsel-copilot'), context, 'read_research_source', args)
    assert first.status == 'success', first
    assert first.data['source_version'] != old
    used = a.remaining()['active_seconds']
    second = await app_context.tools.execute(app_context.agents.get('counsel-copilot'), context, 'read_research_source', args)
    assert second.data['source_version'] == first.data['source_version']
    assert a.remaining()['active_seconds'] == used
    assert app_context.source_library.describe(MATTER, source['library_source_id'], old)['extraction_state'] == 'partial'
    assert 'Recovered OCR evidence' in a.read(first.data['next_read'])['text']
