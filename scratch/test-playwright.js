const { chromium } = require('playwright');

async function checkConsole() {
    console.log("Launching browser...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => {
        console.log(`[BROWSER CONSOLE - ${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', err => {
        console.log(`[BROWSER UNCAUGHT EXCEPTION] ${err.message}\nStack:\n${err.stack}`);
    });

    try {
        console.log("Navigating to http://localhost:3000 ...");
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
        console.log("Navigation complete. Waiting 5 seconds...");
        await page.waitForTimeout(5000);
    } catch (e) {
        console.error("Navigation error:", e.message);
    } finally {
        await browser.close();
        console.log("Browser closed.");
    }
}

checkConsole();
