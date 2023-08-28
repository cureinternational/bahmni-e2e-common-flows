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

var startOpdVisit='Start OPD Visit'
var submitBtn='.submit-btn-container'
var startIpdVisit='Start IPD Visit'
var overlay='#overlay'
var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
var search='Search'
var enter= 'Enter'
var idElement='input#patientIdentifier'
var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
var patientGender=gauge.dataStore.scenarioStore.get("patientGender")
var dashboardLoader='.dashboard-section-loader'
var prescriptionCount = gauge.dataStore.scenarioStore.get("prescriptionsCount")
var treatments='#Treatments'
var addToDrugChart='Add to Drug Chart'
var vitalFormValues = gauge.dataStore.scenarioStore.get("Vitals")
var vitalFlowSheet='#Vitals-Flow-Sheet'
var medicalDiagnosis = gauge.dataStore.scenarioStore.get("medicalDiagnosis")
var diagnosisElement='#Diagnosis'
var historyAndExaminationDetails = gauge.dataStore.scenarioStore.get("historyAndExaminationDetails")
var historyExaminationElement='#History-and-Examinations'
var smokingHistory='Smoking History'
var img="//a[@class='img-concept']/img"
var slideElement='.slide'
var closeBtn='//button[@class="dialog-close-btn"]/i'
var obsPlyBtn='.obs-play-btn'
var videoDialog='.video-dialog'
var clearFix=`//*[@class='ngdialog-close clearfix']`
var backBtn='.back-btn'
var consultationNote = gauge.dataStore.scenarioStore.get("consultationNotes")
var opd='OPD'
var visitElement='#Visits'
var observationSection='#observation-section'
var consultationNoteElement='consultation note'
var labTest = gauge.dataStore.scenarioStore.get("LabTest")
var labResults='#Lab-Results'
var errorElement='//DIV[@class="message-container error-message-container"]'
var formClose='.ngdialog-close'

