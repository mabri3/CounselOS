from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


OUT = Path("output/research/legal-ai-small-team-market-research.docx")

INK = "0B2545"
BLUE = "2E74B5"
DARK_BLUE = "1F4D78"
MUTED = "5B6573"
LIGHT_BLUE = "E8EEF5"
LIGHT_GRAY = "F2F4F7"
CALLOUT = "F4F6F9"
RED = "9B1C1C"
GOLD = "7A5A00"
USABLE_DXA = 9360


def set_font(run, size=None, color=None, bold=None, italic=None):
    run.font.name = "Calibri"
    run._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
    run._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
    if size is not None:
        run.font.size = Pt(size)
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic


def shade(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=80, start=120, bottom=80, end=120):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for side, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{side}"))
        if node is None:
            node = OxmlElement(f"w:{side}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_geometry(table, widths):
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    table.autofit = False
    tbl_pr = table._tbl.tblPr
    tbl_layout = tbl_pr.first_child_found_in("w:tblLayout")
    if tbl_layout is None:
        tbl_layout = OxmlElement("w:tblLayout")
        tbl_pr.append(tbl_layout)
    tbl_layout.set(qn("w:type"), "fixed")
    tbl_w = tbl_pr.first_child_found_in("w:tblW")
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(sum(widths)))
    tbl_w.set(qn("w:type"), "dxa")
    tbl_ind = tbl_pr.first_child_found_in("w:tblInd")
    if tbl_ind is None:
        tbl_ind = OxmlElement("w:tblInd")
        tbl_pr.append(tbl_ind)
    tbl_ind.set(qn("w:w"), "120")
    tbl_ind.set(qn("w:type"), "dxa")
    grid = table._tbl.tblGrid
    for grid_col, width in zip(grid.gridCol_lst, widths):
        grid_col.set(qn("w:w"), str(width))
    for row in table.rows:
        for cell, width in zip(row.cells, widths):
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(width))
            tc_w.set(qn("w:type"), "dxa")
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def repeat_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    header = OxmlElement("w:tblHeader")
    header.set(qn("w:val"), "true")
    tr_pr.append(header)


def add_hyperlink(paragraph, text, url):
    part = paragraph.part
    rid = part.relate_to(url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
    link = OxmlElement("w:hyperlink")
    link.set(qn("r:id"), rid)
    r = OxmlElement("w:r")
    r_pr = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), BLUE)
    r_pr.append(color)
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    r_pr.append(underline)
    r.append(r_pr)
    t = OxmlElement("w:t")
    t.text = text
    r.append(t)
    link.append(r)
    paragraph._p.append(link)


def add_page_field(paragraph):
    run = paragraph.add_run()
    fld_char1 = OxmlElement("w:fldChar")
    fld_char1.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "end")
    run._r.append(fld_char1)
    run._r.append(instr)
    run._r.append(fld_char2)


def add_bottom_border(paragraph, color=INK, size="12"):
    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), size)
    bottom.set(qn("w:space"), "4")
    bottom.set(qn("w:color"), color)
    p_bdr.append(bottom)
    p_pr.append(p_bdr)


def set_paragraph(paragraph, before=0, after=6, line=1.1, keep_with_next=False):
    fmt = paragraph.paragraph_format
    fmt.space_before = Pt(before)
    fmt.space_after = Pt(after)
    fmt.line_spacing = line
    fmt.keep_with_next = keep_with_next


def add_body(doc, text, bold_lead=None):
    p = doc.add_paragraph()
    set_paragraph(p)
    if bold_lead:
        r = p.add_run(bold_lead)
        set_font(r, 11, INK, True)
    r = p.add_run(text)
    set_font(r, 11, INK)
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    set_paragraph(p, after=4, line=1.167)
    if not p.runs:
        p.add_run(text)
    else:
        p.runs[0].text = text
    for run in p.runs:
        set_font(run, 11, INK)
    return p


def add_number(doc, text):
    p = doc.add_paragraph(style="List Number")
    set_paragraph(p, after=5, line=1.167)
    if not p.runs:
        p.add_run(text)
    else:
        p.runs[0].text = text
    for run in p.runs:
        set_font(run, 11, INK)
    return p


