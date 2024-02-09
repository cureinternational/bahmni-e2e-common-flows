const {
    openBrowser,
    closeBrowser,
    screenshot,
    reload,
    setConfig,
    closeTab,
    $,
    video,
    waitFor,
    getConfig,
    goto
} = require('taiko');
const path = require('path');
const console = require('console');
const logHelper = require('./logHelper');
const headless = process.env.headless_chrome.toLowerCase() === 'true';



gauge.customScreenshotWriter = async function () {
    const screenshotFilePath = path.join(process.env['gauge_screenshots_dir'],
        `screenshot-${process.hrtime.bigint()}.png`);

    await screenshot({
        path: screenshotFilePath
    });
    return path.basename(screenshotFilePath);
};

step('reload the page', async function () {
    await reload({ waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step('close tab', async function () {
    await closeTab()
});

beforeScenario(async (context) => {
    const browserOptions = { headless: headless, args: ['--no-sandbox','--disable-gpu','--disable-setuid-sandbox','--no-first-run','--no-zygote','--disable-dev-shm-usage', '--use-fake-ui-for-media-stream', '--window-size=1440,900'],'ignoreCertificateErrors':true,'secure':false }
    try {
        await openBrowser(browserOptions)
    }
    catch (e) {
        await closeBrowser();
        logHelper.info('Error opening new browser - ' + e.message)
        await openBrowser(browserOptions)
    }
    await setConfig({ ignoreSSLErrors: true ,retryTimeout:parseInt(process.env.retryTimeout),waitForNavigation: true,navigationTimeout:parseInt(process.env.actionTimeout)});

}, { tags: ['ui'] });

afterScenario(async (context) => {
    try {
        await waitFor(2000)
        console.log('< '+'='.repeat(30)+' >')
        await closeBrowser();
    }
    catch (e) {
        logHelper.info('Error closing the existing browser - ' + e.message)
    }
}, { tags: ['ui'] });
