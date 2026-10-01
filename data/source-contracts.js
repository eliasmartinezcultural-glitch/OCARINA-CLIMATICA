// OCARINA CLIMÁTICA · CONTRATOS DE FUENTE · CAPA ADITIVA
window.CLIMATE_SOURCE_CONTRACTS={
  "SMN-HOURLY":{evidence:"observed",localityGate:"exact-station",required:["stationId","observedAt","variable","value","unit"],neverFallback:true},
  "SMN-EXTREMES":{evidence:"observed",localityGate:"exact-station",required:["stationId","date","temperatureMin","temperatureMax"],neverFallback:true},
  "SMN-FORECAST5":{evidence:"forecast",localityGate:"declared-locality",required:["target","issuedAt","validFrom","validTo"],neverFallback:false},
  "AIC-FORECAST":{evidence:"forecast",localityGate:"declared-locality",required:["place","retrievedAt","forecast"],neverFallback:false},
  "AIC-CHANAR":{evidence:"observed",localityGate:"station-specific",required:["station","retrievedAt","observations"],neverFallback:true},
  "SMN-RADAR":{evidence:"estimated",localityGate:"spatial-context",required:["timestamp","coverage","product"],neverFallback:false},
  "CONAE-CATALOG":{evidence:"estimated",localityGate:"spatial-context",required:["sensor","acquisitionDate","productId","geometry"],neverFallback:false},
  "CONAE-SAOCOM":{evidence:"estimated",localityGate:"spatial-context",required:["sensor","acquisitionDate","productId","processingLevel"],neverFallback:false},
  "COPERNICUS-CDS":{evidence:"estimated",localityGate:"coordinate-grid",required:["dataset","gridCell","period","variable","method"],neverFallback:false},
  "NOAA-NCEI-CDO":{evidence:"observed",localityGate:"exact-station",required:["dataset","stationId","period","variable"],neverFallback:true}
};
