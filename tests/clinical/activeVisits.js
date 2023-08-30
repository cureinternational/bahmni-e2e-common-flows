"use strict";
const {
    click,
    waitFor,
    focus,
    toRightOf,
    textBox,
    text,
    into,
    write,
    $,
    dropDown,
    fileField,
    attach,
    scrollTo,
    reload,
    highlight,
    below,
    button,
    near,
    to,
    link,
    timeField,
    evaluate
} = require('taiko');
var assert = require("assert");
const gaugeHelper = require("../util/gaugeHelper");
const taikoInteraction = require("../../../components/taikoInteraction");
const taikoassert= require("../../../components/taikoAssert");
var tab='//li[contains(@class,"tab-item")]'
var speciliatyList=process.env.specialityList.split(',')
var myPatients='My Patients'


step("Verify the specialitis list", async function () {
   var tabLength=(await $(tab).elements()).length
   
   for(let i=1;i<tabLength;i++)
   {
    var tabItem=`//li[contains(@class,"tab-item")][${i}]//span[1]`
    var speciality=(await $(tabItem).text()).trim()
    await taikoassert.assertArray(speciliatyList,speciality)
}
});

step("Verify the patient visit is added in my patient queue and the <speciality> queue",async function(speciality){
    var firstName = gaugeHelper.get("patientFirstName")
    var lastName = gaugeHelper.get("patientLastName")
    var fullName = firstName+' '+lastName
    await taikoInteraction.Click(myPatients,'text')
    await taikoassert.assertExists(text(fullName))
    await taikoInteraction.Click(speciality,'text')
    await taikoassert.assertExists(text(fullName))
})