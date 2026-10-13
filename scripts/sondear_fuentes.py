#!/usr/bin/env python3
"""Sondeador de fuentes: verifica endpoints, descubre estaciones SMN cercanas y genera salud trazable."""
import json, math, time, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE = ROOT / "data/live"
LAT, LON = -38.625, -68.300
STATIONS_URL = "https://w2b.smn.gov.ar/oapi/collections/stations/items?f=json&limit=1000"
SMN_SYNOPTIC = "https://w2b.smn.gov.ar/oapi/collections/urn%3Awmo%3Amd%3Aar-smn%3Aslt0ci/items?f=json&limit=1"
SMN_AUTOMATIC = "https://w2b.smn.gov.ar/oapi/collections/urn%3Awmo%3Amd%3Aar-smn%3Aautosmn/items?f=json&limit=1"
SMN_CATALOG = "https://www.datos.gob.ar/dataset/smn-listado-estaciones-meteorologicas-smn/archivo/smn_9.1"
SMN_HOURLY = "https://ssl.smn.gob.ar/dpd/zipopendata.php?dato=datohorario"
SMN_PRESENT = "https://ssl.smn.gob.ar/dpd/zipopendata.php?dato=tiepre"
SMN_ALERTS = "https://ws2.smn.gob.ar/alertas"
SMN_HOME = "https://www.smn.gob.ar/"
AIC_FORECAST = "https://www.aic.gob.ar/sitio/home?a=1015&z=1967225803"
AIC_RIVER = "https://www.aic.gob.ar/sitio/estaciones-detalle?a=37&z=1840266588"
OPEN_METEO_DOCS = "https://open-meteo.com/en/docs"
METNO_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact?" + urllib.parse.urlencode({"lat": round(LAT, 4), "lon": round(LON, 4), "altitude": 357})
OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast?" + urllib.parse.urlencode({
    "latitude": LAT, "longitude": LON, "current": "temperature_2m,weather_code",
    "hourly": "temperature_2m,precipitation_probability,weather_code",
    "daily": "temperature_2m_max,temperature_2m_min,weather_code",
    "timezone": "America/Argentina/Cordoba", "forecast_days": 3
})

def now():
    return datetime.now(timezone.utc).isoformat()

def get(url, timeout=20, max_bytes=5_000_000):
    user_agent = "OcarinaClimatica/1.0 (https://eliasmartinezcultural-glitch.github.io/OCARINA-CLIMATICA/)" if "api.met.no" in url else "OcarinaClimatica-SourceScout/1.0"
    req = urllib.request.Request(url, headers={"User-Agent": user_agent, "Accept": "application/geo+json, application/json, text/html, */*"})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        status = response.status
        content_type = response.headers.get("Content-Type", "")
        payload = response.read(max_bytes + 1)
        if len(payload) > max_bytes:
            raise RuntimeError("respuesta supera el límite de tamaño")
        return status, content_type, payload

def check(name, url, role, parser=None):
    started = time.time()
    item = {"id": name, "url": url, "role": role, "checkedAt": now()}
    try:
        if parser == "head":
            request = urllib.request.Request(url, headers={"User-Agent": "OcarinaClimatica-SourceScout/1.0"}, method="HEAD")
            with urllib.request.urlopen(request, timeout=15) as response:
                status = response.status
                content_type = response.headers.get("Content-Type", "")
                payload = b""
        else:
            status, content_type, payload = get(url)
        if status < 200 or status >= 300:
            raise RuntimeError("HTTP " + str(status))
        parsed = None
        if parser == "json":
            parsed = json.loads(payload.decode("utf-8"))
            if not isinstance(parsed, dict):
                raise RuntimeError("JSON no es un objeto")
        if parser == "open-meteo":
            parsed = json.loads(payload.decode("utf-8"))
            if not parsed.get("current") or not parsed.get("hourly") or not parsed.get("daily"):
                raise RuntimeError("respuesta meteorológica incompleta")
        item.update({"status": "online", "httpStatus": status, "contentType": content_type,
                     "bytes": len(payload), "latencyMs": round((time.time()-started)*1000),
                     "detail": "Respuesta recibida y validación básica aprobada"})
        if parsed is not None:
            item["validated"] = True
        return item
    except Exception as exc:
        item.update({"status": "error", "latencyMs": round((time.time()-started)*1000),
                     "detail": str(exc)[:300]})
        return item

def norm(s):
    s = str(s or "").lower()
    return s.replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u").replace("ñ","n").strip()

