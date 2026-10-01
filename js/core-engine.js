const OCARINA={
  views:["ahora","pronostico","historial","historias","aprender"],
  evidence:{
    now:["OBSERVADO","Una observación local solo se publica si la estación y el dato pueden atribuirse a San Patricio del Chañar.","Si no hay identidad verificable, el motor muestra ausencia de dato. No sustituye silenciosamente otra localidad."],
    mission:["MISIÓN","Ocarina Climática existe para observar, comprender, documentar, recordar y valorar el clima de San Patricio del Chañar.","Quedan fuera política, policiales, espectáculos, polémicas y cualquier contenido ajeno a la línea climática local."],
    sources:["FUENTES","El motor conserva fuente, estación, fecha, tipo de evidencia y estado de validación.","Las fuentes oficiales y científicas se usan según su función. Un pronóstico no se convierte en observación; un documento histórico no se convierte en medición."],
    architecture:["MOTOR","FUENTE → INGESTOR → SNAPSHOT → VALIDACIÓN → INTERFAZ.","La complejidad vive detrás de una interfaz deliberadamente simple."],
    accessibility:["ACCESIBILIDAD","La interfaz se diseña para teclado, lectores de pantalla, toque, pantallas pequeñas y movimiento reducido.","La referencia técnica es WCAG 2.2; la accesibilidad se trata como requisito de producto, no como adorno."]
  }
};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const fmt=(n,d=1)=>Number(n).toLocaleString("es-AR",{maximumFractionDigits:d});
async function loadJSON(path){const r=await fetch(path+"?v="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error(path+" "+r.status);return r.json()}

function go(view){
  if(!OCARINA.views.includes(view))view="ahora";
  $$(".view").forEach(v=>v.hidden=v.dataset.view!==view);
  $$(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.go===view));
  history.replaceState(null,"","#"+view);
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
window.addEventListener("hashchange",()=>go(location.hash.slice(1)||"ahora"));

function openDrawer(key){
  const d=OCARINA.evidence[key]||OCARINA.evidence.mission;
  $("#drawerTitle").textContent=d[0];
  $("#drawerBody").innerHTML="<p>"+esc(d[1])+"</p><p>"+esc(d[2])+"</p>";
  $("#drawerBackdrop").hidden=false;$("#evidenceDrawer").classList.add("open");$("#evidenceDrawer").setAttribute("aria-hidden","false");
}
function closeDrawer(){$("#evidenceDrawer").classList.remove("open");$("#evidenceDrawer").setAttribute("aria-hidden","true");setTimeout(()=>$("#drawerBackdrop").hidden=true,220)}
$("#drawerClose").addEventListener("click",closeDrawer);$("#drawerBackdrop").addEventListener("click",closeDrawer);
$$("[data-open-evidence]").forEach(b=>b.addEventListener("click",()=>openDrawer(b.dataset.openEvidence)));

$("#menuButton").addEventListener("click",()=>{const m=$("#quickMenu"),open=m.hidden;m.hidden=!open;$("#menuButton").setAttribute("aria-expanded",String(open))});
$$(".quick-menu button").forEach(b=>b.addEventListener("click",()=>{openDrawer(b.dataset.openEvidence);$("#quickMenu").hidden=true}));
$("#searchButton").addEventListener("click",()=>{$("#searchModal").hidden=false;$("#searchModal").setAttribute("aria-hidden","false");$("#searchInput").focus()});
$$("[data-close-search]").forEach(b=>b.addEventListener("click",()=>{$("#searchModal").hidden=true}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDrawer();$("#searchModal").hidden=true;$("#quickMenu").hidden=true}});

