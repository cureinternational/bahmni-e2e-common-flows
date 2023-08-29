"use strict";
const path = require('path');
const {
	above,
	click,
	attach,
	fileField,
	button,
	write,
	dropDown,
	into,
	textBox,
	below,
	waitFor,
	within,
	confirm,
	accept,
	text,
	press,
	highlight,
	timeField,
	toRightOf,
	$,
	scrollTo,
	toLeftOf,
	link
} = require('taiko');
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
var fileExtension = require("../util/fileExtension");
var toAdmit = "To Admit"
var availableBed='//*[@class="col available" or @class="bed AVAILABLE"]'
var assign='Assign'
var overlay='#overlay'
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

step("Doctor opens admission tab", async function () {
	await taikoHelper.repeatUntilNotFound($("#overlay"))
	await click(toAdmit, { force: true, waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
});

step("Enter adt notes <notes>", async function (notes) {
	await write(notes, into(textBox(below("Adt Notes"))))
});

step("Select bed for admission <ward>", async function (ward) {
	await taikoHelper.repeatUntilFound(text(ward))
	await click(ward)
});

step("Allocate available bed", async function () {
	await click($(availableBed))
});

step("Click Assign", async function () {
	await click(assign, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
	
	await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Admit the patient", async function () {
	await click(admit, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
	await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Discharge the patient", async function () {
	await taikoHelper.repeatUntilNotFound($(overlay))
	await waitFor(3000)
	await waitFor(async () => (await dropDown(patientMovementDropdown).exists()))
	await dropDown(patientMovementDropdown).select(dischargePatient)
	await waitFor(1000)
	await click(discharge, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
	await waitFor(1000)

});

step("Select Patient Movement <movement>",async function(movement)
 {
	await waitFor(async () => (await dropDown(patientMovementDropdown).exists()))
	await click(dropDown(patientMovementDropdown))
	await dropDown(patientMovementDropdown).select(movement)
});

step("Goto All section", async function () {
	await waitFor(all)
	await click(all, { force: true })
});

step("View Admitted patients", async function () {
	await click(admitted)
});

step("Enter admitted patient details", async function () {
	var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
	await write(patientIdentifierValue, into(textBox(below(admitted))))
	await press(enter, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
	await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click Admit", async function () {
	await click(admit);
});

step("Click Discharge", async function () {
	await click(discharge)
});

step("Click Discharge on popup", async function () {
	await waitFor(async () => !(await $(overlay).exists()));
	await click(text(discharge, within($(dischargePopup))));
});

step("Click Admit on popup", async function () {
	await waitFor(async () => !(await $(overlay).exists()));
	try {
		await highlight(cancel)
		await scrollTo(cancel)
		await click(admit)
	} catch (e) { }
});

step("Enter Form Values <observationFormFile>", async function (observationFormFile) {
	var observationFormValues = JSON.parse(fileExtension.parseContent(`./bahmni-e2e-common-flows/data/${observationFormFile}.json`))
	gaugeHelper.save(observationFormValues.ObservationFormName, observationFormValues)
	await taikoHelper.repeatUntilNotFound($(overlay))
	if (!await link(observationFormValues.ObservationFormName).exists(500, 1000)) {
		await click(addNewObsForm, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
		await scrollTo(button(observationFormValues.ObservationFormName))
		await click(button(observationFormValues.ObservationFormName));
	} else {
		await scrollTo(button(observationFormValues.ObservationFormName))
		await click(link(observationFormValues.ObservationFormName));
	}
	await taikoHelper.repeatUntilNotFound($(overlay))
	await taikoHelper.executeConfigurations(observationFormValues.ObservationFormDetails, observationFormValues.ObservationFormName)
	await click(save, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
	await taikoHelper.repeatUntilNotFound($(overlay))
})

step("Click History and Examination", async function () {
	await click(link(historyAndExamination), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
	await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Select the general ward", async function () {
	await click(generalWard);
	await click(generalWardRoom);
});