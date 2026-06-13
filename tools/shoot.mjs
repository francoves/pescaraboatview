import puppeteer from "puppeteer-core";

const EXE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: "new",
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader",
         "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

async function shot(url, w, h, out) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForFunction(() => document.title === "MAP_READY", { timeout: 45000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: out });
  await page.close();
  console.log("saved", out);
}

const base = "http://localhost:8080/tools/map-shot.html";
// brochure (landscape, centred)
await shot(base, 1200, 800, "assets/img/route-map.png");
// site desktop intro (coast shifted right, clear of the left text)
await shot(base + "?pt=70&pb=70&pl=600&pr=50", 1400, 760, "assets/img/route-map-desktop.png");

await browser.close();
console.log("done");
