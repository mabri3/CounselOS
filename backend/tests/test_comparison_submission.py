import pytest
from app.models.api import ChatRequest
from app.routers.chat import freeze_run_context
from app.providers.base import ProviderReply

M='MAT-DEMO-RELAY'

@pytest.mark.asyncio
async def test_comparison_ids_reach_model_without_entering_visible_message(app_context):
    app=app_context
    a=app.solution_paths.ensure_baseline(M)
    b=app.solution_paths.explore(M,parent_path_id=a['scenario_id'],parent_revision=a['revision'],title=a['title'],source_action_key='comparison-test')
    ids=[b['scenario_id'],a['scenario_id']]
    text='Compare these approaches: “Current approach” and “Current approach”.'
    request=freeze_run_context(ChatRequest(matter_id=M,message=text,experimental_chat=True,comparison_path_ids=ids),app,'RUN-comparison')
    assert request.message==text
    assert request.frozen_context['requested_comparison_path_ids']==ids
    messages=[]
    class Provider:
        async def complete(self,incoming,tools=None):
            messages.extend(incoming)
            return ProviderReply(content='The approaches differ in their assumptions.')
    app.runner.provider=Provider()
    await app.runner.run(request)
    selection=next(m['content'] for m in messages if m['role']=='system' and 'lawyer clicked Compare' in m['content'])
    assert selection.index(ids[0]) < selection.index(ids[1])
    assert app.solution_paths.state(M)['mainline_path_id']==a['scenario_id']

@pytest.mark.parametrize('kind',['single','duplicate','missing'])
def test_invalid_comparison_selection_is_rejected(app_context,kind):
    a=app_context.solution_paths.ensure_baseline(M)['scenario_id']
    ids={'single':[a],'duplicate':[a,a],'missing':[a,'SCN-not-in-this-matter']}[kind]
    with pytest.raises((ValueError,KeyError,FileNotFoundError)):
        freeze_run_context(ChatRequest(matter_id=M,message='Compare.',comparison_path_ids=ids),app_context,'RUN-invalid')

@pytest.mark.asyncio
async def test_compare_returns_saved_substance_with_bounded_read_and_honors_exclusions(app_context):
    from app.tools.matter_paths import path_action
    from app.tools.registry import ToolExecutionContext
    app=app_context
    a=app.solution_paths.ensure_baseline(M)
    analysis='Pause launch until readiness checks pass.\n'+'Detailed basis. '*500
    a=app.workspace_scenarios.save(M,{**a,'analysis':analysis},expected_revision=a['revision'])
    b=app.solution_paths.explore(M,parent_path_id=a['scenario_id'],parent_revision=a['revision'],title='Bank',source_action_key='bank-compare',hypothesis_summary='A bank holds customer funds.')
    context=ToolExecutionContext(app=app,matter_id=M,frozen_context={})
    args={'action':'compare_paths','values':{'path_ids':[a['scenario_id'],b['scenario_id']]}}
    result=(await path_action(context,args))['data']['paths']
    assert result[0]['analysis']==analysis[:6000]
    assert result[0]['analysis_truncated'] is True
    assert analysis.strip() == app.vault.read_markdown(result[0]['read_path'])['content'].strip()
    assert result[1]['hypothesis_summary']=='A bank holds customer funds.'
    assert 'is_stale' in result[0]['stale']
    context.frozen_context['excluded_paths']=['withheld-source.md']
    withheld=(await path_action(context,args))['data']
    assert withheld['historical_material_withheld'] is True
    assert all(set(p)=={'path_id','revision'} for p in withheld['paths'])
