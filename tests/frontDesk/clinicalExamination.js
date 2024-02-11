"use strict";
const {toRightOf,textBox,dropDown,below,$,text, button, within} = require('taiko');
var fileExtension = require("../util/fileExtension");
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoElement = require('../../../components/taikoElement.js');
const taikoAssert = require('../../../components/taikoAssert');

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
var overlay='//div[@id="overlay" and @style="display: block;"]'
var save='Save'
var joinTeleconsultation='Join Teleconsultation'
var teleConsulation='Tele Consultation'
var scheduled='Scheduled'
var closeConsultation='[ng-click="closeTeleConsultation()"]'
var diagnoses='Diagnoses'
var order='Order'
var certainty='Certainty'
var condition='Condition'
var status='Status'
var add='Add'
var urgentBtnElement='//button[@title="Urgent"]'
var notesBtnElement='//i[contains(@class,"fa fa-file-text-o")]'
var okBtn='OK'
var patientDashboardElement="//a[@ng-click='gotoPatientDashboard()']"
var implicitWaitTime=parseInt(process.env.implicitTimeOut)
var addNewObservation='Add New Obs Form'
var section='//h2[contains(text(),"Selected Orders")]'
var ipdToggle=process.env.enableIPDfeature

step("click radiology",async function(){
    await taikoInteraction.Click(radiology,'text')
})

step("click laboratory",async function(){
    await taikoInteraction.Click(laboratory,'text')
})

step("Doctor prescribe tests <prescriptions>", async function (prescriptionFile) {
    var prescriptionFile = `./bahmni-e2e-common-flows/data/${prescriptionFile}.json`;
    var testPrescription = JSON.parse(fileExtension.parseContent(prescriptionFile))
    var notesList=testPrescription.notes
    gauge.message(testPrescription)
    gaugeHelper.save("LabTest", testPrescription.test)
    await taikoHelper.repeatUntilFound(text(testPrescription.test))
    await taikoInteraction.Click(testPrescription.test, 'text')
    await taikoInteraction.ScrollTo(text(testPrescription.heading))
    await taikoInteraction.Click(urgentBtnElement,'xpath',toRightOf(testPrescription.test))
    await taikoInteraction.Click(notesBtnElement,'xpath',toRightOf(testPrescription.test))
    for(let i=0;i<notesList.length;i++)
    {
        await taikoHelper.wait(1000)
        await taikoInteraction.Click(notesList[i].button, 'button')
    }
    await taikoInteraction.Click(okBtn,'button')
    await taikoHelper.wait(2000)
});


step("put medications <prescriptionNames>", async function (prescriptionNames) {
    var prescriptionFile = `./data/${prescriptionNames}.json`;
    gaugeHelper.save("prescriptions", prescriptionFile)
})

step("Doctor prescribes medicines <prescriptionNames>", async function (prescriptionNames) {
    var prescriptionsList = prescriptionNames.split(',')
    var prescriptionsCount = prescriptionsList.length
    gaugeHelper.save("prescriptionsCount", prescriptionsCount)
    for (var i = 0; i < prescriptionsCount; i++) {
        var prescriptionFile = `./bahmni-e2e-common-flows/data/${prescriptionsList[i]}.json`;
        gaugeHelper.save("prescriptions" + i, prescriptionFile)
        var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
        gauge.message(medicalPrescriptions)
        var drugName = medicalPrescriptions.drug_name;
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
        await taikoInteraction.Click(add,'text')
           if(medicalPrescriptions.isIPD=='true' && ipdToggle=='true')
           {
            await taikoInteraction.Click(ipd,'button',toRightOf(medicalPrescriptions.drug_name))
           }
    }
}
);

