/**
 * Apre una pagina di Gridwall da loggato e racconta cosa si vede.
 *
 * Uso:
 *   node apri.cjs <url> <cartella-profilo> <file-screenshot.png>
 *
 * Esempio:
 *   node apri.cjs "https://gridwall.it/environments/<id>/crm" ./prof-crm ./crm.png
 *
 * Ogni agente usi una CARTELLA PROFILO SUA, altrimenti Chrome si rifiuta di
 * partire due volte sullo stesso profilo. Il login lo fa da solo se serve, e
 * riusa la sessione nelle esecuzioni successive.
 *
 * Stampa: URL finale, errori di console, chiamate /api con lo stato, e il testo
 * a schermo. Salva lo screenshot dove gli dici.
 */
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const EMAIL = process.env.GW_EMAIL || 'francoves00@gmail.com';
const PASS = process.env.GW_PASS || '';
const attendi = (ms) => new Promise((r) => setTimeout(r, ms));

const [url, profilo, scatto] = process.argv.slice(2);
if (!url || !profilo) {
  console.error('uso: node apri.cjs <url> <cartella-profilo> [screenshot.png]');
  process.exit(2);
}

(async () => {
  const b = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    userDataDir: profilo,
    args: ['--no-sandbox', '--window-size=1600,1000'],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1600, height: 1000 });

  const api = [];
  p.on('response', async (r) => {
    const u = r.url();
    if (u.indexOf('/api/') === -1) return;
    let extra = '';
    if (r.status() >= 400) { try { extra = ' | ' + (await r.text()).slice(0, 200); } catch (e) {} }
    api.push(r.status() + ' ' + r.request().method() + ' ' + u.replace('https://gridwall.it', '') + extra);
  });
  const errori = [];
  p.on('console', (m) => { if (m.type() === 'error') errori.push('console: ' + m.text().slice(0, 220)); });
  p.on('pageerror', (e) => errori.push('pageerror: ' + String(e).slice(0, 220)));


  await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await attendi(3000);

  // Login solo se ci ha buttati fuori.
  if (p.url().includes('/login')) {
    if (!PASS) { console.error('serve GW_PASS nell ambiente per fare il login'); process.exit(3); }
    await p.type('input[type="email"], input[name="email"]', EMAIL, { delay: 15 });
    await p.type('input[type="password"], input[name="password"]', PASS, { delay: 15 });
    await Promise.all([
      p.click('button[type="submit"]'),
      p.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {}),
    ]);
    await attendi(4000);
    await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await attendi(3000);
  }

  await attendi(4000);
  console.log('URL: ' + p.url());
  console.log('--- ERRORI ---');
  console.log(errori.slice(0, 10).join('\n') || '(nessuno)');
  console.log('--- CHIAMATE API ---');
  console.log(api.join('\n') || '(nessuna)');
  console.log('--- TESTO A SCHERMO ---');
  const testo = await p.evaluate(() => document.body.innerText);
  console.log(testo.split('\n').filter(Boolean).join(' | ').slice(0, 3000));
  if (scatto) await p.screenshot({ path: scatto, fullPage: false });
  await b.close();
})().catch((e) => { console.error('ERRORE: ' + e.message); process.exit(1); });
