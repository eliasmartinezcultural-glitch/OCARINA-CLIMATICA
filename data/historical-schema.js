// Contrato V0.3+ para series históricas y reportes.
window.CLIMATE_HISTORICAL_SCHEMA={
  recordRequired:["stationId","stationName","observedAt","sourceId","values"],
  valueFields:{
    temperature:{unit:"°C",kind:"measured"},
    pressure:{unit:"hPa",kind:"measured"},
    humidity:{unit:"%",kind:"measured"},
    windSpeed:{unit:"km/h",kind:"measured"},
    windDirection:{unit:"°",kind:"measured"}
  },
  provenance:["provider","dataset","retrievedAt","coverage"],
  coverageStates:["complete","partial","unknown"],
  qualityStates:["observed","missing","estimated","derived","invalid"],
  localityRule:"stationName must match San Patricio del Chañar unless explicitly marked as contextual"
};