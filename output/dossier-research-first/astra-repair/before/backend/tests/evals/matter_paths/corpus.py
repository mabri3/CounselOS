"""Deterministic public synthetic documents; never reads a matter vault."""
from __future__ import annotations
import pymupdf as fitz


def dense_pdf(pages: int, identity: str) -> bytes:
    document = fitz.open()
    for number in range(1, pages + 1):
        page = document.new_page()
        lines = [f'{identity} page {number:04d}: clause {number} controls the synthetic service.']
        for row in range(43):
            lines.append(f'{identity}-{number:04d}-{row:02d}: Records remain available; the operator checks each exception before release.')
        if number in {1, pages // 2, pages - 1}:
            lines.append(f'RARE-{identity}-{number}: release requires the named bank to agree in writing.')
        if number == pages - 1:
            lines.append('CROSS-PAGE EXCEPTION: this permission applies only when')
        if number == pages:
            lines.insert(1, 'the bank has signed; selection alone does not establish agreement.')
        result = page.insert_textbox(fitz.Rect(32, 32, 565, 810), '\n'.join(lines), fontsize=8)
        assert result >= 0, 'Fixture text must fit on each actual page.'
    data = document.tobytes(garbage=4, deflate=True)
    document.close()
    return data


def mixed_pdf() -> bytes:
    document=fitz.open()
    for number in range(1,25):
        page=document.new_page()
        if number<=3:
            page.insert_text((40,80),f'Native record {number}: the bank agreement is still pending.',fontsize=14)
        elif number==24:
            page.draw_rect(page.rect,fill=(0.5,0.5,0.5))
        else:
            source=fitz.open();scan=source.new_page()
            scan.insert_text((40,100),f'SCAN {number}: BANK AGREEMENT IS PENDING.',fontsize=22)
            pix=scan.get_pixmap(matrix=fitz.Matrix(2,2))
            page.insert_image(page.rect,stream=pix.tobytes('png'))
            if number==12:page.set_rotation(90)
            source.close()
    data=document.tobytes(deflate=True);document.close();return data
