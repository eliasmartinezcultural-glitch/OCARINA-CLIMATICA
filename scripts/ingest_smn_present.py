import csv
import io
import json
import re
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path

URL = "https://ssl.smn.gob.ar/dpd/zipopendata.php?dato=tiepre"
TARGET = "san patricio del chanar"
OUT = Path("data/live/smn-present.json")

def norm(value):
    value = (value or "").strip().lower()
    value = value.replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u").replace("ñ","n")
    return re.sub(r"\s+", " ", value)

def iso_datetime(fecha, hora):
    raw = ((fecha or "") + " " + (hora or "")).strip()
    for fmt in ("%d/%m/%Y %H:%M", "%d/%m/%Y %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(raw, fmt).replace(tzinfo=timezone.utc).isoformat()
        except ValueError:
            pass
    return None

def number(value):
    if value is None:
        return None
    value = value.strip().replace(",", ".")
    try:
        return float(value)
    except ValueError:
        return None

def main():
    req = urllib.request.Request(URL, headers={"User-Agent":"Mozilla/5.0 OCARINA-CLIMATICA"})
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = response.read()

    with zipfile.ZipFile(io.BytesIO(payload)) as z:
        names = z.namelist()
        txt = next((n for n in names if n.lower().endswith(".txt")), None)
        if not txt:
            raise RuntimeError("El ZIP SMN no contiene un TXT reconocible.")
        raw = z.read(txt).decode("latin-1", errors="replace")

    rows = list(csv.reader(io.StringIO(raw), delimiter=";"))
    match = None

    for row in rows:
        if len(row) < 10:
            continue
        locality = norm(row[0])
        if locality == TARGET:
            match = row
            break

    result = {
        "status": "unavailable",
        "source": "SMN",
        "dataset": "Estado del Tiempo presente",
        "target": "San Patricio del Chañar",
        "retrievedAt": datetime.now(timezone.utc).isoformat(),
        "station": None,
        "observedAt": None,
        "observations": {},
        "notes": "No se encontró una fila con localidad exacta. No se sustituye por otra estación."
    }

    if match:
        result.update({
            "status": "candidate",
            "station": match[0].strip(),
            "observedAt": iso_datetime(match[1], match[2]),
            "observations": {
                "temperature": number(match[5]),
                "humidity": number(match[7]),
                "windSpeed": number(match[8]),
                "pressure": number(match[9]),
                "windDirection": match[8].strip() if len(match) > 8 else None
            },
            "notes": "Registro extraído del recurso SMN; pendiente de validación en el navegador."
        })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
