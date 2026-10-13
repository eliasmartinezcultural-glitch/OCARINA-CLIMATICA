#!/usr/bin/env python3
"""Captura un snapshot meteorológico para San Patricio del Chañar.
El dato es un pronóstico/modelo para el punto geográfico, no una observación de estación local.
"""
import json
import math
import statistics
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data/live/open-meteo.json"
LAT, LON = -38.625, -68.300  # punto de referencia provisional; verificar contra cartografía urbana
URL = "https://api.open-meteo.com/v1/forecast?" + urllib.parse.urlencode({
    "latitude": LAT, "longitude": LON,
    "current": "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    "hourly": "temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m",
    "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max",
    "timezone": "America/Argentina/Cordoba", "forecast_days": 7,
    "wind_speed_unit": "kmh", "precipitation_unit": "mm", "temperature_unit": "celsius"
})

def main():
    request = urllib.request.Request(URL, headers={"User-Agent": "OcarinaClimatica/1.0", "Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=25) as response:
        if response.status != 200:
            raise RuntimeError("Open-Meteo respondió HTTP " + str(response.status))
        data = json.loads(response.read().decode("utf-8"))
    current, hourly, daily = data.get("current"), data.get("hourly"), data.get("daily")
    if not isinstance(current, dict) or not isinstance(hourly, dict) or not isinstance(daily, dict):
        raise RuntimeError("Respuesta Open-Meteo incompleta: faltan current/hourly/daily")
    for key in ("temperature_2m", "weather_code", "time"):
        if current.get(key) is None:
            raise RuntimeError("Falta variable actual esencial: " + key)
    if len(hourly.get("time", [])) < 8 or len(daily.get("time", [])) < 3:
        raise RuntimeError("Cobertura de pronóstico insuficiente")
    for key in ("temperature_2m", "weather_code", "precipitation_probability"):
        if not isinstance(hourly.get(key), list):
            raise RuntimeError("Variable horaria inválida: " + key)
    for value in (current.get("temperature_2m"), current.get("apparent_temperature")):
        if value is not None and not math.isfinite(float(value)):
            raise RuntimeError("Temperatura no finita")
    result = {
        "schemaVersion": 1, "status": "ready", "source": "Open-Meteo",
        "sourceUrl": "https://open-meteo.com/en/docs",
        "retrievedAt": datetime.now(timezone.utc).isoformat(),
        "validTime": current.get("time"),
        "location": {"name": "San Patricio del Chañar", "latitude": LAT, "longitude": LON,
                     "coordinateStatus": "provisional-reference-point"},
        "measurementType": "model-estimate-and-forecast",
        "model": "Open-Meteo Best Match (selección automática del modelo disponible)",
        "attribution": "Weather data by Open-Meteo.com",
        "data": data,
        "quality": {"shape": "passed", "essentialVariables": "passed",
                    "localStationObservation": False},
        "note": "La temperatura actual es una estimación del modelo para el punto indicado, no una medición de una estación meteorológica en el pueblo."
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    compare_models()
    print("Open-Meteo OK · válido para " + str(result["validTime"]) + " · " + str(len(hourly["time"])) + " horas")

def compare_models():
    """Compara varios modelos si el endpoint multi-modelo está disponible; nunca invalida el pronóstico base."""
    output = {"schemaVersion": 1, "source": "Open-Meteo", "sourceUrl": "https://open-meteo.com/en/docs",
              "retrievedAt": datetime.now(timezone.utc).isoformat(), "status": "unavailable",
              "target": "San Patricio del Chañar", "modelsRequested": ["ecmwf_ifs025", "gfs_seamless", "icon_seamless"],
              "modelsAvailable": [], "hourlyConsensus": [],
              "note": "La dispersión entre modelos orienta la incertidumbre; no es una probabilidad calibrada ni una garantía."}
    try:
        params = urllib.parse.urlencode({
            "latitude": LAT, "longitude": LON, "models": "ecmwf_ifs025,gfs_seamless,icon_seamless",
            "hourly": "temperature_2m,precipitation,precipitation_probability,wind_speed_10m",
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
            "timezone": "America/Argentina/Cordoba", "forecast_days": 3,
            "wind_speed_unit": "kmh", "precipitation_unit": "mm", "temperature_unit": "celsius"
        })
        request = urllib.request.Request("https://api.open-meteo.com/v1/forecast?" + params,
            headers={"User-Agent": "OcarinaClimatica/1.0", "Accept": "application/json"})
        with urllib.request.urlopen(request, timeout=25) as response:
            payload = json.loads(response.read().decode("utf-8"))
        hourly_data = payload.get("hourly") or {}
        temp_keys = [key for key in hourly_data if key.startswith("temperature_2m_") and isinstance(hourly_data[key], list)]
        models = [key[len("temperature_2m_"):] for key in temp_keys]
        output["modelsAvailable"] = models
        output["modelCount"] = len(models)
        times = hourly_data.get("time") or []
        for i, stamp in enumerate(times[:72]):
            values = []
            for key in temp_keys:
                arr = hourly_data.get(key) or []
                if i < len(arr) and isinstance(arr[i], (int, float)) and math.isfinite(arr[i]):
                    values.append(float(arr[i]))
            output["hourlyConsensus"].append({
                "time": stamp, "modelCount": len(values),
                "temperatureMin": min(values) if values else None,
                "temperatureMax": max(values) if values else None,
                "temperatureMean": round(statistics.mean(values), 1) if values else None,
                "temperatureSpread": round(max(values)-min(values), 1) if len(values) >= 2 else None
            })
        output["daily"] = payload.get("daily", {})
        output["status"] = "ready" if len(models) >= 2 else ("partial" if models else "unavailable")
    except Exception as exc:
        output["status"] = "unavailable"
        output["error"] = str(exc)[:300]
    (ROOT / "data/live/model-comparison.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
