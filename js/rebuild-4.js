(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const state={forecast:null,history:null,water:null};
async function load(path){try{const r=await fetch(path+"?v=4.2-"+Date.now(),{cache:"no-store"});return r.ok?r.json():null}catch{return null}}
function value(...xs){return xs.find(x=>x!==undefined&&x!==null&&x!=="")??null}
function openDeep(id){$$(".deep").forEach(x=>x.classList.remove("open"));const p=$("#deep-"+id);if(!p)return;p.classList.add("open");renderDeep(id);p.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"})}
function metric(label,val){return '<div class="metric"><span>'+esc(label)+'</span><b>'+esc(val??"—")+'</b></div>'}
function emptyChart(title,text,kind){return '<div class="chart-shell"><div class="chart-kicker"><span>VISUALIZACIÓN</span><b>'+esc(kind)+'</b></div><div class="chart-empty"><div><strong>'+esc(title)+'</strong><span>'+esc(text)+'</span></div></div></div>'}
function lineChart(title,values,unit){if(!Array.isArray(values)||values.length<2)return emptyChart(title,"La estructura está lista para recibir la serie real. Mientras la fuente local no entregue una serie verificable, no se dibuja una curva ficticia.",unit);const w=900,h=230,p=20,min=Math.min(...values),max=Math.max(...values),range=max-min||1;const pts=values.map((v,i)=>((p+i*(w-2*p)/(values.length-1))+","+(h-p-(v-min)*(h-2*p)/range))).join(" ");return '<div class="chart-shell"><div class="chart-kicker"><span>EVOLUCIÓN</span><b>'+esc(unit)+'</b></div><svg class="chart-svg" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(title)+'"><path class="axis" d="M20 20V210H880"/><polyline class="line-placeholder" points="'+pts+'"/></svg></div>'}
function renderDeep(id){
 const f=state.forecast?.status==="ready"?state.forecast:null,h=state.history?.status==="ready"?state.history:null,w=state.water?.status==="ready"?state.water:null;
 const p=f?.forecast?.[0]?.periods?.[0]||{};
 if(id==="rain"){
   $("#rainMetrics").innerHTML=metric("Serie local",h?"Disponible":"No validada")+metric("Ventana","365 días")+metric("Lectura","Acumulado + eventos");
   $("#rainVisual").innerHTML=h?.series?lineChart("Evolución de lluvia",h.series,"mm"):emptyChart("Lluvia local","No hay una serie meteorológica local validada en el snapshot actual. La puerta conserva la estructura para mostrar acumulados, calendario y períodos secos cuando exista una fuente verificable.","SIN SERIE");
 } else if(id==="wind"){
   $("#windMetrics").innerHTML=metric("Velocidad",p.wind!=null?p.wind+" km/h":"—")+metric("Ráfaga",p.gust!=null?p.gust+" km/h":"—")+metric("Dirección",value(p.direction,p.windDirection)||"—");
   $("#windVisual").innerHTML=f?.windRose?emptyChart("Rosa de viento","La arquitectura está preparada para dirección, velocidad y ráfaga; el snapshot AIC actual no trae períodos publicados.","AIC"):emptyChart("Viento en Chañar","Sin períodos AIC publicados en el snapshot actual. No se fabrica una rosa de viento a partir de datos inexistentes.","SIN DATO");
 } else if(id==="temp"){
   $("#tempMetrics").innerHTML=metric("Temperatura",p.temperature!=null?p.temperature+" °C":"—")+metric("Cielo",p.sky||"—")+metric("Tipo",f?"Pronóstico AIC":"Sin pronóstico");
   $("#tempVisual").innerHTML=f?.temperatureSeries?lineChart("Historia térmica",f.temperatureSeries,"°C"):emptyChart("Historia térmica","Máxima, mínima, amplitud y heladas necesitan una serie observada o histórica verificable. El panel no confunde pronóstico con climatología.","SIN SERIE");
 } else {
   const o=w?.observations||{};$("#waterMetrics").innerHTML=metric("Nivel",o.riverLevel?o.riverLevel+" m":"—")+metric("Caudal medio",o.dailyMeanFlow?o.dailyMeanFlow+" m³/s":"—")+metric("Lugar","Compensador El Chañar");
   $("#waterVisual").innerHTML='<div class="map-panel"><div class="territory-river"></div><span class="map-label chanar">SAN PATRICIO DEL CHAÑAR</span><span class="map-label river">RÍO NEUQUÉN</span><span class="map-label chacras">CHACRAS + RIEGO</span><span class="map-dot"></span><span class="map-legend">ESQUEMA TERRITORIAL · NO ES CARTOGRAFÍA DE PRECISIÓN</span><span class="photo-credit">Paisaje local · referencia fotográfica CC BY 3.0</span></div>';
 }
}
$$(".door").forEach(b=>b.addEventListener("click",()=>openDeep(b.dataset.door)));
$$(".close-deep").forEach(b=>b.addEventListener("click",()=>{$(".deep.open")?.classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}));
(async()=>{state.forecast=await load("data/live/aic-forecast.json");state.history=await load("data/live/historical-365.json");state.water=await load("data/live/aic-el-chanar.json");
const f=state.forecast?.status==="ready",h=state.history?.status==="ready",w=state.water?.status==="ready";
$("#windState").classList.toggle("ready",f);$("#tempState").classList.toggle("ready",f);$("#rainState").classList.toggle("ready",h);$("#waterState").classList.toggle("ready",w);
const p=state.forecast?.forecast?.[0]?.periods?.[0]||{},o=state.water?.observations||{};
if(f){$("#windMeta").textContent=(p.wind!=null?p.wind+" km/h":"AIC")+" · fuente";$("#tempMeta").textContent=(p.temperature!=null?p.temperature+" °C":"AIC")+" · fuente"}
if(h)$("#rainMeta").textContent="Serie local · 365 días";
if(w)$("#waterMeta").textContent=(o.riverLevel?o.riverLevel+" m":o.dailyMeanFlow?o.dailyMeanFlow+" m³/s":"AIC · capa hídrica");
})();})();