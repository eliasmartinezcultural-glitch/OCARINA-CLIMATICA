window.CLIMATE_HISTORICAL_DASHBOARD={
 target:"San Patricio del Chañar",
 recentWindowDays:365,
 requiredVariables:["temperatureMin","temperatureMax","precipitation","windSpeed","windGust","humidity","pressure"],
 sourcePolicy:"exact-station-first",
 sourceCatalog:[
  {id:"smn-temp365",role:"temperatura 365 días",url:"https://datos.gob.ar/dataset/smn-registro-temperatura-365-dias"},
  {id:"smn-extremes",role:"extremos diarios",url:"https://datos.gob.ar/dataset/smn-observaciones-diarias-temperaturas-extremas"},
  {id:"smn-hourly",role:"serie horaria",url:"https://datos.gob.ar/dataset/smn-datos-meteorologicos-horarios"},
  {id:"aic-el-chanar",role:"hidrología local",url:"https://www.aic.gob.ar/sitio/estaciones-detalle?a=37&z=1840266588"},
  {id:"inta-hail",role:"episodios de granizo",url:"https://repositorio.inta.gob.ar/bitstream/handle/20.500.12123/14080/INTA_CRPatagoniaNorte_EEAAltoValle_Villarreal_PL_Malla_para_proteger_frutales_granizo.pdf?isAllowed=y&sequence=1"}
 ],
 rule:"No se calcula anomalía ni récord local si no existe una serie comparable y una referencia climática explícita."
};