// OCARINA CLIMÁTICA · motor de cronología
(function(){
  const events=window.CLIMATE_CHRONOLOGY||[];
  const sources=window.CLIMATE_CHRONOLOGY_SOURCES||[];
  const sourceMap=Object.fromEntries(sources.map(s=>[s.id,s]));
  const phenomenonLabel={
    crecida:"CRECIDA",inundacion:"INUNDACIÓN",granizo:"GRANIZO",nieve:"NIEVE",
    helada:"HELADA",tormenta:"TORMENTA",aluvion:"ALUVIÓN",lluvia:"LLUVIA",
    viento:"VIENTO",calor:"CALOR",frio:"FRÍO"
  };
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const list=document.querySelector("#climate-chronology");
  const filters=document.querySelector("#chronology-filters");
  const detail=document.querySelector("#chronology-detail");
  const count=document.querySelector("#chronology-count");
  if(!list)return;

  function render(items){
    if(count)count.textContent=items.length+" episodios documentados en esta base inicial";
    list.innerHTML=items.length?items.map((e,i)=>`<button class="chronology-item" type="button" data-index="${events.indexOf(e)}">
      <span class="chronology-year">${esc(e.year)}</span>
      <span class="chronology-line"></span>
      <span class="chronology-body">
        <small>${esc(phenomenonLabel[e.phenomenon]||e.phenomenon)} · ${esc(e.dateLabel)}</small>
        <strong>${esc(e.title)}</strong>
        <p>${esc(e.summary)}</p>
      </span>
    </button>`).join(""):"<div class=\"chronology-empty\">No hay episodios para este filtro.</div>";
  }
  function open(index){
    const e=events[index]; if(!e||!detail)return;
    const src=(e.sourceIds||[]).map(id=>sourceMap[id]).filter(Boolean);
    detail.hidden=false;
    detail.innerHTML=`<div class="chronology-detail-head">
      <span class="eyebrow">${esc(phenomenonLabel[e.phenomenon]||e.phenomenon)} · ${esc(e.dateLabel)}</span>
      <h3>${esc(e.title)}</h3>
      <p>${esc(e.summary)}</p>
    </div>
    <div class="chronology-meta">
      <span><b>Lugar</b>${esc(e.location)}</span>
      <span><b>Impacto</b>${esc(e.impact)}</span>
      <span><b>Evidencia</b>${esc(e.evidenceLevel)}</span>
      <span><b>Estado</b>${esc(e.confidence)}</span>
    </div>
    <div class="chronology-sources"><b>Fuentes</b>${src.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a>`).join("")}</div>`;
    detail.scrollIntoView({behavior:"smooth",block:"nearest"});
  }
  render(events);
  list.addEventListener("click",e=>{const item=e.target.closest("[data-index]");if(item)open(Number(item.dataset.index));});
  if(filters){
    filters.addEventListener("click",e=>{
      const b=e.target.closest("[data-filter]"); if(!b)return;
      filters.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));
      const f=b.dataset.filter;
      render(f==="todos"?events:events.filter(x=>x.phenomenon===f));
    });
  }
  window.OcarinaChronology={events,render,open};
})();