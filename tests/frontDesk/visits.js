/* globals gauge*/
"use strict";
const {
    $,
    click,
    button,
    toRightOf,
    text,
    toLeftOf,
    within,
    write,
    into,
    textBox,
    press,
    waitFor,
    scrollTo,
    highlight,
    link,
    below,
    evaluate
} = require('taiko');
const taikoHelper = require("../util/taikoHelper")
var fileExtension = require("../util/fileExtension")
var assert = require('assert');

step("Click Start IPD Visit", async function () {
    await scrollTo("Start OPD Visit")
    await click(button(toRightOf('Start OPD Visit'), within($(".submit-btn-container"))));
    await click('Start IPD visit', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Click Start OPD Visit", async function () {
    await scrollTo(`Start ${process.env.default_visit_type} visit`)
    await click(`Start ${process.env.default_visit_type} visit`, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Select the newly created patient with network idle", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue, into(textBox({ "placeholder": "Search Name/Patient Identifier  ..." })))
    await click('Search', { waitForNavigation: true, waitForEvents: ['networkIdle'], navigationTimeout: process.env.mergeTimeout });
});

step("Select the newly created patient for IP", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue)
    await press("Enter", { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("Select the newly created patient for IP Admission", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue)
    await press("Enter", { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("Select the newly created patient for IP Discharge", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue)
    await click("Search", { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("Search the newly created patient", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue, into(textBox({ "placeholder": "Search Name/Patient Identifier  ..." })))
    await click('Search', { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("verify name with id", async function () {
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
    var middleName = gauge.dataStore.scenarioStore.get("patientMiddleName")
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");

    assert.ok(await (await text(`${firstName} ${lastName} (${patientIdentifierValue})`, toLeftOf(gauge.dataStore.scenarioStore.get("patientGender")))).exists())
});

step("verify OPD", async function () {
    //    await highlight("23 Feb 22",toLeftOf("OPD"));
});

step("Verify medical prescription in patient clinical dashboard", async function () {
    await taikoHelper.repeatUntilNotFound($(".dashboard-section-loader"))
    var prescriptionCount = gauge.dataStore.scenarioStore.get("prescriptionsCount")
    for (var i = 0; i < prescriptionCount; i++) {
        var prescriptionFile = gauge.dataStore.scenarioStore.get("prescriptions" + i)
        var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
        assert.ok(await text(medicalPrescriptions.drug_name, within($("#Treatments"))).exists())
        assert.ok(await text(`${medicalPrescriptions.dose} ${medicalPrescriptions.units}, ${medicalPrescriptions.frequency}`, within($("#Treatments"))).exists())
        assert.ok(await text(`${medicalPrescriptions.duration} Day(s)`, within($("#Treatments"))).exists())
    }
});


step("Verify vitals", async function () {
    var vitalFormValues = gauge.dataStore.scenarioStore.get("Vitals")
    for (var vitalFormValue of vitalFormValues.ObservationFormDetails) {
        if (vitalFormValue.type == 'Group') {
            for (var vitalFormGroup of vitalFormValue.value) {
                assert.ok(await text(vitalFormGroup.value, within($("#Vitals-Flow-Sheet")), toRightOf(vitalFormGroup.short_name)).exists())
            }
        }
        else {
            assert.ok(await text(vitalFormValue.value, within($("#Vitals-Flow-Sheet")), toRightOf(vitalFormValue.short_name)).exists())
        }
    };
});

step("Verify diagnosis in patient clinical dashboard", async function () {
    var medicalDiagnosis = gauge.dataStore.scenarioStore.get("medicalDiagnosis")
    assert.ok(await text(medicalDiagnosis.diagnosis.diagnosisName, toLeftOf(medicalDiagnosis.diagnosis.certainty, toRightOf(medicalDiagnosis.diagnosis.order)), within($("#Diagnosis"))).exists())
});

step("Verify condition in patient clinical dashboard", async function () {
    var medicalDiagnosis = gauge.dataStore.scenarioStore.get("medicalDiagnosis")
    var medicalConditions = medicalDiagnosis.condition
    for (var condition of medicalConditions) {
        if (condition.status != "Inactive") {
            assert.ok(await text(condition.conditionName, below(condition.status), within($("#Conditions"))).exists())
        }
    }
});

step("Verify history & examination in patient clinical dashboard", async function () {
    var historyAndExaminationDetails = gauge.dataStore.scenarioStore.get("historyAndExaminationDetails")
    assert.ok(await text(`${historyAndExaminationDetails.Chief_Complaints[0].Chief_Complaint} since ${historyAndExaminationDetails.Chief_Complaints[0].Sign_symptom_duration} ${historyAndExaminationDetails.Chief_Complaints[0].Units}`, toRightOf("Chief Complaint"), within($("#History-and-Examinations"))).exists())
    assert.ok(await text(`${historyAndExaminationDetails.History_Notes}`, within($("#History-and-Examinations")), toRightOf("Examination Notes")).exists())
    assert.ok(await text(`${historyAndExaminationDetails.Smoking_status}`, within($("#History-and-Examinations")), toRightOf("Smoking History")).exists())
    assert.ok(await $("//a[@class='img-concept']/img").exists(), "Image not displayed on history & examination");
    await scrollTo($("//a[@class='img-concept']/img"));
    await click($("//a[@class='img-concept']/img"));
    await waitFor(async () => await $(".slide").isVisible())
    assert.ok(await $(".slide").isVisible(), "Image not opened.");
    await evaluate($(`//button[@class='dialog-close-btn']/i`), (el) => el.click())
    await waitFor(10000)
    assert.ok(await $(`.obs-play-btn`).exists(), "Play button is not available");
    await scrollTo($(`.obs-play-btn`));
    await click($(`.obs-play-btn`));
    assert.ok(await $(`.video-dialog`).isVisible(), "Video is not opened.");
    await evaluate($(`//*[@class='ngdialog-close clearfix']`), (el) => el.click())
    await click($('.back-btn'), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Verify consultation notes in patient clinical dashboard", async function () {
    var consultationNote = gauge.dataStore.scenarioStore.get("consultationNotes")
    await click(link(toLeftOf(text("OPD")), within($("#Visits"))))
    assert.ok(await text(consultationNote, within($("#observation-section")), toRightOf("consultation note")).exists())
});

step("Validate the lab tests are available in patient clinical dashboard", async function () {
    var labTest = gauge.dataStore.scenarioStore.get("LabTest")
    assert.ok(await text(labTest, within($("#Lab-Results"))).exists())
});

step("Verify no error displayed on page", async function () {
    assert.equal(await $("//DIV[@class='message-container error-message-container']").exists(500, 1000), false, "Error displayed on page.")
});

step("Validate obs <form> on the patient clinical dashboard", async function (formPath) {
    var obsFormValues = JSON.parse(fileExtension.parseContent(`./bahmni-e2e-common-flows/data/${formPath}.json`))
    gauge.dataStore.scenarioStore.put(obsFormValues.ObservationFormName, obsFormValues)
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await evaluate($("//SPAN[normalize-space()='" + obsFormValues.ObservationFormName.trim() + "']/..//i[@class='fa fa-eye']"), (el) => el.click())
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await taikoHelper.validateFormFromFile(obsFormValues.ObservationFormDetails, obsFormValues.ObservationFormName)
    await click($('.ngdialog-close'))
});