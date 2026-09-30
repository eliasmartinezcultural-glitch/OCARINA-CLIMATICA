import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const errors=[];
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);const dup=ids.filter((id,i)=>ids.indexOf(id)!==i);if(dup.length)errors.push('IDs duplicados: '+[...new Set(dup)].join(', '));
const nav=[...html.matchAll(/<nav[^>]*id=["']main-nav["'][\s\S]*?<\/nav>/g)][0]?.[0]||'';const links=[...nav.matchAll(/href=["']#([^"']+)["']/g)].map(m=>m[1]);if(links.length!==5)errors.push('La navegación principal debe tener exactamente 5 puertas; tiene '+links.length);
for(const id of links)if(!html.includes('id="'+id+'"')&&!html.includes("id='"+id+"'"))errors.push('Destino de navegación ausente: '+id);
const scripts=[...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(m=>m[1]).filter(x=>x.endsWith('.js'));for(const rel of scripts){const file=path.join(root,rel);if(!fs.existsSync(file))errors.push('Script ausente: '+rel);else{const code=fs.readFileSync(file,'utf8');try{new Function(code)}catch(e){errors.push('JS inválido '+rel+': '+e.message)}}}
if(!html.includes('aria-expanded="false"'))errors.push('Falta estado ARIA inicial del menú');
if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log('QA OK · '+scripts.length+' scripts · '+links.length+' herramientas principales');
