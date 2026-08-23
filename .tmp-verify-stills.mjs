import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9229;
const WIDTH = Number(process.argv[2] || 390);
const URL = process.argv[3] || "http://localhost:3010/services/ai-development";

const chrome = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--window-size=${WIDTH},1400`,
    `--user-data-dir=${process.env.TEMP}\\aot-cdp-profile-${WIDTH}`,
  ],
  { stdio: "ignore" },
);

await new Promise((r) => setTimeout(r, 1200));

const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) =>
  r.json(),
);
const page = list.find((t) => t.type === "page") || list[0];
const ws = new WebSocket(page.webSocketDebuggerUrl);

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = send.nextId++;
    const onMsg = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id === id) {
        ws.removeEventListener("message", onMsg);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };
    ws.addEventListener("message", onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
send.nextId = 1;

function onceEvent(method) {
  return new Promise((resolve) => {
    const onMsg = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === method) {
        ws.removeEventListener("message", onMsg);
        resolve(msg.params);
      }
    };
    ws.addEventListener("message", onMsg);
  });
}

await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve);
  ws.addEventListener("error", reject);
});

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: WIDTH,
  height: 1400,
  deviceScaleFactor: 1,
  mobile: WIDTH < 840,
});
const loaded = onceEvent("Page.loadEventFired");
await send("Page.navigate", { url: URL });
await loaded;
await new Promise((r) => setTimeout(r, 1800));

const { result } = await send("Runtime.evaluate", {
  expression: `(() => {
    const section = document.querySelector(".aot-services-stills");
    if (section) section.scrollIntoView({ block: "start" });
    const rows = [...document.querySelectorAll(".aot-services-still")];
    const info = rows.map((row, i) => {
      const style = getComputedStyle(row);
      const media = row.querySelector(".aot-services-still__media");
      const copy = row.querySelector(".aot-services-still__copy");
      const frame = row.querySelector(".aot-services-still__frame");
      const mr = media.getBoundingClientRect();
      const cr = copy.getBoundingClientRect();
      const fr = frame.getBoundingClientRect();
      return {
        index: i,
        flip: row.classList.contains("aot-services-still--flip"),
        columns: style.gridTemplateColumns,
        gap: style.gap,
        mediaLeft: Math.round(mr.left),
        copyLeft: Math.round(cr.left),
        mediaWidth: Math.round(mr.width),
        copyWidth: Math.round(cr.width),
        frameW: Math.round(fr.width),
        frameH: Math.round(fr.height),
        topDelta: Math.round(Math.abs(mr.top - cr.top)),
        sideBySide: Math.abs(mr.top - cr.top) < 48 && Math.abs(mr.left - cr.left) > 40,
        imageOnLeft: mr.left < cr.left,
      };
    });
    return {
      count: rows.length,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      rows: info,
    };
  })()`,
  returnByValue: true,
});

console.log(JSON.stringify(result.value, null, 2));

const shot = await send("Page.captureScreenshot", { format: "png" });
const out = `${process.env.TEMP}\\aot-stills-${WIDTH}.png`;
await writeFile(out, Buffer.from(shot.data, "base64"));
console.log("screenshot", out);

ws.close();
chrome.kill();
process.exit(0);
