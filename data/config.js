// OCARINA CLIMÁTICA · BASE FUNCIONAL DERIVADA DE V1M
window.CLIMATE_CONFIG={
  version:"1.0.0-local",
  masterBaseline:"V1M",
  place:{name:"San Patricio del Chañar",province:"Neuquén",country:"Argentina",scopePolicy:"exact-local-only"},
  observation:{provider:"smn-present",status:"connector-enabled",refreshMinutes:60},
  historical:{provider:"smn-hourly",refreshMinutes:60,windowDays:14},
  report:{periodDays:7,language:"es-AR"},
  quality:{unknownLabel:"Sin dato",estimatedLabel:"Estimado",observedLabel:"Observado",forecastLabel:"Pronóstico",derivedLabel:"Derivado"},
  validation:{maxObservationAgeMinutes:180,futureToleranceMinutes:15},
  fallback:{showUnavailable:true},
  architecture:{flow:"FUENTE → INGESTOR → ADAPTADOR → VALIDACIÓN → OBSERVATORIO → REPORTE → INTERFAZ",localityRule:"exact-only"}
};