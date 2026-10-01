/* V3.21 static contract QA */
const fs=require("fs");
const required=["index.html","data/release-3.21.js","data/trunk-design-system-v1.js","css/v3.21.css","js/experience-v3.21.js","docs/V3.21-TRONCO-60-40-PAGINA-CORTA.md"];
for(const p of required)if(!fs.existsSync(p))throw new Error("missing "+p);
const index=fs.readFileSync("index.html","utf8");
for(const x of ["css/v3.21.css","data/release-3.21.js","data/trunk-design-system-v1.js","data/source-registry-expanded.js","js/experience-v3.21.js"])if(!index.includes(x))throw new Error("not loaded "+x);
if(!index.includes('data-release="3.21"'))throw new Error("release tag missing");
const js=fs.readFileSync("js/experience-v3.21.js","utf8");
if(!js.includes("depth-on-demand")&&!js.includes("on-demand"))throw new Error("depth mode missing");
console.log("V3.21 QA OK");
