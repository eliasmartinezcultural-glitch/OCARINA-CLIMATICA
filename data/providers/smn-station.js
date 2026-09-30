window.SMNStationAdapter={
  id:"smn-stations",
  async load(){
    try{
      const r=await fetch("data/live/smn-station.json?ts="+Date.now(),{cache:"no-store"});
      if(!r.ok) throw new Error("HTTP "+r.status);
      return {ok:true,data:await r.json()};
    }catch(error){
      return {ok:false,message:"No se pudo cargar la verificación de estación: "+error.message};
    }
  }
};
