import json, re
from datetime import datetime, timezone
from pathlib import Path
import requests
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
LIVE=ROOT/"data/live"
LIVE.mkdir(parents=True,exist_ok=True)
AIC_URL="https://www.aic.gob.ar/sitio/home?a=1015&z=1967225803"\nAIC_STATION_URL="https://www.aic.gob.ar/sitio/estaciones-detalle?a=37&z=1840266588"

def now():
    return datetime.now(timezone.utc).astimezone().isoformat()

def clean(text):
    return re.sub(r"\\s+"," ",text or "").strip()

def number(text):
    m=re.search(r"-?\\d+(?:[.,]\\d+)?",text or "")
    return float(m.group(0).replace(",",".")) if m else None

def aic():
    r=requests.get(AIC_URL,timeout=25,headers={"User-Agent":"Ocarina-Climatica/3.0"})
    r.raise_for_status()
    soup=BeautifulSoup(r.text,"html.parser")
    text=clean(soup.get_text(" ",strip=True))
    marker=re.search(r"El Chañar.*?(?=Prensa y Difusión)",text,re.I)
    block=marker.group(0) if marker else text
    days=re.findall(r"(martes|miércoles|jueves|viernes|sábado|domingo|lunes)\\s+(\\d{1,2})",block,re.I)
    temps=re.findall(r"Temperatura\\s+(-?\\d+)\\s+ºC\\s+(-?\\d+)\\s+ºC",block,re.I)
    winds=re.findall(r"Viento\\s+(\\d+)\\s+km/h\\s+(\\d+)\\s+km/h",block,re.I)
    gusts=re.findall(r"Ráfagas\\s+(\\d+)\\s+km/h\\s+(\\d+)\\s+km/h",block,re.I)
    dirs=re.findall(r"Dirección\\s+([A-ZÁÉÍÓÚÑ]+)\\s+([A-ZÁÉÍÓÚÑ]+)",block,re.I)
    press=re.findall(r"Presión\\s+(\\d+)\\s+hPa\\s+(\\d+)\\s+hPa",block,re.I)
    states=re.findall(r"Estado\\s+(.+?)\\s+Temperatura",block,re.I)
    forecast=[]
    for i,(day,num) in enumerate(days[:3]):
        t=temps[i] if i<len(temps) else ()
        w=winds[i] if i<len(winds) else ()
        g=gusts[i] if i<len(gusts) else ()
        d=dirs[i] if i<len(dirs) else ()
        p=press[i] if i<len(press) else ()
        forecast.append({"day":f"{day} {num}","periods":[
          {"label":"día","temperature":int(t[0]) if t else None,"wind":int(w[0]) if w else None,"gust":int(g[0]) if g else None,"direction":d[0] if d else None,"pressure":int(p[0]) if p else None,"sky":clean(states[i]) if i<len(states) else None},
          {"label":"noche","temperature":int(t[1]) if len(t)>1 else None,"wind":int(w[1]) if len(w)>1 else None,"gust":int(g[1]) if len(g)>1 else None,"direction":d[1] if len(d)>1 else None,"pressure":int(p[1]) if len(p)>1 else None,"sky":clean(states[i]) if i<len(states) else None}
        ]})
    return {"status":"ready","provider":"AIC","dataset":"Pronóstico para El Chañar","retrievedAt":now(),"sourceUrl":AIC_URL,"place":"El Chañar","forecast":forecast,"note":"Pronóstico oficial AIC. No es observación medida."}


SMN_HOURLY_URL="https://ssl.smn.gob.ar/dpd/zipopendata.php?dato=datohorario"
SMN_EXTREMES_URL="https://ssl.smn.gob.ar/dpd/zipopendata.php?dato=observaciones"

def norm_key(k):
    return re.sub(r"[^a-z0-9]","",str(k or "").lower())

def find_value(row,names):
    mapped={norm_key(k):v for k,v in row.items()}
    for name in names:
        if norm_key(name) in mapped:return mapped[norm_key(name)]
    for k,v in mapped.items():
        if any(norm_key(name) in k for name in names):return v
    return None

