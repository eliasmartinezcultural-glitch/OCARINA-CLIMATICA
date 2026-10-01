/* OCARINA CLIMÁTICA · V3.18 · INTERACTION CLEAN LAYER */
(function(){
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.dataset.ocarinaVisual="3.18";

  function animateView(view){
    if(reduce)return;
    view.classList.remove("view-enter");
    void view.offsetWidth;
    view.classList.add("view-enter");
  }

  const originalGo=window.go;
  if(typeof originalGo==="function"){
    window.go=function(view){
      originalGo(view);
      requestAnimationFrame(()=>animateView($('[data-view="'+view+'"]')));
    };
  }

  // Keyboard-friendly quick menu.
  const menu=$("#quickMenu"), menuButton=$("#menuButton");
  if(menu&&menuButton){
    menu.addEventListener("keydown",e=>{
      if(e.key==="Escape"){
        menu.hidden=true;
        menuButton.setAttribute("aria-expanded","false");
        menuButton.focus();
      }
    });
  }

  // Give every primary card a clear accessible action name without adding visual noise.
  $$(".focus-card[data-go],.learn-card[data-learn]").forEach(card=>{
    if(!card.getAttribute("aria-label")){
      const title=card.querySelector("strong")?.textContent?.trim();
      if(title)card.setAttribute("aria-label",title);
    }
  });

  // Pointer feedback is subtle and disabled for coarse pointers/reduced motion.
  if(!reduce && matchMedia("(hover:hover) and (pointer:fine)").matches){
    $$(".focus-card,.learn-card").forEach(card=>{
      card.addEventListener("pointermove",e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        card.style.transform="perspective(700px) rotateX("+(-y*2)+"deg) rotateY("+(x*2)+"deg) translateY(-3px)";
      });
      card.addEventListener("pointerleave",()=>{card.style.transform=""});
    });
  }

  // Native pointer model: no mouse-only dependency.
  $$(".chip,.question-strip button,.bottom-nav button").forEach(control=>{
    control.addEventListener("pointerdown",()=>control.dataset.pointerActive="true");
    control.addEventListener("pointerup",()=>delete control.dataset.pointerActive);
    control.addEventListener("pointercancel",()=>delete control.dataset.pointerActive);
  });

  window.OCARINA_VISUAL_318={version:"3.18",status:"active",principle:"simple-front-deep-back"};
})();
