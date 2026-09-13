from pathlib import Path
import hashlib
import json
import sys
import urllib.request

root = Path(__file__).resolve().parent
matter = root / "browser-vault/03_Matters/beacon-instant-onboarding"
with urllib.request.urlopen("http://localhost:8207/api/fixture/dossier-research/state") as response:
    state = json.load(response)
state["matter_hashes"] = {
    str(path.relative_to(matter)): hashlib.sha256(path.read_bytes()).hexdigest()
    for path in sorted(matter.rglob("*")) if path.is_file()
}
(root / (sys.argv[1] + ".json")).write_text(json.dumps(state, indent=2) + "\n")
print(json.dumps({key: value for key, value in state.items() if key != "matter_hashes"}))
