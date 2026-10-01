/* OCARINA CLIMÁTICA · V3.20 · DEEP CONNECTION LAYER */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const library=window.OCARINA_VISUAL_LIBRARY||[];
document.documentElement.dataset.ocarinaExperience="3.20";
function makeDialog(item){
 let d=$(".v320-visual-dialog");
 if(!d){d=document.createElement("div");d.className="v320-visual-dialog";d.hidden=true;d.innerHTML='<div class="v320-visual-box" role="dialog" aria-modal="true" aria-labelledby="v320VisualTitle"><button class="v320-close" type="button" aria-label="Cerrar recurso visual">×</button><img id="v320VisualImage" width="1200" height="700" alt=""><div class="v320-visual-copy"><h2 id="v320VisualTitle"></h2><p id="v320VisualText"></p><div class="v320-credit" id="v320VisualCredit"></div></div></div>';document.body.appendChild(d);
 const close=()=>{d.hidden=true;document.body.style.overflow="";};
 $(".v320-close",d).addEventListener("click",close);d.addEventListener("click",e=>{if(e.target===d)close()});d.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
 }
 const img=$("#v320VisualImage",d),title=$("#v320VisualTitle",d),text=$("#v320VisualText",d),credit=$("#v320VisualCredit",d);
 img.src=item.asset;img.alt="Ilustración interna: "+item.title;title.textContent=item.title;
 text.textContent="Recurso visual integrado en Ocarina Climática. Sirve para orientar y explorar; no representa una fotografía ni una medición meteorológica.";
 credit.innerHTML="<span>"+item.evidence+"</span><span>"+item.credit+"</span><span>contenido dentro del proyecto</span>";
 d.hidden=false;document.body.style.overflow="hidden";$(".v320-close",d).focus();
}
$$("[data-visual]").forEach(btn=>btn.addEventListener("click",()=>{const item=library.find(x=>x.id===btn.dataset.visual);if(item)makeDialog(item)}));
// Convert source links into internal provenance cards. The user sees the credit, never needs to leave the experience.
$$(".story-card").forEach(card=>{
 const link=$("a",card);if(!link)return;
 const text=(link.textContent||"").trim();link.setAttribute("aria-hidden","true");link.tabIndex=-1;
 const box=document.createElement("div");box.className="v320-source-credit";
 box.innerHTML="<b>Fuente acreditada:</b> "+(text==="Abrir fuente"?"registro documental":"fuente")+" · <span>detalle de procedencia conservado en el proyecto</span>";
 link.replaceWith(box);
});
// Make the five-door system feel like one connected place.
$$(".focus-card[data-go]").forEach(card=>card.dataset.connected="true");
window.OCARINA_EXPERIENCE_320={version:"3.20",status:"active",law:"single-place",visuals:library.length,principle:"everything-inside"};
})();