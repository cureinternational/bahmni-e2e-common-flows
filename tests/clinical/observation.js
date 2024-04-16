"use strict";
const {toRightOf,text,$, button,link,} = require('taiko');
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
const taikoInteraction = require("../../../components/taikoInteraction.js");
const taikoElement= require("../../../components/taikoElement.js");
const fileExtension = require("../util/fileExtension")

var overlay='//div[@id="overlay" and @style="display: block;"]'
var vitals='Vitals'
var vital='Vital'
var pulse='Pulse (beats/min)'
var addNewObsForm='Add New Obs Form'
var historyNotes='History Notes'
var smokingHistory='Smoking History'
var datapath=process.env.dataPath
var reportjpg=`./bahmni-e2e-common-flows/data/${datapath}/consultation/observations/patientReport.jpg`
var report='//*[@class="consultation-image"]/input'
var reportVideo=`./bahmni-e2e-common-flows/data/${datapath}/consultation/observations/Video.mp4`
var video='//*[@class="consultation-video"]/input'
var author='Author'
var comment='Comment'
var objective='Objective'
var assessment='Assessment'
var plan='Plan'
var comments='Comments'
var cancel='Cancel'
const implicitWaitTime=parseInt(process.env.implicitTimeOut)

step("Click Vitals", async function () {
    await taikoHelper.repeatUntilFound(text(vital))
    await taikoInteraction.Click(vitals,'text')
    await taikoHelper.repeatUntilFound(text(pulse))

});

step("Enter History and examination details <filePath>", async function (filePath) {
    var historyAndExaminationFile = `./bahmni-e2e-common-flows/data/${filePath}.json`
    var historyAndExaminationDetails = JSON.parse(fileExtension.parseContent(historyAndExaminationFile))
    gaugeHelper.save("historyAndExaminationDetails", historyAndExaminationDetails)
    var formNameElement=`'//button[contains(text(),"${historyAndExaminationDetails.ObservationFormName}")]'`
    if (await taikoElement.isNotPresent($(formNameElement)))
    {
        await taikoInteraction.Click(addNewObsForm,'text')
        await taikoInteraction.Click(historyAndExaminationDetails.ObservationFormName,'button')
	} else
    {
        await taikoInteraction.Click(historyAndExaminationDetails.ObservationFormName,'link')
	}
    await taikoInteraction.Write(historyAndExaminationDetails.History_Notes, 'into', historyNotes)
    await taikoInteraction.Click(historyAndExaminationDetails.Smoking_status,'text', toRightOf(smokingHistory));
    await taikoInteraction.Attach(reportjpg,$(report));
    await taikoInteraction.Attach(reportVideo,$(video));
});

step("Enter Orthopaedic followup <filePath>", async function (filePath) {
    var followup = `./bahmni-e2e-common-flows/data/${filePath}.json`
    var followupdetails = JSON.parse(fileExtension.parseContent(followup))
    gaugeHelper.save("orthopaedicfollowupdetails", followupdetails)

    if (!await taikoElement.isPresent(link(followupdetails.ObservationFormName))) {
        await taikoInteraction.Click(addNewObsForm,'text')
        await taikoInteraction.Click(followupdetails.ObservationFormName,'button')
	}
    else
    {
        await taikoInteraction.Click(followupdetails.ObservationFormName,'link')
	}
    await taikoInteraction.Dropdown(toRightOf(author),followupdetails.author)
    await taikoInteraction.Write(followupdetails.comment, 'into',toRightOf(comment));
    await taikoInteraction.Write(followupdetails.objective, 'into',toRightOf(objective));
    await taikoInteraction.Write(followupdetails.assessment, 'into',toRightOf(assessment));
    await taikoInteraction.Write(followupdetails.plan, 'into',toRightOf(plan));
    await taikoInteraction.Write(followupdetails.comment, 'into',toRightOf(comments));
});


step("Click patient name", async function () {
    var firstName = gaugeHelper.get("patientFirstName")
    var patientElement=`//div[@class='fc-title' and contains(text(),'${firstName}')]`
    await taikoInteraction.EvaluateClick($(patientElement))
    var btnstatus= await taikoElement.elementDisabled(button(cancel))
    if(btnstatus)
    {
        var patientid=gaugeHelper.get("patientIdentifier")
        var patientName=gaugeHelper.get("patientFullName")
        await taikoInteraction.Dropdown("Patient:",patientName+" ("+patientid+")")
    }
});

step("Click patient name from list view", async function () {
        var patientName=gaugeHelper.get("patientFullName")
        await taikoInteraction.Click(patientName,'text')
});

step("Should not find the patient's name", async function () {
    var fullName = gaugeHelper.get("patientFullName")
    await taikoElement.isNotExists(text(fullName))
});


step("Click patient name from waitlist", async function () {
    var fullName = gaugeHelper.get("patientFullName")
    await taikoElement.waitToExists(text(fullName))
    await taikoInteraction.Click(fullName,'text')
});

step("Filter by provider name",async function(){
    var provider=process.env.provider
    await taikoInteraction.Write(provider,'into',{placeHolder:"Enter provider name"})
    await taikoInteraction.pressEnter()
    await taikoHelper.wait(2000)
})

step("Filter by appointment status <status>",async function(status){
    await taikoInteraction.Write(status,'into',{placeHolder:"Enter status Name"})
    await taikoInteraction.pressEnter()
    await taikoHelper.wait(2000)
})