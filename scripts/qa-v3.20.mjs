// V3.20 static contract checks
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
const index=read("index.html"), css=read("css/v3.20.css"), js=read("js/experience-v3.20.js"), law=read("data/single-place-law.js");
const must=[
 ["release",index.includes("data/release-3.20.js")],
 ["law",index.includes("data/single-place-law.js")&&law.includes("Todo lo necesario")],
 ["visual-library",index.includes("data/visual-library-v1.js")],
 ["visual-css",index.includes("css/v3.20.css")],
 ["experience-js",index.includes("js/experience-v3.20.js")],
 ["five-doors",(index.match(/data-go="(ahora|pronostico|historial|historias|aprender)"/g)||[]).length>=5],
 ["visual-assets",["wind","water","frost","hail","sky"].every(x=>index.includes('data-visual="'+x+'"'))],
 ["local-visual-assets",["wind","water","frost","hail","sky"].every(x=>fs.existsSync("assets/visual/"+x+".svg"))],
 ["no-story-external-link",!js.includes("target=\"_blank\"")],
 ["responsive-breakpoint",css.includes("@media(max-width:700px)")&&css.includes("@media(max-width:420px)")],
 ["reduced-motion",css.includes("prefers-reduced-motion")],
 ["focus",css.includes("focus-visible")],
 ["lazy-images",index.includes('loading="lazy"')]
];
let bad=must.filter(x=>!x[1]).map(x=>x[0]);
if(bad.length) throw new Error("V3.20 QA failed: "+bad.join(", "));
console.log("V3.20 QA PASS",must.length+" checks");
