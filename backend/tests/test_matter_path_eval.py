import importlib.util,json
from pathlib import Path
import pytest
PATH=Path(__file__).resolve().parents[1]/'scripts/evaluate_matter_paths.py'
spec=importlib.util.spec_from_file_location('path_eval',PATH);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)

def test_frozen_cases_and_rubric():
    module.validate_cases(json.loads(module.CASES.read_text()))
    assert sum(module.RUBRIC.values())==100

def test_dimension_deductions_reconcile():
    row={'episode_id':'E01','message_id':'MSG-1','criterion_id':'I1','dimension':'factual_decision_integrity','available_points':25,'earned_points':20,'exact_loss':5,'expected':'facts unchanged','observed':'one unsupported fact','evidence':'state-diff.json','assessment_method':'deterministic','failure_category':'fact_contamination'}
    result=module.score([row]);assert result['available']==25 and result['earned']==20
    assert result['integrity_failures']==[row]
    with pytest.raises(AssertionError):module.score([{**row,'exact_loss':4}])

def test_dry_run_is_unscored(tmp_path):
    import subprocess,sys
    out=tmp_path/'dry';replay=tmp_path/'replay'
    subprocess.run([sys.executable,str(PATH),'--mode','dry-run','--output',str(out)],check=True,capture_output=True)
    subprocess.run([sys.executable,str(PATH),'--mode','replay','--input',str(out),'--output',str(replay)],check=True,capture_output=True)
    assert json.loads((replay/'scores.json').read_text())['available']==0
    assert json.loads((out/'manifest.json').read_text())['paid_calls']==0


@pytest.mark.asyncio
async def test_live_fixture_materializes_declared_paths_and_pinned_source(app_context):
    cases=json.loads(module.CASES.read_text())
    fixture=await module.prepare_fixture(app_context,cases[9],'MAT-DEMO-RELAY')
    assert app_context.solution_paths.state('MAT-DEMO-RELAY')['mainline_path_id']==fixture['path_ids']['B']
    c=app_context.workspace_scenarios.get('MAT-DEMO-RELAY',fixture['path_ids']['C'])
    assert c['parent_path_id']==fixture['path_ids']['B']
    assert {a['change_id'] for a in c['proposed_fact_changes']}=={'bank-custody','timing'}
    assert app_context.matter_memory.read('MAT-DEMO-RELAY',fixture['path_ids']['A'])['sequence']==1
    assert app_context.source_library.describe('MAT-DEMO-RELAY',fixture['source_id'],fixture['source_version'])['extraction_state']=='complete'
