import pytest
from app.models.api import ChatRequest
from app.routers.chat import freeze_run_context
from app.providers.base import ProviderReply
from app.services.experimental_chat import guidance, read_skill
M='MAT-DEMO-RELAY'


def test_shared_fallback_edit_disable_and_budget(app_context):
    registry=app_context.skills
    first=registry.matter_paths_snapshot()
    assert first['enabled'] and len(first['instructions'])<8000
    registry.update('matter-paths',instructions='Edited shared guidance.')
    second=registry.matter_paths_snapshot()
    assert second['instructions']=='Edited shared guidance.' and second['revision']!=first['revision']
    with pytest.raises(ValueError): registry.update('matter-paths',instructions='x'*8001)
    app_context.vault.update_markdown(second['path'],metadata_updates={'enabled':False})
    assert registry.matter_paths_snapshot()['status']=='disabled'
    assert 'matter-paths' not in [s['name'] for s in guidance(app_context.vault)['skills']]
    assert read_skill(app_context.vault,'matter-paths')['scope']=='shared'


@pytest.mark.asyncio
@pytest.mark.parametrize('experimental',[False,True])
async def test_frozen_skill_in_both_actual_dispatches(app_context,experimental):
    payload=freeze_run_context(ChatRequest(agent_id='counsel-copilot',matter_id=M,message='Explain.',experimental_chat=experimental),app_context,'RUN-frozen')
    old=payload.frozen_context['matter_paths_skill']
    app_context.skills.update('matter-paths',instructions='CHANGED-AFTER-SUBMISSION')
    messages=[]
    class Provider:
        async def complete(self,messages_in,tools=None):
            messages.extend(messages_in)
            return ProviderReply(content='Useful answer.')
    app_context.runner.provider=Provider()
    await app_context.runner.run(payload)
    serialized='\n'.join(str(m['content']) for m in messages)
    assert old['instructions'] in serialized
    assert 'CHANGED-AFTER-SUBMISSION' not in serialized
    assert serialized.count(old['instructions'])==1
    newer=freeze_run_context(ChatRequest(agent_id='counsel-copilot',matter_id=M,message='New turn.'),app_context,'RUN-new')
    assert newer.frozen_context['matter_paths_skill']['instructions']=='CHANGED-AFTER-SUBMISSION'


def test_normal_skill_editor_exposes_fallback_without_installing_it(app_context):
    from app.routers.skills import list_skills,get_skill
    path='00_System/skills/matter-paths.md'
    assert not app_context.vault.exists(path)
    skill=next(s for s in list_skills(app_context)['skills'] if s['skill_id']=='matter-paths')
    assert skill['instructions']==get_skill('matter-paths',app_context)['instructions']
    assert not app_context.vault.exists(path)
