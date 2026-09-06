from isolated_server import ROOT,VAULT,TEST_ROOT,isolated_settings
from app.runtime import AppContext
assert VAULT.resolve().is_relative_to(TEST_ROOT.resolve())
a=AppContext(isolated_settings()); mid='MAT-DEMO-APEX'
path='03_Matters/project-apex-ai/research/phase2-process.md'
for i,state in enumerate(['complete','complete','partial']):
 rid=f'RUN-PHASE2-{i+1}'
 a.research_runs._write(mid,rid,state="completed",questions=['Confirm the review owner and process version.'],completed=1,status=('Partial: ' if state=='partial' else '')+'Synthetic stored research packet.',results=[{'question':'Confirm the review owner and process version.','path':path,'summary':'The supplied process names Operations and requires a recorded version.','internal_sources':2,'external_sources':0,'external_authority_retrieved':False,'public_research_status':'unavailable','research_warnings':['Supplied operational process only; no legal authority retrieved.']}],queue_order=i+1,finished_at='2026-09-06T00:00:00+00:00')
a.index.rebuild();print('Stored queue fixture prepared; no research was run.')
