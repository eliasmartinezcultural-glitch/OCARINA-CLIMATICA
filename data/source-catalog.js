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
];