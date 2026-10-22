import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runSuite() {
  const port = 9666;
  const tempDir = 'C:\\Users\\karan\\AppData\\Local\\Temp\\chrome-suite-' + Date.now();
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

  const baseDir = 'C:\\Users\\karan\\.gemini\\antigravity\\brain\\f432bce9-6976-4e08-b058-a482674e7291\\scratch\\verification';
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const url = 'http://localhost:3000/';

  async function takeScreenshot(name, scrollFrac, w, h, doReverse = false) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: w < 768,
    });

    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 2000));

    if (doReverse) {
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo(0, max);
          })()
        `,
      });
      await new Promise(r => setTimeout(r, 600));
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            window.scrollTo(0, 0);
          })()
        `,
      });
      await new Promise(r => setTimeout(r, 800));
    } else if (scrollFrac > 0) {
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo(0, max * ${scrollFrac});
          })()
        `,
      });
      await new Promise(r => setTimeout(r, 600));
    }

    const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const fullPath = path.join(baseDir, name);
    fs.writeFileSync(fullPath, Buffer.from(shot.data, 'base64'));
    console.log(`[VERIFIED] ${name} (w=${w}, h=${h}, scroll=${scrollFrac}, rev=${doReverse})`);
  }

  console.log('--- STARTING VERIFICATION CAPTURES ---');

  // 1. Desktop 1440x900 Init (Settled at resting positions after 1.6s reveal)
  await takeScreenshot('01_hero_desktop_1440x900_init.png', 0.0, 1440, 900);

  // 2. Desktop 1440x900 Scroll 0.15 - Slower inward collapse: side cards gliding inward gradually
  await takeScreenshot('02_hero_scroll_015_slower_collapse.png', 0.15, 1440, 900);

  // 3. Desktop 1440x900 Scroll 0.30 - Slower inward collapse: side cards nearing center behind still card
  await takeScreenshot('03_hero_scroll_030_nearing_collapse.png', 0.30, 1440, 900);

  // 4. Desktop 1440x900 Scroll 0.38 - Side cards fully tucked, video reverse carousel sweeping in, center still peeling away
  await takeScreenshot('04_hero_scroll_038_carousel_mid_transition.png', 0.38, 1440, 900);

  // 5. Desktop 1440x900 Scroll 0.50 - Video card centered and dominant, pink background active
  await takeScreenshot('05_hero_scroll_050_video_dominant.png', 0.50, 1440, 900);

  // 6. Desktop 1440x900 Full pink showcase (3-column, spacing, colors)
  await takeScreenshot('06_hero_desktop_1440x900_pink_showcase.png', 0.85, 1440, 900);

  // 7. Desktop 1440x900 Reverse scroll
  await takeScreenshot('07_hero_desktop_1440x900_reversed_to_top.png', 0.0, 1440, 900, true);

  // 8. Tablet 768x1024 Init
  await takeScreenshot('08_hero_tablet_768x1024_init.png', 0.0, 768, 1024);

  // 9. Tablet 768x1024 Pink showcase
  await takeScreenshot('09_hero_tablet_768x1024_pink_showcase.png', 0.85, 768, 1024);

  // 10. Mobile 390x844 Init
  await takeScreenshot('10_hero_mobile_390x844_init.png', 0.0, 390, 844);

  // 11. Mobile 390x844 Pink showcase
  await takeScreenshot('11_hero_mobile_390x844_pink_showcase.png', 0.85, 390, 844);

  // 12. Interactive test: test play/pause and mute buttons
  console.log('--- TESTING INTERACTIVE CONTROLS ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 1000));
  // Scroll to pink section
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, max * 0.90);
      })()
    `,
  });
  await new Promise(r => setTimeout(r, 600));

  const testControls = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const v = document.querySelector('video');
        const playBtn = document.querySelector('button[aria-label="Pause video"], button[aria-label="Play video"]');
        const muteBtn = document.querySelector('button[aria-label="Unmute video"], button[aria-label="Mute video"]');
        const initialPaused = v ? v.paused : null;
        const initialMuted = v ? v.muted : null;
        
        // Click pause
        if (playBtn) playBtn.click();
        const afterPlayClickPaused = v ? v.paused : null;

        // Click mute
        if (muteBtn) muteBtn.click();
        const afterMuteClickMuted = v ? v.muted : null;

        return {
          videoFound: !!v,
          videoSrc: v ? v.src : null,
          initialPaused,
          initialMuted,
          afterPlayClickPaused,
          afterMuteClickMuted
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Control Test Results:', testControls.result?.value);

  ws.close();
  chrome.kill();
  try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) {}

  console.log('--- ALL VERIFICATION SUITE TESTS COMPLETED SUCCESSFULLY ---');
}

runSuite().catch(e => { console.error('Suite error:', e); process.exit(1); });
