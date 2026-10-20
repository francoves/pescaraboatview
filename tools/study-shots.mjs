import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EXE = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "C:/Users/Franco/Documents/Code/christian-de-leonibus/_study";
fs.mkdirSync(OUT, { recursive: true });

const b = await puppeteer.launch({ executablePath: EXE, headless: "new", args: ["--no-sandbox"] });

async function cap(url, name, w, h) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: "networkidle2", timeout: 90000 }).catch(() => {});
  // auto-scroll to trigger lazy media
  await p.evaluate(async () => {
    await new Promise(res => {
      let y = 0; const step = 600;
      const t = setInterval(() => { window.scrollBy(0, step); y += step;
        if (y >= document.body.scrollHeight) { clearInterval(t); res(); } }, 120);
    });
  });
  await new Promise(r => setTimeout(r, 1200));
  await p.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await p.close();
  console.log("saved", name);
}

await cap("https://christiandeleonibus.com/assicurativo/", "assicurativo-desktop", 1440, 900);
await cap("https://christiandeleonibus.com/assicurativo/", "assicurativo-mobile", 390, 844);
await cap("https://christiandeleonibus.com/finanziario/", "finanziario-desktop", 1440, 900);
await cap("https://christiandeleonibus.com/chi-siamo/", "chisiamo-desktop", 1440, 900);
await cap("https://christiandeleonibus.com/contatti/", "contatti-desktop", 1440, 900);

await b.close();
console.log("done");
