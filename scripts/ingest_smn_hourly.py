import csv,io,json,re,urllib.request,zipfile
from datetime import datetime,timezone,timedelta
from pathlib import Path

URL="https://ssl.smn.gob.ar/dpd/zipopendata.php?dato=datohorario"
TARGET="san patricio del chanar"
OUT=Path("data/live/smn-hourly.json")
ARG_TZ=timezone(timedelta(hours=-3))

def norm(v):
    v=(v or "").strip().lower()
    for a,b in (("á","a"),("é","e"),("í","i"),("ó","o"),("ú","u"),("ñ","n")): v=v.replace(a,b)
    return re.sub(r"\s+"," ",v)

def header(v): return norm(v).replace("_","")

def num(v):
    try:return float(str(v).strip().replace(",",".")) if v not in (None,"") else None
    except:return None

def iso(fecha,hora):
    raw=((fecha or "")+" "+(hora or "")).strip()
    for fmt in ("%d/%m/%Y %H:%M","%d/%m/%Y %H:%M:%S","%Y-%m-%d %H:%M","%Y-%m-%d %H:%M:%S"):
        try:return datetime.strptime(raw,fmt).replace(tzinfo=ARG_TZ).isoformat()
        except:pass
    return None

def main():
    req=urllib.request.Request(URL,headers={"User-Agent":"OCARINA-CLIMATICA/1.0"})
    with urllib.request.urlopen(req,timeout=30) as r: payload=r.read()
    with zipfile.ZipFile(io.BytesIO(payload)) as z:
        txt=next((n for n in z.namelist() if n.lower().endswith(".txt")),None)
        if not txt: raise RuntimeError("El ZIP horario no contiene TXT.")
        raw=z.read(txt).decode("latin-1",errors="replace")
    rows=list(csv.reader(io.StringIO(raw),delimiter=";"))
    hi=next((i for i,row in enumerate(rows[:10]) if any(header(x)=="estacion" for x in row)),None)
    if hi is None: raise RuntimeError("No se encontró cabecera de estación.")
    hs=[header(x) for x in rows[hi]]
    records=[]
    for row in rows[hi+1:]:
        if not row: continue
        r=dict(zip(hs,row))
        if norm(r.get("estacion"))!=TARGET: continue
        observed=iso(r.get("fecha"),r.get("hora"))
        if not observed: continue
        records.append({
          "stationName":r.get("estacion"),
          "stationId":None,
          "observedAt":observed,
          "sourceId":"smn-hourly",
          "values":{
            "temperature":num(r.get("temperatura")),
            "pressure":num(r.get("presion")),
            "humidity":num(r.get("humedadrelativa")),
            "windSpeed":num(r.get("vientointensidad")),
            "windDirection":r.get("vientodireccion") or None
          },
          "quality":{"temperature":"observed","pressure":"observed","humidity":"observed","windSpeed":"observed","windDirection":"observed"}
        })
    records.sort(key=lambda x:x["observedAt"])
    # Mantener una ventana razonable para el reporte y no convertir el repositorio en un depósito infinito.
    records=records[-24*14:]
    result={
      "status":"ready" if records else "unavailable",
      "source":"SMN","dataset":"Datos meteorológicos horarios",
      "target":"San Patricio del Chañar",
      "retrievedAt":datetime.now(timezone.utc).isoformat(),
      "records":records,
      "notes":"Solo se aceptan filas cuyo nombre de estación coincide exactamente con San Patricio del Chañar. No se sustituye una estación cercana."
    }
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__":main()
