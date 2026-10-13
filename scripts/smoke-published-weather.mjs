import { chromium } from 'playwright';

const url = process.env.OCARINA_URL || 'https://eliasmartinezcultural-glitch.github.io/OCARINA-CLIMATICA/';
const browser = await chromium.launch({ headless: true });
const failures = [];
const results = [];

async function testViewport(name, viewport) {
  const page = await browser.newPage({ viewport });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    if (!response || !response.ok()) throw new Error('La página no respondió con HTTP 2xx: ' + (response?.status() ?? 'sin respuesta'));
    await page.waitForFunction(() => {
      const temp = document.querySelector('#temperature')?.textContent?.trim();
      const condition = document.querySelector('#condition')?.textContent?.trim();
      return temp && temp !== '—' && condition && !condition.startsWith('Consultando');
    }, { timeout: 30000 });

    const base = url.endsWith('/') ? url : url + '/';
    const snapshotResponse = await page.request.get(base + 'data/live/open-meteo.json');
    if (!snapshotResponse.ok()) throw new Error('El snapshot publicado Open-Meteo no responde HTTP 2xx');
    const publishedSnapshot = await snapshotResponse.json();
    if (publishedSnapshot.status !== 'ready' || !publishedSnapshot.data?.current || !publishedSnapshot.data?.hourly || !publishedSnapshot.data?.daily) {
      throw new Error('El snapshot publicado no cumple el contrato de datos meteorológicos');
    }
    const healthResponse = await page.request.get(base + 'data/live/source-health.json');
    if (!healthResponse.ok()) throw new Error('El sondeador de fuentes no publicó source-health.json');
    const sourceHealth = await healthResponse.json();
    if (!sourceHealth.retrievedAt || !sourceHealth.counts || typeof sourceHealth.counts.checked !== 'number') {
      throw new Error('El estado de salud de fuentes no cumple el contrato');
    }
    const observationsResponse = await page.request.get(base + 'data/live/smn-nearby-observations.json');
    if (!observationsResponse.ok()) throw new Error('No se publicó el snapshot de observaciones regionales SMN');
    const regionalSnapshot = await observationsResponse.json();
    if (!regionalSnapshot.status || !regionalSnapshot.retrievedAt) throw new Error('El snapshot de observaciones regionales carece de estado o fecha');
    await page.waitForFunction(() => {
      const state = document.querySelector('#regionalStatus')?.textContent || '';
      return state && !state.includes('SONDEANDO');
    }, { timeout: 12000 });

    const snapshot = await page.evaluate(() => ({
      temperature: document.querySelector('#temperature')?.textContent?.trim(),
      condition: document.querySelector('#condition')?.textContent?.trim(),
      updated: document.querySelector('#updated')?.textContent?.trim(),
      hourly: document.querySelectorAll('#hourly .hour').length,
      days: document.querySelectorAll('#days .day').length,
      errorVisible: getComputedStyle(document.querySelector('#error')).display !== 'none',
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2
    }));
    if (!/^-?\d+(\.\d+)?$/.test(snapshot.temperature)) throw new Error('Temperatura actual no numérica: ' + snapshot.temperature);
    if (snapshot.hourly !== 8) throw new Error('Se esperaban 8 tarjetas horarias; llegaron ' + snapshot.hourly);
    if (snapshot.days !== 7) throw new Error('Se esperaban 7 tarjetas diarias; llegaron ' + snapshot.days);
    if (snapshot.errorVisible) throw new Error('El sitio muestra el aviso de error a pesar de presentar datos');
    if (snapshot.overflow) throw new Error('La página presenta desbordamiento horizontal en ' + name);
    if (pageErrors.length) throw new Error('Errores JavaScript: ' + pageErrors.join(' | '));
    await page.locator('#refresh').click();
    await page.waitForFunction(() => (document.querySelector('#refresh')?.textContent || '').includes('Actualizar ahora'), { timeout: 15000 });
    results.push({ viewport: name, status: 'PASS', temperature: snapshot.temperature, condition: snapshot.condition, hourly: snapshot.hourly, days: snapshot.days, manualRefresh: 'PASS', publishedSnapshot: 'PASS', sourceHealth: sourceHealth.counts, regionalObservationStatus: regionalSnapshot.status });
  } catch (error) {
    failures.push(name + ': ' + error.message);
    results.push({ viewport: name, status: 'FAIL', error: error.message });
  } finally {
    await page.close();
  }
}
try {
  await testViewport('escritorio', { width: 1365, height: 900 });
  await testViewport('móvil', { width: 390, height: 844 });
} finally {
  await browser.close();
}
console.log(JSON.stringify({ url, results }, null, 2));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
