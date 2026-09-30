import json,re,urllib.request
from datetime import datetime,timezone
from html import unescape
from pathlib import Path

URL="https://www.aic.gob.ar/sitio/estaciones-detalle?a=37&z=1840266588"
OUT=Path("data/live/aic-el-chanar.json")

def text(url):
    req=urllib.request.Request(url,headers={"User-Agent":"OCARINA-CLIMATICA/AIC-ingestor"})
    with urllib.request.urlopen(req,timeout=30) as r:
        return r.read().decode("utf-8","replace")

def clean(s):
    return re.sub(r"\s+"," ",unescape(re.sub("<[^>]+>"," ",s))).strip()

def find(pattern,html):
    m=re.search(pattern,html,re.I|re.S)
    return clean(m.group(1)) if m else None

def main():
    html=text(URL)
    height=find(r"Altura Río/Lago\s*</[^>]+>\s*([^<]+)",html)
    flow=find(r"Caudal Medio Diario\s*</[^>]+>\s*([^<]+)",html)
    updated=find(r"última actualización:\s*([^)<]+)",html)
    result={
      "status":"ready" if (height or flow) else "unavailable",
      "source":"AIC","dataset":"Estaciones · Compensador El Chañar",
      "target":"San Patricio del Chañar","retrievedAt":datetime.now(timezone.utc).isoformat(),
      "station":{"name":"COMPENSADOR EL CHANAR","latitude":-38.599587,"longitude":-68.389558},
      "observations":{"riverLevel":height,"dailyMeanFlow":flow},
      "updatedAt":updated,
      "quality":{"riverLevel":"observed","dailyMeanFlow":"observed"},
      "notes":"Capa hidrológica independiente de la meteorología. No debe presentarse como temperatura, lluvia o viento."
    }
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if __name__=="__main__": main()
