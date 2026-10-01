import fs from "node:fs";
import path from "node:path";
const root=process.cwd(),errors=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html");
for(const required of ['data-release="3.17"','css/v3.17.css','js/runtime-integrity-v3.17.js','js/search-repair.js'])if(!html.includes(required))errors.push("Falta integración V3.17: "+required);
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]),dup=ids.filter((id,i)=>ids.indexOf(id)!==i);
if(dup.length)errors.push("IDs duplicados: "+[...new Set(dup)].join(", "));
const unique=[...new Set([...html.matchAll(/data-go=["']([^"']+)["']/g)].map(m=>m[1]))];
if(unique.length!==5)errors.push("Las puertas públicas deben ser exactamente 5: "+unique.join(", "));
for(const id of ["ahora","pronostico","historial","historias","aprender"])if(!html.includes('data-view="'+id+'"'))errors.push("Vista ausente: "+id);
for(const script of ["js/core-engine.js","js/search-repair.js","js/runtime-integrity-v3.17.js"]){try{new Function(read(script))}catch(error){errors.push("JS inválido "+script+": "+error.message)}}
if(!read("data/release-3.17.js").includes('version:"3.17"'))errors.push("Release metadata incorrecta");
const snapshotDir=path.join(root,"data/live");
for(const file of fs.readdirSync(snapshotDir).filter(x=>x.endsWith(".json"))){const data=JSON.parse(fs.readFileSync(path.join(snapshotDir,file),"utf8"));if(typeof data.status!=="string")errors.push(file+": falta status");if(!["source","sourceUrl","sourceId","provider"].some(k=>data[k]))errors.push(file+": falta procedencia");if(data.status==="ready"&&!data.retrievedAt&&!data.observedAt)errors.push(file+": ready sin timestamp");}
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("V3.17 QA OK · estructura, release, scripts y snapshots");
