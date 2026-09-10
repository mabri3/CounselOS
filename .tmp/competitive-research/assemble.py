from pathlib import Path
import re, html, csv
from urllib.parse import urlparse
import markdown

root = Path('/Users/bharris/Programs/counsel-os-mvp')
out = root / 'output/competitive-research-2026-09-10'
groups = {
 'tools-a.md': ['Harvey','Legora (formerly Leya)','Ivo','Spellbook','Clio','EvenUp','Thomson Reuters'],
 'tools-b.md': ['Luminance','Ironclad','Lexroom','Eve','DeepJudge','Wordsmith'],
 'delivery.md': ['Crosby','Carta / Carta Law','Lawhive','Garfield AI / Garfield.Law','Moritz (moritzlegal.com)','Norm Ai / Norm Law','General Legal','Eudia','LegalOS (legalos.ai)']
}
profiles = {}
for file, names in groups.items():
    raw = (out/file).read_text()
    sections = re.split(r'^## ', raw, flags=re.M)
    for name in names:
        section = next((s for s in sections if s.split('\n',1)[0] == name), None)
        assert section, (file,name)
        profiles[name] = '## ' + section.strip()

rows = [
('Harvey','Broad legal research, transactions, litigation','$550M; Sep 9, 2026','>$1.55B reported; cumulative sum not independently reconstructed'),
('Legora (formerly Leya)','Research, drafting, diligence, litigation','$550M Series D; Mar 2026; reported $50M extension Apr','>$850M reported'),
('Ivo','Commercial contracts, privacy terms, contract intelligence','$55M Series B; Jan 2026','About $75M'),
('Spellbook','Contract drafting and review in Word','$50M Series B; Oct 2025','About $80.9M equity estimate; separate $40M debt facility Mar 2026'),
('Clio','Firm operations plus research and legal drafting','$500M Series G; Nov 2025','>$1.7B reported financing; $350M debt facility separate; $1B vLex purchase is acquisition spend'),
('EvenUp','Personal-injury case preparation','$150M Series E; Oct 2025','$385M'),
('Thomson Reuters','Legal research content and CoCounsel workflows','Public company; venture rounds not applicable','Not comparable; $650M Casetext acquisition is separate'),
('Luminance','Contracts, diligence, investigations','$75M Series C; Feb 2025','$165M reported'),
('Ironclad','Contract lifecycle and obligations','$150M Series E; Jan 2022','$333M'),
('Lexroom','Civil-law research, drafting, litigation','$50M Series B; May 2026','$73M'),
('Eve','Plaintiff personal-injury and employment work','$103M Series B; Sep 2025','$164M reported'),
('DeepJudge','Search and workflows over internal legal knowledge','$41.2M Series A; Nov 2025','At least $51.9M disclosed rounds'),
('Wordsmith','In-house agents, privacy, contracts, compliance','$70M Series B Jun 2026; $14M extension Aug','At least $114M'),
('Crosby','Attorney-delivered commercial contracts','$60M Series B; Mar 2026','At least $85.8M disclosed rounds'),
('Carta / Carta Law','Private-capital legal and compliance work','Parent $500M Series G Aug 2021; Avantia acquired May 2026','Parent about $1.16B database estimate; Carta Law allocation and purchase price undisclosed'),
('Lawhive','Consumer and small-business legal services','$60M Series B; Feb 2026','At least $111.9M plus £1.3M pre-seed; currencies not combined'),
('Garfield AI / Garfield.Law','England/Wales small-debt claims','No public round located','Not disclosed'),
('Moritz (moritzlegal.com)','Commercial, privacy, corporate and other company work','$9M seed reported May 2026','$9M disclosed'),
('Norm Ai / Norm Law','Regulatory agents and affiliated legal services','$120M Series C announced Jul 7, 2026','>$260M company-stated'),
('General Legal','US company contracts, privacy and regulation','$11.5M combined pre-seed/seed; Mar 2026','$11.5M disclosed'),
('Eudia','Enterprise legal platform and legal services','Up to $105M Series A; Feb 2025','Up to $105M commitment; funded cash not fully established'),
('LegalOS (legalos.ai)','US employment-based immigration petitions','YC Winter 2026; no company-specific round amount','Not disclosed')
]
def slug(name):
    return 'company-' + re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')

strategy = (out/'strategy.md').read_text()
table = '\n## Funding and work comparison\n\nAll dollar figures are US dollars. M means million; B means billion. Totals are not cash balances. Credit facilities may be undrawn. The profiles give direct funding sources and limits. No grand total is calculated because the figures are not comparable.\n\n'
table += '| Company and profile | Main legal work | Latest located round or transaction | Total and treatment |\n|---|---|---|---|\n'
for name, focus, recent, total in rows:
    table += f'| [{name}](#{slug(name)}) | {focus} | {recent} | {total} |\n'

