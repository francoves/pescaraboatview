/**
 * Guarda una pagina di Gridwall CON UNA LETTURA ROTTA.
 *
 * Non scrive niente da nessuna parte: la risposta finta la costruisce il
 * browser (CDP Fetch.fulfillRequest) e la richiesta al server non parte.
 * Solo le URL che combaciano col motivo vengono fermate: tutto il resto passa
 * intatto, sessione compresa.
 *
 * uso: node rotto-sil3.cjs <url> <profilo> <screenshot.png> <pattern-url> [selettore-da-cliccare]
 */
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const attendi = (ms) => new Promise((r) => setTimeout(r, ms));

const [url, profilo, scatto, pattern, clicca] = process.argv.slice(2);

const CORPO = JSON.stringify({
  statusCode: 403,
  code: 'MODULE_DISABLED',
  error: 'Forbidden',
  message: 'Prova di guasto: il server non ha risposto a questa lettura',
});

(async () => {
  const b = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    userDataDir: profilo,
    args: ['--no-sandbox', '--window-size=1600,1200'],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1600, height: 1200 });

  const rotte = [];
  if (pattern) {
    const cdp = await p.createCDPSession();
    await cdp.send('Fetch.enable', { patterns: [{ urlPattern: pattern }] });
    cdp.on('Fetch.requestPaused', async ({ requestId, request }) => {
      rotte.push(request.url);
      try {
        await cdp.send('Fetch.fulfillRequest', {
          requestId,
          responseCode: 403,
          responseHeaders: [{ name: 'content-type', value: 'application/json' }],
          body: Buffer.from(CORPO).toString('base64'),
        });
      } catch (e) {
        /* la pagina può essere già andata avanti */
      }
    });
  }

  const errori = [];
  p.on('console', (m) => { if (m.type() === 'error') errori.push('console: ' + m.text().slice(0, 200)); });
  p.on('pageerror', (e) => errori.push('pageerror: ' + String(e).slice(0, 200)));

  await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await attendi(2500);

  // Login se ci ha buttati fuori (stessa procedura di apri.cjs).
  if (p.url().includes('/login')) {
    const EMAIL = process.env.GW_EMAIL || 'francoves00@gmail.com';
    await p.type('input[type="email"], input[name="email"]', EMAIL, { delay: 15 });
    await p.type('input[type="password"], input[name="password"]', process.env.GW_PASS || '', { delay: 15 });
    await Promise.all([
      p.click('button[type="submit"]'),
      p.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {}),
    ]);
    await attendi(4000);
    rotte.length = 0;
    await p.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await attendi(3500);
  }

  if (clicca) {
    try {
      await p.click(clicca);
      await attendi(2500);
    } catch (e) {
      console.log('click fallito: ' + e.message);
    }
  }

  console.log('URL: ' + p.url());
  console.log('--- ROTTE ---');
  console.log(rotte.join('\n') || '(nessuna)');
  console.log('--- ERRORI ---');
  console.log(errori.join('\n') || '(nessuno)');
  console.log('--- TESTO ---');
  console.log(await p.evaluate(() => document.body.innerText.replace(/\n+/g, ' | ').slice(0, 3500)));
  if (scatto) {
    try { await p.screenshot({ path: scatto, fullPage: false }); console.log('SCATTO ' + scatto); }
    catch (e) { console.log('SCATTO FALLITO: ' + e.message); }
  }
  await b.close();
})().catch((e) => { console.error('ERRORE: ' + e.message); process.exit(1); });
