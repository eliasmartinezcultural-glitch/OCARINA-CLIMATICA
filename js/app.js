// OCARINA CLIMÁTICA · experiencia general V2
(function(){
 const explore=document.querySelector('#explore-grid'),panel=document.querySelector('#explore-detail'),doors=window.CLIMATE_EXPLORER||[];
 if(explore&&!explore.dataset.ready){explore.dataset.ready='1';explore.innerHTML=doors.map((d,i)=>'<button class="explore-card" type="button" data-door="'+i+'"><span>'+escapeHtml(d.label)+'</span><h3>'+escapeHtml(d.title)+'</h3><p>'+escapeHtml(d.text)+'</p></button>').join('');explore.addEventListener('click',e=>{const card=e.target.closest('[data-door]');if(card)openClimateDoor(doors[Number(card.dataset.door)])});}
 function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function openClimateDoor(d){if(!panel||!d)return;panel.hidden=false;panel.innerHTML='<div><span class="eyebrow">'+escapeHtml(d.label)+'</span><h3>'+escapeHtml(d.title)+'</h3><p>'+escapeHtml(d.text)+'</p><small>Motor: '+escapeHtml(d.module)+' · Estado: '+escapeHtml(d.status)+'</small></div>';window.OcarinaUX?.scrollTo(panel);}
 window.openClimateDoor=openClimateDoor;
 const memory=document.querySelector('#memoryPrompt');if(memory&&!memory.dataset.ready){memory.dataset.ready='1';memory.addEventListener('click',()=>{const detail=document.querySelector('#memoria');if(detail)detail.setAttribute('data-memory-status','coming-soon');alert('La memoria climática todavía no recibe envíos. La interfaz se habilitará cuando exista almacenamiento y consentimiento seguros.');});}
})();
