"use strict";
const {text,$} = require('taiko');
const gaugeHelper = require("../util/gaugeHelper");
const taikoInteraction = require("../../../components/taikoInteraction.js");
const taikoassert= require("../../../components/taikoAssert.js");
const taikoElement = require('../../../components/taikoElement.js');
const taikoHelper = require('../util/taikoHelper.js');
var tab='//li[contains(@class,"tab-item")]'
var speciliatyList=process.env.specialityList.split(',')
var myPatients='My Patients'
var identifer='Identifier'
var implicitWaitTime=parseInt(process.env.implicitTimeOut)


step("Verify the specialitis list", async function () {
   var tabLength=(await $(tab).elements()).length

   for(let i=1;i<tabLength;i++)
   {
    var tabItem=`//li[contains(@class,"tab-item")][${i}]//span[1]`
    var speciality=(await $(tabItem).text()).trim()
    if(speciality!='My Patients'&&speciality!='Active'&&speciality!='All'&&speciality!='Notifications')
    {
    await taikoassert.assertArray(speciliatyList,speciality)
    }
}
});

step("Verify the patient visit is added in my patient queue and the <speciality> queue",async function(speciality){
    var firstName = gaugeHelper.get("patientFirstName")
    var lastName = gaugeHelper.get("patientLastName")
    var fullName = firstName+' '+lastName
    await taikoInteraction.Click(myPatients,'text')
    await taikoElement.waitToExists(text(identifer))
    await taikoassert.assertExists(text(fullName))
    await taikoInteraction.Click(speciality,'text')
    await taikoElement.waitToExists(text(identifer))
    await taikoassert.assertExists(text(fullName))
})