def read_smn_zip(url):
    import io, zipfile, csv
    r=requests.get(url,timeout=60,headers={"User-Agent":"Ocarina-Climatica/3.0"})
    r.raise_for_status()
    z=zipfile.ZipFile(io.BytesIO(r.content))
    rows=[]
    for member in z.namelist():
        if member.endswith("/") or not re.search(r"\\.(csv|txt|dat)$",member,re.I):continue
        raw=z.read(member)
        text=raw.decode("utf-8-sig",errors="replace")
        try: sample=text[:5000]; dialect=csv.Sniffer().sniff(sample,delimiters=";,\\t|")
        except Exception: dialect=csv.excel; dialect.delimiter=","
        try:
            for row in csv.DictReader(io.StringIO(text),dialect=dialect):
                joined=" ".join(str(v or "") for v in row.values())
                if re.search(r"san patricio del chañ?ar|el chañ?ar|chanar",joined,re.I):
                    row["_member"]=member; rows.append(row)
        except Exception: continue
    return rows

def historical_365():
    try:
        rows=read_smn_zip(SMN_EXTREMES_URL)
        if not rows:
            return {"status":"pending-local-station-verification","target":"San Patricio del Chañar","coverage":{"days":365,"records":0},"variables":["temperatureMin","temperatureMax"],"source":"SMN","message":"El dataset SMN fue consultado, pero no apareció una fila cuya identidad pudiera verificarse como San Patricio del Chañar/El Chañar."}
        records=[]
        for row in rows:
            date=find_value(row,["fecha","date"])
            tmax=find_value(row,["tmax","temperaturamaxima","maxima"])
            tmin=find_value(row,["tmin","temperaturaminima","minima"])
            station=find_value(row,["estacion","station","nombreestacion"])
            if not date or station is None: continue
            records.append({"observedAt":str(date),"stationName":str(station),"temperatureMax":number(str(tmax)),"temperatureMin":number(str(tmin)),"sourceId":"smn-extremes","quality":"observed"})
        records=records[-365:]
        if not records:return {"status":"pending-local-station-verification","target":"San Patricio del Chañar","coverage":{"days":365,"records":0},"source":"SMN"}
        return {"status":"ready","target":"San Patricio del Chañar","source":"SMN","stationName":records[-1]["stationName"],"retrievedAt":now(),"coverage":{"days":365,"records":len(records),"start":records[0]["observedAt"],"end":records[-1]["observedAt"]},"records":records}
    except Exception as exc:
        return {"status":"error","target":"San Patricio del Chañar","source":"SMN","retrievedAt":now(),"error":str(exc)}

def aic_station():\n    r=requests.get(AIC_STATION_URL,timeout=25,headers={"User-Agent":"Ocarina-Climatica/3.0"})\n    r.raise_for_status()\n    text=clean(BeautifulSoup(r.text,"html.parser").get_text(" ",strip=True))\n    level=re.search(r"Altura Río/Lago\\s+([0-9]+(?:[.,][0-9]+)?)\\s*m",text,re.I)\n    flow=re.search(r"Caudal Medio Diario\\s+([0-9]+(?:[.,][0-9]+)?)\\s*m3/s",text,re.I)\n    return {"status":"ready","provider":"AIC","dataset":"Estación Compensador El Chañar","station":"Compensador El Chañar","retrievedAt":now(),"sourceUrl":AIC_STATION_URL,"observations":{"dailyMeanFlow":number(flow.group(1)) if flow else None,"riverLevel":number(level.group(1)) if level else None},"note":"Datos hidrológicos publicados por AIC."}\n\ndef write(name,data):
    (LIVE/name).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")

try:
    write("aic-forecast.json",aic())\n    write("aic-el-chanar.json",aic_station())\n    write("historical-365.json",historical_365())
except Exception as exc:
    write("aic-forecast-error.json",{"status":"error","provider":"AIC","retrievedAt":now(),"error":str(exc)})
    raise
