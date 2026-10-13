#!/usr/bin/env python3
"""Normaliza identidad de estación SMN sin confundir cercanía con localidad exacta."""
import json
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
LIVE=ROOT/"data/live"
SOURCE=LIVE/"smn-nearby-stations.json"
OUT=LIVE/"smn-station.json"

def main():
    retrieved=datetime.now(timezone.utc).isoformat()
    if not SOURCE.exists():
        raise RuntimeError("Falta data/live/smn-nearby-stations.json; ejecutar primero sondear_fuentes.py")
    catalog=json.loads(SOURCE.read_text(encoding="utf-8"))
    exact=catalog.get("exactLocalMatches",[]) if catalog.get("status")=="ready" else []
    nearby=catalog.get("nearbyStations",[]) if catalog.get("status")=="ready" else []
    verified=(len(exact)==1 and bool(exact[0].get("latitude") is not None) and bool(exact[0].get("longitude") is not None))
    result={
      "schemaVersion":1,"status":"verified" if verified else ("ambiguous" if len(exact)>1 else ("error" if catalog.get("status")=="error" else "not-found")),
      "source":"SMN","dataset":"Catálogo oficial OAPI de estaciones",
      "target":"San Patricio del Chañar","retrievedAt":retrieved,
      "station":exact[0] if verified else None,
      "exactMatches":exact,"nearbyStations":nearby,
      "sourceUrl":catalog.get("sourceUrl"),
      "policy":"Solo una coincidencia oficial exacta permite identificar estación local. Las estaciones cercanas se publican como referencias regionales, nunca como medición local."
    }
    OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Estación local SMN:",result["status"],"· coincidencias exactas:",len(exact),"· referencias cercanas:",len(nearby))
if __name__=="__main__": main()
