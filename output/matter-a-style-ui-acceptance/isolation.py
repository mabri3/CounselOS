import json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'backend'))
from app.config import Settings
ENV=json.loads((Path(__file__).parent/'environment.json').read_text())
def isolated_settings():
 return Settings(_env_file=None,vault_path=ENV['vault'],scheduler_enabled=False,llm_provider='mock',llm_api_key=None,llm_model=None,polaris_api_key=None,search_provider='disabled',frontend_origin='http://localhost:3123')
