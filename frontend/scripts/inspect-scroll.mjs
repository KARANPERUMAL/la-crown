import { spawn } from 'child_process';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function check() {
  const port = 9222;
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--user-data-dir=' + path.resolve('./.chrome-temp-inspect'),
    'http://127.0.0.1:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch(`http://127.0.0.1:${port}/json/version`);
  const v = await res.json();
  const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const page = pages.find(p => p.url.includes('5173'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);
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
  await new Promise(r => setTimeout(r, 1000));

  // Check ancestor chain
  const chain = await send('Runtime.evaluate', {
    expression: `
      (() => {
        let el = document.querySelector('section');
        const list = [];
        while (el) {
          const s = window.getComputedStyle(el);
          list.push({
            tag: el.tagName,
            id: el.id,
            className: typeof el.className === 'string' ? el.className.slice(0, 40) : '',
            overflow: s.overflow,
            overflowX: s.overflowX,
            overflowY: s.overflowY,
            position: s.position,
            height: s.height
          });
          el = el.parentElement;
        }
        return list;
      })()
    `,
    returnByValue: true
  });
  console.log('Chain:', JSON.stringify(chain.result.value, null, 2));

  // Scroll to 20%
  const scrolled = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * 0.2);
        const heroSection = document.querySelector('section');
        const r = heroSection ? heroSection.getBoundingClientRect() : null;
        const heroRect = r ? { top: r.top, bottom: r.bottom, height: r.height, y: r.y } : null;
        return { maxScroll, scrollY: window.scrollY, heroRect };
      })()
    `,
    returnByValue: true
  });
  console.log('Scrolled 20%:', JSON.stringify(scrolled.result ? scrolled.result.value : scrolled, null, 2));

  ws.close();
  chrome.kill();
}
check();
