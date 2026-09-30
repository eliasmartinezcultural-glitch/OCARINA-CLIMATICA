import json
from datetime import datetime, timezone
from pathlib import Path

LIVE=Path("data/live/smn-hourly.json")
ARCHIVE=Path("data/archive/smn-hourly")
ARG_TZ=timezone.utc

def main():
    if not LIVE.exists(): raise SystemExit("No existe la serie viva.")
    data=json.loads(LIVE.read_text(encoding="utf-8"))
    records=data.get("records",[])
    if not records: raise SystemExit("Sin registros nuevos; no se genera archivo.")
    grouped={}
    for r in records:
        try: key=datetime.fromisoformat(r["observedAt"]).strftime("%Y-%m")
        except Exception: continue
        grouped.setdefault(key,[]).append(r)
    ARCHIVE.mkdir(parents=True,exist_ok=True)
    for key,new_records in grouped.items():
        path=ARCHIVE/f"{key}.json"
        old={"source":"SMN","dataset":"Datos meteorológicos horarios","target":"San Patricio del Chañar","period":key,"records":[]}
        if path.exists():
            try: old=json.loads(path.read_text(encoding="utf-8"))
            except Exception: pass
        merged={r.get("observedAt"):r for r in old.get("records",[]) if r.get("observedAt")}
        for r in new_records: merged[r.get("observedAt")]=r
        ordered=[merged[k] for k in sorted(merged)]
        out={**old,"source":"SMN","dataset":"Datos meteorológicos horarios","target":"San Patricio del Chañar","period":key,"updatedAt":datetime.now(timezone.utc).isoformat(),"records":ordered,"notes":"Archivo acumulativo generado desde observaciones horarias ingeridas. Solo se incorporan registros de la localidad objetivo; no se rellena por proximidad."}
        path.write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__": main()
