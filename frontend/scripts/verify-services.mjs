import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runSuite() {
  const port = 9699;
  const tempDir = 'C:\\Users\\karan\\AppData\\Local\\Temp\\chrome-services-' + Date.now();
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1440,900',
    '--user-data-dir=' + tempDir,
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

  const baseDir = 'C:\\Users\\karan\\.gemini\\antigravity\\brain\\f432bce9-6976-4e08-b058-a482674e7291\\scratch\\verification_services';
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const url = 'http://localhost:3000/';

  console.log('--- STARTING SERVICES VERIFICATION CAPTURES ---');

  // Navigate once for Desktop 1440x900
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2000));

  const pageInfo = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hero = document.querySelector('main > div:nth-child(1)');
        const services = document.getElementById('services-showcase');
        const heroH = hero ? hero.offsetHeight : 3420;
        const servicesH = services ? services.offsetHeight : 4320;
        const totalH = document.documentElement.scrollHeight;
        return { heroH, servicesH, totalH };
      })()
    `,
    returnByValue: true
  });
  console.log('Page Structure:', pageInfo.result?.value);
  const { heroH, servicesH } = pageInfo.result?.value || { heroH: 3420, servicesH: 4320 };

  async function snap(name, scrollY) {
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, ${scrollY});`,
    });
    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const fullPath = path.join(baseDir, name);
    fs.writeFileSync(fullPath, Buffer.from(shot.data, 'base64'));
    console.log(`[SAVED] ${name} (y=${scrollY})`);
  }

  // 1. Hero Initial
  await snap('01_hero_initial.png', 0);

  // 2. Hero Video Showcase Hold (~1800px)
  await snap('02_hero_video_showcase_hold.png', 1800);

  // 3. Hero Video Showcase Hold late (~2200px)
  await snap('03_hero_video_hold_late.png', 2200);

  // 4. Hero to Services Handoff (~3100px)
  await snap('04_hero_to_services_handoff.png', 3100);

  // 5. Service 1: Hair Treatment (Deep Forest Green #00552F) (~3600px)
  await snap('05_service_1_hair_treatment_green.png', 3600);

  // 6. Service 2: Skin Treatment (Soft Blush Pink #F6D5DE) (~4400px)
  await snap('06_service_2_skin_treatment_pink.png', 4400);

  // 7. Service 3: Facial (Warm Cream #FAF3ED) (~5100px)
  await snap('07_service_3_facial_cream.png', 5100);

  // 8. Service 4: Anti-Ageing Treatment (Muted Rose #C56882) (~5800px)
  await snap('08_service_4_anti_ageing_rose.png', 5800);

  // 9. Service 5: Slimming Treatment (Earthy Neutral #D1C4B5) (~6500px)
  await snap('09_service_5_slimming_neutral.png', 6500);

  // 10. Service 6: Semi-Permanent Make Up (Rich Brand Pink #E63886) (~7200px)
  await snap('10_service_6_semi_permanent_pink.png', 7200);

  // 11. Exit into Clinic Experience Section (~8100px)
  await snap('11_exit_clinic_experience_section.png', 8100);

  // 12. Reverse Scroll back up to Service 1 (~3600px)
  await snap('12_reverse_scroll_to_service_1.png', 3600);

  // 13. Tablet 768x1024
  console.log('--- TABLET CAPTURE ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 1800));
  await snap('13_tablet_service_showcase.png', 4600);

  // 14. Mobile 390x844
  console.log('--- MOBILE CAPTURE ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 1800));
  await snap('14_mobile_service_showcase.png', 4600);

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  console.log('--- ALL VERIFICATION CAPTURES COMPLETED ---');
}

runSuite().catch(e => { console.error('Verification error:', e); process.exit(1); });
