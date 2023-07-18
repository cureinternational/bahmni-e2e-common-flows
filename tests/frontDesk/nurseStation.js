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
var fileExtension = require("../util/fileExtension");

step("Doctor opens admission tab", async function () {
	await taikoHelper.repeatUntilNotFound($("#overlay"))
	await click("To Admit", { force: true, waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
});

step("Enter adt notes <notes>", async function (notes) {
	await write(notes, into(textBox(below("Adt Notes"))))
});

step("Select bed for admission <ward>", async function (ward) {
	await taikoHelper.repeatUntilFound(text(ward))
	// await waitFor(async () => await $("General Ward").exists())
	await click(ward)
});

step("Allocate available bed", async function () {
	await click($("//*[@class='col available' or @class='bed AVAILABLE']"))
});

step("Click Assign", async function () {
	await click("Assign", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
	
	await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Admit the patient", async function () {
	await click("Admit", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
	await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Discharge the patient", async function () {
	await taikoHelper.repeatUntilNotFound($("#overlay"))
	await waitFor(3000)
	await waitFor(async () => (await dropDown('Patient Movement:').exists()))
	await dropDown('Patient Movement:').select('Discharge Patient')
	await waitFor(1000)
	await click("Discharge", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
	await waitFor(1000)

});

step("Select Patient Movement <movement>",async function(movement)
 {
	await waitFor(async () => (await dropDown("Patient Movement:").exists()))
	await click(dropDown("Patient Movement:"))
	await dropDown('Patient Movement:').select(movement)
});

step("Goto All section", async function () {
	await waitFor("All")
	await click("All", { force: true })
});

step("View Admitted patients", async function () {
	await click("Admitted")
});

step("Enter admitted patient details", async function () {
	var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
	await write(patientIdentifierValue, into(textBox(below("Admitted"))))
	await press("Enter", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
	await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Click Admit", async function () {
	await click("Admit");
});

step("Click Discharge", async function () {
	await click("Discharge")
});

step("Click Discharge on popup", async function () {
	await waitFor(async () => !(await $("overlay").exists()));
	await click(text('Discharge', within($('[ng-click="dischargeConfirmation()"]'))));
});

step("Click Admit on popup", async function () {
	await waitFor(async () => !(await $("overlay").exists()));
	try {
		await highlight("Cancel")
		await scrollTo("Cancel")
		await click("Admit")
	} catch (e) { }
	// await click(text('Admit', within($('[ng-click="admitConfirmation()"]'))));
});

step("Enter Form Values <observationFormFile>", async function (observationFormFile) {
	var observationFormValues = JSON.parse(fileExtension.parseContent(`./bahmni-e2e-common-flows/data/${observationFormFile}.json`))
	gauge.dataStore.scenarioStore.put(observationFormValues.ObservationFormName, observationFormValues)
	await taikoHelper.repeatUntilNotFound($("#overlay"))
	if (!await link(observationFormValues.ObservationFormName).exists(500, 1000)) {
		await click("Add New Obs Form", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
		await scrollTo(button(observationFormValues.ObservationFormName))
		await click(button(observationFormValues.ObservationFormName));
	} else {
		await scrollTo(button(observationFormValues.ObservationFormName))
		await click(link(observationFormValues.ObservationFormName));
	}
	await taikoHelper.repeatUntilNotFound($("#overlay"))
	await taikoHelper.executeConfigurations(observationFormValues.ObservationFormDetails, observationFormValues.ObservationFormName)
	await click("Save", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
	await taikoHelper.repeatUntilNotFound($("#overlay"))
})

step("Click History and Examination", async function () {
	await click(link("History and Examination"), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
	await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Select the general ward", async function () {
	await click('General Ward');
	await click('General Ward room');
});