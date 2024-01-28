"use strict";
const {click,toRightOf, above,$} = require('taiko');

var date = require("../util/date");
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
const taikoInteraction = require("../../../components/taikoInteraction.js");

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
var overlay='//div[@id="overlay" and @style="display: block;"]'
var cancelBlock='Cancel Block'
var postPoneBlock='Postpone Block'
var reason='reason'
var enterReason='enter reason'
var save='Save'
var today='Today'
var week='Week'
var edit='Edit'


step("Click OT Scheduling", async function() {
    await taikoInteraction.Click(otScheduling,'text')
});

step("Create a new surgical block", async function() {
    await taikoInteraction.Click(newSurgicalBlock,'text')
});

step("Select the surgeon", async function() {
    await taikoInteraction.Dropdown(surgeon,process.env.surgeon)
});

step("Select the theatre location", async function() {
    await taikoInteraction.Click(locationName,'text',toRightOf(location))
});

step("Select tomorrow as the theatre booking date", async function() {
    var startDate = date.tomorrow();
    startDate.setHours(11)
    startDate.setMinutes(0)
    var endDate = date.addMinutes(startDate,300)
    await taikoInteraction.Timefield(startDateTime,startDate)
    await taikoInteraction.Timefield(endDateTime,endDate)
});


step("Enter procedure details", async function() {
    await taikoInteraction.Write(procedure,'into',above(estTime))
});

step("Enter estimated time", async function() {
    await taikoInteraction.Write("15",'into',estimatedTime)
});

step("Add surgery details", async function() {
    await taikoInteraction.Click(add,'text')
});

step("Cancel the surgery", async function() {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Click(cancel,'text',toRightOf(patientIdentifierValue))
    await taikoInteraction.Click(cancelSurgery,'text')
});

step("Give reason", async function() {
    await taikoInteraction.Write(reason,'into',{placeHolder:enterReason})
});

step("Confirm cancellation", async function () {
    await taikoInteraction.Click(confirm,'text')
});

step("Add surgery", async function() {
    await taikoInteraction.Click(addSurgery,'text')
});

step("Click doctor's OT schedule", async function() {
    await taikoInteraction.Click(surgeonName,'text')
	await click(surgeonName)
});

step("Cancel surgeon's scheduled block", async function() {
    await taikoInteraction.Click(cancelBlock,'text')
    await taikoInteraction.Click(cancelBlock,'text',toRightOf(postPoneBlock))
});

step("Enter reason for surgical block cancellation", async function() {
    await taikoInteraction.Write(reason,'into',{placeHolder:enterReason})
});

step("Save OT data", async function() {
    await taikoInteraction.Click(save,'text')
});

step("Enter Patient id / name", async function() {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,"into",{placeHolder:"Enter Patient ID/ Name"});
    await taikoInteraction.Click(patientIdentifierValue,'text')
});

step("Goto operation day", async function () {
    await taikoInteraction.Click(toRightOf(today),'button')
    //await click(button(toRightOf(today),toLeftOf(week)))
});

step("Edit doctor's OT schedule", async function() {
    await taikoInteraction.Click(edit,'button')
});