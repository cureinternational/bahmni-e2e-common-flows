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
    to,
    link,
    timeField
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
    await waitFor(async () => (await text('Pulse (beats/min)').exists()))
});

step("Enter History and examination details <filePath>", async function (filePath) {
    await click(link("History and Examination"), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    var historyAndExaminationFile = `./bahmni-e2e-common-flows/data/${filePath}.json`

    var historyAndExaminationDetails = JSON.parse(fileExtension.parseContent(historyAndExaminationFile))
    gauge.dataStore.scenarioStore.put("historyAndExaminationDetails", historyAndExaminationDetails)
    for (var chiefComplaint of historyAndExaminationDetails.Chief_Complaints) {
        await scrollTo("Chief Complaint")
        await write(chiefComplaint.Chief_Complaint, into(textBox(toRightOf("Chief Complaint"))));
        await click( link(chiefComplaint.Chief_Complaint));
        await write(chiefComplaint.Sign_symptom_duration, into($("//input[@type='number']")));
        await dropDown(toRightOf('for')).select(chiefComplaint.Units)
    }
    await write(historyAndExaminationDetails.History_Notes, into(textBox(toRightOf("History Notes"))));
    await click(historyAndExaminationDetails.Smoking_status, toRightOf("Smoking History"));
    await attach(path.join('./bahmni-e2e-common-flows/data/consultation/observations/patientReport.jpg'), to($("//*[@class='consultation-image']/input")), { force: true });
    await attach(path.join('./bahmni-e2e-common-flows/data/consultation/observations/Video.mp4'), to($("//*[@class='consultation-video']/input")), { force: true });
});

step("Enter Orthopaedic followup <filePath>", async function (filePath) {
    await click(link("Orthopaedic Followup"), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    var followup = `./bahmni-e2e-common-flows/data/${filePath}.json`

    var followupdetails = JSON.parse(fileExtension.parseContent(followup))
    gauge.dataStore.scenarioStore.put("orthopaedicfollowupdetails", followupdetails)
    await dropDown(toRightOf('Author')).select(followupdetails.author)
    await write(followupdetails.comment, into(textBox(toRightOf("Comment"))));
    await write(followupdetails.subjective, into(textBox(toRightOf("Subjective"))));
    await write(followupdetails.objective, into(textBox(toRightOf("Objective"))));
    await write(followupdetails.assessment, into(textBox(toRightOf("Assessment"))));
    await write(followupdetails.plan, into(textBox(toRightOf("Plan"))));
    await write(followupdetails.comment, into(textBox(toRightOf("Comments"))));

});

step("Click patient name", async function () {
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    await scrollTo(`${firstName}`)
    await click(`${firstName}`)
});

step("Should not find the patient's name", async function () {
    var fullName = gauge.dataStore.scenarioStore.get("patientFullName")
    assert.ok(!await text(fullName).exists())
});