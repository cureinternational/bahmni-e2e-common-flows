const {
    goto,
    $,
    click,
    below,
    highlight,
    text,
    waitFor,
    link,
    button,
    toRightOf,
    within,
    reload,
} = require('taiko');
var taikoHelper = require("./util/taikoHelper");
const taikobrowserActions=require("../../components/taikobrowserActions")
const taikoElement=require("../../components/taikoElement")
var users = require("./util/users")
const csvConfig = require("./util/csvConfig");
const gaugeHelper = require("./util/gaugeHelper");
const taikoInteraction = require('../../components/taikoInteraction');
var overlay='//div[@id="overlay" and @style="display: block;"]'

step("put first name <firstName> middle name <middleName> lastname <lastName>", async function (firstName, middleName, lastName) {
    gaugeHelper.save("patientFirstName", firstName);
    gaugeHelper.save("patientMiddleName", middleName);
    gaugeHelper.save("patientLastName", lastName);
});

step("put randomly generated names for patient", async function () {
    var firstName = users.randomName(8)
    gauge.message(`firstName ${firstName}`)
    gaugeHelper.save("patientFirstName", firstName)

    var middleName = users.randomName(8)
    gauge.message(`middleName ${middleName}`)
    gaugeHelper.save("patientMiddleName", middleName);

    var lastName = users.randomName(8)
    gauge.message(`firstName ${lastName}`)
    gaugeHelper.save("patientLastName", lastName);
});

step("Goto Clinical application", async function () {
    try {
        await taikobrowserActions.navigateTo(process.env.bahmniHome);
    } catch (e) {
      console.log(e+" error in navigating to clinical application")
    }
});

step("Goto Bahmni main home", async function () {
    await goto(process.env.bahmniHost, { waitForNavigation: true, waitForEvents: ['networkIdle'], navigationTimeout: process.env.actionTimeout });
});

step("Open <appName> app", async function (appName) {
    await highlight(appName)
    await click(appName.toUpperCase(), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Check if <appName> app is opened", async function (appName) {
    if (!await taikoElement.isPresent(appName))
        return
    gauge.message("App name exists")
    await taikoInteraction.Click(appName.toUpperCase())
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("wait for overlay to disappear", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("wait for overlay and Saved to disappear", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await waitFor(async () => !(await text("Saved", within('.message-text')).exists()));
});

step("Log out of openmrs", async function () {
    await click(link("Log out"))
});

step("Wait for message <message> to disappear", async function (message) {
    await waitFor(async () => !(await text(message).exists()))
});

step("put doctor first name <doctorFirstName> middle name <doctorMiddleName> lastname <doctorLastName>", async function (doctorFirstName, doctorMiddleName, doctorLastName) {
    gaugeHelper.save("doctorFirstName", doctorFirstName);
    gaugeHelper.save("doctorMiddleName", doctorMiddleName);
    gaugeHelper.save("doctorLastName", doctorLastName);
});

step("Choose a random uploaded patient identifier", async function () {
    //var recordLength=gaugeHelper.get("fileDataLength")-1;
    let recordSeq = 0;
    const recordAsJson = (await csvConfig.getCSVasJson("patient"))[recordSeq];

    // await taikoHelper.selectEntriesTillIterationEnds(recordSeq);
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier" + (recordSeq));
    gaugeHelper.save("patientIdentifier", patientIdentifierValue);
    gaugeHelper.save("patientFirstName",gaugeHelper.get("patientFirstName" + (recordSeq)));
    gaugeHelper.save("patientMiddleName",gaugeHelper.get("patientMiddleName" + (recordSeq)));
    gaugeHelper.save("patientLastName",gaugeHelper.get("patientLastName" + (recordSeq)));
    gaugeHelper.save("patientFullName",gaugeHelper.get("patientFullName" + (recordSeq)));
});