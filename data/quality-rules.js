// OCARINA CLIMÁTICA · REGLAS DE CALIDAD · CAPA ADITIVA
window.CLIMATE_QUALITY_RULES={
  freshness:{LIVE:36,STALE:168},
  completeness:{warnBelow:0.95,failBelow:0.80},
  duplicateKey:["sourceId","stationId","observedAt","variable"],
  checks:[
    "required-fields",
    "station-identity",
    "unit-consistency",
    "timestamp-validity",
    "duplicate-detection",
    "gap-detection",
    "range-check",
    "source-availability",
    "provenance-completeness",
    "transformation-trace"
  ],
  principle:"outliers are flagged for review; they are not silently deleted"
};
