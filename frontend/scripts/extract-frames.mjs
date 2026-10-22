import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractFrames() {
  const port = 9222;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1280,720',
    '--user-data-dir=' + path.resolve('./.chrome-temp-video'),
    'about:blank',
  ]);

  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch (e) {}
  }

  const newPageRes = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
  const pageData = await newPageRes.json();
  const ws = new WebSocket(pageData.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

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

  await send('Page.enable');
  await send('Runtime.enable');

  const videoPath = 'file:///C:/Users/karan/Downloads/Recording%202026-10-19%20152814.mp4';
  
  const setupRes = await send('Runtime.evaluate', {
    expression: `
      new Promise((resolve) => {
        const v = document.createElement('video');
        v.src = '${videoPath}';
        v.muted = true;
        v.autoplay = false;
        v.playsInline = true;
        v.style.width = '1280px';
        v.style.height = '720px';
        document.body.appendChild(v);
        v.onloadeddata = () => {
          resolve({ duration: v.duration, videoWidth: v.videoWidth, videoHeight: v.videoHeight });
        };
      })
    `,
    awaitPromise: true,
    returnByValue: true,
  });

  console.log('Video loaded:', setupRes.result.value);

  // Extract frames at 0s, 0.3s, 0.6s, 0.9s, 1.2s, 1.5s, 1.8s, 2.2s
  const times = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.3, 1.6, 2.0];
  const outDir = 'C:/Users/karan/.gemini/antigravity/brain/5973f7ee-8e85-47dc-a9ee-d012269e6346/ref_frames';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const t of times) {
    const frameData = await send('Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          const v = document.querySelector('video');
          v.currentTime = ${t};
          v.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = v.videoWidth;
            canvas.height = v.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          };
        })
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    if (frameData.result && frameData.result.value) {
      const base64 = frameData.result.value.replace(/^data:image\/jpeg;base64,/, '');
      const filePath = path.join(outDir, `frame_${t.toFixed(1)}s.jpg`);
      fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
      console.log(`Saved frame_${t.toFixed(1)}s.jpg`);
    }
  }

  ws.close();
  chrome.kill();
}

extractFrames()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
