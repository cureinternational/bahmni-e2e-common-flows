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
    timeField,
    evaluate,
    above
} = require('taiko');
const taikoHelper = require("../util/taikoHelper")
const fileExtension = require("../util/fileExtension")
const path = require('path');
var assert = require("assert");
const { subscribe } = require('diagnostics_channel');

var overlay='#overlay'
var vitals='Vitals'
var vital='Vital'
var pulse='Pulse (beats/min)'
var addNewObsForm='Add New Obs Form'
var historyNotes='History Notes'
var notes1='textarea#observation_6'
var notes2='textarea#observation_19'
var smokingHistory='Smoking History'
var reportjpg='./bahmni-e2e-common-flows/data/consultation/observations/patientReport.jpg'
var report='//*[@class="consultation-image"]/input'
var reportVideo='./bahmni-e2e-common-flows/data/consultation/observations/Video.mp4'
var video='//*[@class="consultation-video"]/input'
var author='Author'
var comment='Comment'
var objective='Objective'
var assessment='Assessment'
var plan='Plan'
var comments='Comments'
var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
var fullName = gauge.dataStore.scenarioStore.get("patientFullName")
var cancel='Cancel'

step("Click Vitals", async function () {
    await waitFor(async () => (await text(vital).exists()))
    await highlight(vitals)
    await click(vitals, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout, force: true })
    await taikoHelper.repeatUntilNotFound($(overlay))
    await waitFor(async () => (await text(pulse).exists()))
});

step("Enter History and examination details <filePath>", async function (filePath) {
    var historyAndExaminationFile = `./bahmni-e2e-common-flows/data/${filePath}.json`
    var historyAndExaminationDetails = JSON.parse(fileExtension.parseContent(historyAndExaminationFile))
    gauge.dataStore.scenarioStore.put("historyAndExaminationDetails", historyAndExaminationDetails)
    if (!await link(historyAndExaminationDetails.ObservationFormName).exists(500, 1000)) {
		await click(addNewObsForm, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
		await scrollTo(button(historyAndExaminationDetails.ObservationFormName))
		await click(button(historyAndExaminationDetails.ObservationFormName));
	} else {
		await scrollTo(button(historyAndExaminationDetails.ObservationFormName))
		await click(link(historyAndExaminationDetails.ObservationFormName));
	}
    await taikoHelper.repeatUntilNotFound($(overlay))
    await waitFor(async () => (await text(historyNotes).exists()))
    await write(historyAndExaminationDetails.History_Notes, into($(notes1)));
    await write(historyAndExaminationDetails.History_Notes, into($(notes2)));
    await click(historyAndExaminationDetails.Smoking_status, toRightOf(smokingHistory));
    await attach(path.join(reportjpg), to($(report)), { force: true });
    await attach(path.join(reportVideo), to($(video)), { force: true });
});

step("Enter Orthopaedic followup <filePath>", async function (filePath) {
    var followup = `./bahmni-e2e-common-flows/data/${filePath}.json`

    var followupdetails = JSON.parse(fileExtension.parseContent(followup))
    gauge.dataStore.scenarioStore.put("orthopaedicfollowupdetails", followupdetails)

    if (!await link(followupdetails.ObservationFormName).exists(500, 1000)) {
		await click(addNewObsForm, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
		await scrollTo(button(followupdetails.ObservationFormName))
		await click(button(followupdetails.ObservationFormName));
	} else {
		await scrollTo(button(followupdetails.ObservationFormName))
		await click(link(followupdetails.ObservationFormName));
	}
    await taikoHelper.repeatUntilNotFound($(overlay))

    await dropDown(toRightOf(author)).select(followupdetails.author)
    await write(followupdetails.comment, into(textBox(toRightOf(comment))));
    await write(followupdetails.subjective, into(textBox(toRightOf(subjective))));
    await write(followupdetails.objective, into(textBox(toRightOf(objective))));
    await write(followupdetails.assessment, into(textBox(toRightOf(assessment))));
    await write(followupdetails.plan, into(textBox(toRightOf(plan))));
    await write(followupdetails.comment, into(textBox(toRightOf(comments))));

});


step("Click patient name", async function () {
    await scrollTo($(`//div[@class='fc-title' and contains(text(),'${firstName}')]`))
    await evaluate($(`//div[@class='fc-title' and contains(text(),'${firstName}')]`), (el) => el.click())
    var btnstatus= await button(cancel).isDisabled()
    if(btnstatus)
    {
        var patientid=gauge.dataStore.scenarioStore.get("patientIdentifier")
        var patientName=gauge.dataStore.scenarioStore.get("patientFullName")
        await dropDown("Patient:").select(patientName+" ("+patientid+")")
    }
});

step("Should not find the patient's name", async function () {
    assert.ok(!await text(fullName).exists())
});


step("Click patient name from waitlist", async function () {
    await click(text(fullName))
});  