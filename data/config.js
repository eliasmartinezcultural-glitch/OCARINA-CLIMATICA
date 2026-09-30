// OCARINA CLIMÁTICA V0.2.0
// Configuración central: una sola puerta para cambiar fuentes, estación y comportamiento.
// NO colocar datos inventados aquí.
window.CLIMATE_CONFIG={
  version:"0.2.0",
  place:{name:"San Patricio del Chañar",province:"Neuquén",country:"Argentina"},
  observation:{source:"SMN",status:"pendiente-de-conexion",refresh:"hourly"},
  quality:{unknownLabel:"Sin dato",estimatedLabel:"Estimado",observedLabel:"Observado",forecastLabel:"Pronóstico"},
  fallback:{showUnavailable:true}
};