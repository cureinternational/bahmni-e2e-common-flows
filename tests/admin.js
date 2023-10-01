"use strict";
const {
    write,
    above,
    dropDown,
    click,
    into,
    below,
    waitFor,
    checkBox,
    textBox,
    toLeftOf,
    alert,
    $,
    text,
    attach,
    dragAndDrop,
    accept,
    button,
    near,
    link,
    press,
    toRightOf,
    currentURL,
    radioButton,
    fileField
} = require('taiko');

const path = require('path');
var assert = require("assert");
var taikoHelper = require("./util/taikoHelper");
var users = require("./util/users");
const csvConfig = require("./util/csvConfig");
var date = require("./util/date");
var taikoitr=require("./../../components/taikoInteraction.js")
const gaugeHelper=require("./util/gaugeHelper")
const logHelper=require("./util/logHelper")
var overlay='//div[@id="overlay" and @style="display: block;"]'




step("Goto Bed creation", async function () {
    taikoitr.Click("text","Bed",false)
});

step("Goto Admin home", async function () {
    taikoitr.Click("link",toLeftOf('Admission Locations'),false)
});

step("Goto Dictionary", async function () {
    taikoitr.Click('text','Dictionary',false)
});

step("Open <submodule>", async function (submodule) {
    taikoitr.Click('default',submodule,false)
});

step("Open patient2 details by search", async function () {
    var patientIdentifierValue = gaugeHelper.get("merge_patientIdentifier2");
    gauge.message(patientIdentifierValue)
    taikowrite.writeText(patientIdentifierValue)
    taikointeractions.pressEnter()
    taikoHelper.repeatUntilNotFound($(overlay))
    taikoclick.clickLink(patientIdentifierValue)
});

step("Verify patient1 details are open", async function () {
    var patientIdentifier = await $('#patientIdentifierValue').text();
    var patientIdentifierValue = gaugeHelper.get("merge_patientIdentifier1");
    assert.ok(patientIdentifier == patientIdentifierValue)
});

step("Open Form builder", async function () {
    taikoclick.clickText("Form Builder")
});

step("Create a form", async function () {
    taikoclick.clickText('Create a Form')
});

step("Enter form name", async function () {
    var formName = users.randomName(10)
    gaugeHelper.save("FormName", formName)
    taikowrite.writeIntoTextAreaBelow("Form Name")    
});

step("start creating a form", async function () {
    taikoclick.clickText('Create Form')
});

step("put formname <formName>", async function (formName) {
    gaugeHelper.save("FormName", formName)
});

step("edit form <formName>", async function (formName) {
    await click(link(toRightOf(formName)))
});

step("create obs <obsName> <properties>", async function (obsName, properties) {
    await dragAndDrop("Obs", $(".form-builder-row"));
    await click("Select Obs Source")
    await write(obsName, into(textBox(below("Control Properties"))))
    await press('Enter')
    await click(obsName)
    for (var row of properties.rows) {
        await click(checkBox(toRightOf(row.cells[0])));
    }
});

step("create obs group <obsName>", async function (obsName) {
    await dragAndDrop("ObsGroup", $(".form-builder-row"));
    await click("Select ObsGroup Source")
    await write(obsName, into(textBox(below("Control Properties"))))
    await press('Enter')
});

step("create a section", async function () {
    await dragAndDrop("Section", $(".form-builder-row"));
});

