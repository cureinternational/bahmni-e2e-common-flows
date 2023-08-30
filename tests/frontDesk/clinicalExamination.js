"use strict";
const {
    click,
    waitFor,
    timeField,
    toRightOf,
    textBox,
    into,
    write,
    dropDown,
    highlight,
    below,
    within,
    scrollTo,
    $,
    text,
    confirm,
    accept,
    button,
    link
} = require('taiko');
var fileExtension = require("../util/fileExtension");
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
var assert = require('assert');
const taikoInteraction = require('../../../components/taikoInteraction');
const taikoElement = require('../../../components/taikoElement');

var radiology='Radiology'
var laboratory='Laboratory'
var drugNameElement='Drug Name'
var rule='Rule'
var dose='Dose'
var units='Units'
var frequency='Frequency'
var duration='Duration'
var additonalInstructions='Additional Instructions'
var add='Add'
var ipd='IPD'
var consultation='Consultation'
var disposition='Disposition'
var dispositionType='Disposition Type'
var admissionNotes='Admission Notes'
var dispositionNotes='Disposition Notes'
var admitPatient='Admit Patient'
var dischargePatient='Discharge Patient'
var overlay='#overlay'
var save='Save'
var joinTeleconsultation='Join Teleconsultation'
var teleConsulation='Tele Consultation'
var scheduled='Scheduled'
var closeConsultation='[ng-click="closeTeleConsultation()"]'
var diagnoses='Diagnoses'
var order='Order'   
var certainty='Certainty'

step("click radiology",async function(){
    await taikoInteraction.Click(radiology,'text')
})

step("click laboratory",async function(){
    await taikoInteraction.Click(laboratory,'text')
})

step("Doctor prescribe tests <prescriptions>", async function (prescriptionFile) {
    var prescriptionFile = `./bahmni-e2e-common-flows/data/${prescriptionFile}.json`;
    var testPrescription = JSON.parse(fileExtension.parseContent(prescriptionFile))
    gauge.message(testPrescription)
    gaugeHelper.save("LabTest", testPrescription.test)
    await taikoHelper.repeatUntilFound(text(testPrescription.test))
    console.log("test found.")
    await taikoInteraction.Click(testPrescription.test, 'text')
    console.log("Selected test. " +testPrescription.test)
});


step("put medications <prescriptionNames>", async function (prescriptionNames) {
    var prescriptionFile = `./data/${prescriptionNames}.json`;
    gaugeHelper.save("prescriptions", prescriptionFile)
})

step("Doctor prescribes medicines <prescriptionNames>", async function (prescriptionNames) {
    var prescriptionsList = prescriptionNames.split(',')
    var prescriptionsCount = prescriptionsList.length
    gaugeHelper.save("prescriptionsCount", prescriptionsCount)
    var drugName = gaugeHelper.get("Drug Name")
    for (var i = 0; i < prescriptionsCount; i++) {
        var prescriptionFile = `./bahmni-e2e-common-flows/data/${prescriptionsList[i]}.json`;
        gaugeHelper.save("prescriptions" + i, prescriptionFile)
        var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
        gauge.message(medicalPrescriptions)
        if (medicalPrescriptions.drug_name != null) {
            if (drugName == null)
                drugName = medicalPrescriptions.drug_name;
            if (await taikoElement.isPresent(toRightOf(drugNameElement))) {
                await taikoInteraction.Write(drugName,'into',toRightOf(drugNameElement))
                await taikoInteraction.Click(drugName, 'link',below(textBox(toRightOf(drugNameElement))))
                if(medicalPrescriptions.rule!=undefined)
            {
                await taikoInteraction.Dropdown(toRightOf(rule),medicalPrescriptions.rule)
            }
                await taikoInteraction.Write(medicalPrescriptions.dose,'into',toRightOf(dose))
                await taikoInteraction.Dropdown(toRightOf(units),medicalPrescriptions.units)
                await taikoInteraction.Dropdown(toRightOf(frequency),medicalPrescriptions.frequency)
                await taikoInteraction.Write(medicalPrescriptions.duration,'into',toRightOf(duration))
                await taikoInteraction.Write(medicalPrescriptions.notes,'into',toRightOf(additonalInstructions))
            }
            await taikoInteraction.Click(add,'text')
            if(medicalPrescriptions.rule!=undefined)
            {
             await taikoElement.isPresent(text(medicalPrescriptions.perDay))
             await taikoElement.isPresent(text(medicalPrescriptions.total))
            }
           if(medicalPrescriptions.isIPD=='true')
           {
            await taikoInteraction.Click(ipd,'button',toRightOf(medicalPrescriptions.drug_name))
           }

        }

    }
}
);

step("Doctor captures consultation notes <notes>", async function (notes) {
    gaugeHelper.save("consultationNotes", notes)
    await taikoInteraction.Click(consultation,'text')
    await taikoElement.waitToPresent(textBox({ placeholder: "Enter Notes here" }))
    await taikoInteraction.Write(notes,'into',{ "placeholder": "Enter Notes here" })
    gaugeHelper.save("consultationNotes", notes);
});

step("Doctor clicks consultation", async function () {
    await taikoInteraction.Click(consultation,'text')
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Choose Disposition", async function () {
    await taikoInteraction.Click(disposition,'text')
});

step("Doctor advises admitting the patient", async function () {
    await taikoElement.waitToPresent(dropDown(dispositionType))
    await taikoInteraction.Dropdown(dispositionType,admitPatient)
    await taikoInteraction.Write(admissionNotes,'into',below(dispositionNotes))
});

step("Doctor advises discharging the patient", async function () {
    await taikoElement.waitToPresent(dropDown(dispositionType))
    await taikoInteraction.Dropdown(dispositionType,dischargePatient)
    await taikoInteraction.Write(dispositionNotes,'into',below(dispositionNotes))
});

step("Open <tabName> Tab", async function (tabName) {
    await taikoInteraction.Click(tabName,'link')
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Save visit data", async function () {
    await taikoInteraction.Click(save,'text')
});

step("Join teleconsultation", async function () {
    await taikoInteraction.Click(joinTeleconsultation,'text')
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoInteraction.Click(joinTeleconsultation,'button',toRightOf(scheduled))
    await taikoInteraction.Click(closeConsultation,'xpath')
});

step("Doctor notes the diagnosis and condition <filePath>", async function (filePath) {
    var diagnosisFile = `./bahmni-e2e-common-flows/data/${filePath}.json`;
    gaugeHelper.save("diagnosisFile", diagnosisFile)
    var medicalDiagnosis = JSON.parse(fileExtension.parseContent(diagnosisFile))
    gaugeHelper.save("medicalDiagnosis", medicalDiagnosis)
    gauge.message(medicalDiagnosis)
    await taikoInteraction.Click(diagnoses,'text')
    await taikoInteraction.Write(medicalDiagnosis.diagnosis.diagnosisName,'into',below(diagnoses))
    var name=$("(//a[contains(text(),\"" + medicalDiagnosis.diagnosis.diagnosisName + "\")])[1]")
    await taikoElement.waitToPresent(name)
    await taikoInteraction.Click(name,'xpath')
    await taikoInteraction.Click(medicalDiagnosis.diagnosis.order,'text',below(order))
    await taikoInteraction.Click(medicalDiagnosis.diagnosis.certainty,'text',below(certainty))
});