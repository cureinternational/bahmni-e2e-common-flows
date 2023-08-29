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

    await click(radiology)
})

step("click laboratory",async function(){

    await click(laboratory)
})

step("Doctor prescribe tests <prescriptions>", async function (prescriptionFile) {
    var prescriptionFile = `./bahmni-e2e-common-flows/data/${prescriptionFile}.json`;
    var testPrescription = JSON.parse(fileExtension.parseContent(prescriptionFile))
    gauge.message(testPrescription)
    gaugeHelper.save("LabTest", testPrescription.test)
    await taikoHelper.repeatUntilFound(text(testPrescription.test))
    console.log("test found.")
    await click(testPrescription.test, { force: true })
    console.log("Selected test. " +testPrescription.test)
    await waitFor(100)
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
            if (await textBox(toRightOf(drugNameElement)).exists()) {
                await write(drugName, into(textBox(toRightOf(drugNameElement))));
                await click(link(drugName, below(textBox(toRightOf(drugNameElement)))));
                if(medicalPrescriptions.rule!=undefined)
            {
                await dropDown(toRightOf(rule)).select(medicalPrescriptions.rule);
            }
                await write(medicalPrescriptions.dose, into(textBox(toRightOf(dose))));
                await dropDown(toRightOf(units)).select(medicalPrescriptions.units);
                await dropDown(toRightOf(frequency)).select(medicalPrescriptions.frequency)
                await write(medicalPrescriptions.duration, into(textBox(toRightOf(duration))));
                await write(medicalPrescriptions.notes, into(textBox(toRightOf(additonalInstructions))));
            }
            await click(add);
            if(medicalPrescriptions.rule!=undefined)
            {
             assert.ok(text(medicalPrescriptions.perDay).exists())
             assert.ok(text(medicalPrescriptions.total).exists())
            }
           if(medicalPrescriptions.isIPD=='true')
           {
            await click(button(ipd),toRightOf(medicalPrescriptions.drug_name))
           }

        }

    }
}
);

step("Doctor captures consultation notes <notes>", async function (notes) {
    gaugeHelper.save("consultationNotes", notes)
    await click(consultation, { force: true, waitForNavigation: true, waitForStart: 2000 });
    await waitFor(textBox({ placeholder: "Enter Notes here" }))
    await write(notes, into(textBox({ "placeholder": "Enter Notes here" })), { force: true })
    gaugeHelper.save("consultationNotes", notes);
});

step("Doctor clicks consultation", async function () {
    await click(consultation, { force: true, waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Choose Disposition", async function () {
    await click(disposition, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Doctor advises admitting the patient", async function () {
    await waitFor(async () => (await dropDown(dispositionType).exists()))
    await dropDown(dispositionType).select(admitPatient)
    await write(admissionNotes, into(textBox(below(dispositionNotes))))
});

step("Doctor advises discharging the patient", async function () {
    await waitFor(async () => (await dropDown(dispositionType).exists()))
    await dropDown(dispositionType).select(dischargePatient)
    await write(dispositionNotes, into(textBox(below(dispositionNotes))))
});

step("Open <tabName> Tab", async function (tabName) {
    await click(link(tabName), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout, force: true });
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Save visit data", async function () {
    await click(save, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Join teleconsultation", async function () {
    await scrollTo(joinTeleconsultation)
    await click(joinTeleconsultation);
    await taikoHelper.repeatUntilNotFound($(overlay))
    await scrollTo(button(joinTeleconsultation), toRightOf(scheduled))
    await click(button(joinTeleconsultation, toRightOf(scheduled)), { waitForNavigation: false, navigationTimeout: 3000 })
    await highlight(teleConsulation)
    await click(($(closeConsultation)));
});

step("Doctor notes the diagnosis and condition <filePath>", async function (filePath) {
    var diagnosisFile = `./bahmni-e2e-common-flows/data/${filePath}.json`;
    gaugeHelper.save("diagnosisFile", diagnosisFile)
    var medicalDiagnosis = JSON.parse(fileExtension.parseContent(diagnosisFile))
    gaugeHelper.save("medicalDiagnosis", medicalDiagnosis)
    gauge.message(medicalDiagnosis)
    await click(diagnoses);
    await write(medicalDiagnosis.diagnosis.diagnosisName, into(textBox(below(diagnoses))));
    await waitFor(() => $("(//a[contains(text(),\"" + medicalDiagnosis.diagnosis.diagnosisName + "\")])[1]").isVisible())
    await click($("(//a[contains(text(),\"" + medicalDiagnosis.diagnosis.diagnosisName + "\")])[1]"))
    await click(medicalDiagnosis.diagnosis.order, below(order));
    await click(medicalDiagnosis.diagnosis.certainty, below(certainty));
});