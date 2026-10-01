/* OCARINA CLIMÁTICA · V3.17 · CAPA TRANSVERSAL DE INTEGRIDAD */
(function(){
  "use strict";
  const RELEASE=window.OCARINA_RELEASE||{version:"3.17"};
  const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
  document.documentElement.dataset.ocarinaVersion=RELEASE.version;

  function syncModal(){
    const modal=qs("#searchModal"); if(!modal)return;
    const open=!modal.hidden;
    modal.setAttribute("aria-hidden",String(!open));
    document.body.classList.toggle("ocarina-modal-open",open);
    const box=modal.querySelector('[role="dialog"]');
    if(box)box.setAttribute("aria-describedby","searchResults");
  }
  function focusable(container){
    return qsa("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])")
      .filter(el=>container.contains(el)&&el.offsetParent!==null);
  }
  document.addEventListener("keydown",event=>{
    const modal=qs("#searchModal"); if(!modal||modal.hidden||event.key!=="Tab")return;
    const items=focusable(modal); if(!items.length)return;
    const first=items[0],last=items[items.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  document.addEventListener("click",event=>{
    const menu=qs("#quickMenu"),button=qs("#menuButton");
    if(menu&&!menu.hidden&&!menu.contains(event.target)&&button&&!button.contains(event.target)){
      menu.hidden=true; button.setAttribute("aria-expanded","false");
    }
    const opener=event.target.closest?.("[data-open-evidence]");
    if(opener)requestAnimationFrame(()=>{const close=qs("#drawerClose");if(close)close.focus();});
  },true);
  document.addEventListener("focusin",event=>{
    const nav=qs(".bottom-nav");
    if(nav&&nav.contains(event.target))event.target.scrollIntoView({block:"nearest",inline:"nearest"});
    syncModal();
  });
  const modal=qs("#searchModal");
  if(modal)new MutationObserver(syncModal).observe(modal,{attributes:true,attributeFilter:["hidden","style"]});
  qsa("[data-story-filter]").forEach(button=>{
    button.setAttribute("aria-pressed",button.classList.contains("active")?"true":"false");
    button.addEventListener("click",()=>{
      qsa("[data-story-filter]").forEach(b=>b.setAttribute("aria-pressed",b.classList.contains("active")?"true":"false"));
    });
  });
  const input=qs("#searchInput");
  if(input){input.setAttribute("aria-label","Buscar en el archivo climático");input.setAttribute("aria-controls","searchResults");}
  const results=qs("#searchResults");
  if(results){results.setAttribute("aria-live","polite");results.setAttribute("aria-atomic","true");}
  const app=qs(".app-shell");if(app)app.dataset.release=RELEASE.version;
  syncModal();
  window.OCARINA_RUNTIME={version:RELEASE.version,status:"active",syncModal};
})();
