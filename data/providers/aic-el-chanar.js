window.AICElChañarAdapter={
  id:"aic-el-chanar",
  async load(){
    try{
      const r=await fetch("data/live/aic-el-chanar.json?ts="+Date.now(),{cache:"no-store"});
      if(!r.ok) throw new Error("HTTP "+r.status);
      return {ok:true,data:await r.json()};
    }catch(error){
      return {ok:false,message:"No se pudo cargar AIC: "+error.message};
    }
  }
};
