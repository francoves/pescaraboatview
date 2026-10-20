import puppeteer from "puppeteer-core";
const EXE="C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT="C:/Users/Franco/Documents/Code/christian-de-leonibus/_study";
const b=await puppeteer.launch({executablePath:EXE,headless:"new",args:["--no-sandbox"]});
const p=await b.newPage(); await p.setViewport({width:1440,height:920,deviceScaleFactor:1.5});
await p.goto("http://localhost:8080/",{waitUntil:"networkidle2",timeout:60000});
await new Promise(r=>setTimeout(r,600));
// scroll to the metodo section
await p.evaluate(()=>{const el=[...document.querySelectorAll('h2')].find(h=>h.textContent.includes('Costruito attorno')); el&&el.scrollIntoView();});
await new Promise(r=>setTimeout(r,800));
await p.screenshot({path:`${OUT}/method-journey.png`});
await b.close(); console.log("done");
