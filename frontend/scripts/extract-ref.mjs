import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const port = 9223;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-port=' + port,
    '--window-size=1280,720',
    '--user-data-dir=' + path.resolve('./.chrome-temp-ref-frames'),
    'about:blank'
  ]);

  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:' + port + '/json/version');
      if (res.ok) break;
    } catch (e) {}
  }

  const newPageRes = await fetch('http://127.0.0.1:' + port + '/json/new?about:blank', { method: 'PUT' });
  const pageData = await newPageRes.json();
  const ws = new WebSocket(pageData.webSocketDebuggerUrl);
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

  const videoFile = 'file:///C:/Users/karan/OneDrive/Desktop/la_crown/20261020-1017-50.5360562.mp4';
  const setup = await send('Runtime.evaluate', {
    expression: `
      new Promise(resolve => {
        const v = document.createElement('video');
        v.src = '${videoFile}';
        v.muted = true;
        v.playsInline = true;
        document.body.appendChild(v);
        v.onloadeddata = () => resolve({ duration: v.duration, w: v.videoWidth, h: v.videoHeight });
      })
    `,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('Video metadata:', setup.result?.value);
  const outDir = 'C:/Users/karan/.gemini/antigravity/brain/f432bce9-6976-4e08-b058-a482674e7291/scratch/ref_frames';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const dur = setup.result?.value?.duration || 10;
  for (let step = 0; step < 10; step++) {
    const t = (dur / 9) * step;
    const f = await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          const v = document.querySelector('video');
          v.currentTime = ${t};
          v.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = v.videoWidth;
            canvas.height = v.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
        })
      `,
      awaitPromise: true,
      returnByValue: true
    });

    if (f.result?.value) {
      const b64 = f.result.value.replace(/^data:image\/jpeg;base64,/, '');
      fs.writeFileSync(path.join(outDir, `frame_${step}.jpg`), Buffer.from(b64, 'base64'));
      console.log(`Saved frame ${step} at t=${t.toFixed(2)}`);
    }
  }

  ws.close();
  chrome.kill();
}

run().catch(e => { console.error(e); process.exit(1); });
