const pp = require('C:/Users/Administrator/AppData/Roaming/npm/node_modules/puppeteer');
const fs = require('fs');
const http = require('http');

function getToken() {
  return new Promise((resolve) => {
    const data = JSON.stringify({ username: 'admin', password: 'admin123' });
    const req = http.request({ hostname: 'localhost', port: 8000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, (res) => {
      let body = ''; res.on('data', c => body += c); res.on('end', () => { try { resolve(JSON.parse(body).token); } catch { resolve(null); } });
    });
    req.on('error', () => resolve(null)); req.write(data); req.end();
  });
}

// Check if API has real data
function checkAPI() {
  return new Promise((resolve) => {
    http.get('http://localhost:8000/api/stats', (res) => {
      let body = ''; res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const d = JSON.parse(body);
          resolve({ ok: d.total_devices > 0 && d.total_collects > 100, devices: d.total_devices, collects: d.total_collects });
        } catch { resolve({ ok: false }); }
      });
    }).on('error', () => resolve({ ok: false }));
  });
}

(async () => {
  // Check API data first
  const api = await checkAPI();
  console.log(`API: ${api.devices}dev ${api.collects}collects ${api.ok?'OK':'NO_DATA'}`);
  if (!api.ok) { console.log('No data in API - start simulators first!'); return; }

  const token = await getToken();
  if (!token) { console.log('Cannot get token'); return; }

  const b = await pp.launch({ headless: 'new', executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1920, height: 1080 });
  await pg.evaluateOnNewDocument((t) => { localStorage.setItem('dgiot_token', t); localStorage.setItem('dgiot_user', 'admin'); }, token);

  const dir = 'D:/ai/dgiot_lite/output/screenshots/';

  // Pages to capture with wait conditions
  const captures = [
    { name: '01-dashboard', url: '/#/dashboard', waitFor: '.kpi-value', waitMs: 8 },
    { name: '02-devices', url: '/#/devices', waitFor: '.el-table__body', waitMs: 6 },
    { name: '03-device-inv01', url: '/#/devices/inv_01', waitFor: '.el-descriptions', waitMs: 6 },
    { name: '04-channels', url: '/#/channels', waitFor: '.ch-card', waitMs: 6 },
    { name: '05-scada', url: '/#/scada', waitFor: '#scada-fabric-canvas', waitMs: 5 },
    { name: '06-alarms', url: '/#/alarms', waitFor: '.el-table__body', waitMs: 6 },
    { name: '07-telemetry', url: '/#/telemetry', waitFor: '.el-table__body', waitMs: 6 },
    { name: '08-topology', url: '/#/topology', waitFor: '#topoCanvas', waitMs: 5 },
    { name: '09-products', url: '/#/products', waitFor: '.prod-card', waitMs: 5 },
    { name: '10-simulators', url: '/#/simulators', waitFor: '.sim-card', waitMs: 6 },
    { name: '11-health', url: '/#/health', waitFor: '.svc-card', waitMs: 5 },
    { name: '12-users', url: '/#/users', waitFor: '.el-table__body', waitMs: 4 },
    { name: '13-running', url: '/#/running', waitFor: '.run-card', waitMs: 6 },
    { name: '14-device-cmd', url: '/#/device-cmd', waitFor: '.el-select', waitMs: 5 },
    { name: '15-mqtt-tool', url: '/#/mqtt-tool', waitFor: '.el-card', waitMs: 4 },
    { name: '16-maintenance', url: '/#/maintenance', waitFor: '.el-table__body', waitMs: 5 },
    { name: '17-grafana', url: '/#/grafana', waitFor: '.kpi-value', waitMs: 8 },
    { name: '18-login', url: '/#/login', waitFor: '.login-card', waitMs: 3 },
  ];

  for (const { name, url, waitFor, waitMs } of captures) {
    console.log(`${name}...`);
    await pg.goto('http://localhost:8000' + url, { waitUntil: 'networkidle2', timeout: 20000 });
    // Wait for key DOM element
    try { await pg.waitForSelector(waitFor, { timeout: 10000 }); } catch {}
    // Extra wait for charts/data to render
    await new Promise(r => setTimeout(r, waitMs * 1000));
    await pg.screenshot({ path: dir + name + '.png', fullPage: true });
    const sz = Math.round(fs.statSync(dir + name + '.png').size / 1024);
    console.log(`  -> ${sz}KB`);
  }

  await b.close();
  console.log('Done: 18 screenshots with data verification');
})();
