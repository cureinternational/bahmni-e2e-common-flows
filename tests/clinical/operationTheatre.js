"use strict";
const {
    click,
    waitFor,
    focus,
    button,
    toRightOf, 
    textBox, 
    above,
    into, 
	write, 
	$,
	dropDown,
    fileField,
    timeField,
    attach,
    scrollTo,
    highlight,
    toLeftOf,
} = require('taiko');

var date = require("../util/date");
const taikoHelper = require("../util/taikoHelper")
var otScheduling = 'OT Scheduling'
var newSurgicalBlock = 'New Surgical Block'
var surgeon = 'Surgeon'
var locationName = process.env["OTLocation"].split(":")[0]
var location='Location'
var startDateTime = 'Start Date-time'
var endDateTime = 'End Date-time'
var procedure = 'Procedure'
var estTime='Est time'
var estimatedTime='#estTimeMinutesID'
var add='Add'
var cancel='Cancel'
var addSurgery='Add surgery'
var cancelSurgery='Cancel Surgery'
var reason='Reason'
var enterReason='enter reason'
var confirm='Confirm'
let surgeonName = 'Surgeon - '+process.env.surgeon
var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
var overlay='#overlay'
var cancelBlock='Cancel Block'
var postPoneBlock='Postpone Block'
var reason='reason'
var enterReason='enter reason'
var save='Save'
var today='Today'
var week='Week'
var edit='Edit'


step("Click OT Scheduling", async function() {
	await click(otScheduling)
});

step("Create a new surgical block", async function() {
    await scrollTo(newSurgicalBlock)
    await highlight(newSurgicalBlock)
	await click(newSurgicalBlock,{waitForNavigation:true,navigationTimeout:process.env.actionTimeout});
});

step("Select the surgeon", async function() {
    await highlight(dropDown(toRightOf(surgeon)))
	await dropDown(toRightOf(surgeon)).select(process.env.surgeon);
});

step("Select the theatre location", async function() {
	await click(locationName,toRightOf(location));
});

step("Select tomorrow as the theatre booking date", async function() {
    var startDate = date.tomorrow();
    startDate.setHours(11)
    startDate.setMinutes(0)
    var endDate = date.addMinutes(startDate,300)
	await timeField(toRightOf(startDateTime)).select(startDate);
    await timeField(toRightOf(endDateTime).select(endDate));
    
});


step("Enter procedure details", async function() {
    await write(procedure,into(textBox(above(estTime))));
});

step("Enter estimated time", async function() {
    await write("15", $(estimatedTime))
});

step("Add surgery details", async function() {
	await click(add);
});

step("Cancel the surgery", async function() {
    await highlight(button(cancel),toRightOf(patientIdentifierValue));
    await scrollTo(cancel)
	await click(cancel,toRightOf(patientIdentifierValue));
    await waitFor(patientIdentifierValue)
    await highlight(cancelSurgery)
    await scrollTo(cancelSurgery)
    await click(cancelSurgery);
});

step("Give reason", async function() {
	await write(reason,into(textBox({placeHolder:enterReason})));
});

step("Confirm cancellation", async function () {
	await click(confirm);
});

step("Add surgery", async function() {
    await click(addSurgery);
});

step("Click doctor's OT schedule", async function() {
    await scrollTo(surgeonName)
	await click(surgeonName)
});

step("Cancel surgeon's scheduled block", async function() {
    await scrollTo(cancelBlock)
	await click(cancelBlock)
    await waitFor("This change will affect all surgeries of the block")
    await scrollTo(cancelBlock,toRightOf(postPoneBlock))
    await click(cancelBlock,toRightOf(postPoneBlock))
});

step("Enter reason for surgical block cancellation", async function() {
	await write(reason,into(textBox({placeHolder:enterReason})));
});

step("Save OT data", async function() {
    await click(save,{waitForNavigation:true,navigationTimeout:process.env.actionTimeout});
	await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Enter Patient id / name", async function() {
    await write(patientIdentifierValue,into(textBox({placeHolder:"Enter Patient ID/ Name"})));
    await click(`( ${patientIdentifierValue} )`)
});

step("Goto operation day", async function () {
    await click(button(toRightOf(today),toLeftOf(week)))
});

step("Edit doctor's OT schedule", async function() {
    await highlight(button(edit))
    await scrollTo(edit)
    await click(button(edit))
});