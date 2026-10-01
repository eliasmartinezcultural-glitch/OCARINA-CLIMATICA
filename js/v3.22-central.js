/* V3.22 · CENTRAL CLIMATE CONSOLE */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const home=$("#view-ahora"), strip=home?.querySelector(".focus-grid");
if(!home||!strip)return;
const wrap=document.createElement("section");wrap.className="v322-central";wrap.setAttribute("aria-label","Central climática de San Patricio del Chañar");
wrap.innerHTML=`
<div class="v322-console">
<figure class="v322-place">
<img src="assets/visual/chanar-panorama.svg" width="1600" height="900" alt="Representación gráfica del valle de San Patricio del Chañar: río, chacras, cortinas forestales, bardas y localidad">
<span class="v322-place-credit">REPRESENTACIÓN GRÁFICA · NO ES FOTOGRAFÍA</span>
<figcaption class="v322-place-copy"><span class="eyebrow">SAN PATRICIO DEL CHAÑAR · CENTRAL</span><h2>El clima dentro del lugar.</h2><p>Cuatro puertas para entrar al dato, al fenómeno, al agua y al territorio. La portada orienta; la profundidad aparece cuando la pedís.</p></figcaption>
</figure>
<div class="v322-doors">
<button class="v322-door rain" data-go="historial"><span class="v322-door-icon">⌁</span><span class="v322-state pending"><i></i> LLUVIA · ESTADO DE DATOS</span><b id="v322Rain">En verificación</b><small>Entrá a la serie, acumulados, vacíos y método.</small><span class="v322-spark" aria-hidden="true"><svg viewBox="0 0 120 34"><polyline points="0,28 18,28 28,18 42,27 55,8 69,26 83,19 98,27 120,12"/></svg></span></button>
<button class="v322-door wind" data-go="pronostico"><span class="v322-door-icon">≈</span><span class="v322-state forecast"><i></i> VIENTO · PRONÓSTICO</span><b id="v322Wind">—</b><small>Velocidad y ráfaga previstas. Nunca mezcladas con observación.</small><span class="v322-spark" aria-hidden="true"><svg viewBox="0 0 120 34"><polyline points="0,24 15,22 28,25 40,10 55,20 70,14 85,19 100,8 120,13"/></svg></span></button>
<button class="v322-door temp" data-go="pronostico"><span class="v322-door-icon">°</span><span class="v322-state forecast"><i></i> TEMPERATURA · PRONÓSTICO</span><b id="v322Temp">—</b><small>Estado esperado y evolución. Tocá para ver el horizonte.</small><span class="v322-spark" aria-hidden="true"><svg viewBox="0 0 120 34"><polyline points="0,25 16,23 30,18 44,20 57,10 71,17 86,9 101,14 120,5"/></svg></span></button>
<button class="v322-door water" data-go="historias"><span class="v322-door-icon">◒</span><span class="v322-state observed"><i></i> AGUA · TERRITORIO</span><b id="v322Water">Chañar</b><small>Río, riego y paisaje. El agua conecta el clima con el territorio.</small><span class="v322-spark" aria-hidden="true"><svg viewBox="0 0 120 34"><polyline points="0,18 18,21 32,16 48,20 64,14 80,18 97,13 120,17"/></svg></span></button>
</div></div>
<div class="v322-photo-strip" aria-label="Representación visual del territorio">
<figure class="v322-photo"><div class="v322-photo-placeholder"><div><b>Chacras + río</b><small>Espacio reservado para fotografía local real con procedencia y fecha.</small></div></div><figcaption>FOTO LOCAL · incorporación con archivo Ocarina</figcaption></figure>
<figure class="v322-photo"><div class="v322-photo-placeholder"><div><b>Bardas + cielo</b><small>La imagen deberá corresponder realmente a San Patricio del Chañar.</small></div></div><figcaption>NO SE USA IMAGEN DE OTRA LOCALIDAD</figcaption></figure>
<figure class="v322-photo"><div class="v322-photo-placeholder"><div><b>Río Neuquén</b><small>Fotografía o documento con crédito y derechos visibles dentro del proyecto.</small></div></div><figcaption>PROCEDENCIA · DERECHOS · FECHA</figcaption></figure>
</div>
<div class="v322-route" aria-label="Ruta de profundidad"><span>mirar</span><b>→</b><span>tocar</span><b>→</b><span>entrar</span><b>→</b><span>profundizar</span></div>`;
strip.hidden=true;strip.setAttribute("aria-hidden","true");
const q=home.querySelector(".question-strip");home.insertBefore(wrap,q);
const go=(v)=>{const b=document.querySelector('.bottom-nav [data-go="'+v+'"]');if(b)b.click()};
wrap.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
async function load(p){try{const r=await fetch(p+"?v=322",{cache:"no-store"});return r.ok?r.json():null}catch{return null}}
(async()=>{
 const f=await load("data/live/aic-forecast.json"), h=await load("data/live/historical-365.json");
 const p=f?.status==="ready"?f.forecast?.[0]?.periods?.[0]:null;
 if(p){
   $("#v322Temp").textContent=(p.temperature!=null?p.temperature+" °C":"Disponible");
   $("#v322Wind").textContent=p.wind!=null?p.wind+" km/h":"Disponible";
 }
 if(h?.status==="ready"){$("#v322Rain").textContent="Serie disponible";$(".v322-door.rain .v322-state").className="v322-state observed"}
})();
window.OCARINA_CENTRAL_322=Object.freeze({version:"3.22",front:"compressed-central",doors:["rain","wind","temperature","water"],depth:"door-driven",locality:"San Patricio del Chañar"});
})();