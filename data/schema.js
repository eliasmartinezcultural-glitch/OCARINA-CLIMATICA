// Esquema canónico V0.2.2.
window.CLIMATE_SCHEMA={
  observation:{
    required:["source","station","observedAt","observations"],
    provenanceRequired:["provider","dataset","retrievedAt","coverage"]
  },
  fields:{
    temperature:{label:"Temperatura",unit:"°C",kind:"measured"},
    humidity:{label:"Humedad relativa",unit:"%",kind:"measured"},
    pressure:{label:"Presión",unit:"hPa",kind:"measured"},
    windSpeed:{label:"Viento",unit:"km/h",kind:"measured"},
    windDirection:{label:"Dirección del viento",unit:"",kind:"measured"},
    sky:{label:"Estado del cielo",unit:"",kind:"observed-description"},
    apparentTemperature:{label:"Sensación térmica",unit:"°C",kind:"calculated"}
  }
};