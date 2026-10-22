import { spawn } from 'child_process';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspect(width = 1440, height = 900) {
  const port = 9222;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    '--user-data-dir=' + path.resolve('./.chrome-temp'),
    'http://127.0.0.1:5173/',
  ]);

  let versionData = null;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        versionData = await res.json();
        break;
      }
    } catch (e) {}
  }

  const pagesRes = await fetch(`http://127.0.0.1:${port}/json`);
  const pages = await pagesRes.json();
  const page = pages.find((p) => p.url.includes('5173')) || pages[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

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
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });

  await new Promise((r) => setTimeout(r, 2500));

  const metrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const wordmark = document.querySelector('[aria-label="LACROWN"] > div');
      const centerCard = document.querySelector('.center-card-shadow');
      const leftCard = document.querySelector('.origin-bottom-right');
      const rightCard = document.querySelector('.origin-bottom-left');
      const headline = document.querySelector('.clinic-headline-1');
      const headlineContainer = headline ? headline.closest('.max-w-2xl') : null;
      const getRect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height), right: Math.round(r.right), bottom: Math.round(r.bottom) };
      };

      const lEl = document.querySelector('[aria-label="LACROWN"] img[alt="L"]')?.parentElement;
      const acrowEls = document.querySelectorAll('.brand-condensed-acrow');
      const nEl = document.querySelector('[aria-label="LACROWN"] img[alt="N"]')?.parentElement;

      const lRect = getRect(lEl);
      const aRect = getRect(acrowEls[0]);
      const cRect = getRect(acrowEls[1]);
      const wRect = getRect(acrowEls[4]);
      const nRect = getRect(nEl);

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight, scrollHeight: document.documentElement.scrollHeight },
        wordmark: getRect(wordmark),
        gap_L_to_A: aRect && lRect ? Math.round(aRect.x - lRect.right) : null,
        gap_A_to_C: cRect && aRect ? Math.round(cRect.x - aRect.right) : null,
        gap_W_to_N: nRect && wRect ? Math.round(nRect.x - wRect.right) : null,
        centerCard: getRect(centerCard),
        leftCard: getRect(leftCard),
        rightCard: getRect(rightCard),
        headlineContainer: getRect(headlineContainer),
      };
    })()`,
    returnByValue: true,
  });

  console.log('Metrics at ' + width + 'x' + height + ':', JSON.stringify(metrics.result.value, null, 2));

  ws.close();
  chrome.kill();
}

inspect(parseInt(process.argv[2] || '1440', 10), parseInt(process.argv[3] || '900', 10));
