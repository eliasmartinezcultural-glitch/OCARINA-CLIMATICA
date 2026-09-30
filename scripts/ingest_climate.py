import json, re
from datetime import datetime, timezone
from pathlib import Path
import requests
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
LIVE=ROOT/"data/live"
LIVE.mkdir(parents=True,exist_ok=True)
AIC_URL="https://www.aic.gob.ar/sitio/home?a=1015&z=1967225803"

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

def write(name,data):
    (LIVE/name).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")

try:
    write("aic-forecast.json",aic())
except Exception as exc:
    write("aic-forecast-error.json",{"status":"error","provider":"AIC","retrievedAt":now(),"error":str(exc)})
    raise
