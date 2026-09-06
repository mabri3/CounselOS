"""Read-only snapshots of the isolated browser fixture for acceptance comparisons."""
import hashlib
import json
import sys
from pathlib import Path

folder = Path(__file__).resolve().parent
environment = json.loads((folder / "environment.json").read_text())
vault = Path(environment["vault"]).resolve()
assert str(vault).startswith(("/private/var/folders/", "/var/folders/", "/tmp/", "/private/tmp/"))
matter = vault / environment["matter_path"]
label = sys.argv[1]
assert label.replace("-", "").replace("_", "").isalnum()
files = {}
for file in matter.rglob("*.md"):
    if file.is_file():
        files[str(file.relative_to(matter))] = hashlib.sha256(file.read_bytes()).hexdigest()
result = {"matter_id": environment["matter_id"], "vault": str(vault), "files": files}
(folder / f"fixture-{label}.json").write_text(json.dumps(result, indent=2) + "\n")
print(f"Saved {len(files)} isolated matter file hashes for {label}.")
