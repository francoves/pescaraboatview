// Genera Brochure_PescaraBoatView.pdf dall'HTML sorgente con Chrome di sistema.
// Uso: node tools/make-pdf.mjs
import puppeteer from "puppeteer-core";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const EXE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "Brochure_PescaraBoatView_.html");
const OUT = path.join(ROOT, "Brochure_PescaraBoatView.pdf");

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: "new",
  args: ["--no-sandbox", "--allow-file-access-from-files"],
});
const page = await browser.newPage();
await page.goto(pathToFileURL(SRC).href, { waitUntil: "networkidle0", timeout: 120000 });
// Aspetta il caricamento di font e immagini.
await page.evaluate(async () => {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const imgs = Array.from(document.images);
  await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
});
await page.pdf({
  path: OUT,
  printBackground: true,
  preferCSSPageSize: true, // rispetta @page size:A4 margin:0
  format: "A4",
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
});
await browser.close();
console.log("PDF generato:", OUT);
