import csv,io,json,re,urllib.request,zipfile
from datetime import datetime,timezone
from pathlib import Path

PACKAGE_URL="https://datos.gob.ar/api/3/action/package_show?id=smn-listado-estaciones-meteorologicas-smn"
TARGET="san patricio del chanar"
OUT=Path("data/live/smn-station.json")

def norm(v):
    v=(v or "").strip().lower()
    for a,b in (("á","a"),("é","e"),("í","i"),("ó","o"),("ú","u"),("ñ","n")): v=v.replace(a,b)
    return re.sub(r"\s+"," ",v)

def header(v): return norm(v).replace("_","")

def num(v):
    try: return float(str(v).strip().replace(",","."))
    except: return None

def download(url):
    req=urllib.request.Request(url,headers={"User-Agent":"OCARINA-CLIMATICA/station-verifier"})
    with urllib.request.urlopen(req,timeout=45) as r: return r.read()

def main():
    package=json.loads(download(PACKAGE_URL).decode("utf-8"))
    resources=package["result"]["resources"]
    resource=next((r for r in resources if str(r.get("format","")).lower()=="zip"),None)
    if not resource: raise RuntimeError("El dataset oficial no expone un recurso ZIP reconocible.")
    payload=download(resource["url"])
    with zipfile.ZipFile(io.BytesIO(payload)) as z:
        name=next((n for n in z.namelist() if n.lower().endswith((".txt",".csv"))),None)
        if not name: raise RuntimeError("El catálogo SMN no contiene TXT/CSV reconocible.")
        raw=z.read(name).decode("latin-1",errors="replace")
    rows=list(csv.reader(io.StringIO(raw),delimiter=";"))
    hi=next((i for i,row in enumerate(rows[:15]) if any(header(x)=="estacion" for x in row)),None)
    if hi is None: raise RuntimeError("No se encontró la columna estacion en el catálogo SMN.")
    hs=[header(x) for x in rows[hi]]
    candidates=[]
    for row in rows[hi+1:]:
        if not row: continue
        r=dict(zip(hs,row))
        if norm(r.get("estacion"))==TARGET:
            candidates.append({
                "name":r.get("estacion"),"province":r.get("provincia"),
                "latitude":num(r.get("latitud")),"longitude":num(r.get("longitud")),
                "altitude":num(r.get("altura")),"stationNumber":r.get("nroestacion"),
                "oaci":r.get("nrooaci")
            })
    result={
      "status":"verified" if len(candidates)==1 else ("ambiguous" if candidates else "not-found"),
      "source":"SMN","dataset":"Listado de Estaciones Meteorológicas del SMN",
      "target":"San Patricio del Chañar","retrievedAt":datetime.now(timezone.utc).isoformat(),
      "station":candidates[0] if len(candidates)==1 else None,
      "matches":candidates,
      "resourceUrl":resource.get("url"),
      "notes":"La identidad se considera verificada solo con una coincidencia exacta y única en el catálogo oficial."
    }
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__": main()
