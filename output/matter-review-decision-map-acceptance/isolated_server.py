import os, sys, json
from pathlib import Path
root = Path(__file__).resolve().parents[2]
env = json.loads((Path(__file__).parent / "environment.json").read_text())
sys.path.insert(0, str(root / "backend"))
os.environ["VAULT_PATH"] = env["vault"]
os.environ["SCHEDULER_ENABLED"] = "false"
os.environ["FRONTEND_ORIGIN"] = "http://localhost:3123"
from app import main
from app.active_context import ActiveContextManager
main.ActiveContextManager = lambda settings: ActiveContextManager(settings, pointer_path=Path(env["temporary_root"]) / "active-vault.json")
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(main.app, host="127.0.0.1", port=env["backend_port"])
