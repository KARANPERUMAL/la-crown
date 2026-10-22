import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyReverse() {
  const port = 9222;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--user-data-dir=' + path.resolve('./.chrome-temp-reverse'),
    'about:blank',
  ]);

  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch (e) {}
  }

  const newPageRes = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('http://127.0.0.1:5173/')}`, {
    method: 'PUT',
  });
  const pageData = await newPageRes.json();
  const ws = new WebSocket(pageData.webSocketDebuggerUrl);
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await new Promise((r) => setTimeout(r, 1500));

  // Step 1: Scroll to 1.0 (bottom)
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll);
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 600));

  // Step 2: Reverse scroll back to 0.0 (top)
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.scrollTo(0, 0);
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 600));

  // Capture screenshot after reverse scroll
  const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  fs.writeFileSync('C:/Users/karan/.gemini/antigravity/brain/5973f7ee-8e85-47dc-a9ee-d012269e6346/reverse_scroll_restored_0.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved reverse_scroll_restored_0.png');

  ws.close();
  chrome.kill();
}

verifyReverse()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
