import io,json,time
from pathlib import Path
import pytest
from fastapi import UploadFile
from tests.evals.matter_paths.corpus import dense_pdf
from app.tools.registry import ToolExecutionContext
from app.services.local_source_access import LocalSourceAccess
M='MAT-DEMO-BEACON'


@pytest.mark.asyncio
async def test_dense_thousand_and_ten_two_hundred_page_sources(app_context):
    app=app_context;rows=[]
    for identity,pages in [('ORCHID',1000)]+[(f'COLLECTION{i}',200) for i in range(10)]:
        data=dense_pdf(pages,identity);started=time.monotonic()
        uploaded=await app.ingestion.upload_to_matter(M,UploadFile(filename=identity+'.pdf',file=io.BytesIO(data)))
        doc=app.source_library.describe(M,uploaded['library_source_id'],uploaded['library_source_version'])
        rows.append({'identity':identity,'bytes':len(data),'pages':pages,'chars':doc['total_chars'],'state':doc['extraction_state'],'seconds':time.monotonic()-started,'source_id':doc['source_id'],'version':doc['source_version']})
        assert doc['extraction_state']=='complete'
        assert doc['total_chars']>=3000*pages
        passage=app.source_library.read(M,doc['source_id'],doc['source_version'],f'p{pages-1:06d}')
        assert f'RARE-{identity}-{pages-1}' in passage['text']
    assert len({r['source_id'] for r in rows})==11
    assert sum(r['chars'] for r in rows[1:])>=6000000
    out=Path(__file__).resolve().parents[2]/'output/matter-memory-paths/capacity.json'
    out.write_text(json.dumps(rows,indent=2))


@pytest.mark.asyncio
async def test_ordinary_source_access_is_pinned_bounded_and_excluded(app_context):
    app=app_context
    uploaded=await app.ingestion.upload_to_matter(M,UploadFile(filename='local.txt',file=io.BytesIO(b'Rare orchid exception. Bank agreement remains pending.')))
    context=ToolExecutionContext(app=app,matter_id=M,frozen_context={})
    access=LocalSourceAccess(context)
    result=access.execute('search_local_sources',{'query':'orchid'})
    hit=result['hits'][0]
    read={'source_id':hit['source_id'],'source_version':hit['source_version'],'unit_id':hit['unit_id']}
    passage=access.execute('read_local_source',read)
    assert 'Bank agreement' in passage['text']
    before=access.state['admitted_chars'];access.execute('read_local_source',read)
    assert access.state['admitted_chars']==before
    doc=app.source_library.describe(M,hit['source_id'],hit['source_version'])
    context.frozen_context['excluded_paths']=[doc['original_path']]
    with pytest.raises(ValueError):access.execute('read_local_source',read)
    assert not access.execute('search_local_sources',{'query':'orchid'})['hits']


@pytest.mark.asyncio
async def test_real_ocr_target_beyond_initial_slice_preserves_images(app_context):
    import shutil
    from tests.evals.matter_paths.corpus import mixed_pdf
    assert shutil.which('tesseract'), 'Real OCR requires local Tesseract.'
    app=app_context
    uploaded=await app.ingestion.upload_to_matter(M,UploadFile(filename='mixed.pdf',file=io.BytesIO(mixed_pdf())))
    before=app.source_library.describe(M,uploaded['library_source_id'],uploaded['library_source_version'])
    assert before['extraction_state']=='partial'
    after=await app.source_library.extract_or_resume(M,uploaded['library_job_id'],page_number=20)
    passage=app.source_library.read(M,after['source_id'],after['source_version'],'p000020')
    assert passage['extraction_method']=='ocr'
    assert 'BANK AGREEMENT' in passage['text']
    assert passage['page_image_path'] and app.vault.exists(passage['page_image_path'])
    assert app.source_library.describe(M,before['source_id'],before['source_version'])['source_version']==before['source_version']