def heading(doc, text, level=1):
    p = doc.add_paragraph(style=f"Heading {level}")
    p.add_run(text)
    if level == 1:
        set_paragraph(p, before=16, after=8, line=1.0, keep_with_next=True)
        color, size = BLUE, 16
    elif level == 2:
        set_paragraph(p, before=12, after=6, line=1.0, keep_with_next=True)
        color, size = BLUE, 13
    else:
        set_paragraph(p, before=8, after=4, line=1.0, keep_with_next=True)
        color, size = DARK_BLUE, 12
    for run in p.runs:
        set_font(run, size, color, True)
    return p


def simple_table(doc, headers, rows, widths, font_size=9.25):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    set_table_geometry(table, widths)
    header = table.rows[0].cells
    for cell, label in zip(header, headers):
        shade(cell, LIGHT_BLUE)
        p = cell.paragraphs[0]
        set_paragraph(p, after=0, line=1.0)
        r = p.add_run(label)
        set_font(r, font_size, INK, True)
    repeat_header(table.rows[0])
    for row in rows:
        cells = table.add_row().cells
        for cell, text in zip(cells, row):
            p = cell.paragraphs[0]
            set_paragraph(p, after=0, line=1.05)
            r = p.add_run(text)
            set_font(r, font_size, INK)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table


def callout(doc, title, text):
    table = doc.add_table(rows=1, cols=1)
    table.style = "Table Grid"
    set_table_geometry(table, [USABLE_DXA])
    cell = table.cell(0, 0)
    shade(cell, CALLOUT)
    p = cell.paragraphs[0]
    set_paragraph(p, after=3, line=1.1)
    r = p.add_run(title)
    set_font(r, 11, DARK_BLUE, True)
    p2 = cell.add_paragraph()
    set_paragraph(p2, after=0, line=1.1)
    r2 = p2.add_run(text)
    set_font(r2, 11, INK)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)


