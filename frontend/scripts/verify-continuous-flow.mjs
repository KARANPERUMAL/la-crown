import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runSuite() {
  const port = 9701;
  const tempDir = 'C:\\Users\\karan\\AppData\\Local\\Temp\\chrome-continuous-' + Date.now();
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

  const baseDir = 'C:\\Users\\karan\\.gemini\\antigravity\\brain\\f432bce9-6976-4e08-b058-a482674e7291\\scratch\\verification_continuous';
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const url = 'http://localhost:3000/';

  console.log('--- STARTING CONTINUOUS HERO-TO-SERVICES FLOW VERIFICATION ---');

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2200));

  // Check Header button counts across the entire page
  const headerCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const menuBtns = document.querySelectorAll('button[aria-label="Open clinic menu and navigation"]');
        const waBtns = document.querySelectorAll('button[aria-label="Contact clinic via WhatsApp consultation"]');
        const heroTrack = document.querySelector('main > div:first-child');
        return {
          menuBtnCount: menuBtns.length,
          waBtnCount: waBtns.length,
          heroTrackHeight: heroTrack ? heroTrack.offsetHeight : 0,
          totalDocHeight: document.documentElement.scrollHeight
        };
      })()
    `,
    returnByValue: true
  });
  console.log('HEADER & STRUCTURE AUDIT:', headerCheck.result?.value);

  const { heroTrackHeight } = headerCheck.result?.value;
  const maxScroll = heroTrackHeight - 900;
  console.log(`Hero Track Height: ${heroTrackHeight}px, Max Pinned Scroll: ${maxScroll}px`);

  async function snap(name, scrollProgress) {
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const heroTrack = document.querySelector('main > div:first-child');
          const max = heroTrack ? (heroTrack.offsetHeight - window.innerHeight) : (document.documentElement.scrollHeight - window.innerHeight);
          window.scrollTo(0, Math.round(${scrollProgress} * max));
        })()
      `,
    });
    await new Promise(r => setTimeout(r, 650));

    const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const fullPath = path.join(baseDir, name);
    fs.writeFileSync(fullPath, Buffer.from(shot.data, 'base64'));
    console.log(`[SAVED] ${name} (progress=${scrollProgress.toFixed(2)})`);
  }

  // 1. Initial Hero Composition
  await snap('01_hero_initial_composition.png', 0.0);

  // 2. Early scroll: Side images collapse inward & text moves upward
  await snap('02_side_images_collapse_text_up.png', 0.12);

  // 3. Video card slides into center from behind center image
  await snap('03_video_card_reverse_carousel.png', 0.22);

  // 4. Stable video showcase hold (vivid pink #E63886)
  await snap('04_video_showcase_stable_hold.png', 0.32);

  // 5. Handoff: Video card glides left, Card 1 slides in from right, left info enters from below
  await snap('05_handoff_video_to_services.png', 0.42);

  // 6. Service 1: Hair Treatment (Deep Forest Green #00552F)
  await snap('06_service_1_hair_treatment_green.png', 0.48);

  // 6b. Transition: Card 2 entering from right over Card 1 at center
  await snap('06b_transition_hair_to_skin.png', 0.51);

  // 7. Service 2: Skin Treatment (Soft Blush Pink #F6D5DE)
  await snap('07_service_2_skin_treatment_pink.png', 0.57);

  // 8. Service 3: Facial (Warm Cream #FAF3ED)
  await snap('08_service_3_facial_cream.png', 0.66);

  // 9. Service 4: Anti-Ageing Treatment (Muted Rose #C56882)
  await snap('09_service_4_anti_ageing_rose.png', 0.75);

  // 10. Service 5: Slimming Treatment (Cashmere Taupe #D1C4B5)
  await snap('10_service_5_slimming_taupe.png', 0.84);

  // 11. Service 6: Semi-Permanent Make Up (Vivid Brand Pink #E63886)
  await snap('11_service_6_semi_permanent_pink.png', 0.93);

  // 12. Smooth exit into Clinic Experience Section
  await snap('12_exit_to_clinic_experience.png', 1.05);

  // 13. Reverse scroll back up to Service 1
  await snap('13_reverse_scroll_to_service_1.png', 0.48);

  // 14. Reverse scroll back up to Video Showcase
  await snap('14_reverse_scroll_to_video_hold.png', 0.32);

  // 15. Reverse scroll all the way to Hero
  await snap('15_reverse_scroll_to_hero.png', 0.0);

  // 16. Mobile Viewport Check (390x844)
  console.log('--- MOBILE TEST (390x844) ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 1800));
  await snap('16_mobile_hero_initial.png', 0.0);
  await snap('17_mobile_service_1.png', 0.48);
  await snap('18_mobile_service_2.png', 0.57);

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}
  console.log('--- ALL CONTINUOUS FLOW VERIFICATIONS COMPLETE ---');
}

runSuite().catch(e => { console.error('Error running continuous flow suite:', e); process.exit(1); });
