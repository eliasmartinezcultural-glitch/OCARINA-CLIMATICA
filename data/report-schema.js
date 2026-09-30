// Contrato del reporte meteorológico local. No interpreta ni inventa: resume datos disponibles.
window.CLIMATE_REPORT_SCHEMA={
  scope:"San Patricio del Chañar",
  periodDays:7,
  sections:[
    "temperatura","humedad","presion","viento","precipitacion",
    "cielo","visibilidad","extremos","tendencias","calidad"
  ],
  qualities:["observed","derived","forecast","missing"],
  rule:"Toda conclusión debe poder rastrearse a registros locales identificados."
};