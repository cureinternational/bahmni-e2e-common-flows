"use strict";
const path = require('path');
const {click,write,dropDown,into,textBox,below,within,text,$,button, toRightOf, above} = require('taiko');
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
var fileExtension = require("../util/fileExtension");
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoElement = require('../../../components/taikoElement.js');
const taikoAssert = require('../../../components/taikoAssert.js');


var toAdmit = "To Admit"
var availableBed='//*[@class="col available" or @class="bed AVAILABLE"]'
var assign='Assign'
var overlay='//div[@id="overlay" and @style="display: block;"]'
var admit='Admit'
var patientMovementDropdown='Patient Movement'
var dischargePatient='Discharge Patient'
var discharge='Discharge'
var all='All'
var admitted='Admitted'
var enter= 'Enter'
var dischargePopup='[ng-click="dischargeConfirmation()"]'
var cancel='Cancel'
var addNewObsForm='Add New Obs Form'
var save='Save'
var historyAndExamination='History and Examination'
var generalWard='General Ward'
var generalWardRoom='General Ward room'
var obsSearchElement='input#templateSearch'
var implicitTime=parseInt(process.env.implicitTimeOut)
var sideMenu='//button[@data-testid="overflow-menu"]'
var chooseOption='Choose an option'
var datapath=process.env.dataPath
var currentVisitElement='//i[@id="currentVisitIcon"]/parent::a'
var addToDrugChart='Add to Drug Chart'
var nursingTasks='Nursing Tasks'
var drugChart='Drug Chart'
var done='Done'
var notes='Notes'
var taskTime='Task Time'
var administeredLate='Administered Late'
var ipdHomeButton='//a[@href="/bahmni/home/#/dashboard"]'

step("Doctor opens admission tab", async function () {
	await taikoInteraction.Click(toAdmit,'text')
});

step("Enter adt notes <notes>", async function (notes) {
	await taikoInteraction.Write(notes,'into',below("Adt Notes"))
	await write(notes, into(textBox(below("Adt Notes"))))
});

step("Select bed for admission <ward>", async function (ward) {
	await taikoHelper.repeatUntilFound(text(ward))
	await taikoInteraction.Click(ward,'text')
});

step("Allocate available bed", async function () {
	await click($(availableBed))
	await taikoInteraction.Click(availableBed,'xpath')
});

step("Click Assign", async function () {
	await taikoInteraction.Click(assign,'text')
});

step("Admit the patient", async function () {
	await taikoInteraction.Click(admit,'text')
});

step("Discharge the patient", async function () {
	await taikoHelper.wait(2000)
	await taikoElement.waitToExists($(sideMenu))
	await taikoInteraction.Click(sideMenu,'xpath')
	await taikoHelper.wait(1000)
	await taikoInteraction.Click(patientMovementDropdown,'text')
	await taikoInteraction.Click(chooseOption,'text')
	await taikoInteraction.Click(dischargePatient,'text')
	await taikoInteraction.Click(save,'text')
	await taikoHelper.wait(1000)
});

step("Select Patient Movement <movement>",async function(movement)
 {
	await taikoElement.waitToExists(dropDown(patientMovementDropdown))
	await taikoInteraction.Dropdown(patientMovementDropdown,movement)
});

step("View Admitted patients", async function () {
	await taikoInteraction.Click(admitted,'text')
});

step("Enter admitted patient details", async function () {
	var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
	await taikoInteraction.Write(patientIdentifierValue,'into',below(admitted))
	await taikoInteraction.pressEnter()
});

step("Click Admit", async function () {
	await taikoInteraction.Click(admit,'text')
});

step("Click Discharge", async function () {
	await taikoInteraction.Click(discharge,'text')
});

step("Click Discharge on popup", async function () {
	await taikoInteraction.Click(discharge,'text',within($(dischargePopup)))
});

step("Click Admit on popup", async function () {
	await taikoInteraction.Click(cancel,'text')
	await taikoInteraction.Click(admit,'text')
});

