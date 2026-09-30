(function(){
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
const fmt=n=>n==null?"—":Number(n).toLocaleString("es-AR",{maximumFractionDigits:1});
async function get(path){const r=await fetch(path+"?ts="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}
function chart(data,key,label,unit){
 const el=document.querySelector('[data-history-chart="'+key+'"]'); if(!el)return;
 if(!Array.isArray(data)||data.length<2){el.innerHTML='<div class="history-empty">Serie todavía no disponible con cobertura local verificable.</div>';return;}
 const w=900,h=250,p=28, vals=data.map(x=>Number(x[key])).filter(Number.isFinite),min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
 const pts=data.map((x,i)=>{const v=Number(x[key]);if(!Number.isFinite(v))return null;const xx=p+(i/(data.length-1))*(w-p*2),yy=h-p-((v-min)/range)*(h-p*2);return xx.toFixed(1)+","+yy.toFixed(1)}).filter(Boolean);
 el.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(label)+'">'+
 '<line x1="'+p+'" y1="'+(h-p)+'" x2="'+(w-p)+'" y2="'+(h-p)+'" class="chart-axis"/>'+
 '<polyline points="'+pts.join(" ")+'" class="history-line"/>'+
 '<text x="'+p+'" y="18" class="chart-label">'+esc(fmt(max))+' '+esc(unit)+'</text>'+
 '<text x="'+p+'" y="'+(h-4)+'" class="chart-label">'+esc(fmt(min))+' '+esc(unit)+'</text></svg>';
}
async function load(){
 const state=document.querySelector("#history-365-status"),meta=document.querySelector("#history-365-meta");
 try{
  const d=await get("data/live/historical-365.json");
  if(d.status!=="ready"){state.innerHTML='<strong>Serie local en construcción</strong><p>La fuente SMN está identificada, pero todavía no se presenta una estación como local sin verificar su identidad.</p>';meta.textContent="Estado: "+d.status+" · cobertura: "+d.coverage.days+" días solicitados · 0 registros locales publicados.";return;}
  state.innerHTML='<strong>365 días disponibles</strong><p>Serie observada con procedencia y cobertura conservadas.</p>';
  meta.textContent="Fuente: "+d.source+" · estación: "+d.stationName+" · desde "+d.coverage.start+" hasta "+d.coverage.end+" · "+d.records.length+" registros.";
  const ind=document.querySelector("#history-indicators");
  if(ind&&Array.isArray(d.records)&&d.records.length){
   const vals=d.records;
   const max=vals.map(x=>Number(x.temperatureMax)).filter(Number.isFinite), min=vals.map(x=>Number(x.temperatureMin)).filter(Number.isFinite);
   const cells=ind.querySelectorAll("article strong");
   if(cells[0]&&max.length)cells[0].textContent=fmt(Math.max(...max))+" °C";
   if(cells[1]&&min.length)cells[1].textContent=fmt(Math.min(...min))+" °C";
   if(cells[3])cells[3].textContent=min.filter(x=>x<=0).length;
   if(cells[4])cells[4].textContent=max.filter(x=>x>=35).length;
   if(cells[5])cells[5].textContent="pendiente";
  }\n  chart(d.records,"temperatureMax","Temperatura máxima diaria","°C"); chart(d.records,"temperatureMin","Temperatura mínima diaria","°C");
  chart(d.records,"precipitation","Precipitación diaria","mm"); chart(d.records,"windSpeed","Viento","km/h");
 }catch(e){state.innerHTML='<strong>Historial temporalmente no disponible</strong><p>El sistema no sustituye la serie por otra estación ni inventa valores.</p>';meta.textContent="Error de lectura del snapshot histórico."}
 const ev=await get("data/historical-events.json");
 const list=document.querySelector("#history-events");
 if(list)list.innerHTML=ev.map(x=>'<article class="history-event"><span>'+esc(x.dateLabel)+'</span><div><small>'+esc(x.evidence)+' · '+esc(x.locality)+'</small><h3>'+esc(x.title)+'</h3><p>'+esc(x.summary)+'</p><a href="'+esc(x.sourceUrl)+'" target="_blank" rel="noopener">Ver fuente</a></div></article>').join("");
}
document.addEventListener("DOMContentLoaded",load,{once:true});
})();