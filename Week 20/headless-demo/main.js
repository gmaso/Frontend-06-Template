const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'google-chrome' });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/main.html');
  // await page.screenshot({ path: 'example.png' });
  const imgs = await page.$$('a');
  console.log(imgs.length);
  await browser.close();
})();