/* OCARINA CLIMÁTICA · REPARACIÓN ADITIVA DEL BUSCADOR
   No reemplaza core-engine.js. Se ejecuta después y corrige únicamente la capa de búsqueda.
*/
(function(){
  "use strict";
  const modal=document.getElementById("searchModal");
  const input=document.getElementById("searchInput");
  const results=document.getElementById("searchResults");
  const openButton=document.getElementById("searchButton");
  const closeButtons=document.querySelectorAll("[data-close-search]");
  if(!modal||!input||!results||!openButton)return;

  let records=[];
  let previousFocus=openButton;

  const normalize=(value)=>String(value??"")
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .toLowerCase().trim();

  const escapeHTML=(value)=>String(value??"").replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[c]));

  function forceClosed(){
    modal.hidden=true;
    modal.style.display="none";
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
  }

  function openSearch(){
    previousFocus=document.activeElement||openButton;
    modal.hidden=false;
    modal.style.display="grid";
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
    requestAnimationFrame(()=>input.focus());
  }

  function closeSearch(){
    forceClosed();
    if(previousFocus && typeof previousFocus.focus==="function")previousFocus.focus();
  }

  function resultCard(x){
    return '<button type="button" class="search-item" data-search-id="'+escapeHTML(x.id)+'">'+
      '<b>'+escapeHTML(x.title)+'</b>'+
      '<small>'+escapeHTML(x.dateLabel||"Sin fecha")+' · '+escapeHTML(x.evidence||"sin clasificar")+'</small>'+
      '<span>'+escapeHTML(x.summary||"")+'</span>'+
    '</button>';
  }

  function search(){
    const q=normalize(input.value);
    if(!q){
      results.innerHTML='<p>Escribí una palabra o fenómeno: <b>granizo</b>, <b>helada</b>, <b>viento</b>, <b>lluvia</b>…</p>';
      return;
    }
    const terms=q.split(/\s+/).filter(Boolean);
    const found=records.filter(x=>{
      const hay=normalize([
        x.title,x.summary,x.details,x.type,x.locality,x.evidence,
        x.dateLabel,x.year,x.sourceId
      ].join(" "));
      return terms.every(term=>hay.includes(term));
    }).slice(0,20);
    results.innerHTML=found.length
      ? '<p class="search-count">'+found.length+' resultado'+(found.length===1?"":"s")+'</p>'+found.map(resultCard).join("")
      : '<div class="truth-panel"><strong>No encontramos esa pieza.</strong><p>Probá con otra palabra. El buscador solo trabaja sobre el archivo real cargado por Ocarina Climática.</p></div>';
  }

  function openRecord(id){
    const record=records.find(x=>String(x.id)===String(id));
    if(!record)return;
    closeSearch();
    const all=document.querySelector('[data-story-filter="todos"]');
    if(all)all.click();
    if(typeof window.go==="function")window.go("historias");
    requestAnimationFrame(()=>{
      const cards=[...document.querySelectorAll(".story-card")];
      const card=cards.find(c=>normalize(c.querySelector("h3")?.textContent)===normalize(record.title));
      if(card){
        card.setAttribute("tabindex","-1");
        card.scrollIntoView({behavior:"smooth",block:"center"});
        card.focus({preventScroll:true});
        card.style.outline="3px solid currentColor";
        card.style.outlineOffset="5px";
        setTimeout(()=>{card.style.outline="";card.style.outlineOffset="";},2200);
      }
    });
  }

  // The original PL1 button remains intact; this listener makes its modal deterministic.
  openButton.addEventListener("click",()=>setTimeout(openSearch,0));
  closeButtons.forEach(button=>button.addEventListener("click",closeSearch));
  modal.addEventListener("click",event=>{
    if(event.target===modal)closeSearch();
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&!modal.hidden)closeSearch();
  });
  input.addEventListener("input",search);
  results.addEventListener("click",event=>{
    const button=event.target.closest("[data-search-id]");
    if(button)openRecord(button.dataset.searchId);
  });

  fetch("data/historical-events.json?v=search-"+Date.now(),{cache:"no-store"})
    .then(response=>response.ok?response.json():[])
    .then(data=>{
      records=Array.isArray(data)?data:[];
      if(input.value)search();
    })
    .catch(()=>{
      records=[];
      results.innerHTML='<div class="truth-panel"><strong>Archivo temporalmente no disponible.</strong><p>El buscador no inventa resultados cuando no puede cargar la fuente.</p></div>';
    });

  // Make the existing hidden attribute win over the .modal display rule.
  forceClosed();
  window.OCARINA_SEARCH_REPAIR={version:"1.1.0",close:closeSearch,open:openSearch};
})();