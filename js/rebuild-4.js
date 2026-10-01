(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const state={forecast:null,history:null,water:null};
async function load(path){try{const r=await fetch(path+"?v=4.1-"+Date.now(),{cache:"no-store"});return r.ok?r.json():null}catch{return null}}
function value(...xs){return xs.find(x=>x!==undefined&&x!==null&&x!=="")??null}
function openDeep(id){$$(".deep").forEach(x=>x.classList.remove("open"));const p=$("#deep-"+id);if(!p)return;p.classList.add("open");renderDeep(id);p.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"})}
function metric(label,val){return '<div class="metric"><span>'+esc(label)+'</span><b>'+esc(val??"—")+'</b></div>'}
function renderDeep(id){
 const f=state.forecast?.status==="ready"?state.forecast:null,h=state.history?.status==="ready"?state.history:null,w=state.water?.status==="ready"?state.water:null;
 const p=f?.forecast?.[0]?.periods?.[0]||{};
 if(id==="rain"){
   $("#rainMetrics").innerHTML=metric("Serie local",h?"Disponible":"En verificación")+metric("Ventana","365 días")+metric("Lectura","Acumulado + eventos");
   $("#rainVisual").innerHTML='<div class="chart-placeholder rain-shape"><span>LLUVIA</span><i></i><i></i><i></i><i></i><small>Cuando la serie local esté validada, acá aparece su evolución real.</small></div>';
 } else if(id==="wind"){
   $("#windMetrics").innerHTML=metric("Velocidad",p.wind!=null?p.wind+" km/h":"—")+metric("Ráfaga",p.gust!=null?p.gust+" km/h":"—")+metric("Dirección",value(p.direction,p.windDirection)||"—");
   $("#windVisual").innerHTML='<div class="chart-placeholder wind-shape"><div class="wind-lines"></div><strong>ROSA DE VIENTO</strong><small>Dirección · velocidad · ráfagas · evolución</small></div>';
 } else if(id==="temp"){
   $("#tempMetrics").innerHTML=metric("Temperatura",p.temperature!=null?p.temperature+" °C":"—")+metric("Cielo",p.sky||"—")+metric("Tipo","Pronóstico AIC");
   $("#tempVisual").innerHTML='<div class="chart-placeholder temp-shape"><div class="thermo"></div><strong>HISTORIA TÉRMICA</strong><small>Máxima · mínima · amplitud · heladas · extremos</small></div>';
 } else {
   const o=w?.observations||{};$("#waterMetrics").innerHTML=metric("Nivel",o.riverLevel!=null?o.riverLevel+" m":"—")+metric("Caudal medio",o.dailyMeanFlow!=null?o.dailyMeanFlow+" m³/s":"—")+metric("Lugar","Compensador El Chañar");
   $("#waterVisual").innerHTML='<div class="chart-placeholder water-shape"><div class="river"></div><strong>RÍO → RIEGO → CHACRAS</strong><small>El agua conecta clima y territorio.</small></div>';
 }
}
$$(".door").forEach(b=>b.addEventListener("click",()=>openDeep(b.dataset.door)));
$$(".close-deep").forEach(b=>b.addEventListener("click",()=>{$(".deep.open")?.classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}));
(async()=>{state.forecast=await load("data/live/aic-forecast.json");state.history=await load("data/live/historical-365.json");state.water=await load("data/live/aic-el-chanar.json");
const f=state.forecast?.status==="ready",h=state.history?.status==="ready",w=state.water?.status==="ready";
$("#windState").classList.toggle("ready",f);$("#tempState").classList.toggle("ready",f);$("#rainState").classList.toggle("ready",h);$("#waterState").classList.toggle("ready",w);
const p=state.forecast?.forecast?.[0]?.periods?.[0]||{},o=state.water?.observations||{};
if(f){$("#windMeta").textContent=(p.wind!=null?p.wind+" km/h":"Pronóstico")+" · AIC";$("#tempMeta").textContent=(p.temperature!=null?p.temperature+" °C":"Pronóstico")+" · AIC"}
if(h)$("#rainMeta").textContent="Serie local · 365 días";
if(w)$("#waterMeta").textContent=(o.riverLevel!=null?o.riverLevel+" m":o.dailyMeanFlow!=null?o.dailyMeanFlow+" m³/s":"Dato hídrico")+" · AIC";
})();})();