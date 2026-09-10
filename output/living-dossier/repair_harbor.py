"""Repair only the generated Harbor synthesis from the verified chat run."""
from pathlib import Path

from app.config import Settings
from app.runtime import AppContext
from app.services.recommendations import RecommendationService

root = Path('/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3')
context = AppContext(Settings(vault_path=str(root), scheduler_enabled=False), recover_interrupted=False)
matter_id = 'MAT-20260908-230656'
service = RecommendationService(context.vault, context.matters)
saved = service.get(matter_id)
assert saved['current_version_id'] == 'REC-20260909-7a9be8', 'The recommendation changed; do not overwrite it.'
version = saved['versions'][-1]
assert version['origin'] == 'initial_agent' and not saved['proposal']
dossier = context.dossiers.get(matter_id)
assert dossier['metadata']['content_hash'] == context.dossiers.content_hash(matter_id), 'Preserve lawyer edits.'

# The model embedded an action heading identical to the dossier boundary.
# Normalize that one inner heading before projecting the corrected version.
body = dossier['content']
assert body.count('\n## Next counsel action\n') == 2
body = body.replace('\n## Next counsel action\n', '\n### Next counsel action\n', 1)
fixed = context.dossiers.propose_update(matter_id, body, expected_hash=context.dossiers.content_hash(matter_id))
assert fixed['state'] == 'applied'

content = saved['content'].replace('Delay close to Q1 2026.', 'Delay close until the necessary review and approvals are complete.')
content = content.replace('delays revenue synergy and market entry by 3–4 months.', 'delays revenue synergy and market entry; the duration needs confirmation.')
content += '\n\n### Synthesis note\nThe earlier generated calendar estimate was unsupported and has been removed. This is a working synthesis of saved analysis, not newly verified research.\n'
result = service.set_working(matter_id, content, actor='Themis.ai', origin='initial_agent', next_action=version.get('next_action', ''))
assert result['dossier_projection']['state'] == 'applied', result['dossier_projection']
assert context.dossiers.get(matter_id)['content'].count('\n## Next counsel action\n') == 1
print({'recommendation_version': result['current_version_id'], 'dossier_projection': result['dossier_projection']['state']})
