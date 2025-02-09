/* globals gauge*/
"use strict";
const {$,click,toRightOf,text,toLeftOf,within,link,below,button,scrollDown} = require('taiko');
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
var fileExtension = require("../util/fileExtension")
var assert = require('assert');
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoAssert = require('../../../components/taikoAssert.js');
const taikoElement = require('../../../components/taikoElement.js');

var startOpdVisit='Start OPD Visit'
var submitBtn='.submit-btn-container'
var startIpdVisit='Start IPD visit'
var overlay='//div[@id="overlay" and @style="display: block;"]'
var search='Search'
var enter= 'Enter'
var idElement='input#patientIdentifier'
var dashboardLoader='.dashboard-section-loader'
var treatments='#Treatments'
var addToDrugChart='Add to Drug Chart'
var vitalFlowSheet='#Vitals-Flow-Sheet'
var diagnosisElement='#Diagnosis'
var historyExaminationElement='#History-and-Examinations'
var smokingHistory='Smoking History'
var img="//a[@class='img-concept']/img"
var slideElement='.slide'
var closeBtn='//button[@class="dialog-close-btn"]/i'
var obsPlyBtn='.obs-play-btn'
var videoDialog='button.obs-play-btn'
var clearFix=`//*[@class="ngdialog-close clearfix"]`
var backBtn='.back-btn'
var consultationNote = gaugeHelper.get("consultationNotes")
var opd='OPD'
var visitElement='#Visits'
var observationSection='#observation-section'
var consultationNoteElement='consultation note'
var labTest = gaugeHelper.get("LabTest")
var labResults='#Lab-Results'
var errorElement='//DIV[@class="message-container error-message-container"]'
var formClose='.ngdialog-close'
var newformClose='//button[@aria-label="close"]'
var formLink='a.form-link'
var patientDashboard='[ng-click="gotoPatientDashboard()"]'
var save='Save'
var implicitWaitTime=parseInt(process.env.implicitTimeOut)
var ipdToggle=process.env.enableIPDfeature
var datapath=process.env.dataPath




step("Click Start IPD Visit", async function () {
    await click($('(//div[@class="split-button"]/button)[2]'),toRightOf('Start OPD visit'))
    await taikoInteraction.Click(startIpdVisit,'text')
});

step("Click Start OPD Visit", async function () {
    await taikoInteraction.Click(`Start ${process.env.default_visit_type} visit`,'text')
});

step("Select the newly created patient with network idle", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'into',{ "placeholder": "Search Name/Patient Identifier  ..." })
    await taikoInteraction.Click(search,'text')
});

step("Select the newly created patient for IP", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'into',below(startIpdVisit))
    await taikoInteraction.pressEnter()
});

step("Select the newly created patient for IP Admission", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'into',below(startIpdVisit))
    await taikoInteraction.pressEnter()
});

step("Select the newly created patient for IP Discharge", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'into',below(startIpdVisit))
    await taikoInteraction.Click(search,'text')
});

step("Search the newly created patient", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'xpath',idElement)
    await taikoInteraction.Click(search,'text')
});

step("verify name with id", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    var firstName = gaugeHelper.get("patientFirstName")
    var lastName = gaugeHelper.get("patientLastName")
    var patientGender=gaugeHelper.get("patientGender")
    assert.ok(await (await text(`${firstName} ${lastName} (${patientIdentifierValue})`, toLeftOf(patientGender))).exists())
});

step("Verify medical prescription in patient clinical dashboard", async function () {
// if(ipdToggle=='true')
// {
//     await taikoHelper.repeatUntilNotFound($(dashboardLoader))
//     await taikoInteraction.ScrollTo($(treatments))
//     var prescriptionCount = gaugeHelper.get("prescriptionsCount")
//     for (var i = 0; i < prescriptionCount; i++) {
//         var prescriptionFile = gaugeHelper.get("prescriptions" + i)
//         var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
//         assert.ok(await text(medicalPrescriptions.drug_name, within($(treatments))).exists())
//         if(medicalPrescriptions.rule!=undefined)
//         {
//         var weight=gaugeHelper.get('patientWeight')
//         assert.ok(await text(`${weight} ${medicalPrescriptions.units}, ${medicalPrescriptions.frequency}`, within($(treatments))).exists())
//         }
//         else
//         {
//             assert.ok(await text(`${medicalPrescriptions.dose} ${medicalPrescriptions.units}, ${medicalPrescriptions.frequency}`, within($(treatments))).exists())
//         }
//         assert.ok(await text(`${medicalPrescriptions.duration} Day(s)`, within($(treatments))).exists())
//     }
// }
// 
}
);

