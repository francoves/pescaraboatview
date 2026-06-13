import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EXE = "C:/Program Files/Google/Chrome/Application/chrome.exe";
fs.mkdirSync("assets/_qa", { recursive: true });
const b = await puppeteer.launch({ executablePath: EXE, headless: "new", args: ["--no-sandbox"] });
for (const [name, w, h] of [["intro-desktop", 1440, 900], ["intro-mobile", 390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1.5 });
  await p.goto("http://localhost:8080/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise(r => setTimeout(r, 1000));
  const el = await p.$("#intro");
  await el.screenshot({ path: `assets/_qa/${name}.png` });
  await p.close();
  console.log("saved", name);
}
await b.close();