intro,rest = strategy.split('## Launch assessment',1)
body = intro + '\n[Funding comparison](#funding-and-work-comparison) · [Launch assessment](#launch-assessment) · [Features to adapt](#features-to-adapt) · [Company profiles](#company-profiles)\n\n' + table + '\n## Launch assessment' + rest
body += '\n\n## Company profiles\n\nThese profiles describe advertised products and reported funding. The launch priorities above govern the suggested CounselOS scope. Individual feature ideas below are candidates, not a commitment to build every item. Missing public detail does not establish that a competitor lacks a capability.\n\n'
for name, *_ in rows:
    body += f'<a id="{slug(name)}"></a>\n\n' + profiles[name] + '\n\n'

# Make local citations absolute for the desktop viewer.
body = re.sub(r'\]\(\.\./\.\./([^\)]+)\)', lambda m: '](' + str(root/m.group(1)) + ')', body)

# Keep a numbered citation beside each external claim, with a complete URL inventory.
sources = {}
def cite(m):
    label,url = m.groups()
    if url not in sources:
        sources[url] = (len(sources)+1,label)
    n,_ = sources[url]
    return f'{label}[^{n}]'
body = re.sub(r'\[([^\]]+)\]\((https?://[^\s]+?)\)',cite,body)
body += '\n## Sources\n\nSources are linked at each claim. Undated product pages were accessed on September 10, 2026. Publication and announcement dates are retained in the profiles where established. Company results and performance figures remain company claims.\n\n'
for url,(n,label) in sources.items():
    publisher = urlparse(url).netloc.removeprefix('www.')
    body += f'[^{n}]: {publisher}. [{label}]({url}). Accessed September 10, 2026.\n\n'
(out/'CounselOS-competitive-report.md').write_text(body)

rendered = markdown.markdown(body, extensions=['tables','footnotes','toc'])
rendered = re.sub(r'(<table>.*?</table>)', r'<div class="table-scroll">\1</div>', rendered, flags=re.S)
html_doc = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CounselOS competitive assessment</title><style>
body{margin:0;color:#202020;background:#fff;font:17px/1.65 system-ui,-apple-system,sans-serif}main{max-width:1120px;margin:50px auto;padding:0 30px}h1{font-size:38px;line-height:1.2;letter-spacing:-.025em}h2{font-size:27px;line-height:1.3;margin-top:48px;border-top:1px solid #ccc;padding-top:24px}h3{font-size:19px;margin-top:26px}p,li{max-width:90ch}a{color:#174b72;text-underline-offset:3px}table{border-collapse:collapse;font-size:14px;line-height:1.5;min-width:760px;width:100%}th,td{padding:12px;text-align:left;vertical-align:top;border:1px solid #ddd}th{background:#eee}tr:nth-child(even){background:#fafafa}.table-scroll{overflow-x:auto;margin:24px 0}sup{font-size:11px}.footnote{font-size:13px;overflow-wrap:anywhere}.footnote li{margin:10px 0}a[id]{scroll-margin-top:20px}@media(max-width:640px){main{padding:0 18px;margin:28px auto}h1{font-size:30px}body{font-size:16px}}@media print{main{max-width:none;margin:0;padding:0}body{font-size:10pt}h1{font-size:24pt}h2{font-size:16pt}table{font-size:8pt;min-width:0}th,td{padding:5px}.table-scroll{overflow:visible}h2,h3{break-after:avoid}tr{break-inside:avoid}a{color:#222}}
</style><main>''' + rendered + '</main></html>'
(out/'CounselOS-competitive-report.html').write_text(html_doc)
with (out/'company-comparison.csv').open('w',newline='') as f:
    writer=csv.writer(f)
    writer.writerow(['Company','Main legal work','Latest located round or transaction','Total and treatment','Profile anchor'])
    writer.writerows([(*row,slug(row[0])) for row in rows])
assert len(profiles)==22 and len(rows)==22
assert 'legorai.com' not in body
assert not re.search(r'cite|turn\d+(search|view)',body)
assert all(f'id="{slug(r[0])}"' in html_doc for r in rows)
print({'companies':len(rows),'unique_sources':len(sources),'report_words':len(body.split()),'artifacts':['CounselOS-competitive-report.md','CounselOS-competitive-report.html','company-comparison.csv']})
