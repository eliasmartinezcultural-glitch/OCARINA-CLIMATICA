import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
LIVE=ROOT/"data/live"
REQUIRED_META={"status"}

def check_json(path):
    data=json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data,dict): raise ValueError(f"{path}: snapshot raíz no es objeto")
    missing=REQUIRED_META-set(data)
    if missing: raise ValueError(f"{path}: faltan campos {sorted(missing)}")
    if not any(data.get(k) for k in ("source","sourceUrl","sourceId","provider")):
        raise ValueError(f"{path}: snapshot sin referencia de fuente")
    if data.get("status")=="ready" and not (data.get("retrievedAt") or data.get("observedAt")):
        raise ValueError(f"{path}: ready sin fecha de trazabilidad")
    return data

for path in sorted(LIVE.glob("*.json")):
    check_json(path)
print(f"OK: {len(list(LIVE.glob('*.json')))} snapshots JSON revisados")
