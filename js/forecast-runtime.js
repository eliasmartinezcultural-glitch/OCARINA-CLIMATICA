(function(){
const url="data/live/aic-forecast.json?ts="+Date.now();
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
async function load(){const box=document.getElementById("forecast-grid"),meta=document.getElementById("forecast-meta");if(!box)return;
 try{const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);const d=await r.json();
 if(d.status!=="ready"||!Array.isArray(d.forecast)||!d.forecast.length)throw new Error("sin datos");
 box.innerHTML=d.forecast.map(day=>{const p=day.periods||[];const first=p[0]||{};const second=p[1]||{};return '<article class="forecast-card"><div><span>'+esc(day.day)+'</span><strong>'+esc(first.temperature)+'°</strong><small>'+esc(first.sky||"")+'</small></div><div class="forecast-row"><span>DÍA · '+esc(first.wind)+' km/h</span><span>RÁF. '+esc(first.gust)+' km/h</span></div><div class="forecast-row"><span>'+esc(first.direction)+' · '+esc(first.pressure)+' hPa</span><span>'+(second.temperature!=null?"NOCHE · "+esc(second.temperature)+"°":"")+'</span></div></article>'}).join("");
 if(meta)meta.innerHTML='Fuente <strong>AIC · El Chañar</strong> · actualización '+new Date(d.retrievedAt).toLocaleString("es-AR")+' · <a href="'+esc(d.sourceUrl)+'" target="_blank" rel="noopener">fuente original</a>';
 }catch(e){box.innerHTML='<article class="forecast-card forecast-empty"><strong>Pronóstico temporalmente no disponible</strong><p>El sistema conserva el último estado válido y no inventa valores.</p></article>';if(meta)meta.textContent="Fuente AIC · sin actualización disponible."}
}
document.addEventListener("DOMContentLoaded",load,{once:true});
})();