const {
    openBrowser,
    closeBrowser,
    screenshot,
    reload,
    setConfig,
    closeTab,
    $,
    video,
    waitFor
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
    await manageUsers.setRoles()
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
    const browserOptions = { headless: headless, args: ["--no-sandbox", "--disable-dev-shm-usage", '--use-fake-ui-for-media-stream', "--window-size=1440,900"] }
    try {
        await openBrowser(browserOptions)
    }
    catch (e) {
        await closeBrowser();
        await openBrowser(browserOptions)
    }
    await setConfig({ ignoreSSLErrors: true });
    // video generated is not helping.. if more than one tests are ran then the most of the time the failed output video is having some random images.
    // if (process.env.record_video) {
    //     let scenarioName = context.currentScenario.name;
    //     let videoDir = process.env.video_file_path + '/' + scenarioName.replace(/ /g, "_")
    //     gauge.dataStore.scenarioStore.put("videoDir", videoDir)
    //     await video.startRecording(videoDir + '/video.mp4', 5);
    // }
}, { tags: ['ui'] });

afterScenario(async (context) => {
    // if (process.env.record_video) {
    //     let videoDir = gauge.dataStore.scenarioStore.get("videoDir")
    //     try {
    //         if (!context.currentScenario.isFailed) {
    //             fileExtension.removeDir(videoDir);
    //             console.log("Video deleted for scenario - " + context.currentScenario.name)
    //         } else {
    //             await video.stopRecording();
    //             if (fileExtension.exists(videoDir)) {
    //                 console.log("Video successfully saved - " + videoDir + '/video.mp4')
    //             } else {
    //                 console.log("Video not successfully saved for scenario - " + context.currentScenario.name)
    //             }
    //         }
    //     } catch (e) {
    //         console.log("Error Stopping Video - " + e.message)
    //     }
    // }
    try {
        await closeBrowser();
    }
    catch (e) {
        console.log("Error closing browser - " + e.message)
    }
}, { tags: ['ui'] });