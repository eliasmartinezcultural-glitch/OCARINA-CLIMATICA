#!/usr/bin/env python3
"""Extrae observaciones SMN recientes en el entorno regional; nunca las presenta como medición del casco urbano."""
import json, math, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
LIVE=ROOT/"data/live"
LAT,LON=-38.625,-68.300
COLLECTIONS=[
 "https://w2b.smn.gov.ar/oapi/collections/urn%3Awmo%3Amd%3Aar-smn%3Aautosmn/items",
 "https://w2b.smn.gov.ar/oapi/collections/urn%3Awmo%3Amd%3Aar-smn%3Aslt0ci/items"
]
def now(): return datetime.now(timezone.utc)
def parse_time(s):
    if not s:return None
    try:return datetime.fromisoformat(str(s).replace("Z","+00:00")).astimezone(timezone.utc)
    except Exception:return None
def distance(lat1,lon1,lat2,lon2):
    r=6371;p1,p2=math.radians(lat1),math.radians(lat2);dp=math.radians(lat2-lat1);dl=math.radians(lon2-lon1)
    a=math.sin(dp/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*r*math.asin(math.sqrt(min(1,a)))
def fetch(url):
    req=urllib.request.Request(url,headers={"User-Agent":"OcarinaClimatica-SMNObservations/1.0","Accept":"application/geo+json, application/json"})
    with urllib.request.urlopen(req,timeout=25) as r:
        if r.status!=200:raise RuntimeError("HTTP "+str(r.status))
        return json.loads(r.read().decode("utf-8"))
def main():
    LIVE.mkdir(parents=True,exist_ok=True)
    end=now();start=end-timedelta(hours=36)
    bbox="-69.5,-40,-67.0,-37.0"
    params=urllib.parse.urlencode({"f":"json","limit":1000,"bbox":bbox,"datetime":start.isoformat().replace("+00:00","Z")+"/"+end.isoformat().replace("+00:00","Z")})
    collected=[]; errors=[]
    for base in COLLECTIONS:
        try:
            payload=fetch(base+"?"+params)
            collected.extend(payload.get("features",[]))
        except Exception as exc: errors.append(str(exc)[:240])
    groups={}
    for feature in collected:
        p=feature.get("properties") or {};g=feature.get("geometry") or {};coords=g.get("coordinates") or []
        if len(coords)<2:continue
        try:lon,lat=float(coords[0]),float(coords[1])
        except (ValueError,TypeError):continue
        dist=distance(LAT,LON,lat,lon)
        if dist>180:continue
        station_id=p.get("wigos_station_identifier") or p.get("station_id") or "unknown"
        report=p.get("reportId") or p.get("reportTime") or p.get("phenomenonTime") or "unknown"
        report_time=p.get("reportTime") or p.get("phenomenonTime")
        variable=str(p.get("name") or p.get("id") or "unknown").lower()
        try:value=float(p["value"]) if p.get("value") is not None else None
        except (TypeError,ValueError):value=None
        key=(station_id,report)
        item=groups.setdefault(key,{"stationId":station_id,"reportId":report,"observedAt":report_time,
          "distanceKm":round(dist,1),"latitude":lat,"longitude":lon,"variables":{},"sourceCollections":[]})
        if value is not None:
            item["variables"][variable]={"value":value,"units":p.get("units"),"phenomenonTime":p.get("phenomenonTime"),"description":p.get("description")}
        if base not in item["sourceCollections"]:item["sourceCollections"].append(base)
        if parse_time(report_time) and (not parse_time(item.get("observedAt")) or parse_time(report_time)>parse_time(item.get("observedAt"))):item["observedAt"]=report_time
    records=list(groups.values())
    station_names={}
    station_file=LIVE/"smn-nearby-stations.json"
    if station_file.exists():
        try:
            station_data=json.loads(station_file.read_text(encoding="utf-8"))
            for station in station_data.get("nearbyStations",[]):
                for identity in (station.get("wigosStationIdentifier"),station.get("properties",{}).get("id")):
                    if identity: station_names[str(identity)]=station.get("name")
        except Exception: pass
    for record in records:
        record["stationName"]=station_names.get(str(record.get("stationId"))) or ("Estación SMN "+str(record.get("stationId")))
    records.sort(key=lambda x:(x["distanceKm"],-(parse_time(x.get("observedAt")).timestamp() if parse_time(x.get("observedAt")) else 0)))
    def temperature(record):
        for key,val in record["variables"].items():
            if any(t in key for t in ("air_temperature","temperature","temperatura")) and val.get("value") is not None:return val["value"]
        return None
    usable=[r for r in records if temperature(r) is not None]
    usable.sort(key=lambda r: (r["distanceKm"], -(parse_time(r.get("observedAt")).timestamp() if parse_time(r.get("observedAt")) else 0)))
    best=usable[0] if usable else (records[0] if records else None)
    observed=parse_time(best.get("observedAt")) if best else None
    age_minutes=round((end-observed).total_seconds()/60) if observed else None
    status="ready" if best and age_minutes is not None and age_minutes<=360 else ("stale" if best else ("error" if errors and not collected else "unavailable"))
    result={"schemaVersion":1,"source":"SMN OAPI","sourceUrl":"https://w2b.smn.gov.ar/oapi/collections",
      "dataset":"Observaciones sinópticas y automáticas de superficie","target":"Entorno regional de San Patricio del Chañar",
      "retrievedAt":end.isoformat(),"status":status,"measurementType":"station-observation",
      "referencePoint":{"latitude":LAT,"longitude":LON,"status":"provisional"},
      "selected":best,"temperature":temperature(best) if best else None,"ageMinutes":age_minutes,
      "nearbyReports":records[:30],"queryWindowHours":36,"errorDetails":errors,
      "note":"La estación seleccionada puede estar a kilómetros de San Patricio del Chañar. Nunca equivale a una medición dentro del pueblo; se publican distancia, estación y hora para contextualizarla."}
    (LIVE/"smn-nearby-observations.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("SMN observaciones regionales:",status,"· reportes:",len(records),"· edad (min):",age_minutes)
if __name__=="__main__":main()
