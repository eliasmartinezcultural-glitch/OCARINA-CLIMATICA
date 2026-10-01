#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html");
const css=read("css/v3.18.css");
const js=read("js/visual-interaction-v3.18.js");

const checks=[
  ["V3.18 CSS loaded",html.includes('css/v3.18.css')],
  ["V3.18 JS loaded",html.includes('js/visual-interaction-v3.18.js')],
  ["V3.18 release loaded",html.includes('data/release-3.18.js')],
  ["five public doors",["ahora","pronostico","historial","historias","aprender"].every(x=>html.includes('data-go="'+x+'"'))],
  ["no horizontal core layout",!css.includes("overflow-x:hidden")],
  ["reduced motion",css.includes("prefers-reduced-motion:reduce")],
  ["coarse pointer support",css.includes("hover:none")],
  ["fine pointer guarded",js.includes('hover:hover') && js.includes('pointer:fine')],
  ["pointer events",js.includes("pointermove")],
  ["visible focus",css.includes("focus-visible")],
  ["mobile breakpoint",css.includes("max-width:620px")],
  ["medium breakpoint",css.includes("max-width:900px")],
  ["visual release marker",html.includes('data-release="3.18"')]
];

let failed=0;
for(const [name,ok] of checks){
  console.log((ok?"PASS ":"FAIL ")+name);
  if(!ok)failed++;
}
if(failed)process.exit(1);
console.log("V3.18 QA static: PASS");
