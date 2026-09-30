// OCARINA CLIMÁTICA · BASE FUNCIONAL DERIVADA DE V1M
window.CLIMATE_CONFIG={
  version:"3.0.0",
  masterBaseline:"V1M",
  place:{name:"San Patricio del Chañar",province:"Neuquén",country:"Argentina",scopePolicy:"exact-local-only"},
  observation:{provider:"multi-source",status:"truth-first",refreshMinutes:30,localityRule:"exact-only"},
  historical:{provider:"smn-hourly",refreshMinutes:60,windowDays:14,derivedOnly:true},
  report:{periodDays:7,language:"es-AR"},
  chronology:{startYear:1900,endYear:2026,status:"documented-initial-base",exhaustive:false},archive:{visual:true,audio:true,video:true,documents:true,photos:true,rightsRequired:true},
  quality:{unknownLabel:"Sin dato",estimatedLabel:"Estimado",observedLabel:"Observado",forecastLabel:"Pronóstico",derivedLabel:"Derivado"},
  validation:{maxObservationAgeMinutes:180,futureToleranceMinutes:15},
  fallback:{showUnavailable:true},
  architecture:{flow:"FUENTE → INGESTOR → SNAPSHOT → ADAPTADOR → VALIDACIÓN → OBSERVATORIO → REPORTE → INTERFAZ",localityRule:"exact-only",fallbackPolicy:"never substitute silently",sourceClasses:["observed","forecast","historical","derived","memory"]}
};