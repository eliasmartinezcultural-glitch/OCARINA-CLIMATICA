import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = ROOT / "data/live"
CONFIG = ROOT / "data/config.js"
CATALOG = ROOT / "data/source-catalog.js"

ALLOWED_QUALITY = {"observed", "forecast", "derived", "estimated", "documentary", "memory"}
BLOCKED_TERMS = ["partido", "campaña electoral", "candidato", "elecciones", "farándula", "policiales"]

def fail(errors, message):
    errors.append(message)

def load_json(path, errors):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(errors, f"{path.relative_to(ROOT)}: JSON inválido: {exc}")
        return None

def validate_record(record, label, errors):
    if not isinstance(record, dict):
        fail(errors, f"{label}: el registro no es objeto")
        return
    for key in ("observedAt", "stationName", "sourceId", "quality"):
        if not record.get(key):
            fail(errors, f"{label}: falta {key}")
    quality = record.get("quality")
    if quality not in ALLOWED_QUALITY:
        fail(errors, f"{label}: quality inválida: {quality}")
    tmin, tmax = record.get("temperatureMin"), record.get("temperatureMax")
    if isinstance(tmin, (int, float)) and isinstance(tmax, (int, float)) and tmax < tmin:
        fail(errors, f"{label}: temperatureMax < temperatureMin")
    for key in ("precipitation", "windSpeed", "windGust", "pressure"):
        value = record.get(key)
        if isinstance(value, (int, float)) and value < 0:
            fail(errors, f"{label}: {key} no puede ser negativo")
    humidity = record.get("humidity")
    if isinstance(humidity, (int, float)) and not 0 <= humidity <= 100:
        fail(errors, f"{label}: humidity fuera de 0..100")

def validate_snapshot(path, errors):
    data = load_json(path, errors)
    if data is None:
        return
    status=data.get("status")
    if status=="ready" and not data.get("retrievedAt"):
        fail(errors, f"{path.relative_to(ROOT)}: snapshot ready sin retrievedAt")
    records = data.get("records")
    if records is None:
        return
    if not isinstance(records, list):
        fail(errors, f"{path.relative_to(ROOT)}: records no es lista")
        return
    seen = set()
    for index, record in enumerate(records):
        label = f"{path.relative_to(ROOT)}[{index}]"
        validate_record(record, label, errors)
        if isinstance(record, dict):
            key = (record.get("observedAt"), record.get("stationName"))
            if key in seen:
                fail(errors, f"{path.relative_to(ROOT)}: registro duplicado {key}")
            seen.add(key)

def validate_policy(errors):
    if not CONFIG.exists():
        fail(errors, "Falta data/config.js")
    else:
        config = CONFIG.read_text(encoding="utf-8").lower()
        if "never substitute silently" not in config:
            fail(errors, "data/config.js perdió la política de no sustitución silenciosa")
        if "exact-only" not in config:
            fail(errors, "data/config.js perdió la regla de localidad exacta")
    if not CATALOG.exists():
        fail(errors, "Falta data/source-catalog.js")
    else:
        text = CATALOG.read_text(encoding="utf-8").lower()
        for term in BLOCKED_TERMS:
            if term in text:
                fail(errors, f"El catálogo de fuentes contiene término editorial bloqueado: {term}")

def main():
    errors = []
    validate_policy(errors)
    for path in sorted(LIVE.glob("*.json")):
        validate_snapshot(path, errors)
    if errors:
        print("VALIDACIÓN CLIMÁTICA: FAIL")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print("VALIDACIÓN CLIMÁTICA: OK")
    print("Política territorial, evidencia, rangos básicos y duplicados: verificados.")

if __name__ == "__main__":
    main()
