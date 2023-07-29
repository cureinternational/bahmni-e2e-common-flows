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
var assert = require('assert');

step("click radiology",async function(){

    await click("Radiology")
})

step("click laboratory",async function(){

    await click("Laboratory")
})

step("Doctor prescribe tests <prescriptions>", async function (prescriptionFile) {
    var prescriptionFile = `./bahmni-e2e-common-flows/data/${prescriptionFile}.json`;
    var testPrescription = JSON.parse(fileExtension.parseContent(prescriptionFile))
    gauge.message(testPrescription)
    gauge.dataStore.scenarioStore.put("LabTest", testPrescription.test)
    await taikoHelper.repeatUntilFound(text(testPrescription.test))
    console.log("test found.")
    await click(testPrescription.test, { force: true })
    console.log("Selected test. " +testPrescription.test)
    await waitFor(100)
});


step("put medications <prescriptionNames>", async function (prescriptionNames) {
    var prescriptionFile = `./data/${prescriptionNames}.json`;
    gauge.dataStore.scenarioStore.put("prescriptions", prescriptionFile)
})

step("Doctor prescribes medicines <prescriptionNames>", async function (prescriptionNames) {
    var prescriptionsList = prescriptionNames.split(',')
    var prescriptionsCount = prescriptionsList.length
    gauge.dataStore.scenarioStore.put("prescriptionsCount", prescriptionsCount)
    for (var i = 0; i < prescriptionsCount; i++) {

        var prescriptionFile = `./bahmni-e2e-common-flows/data/${prescriptionsList[i]}.json`;
        gauge.dataStore.scenarioStore.put("prescriptions" + i, prescriptionFile)
        var drugName = gauge.dataStore.scenarioStore.get("Drug Name")
        var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
        gauge.message(medicalPrescriptions)

        if (medicalPrescriptions.drug_name != null) {
            if (drugName == null)
                drugName = medicalPrescriptions.drug_name;
            if (await textBox(toRightOf("Drug Name")).exists()) {
                await write(drugName, into(textBox(toRightOf("Drug Name"))));
                await click(link(drugName, below(textBox(toRightOf("Drug Name")))));
                if(medicalPrescriptions.rule!=undefined)
            {
                await dropDown(toRightOf("Rule")).select(medicalPrescriptions.rule);
            }
                await write(medicalPrescriptions.dose, into(textBox(toRightOf("Dose"))));
                await dropDown(toRightOf("Units")).select(medicalPrescriptions.units);
                await dropDown(toRightOf("Frequency")).select(medicalPrescriptions.frequency)
                await write(medicalPrescriptions.duration, into(textBox(toRightOf("Duration"))));
                await write(medicalPrescriptions.notes, into(textBox(toRightOf("Additional Instructions"))));
            }
            await click("Add");
            if(medicalPrescriptions.rule!=undefined)
            {
             assert.ok(text(medicalPrescriptions.perDay).exists())
             assert.ok(text(medicalPrescriptions.total).exists())
            }
           if(medicalPrescriptions.isIPD=='true')
           {
            await click(button('IPD'),toRightOf(medicalPrescriptions.drug_name))
           }

        }

    }
}
);


step("Doctor captures consultation notes <notes>", async function (notes) {
    gauge.dataStore.scenarioStore.put("consultationNotes", notes)
    await click("Consultation", { force: true, waitForNavigation: true, waitForStart: 2000 });
    await waitFor(textBox({ placeholder: "Enter Notes here" }))
    await write(notes, into(textBox({ "placeholder": "Enter Notes here" })), { force: true })
    gauge.dataStore.scenarioStore.put("consultationNotes", notes);
});

step("Doctor clicks consultation", async function () {
    await click("Consultation", { force: true, waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Choose Disposition", async function () {
    await click("Disposition", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Doctor advises admitting the patient", async function () {
    await waitFor(async () => (await dropDown("Disposition Type").exists()))
    await dropDown("Disposition Type").select('Admit Patient')
    await write("Admission Notes", into(textBox(below("Disposition Notes"))))
});

step("Doctor advises discharging the patient", async function () {
    await waitFor(async () => (await dropDown("Disposition Type").exists()))
    await dropDown("Disposition Type").select('Discharge Patient')
    await write("Discharge Notes", into(textBox(below("Disposition Notes"))))
});

step("Open <tabName> Tab", async function (tabName) {
    await click(link(tabName), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout, force: true });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Save visit data", async function () {
    await click("Save", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Join teleconsultation", async function () {
    await scrollTo('Join Teleconsultation')
    await click('Join Teleconsultation');
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await scrollTo(button('Join teleconsultation'), toRightOf("Scheduled"))
    await click(button('Join teleconsultation', toRightOf("Scheduled")), { waitForNavigation: false, navigationTimeout: 3000 })
    await highlight('Tele Consultation')
    await click(($('[ng-click="closeTeleConsultation()"]')));
});

step("Doctor notes the diagnosis and condition <filePath>", async function (filePath) {
    var diagnosisFile = `./bahmni-e2e-common-flows/data/${filePath}.json`;
    gauge.dataStore.scenarioStore.put("diagnosisFile", diagnosisFile)
    var medicalDiagnosis = JSON.parse(fileExtension.parseContent(diagnosisFile))
    gauge.dataStore.scenarioStore.put("medicalDiagnosis", medicalDiagnosis)
    gauge.message(medicalDiagnosis)
    await click("Diagnoses");
    await write(medicalDiagnosis.diagnosis.diagnosisName, into(textBox(below("Diagnoses"))));
    await waitFor(() => $("(//a[contains(text(),\"" + medicalDiagnosis.diagnosis.diagnosisName + "\")])[1]").isVisible())
    await click($("(//a[contains(text(),\"" + medicalDiagnosis.diagnosis.diagnosisName + "\")])[1]"))
    await click(medicalDiagnosis.diagnosis.order, below("Order"));
    await click(medicalDiagnosis.diagnosis.certainty, below("Certainty"));
});