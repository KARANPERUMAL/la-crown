import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureScroll(url, outputFile, scrollProgress = 0, width = 1440, height = 900) {
  const port = 9222;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    '--user-data-dir=' + path.resolve('./.chrome-temp-scroll'),
    'about:blank',
  ]);

  // Wait for Chrome debugging endpoint
  let versionData = null;
  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        versionData = await res.json();
        break;
      }
    } catch (e) {
      // retry
    }
  }

  if (!versionData || !versionData.webSocketDebuggerUrl) {
    chrome.kill();
    throw new Error('Failed to connect to Chrome debugging port');
  }

  // Create new page
  const newPageRes = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, {
    method: 'PUT',
  });
  const pageData = await newPageRes.json();
  const wsUrl = pageData.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Set device metrics
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });

  // Enable Page & Runtime
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url });

  // Wait for initial reveal to complete
  await new Promise((r) => setTimeout(r, 1800));

  // Perform scroll if scrollProgress > 0
  if (scrollProgress > 0) {
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const maxScroll = Math.max(
            document.body.scrollHeight - window.innerHeight,
            document.documentElement.scrollHeight - window.innerHeight
          );
          const targetY = maxScroll * ${scrollProgress};
          window.scrollTo({ top: targetY, behavior: 'instant' });
          return { maxScroll, targetY, scrollY: window.scrollY };
        })()
      `,
      returnByValue: true,
    });
    // Wait for scroll animations / transforms to update
    await new Promise((r) => setTimeout(r, 600));
  }

  // Capture screenshot
  const screenshot = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
  });

  fs.writeFileSync(outputFile, Buffer.from(screenshot.data, 'base64'));
  console.log(`Saved screenshot [progress=${scrollProgress}] to ${outputFile}`);

  ws.close();
  chrome.kill();
}

const targetUrl = process.argv[2] || 'http://localhost:3000/';
const targetFile = process.argv[3] || 'scroll-capture.png';
const progress = parseFloat(process.argv[4] || '0');
const width = parseInt(process.argv[5] || '1440', 10);
const height = parseInt(process.argv[6] || '900', 10);

captureScroll(targetUrl, targetFile, progress, width, height)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
