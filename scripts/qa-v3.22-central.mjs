// V3.22 · central console QA
import fs from "node:fs";
const index=fs.readFileSync("index.html","utf8");
const js=fs.readFileSync("js/v3.22-central.js","utf8");
const css=fs.readFileSync("css/v3.22-central.css","utf8");
for(const token of ["css/v3.22-central.css","js/v3.22-central.js"]) if(!index.includes(token)) throw new Error("Falta loader: "+token);
for(const token of [".v322-central",".v322-console",".v322-door",".v322-photo-strip"]) if(!css.includes(token)) throw new Error("Falta selector: "+token);
for(const token of ["LLUVIA","VIENTO","TEMPERATURA","AGUA","San Patricio del Chañar","NO ES FOTOGRAFÍA"]) if(!js.includes(token)) throw new Error("Falta contenido: "+token);
if(!js.includes('assets/visual/chanar-panorama.svg')) throw new Error("Falta representación local");
if(!js.includes('data-go="historial"')||!js.includes('data-go="pronostico"')) throw new Error("Faltan puertas conectadas");
console.log("V3.22 central console QA: OK");