// V3.23 · central-first QA
import fs from "node:fs";
const index=fs.readFileSync("index.html","utf8");
const js=fs.readFileSync("js/v3.23-central-repair.js","utf8");
const css=fs.readFileSync("css/v3.23-central-repair.css","utf8");
for(const token of ["css/v3.23-central-repair.css","js/v3.23-central-repair.js","data/release-3.23.js"]) if(!index.includes(token)) throw new Error("Falta loader: "+token);
for(const token of [".v323-central",".v323-hero",".v323-door",".v323-local-evidence"]) if(!css.includes(token)) throw new Error("Falta selector: "+token);
for(const token of ["San Patricio del Chañar","Lluvia","Viento","Temperatura","Agua + tierra","NO ES FOTOGRAFÍA"]) if(!js.includes(token)) throw new Error("Falta contenido: "+token);
if(js.includes("v322-central")) throw new Error("La versión 3.22 no debe ser cargada por el motor nuevo");
if(!js.includes("legacyWorld")) throw new Error("No existe limpieza de la capa visual heredada");
console.log("V3.23 central-first QA: OK");
