const {click,text,below,above,checkBox,toLeftOf,fileField, attach,$} = require('taiko');

var users = require("../util/users")
const taikoHelper = require("../util/taikoHelper");
const gaugeHelper=require("../util/gaugeHelper")
const path = require('path');
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoAssert = require('../../../components/taikoAssert.js');
const taikoElement = require('../../../components/taikoElement.js');

var searchElement='//button[contains(text(),"Search")]'
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
var closeNotification='//button[@title="closes notification"]'
var implicitTimeOut = parseInt(process.env.implicitTimeOut)
var datapath=process.env.dataPath

step("start patient search", async function () {
    await taikoInteraction.Click('//button[@aria-label="Search Patient"]','xpath')
});

step("enter the patient name in lablite", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'xpath',labLiteSearch);
    await taikoInteraction.Click(searchElement,'xpath')
});

step("Select the patient in lablite search result", async function () {
    var patientFullName = gaugeHelper.get("patientFullName");
    await taikoElement.waitToExists(text(foundElement))
    await taikoInteraction.Click(patientFullName,'text')
});

step("Verify test prescribed is displayed on Pending Lab Orders table", async function () {
    var labTest = gaugeHelper.get("LabTest")
    await taikoHelper.wait(implicitTimeOut)
    await taikoAssert.assertExists(text(labTest))
});

step("Open upload report side panel", async function () {
    await taikoInteraction.Click(uploadReport,'text')
});

step("Select prescribed test in Pending Lab Orders table", async function () {
    var labTest = gaugeHelper.get("LabTest")
    await checkBox(below(pendingLabOrder), above(uploadReport), toLeftOf(labTest)).check();
});

step("Select Lab Report in side panel", async function () {
    var labReportFile = "labReport1.jpg";
    gaugeHelper.save("labReportFile", labReportFile)
    await attach(path.join(`./bahmni-e2e-common-flows/data/${datapath}/reports/` + labReportFile), fileField(above(text("Report Date"))), { waitForEvents: ['DOMContentLoaded'] });
});

step("Select today's date in Report Date Field", async function () {
    if(await taikoElement.isExists($(closeNotification))){
        await taikoInteraction.Click(closeNotification,'xpath')
    }
    await taikoInteraction.Click(reportDate,'xpath')
    var currentDate=new Date()
    var today=currentDate.getDate()
    await taikoInteraction.Click(today.toString(),'text')

});

step("Select Doctor in side panel", async function () {
    await taikoInteraction.Dropdown(below(requestedBy),doctor)
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
    await taikoAssert.assertExists($(file))
    await taikoInteraction.Click('//button[@aria-label="close"]','xpath')
});


step("Click Home button on lab-lite", async function() {
    await taikoInteraction.Click('//button[@aria-label="Home"]','xpath')
});

step("Verify order is removed from Pending lab orders table", async function() {
    var labTest = gaugeHelper.get("LabTest")
    await taikoAssert.assertNotExists(text(labTest,above(uploadReport)))
});