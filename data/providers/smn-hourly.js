// Adaptador horario. Consume únicamente el archivo normalizado generado por GitHub Actions.
window.SMNHourlyAdapter={
  id:"smn-hourly",
  dataset:"Datos meteorológicos horarios",
  async load(){
    try{
      const r=await fetch("data/live/smn-hourly.json?ts="+Date.now(),{cache:"no-store"});
      if(!r.ok)throw new Error("HTTP "+r.status);
      return {ok:true,data:await r.json()};
    }catch(error){
      return {ok:false,message:"No se pudo cargar la serie horaria local: "+error.message};
    }
  }
};