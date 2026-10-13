#!/usr/bin/env python3
"""Pronóstico independiente MET Norway para el punto de referencia de San Patricio del Chañar.
Es un pronóstico de modelo, nunca una observación instrumental local.
"""
import json
import math
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data/live/metno-forecast.json"
LAT, LON = -38.625, -68.300
ALTITUDE_M = 357
BASE = "https://api.met.no/weatherapi/locationforecast/2.0/compact"
URL = BASE + "?" + urllib.parse.urlencode({
    "lat": round(LAT, 4), "lon": round(LON, 4), "altitude": ALTITUDE_M
})
SOURCE_URL = "https://api.met.no/weatherapi/locationforecast/2.0/documentation"
USER_AGENT = "OcarinaClimatica/1.0 (https://eliasmartinezcultural-glitch.github.io/OCARINA-CLIMATICA/)"

def main():
    request = urllib.request.Request(URL, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/json"
    })
    with urllib.request.urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError("MET Norway respondió HTTP " + str(response.status))
        payload = json.loads(response.read().decode("utf-8"))

    props = payload.get("properties") or {}
    timeseries = props.get("timeseries") or []
    if not timeseries:
        raise RuntimeError("MET Norway no devolvió una serie temporal")
    units = (props.get("meta") or {}).get("units") or {}
    now = datetime.now(timezone.utc)
    records = []
    for item in timeseries:
        stamp = item.get("time")
        data = item.get("data") or {}
        instant = (data.get("instant") or {}).get("details") or {}
        if not stamp or not instant:
            continue
        record = {
            "time": stamp,
            "temperatureC": instant.get("air_temperature"),
            "relativeHumidityPct": instant.get("relative_humidity"),
            "windSpeedMs": instant.get("wind_speed"),
            "windDirectionDegrees": instant.get("wind_from_direction"),
            "windGustMs": instant.get("wind_speed_of_gust"),
            "airPressureHpa": instant.get("air_pressure_at_sea_level"),
            "cloudCoverPct": instant.get("cloud_area_fraction"),
            "precipitationNextHourMm": ((data.get("next_1_hours") or {}).get("details") or {}).get("precipitation_amount"),
            "symbolCode": ((data.get("next_1_hours") or {}).get("summary") or {}).get("symbol_code")
        }
        for key in ("temperatureC", "relativeHumidityPct", "windSpeedMs", "windDirectionDegrees", "windGustMs", "airPressureHpa", "cloudCoverPct", "precipitationNextHourMm"):
            value = record.get(key)
            if value is not None and (not isinstance(value, (int, float)) or not math.isfinite(value)):
                record[key] = None
        records.append(record)

    if not records or records[0].get("temperatureC") is None:
        raise RuntimeError("La respuesta no incluye temperatura válida para el primer período")
    retrieved = datetime.now(timezone.utc).isoformat()
    result = {
        "schemaVersion": 1,
        "status": "ready",
        "source": "MET Norway Locationforecast 2.0",
        "sourceUrl": SOURCE_URL,
        "requestUrl": URL,
        "retrievedAt": retrieved,
        "validTime": records[0]["time"],
        "target": "San Patricio del Chañar",
        "location": {"latitude": LAT, "longitude": LON, "altitudeM": ALTITUDE_M, "coordinateStatus": "provisional-reference-point"},
        "measurementType": "independent-model-forecast",
        "units": units,
        "model": "MET Norway Locationforecast (modelo global; fuente independiente de Open-Meteo)",
        "data": records,
        "quality": {"responseShape": "passed", "temperatureAvailable": True, "stationObservation": False},
        "attribution": "Datos de pronóstico de MET Norway; consultar sus condiciones de uso y atribución.",
        "note": "Pronóstico para coordenadas de referencia, no medición de una estación local. Compararlo con observaciones verificadas y no interpretarlo como garantía de precisión."
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("MET Norway OK · períodos:", len(records), "· primer válido:", result["validTime"])

if __name__ == "__main__":
    main()