step("Create a location <location> if it doesn't exist", async function (locationProperty) {
    var locationName = process.env[locationProperty].split(":")[0]
    var locationType = process.env[locationProperty].split(":")[1]
    if (await link(locationName).exists())
        return
    await click("Add Location")
    await write(locationName, into(textBox(toRightOf("Name"))))
    await click(checkBox(toLeftOf(locationType)))
    await click("Save Location", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
});

step("Add a new concept", async function () {
    await click("Add new concept", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("enter a concept name", async function () {
    var drugName = users.randomName(10)
    await write(drugName, into(textBox(above("Synonyms"), below("English"))));
    gaugeHelper.print("drugName",drugName)
    gaugeHelper.save("Drug Concept", drugName)
});

step("enter a description", async function () {
    await write("For automation", into(textBox(toRightOf("Description"), below("Short Name"))));
});

step("make it saleable", async function () {
    await click("True", toRightOf("saleable"));
});

step("select the type of concept being created as <conceptType>", async function (conceptType) {
    await dropDown(toRightOf("Class")).select(conceptType);
});

step("save the concept", async function () {
    await click("Save Concept");
});

step("Create a drug with more details", async function () {
    var _currentURL = await currentURL();
    var dosageForm = "Tablet";
    await click("Administration");
    await click("Manage Concept Drugs");
    await click("Add Concept Drug");
    var drugName = users.randomName(10)
    await write(drugName, into(textBox(toRightOf("Name"), above("Concept"))));
    gauge.print('Drug Name', drugName);
    gaugeHelper.save("Drug Name", drugName)
    var drugConcept = gaugeHelper.get("Drug Concept")
    await write(drugConcept, into(textBox({ placeHolder: "Enter concept name or id" })));
    await write(dosageForm, into(textBox(toRightOf("Dosage Form"), above("Strength"))));
    await click("Save Concept Drug");
});

step("Goto Manage Address Hierarchy", async function () {
    await click("Manage Address Hierarchy", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Goto reporting", async function () {
    await click("Reporting")
});

step("Goto Report Administration", async function () {
    await click("Report Administration")
});

step("Create Period Indicator Report", async function () {
    await click("Period Indicator Report")
    await write(users.randomName(10), $('input#name'))
    await click("Submit")
});

step("Add Period Indicator Details", async function () {
    await click("Add Dimension")
    await write(users.randomName(10), into(textBox(toRightOf("Key"))))
    await click("Submit")
});

step("Upload <profile> data file", async function (profile) {
    await radioButton(above(profile)).select();
    let max_Retry = 2
    while (max_Retry > 0) {
        try {
            await attach(await csvConfig.generateUpdatedCSV(profile), fileField({ id: "inputFileUpload" }));
            await waitFor(2000)
            await click(button("Upload"))
        }
        catch (e) {
            logHelper.error(e)
        }
        while (await text('IN_PROGRESS', near("Status"), toRightOf(profile.toLowerCase() + '.csv')).exists()) {
            await click(button("Refresh"));
        }
        if (await text('ERROR', near("Status"), toRightOf(profile.toLowerCase() + '.csv')).exists(0, 0)) {
            max_Retry = max_Retry - 1
        } else {
            max_Retry = 0
        }
    }
    assert.ok(await text('COMPLETED', near("Status"), toRightOf(profile.toLowerCase() + '.csv')).exists());
    alert(/^can not be represented as java.sql.Timestamp]9.*$/, async () => await accept())
});

step("Click Search Index", async function () {
    await click(link("Search Index"));
});

step("Click Rebuild Search Index", async function () {
    await click(button("Rebuild Search Index"));
    await waitFor(() => $("//*[@id='success']/p").isVisible(), 40000)
    assert.ok(await $("//*[@id='success']/p").isVisible());
});

step("Find <user> using name and open", async function (user) {
    await write(users.getUserNameFromEncoding(process.env[user]), into(textBox(toRightOf("Find User on Name"))));
    await click(button("Search"));
    await click(link(users.getUserNameFromEncoding(process.env[user])));
});

step("Give <role> to user", async function (role) {
    await checkBox(toLeftOf(role)).check();
    await click(button("Save User"));
});

step("Click on Audit log", async function () {
    await click("Audit Log");

});

step("Open Audit Log module", async function () {
    await click("Audit Log");
    await waitFor(10000);
});

step("Enter patientId", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await write(patientIdentifierValue, into(textBox(toRightOf("Patient ID "))));

});

step("Click on Filter", async function () {
    await click("Filter");
    await waitFor(10000);
});


step("Verify Event <message> in Audit log for the <user>", async function (strMessage, strUser) {
    var labReportFile = gaugeHelper.get("labReportFile")
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    var username = users.getUserNameFromEncoding(process.env[strUser]);
    var todayDate = date.getDateInLongFromat(date.today())
    var labTest = gaugeHelper.get("LabTest")
    strMessage = strMessage.replace('<user>', username)
        .replace('<patient>', patientIdentifierValue)
        .replace('<labReportFile>', labReportFile)
        .replace('<date>', todayDate)
        .replace("<labTest>", labTest);
    if (strMessage.includes(patientIdentifierValue)) {
        assert.ok(await text(strMessage, toRightOf(username), toRightOf(patientIdentifierValue)).exists());
    }
    assert.ok(await text(strMessage, toRightOf(username)).exists());
});