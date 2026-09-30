// Contrato V0.3 para series históricas. Una fila nunca entra al motor sin estación + fecha + procedencia.
window.CLIMATE_HISTORICAL_SCHEMA={
  recordRequired:["stationId","stationName","observedAt","sourceId","values"],
  valueFields:{temperature:{unit:"°C",kind:"measured"},pressure:{unit:"hPa",kind:"measured"},humidity:{unit:"%",kind:"measured"},windSpeed:{unit:"km/h",kind:"measured"},windDirection:{unit:"°",kind:"measured"}},
  provenance:["provider","dataset","retrievedAt","coverage"],
  coverageStates:["complete","partial","unknown"],
  qualityStates:["observed","missing","estimated","derived","invalid"]
};