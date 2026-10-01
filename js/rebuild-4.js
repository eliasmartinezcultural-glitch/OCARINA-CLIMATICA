/* OCARINA CLIMÁTICA · REBUILD 4.0
   La página no navega entre cinco mundos: abre profundidad dentro de la misma historia.
*/
(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
const state={forecast:null,history:null,water:null};
async function load(path){try{const r=await fetch(path+"?v=4.0.0-"+Date.now(),{cache:"no-store"});return r.ok?r.json():null}catch{return null}}
function openDeep(id){
 $$(".deep").forEach(x=>x.classList.remove("open"));
 const panel=$("#deep-"+id);if(!panel)return;
 panel.classList.add("open");panel.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"});
 renderDeep(id);
}
function renderDeep(id){
 const panel=$("#deep-"+id);if(!panel)return;
 const f=state.forecast?.status==="ready"?state.forecast:null;
 const h=state.history?.status==="ready"?state.history:null;
 const w=state.water?.status==="ready"?state.water:null;
 if(id==="rain"){
   const status=h?"Serie local disponible":"Serie local todavía en verificación";
   $("#rainMetrics").innerHTML='<div class="metric"><span>ESTADO</span><b>'+esc(status)+'</b></div><div class="metric"><span>VENTANA</span><b>365 días</b></div><div class="metric"><span>REGLA</span><b>Sin reemplazo</b></div>';
   $("#rainVisual").innerHTML='<div class="empty"><div><strong>La lluvia será una lectura, no un número aislado.</strong><br>Acumulado · días con lluvia · períodos secos · eventos · comparación · fuente.</div></div>';
 } else if(id==="wind"||id==="temp"){
   const p=f?.forecast?.[0]?.periods?.[0]||{};
   const title=id==="wind"?"Viento":"Temperatura";
   const main=id==="wind"?(p.wind!=null?p.wind+" km/h":"Sin dato"):(p.temperature!=null?p.temperature+" °C":"Sin dato");
   const extra=id==="wind"?(p.gust!=null?p.gust+" km/h":"—"):(p.sky||"Sin descripción");
   $("#"+id+"Metrics").innerHTML='<div class="metric"><span>AHORA EN LA LECTURA</span><b>'+esc(main)+'</b></div><div class="metric"><span>OTRA SEÑAL</span><b>'+esc(extra)+'</b></div><div class="metric"><span>TIPO</span><b>Pronóstico</b></div>';
   $("#"+id+"Visual").innerHTML='<div class="empty"><div><strong>'+title+' se explora en capas.</strong><br>Dirección · evolución · ráfagas · máximas/mínimas · amplitud · contexto del paisaje.</div></div>';
 } else if(id==="water"){
   const obs=w?.observations||{};
   const val=obs.riverLevel??obs.dailyMeanFlow??"Sin dato";
   $("#waterMetrics").innerHTML='<div class="metric"><span>NIVEL / CAUDAL</span><b>'+esc(val)+'</b></div><div class="metric"><span>LUGAR</span><b>El Chañar</b></div><div class="metric"><span>FUENTE</span><b>AIC</b></div>';
   $("#waterVisual").innerHTML='<div class="empty"><div><strong>Acá se conecta todo.</strong><br>Río → riego → chacras → paisaje → producción → vida cotidiana → memoria.</div></div>';
 }
}
$$(".door").forEach(b=>b.addEventListener("click",()=>openDeep(b.dataset.door)));
$$(".close-deep").forEach(b=>b.addEventListener("click",()=>{$(".deep.open")?.classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}));
(async()=>{state.forecast=await load("data/live/aic-forecast.json");state.history=await load("data/live/historical-365.json");state.water=await load("data/live/aic-el-chanar.json");
 const f=state.forecast?.status==="ready",h=state.history?.status==="ready",w=state.water?.status==="ready";
 const fp=state.forecast?.forecast?.[0]?.periods?.[0];
 $("#windState").classList.toggle("ready",f);$("#tempState").classList.toggle("ready",f);$("#rainState").classList.toggle("ready",h);$("#waterState").classList.toggle("ready",w);
 if(f){$("#windMeta").textContent=(fp?.wind!=null?fp.wind+" km/h":"Pronóstico disponible")+" · AIC";$("#tempMeta").textContent=(fp?.temperature!=null?fp.temperature+" °C":"Pronóstico disponible")+" · AIC"}
 if(h)$("#rainMeta").textContent="Serie local disponible · 365 días";
 if(w){const o=state.water.observations||{};$("#waterMeta").textContent=(o.riverLevel!=null?o.riverLevel+" m":o.dailyMeanFlow!=null?o.dailyMeanFlow+" m³/s":"Dato hídrico disponible")+" · AIC"}
})();})();
