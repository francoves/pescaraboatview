import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const root = new URL('../', import.meta.url);
const outDir = new URL('assets/fonts/', root);
fs.mkdirSync(outDir, { recursive: true });

// modern Chrome UA so Google Fonts serves woff2
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const CSS_URL = 'https://fonts.googleapis.com/css2'
  + '?family=Bricolage+Grotesque:wght@400;500;600;700'
  + '&family=Manrope:wght@400;500;600;700;800'
  + '&display=swap';

let css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text();

const urls = [...new Set([...css.matchAll(/https:\/\/fonts\.gstatic\.com\/[^\s)]+\.woff2/g)].map(m => m[0]))];
console.log(`found ${urls.length} woff2 files`);

let i = 0;
for (const u of urls) {
  const name = `f${i++}.woff2`;
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  await pipeline(Readable.fromWeb(r.body), fs.createWriteStream(new URL(name, outDir)));
  css = css.split(u).join(`../assets/fonts/${name}`);
}

fs.writeFileSync(new URL('css/fonts.css', root), css);
console.log('wrote css/fonts.css and', i, 'fonts');
