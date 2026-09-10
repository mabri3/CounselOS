"""Reuse the live fixture; change only collection routing and run the public case."""
from pathlib import Path
helper = Path('/Users/bharris/Programs/counsel-os-mvp/backend/tests/manual/evaluate_research_investigation.py')
source = helper.read_text()
changes = {
    'from app.config import Settings': 'from app.config import Settings\nfrom app.providers.base import ProviderSelection',
    'context.runner.resolve("research-agent").selection': 'ProviderSelection("research-agent", "opencode_go", "deepseek-v4-flash", "default")',
    'for matter, external, question in cases:': 'for matter, external, question in cases[:1]:',
    'provider_ids=options["provider_ids"] if external else [], allow_followup_queries=external': 'provider_ids=[], native=True, collector_model_selection={"provider": "opencode_go", "model": "deepseek-v4-flash"}, allow_followup_queries=external',
    'output/main-agent-research-dossier/live-results.json': 'output/main-agent-research-dossier/live-opencode-results.json',
}
for old, new in changes.items():
    assert source.count(old) == 1, old
    source = source.replace(old, new)
exec(compile(source, str(helper), 'exec'), {'__name__': '__main__', '__file__': str(helper)})
