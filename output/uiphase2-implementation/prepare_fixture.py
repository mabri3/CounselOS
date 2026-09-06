from pathlib import Path
import sys, shutil, json
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parents[1]/'backend'))
from isolated_server import isolated_settings, VAULT, TEST_ROOT
TEST_ROOT.mkdir(exist_ok=True)
assert VAULT.resolve().is_relative_to(TEST_ROOT.resolve())
if not VAULT.exists():
    shutil.copytree(ROOT.parents[1]/'backend/tests/fixtures/vault',VAULT)
    (VAULT/'00_System/settings.md').unlink(missing_ok=True)
from app.runtime import AppContext
app=AppContext(isolated_settings())
(ROOT/'fixture-manifest.json').write_text(json.dumps({'synthetic':True,'vault':str(VAULT),'pointer':str(TEST_ROOT/'active-vault.json'),'matters':app.matters.list()},indent=2,default=str))
print('Isolated fixture ready:',VAULT)