def haversine(lat1, lon1, lat2, lon2):
    r=6371
    p1,p2=math.radians(lat1),math.radians(lat2)
    dp=math.radians(lat2-lat1); dl=math.radians(lon2-lon1)
    a=math.sin(dp/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*r*math.asin(math.sqrt(min(1,a)))

def discover_stations():
    retrieved = now()
    try:
        status, ctype, payload = get(STATIONS_URL, timeout=25)
        body = json.loads(payload.decode("utf-8"))
        features = body.get("features", [])
        if not isinstance(features, list) or not features:
            raise RuntimeError("La colección oficial no devolvió features")
        found=[]
        for feature in features:
            props=feature.get("properties") or {}
            geom=feature.get("geometry") or {}
            coords=geom.get("coordinates") or []
            if len(coords)<2: continue
            lon,lat=coords[0],coords[1]
            try: lat,lon=float(lat),float(lon)
            except (TypeError,ValueError): continue
            name=props.get("name") or props.get("station_name") or props.get("name_en") or props.get("id") or "Estación SMN"
            dist=haversine(LAT,LON,lat,lon)
            found.append({
                "name": name, "latitude": lat, "longitude": lon,
                "distanceKm": round(dist,1),
                "wigosStationIdentifier": props.get("wigos_station_identifier") or props.get("wigos") or props.get("id"),
                "properties": {k:v for k,v in props.items() if k in ("name","name_en","id","wigos_station_identifier","country","valid_from","valid_to")},
                "sourceUrl": STATIONS_URL
            })
        found.sort(key=lambda x:x["distanceKm"])
        exact=[s for s in found if "san patricio del chanar" in norm(s["name"])]
        nearby=[s for s in found if s["distanceKm"] <= 180][:30]
        result={
            "schemaVersion":1,"status":"ready","source":"SMN OAPI Stations",
            "retrievedAt":retrieved,"target":"San Patricio del Chañar",
            "referencePoint":{"latitude":LAT,"longitude":LON,"status":"provisional"},
            "catalogCount":len(found),"exactLocalMatches":exact,"nearbyStations":nearby,
            "policy":"Las estaciones cercanas son referencias regionales y nunca se etiquetan como observación local del pueblo.",
            "sourceUrl":STATIONS_URL
        }
    except Exception as exc:
        result={"schemaVersion":1,"status":"error","source":"SMN OAPI Stations","retrievedAt":retrieved,
                "target":"San Patricio del Chañar","referencePoint":{"latitude":LAT,"longitude":LON,"status":"provisional"},
                "catalogCount":0,"exactLocalMatches":[],"nearbyStations":[],"error":str(exc)[:400],"sourceUrl":STATIONS_URL}
    (LIVE/"smn-nearby-stations.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    return result

def main():
    LIVE.mkdir(parents=True, exist_ok=True)
    sources=[
      ("open-meteo-forecast",OPEN_METEO_API,"Pronóstico modelado para el punto local","open-meteo"),
      ("smn-stations",STATIONS_URL,"Catálogo geográfico de estaciones SMN","json"),
      ("smn-synoptic-observations",SMN_SYNOPTIC,"Observaciones sinópticas SMN","json"),
      ("smn-automatic-observations",SMN_AUTOMATIC,"Observaciones de estaciones automáticas SMN","json"),
      ("smn-hourly-download",SMN_HOURLY,"Archivo de datos meteorológicos horarios SMN","head"),
      ("smn-present-download",SMN_PRESENT,"Archivo de estado del tiempo presente SMN","head"),
      ("aic-forecast",AIC_FORECAST,"Pronóstico regional AIC",None),
      ("aic-hydrology",AIC_RIVER,"Altura y caudal de la estación AIC Compensador El Chañar",None),
      ("open-meteo-documentation",OPEN_METEO_DOCS,"Documentación y límites de Open-Meteo",None),
      ("metno-locationforecast",METNO_URL,"Pronóstico independiente MET Norway para el punto local","json")
    ]
    checks=[check(*source) for source in sources]
    stations=discover_stations()
    result={
      "schemaVersion":1,"source":"Ocarina Climática · sondeador de fuentes","status":"ready" if any(x["status"]=="online" for x in checks) else "degraded",
      "target":"San Patricio del Chañar, Neuquén, Argentina",
      "retrievedAt":now(),"scoutedAt":now(),"scheduleMinutes":30,"scheduler":"GitHub Actions (puede sufrir demoras de cola)",
      "counts":{"checked":len(checks),"online":sum(x["status"]=="online" for x in checks),
                "errors":sum(x["status"]!="online" for x in checks)},
      "checks":checks,
      "manualReferences":[
        {"id":"smn-station-catalog-page","url":SMN_CATALOG,"status":"manual-reference","note":"El sondeador usa la colección OAPI de estaciones, que sí se consulta automáticamente; la página del catálogo devuelve HTTP 404 desde el runner."},
        {"id":"smn-active-alerts-page","url":SMN_ALERTS,"status":"manual-review-required","note":"Portal oficial del Sistema de Alerta Temprana. El runner de GitHub Actions no pudo resolver o consultar este host de forma estable; no se infiere que no haya alertas."}
      ],
      "stationDiscovery":{"status":stations["status"],"catalogCount":stations.get("catalogCount",0),
       "exactLocalMatches":len(stations.get("exactLocalMatches",[])),
       "nearbyStations":len(stations.get("nearbyStations",[]))},
      "interpretation":"La disponibilidad HTTP no demuestra por sí sola que un dato sea correcto ni que una estación represente al casco urbano. Se verifican por separado disponibilidad, identidad, vigencia y tipo de dato."
    }
    (LIVE/"source-health.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Sondeo de fuentes: %s online, %s con error; estaciones catalogadas: %s" %
          (result["counts"]["online"],result["counts"]["errors"],stations.get("catalogCount",0)))
    if result["counts"]["online"] == 0:
        raise SystemExit("Todas las fuentes están fuera de servicio")
if __name__=="__main__":
    main()
