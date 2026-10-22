import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const port = 9333;
  const tempDir = 'C:\\Users\\karan\\AppData\\Local\\Temp\\chrome-ref-profile-' + Date.now();
  const c = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + tempDir,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const pagesRes = await fetch(`http://127.0.0.1:${port}/json`);
  const pages = await pagesRes.json();
  const wsUrl = pages[0].webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const cur = id++;
    const h = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  const videoUrl = 'http://localhost:3000/ref-video.mp4';
  
  const nav = await send('Runtime.evaluate', {
    expression: `
      new Promise((resolve, reject) => {
        const v = document.createElement('video');
        v.src = "${videoUrl}";
        v.muted = true;
        v.playsInline = true;
        v.crossOrigin = "anonymous";
        v.style.position = 'fixed';
        v.style.top = '0';
        v.style.left = '0';
        v.style.width = '1280px';
        v.style.height = '720px';
        document.body.appendChild(v);
        v.onloadeddata = () => {
          resolve({ duration: v.duration, w: v.videoWidth, h: v.videoHeight });
        };
        v.onerror = (e) => resolve({ error: 'Video load error: ' + (v.error ? v.error.message : 'unknown') });
        setTimeout(() => resolve({ timeout: true, readyState: v.readyState }), 8000);
      })
    `,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Video meta:', nav.result?.value);
  const dur = nav.result?.value?.duration || 5;

  const outDir = 'C:\\Users\\karan\\.gemini\\antigravity\\brain\\f432bce9-6976-4e08-b058-a482674e7291\\scratch\\ref_frames';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const numFrames = 12;
  for (let i = 0; i < numFrames; i++) {
    const t = (dur / (numFrames - 1)) * i;
    const snap = await send('Runtime.evaluate', {
      expression: `
        new Promise((resolve) => {
          const v = document.querySelector('video');
          v.currentTime = ${t};
          v.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = v.videoWidth || 1280;
            canvas.height = v.videoHeight || 720;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          };
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });

    if (snap.result?.value) {
      const b64 = snap.result.value.replace(/^data:image\/jpeg;base64,/, '');
      fs.writeFileSync(path.join(outDir, `frame_${i}.jpg`), Buffer.from(b64, 'base64'));
      console.log(`Saved frame_${i}.jpg at ${t.toFixed(2)}s`);
    }
  }

  ws.close();
  c.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
}

run().catch(e => { console.error(e); process.exit(1); });
