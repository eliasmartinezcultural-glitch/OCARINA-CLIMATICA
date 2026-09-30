// OCARINA CLIMÁTICA · CRONOLOGÍA CLIMÁTICA · contrato V1M
window.CLIMATE_CHRONOLOGY_SCHEMA={
  scope:"San Patricio del Chañar",
  eventRequired:["id","date","phenomenon","title","summary","evidenceLevel","sourceIds"],
  evidenceLevels:{
    primary:"Fuente institucional o registro directo",
    secondary:"Prensa o documento que reproduce/recoge el episodio",
    testimonial:"Memoria o testimonio identificado",
    contextual:"Contexto regional, no necesariamente local"
  },
  dataLayers:["observed","derived","forecast","documentary","testimonial","contextual"],
  phenomenonTypes:[
    "lluvia","granizo","nieve","helada","viento","tormenta",
    "inundacion","crecida","aluvion","calor","frio","otro"
  ],
  rules:[
    "No convertir una noticia en una medición.",
    "No convertir un testimonio en un dato instrumental.",
    "No llamar huracán a un fenómeno que no corresponda meteorológicamente.",
    "Cada evento debe conservar fecha, lugar, evidencia y fuentes.",
    "Un evento regional puede aparecer como contexto, nunca como evento local sin evidencia local."
  ]
};