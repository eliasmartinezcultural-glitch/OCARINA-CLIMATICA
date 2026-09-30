// Fuentes planificadas V0.2.0.
// Las fuentes se documentan antes de conectarlas.
// SMN publica datos presentes y horarios mediante el ecosistema de Datos Argentina.
// San Patricio del Chañar no debe recibir automáticamente datos de otra estación
// como si fueran mediciones locales: la estación y cobertura deberán verificarse.
window.CLIMATE_SOURCES=[
  {id:"smn-present",name:"SMN · Estado del tiempo presente",type:"observacion",status:"planned"},
  {id:"smn-hourly",name:"SMN · Datos meteorológicos horarios",type:"historico",status:"planned"},
  {id:"smn-stations",name:"SMN · Listado de estaciones",type:"metadatos",status:"planned"},
  {id:"smn-temp365",name:"SMN · Temperatura 365 días",type:"historico",status:"planned"},
  {id:"smn-normals",name:"SMN · Estadísticas climáticas normales",type:"climatologia",status:"planned"}
];