step("Click Start IPD Visit", async function () {
    await scrollTo(startOpdVisit)
    await click(button(toRightOf(startOpdVisit), within($(submitBtn))));
    await click(startIpdVisit, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click Start OPD Visit", async function () {
    await scrollTo(`Start ${process.env.default_visit_type} visit`)
    await click(`Start ${process.env.default_visit_type} visit`, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Select the newly created patient with network idle", async function () {
    await write(patientIdentifierValue, into(textBox({ "placeholder": "Search Name/Patient Identifier  ..." })))
    await click(search, { waitForNavigation: true, waitForEvents: ['networkIdle'], navigationTimeout: process.env.mergeTimeout });
});

step("Select the newly created patient for IP", async function () {
    await write(patientIdentifierValue)
    await press(enter, { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("Select the newly created patient for IP Admission", async function () {
    await write(patientIdentifierValue)
    await press(enter, { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("Select the newly created patient for IP Discharge", async function () {
    await write(patientIdentifierValue)
    await click(search, { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("Search the newly created patient", async function () {
    await write(patientIdentifierValue, into($(idElement)))
    await click(search, { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("verify name with id", async function () {
    assert.ok(await (await text(`${firstName} ${lastName} (${patientIdentifierValue})`, toLeftOf(patientGender))).exists())
});

step("Verify medical prescription in patient clinical dashboard", async function () {
    await taikoHelper.repeatUntilNotFound($(dashboardLoader))
    for (var i = 0; i < prescriptionCount; i++) {
        var prescriptionFile = gauge.dataStore.scenarioStore.get("prescriptions" + i)
        var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
        assert.ok(await text(medicalPrescriptions.drug_name, within($(treatments))).exists())
        if(medicalPrescriptions.rule!=undefined)
        {
        assert.ok(await text(`${medicalPrescriptions.perDay}, ${medicalPrescriptions.frequency}`, within($(treatments))).exists())
        }
        else
        {
            assert.ok(await text(`${medicalPrescriptions.dose} ${medicalPrescriptions.units}, ${medicalPrescriptions.frequency}`, within($(treatments))).exists())
        }
        assert.ok(await text(`${medicalPrescriptions.duration} Day(s)`, within($(treatments))).exists())
        if(medicalPrescriptions.isIPD=='true'){
            assert.ok(await text(addToDrugChart,toRightOf(medicalPrescriptions.drug_name), within($(treatments))).exists())
        }
    }
});

step("Verify vitals", async function () {
    for (var vitalFormValue of vitalFormValues.ObservationFormDetails) {
        if (vitalFormValue.type == 'Group') {
            for (var vitalFormGroup of vitalFormValue.value) {
                assert.ok(await text(vitalFormGroup.value, within($(vitalFlowSheet)), toRightOf(vitalFormGroup.short_name)).exists())
            }
        }
        else {
            assert.ok(await text(vitalFormValue.value, within($(vitalFlowSheet)), toRightOf(vitalFormValue.short_name)).exists())
        }
    };
});

step("Verify diagnosis in patient clinical dashboard", async function () {
    assert.ok(await text(medicalDiagnosis.diagnosis.diagnosisName, toLeftOf(medicalDiagnosis.diagnosis.certainty, toRightOf(medicalDiagnosis.diagnosis.order)), within($(diagnosisElement))).exists())
});

step("Verify condition in patient clinical dashboard", async function () {
    var medicalConditions = medicalDiagnosis.condition
    for (var condition of medicalConditions) {
        if (condition.status != "Inactive") {
            assert.ok(await text(condition.conditionName, below(condition.status), within($("#Conditions"))).exists())
        }
    }
});


step("Verify history & examination in patient clinical dashboard", async function () {
    assert.ok(await text(`${historyAndExaminationDetails.History_Notes}`, within($(historyExaminationElement))).exists())
    assert.ok(await text(`${historyAndExaminationDetails.Smoking_status}`, within($(historyExaminationElement)), toRightOf(smokingHistory)).exists())
    assert.ok(await $(img).exists(), "Image not displayed on history & examination");
    await scrollTo($(img));
    await click($(img));
    await waitFor(2000)
    await waitFor(async () => await $(slideElement).exists())
    assert.ok(await $(slideElement).exists(), "Image not opened.");
    await evaluate($(closeBtn), (el) => el.click())
    await waitFor(10000)
    assert.ok(await $(obsPlyBtn).exists(), "Play button is not available");
    await scrollTo($(obsPlyBtn));
     await click($(obsPlyBtn));
    assert.ok(await $(videoDialog).exists(), "Video is not opened.");
    await evaluate($(clearFix), (el) => el.click())
    await click($(backBtn), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Verify consultation notes in patient clinical dashboard", async function () {
    await click(link(toLeftOf(text(opd)), within($(visitElement))))
    assert.ok(await text(consultationNote, within($(observationSection)), toRightOf(consultationNoteElement)).exists())
});

step("Validate the lab tests are available in patient clinical dashboard", async function () {
    assert.ok(await text(labTest, within($(labResults))).exists())
});

step("Verify no error displayed on page", async function () {
    assert.equal(await $(errorElement).exists(500, 1000), false, "Error displayed on page.")
});

step("Validate obs <form> on the patient clinical dashboard", async function (formPath) {
    var obsFormValues = JSON.parse(fileExtension.parseContent(`./bahmni-e2e-common-flows/data/${formPath}.json`))
    gauge.dataStore.scenarioStore.put(obsFormValues.ObservationClinicalFormName, obsFormValues)
    await taikoHelper.repeatUntilNotFound($(overlay))
    var viewFormElement="//SPAN[normalize-space()='" + obsFormValues.ObservationClinicalFormName.trim() + "']/..//i[@class='fa fa-eye']"
    await evaluate($(viewFormElement), (el) => el.click())
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoHelper.validateFormFromFile(obsFormValues.ObservationFormDetails, obsFormValues.ObservationClinicalFormName)
    await click($(formClose))
});