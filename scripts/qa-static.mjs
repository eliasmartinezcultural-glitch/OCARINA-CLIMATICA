import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const errors = [];
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
if (duplicates.length) errors.push('IDs duplicados: ' + [...new Set(duplicates)].join(', '));

const isSimplifiedWeatherPage =
  html.includes('id="temperature"') &&
  html.includes('id="hourly"') &&
  html.includes('id="days"');

if (isSimplifiedWeatherPage) {
  const requiredIds = [
    'updated', 'coordinates', 'refresh', 'temperature', 'condition',
    'currentIcon', 'feels', 'humidity', 'wind', 'gust', 'precip',
    'hourly', 'days', 'error'
  ];
  for (const id of requiredIds) {
    if (!ids.includes(id)) errors.push('Falta elemento requerido: #' + id);
  }
  if (!html.includes('https://api.open-meteo.com/v1/forecast')) {
    errors.push('No se encontró la API de pronóstico Open-Meteo');
  }
  if (!html.includes('setInterval(update,30*60*1000)')) {
    errors.push('No se encontró la actualización automática cada 30 minutos');
  }
  if (!html.includes('./data/live/open-meteo.json')) errors.push('No se encontró el respaldo publicado Open-Meteo');
  if (!html.includes('mode: \'snapshot\'')) errors.push('No se encontró el modo de recuperación por snapshot');
  if (!html.includes("addEventListener('click',update)")) {
    errors.push('El botón de actualización manual no está conectado');
  }
  if (!html.includes('America%2FArgentina%2FCordoba')) {
    errors.push('No se configuró la zona horaria local');
  }
} else {
  // Contrato anterior, conservado para la versión modular histórica.
  const nav = [...html.matchAll(/<nav[^>]*class=["'][^"']*bottom-nav[^"']*["'][^>]*>[\s\S]*?<\/nav>/g)][0]?.[0] || '';
  const links = [...nav.matchAll(/data-go=["']([^"']+)["']/g)].map(m => m[1]);
  if (links.length !== 5) errors.push('La navegación principal debe tener exactamente 5 puertas; tiene ' + links.length);
  for (const id of links) {
    if (!html.includes('id="' + id + '"') && !html.includes("id='" + id + "'")) {
      errors.push('Destino de navegación ausente: ' + id);
    }
  }
  if (!html.includes('aria-expanded="false"')) errors.push('Falta estado ARIA inicial del menú');
}

const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+.js)["']/g)].map(m => m[1]);
for (const rel of scripts) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) errors.push('Script ausente: ' + rel);
  else {
    const code = fs.readFileSync(file, 'utf8');
    try { new Function(code); } catch (e) { errors.push('JS inválido ' + rel + ': ' + e.message); }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(isSimplifiedWeatherPage
  ? 'QA OK · interfaz climática simplificada · ' + ids.length + ' IDs revisados'
  : 'QA OK · contrato modular histórico · ' + scripts.length + ' scripts');
