// Screenshot delle pagine in MEDIA PRINT per verificare le ombre (no rettangoli).
import puppeteer from "puppeteer-core";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const EXE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "Brochure_PescaraBoatView_.html");

const browser = await puppeteer.launch({ executablePath: EXE, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 1273, deviceScaleFactor: 1 });
await page.emulateMediaType("print"); // riproduce la condizione del PDF
await page.goto(pathToFileURL(SRC).href, { waitUntil: "networkidle0", timeout: 120000 });
await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });

const pages = await page.$$(".page");
for (const idx of [1, 3]) { // exp-grid (p2) e split/who3 (p4) 0-based
  if (pages[idx]) await pages[idx].screenshot({ path: path.join(ROOT, `verify-p${idx + 1}.png`) });
}
await browser.close();
console.log("done");
