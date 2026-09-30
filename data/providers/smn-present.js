// Adaptador SMN V0.2.1.
// La página consume SOLO el registro normalizado publicado por el ingestor.
// Así, la fuente externa puede cambiar sin tocar la interfaz.
window.SMNPresentAdapter={
  id:"smn-present",
  dataset:"Estado del Tiempo presente",
  async load(){
    try{
      const response=await fetch("data/live/smn-present.json?ts="+Date.now(),{cache:"no-store"});
      if(!response.ok)throw new Error("HTTP "+response.status);
      return {ok:true,data:await response.json()};
    }catch(error){
      return {ok:false,reason:"local-ingestion-unavailable",message:"No se pudo cargar el último registro ingerido: "+error.message};
    }
  },
  normalize(raw){
    if(!raw||raw.status!=="candidate")return null;
    const n=v=>v===null||v===undefined||v===""?null:Number(String(v).replace(",","."));
    return {
      source:"SMN",
      station:raw.station||null,
      observedAt:raw.observedAt||null,
      status:"candidate",
      observations:{
        temperature:{value:n(raw.observations?.temperature),unit:"°C",quality:"observed"},
        humidity:{value:n(raw.observations?.humidity),unit:"%",quality:"observed"},
        pressure:{value:n(raw.observations?.pressure),unit:"hPa",quality:"observed"},
        windSpeed:{value:n(raw.observations?.windSpeed),unit:"km/h",quality:"observed"},
        windDirection:{value:raw.observations?.windDirection||null,unit:"",quality:"unknown"},
        gust:{value:null,unit:"km/h",quality:"unknown"},
        precipitation:{value:null,unit:"mm",quality:"unknown"},
        sky:{value:null,unit:"",quality:"unknown"}
      },
      provenance:{
        provider:"Servicio Meteorológico Nacional",
        dataset:"Estado del Tiempo presente",
        retrievedAt:raw.retrievedAt||null,
        coverage:"Registro ingerido desde el recurso SMN",
        notes:raw.notes||"Observación del SMN."
      }
    };
  }
};