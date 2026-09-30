// Contrato normalizado V0.2.1. Ningún proveedor escribe directamente en la interfaz.
window.Observatory={
  source:null,station:null,observedAt:null,status:"unavailable",
  observations:{
    temperature:{value:null,unit:"°C",quality:"unknown"},
    humidity:{value:null,unit:"%",quality:"unknown"},
    pressure:{value:null,unit:"hPa",quality:"unknown"},
    windSpeed:{value:null,unit:"km/h",quality:"unknown"},
    windDirection:{value:null,unit:"",quality:"unknown"},
    gust:{value:null,unit:"km/h",quality:"unknown"},
    precipitation:{value:null,unit:"mm",quality:"unknown"},
    sky:{value:null,unit:"",quality:"unknown"}
  },
  provenance:{provider:null,dataset:null,retrievedAt:null,coverage:null,notes:null}
};