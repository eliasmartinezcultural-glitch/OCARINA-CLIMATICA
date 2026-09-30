const climateDoors=[{label:"TEMPERATURA",title:"Explorar el calor y el frío",text:"Máximas, mínimas, medias, amplitud y evolución."},{label:"LLUVIA",title:"Seguir el agua",text:"Precipitación, períodos secos y registros."},{label:"VIENTO",title:"Entender nuestro viento",text:"Dirección, intensidad, ráfagas y memoria."},{label:"HELADAS",title:"Cuando llega el frío",text:"Fechas, intensidad y relación con el territorio."},{label:"EXTREMOS",title:"Los días excepcionales",text:"Eventos documentados, con fecha y fuente."},{label:"CIELO",title:"Mirar hacia arriba",text:"Nubes, luz, tormentas y fotografías."},{label:"COMPARAR",title:"Poner años frente a frente",text:"Una futura herramienta para explorar series."},{label:"CURIOSIDADES",title:"Seguir una pregunta",text:"Pequeños descubrimientos que abren historias."}];

const explore=document.querySelector("#explore-grid");
explore.innerHTML=climateDoors.map((d,i)=>`<a class="explore-card" href="#archivo" data-door="${i}"><span>${d.label}</span><h3>${d.title}</h3><p>${d.text}</p></a>`).join("");

const toggle=document.querySelector(".menu-toggle");
const nav=document.querySelector("#main-nav");
toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
nav.addEventListener("click",e=>{if(e.target.matches("a")){nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");}});

document.querySelector("#memoryPrompt").addEventListener("click",()=>alert("Próximamente: formulario para guardar recuerdos climáticos de San Patricio del Chañar, con fecha, lugar, autor y consentimiento."));

document.querySelectorAll("[data-door]").forEach(card=>card.addEventListener("click",()=>console.info("Puerta de exploración:",card.dataset.door)));

console.info("OCARINA CLIMÁTICA V0.1.0 · motor inicial cargado");