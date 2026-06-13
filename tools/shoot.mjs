import puppeteer from "puppeteer-core";

const EXE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: "new",
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader",
         "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  defaultViewport: { width: 1200, height: 800, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
await page.goto("http://localhost:8080/tools/map-shot.html", { waitUntil: "networkidle2", timeout: 60000 });
await page.waitForFunction(() => document.title === "MAP_READY", { timeout: 45000 }).catch(() => console.log("idle wait timed out, capturing anyway"));
await new Promise(r => setTimeout(r, 1800));
await page.screenshot({ path: "assets/img/route-map.png" });
await browser.close();
console.log("screenshot done");
