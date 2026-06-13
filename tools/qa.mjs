import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EXE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
fs.mkdirSync("assets/_qa", { recursive: true });
const browser = await puppeteer.launch({ executablePath: EXE, headless: "new",
  args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"],
  defaultViewport: { width: 900, height: 1273, deviceScaleFactor: 1.4 } });
const page = await browser.newPage();
await page.goto("http://localhost:8080/brochure.html", { waitUntil: "networkidle2", timeout: 60000 });
await new Promise(r => setTimeout(r, 1200));
const pages = await page.$$(".page");
for (let i = 0; i < pages.length; i++) {
  await pages[i].screenshot({ path: `assets/_qa/p${i + 1}.png` });
}
await browser.close();
console.log("captured", pages.length, "pages");
