import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture(url, outPath, scrollProgress, width, height, reverse = false) {
  const port = 9555;
  const tempDir = 'C:\\Users\\karan\\AppData\\Local\\Temp\\chrome-verify-' + Date.now();
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    '--user-data-dir=' + tempDir,
    'about:blank',
  ]);

  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 150));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch (e) {}
  }

  const newPageRes = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  const pageData = await newPageRes.json();
  const ws = new WebSocket(pageData.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const send = (method, params = {}) => new Promise(res => {
    const id = msgId++;
    const handler = (evt) => {
      const d = JSON.parse(evt.data);
      if (d.id === id) {
        ws.removeEventListener('message', handler);
        res(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url });

  // Wait for initial render and entry animations
  await new Promise(r => setTimeout(r, 1500));

  if (reverse) {
    // Scroll to 1.0, then back to 0.0
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo(0, max);
        })()
      `,
    });
    await new Promise(r => setTimeout(r, 600));
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          window.scrollTo(0, 0);
        })()
      `,
    });
    await new Promise(r => setTimeout(r, 600));
  } else if (scrollProgress > 0) {
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo(0, max * ${scrollProgress});
        })()
      `,
    });
    await new Promise(r => setTimeout(r, 600));
  }

  const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log(`Saved: ${outPath} (progress=${scrollProgress}, w=${width}, h=${height}, rev=${reverse})`);

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
}

async function run() {
  const baseDir = 'C:\\Users\\karan\\.gemini\\antigravity\\brain\\f432bce9-6976-4e08-b058-a482674e7291\\scratch\\verification';
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const url = 'http://localhost:3000/';

  // 1. Desktop 1440x900 - Initial Hero (scroll = 0)
  await capture(url, path.join(baseDir, '01_desktop_hero_init.png'), 0.0, 1440, 900);

  // 2. Desktop 1440x900 - Stage B: 3-Image Reveal (scroll = 0.14)
  await capture(url, path.join(baseDir, '02_desktop_hero_reveal.png'), 0.14, 1440, 900);

  // 3. Desktop 1440x900 - Stage C & D: Left content upward & pink bg start (scroll = 0.35)
  await capture(url, path.join(baseDir, '03_desktop_pink_transition.png'), 0.35, 1440, 900);

  // 4. Desktop 1440x900 - Stage E: Video card emerging behind center image (scroll = 0.46)
  await capture(url, path.join(baseDir, '04_desktop_video_emerge.png'), 0.46, 1440, 900);

  // 5. Desktop 1440x900 - Stage F: Center image handoff to dominant video (scroll = 0.58)
  await capture(url, path.join(baseDir, '05_desktop_video_dominant.png'), 0.58, 1440, 900);

  // 6. Desktop 1440x900 - Stage G: Final 3-column pink showcase (scroll = 0.95)
  await capture(url, path.join(baseDir, '06_desktop_pink_showcase.png'), 0.95, 1440, 900);

  // 7. Desktop 1440x900 - Reverse scroll back to top
  await capture(url, path.join(baseDir, '07_desktop_reversed_to_top.png'), 0.0, 1440, 900, true);

  // 8. Mobile 390x844 - Initial Hero
  await capture(url, path.join(baseDir, '08_mobile_hero_init.png'), 0.0, 390, 844);

  // 9. Mobile 390x844 - Final Showcase
  await capture(url, path.join(baseDir, '09_mobile_pink_showcase.png'), 0.95, 390, 844);

  // 10. Tablet 768x1024 - Initial Hero
  await capture(url, path.join(baseDir, '10_tablet_hero_init.png'), 0.0, 768, 1024);

  // 11. Tablet 768x1024 - Final Showcase
  await capture(url, path.join(baseDir, '11_tablet_pink_showcase.png'), 0.95, 768, 1024);

  console.log('ALL VERIFICATION CAPTURES COMPLETE!');
}

run().catch(e => { console.error(e); process.exit(1); });
