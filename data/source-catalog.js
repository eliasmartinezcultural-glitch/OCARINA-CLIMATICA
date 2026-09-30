// Catálogo de fuentes. Solo se activan automáticamente las que tienen contrato e ingestor verificables.
window.CLIMATE_SOURCE_CATALOG=[
{id:"smn-present",name:"SMN · Estado del Tiempo presente",role:"observación actual",status:"active",official:true,refresh:"hourly",datasetUrl:"https://datos.gob.ar/dataset/smn-estado-tiempo-presente"},
{id:"smn-hourly",name:"SMN · Datos meteorológicos horarios",role:"serie y reporte semanal",status:"active",official:true,refresh:"daily",datasetUrl:"https://datos.gob.ar/dataset/smn-datos-meteorologicos-horarios"},
{id:"smn-forecast5",name:"SMN · Pronóstico a 5 días",role:"pronóstico local",status:"next",official:true,refresh:"daily",datasetUrl:"https://datos.gob.ar/dataset/smn-pronostico-tiempo-5-dias"},
{id:"smn-extremes",name:"SMN · Observaciones diarias de temperaturas extremas",role:"extremos",status:"next",official:true,datasetUrl:"https://datos.gob.ar/dataset/smn-observaciones-diarias-temperaturas-extremas"},
{id:"smn-temp365",name:"SMN · Registro de Temperatura (365 días)",role:"memoria térmica reciente",status:"next",official:true},
{id:"smn-stations",name:"SMN · Listado de Estaciones Meteorológicas",role:"identidad y metadatos",status:"next",official:true,datasetUrl:"https://datos.gob.ar/dataset/smn-listado-estaciones-meteorologicas-smn"},
{id:"smn-alerts",name:"SMN · Alertas Meteorológicas (365 días)",role:"eventos meteorológicos",status:"planned",official:true,datasetUrl:"https://datos.gob.ar/dataset/smn-alertas-meteorologicas-365-dias"},
{id:"smn-solar",name:"SMN · Radiación Solar",role:"radiación",status:"planned",official:true,datasetUrl:"https://datos.gob.ar/dataset/smn-radiacion-solar"},
{id:"smn-normals",name:"SMN · Estadísticas Climáticas Normales",role:"climatología",status:"planned",official:true}
,
{id:"aic-el-chanar",name:"AIC · Estación hidrológica El Chañar",role:"río, caudal y estado hidrológico",status:"cataloged",official:true,domain:"hidrología",measurement:"observed",locality:"San Patricio del Chañar"},
{id:"aic-frost",name:"AIC · Pronóstico de heladas",role:"heladas tardías en valles bajo riego",status:"cataloged",official:true,domain:"agrometeorología",measurement:"forecast",locality:"San Patricio del Chañar"},
{id:"intA-hail",name:"INTA Alto Valle · Granizo",role:"historia y climatología del granizo",status:"cataloged",official:true,domain:"agroclima",measurement:"documentary",locality:"San Patricio del Chañar",researchNote:"Serie de granizo 1966–1998 y 2011–2017 documentada."},
{id:"epea-station",name:"EPEA 3 · estación meteorológica histórica",role:"investigar registros locales históricos",status:"research",official:true,domain:"meteorología local",measurement:"observed",locality:"San Patricio del Chañar",researchNote:"Confirmada su instalación en EPEA 3 en 2015; serie y estado actual aún por localizar."},
{id:"pws-centenario",name:"Weather Underground · PWS Centenario",role:"observación privada complementaria",status:"cataloged",official:false,domain:"meteorología",measurement:"observed",locality:"San Patricio del Chañar",note:"No sustituye una estación oficial."},
{id:"open-meteo-era5",name:"Open-Meteo · ERA5/ERA5-Land",role:"reanálisis histórico y reconstrucción",status:"cataloged",official:false,domain:"modelo/reanálisis",measurement:"estimated",locality:"punto de referencia"},
{id:"meteoblue-climate",name:"Meteoblue · Climate",role:"simulación histórica de contexto",status:"cataloged",official:false,domain:"modelo",measurement:"estimated",locality:"San Patricio del Chañar"}
];