// dsh-mobile-check.cjs — dsh 公网入口 iPhone 视口截图验收
// 模拟 iPhone 15 (390×844, 3x DPR, 触摸)
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  );

  // ── 1. 扫码落地页(公开) ──
  console.log('📸 扫码页...');
  await page.goto('https://dsh.dgiotcloud.cn:48758/qr.html', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: 'dsh-mobile-qr.png' });

  // ── 2. dsh 主界面(带认证) ──
  // 凭据走环境变量 DSH_AUTH_USER / DSH_AUTH_PASS，禁止硬编码
  const authUser = process.env.DSH_AUTH_USER || '';
  const authPass = process.env.DSH_AUTH_PASS || '';
  if (!authUser || !authPass) {
    console.error('缺 DSH_AUTH_USER / DSH_AUTH_PASS 环境变量，跳过认证段');
    process.exit(1);
  }
  console.log('📸 主界面(认证)...');
  await page.authenticate({ username: authUser, password: authPass });
  await page.goto('https://dsh.dgiotcloud.cn:48758/', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  // SPA 插件加载等待
  await new Promise((r) => setTimeout(r, 6000));
  await page.screenshot({ path: 'dsh-mobile-main.png' });

  // 收集诊断:页面标题、控制台错误、横向溢出检测
  const diag = await page.evaluate(() => ({
    title: document.title,
    bodyWidth: document.body.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    overflowX: document.body.scrollWidth > document.documentElement.clientWidth,
  }));
  console.log('诊断:', JSON.stringify(diag, null, 2));

  await browser.close();
  console.log('完成: dsh-mobile-qr.png, dsh-mobile-main.png');
})().catch((e) => {
  console.error('失败:', e.message);
  process.exit(1);
});
