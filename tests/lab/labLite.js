const {click,button,text,below,above,highlight,checkBox,toLeftOf,fileField, attach,$} = require('taiko');
var assert = require("assert");

var users = require("../util/users")
const taikoHelper = require("../util/taikoHelper");
const gaugeHelper=require("../util/gaugeHelper")
const path = require('path');
const taikoInteraction = require('../../../components/taikoInteraction');
const taikoAssert = require('../../../components/taikoAssert');
const taikoElement = require('../../../components/taikoElement');

var search='Search'
var foundElement='Found 1 patient'
var pendingLabOrder='Pending Lab Orders'
var test='Tests'
var uploadReport='Upload Report'
var reportDate='#reportDate'
var todayElement='//SPAN[contains(@class,"today")]'
var doctor = users.getUserNameFromEncoding(process.env.doctor);
var requestedBy='Requested by'
var saveAndUpload='Save and Upload'
var reportSuccessMessageElement='//H3[text()="Report successfully uploaded"]'
var reportsTable='Reports Table'
var labLiteSearch='//input[@role="searchbox"]'
var implicitTimeOut = parseInt(process.env.implicitTimeOut)

step("start patient search", async function () {
    await click(button({ "aria-label": "Search Patient" }))
});

step("enter the patient name in lablite", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'xpath',labLiteSearch);
    await taikoInteraction.Click(search,'button')
});

step("Select the patient in lablite search result", async function () {
    var patientFullName = gaugeHelper.get("patientFullName");
    await taikoInteraction.Click(patientFullName,'text')
});

step("Verify test prescribed is displayed on Pending Lab Orders table", async function () {
    var labTest = gaugeHelper.get("LabTest")
    await taikoHelper.wait(implicitTimeOut)
    await taikoAssert.assertExists(text(labTest))
});

step("Open upload report side panel", async function () {
    await click(uploadReport);
});

step("Select prescribed test in Pending Lab Orders table", async function () {
    var labTest = gaugeHelper.get("LabTest")
    await checkBox(below(pendingLabOrder), above(uploadReport), toLeftOf(labTest)).check();
});

step("Select Lab Report in side panel", async function () {
    var labReportFile = "labReport1.jpg";
    gaugeHelper.save("labReportFile", labReportFile)
    await attach(path.join('./bahmni-e2e-common-flows/data/reports/' + labReportFile), fileField(above(text("Report Date"))), { waitForEvents: ['DOMContentLoaded'] });
});

step("Select today's date in Report Date Field", async function () {
    await click($(reportDate))
    await click($(todayElement))
});

step("Select Doctor in side panel", async function () {
    await dropDown(below(requestedBy)).select(doctor);
});

step("Upload and verify the reports table", async function () {
    var labTest = gaugeHelper.get("LabTest")
    var labReportFile = gaugeHelper.get("labReportFile")
    await taikoInteraction.Click(saveAndUpload,'button')
    await taikoHelper.repeatUntilNotFound($(reportSuccessMessageElement));
    await taikoAssert.assertExists(text(labReportFile))
});

step("Verify the uploaded report", async function () {
    var labReportFile = gaugeHelper.get("labReportFile")
    await click(labReportFile);
    var file='//DIV[contains(@class,"is-visible")]//IMG/../../..//h3[text()="' + labReportFile +' "]'
    await highlight($(file))
    await highlight($("//DIV[contains(@class,'is-visible')]//IMG"))
    assert.ok(await $(file).exists());
    await click(button({ "aria-label": "close" }));
});


step("Click Home button on lab-lite", async function() {
    await taikoInteraction.Click('//button[@aria-label="Home"]','xpath')
});

step("Verify order is removed from Pending lab orders table", async function() {
    var labTest = gaugeHelper.get("LabTest")
    assert.ok(!await text(labTest,above(uploadReport)).exists(500,1000));
});