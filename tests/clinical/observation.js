"use strict";
const {
    click,
    waitFor,
    focus,
    toRightOf,
    textBox,
    text,
    into,
    write,
    $,
    dropDown,
    fileField,
    attach,
    scrollTo,
    reload,
    highlight,
    below,
    button,
    near,
    to
} = require('taiko');
const taikoHelper = require("../util/taikoHelper")
const fileExtension = require("../util/fileExtension")
const path = require('path');
var assert = require("assert");

step("Click Vitals", async function () {
    await waitFor(async () => (await text('Vital').exists()))
    await highlight("Vitals")
    await click("Vitals", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout, force: true })
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Enter History and examination details <filePath>", async function (filePath) {
    var historyAndExaminationFile = `./bahmni-e2e-common-flows/data/${filePath}.json`

    var historyAndExaminationDetails = JSON.parse(fileExtension.parseContent(historyAndExaminationFile))
    gauge.dataStore.scenarioStore.put("historyAndExaminationDetails", historyAndExaminationDetails)
    for (var chiefComplaint of historyAndExaminationDetails.Chief_Complaints) {
        await scrollTo("Chief Complaint")
        await write(chiefComplaint.Chief_Complaint, into(textBox(toRightOf("Chief Complaint"))));
        await click(chiefComplaint.Chief_Complaint, below(textBox(toRightOf("Chief Complaint"))));
        await write(chiefComplaint.Sign_symptom_duration, into($("//*[text()='Sign/symptom duration']//ancestor::div[@class='form-field-content-wrap']//input")));
        await click(button(chiefComplaint.Units), toRightOf("Units"));
    }
    await write(historyAndExaminationDetails.History_of_present_illness, into($("//*[text()='History of present illness']//ancestor::div[@class='form-field-content-wrap']//textarea")));
    await click(historyAndExaminationDetails.Smoking_status, toRightOf("Smoking status"));
    await attach(path.join('./bahmni-e2e-common-flows/data/consultation/observations/patientReport.jpg'), to($("//*[@class='image-upload']/input")), { force: true });
});

step("Click patient name", async function () {
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    await scrollTo(`${firstName}`)
    await click(`${firstName}`)
});

step("Should not find the patient's name", async function () {
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    assert.ok(!await text(`${firstName}`).exists())
});

