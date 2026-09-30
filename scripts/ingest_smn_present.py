import csv, io, json, re, urllib.request, zipfile
from datetime import datetime, timezone, timedelta
from pathlib import Path
URL="https://ssl.smn.gob.ar/dpd/zipopendata.php?dato=tiepre"
TARGET="san patricio del chanar"
OUT=Path("data/live/smn-present.json")
ARG_TZ=timezone(timedelta(hours=-3))
def norm(value):
    value=(value or "").strip().lower(); value=value.replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u").replace("ñ","n"); return re.sub(r"\\s+"," ",value)
def clean_header(value): return norm(value).replace("_","")
def iso_datetime(fecha,hora):
    raw=((fecha or "")+" "+(hora or "")).strip()
    for fmt in ("%d/%m/%Y %H:%M","%d/%m/%Y %H:%M:%S","%Y-%m-%d %H:%M","%Y-%m-%d %H:%M:%S"):
        try: return datetime.strptime(raw,fmt).replace(tzinfo=ARG_TZ).isoformat()
        except ValueError: pass
    return None
def number(value):
    try: return float(str(value).strip().replace(",",".")) if value not in (None,"") else None
    except ValueError: return None
def pick(row,*names):
    for name in names:
        if clean_header(name) in row: return row[clean_header(name)]
    return None
def main():
    req=urllib.request.Request(URL,headers={"User-Agent":"OCARINA-CLIMATICA/0.2.3"})
    with urllib.request.urlopen(req,timeout=30) as response: payload=response.read()
    with zipfile.ZipFile(io.BytesIO(payload)) as z:
        txt=next((n for n in z.namelist() if n.lower().endswith(".txt")),None)
        if not txt: raise RuntimeError("El ZIP SMN no contiene un TXT reconocible.")
        raw=z.read(txt).decode("latin-1",errors="replace")
    rows=list(csv.reader(io.StringIO(raw),delimiter=";"))
    if not rows: raise RuntimeError("El recurso SMN llegó vacío.")
    hi=next((i for i,row in enumerate(rows[:10]) if any(clean_header(v)=="estacion" for v in row)),None)
    if hi is None: raise RuntimeError("No se encontró una cabecera reconocible en el recurso SMN.")
    headers=[clean_header(v) for v in rows[hi]]; records=[dict(zip(headers,row)) for row in rows[hi+1:] if row]
    match=next((r for r in records if norm(pick(r,"estacion"))==TARGET),None)
    result={"status":"unavailable","source":"SMN","dataset":"Estado del Tiempo presente","target":"San Patricio del Chañar","retrievedAt":datetime.now(timezone.utc).isoformat(),"station":None,"stationIdentity":{},"observedAt":None,"observations":{},"notes":"No se encontró una fila con localidad exacta. No se sustituye por otra estación."}
    if match:
        result.update({"status":"candidate","station":pick(match,"estacion"),"stationIdentity":{"name":pick(match,"estacion"),"id":None,"latitude":None,"longitude":None,"altitude":None,"province":None,"oaci":None},"observedAt":iso_datetime(pick(match,"fecha"),pick(match,"hora")),"observations":{"temperature":number(pick(match,"temperatura")),"sky":pick(match,"estado_nuboso"),"visibility":number(pick(match,"visibilidad")),"apparentTemperature":number(pick(match,"sensasion_termica","sensacion_termica")),"humidity":number(pick(match,"humedad_relativa")),"windSpeed":number(pick(match,"viento_intensidad")),"windDirection":pick(match,"viento_direccion"),"pressure":number(pick(match,"presion_superficie")),"gust":None,"precipitation":None},"notes":"Registro extraído del recurso SMN; identidad geográfica de la estación separada y pendiente de verificación contra el catálogo oficial de estaciones."})
    OUT.parent.mkdir(parents=True,exist_ok=True); OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
if __name__=="__main__": main()
