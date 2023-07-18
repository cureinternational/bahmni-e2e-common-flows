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
    getConfig
} = require('taiko');
const path = require('path');
const taikoHelper = require("../util/taikoHelper");
const console = require('console');
const fileExtension = require("../util/fileExtension")
const manageUsers = require("../util/requestResponse")
const headless = process.env.headless_chrome.toLowerCase() === 'true';

beforeSuite(async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    // try {
    //     fileExtension.removeDir(process.env.video_file_path);
    // } catch (e) {
    //     console.log("Error Deleting directory - " + process.env.video_file_path + ". Error message - " + e.message)
    // }
   // await manageUsers.setRoles()
});

afterSuite(async () => {
});

// Return a screenshot file name
gauge.customScreenshotWriter = async function () {
    const screenshotFilePath = path.join(process.env['gauge_screenshots_dir'],
        `screenshot-${process.hrtime.bigint()}.png`);

    await screenshot({
        path: screenshotFilePath
    });
    return path.basename(screenshotFilePath);
};

step("reload the page", async function () {
    await reload({ waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("close tab", async function () {
    await closeTab()
});

beforeScenario(async (context) => {
    const browserOptions = { headless: headless, args: ["--no-sandbox", "--disable-dev-shm-usage", '--use-fake-ui-for-media-stream', "--window-size=1440,900"],"ignoreCertificateErrors":true,"secure":false }
    try {
        await openBrowser(browserOptions)
    }
    catch (e) {
        await closeBrowser();
        console.log("Error opening new browser - " + e.message)
        await openBrowser(browserOptions)
    }
    await setConfig({ ignoreSSLErrors: true ,retryTimeout:30000,waitForNavigation: true});
}, { tags: ['ui'] });

afterScenario(async (context) => {
    try {
        await waitFor(2000)
        await closeBrowser();
    }
    catch (e) {
        console.log("Error closing the existing browser - " + e.message)
    }
}, { tags: ['ui'] });