step("Enter Form Values <observationFormFile>", async function (formGroup) {
	var formgroup=process.env[formGroup].split(',')
	for(let i=0;i<formgroup.length;i++)
	{
	var observationFormValues = JSON.parse(fileExtension.parseContent(`./bahmni-e2e-common-flows/data/${datapath}/consultation/observations/${formgroup[i]}.json`))
	gaugeHelper.save(observationFormValues.ObservationFormName, observationFormValues)
	var shortformName=observationFormValues.ObservationFormName.split(' ')
	await taikoInteraction.Click(addNewObsForm,'button')
	await taikoInteraction.Write(shortformName[0],'xpath',obsSearchElement)
	if (await taikoElement.elementEnabled(button(observationFormValues.ObservationFormName)))
	{
		await taikoInteraction.Click(observationFormValues.ObservationFormName,'button')
	} else
	{
		await taikoInteraction.Click(observationFormValues.ObservationFormName,'text')
	}
	await taikoHelper.executeConfigurations(observationFormValues.ObservationFormDetails, observationFormValues.ObservationFormName)
	await taikoInteraction.Click(save,'text')
	await taikoHelper.wait(implicitTime)
	}
})

step("Click History and Examination", async function () {
	await taikoInteraction.Click(historyAndExamination,'link')
});

step("Select the general ward", async function () {
	await taikoInteraction.Click(generalWard,'text')
	await taikoInteraction.Click(generalWardRoom,'text')
});

step("Click on current visit",async function(){
	await taikoInteraction.Click(currentVisitElement,'xpath')
})

step("Nurse create medication tasks for <prescriptionNames>",async function(prescriptionNames){
	var prescriptionsList = prescriptionNames.split(',')
    var prescriptionsCount = prescriptionsList.length
    for (var i = 0; i < prescriptionsCount; i++) {
        var prescriptionFile = `./bahmni-e2e-common-flows/data/${datapath}/${prescriptionsList[i]}.json`;
        var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
        var drugName = medicalPrescriptions.drug_name;
        await taikoInteraction.Click(addToDrugChart,'text',toRightOf(drugName))
		await taikoInteraction.Click(save,'text')
    }
})

step("Nurse administer medication for <prescriptionNames>",async function(prescriptionNames){
	var prescriptionsList = prescriptionNames.split(',')
    var prescriptionsCount = prescriptionsList.length
    for (var i = 0; i < prescriptionsCount; i++) {
        var prescriptionFile = `./bahmni-e2e-common-flows/data/${datapath}/${prescriptionsList[i]}.json`;
        var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
        var drugName = medicalPrescriptions.drug_name;
		var medicinenotes=medicalPrescriptions.medicationNotes;
		await taikoInteraction.ScrollTo(administeredLate)
        await taikoInteraction.Click(drugName,'text',below(nursingTasks))
		await taikoInteraction.Click(done,'text')
		await taikoInteraction.Write(medicinenotes,'into',toRightOf(taskTime))
		await taikoInteraction.Click(save,'text')
		await taikoInteraction.Click(save,'text')
    }
})

step("Validate the medication task for <prescriptionNames>",async function(prescriptionNames){
	var prescriptionsList = prescriptionNames.split(',')
    var prescriptionsCount = prescriptionsList.length
    for (var i = 0; i < prescriptionsCount; i++) {
        var prescriptionFile = `./bahmni-e2e-common-flows/data/${datapath}/${prescriptionsList[i]}.json`;
        var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
        var drugName = medicalPrescriptions.drug_name;
		var medicinenotes=medicalPrescriptions.medicationNotes;
        await taikoAssert.assertExists(text(drugName,below(nursingTasks)))
		await taikoAssert.assertExists(text(drugName,below(drugChart)))
    }
})

step("Click on IPD home button",async function(){
	await taikoInteraction.Click(ipdHomeButton,'xpath')
})

step("Nurse saves the system tasks <systemTasks>",async function(systemTasks){
	var systemTasksFile = `./bahmni-e2e-common-flows/data/${datapath}/${systemTasks}.json`;
	var systemMedicationTasks = JSON.parse(fileExtension.parseContent(systemTasksFile))
	var tasks = systemMedicationTasks.tasks;
	await taikoInteraction.ScrollTo(administeredLate)
	await taikoInteraction.Click(tasks[0],'text')
    for (var i = 0; i < tasks.length; i++) {
		var taskName=tasks[i];
        await taikoInteraction.Click(done,'text',above(taskName))
    }
	await taikoInteraction.Click(save,'text')
})