let stories=[];
function renderStories(filter="todos"){
 const list=$("#storyList"),items=filter==="todos"?stories:stories.filter(x=>x.evidence===filter);
 list.innerHTML=items.map(x=>'<article class="story-card"><span class="story-date">'+esc(x.dateLabel)+'</span><h3>'+esc(x.title)+'</h3><span class="evidence">'+esc(x.evidence)+'</span><p>'+esc(x.summary)+'</p><a href="'+esc(x.sourceUrl)+'" target="_blank" rel="noopener">Abrir fuente</a></article>').join("")||'<div class="truth-panel"><strong>No hay piezas con ese filtro.</strong><p>El archivo prefiere estar vacío antes que completar una categoría con material que no corresponda.</p></div>';
}
$$("[data-story-filter]").forEach(b=>b.addEventListener("click",()=>{$$("[data-story-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderStories(b.dataset.storyFilter)}));

function drawChart(el,records,key,label,unit){
 const vals=records.map(x=>Number(x[key])).filter(Number.isFinite);
 if(vals.length<2){el.innerHTML='<div class="empty-chart">Serie local todavía no disponible con cobertura verificable.</div>';return}
 const w=800,h=190,p=20,min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
 const pts=records.map((x,i)=>{const v=Number(x[key]);if(!Number.isFinite(v))return null;return (p+i/(records.length-1)*(w-p*2)).toFixed(1)+","+(h-p-(v-min)/range*(h-p*2)).toFixed(1)}).filter(Boolean);
 el.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(label)+'"><line x1="'+p+'" y1="'+(h-p)+'" x2="'+(w-p)+'" y2="'+(h-p)+'"/><polyline points="'+pts.join(" ")+'"/><text x="'+p+'" y="16">'+esc(fmt(max))+' '+esc(unit)+'</text><text x="'+p+'" y="'+(h-2)+'">'+esc(fmt(min))+' '+esc(unit)+'</text></svg>';
}

async function init(){
 let forecast=null,history=null;
 try{forecast=await loadJSON("data/live/aic-forecast.json")}catch{}
 try{history=await loadJSON("data/live/historical-365.json")}catch{}
 try{stories=await loadJSON("data/historical-events.json")}catch{stories=[]}
 renderStories();

 if(forecast?.status==="ready"&&Array.isArray(forecast.forecast)){
   const cards=forecast.forecast.slice(0,5).map(day=>{const p=day.periods?.[0]||{};return '<article class="forecast-card"><span class="date">'+esc(day.day||day.date)+'</span><strong>'+esc(p.temperature??"—")+'°</strong><span class="sky">'+esc(p.sky||"Sin descripción")+'</span><div class="forecast-meta"><span>Viento '+esc(p.wind??"—")+' km/h</span><span>Ráfaga '+esc(p.gust??"—")+' km/h</span></div></article>'}).join("");
   $("#forecastCards").innerHTML=cards;
   $("#forecastSource").innerHTML='Fuente acreditada: Autoridad Interjurisdiccional de Cuencas (AIC) · obtenido '+esc(forecast.retrievedAt||"")+' · la ficha se consulta dentro de Ocarina Climática.';
   const first=forecast.forecast[0]?.periods?.[0];$("#forecastHeadline").textContent=first?.temperature!=null?first.temperature+" °C":"Disponible";$("#forecastSub").textContent=first?.sky||"Pronóstico AIC";
 }else{$("#forecastCards").innerHTML='<div class="truth-panel"><strong>Pronóstico no disponible</strong><p>El motor no inventa ni conserva un valor viejo como si fuera actual.</p></div>'}

 if(history?.status==="ready"&&Array.isArray(history.records)){
   $("#historyStatus").innerHTML="<strong>Serie local disponible</strong><p>"+esc(history.stationName||"Estación identificada")+" · "+history.records.length+" registros.</p>";
   const max=history.records.map(x=>Number(x.temperatureMax)).filter(Number.isFinite),min=history.records.map(x=>Number(x.temperatureMin)).filter(Number.isFinite);
   $("#historyMetrics").innerHTML=[["Máxima",max.length?fmt(Math.max(...max))+" °C":"—","observada"],["Mínima",min.length?fmt(Math.min(...min))+" °C":"—","observada"],["Heladas",min.filter(x=>x<=0).length,"mínima ≤ 0 °C"],["Calor",max.filter(x=>x>=35).length,"máxima ≥ 35 °C"],["Cobertura",history.records.length,"registros"]].map(x=>'<div class="metric"><span>'+x[0]+'</span><b>'+x[1]+'</b><small>'+x[2]+'</small></div>').join("");
   $("#historyCharts").innerHTML=[["temperatureMax","Máximas","°C"],["temperatureMin","Mínimas","°C"],["precipitation","Precipitación","mm"],["windSpeed","Viento","km/h"]].map((x,i)=>'<article class="chart-card"><h3>'+x[1]+'</h3><div id="chart'+i+'"></div></article>').join("");
   [["temperatureMax","Máximas","°C"],["temperatureMin","Mínimas","°C"],["precipitation","Precipitación","mm"],["windSpeed","Viento","km/h"]].forEach((x,i)=>drawChart($("#chart"+i),history.records,x[0],x[1],x[2]));
   $("#historyHeadline").textContent="365 días";$("#historySub").textContent="Serie local verificada";
 }else{
   $("#historyStatus").innerHTML="<strong>Serie local en verificación</strong><p>La fuente SMN está integrada al motor, pero la estación local todavía no está validada. Por eso no mostramos una serie ajena como si fuera Chañar.</p>";
   $("#historyMetrics").innerHTML='<div class="metric"><span>Estado</span><b>pendiente</b><small>identidad de estación</small></div>';
   $("#historyCharts").innerHTML='<article class="chart-card" style="grid-column:1/-1"><h3>La serie todavía no se publica</h3><div class="empty-chart">Cuando la estación quede verificada, estos gráficos se llenarán automáticamente. No antes.</div></article>';
   $("#historyHeadline").textContent="En verificación";$("#historySub").textContent="Sin sustitución silenciosa";
 }
 const searchInput=$("#searchInput");
 searchInput.addEventListener("input",()=>{const q=searchInput.value.trim().toLowerCase();const found=stories.filter(x=>(x.title+" "+x.summary+" "+x.type+" "+x.locality).toLowerCase().includes(q)).slice(0,8);$("#searchResults").innerHTML=q?found.map(x=>'<button class="search-item" data-story="'+esc(x.id)+'"><b>'+esc(x.title)+'</b><small>'+esc(x.dateLabel)+' · '+esc(x.evidence)+'</small></button>').join("")||'<p>Sin coincidencias en el archivo actual.</p>':''});
 $("#searchResults").addEventListener("click",e=>{const b=e.target.closest("[data-story]");if(!b)return;$("#searchModal").hidden=true;go("historias")});
 const lessons={tiempo:["Tiempo y clima","El tiempo describe lo que ocurre ahora o en períodos cortos. El clima necesita series largas y comparables. Una semana no alcanza para definir el clima de Chañar."],helada:["Helada","Una helada se estudia a partir de temperaturas y condiciones locales. El motor debe distinguir una medición de una advertencia o pronóstico."],lluvia:["Lluvia","La precipitación se mide y acumula con una metodología. Un dato estimado o de otra estación no se convierte en lluvia local por aparecer en un gráfico."],grafico:["Leer un gráfico","Primero mirá la fuente, el período y los vacíos. Después buscá máximos, mínimos y cambios. Un gráfico bonito nunca reemplaza la calidad del dato."]};
 $$(".learn-card").forEach(b=>b.addEventListener("click",()=>{const x=lessons[b.dataset.learn];$("#learnPanel").hidden=false;$("#learnPanel").innerHTML="<h3>"+esc(x[0])+"</h3><p>"+esc(x[1])+"</p>"}));
}
init();
go(location.hash.slice(1)||"ahora");
