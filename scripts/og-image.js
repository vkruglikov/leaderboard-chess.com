const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
    const server = spawn('node', ['scripts/server.js'], { stdio: 'inherit' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    const element = await page.$('#screen-for-og-image');
    await element.screenshot({ path: path.resolve(__dirname, '../build/og-image.png') });

    await browser.close();
    process.kill(server.pid, 'SIGKILL');
})();
