const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const path = require('path');

(async () => {
    const server = exec('node scripts/server.js'); // Замените команду на вашу

    await new Promise(resolve => setTimeout(resolve, 5000)); // Время может варьироваться

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    const element = await page.$('#screen-for-og-image');
    await element.screenshot({ path: path.resolve(__dirname, '../build/og-image.png') });

    await browser.close();
    server.kill();
})();
