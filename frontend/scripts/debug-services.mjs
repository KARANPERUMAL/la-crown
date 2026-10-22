import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function debug() {
  const port = 9688;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    'about:blank',
  ]);

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 150));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch (e) {}
  }

  const newPageRes = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise(r => setTimeout(r, 1500));

  for (const scrollY of [0, 1500, 2200, 3500, 4200, 5000, 6000]) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY});` });
    await new Promise(r => setTimeout(r, 400));
    const result = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const heroSec = document.querySelector('main > div:nth-child(1)');
          const servSec = document.getElementById('services-showcase');
          const stickyHero = heroSec ? heroSec.querySelector('section') : null;
          const stickyServ = servSec ? servSec.querySelector('section') : null;
          
          const centerEl = document.elementFromPoint(720, 450);
          return {
            scrollY: window.scrollY,
            heroTop: heroSec ? heroSec.getBoundingClientRect().top : null,
            heroBottom: heroSec ? heroSec.getBoundingClientRect().bottom : null,
            servTop: servSec ? servSec.getBoundingClientRect().top : null,
            servBottom: servSec ? servSec.getBoundingClientRect().bottom : null,
            stickyHeroTop: stickyHero ? stickyHero.getBoundingClientRect().top : null,
            stickyServTop: stickyServ ? stickyServ.getBoundingClientRect().top : null,
            centerElTag: centerEl ? centerEl.tagName + '.' + centerEl.className.slice(0, 30) : null,
            centerElText: centerEl ? centerEl.innerText?.slice(0, 40) : null,
            stickyHeroBg: stickyHero ? getComputedStyle(stickyHero).backgroundColor : null,
            stickyServBg: stickyServ ? getComputedStyle(stickyServ).backgroundColor : null,
          };
        })()
      `,
      returnByValue: true
    });
    console.log(`scrollY: ${scrollY}:`, JSON.stringify(result.result?.value, null, 2));
  }

  ws.close();
  chrome.kill();
}

debug().catch(e => console.error(e));
