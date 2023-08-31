const {
    click,
    button,
    text,
    press,
    write,
    waitFor,
    below,
    into,
    above,
    highlight,
    checkBox,
    toLeftOf,
    fileField,
    timeField,
    attach,
    image,
    $,
    within
} = require('taiko');
var assert = require("assert");
var fileExtension = require("../util/fileExtension");
var date = require("../util/date");
var users = require("../util/users")
const taikoHelper = require("../util/taikoHelper");
const gaugeHelper=require("../util/gaugeHelper")
const { link } = require('fs');
const path = require('path');
const taikoInteraction = require('../../../components/taikoInteraction');

var search='Search'
var foundElement='Found 1 patient'
var pendingLabOrder='Pending Lab Orders'
var test='Test'
var uploadReport='Upload Report'
var reportDate='#reportDate'
var todayElement='//SPAN[contains(@class,"today")]'
var doctor = users.getUserNameFromEncoding(process.env.doctor);
var requestedBy='Requested by'
var saveAndUpload='Save and Upload'
var reportSuccessMessageElement='//H3[text()="Report successfully uploaded"]'
var reportsTable='Reports Table'

step("start patient search", async function () {
    await click(button({ "aria-label": "Search Patient" }))
});

step("enter the patient name in lablite", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'xpath', { "placeholder": "Search for a patient by name or identifier number" });
    await taikoInteraction.Click(search,'button')
    await click(button(search))
});

step("Select the patient in lablite search result", async function () {
    var patientFirstName = gaugeHelper.get("patientFirstName");
    var patientMiddleName = gaugeHelper.get("patientMiddleName");
    var patientLastName = gaugeHelper.get("patientLastName");
    assert.ok(await text(foundElement).exists())
    await click(`${patientFirstName} ${patientMiddleName} ${patientLastName}`)
});

step("Verify test prescribed is displayed on Pending Lab Orders table", async function () {
    var labTest = gaugeHelper.get("LabTest")
    await highlight(text(labTest, below(pendingLabOrder), below(test), above(uploadReport)))
    assert.ok(await text(labTest, below(pendingLabOrder), below(test), above(uploadReport)).exists())
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
    await click(button(saveAndUpload));
    await taikoHelper.repeatUntilNotFound($(reportSuccessMessageElement));
    await highlight(text(labTest, below(reportsTable), below(test), toLeftOf(labReportFile)))
    assert.ok(await text(labTest, below(reportsTable), below(test), toLeftOf(labReportFile)).exists());
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
	await click(button({ "aria-label": "Home" }));
});

step("Verify order is removed from Pending lab orders table", async function() {
    var labTest = gaugeHelper.get("LabTest")
    assert.ok(!await text(labTest,above(uploadReport)).exists(500,1000));
});