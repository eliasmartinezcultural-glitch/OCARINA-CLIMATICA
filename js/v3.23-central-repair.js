/* OCARINA CLIMÁTICA · V3.23 · CENTRAL REPAIR */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), esc=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
const home=$("#view-ahora"); if(!home)return;

/* Remove the previous injected central if the file is hot-reloaded. */
home.querySelectorAll(".v322-central,.v323-central").forEach(x=>x.remove());

/* The previous front was useful as an information architecture draft, but it was too repetitive.
   V3.23 keeps its data destinations and moves the command center to the first screen. */
[".hero-compact",".now-command",".focus-grid",".v320-world"].forEach(sel=>{
  const n=home.querySelector(sel); if(n)n.hidden=true;
});

const central=document.createElement("section");
central.className="v323-central";
central.setAttribute("aria-label","Central climática de San Patricio del Chañar");
central.innerHTML=`
<div class="v323-shell">
  <figure class="v323-hero">
    <img src="assets/visual/chanar-panorama.svg" width="1600" height="900" alt="Representación gráfica del valle de San Patricio del Chañar con río, chacras, arbolado, bardas y localidad">
    <span class="v323-credit">REPRESENTACIÓN LOCAL · NO ES FOTOGRAFÍA</span>
    <figcaption class="v323-hero-copy">
      <span class="eyebrow">SAN PATRICIO DEL CHAÑAR · CENTRAL CLIMÁTICA</span>
      <h2>El clima está<br><em>dentro del paisaje.</em></h2>
      <p>Una entrada corta para mirar qué pasa. Cuatro puertas para entrar después en datos, viento, temperatura, agua y territorio.</p>
      <div class="v323-proof"><span>FUENTE</span><span>FECHA</span><span>LUGAR</span><span>EVIDENCIA</span></div>
    </figcaption>
  </figure>

  <div class="v323-doors">
    <button class="v323-door rain" data-go="historial" aria-label="Abrir lluvia y archivo climático">
      <div class="v323-door-top"><span class="v323-icon">⌁</span><span class="v323-state pending"><i></i> DATO LOCAL</span></div>
      <h3>Lluvia</h3><p>Acumulados, días de lluvia, vacíos y método de medición.</p>
      <div class="v323-door-data"><b id="v323Rain">En verificación</b> · serie local</div>
      <span class="v323-mini-chart" aria-hidden="true"><svg viewBox="0 0 100 40"><polyline points="0,31 14,30 25,20 38,29 50,8 63,27 76,18 87,29 100,11"/></svg></span>
    </button>

    <button class="v323-door wind" data-go="pronostico" aria-label="Abrir viento y pronóstico">
      <div class="v323-door-top"><span class="v323-icon">≈</span><span class="v323-state pending"><i></i> PRONÓSTICO</span></div>
      <h3>Viento</h3><p>Velocidad, dirección y ráfagas. Pronóstico separado de observación.</p>
      <div class="v323-door-data"><b id="v323Wind">Sin dato</b> · AIC</div>
      <span class="v323-mini-chart" aria-hidden="true"><svg viewBox="0 0 100 40"><polyline points="0,26 14,22 26,27 39,12 52,21 66,16 78,20 89,9 100,13"/></svg></span>
    </button>

    <button class="v323-door temp" data-go="pronostico" aria-label="Abrir temperatura y pronóstico">
      <div class="v323-door-top"><span class="v323-icon">°</span><span class="v323-state pending"><i></i> PRONÓSTICO</span></div>
      <h3>Temperatura</h3><p>Qué se espera, cómo evoluciona y cómo leer máximas y mínimas.</p>
      <div class="v323-door-data"><b id="v323Temp">Sin dato</b> · AIC</div>
      <span class="v323-mini-chart" aria-hidden="true"><svg viewBox="0 0 100 40"><polyline points="0,28 14,24 27,22 40,23 53,13 66,18 79,10 91,14 100,6"/></svg></span>
    </button>

    <button class="v323-door water" data-go="historias" aria-label="Abrir agua y territorio">
      <div class="v323-door-top"><span class="v323-icon">◒</span><span class="v323-state ready"><i></i> TERRITORIO</span></div>
      <h3>Agua + tierra</h3><p>Río, riego, chacras y paisaje: donde el clima se vuelve territorio.</p>
      <div class="v323-door-data"><b>Chañar</b> · memoria local</div>
      <span class="v323-mini-chart" aria-hidden="true"><svg viewBox="0 0 100 40"><polyline points="0,19 13,22 25,16 39,21 51,14 64,19 78,12 90,17 100,14"/></svg></span>
    </button>
  </div>
</div>

<div class="v323-route" aria-label="Ruta de exploración">
  <button data-go="ahora">AHORA</button><button data-go="pronostico">QUÉ VIENE</button><button data-go="historial">CÓMO ESTUVO</button><button data-go="historias">QUÉ PASÓ</button>
</div>

<div class="v323-local-evidence" aria-label="Territorio visual">
  <figure class="v323-evidence-card"><div class="v323-placeholder"><div><b>Chacras + río</b><small>Fotografía local real, con fecha, autoría y procedencia.</small></div></div><figcaption><b>El agua dibuja el territorio.</b> La imagen debe ser de Chañar.</figcaption></figure>
  <figure class="v323-evidence-card"><div class="v323-placeholder"><div><b>Bardas + cielo</b><small>Archivo visual propio o material reutilizable con licencia clara.</small></div></div><figcaption><b>Cielo abierto.</b> Observación visual.</figcaption></figure>
  <figure class="v323-evidence-card"><div class="v323-placeholder"><div><b>Chacra + viento</b><small>Registro Ocarina con fecha y ubicación.</small></div></div><figcaption><b>El viento también cuenta.</b> Memoria del paisaje.</figcaption></figure>
</div>

<div class="v323-note"><b>Regla local:</b> si no podemos demostrar que una imagen, medición o episodio corresponde a San Patricio del Chañar, no lo presentamos como propio.</div>
`;
const oldQ=home.querySelector(".question-strip");
home.insertBefore(central,oldQ||null);

const go=v=>{const b=document.querySelector('.bottom-nav [data-go="'+v+'"]');if(b)b.click()};
central.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));

async function load(path){try{const r=await fetch(path+"?v=323",{cache:"no-store"});return r.ok?r.json():null}catch{return null}}
(async()=>{
 const f=await load("data/live/aic-forecast.json");
 const h=await load("data/live/historical-365.json");
 const fp=f?.status==="ready"?f.forecast?.[0]?.periods?.[0]:null;
 if(fp){
   $("#v323Temp").textContent=fp.temperature!=null?fp.temperature+" °C":"Disponible";
   $("#v323Wind").textContent=fp.wind!=null?fp.wind+" km/h":"Disponible";
   central.querySelectorAll(".v323-state.pending").forEach(x=>x.classList.add("ready"));
 }else{
   $("#v323Temp").textContent="Sin pronóstico";
   $("#v323Wind").textContent="Sin pronóstico";
 }
 if(h?.status==="ready"){
   $("#v323Rain").textContent="Serie disponible";
   const s=$("#v323Rain").closest(".v323-door").querySelector(".v323-state");
   s.classList.remove("pending");s.classList.add("ready");
 }else $("#v323Rain").textContent="En verificación";
})();

window.OCARINA_CENTRAL_323=Object.freeze({
 version:"3.23",
 principle:"one-dominant-composition-four-doors",
 front:"compressed",
 depth:"on-demand",
 locality:"San Patricio del Chañar"
});
})();