window.AICElChañarAdapter={
  id:"aic-el-chanar",
  async load(){try{const r=await fetch("data/live/aic-el-chanar.json?ts="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);return {ok:true,data:await r.json()};}catch(error){return {ok:false,message:"No se pudo cargar AIC: "+error.message};}}
};
window.renderAICPulse=function(){
  const box=document.getElementById("aic-pulse"); if(!box||!window.AICElChañarAdapter)return;
  window.AICElChañarAdapter.load().then(r=>{
    if(!r.ok||r.data?.status!=="ready"){box.innerHTML="<strong>Sin registro AIC disponible</strong><small>La capa hidrológica no pudo actualizarse.</small>";return;}
    const d=r.data; box.innerHTML="<span>RÍO NEUQUÉN · COMPENSADOR EL CHañAR</span><strong>"+(d.observations?.dailyMeanFlow||"—")+"</strong><small>caudal medio diario · "+(d.observations?.riverLevel||"—")+" nivel · fuente AIC</small>";
  });
};