def make_document():
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)
    section.header_distance = Inches(0.492)
    section.footer_distance = Inches(0.492)

    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Calibri"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.1

    # Running furniture
    header = section.header
    hp = header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.LEFT
    set_paragraph(hp, after=0, line=1.0)
    r = hp.add_run("COUNSELOS MARKET RESEARCH")
    set_font(r, 8.5, MUTED, True)
    footer = section.footer
    fp = footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    set_paragraph(fp, after=0, line=1.0)
    r = fp.add_run("Confidential working research | Page ")
    set_font(r, 8.5, MUTED)
    add_page_field(fp)

    # Masthead
    p = doc.add_paragraph()
    set_paragraph(p, before=10, after=4, line=1.0)
    r = p.add_run("MARKET RESEARCH BRIEF")
    set_font(r, 10, BLUE, True)
    p = doc.add_paragraph()
    set_paragraph(p, before=0, after=5, line=1.0)
    r = p.add_run("Why small legal teams choose ChatGPT or Claude - and what CounselOS must add")
    set_font(r, 22, INK, True)
    p = doc.add_paragraph()
    set_paragraph(p, before=0, after=16, line=1.0)
    r = p.add_run("Reddit evidence on Harvey, Legora, CoCounsel, GC AI, and the practical paid-workspace opportunity")
    set_font(r, 13, MUTED)

    metadata = doc.add_table(rows=4, cols=2)
    metadata.style = "Table Grid"
    set_table_geometry(metadata, [1440, 7920])
    for (label, value), row in zip([
        ("Prepared for", "CounselOS product strategy"),
        ("Date", "August 31, 2026"),
        ("Research scope", "Two Luna-medium agent waves across r/LegalTech and lawyer-centered Reddit communities"),
        ("Evidence standard", "Firsthand reports prioritized; anonymous, vendor-linked, hearsay, and duplicate claims marked as lower confidence"),
    ], metadata.rows):
        shade(row.cells[0], LIGHT_GRAY)
        p1 = row.cells[0].paragraphs[0]
        set_paragraph(p1, after=0, line=1.0)
        a = p1.add_run(label)
        set_font(a, 10, INK, True)
        p2 = row.cells[1].paragraphs[0]
        set_paragraph(p2, after=0, line=1.0)
        b = p2.add_run(value)
        set_font(b, 10, INK)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    callout(doc, "Bottom line", "Small teams do not want to pay for a legal label, a prompt library, or generic drafting. They may pay for a durable matter workspace that reduces repeated context setup, proves document coverage, links work to sources, and keeps the next action visible while they continue to use their preferred frontier model.")

    doc.add_page_break()

    heading(doc, "Executive summary", 1)
    add_body(doc, "The strongest Reddit pattern is not that specialist legal products are useless. It is that their value is operational rather than model-based. Small firms and legal teams often see ChatGPT or Claude as better value for raw drafting, broad commercial reasoning, speed, price, and flexibility. They retain Westlaw, Lexis, or another controlled source for authoritative research.")
    add_body(doc, "Paid legal products earn consideration when they reduce work that a general chat tool leaves behind: source checking, review of large document sets, persistent matter context, standardized reusable work, and low-friction handoffs. The evidence for superior legal reasoning from Harvey, Legora, CoCounsel, or GC AI is weak and contradictory.")
    simple_table(doc,
        ["Finding", "Evidence strength", "CounselOS implication"],
        [
            ("General models are the low-cost baseline", "High", "Do not compete on model quality. Support the customer's preferred model."),
            ("Source-linked review is worth paying for", "Medium-high", "Link material claims to exact supplied or retrieved passages."),
            ("Large document sets create real value", "Medium-high", "Build structured batch review with a coverage receipt and exception queue."),
            ("Matter continuity removes repeated setup", "Medium", "Make company, matter, decision, file, and playbook context durable and visible."),
            ("Another manual system fails adoption", "Medium-high", "Automate intake and state updates; do not make lawyers maintain a separate database."),
        ],
        [2700, 1900, 4760],
        9.5,
    )

    heading(doc, "How to read this research", 1)
    add_body(doc, "This report consolidates anonymous Reddit discussion. It is directional market evidence, not a controlled product study or representative survey. The strongest items name the task, describe a direct trial, and identify the lawyer's role or team size. Product claims from founders, vendors, affiliates, and unidentified accounts are treated as weak evidence.")
    add_bullet(doc, "High confidence: a detailed firsthand task comparison, explicit firm or team size, and an observable result.")
    add_bullet(doc, "Medium confidence: a firsthand report with limited testing, unclear firm size, or no measurable result.")
    add_bullet(doc, "Low confidence: hearsay, broad sentiment, vendor material, or a claim without a described task.")
    add_bullet(doc, "Reddit-reported pricing is illustrative only. It may reflect negotiated terms, region, plan tier, or an incomplete feature bundle.")

    doc.add_page_break()
    heading(doc, "Direct evidence from smaller teams", 1)
    add_body(doc, "The table below gives the most decision-relevant firsthand or role-specific examples. Team size is marked 'not stated' when a poster did not identify it.")
    direct_rows = [
        ("3-attorney legal department", "GC compared Harvey, ChatGPT, and Claude using the same prompts.", "Harvey was too complete in places and missed issues in others. ChatGPT was preferred for reasoning, citations, Word documents, and redlines. The user did not see a reason to pay about $30,000/year for Harvey.", "Harvey"),
        ("Small firm; size not stated", "Managing partner tested Harvey, Lexis AI, ChatGPT, and Claude.", "Chose Claude Team for versatility and lower cost; kept Westlaw Classic as the research backbone.", "Harvey / CoCounsel"),
        ("About 30 attorneys", "Technology lead ran three-week trials of Harvey, Legora, and CoCounsel on discovery, a motion, and a memo.", "All legal products missed a material heirship issue. Claude Opus caught it. The firm chose a narrower internal tool rather than an off-the-shelf platform.", "All three"),
        ("Four-lawyer firm", "Evaluated Westlaw Precision and CoCounsel for real estate research and a deposition outline.", "Reported about $2,000/month for four lawyers. CoCounsel's large-upload advantage did not justify poor task following in the example given.", "CoCounsel"),
        ("Solo employment lawyer", "Considered CoCounsel for discovery, medical records, depositions, motion work, and memos.", "A user with access called it useful for broad overviews but not worth about $400/month for specific research, document review, or deposition summaries.", "CoCounsel"),
        ("20-person firm", "Lawyer asked peers what the firm should buy for operations, summaries, research, and drafting.", "ChatGPT and Claude were useful for broad work, but lawyers still wanted authoritative research and were cautious with confidential data.", "General AI baseline"),
    ]
    simple_table(doc, ["Team", "Tested work", "Reported buying reason", "Product"], direct_rows, [1450, 2500, 4150, 1260], 8.7)
    p = doc.add_paragraph()
    set_paragraph(p, before=0, after=10, line=1.0)
    r = p.add_run("Primary sources: ")
    set_font(r, 8.5, MUTED, True)
    for i, (label, url) in enumerate([
        ("3-attorney comparison", "https://www.reddit.com/r/legaltech/comments/1w2qxun/chatgpt_desktop_app_versus_claude_desktop_app/"),
        ("small-firm Claude choice", "https://www.reddit.com/r/legaltech/comments/1utntv5/claude_team/"),
        ("30-attorney trial", "https://www.reddit.com/r/legaltech/comments/1w2piu1/we_trialed_cocounsel_harvey_and_legora_here_is/"),
        ("four-lawyer firm", "https://www.reddit.com/r/legaltech/comments/1pdtkme/im_about_to_tell_westlaw_to_shove_it/"),
        ("solo CoCounsel discussion", "https://www.reddit.com/r/LawFirm/comments/1nkcmis/thomson_reuters_cocounsel/"),
        ("20-person firm", "https://www.reddit.com/r/LawFirm/comments/1nwbgij/what_ai_tools_do_you_use_not_a_bot/"),
    ]):
        if i:
            sep = p.add_run(" | ")
            set_font(sep, 8.5, MUTED)
        add_hyperlink(p, label, url)

    heading(doc, "Why small teams choose ChatGPT or Claude", 1)
    reasons = [
        ("1. Better price-to-value", "Users compare per-seat specialist pricing and contract commitments with low-cost ChatGPT or Claude plans. The objection is especially strong where workloads are uneven or the team has only a few users."),
        ("2. Better raw drafting and broad reasoning", "Users describe general models as stronger for writing, mixed legal-commercial questions, brainstorming, correspondence, operations, and using the newest available model."),
        ("3. Direct control", "Technically capable teams prefer their own skills, playbooks, precedent libraries, model settings, and connectors rather than a vendor's fixed workflow."),
        ("4. Less change management", "Small teams can start in tools they already know. A new system has to beat the cost of migration, training, and another place to maintain information."),
        ("5. Research remains separate", "The common practical stack is general AI for framing, synthesis, drafting, and document work; Westlaw, Lexis, or another controlled database for authority, currentness, and citation checking."),
    ]
    for title, text in reasons:
        heading(doc, title, 2)
        add_body(doc, text)

    heading(doc, "What paid legal-product features are not worth paying for by themselves", 1)
    simple_table(doc,
        ["Feature", "Why users reject it alone", "What would make it valuable"],
        [
            ("Legal chat interface", "It can feel like a repackaged general model.", "Persistent matter context, proof of sources, and reduced review work."),
            ("Prompt library", "Experienced users can create strong prompts or skills directly.", "Guided workflow creation that produces reusable, firm-specific work."),
            ("Generic playbooks", "They can be too generic, rigid, or misaligned with the firm's practice.", "A linked firm precedent and playbook record that shows the rule applied."),
            ("Basic summaries or memos", "Lawyers may need to read the original material anyway.", "A coverage receipt, structured extraction, and exact citations to source passages."),
            ("Routine redlining", "The AI's changes can create a second review job.", "Precise tracked changes, explanations, source links, formatting preservation, and a reliable Word workflow."),
            ("Generic legal research", "It may still have invented citations, wrong holdings, or missing currentness.", "Clear source status, exact passages, lawyer verification records, and handoff to the authoritative database."),
        ],
        [2000, 3400, 3960], 9.2,
    )

    heading(doc, "Where Harvey, Legora, CoCounsel, and GC AI may still earn their price", 1)
    comparison_rows = [
        ("Harvey", "Document vault, shared workflows, enterprise deployment, prompt help, and document-scale review.", "High price, minimum commitments, inconsistent output, and limited differentiation for small teams."),
        ("Legora", "Due diligence, document population, template-based drafting, Word work, and standardized adoption.", "Reported model lag, rigid output, high per-seat cost, and weak differentiation for experienced users."),
        ("CoCounsel", "Westlaw-linked work, source-linked answers, large-document comparison, discovery, depositions, and brief review.", "High cost, slow or restrictive workflows, inconsistent task following, and continued need to verify legal analysis."),
        ("GC AI", "Contract repository, custom skills, playbooks, redlining, legal context, and possible zero-data-retention terms.", "Evidence is polarized; some users report similar results from general models and question the price."),
    ]
    simple_table(doc, ["Product", "Reported paid value", "Small-team objection"], comparison_rows, [1450, 4050, 3860], 9.1)
    p = doc.add_paragraph()
    set_paragraph(p, before=0, after=8, line=1.0)
    r = p.add_run("Examples and counter-evidence: ")
    set_font(r, 8.5, MUTED, True)
    for i, (label, url) in enumerate([
        ("Harvey review", "https://www.reddit.com/r/legaltech/comments/1ku1gh8/harvey_ai_reviews_general_advice_for_a/"),
        ("Legora discussion", "https://www.reddit.com/r/legaltech/comments/1uwas7m/legora_not_as_great_as_chatgpt_in_terms_of/"),
        ("CoCounsel discussion", "https://www.reddit.com/r/LawFirm/comments/1nkcmis/thomson_reuters_cocounsel/"),
        ("GC AI discussion", "https://www.reddit.com/r/legaltech/comments/1tscsp5/where_to_get_basic_education_on_ai_options/"),
    ]):
        if i:
            sep = p.add_run(" | ")
            set_font(sep, 8.5, MUTED)
        add_hyperlink(p, label, url)

    heading(doc, "What small teams still need", 1)
    unmet_rows = [
        ("Research that is easy to verify", "AI drafts and citations still require word-by-word checking.", "Show exact passage links, source status, and a lawyer verification record."),
        ("Proof that every document was reviewed", "A model may silently skip a file, page, or fact.", "Provide an inventory, coverage report, unreadable-file warnings, and an exception list."),
        ("Persistent matter continuity", "Lawyers repeatedly rebuild the context in each chat.", "Keep facts, files, decisions, work product, questions, and next action together."),
        ("Trustworthy Word workflow", "A redline can create a second full review burden.", "Write precise tracked changes, explain them, preserve formatting, and export cleanly."),
        ("Firm precedents and playbooks", "Basic templates fail when conditions and cross-document consistency matter.", "Link outputs to the precedent or rule used and preserve the lawyer's ability to edit."),
        ("Operational follow-through", "Separate tools manage intake, tasks, deadlines, calendar, email, and reminders.", "Turn a confirmed matter into a visible work plan with low manual upkeep."),
    ]
    simple_table(doc, ["Need", "Current workaround or pain", "Smallest valuable response"], unmet_rows, [2150, 3500, 3710], 9.05)
    p = doc.add_paragraph()
    set_paragraph(p, before=0, after=8, line=1.0)
    r = p.add_run("Selected sources: ")
    set_font(r, 8.5, MUTED, True)
    for i, (label, url) in enumerate([
        ("source verification", "https://www.reddit.com/r/biglaw/comments/1vjsnr1/rant_the_only_people_who_misuse_ai_in_my_firm_are/"),
        ("document coverage", "https://www.reddit.com/r/Lawyertalk/comments/1kwddfm/"),
        ("matter continuity", "https://www.reddit.com/r/biglaw/comments/1l4tuf1/for_the_partners_lurking_here_do_you_actually_use/"),
        ("solo intake", "https://www.reddit.com/r/solofirm/comments/1td01vm/how_is_everyone_using_ai_to_scale/"),
        ("automation", "https://www.reddit.com/r/LawFirm/comments/1pk67cm/solo-attorney-help-with-automations/"),
    ]):
        if i:
            sep = p.add_run(" | ")
            set_font(sep, 8.5, MUTED)
        add_hyperlink(p, label, url)

    heading(doc, "CounselOS: verified strengths and material gaps", 1)
    add_body(doc, "CounselOS already targets the durable work layer rather than a generic legal chatbot. The assessment below is based on the current PRD and acceptance tests, not a claim that every future capability is production-ready.")
    counsel_rows = [
        ("Matter continuity", "Strong", "Matter workspace, file tree, company and matter context, decisions, work items, events, and next action.", "Keep orientation automatic; do not require lawyers to maintain duplicate records."),
        ("Model neutrality", "Strong", "Multiple providers and per-agent model selection are in scope.", "Make model choice explicit and preserve the matter when the model changes."),
        ("Source distinction", "Partial", "Research distinguishes internal and external sources and preserves useful partial output.", "Add exact passage links, proposition-level support, and a reviewed/unreviewed source status."),
        ("Document review and Word", "Partial", "PDF/DOCX extraction, tracked changes, comments, accept/reject, and Word/PDF export are present.", "Add review coverage receipts, structured batch extraction, and later a live Word workflow."),
        ("Playbooks and skills", "Strong", "Editable Markdown skills, agents, tools, and workflows are present.", "Tie each generated recommendation or clause back to the selected playbook or precedent."),
        ("Research authority", "Partial", "Polaris-backed public research and internal context are present.", "Support lawyer-led Westlaw/Lexis handoff and verified-authority records; do not build a legal corpus first."),
        ("Daily-work integration", "Partial", "Inbox watcher and schedules exist.", "Add deliberate low-noise email or Slack capture before broad integration work."),
        ("Team collaboration", "Not yet targeted", "The MVP is a single-user local application by design.", "Later add lightweight owners, handoffs, shared access, and audit state for small teams."),
    ]
    simple_table(doc, ["Capability", "Status", "Verified current position", "Highest-value next step"], counsel_rows, [1450, 950, 3450, 3510], 8.55)

    heading(doc, "Recommended product priority", 1)
    priorities = [
        ("1", "Exact source passage links and document-coverage receipts", "Prove what supported the answer and what the system actually reviewed."),
        ("2", "Structured multi-document review", "Produce a table of extracted answers, linked support, exceptions, and missing data."),
        ("3", "Automatic matter orientation", "Convert confirmed intake and uploaded files into facts, missing facts, issues, and a useful next action."),
        ("4", "Low-maintenance handoffs and follow-through", "Keep ownership, deadlines, open questions, and completed work visible without duplicate task entry."),
        ("5", "Email or Slack intake", "Capture daily legal work into a draft matter with classification and human confirmation."),
        ("6", "Legal research handoff", "Let lawyers bring authoritative sources into the matter and mark propositions as checked."),
        ("7", "Live Word integration", "Reduce switching cost after the review and source-grounding workflow has proved value."),
        ("8", "Lightweight small-team collaboration", "Add shared access and clear handoff records before enterprise governance."),
    ]
    simple_table(doc, ["Priority", "Capability", "Why it matters"], priorities, [700, 2850, 5810], 9.3)

    heading(doc, "What CounselOS should not build first", 1)
    for item in [
        "A proprietary legal model or a claim of universally superior legal reasoning.",
        "A broad generic prompt library presented as the main paid value.",
        "A full billing, accounting, or practice-management replacement.",
        "A legal research corpus built from scratch.",
        "Complex multi-agent review or mandatory confidence and citation gates.",
        "Enterprise-scale governance before the small-team workflow has proved adoption.",
    ]:
        add_bullet(doc, item)

    callout(doc, "Recommended product promise", "Give CounselOS the matter once. Use the model you prefer. Get review-ready work with traceable sources, preserved context, and a clear next action.")

    doc.add_page_break()
    heading(doc, "Source appendix", 1)
    add_body(doc, "The links below are the primary Reddit discussions used in the synthesis. They should be read as anonymous user evidence. Links may change or be removed by Reddit moderators.")
    sources = [
        ("ChatGPT desktop app vs. Claude vs. Harvey", "https://www.reddit.com/r/legaltech/comments/1w2qxun/chatgpt_desktop_app_versus_claude_desktop_app/"),
        ("We trialed CoCounsel, Harvey, and Legora", "https://www.reddit.com/r/legaltech/comments/1w2piu1/we_trialed_cocounsel_harvey_and_legora_here_is/"),
        ("Unpopular opinion: most legal AI tools are not worth paying for", "https://www.reddit.com/r/legaltech/comments/1vn35qc/unpopular_opinion_most_legal_ai_tools_are_not/"),
        ("Claude Team", "https://www.reddit.com/r/legaltech/comments/1utntv5/claude_team/"),
        ("Harvey AI reviews / general advice for a medium-sized firm", "https://www.reddit.com/r/legaltech/comments/1ku1gh8/harvey_ai_reviews_general_advice_for_a/"),
        ("Harvey AI says it is for all lawyers - but prices like it is only for BigLaw", "https://www.reddit.com/r/legaltech/comments/1mhndz0/harvey_ai_says_its_for_all_lawyers_but_prices/"),
        ("Legora not as great as ChatGPT", "https://www.reddit.com/r/legaltech/comments/1uwas7m/legora_not_as_great_as_chatgpt_in_terms_of/"),
        ("Pricing: Harvey vs. Claude vs. Legora vs. CoCounsel", "https://www.reddit.com/r/legaltech/comments/1qvwswa/pricing_harvey_v_claude_v_legora_v_cocounsel_from/"),
        ("Thomson Reuters CoCounsel", "https://www.reddit.com/r/LawFirm/comments/1nkcmis/thomson_reuters_cocounsel/"),
        ("I am about to tell Westlaw to shove it", "https://www.reddit.com/r/legaltech/comments/1pdtkme/im_about_to_tell_westlaw_to_shove_it/"),
        ("Harvey for in-house counsel", "https://www.reddit.com/r/legaltech/comments/1n9l2sk/harvey_for_inhouse_counsel/"),
        ("Where to get basic education on AI options", "https://www.reddit.com/r/legaltech/comments/1tscsp5/where_to_get_basic_education_on_ai_options/"),
        ("Claude legal for research", "https://www.reddit.com/r/legaltech/comments/1tede2n/claude_legal_for_research/"),
        ("What AI tools do you use?", "https://www.reddit.com/r/LawFirm/comments/1nwbgij/what_ai_tools_do_you_use_not_a_bot/"),
        ("Best AI for a small law firm to review sensitive documents", "https://www.reddit.com/r/legaltech/comments/1tuyuhp/best_ai_for_small_law_firm_to_review_sensitive/"),
        ("AI transactional drafting tools", "https://www.reddit.com/r/legaltech/comments/1f88ork/ai_transactional_drafting_tools/"),
        ("AI use cases for in-house legal counsel", "https://www.reddit.com/r/legaltech/comments/1ux5hsz/ai_use_cases_for_inhouse_legal_counsels/"),
        ("Solo attorney help with automations", "https://www.reddit.com/r/LawFirm/comments/1pk67cm/solo-attorney-help-with-automations/"),
        ("Knowledge management", "https://www.reddit.com/r/LawFirm/comments/1c88qqf/knowledge_management/"),
        ("Cut our losses and dump case management software?", "https://www.reddit.com/r/LawFirm/comments/1tukoq5/cut_our_losses_and_dump_case_management_software/"),
    ]
    for label, url in sources:
        p = doc.add_paragraph(style="List Bullet")
        set_paragraph(p, after=4, line=1.05)
        add_hyperlink(p, label, url)

    # Document properties
    core = doc.core_properties
    core.title = "Legal AI Market Research: Small Teams and CounselOS"
    core.subject = "Reddit evidence on legal AI products, ChatGPT, Claude, and CounselOS product strategy"
    core.author = "CounselOS"
    core.keywords = "legal AI, CounselOS, ChatGPT, Claude, Harvey, Legora, CoCounsel, GC AI"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)


if __name__ == "__main__":
    make_document()
