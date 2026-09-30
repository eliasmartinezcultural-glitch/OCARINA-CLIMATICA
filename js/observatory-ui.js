function renderObservatory(){
  const o=window.Observatory;
  const map={
    temperature:["now-temperature","Temperatura","°C"],
    windSpeed:["now-wind","Viento","km/h"],
    humidity:["now-humidity","Humedad","%"],
    pressure:["now-pressure","Presión","hPa"]
  };
  Object.entries(map).forEach(([key,[id,label,unit]])=>{
    const el=document.getElementById(id); if(!el)return;
    const item=o.observations[key];
    el.innerHTML=`<span>${label}</span><strong>${item.value==null?"—":item.value}</strong><small>${item.value==null?"sin dato":unit+" · "+qualityLabel(item.quality)}</small>`;
  });
  const state=document.getElementById("observatory-state");
  if(state) state.textContent=o.status==="live"?"Observación conectada":"Fuente en preparación";
  const stamp=document.getElementById("observatory-updated");
  if(stamp) stamp.textContent=o.observedAt?"Actualizado "+new Date(o.observedAt).toLocaleString("es-AR"):"Todavía no hay una observación conectada";
}
function qualityLabel(q){return ({observed:"Observado",estimated:"Estimado",forecast:"Pronóstico",unknown:"Sin dato"})[q]||"Sin dato";}
window.renderObservatory=renderObservatory;