step("Doctor updates medicines <medications>", async function (prescriptionNames) {
    var prescriptionsList = prescriptionNames.split(',')
    var prescriptionsCount = prescriptionsList.length
    for (var i = 0; i < prescriptionsCount; i++) {
        var prescriptionFile = `./bahmni-e2e-common-flows/data/${prescriptionsList[i]}.json`;
        var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
        var drugName = medicalPrescriptions.drug_name;
           if(medicalPrescriptions.isIPD=='true' && ipdToggle=='true')
           {
            await taikoInteraction.Click(ipd,'button',toRightOf(drugName))
           }
    }
}
)

step("Doctor captures consultation notes <notes>", async function (notes) {
    gaugeHelper.save("consultationNotes", notes)
    await taikoInteraction.Click(consultation,'text')
    await taikoElement.waitToExists(textBox({ placeholder: "Enter Notes here" }))
    await taikoInteraction.Write(notes,'into',{ "placeholder": "Enter Notes here" })
    gaugeHelper.save("consultationNotes", notes);
});

step("Doctor clicks consultation", async function () {
    await taikoInteraction.EvaluateClick($('//a[@ng-click="openConsultation()"]'))
});

step("Choose Disposition", async function () {
    await taikoInteraction.Click(disposition,'text')
});

step("Doctor advises admitting the patient", async function () {
    await taikoElement.waitToExists(dropDown(dispositionType))
    await taikoInteraction.Dropdown(dispositionType,admitPatient)
    await taikoInteraction.Write(admissionNotes,'into',below(dispositionNotes))
});

step("Doctor advises discharging the patient", async function () {
    await taikoElement.waitToExists(dropDown(dispositionType))
    await taikoInteraction.Dropdown(dispositionType,dischargePatient)
    await taikoInteraction.Write(dispositionNotes,'into',below(dispositionNotes))
});

step("Open <tabName> Tab", async function (tabName) {
    await taikoHelper.wait(implicitWaitTime)
    await taikoInteraction.Click(tabName,'text')
});

step("Save visit data", async function () {
    await taikoInteraction.Click(save,'text')
});

step("Join teleconsultation", async function () {
    await taikoInteraction.Click(joinTeleconsultation,'text')
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
    var name=`(//a[contains(text(),'${medicalDiagnosis.diagnosis.diagnosisName}')])[1]`
    await taikoElement.waitToPresent($(name))
    await taikoInteraction.Click(name,'xpath')
    await taikoInteraction.Click(medicalDiagnosis.diagnosis.order,'text',below(order))
    await taikoInteraction.Click(medicalDiagnosis.diagnosis.certainty,'text',below(certainty))
    await taikoInteraction.Write(medicalDiagnosis.condition.conditionCode,'into',below(condition))
    var conditionCode=`(//a[contains(text(),'${medicalDiagnosis.condition.conditionCode}')])[1]`
    await taikoElement.waitToPresent($(conditionCode))
    await taikoInteraction.Click(conditionCode,'xpath')
    await taikoInteraction.Click(medicalDiagnosis.condition.status,'text',below(status))
    await taikoInteraction.Click(add,'button')

});

step("Verify the radiology notes <order>",async function(orderFile){
    var prescriptionFile = `./bahmni-e2e-common-flows/data/${orderFile}.json`;
    var testPrescription = JSON.parse(fileExtension.parseContent(prescriptionFile))
    var notesList=testPrescription.notes
    notesList.forEach(async function (note) {
        await taikoElement.isExists(text(note.message))

    })
})
step("Verify the patient is consulted",async function(){
    var patientId=gaugeHelper.get('patientIdentifier')
    await taikoInteraction.Click('Active','link')
    var encounterTimeElement=`//a[contains(text(),'${patientId}')]/ancestor::tr/td[9]`
    var encounterTime=await taikoElement.getText($(encounterTimeElement))
    taikoAssert.assertNotEmpty(encounterTime)
})

step("Goto patient clinical dashboard",async function(){
    await taikoInteraction.Click(patientDashboardElement,'xpath')
    await taikoHelper.wait(1000)
})
