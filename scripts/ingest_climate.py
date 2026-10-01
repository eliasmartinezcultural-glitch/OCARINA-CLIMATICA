import json, re
from datetime import datetime, timezone
from pathlib import Path
import requests
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
LIVE=ROOT/"data/live"
LIVE.mkdir(parents=True,exist_ok=True)
AIC_URL="https://www.aic.gob.ar/sitio/home?a=1015&z=1967225803"
AIC_STATION_URL="https://www.aic.gob.ar/sitio/estaciones-detalle?a=37&z=1840266588"

def now():
    return datetime.now(timezone.utc).astimezone().isoformat()

def clean(text):
    return re.sub(r"\\s+"," ",text or "").strip()

def number(text):
    m=re.search(r"-?\\d+(?:[.,]\\d+)?",text or "")
    return float(m.group(0).replace(",",".")) if m else None

def aic():
    """Parsea la tabla visible de AIC por estructura, no por posición frágil de texto."""
    r=requests.get(AIC_URL,timeout=25,headers={"User-Agent":"Ocarina-Climatica/3.24"})
    r.raise_for_status()
    soup=BeautifulSoup(r.text,"html.parser")
    tables=soup.find_all("table")
    target=None
    for table in tables:
        txt=clean(table.get_text(" ",strip=True))
        if "Temperatura" in txt and "Viento" in txt and "El Chañar" in txt:
            target=table
            break
    if target is None:
        return {"status":"unavailable","provider":"AIC","dataset":"Pronóstico para El Chañar",
                "retrievedAt":now(),"sourceUrl":AIC_URL,"place":"El Chañar","forecast":[],
                "note":"AIC no expuso una tabla de pronóstico reconocible."}
    rows=[]
    for tr in target.find_all("tr"):
        cells=[clean(x.get_text(" ",strip=True)) for x in tr.find_all(["th","td"])]
        if cells: rows.append(cells)
    headers=rows[0][1:] if rows else []
    days=[]
    for h in headers:
        if h and h not in days: days.append(h)
    values={}
    for row in rows:
        if not row: continue
        key=row[0].strip().lower()
        values[key]=row[1:]
    def nums(key):
        return [number(x) for x in values.get(key,[])]
    def texts(key):
        return values.get(key,[])
    temps=nums("temperatura"); winds=nums("viento"); gusts=nums("ráfagas"); press=nums("presión")
    dirs=texts("dirección"); skies=texts("estado")
    # AIC exposes paired Día/Noche columns; group them by date header.
    forecast=[]
    for i,day in enumerate(days):
        base=i*2
        periods=[]
        for offset,label in ((0,"día"),(1,"noche")):
            idx=base+offset
            if idx>=len(headers): continue
            periods.append({
                "label":label,
                "temperature":int(temps[idx]) if idx<len(temps) and temps[idx] is not None else None,
                "wind":int(winds[idx]) if idx<len(winds) and winds[idx] is not None else None,
                "gust":int(gusts[idx]) if idx<len(gusts) and gusts[idx] is not None else None,
                "direction":dirs[idx] if idx<len(dirs) else None,
                "pressure":int(press[idx]) if idx<len(press) and press[idx] is not None else None,
                "sky":skies[idx] if idx<len(skies) else None
            })
        if periods: forecast.append({"day":day,"periods":periods})
    return {"status":"ready" if forecast else "unavailable","provider":"AIC",
            "dataset":"Pronóstico para El Chañar","retrievedAt":now(),"sourceUrl":AIC_URL,
            "place":"El Chañar","forecast":forecast,
            "note":"Pronóstico oficial AIC. No es observación medida."}


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


def historical_hourly():
    try:
        rows=read_smn_zip(SMN_HOURLY_URL)
        if not rows:return {"status":"pending-local-station-verification","target":"San Patricio del Chañar","source":"SMN","records":[]}
        hourly=[]
        for row in rows:
            station=find_value(row,["estacion","station","nombreestacion"])
            date=find_value(row,["fecha","date"])
            hour=find_value(row,["hora","hour"])
            if not station or not date:continue
            hourly.append({
              "observedAt":str(date)+" "+str(hour or ""),
              "stationName":str(station),
              "temperature":number(str(find_value(row,["temperatura","temp"]))) if find_value(row,["temperatura","temp"]) is not None else None,
              "pressure":number(str(find_value(row,["presion","pressure"]))) if find_value(row,["presion","pressure"]) is not None else None,
              "humidity":number(str(find_value(row,["humedad","humidity"]))) if find_value(row,["humedad","humidity"]) is not None else None,
              "windSpeed":number(str(find_value(row,["velocidadviento","viento","windspeed"]))) if find_value(row,["velocidadviento","viento","windspeed"]) is not None else None,
              "windDirection":number(str(find_value(row,["direccionviento","direccion","winddirection"]))) if find_value(row,["direccionviento","direccion","winddirection"]) is not None else None,
              "precipitation":number(str(find_value(row,["precipitacion","precip","lluvia"]))) if find_value(row,["precipitacion","precip","lluvia"]) is not None else None,
              "sourceId":"smn-hourly","quality":"observed"
            })
        hourly=hourly[-24*365:]
        return {"status":"ready" if hourly else "pending-local-station-verification","target":"San Patricio del Chañar","source":"SMN","retrievedAt":now(),"stationName":hourly[-1]["stationName"] if hourly else None,"coverage":{"records":len(hourly)},"records":hourly}
    except Exception as exc:
        return {"status":"error","target":"San Patricio del Chañar","source":"SMN","retrievedAt":now(),"error":str(exc),"records":[]}

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

def aic_station():
    r=requests.get(AIC_STATION_URL,timeout=25,headers={"User-Agent":"Ocarina-Climatica/3.0"})
    r.raise_for_status()
    text=clean(BeautifulSoup(r.text,"html.parser").get_text(" ",strip=True))
    level=re.search(r"Altura Río/Lago\\s+([0-9]+(?:[.,][0-9]+)?)\\s*m",text,re.I)
    flow=re.search(r"Caudal Medio Diario\\s+([0-9]+(?:[.,][0-9]+)?)\\s*m3/s",text,re.I)
    return {"status":"ready","provider":"AIC","dataset":"Estación Compensador El Chañar","station":"Compensador El Chañar","retrievedAt":now(),"sourceUrl":AIC_STATION_URL,"observations":{"dailyMeanFlow":number(flow.group(1)) if flow else None,"riverLevel":number(level.group(1)) if level else None},"note":"Datos hidrológicos publicados por AIC."}

def write(name,data):
    (LIVE/name).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")

try:
    write("aic-forecast.json",aic())
    write("aic-el-chanar.json",aic_station())
    write("historical-365.json",historical_365())
    write("historical-hourly.json",historical_hourly())
except Exception as exc:
    write("aic-forecast-error.json",{"status":"error","provider":"AIC","retrievedAt":now(),"error":str(exc)})
    raise