step("Verify medical prescription is updated as non ipd for <medications>",async function(prescriptionNames)
{
//     if(ipdToggle=='true')
//     {
//     var prescriptionsList = prescriptionNames.split(',')
//     var prescriptionsCount = prescriptionsList.length
//     for (var i = 0; i < prescriptionsCount; i++) {
//         var prescriptionFile = `./bahmni-e2e-common-flows/data/${datapath}/${prescriptionsList[i]}.json`;
//         var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
//         var drugName = medicalPrescriptions.drug_name;
//         var stoppedDrugElement=`//span[contains(text(),"${drugName}")]/parent::td[@class="drug strike-text"]`
//         await taikoAssert.assertExists($(stoppedDrugElement))
//     }
// }
})
step("Verify vitals", async function () {
    var vitalFormValues = gaugeHelper.get("Vitals")
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
    var medicalDiagnosis = gaugeHelper.get("medicalDiagnosis")
    assert.ok(await text(medicalDiagnosis.diagnosis.diagnosisName, toLeftOf(medicalDiagnosis.diagnosis.certainty, toRightOf(medicalDiagnosis.diagnosis.order)), within($(diagnosisElement))).exists())
});

step("Verify condition in patient clinical dashboard", async function () {
    var medicalDiagnosis = gaugeHelper.get("medicalDiagnosis")
    var medicalCondition = medicalDiagnosis.condition
        if (medicalCondition.status != "Inactive")
        {
            assert.ok(await text(medicalCondition.conditionName, within($("#Conditions"))).exists())
        }
})



step("Verify history & examination in patient clinical dashboard", async function () {
    var historyAndExaminationDetails = gaugeHelper.get("historyAndExaminationDetails")
    assert.ok(await text(`${historyAndExaminationDetails.History_Notes}`, within($(historyExaminationElement))).exists(500,2000))
    assert.ok(await text(`${historyAndExaminationDetails.Smoking_status}`, within($(historyExaminationElement)), toRightOf(smokingHistory)).exists(500,2000))
    await taikoAssert.assertExists($(img))
    await taikoAssert.assertExists($(videoDialog))
});

step("Verify consultation notes in patient clinical dashboard", async function () {
    await click(link(toLeftOf(text(opd)), within($(visitElement))))
    assert.ok(await text(consultationNote, within($(observationSection)), toRightOf(consultationNoteElement)).exists())
});

step("Validate the lab tests are available in patient clinical dashboard", async function () {
    await taikoAssert.assertExists($(labResults))
});

step("Verify no error displayed on page", async function () {
    await taikoAssert.assertNotExists($(errorElement))
});

step("Validate obs <form> on the patient clinical dashboard", async function (formPath) {
    var obsFormValues = JSON.parse(fileExtension.parseContent(`./bahmni-e2e-common-flows/data/${datapath}/${formPath}.json`))
    gaugeHelper.save(obsFormValues.ObservationClinicalFormName, obsFormValues)
    var viewFormElement="//SPAN[normalize-space()='" + obsFormValues.ObservationClinicalFormName.trim() + "']/..//i[@class='fa fa-eye']"
    await taikoInteraction.EvaluateClick($(viewFormElement))
    await taikoHelper.validateFormFromFile(obsFormValues.ObservationFormDetails, obsFormValues.ObservationClinicalFormName)
    await taikoInteraction.Click(formClose,'xpath')
});

step("Validate new obs <form> on the patient clinical dashboard", async function (formGroup) 
{
    var formgroup=process.env[formGroup].split(',')
	for(let i=0;i<formgroup.length;i++)
	{
    var obsFormValues = JSON.parse(fileExtension.parseContent(`./bahmni-e2e-common-flows/data/${datapath}/consultation/observations/${formgroup[i]}.json`))
    gaugeHelper.save(obsFormValues.ObservationClinicalFormName, obsFormValues)
    await taikoHelper.wait(3000)
    var formLinkElement='//span[text()="'+obsFormValues.ObservationClinicalFormName+'"]/following-sibling::span/a'
    await taikoInteraction.EvaluateClick($(formLinkElement))
    await taikoHelper.validateNewFormFromFile(obsFormValues.ObservationFormDetails,obsFormValues.ObservationClinicalFormName)
    await taikoInteraction.Click(newformClose,'xpath')
    }
});

step("Goto patient dashboard", async function () {
    await taikoInteraction.Click(patientDashboard,'xpath')
});

step("Edit new obs <form> on the patient clinical dashboard",async function(formGroup)
{
    var formgroup=process.env[formGroup].split(',')
	for(let i=0;i<formgroup.length;i++)
	{
    var obsFormValues = JSON.parse(fileExtension.parseContent(`./bahmni-e2e-common-flows/data/${datapath}/consultation/observations/${formgroup[i]}.json`))
    await taikoHelper.wait(1000)
    var editForm='//span[text()="'+obsFormValues.ObservationClinicalFormName+'"]/parent::div/descendant::i'
    await taikoInteraction.Click(editForm,'xpath')
    await taikoHelper.executeConfigurations(obsFormValues.EditObservationFormDetails, obsFormValues.ObservationFormName)
    await taikoInteraction.Click(save,'text')
    await taikoHelper.wait(implicitWaitTime)
    }
})