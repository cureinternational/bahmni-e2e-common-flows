"use strict";
const path = require('path');
const {click,write,dropDown,into,textBox,below,within,text,$,button} = require('taiko');
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
var fileExtension = require("../util/fileExtension");
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoElement = require('../../../components/taikoElement.js');


var toAdmit = "To Admit"
var availableBed='//*[@class="col available" or @class="bed AVAILABLE"]'
var assign='Assign'
var overlay='//div[@id="overlay" and @style="display: block;"]'
var admit='Admit'
var patientMovementDropdown='Patient Movement:'
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
var implicitWaitTime=parseInt(process.env.implicitTimeOut)

step("Doctor opens admission tab", async function () {
	await taikoHelper.repeatUntilNotFound(overlay)
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
	await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Admit the patient", async function () {
	await taikoInteraction.Click(admit,'text')
	await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Discharge the patient", async function () {
	await taikoHelper.repeatUntilNotFound($(overlay))
	await taikoHelper.wait(2000)
	await taikoElement.waitToExists(dropDown(patientMovementDropdown))
	await taikoHelper.wait(2000)
	await taikoInteraction.Dropdown(patientMovementDropdown,dischargePatient)
	await taikoInteraction.Click(discharge,'text')
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
	await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click Admit", async function () {
	await taikoInteraction.Click(admit,'text')
});

step("Click Discharge", async function () {
	await taikoInteraction.Click(discharge,'text')
});

step("Click Discharge on popup", async function () {
	await taikoHelper.repeatUntilNotFound($(overlay))
	await taikoInteraction.Click(discharge,'text',within($(dischargePopup)))
});

step("Click Admit on popup", async function () {
	await taikoHelper.repeatUntilNotFound($(overlay))
	await taikoInteraction.Click(cancel,'text')
	await taikoInteraction.Click(admit,'text')
});

step("Enter Form Values <observationFormFile>", async function (observationFormFile) {
	var observationFormValues = JSON.parse(fileExtension.parseContent(`./bahmni-e2e-common-flows/data/${observationFormFile}.json`))
	gaugeHelper.save(observationFormValues.ObservationFormName, observationFormValues)
	await taikoHelper.repeatUntilNotFound($(overlay))
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
	await taikoHelper.repeatUntilNotFound($(overlay))
	await taikoHelper.executeConfigurations(observationFormValues.ObservationFormDetails, observationFormValues.ObservationFormName)
	await taikoInteraction.Click(save,'text')
	await taikoHelper.repeatUntilNotFound($(overlay))
	await taikoHelper.wait(implicitWaitTime)
})

step("Click History and Examination", async function () {
	await taikoInteraction.Click(historyAndExamination,'link')
	await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Select the general ward", async function () {
	await taikoInteraction.Click(generalWard,'text')
	await taikoInteraction.Click(generalWardRoom,'text')
});