// Adaptador SMN V0.2.1. No asume una URL JSON/CORS inexistente ni convierte una localidad en medición.
window.SMNPresentAdapter={
  id:"smn-present",dataset:"Estado del Tiempo presente",
  async load(){return {ok:false,reason:"browser-access-not-verified",message:"El recurso oficial requiere una ruta de ingestión accesible para GitHub Pages."};},
  normalize(raw){
    if(!raw)return null;
    const n=v=>v===null||v===undefined||v===""?null:Number(String(v).replace(",",".")); 
    return {source:"SMN",station:raw.estacion||null,observedAt:raw.fecha&&raw.hora?(raw.fecha+"T"+raw.hora):null,status:"candidate",
      observations:{
        temperature:{value:n(raw.temperatura),unit:"°C",quality:"observed"},
        humidity:{value:n(raw.humedad_relativa),unit:"%",quality:"observed"},
        pressure:{value:n(raw.presion_superficie),unit:"hPa",quality:"observed"},
        windSpeed:{value:n(raw.viento_intensidad),unit:"km/h",quality:"observed"},
        windDirection:{value:raw.viento_direccion||null,unit:"",quality:"observed"},
        gust:{value:null,unit:"km/h",quality:"unknown"},precipitation:{value:null,unit:"mm",quality:"unknown"},
        sky:{value:raw.estado_nuboso||null,unit:"",quality:"observed"}
      },
      provenance:{provider:"Servicio Meteorológico Nacional",dataset:"Estado del Tiempo presente",retrievedAt:new Date().toISOString(),coverage:"Red de estaciones del SMN",notes:"Observación; no equivale automáticamente a una medición dentro de San Patricio del Chañar."}
    };
  }
};