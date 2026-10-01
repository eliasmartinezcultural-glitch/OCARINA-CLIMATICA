// OCARINA CLIMÁTICA · CAPA ADITIVA DE RECURSOS
// Esta capa no reemplaza PL1. Organiza recursos que podrán conectarse a las vistas existentes.
window.CLIMATE_RESOURCE_CATALOG=[
  {
    id:"smn-hourly",
    title:"Datos meteorológicos horarios",
    provider:"Servicio Meteorológico Nacional",
    evidence:"observed",
    domain:"atmosfera",
    localityRule:"exact-only",
    url:"https://datos.gob.ar/dataset/smn-datos-meteorologicos-horarios",
    use:["temperatura","presion","humedad","viento"],
    status:"ready-for-adapter"
  },
  {
    id:"smn-extremes",
    title:"Observaciones diarias de temperaturas extremas",
    provider:"Servicio Meteorológico Nacional",
    evidence:"observed",
    domain:"atmosfera",
    localityRule:"exact-only",
    url:"https://datos.gob.ar/dataset/smn-observaciones-diarias-temperaturas-extremas",
    use:["temperatura-minima","temperatura-maxima"],
    status:"ready-for-adapter"
  },
  {
    id:"smn-stations",
    title:"Listado de Estaciones Meteorológicas del SMN",
    provider:"Servicio Meteorológico Nacional",
    evidence:"documentary",
    domain:"metadatos",
    localityRule:"exact-only",
    url:"https://datos.gob.ar/dataset/smn-listado-estaciones-meteorologicas-smn",
    use:["identidad-estacion","coordenadas","altura","codigo"],
    status:"identity-gate"
  },
  {
    id:"aic-forecast",
    title:"Pronóstico para El Chañar",
    provider:"Autoridad Interjurisdiccional de las Cuencas",
    evidence:"forecast",
    domain:"meteorologia",
    localityRule:"declared-locality",
    url:"https://www.aic.gob.ar/sitio/home?a=1015&z=1967225803",
    use:["pronostico"],
    status:"active"
  },
  {
    id:"aic-hydrology",
    title:"Compensador El Chañar",
    provider:"Autoridad Interjurisdiccional de las Cuencas",
    evidence:"observed",
    domain:"hidrologia",
    localityRule:"station-specific",
    url:"https://www.aic.gob.ar/sitio/estaciones-detalle?a=37&z=1840266588",
    use:["nivel","caudal"],
    status:"active"
  },
  {
    id:"inta-hail",
    title:"Incidencia de granizo en Neuquén",
    provider:"INTA Alto Valle",
    evidence:"documentary",
    domain:"agroclima",
    localityRule:"documented-locality",
    url:"https://repositorio.inta.gob.ar/bitstream/handle/20.500.12123/14080/INTA_CRPatagoniaNorte_EEAAltoValle_Villarreal_PL_Malla_para_proteger_frutales_granizo.pdf?isAllowed=y&sequence=1",
    use:["granizo","historia-climatica"],
    status:"active"
  }
];
