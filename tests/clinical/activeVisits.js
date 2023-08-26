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

step("Verify the specialitis list", async function () {
   var speciliatyList=process.env.specialityList.split(',')
   var tabLength=(await $('//li[contains(@class,"tab-item")]').elements()).length
   for(let i=1;i<tabLength;i++)
   {
    var element=`//li[contains(@class,"tab-item")][${i}]//span[1]`
    var speciality=(await $(element).text()).trim()
    assert.ok(speciliatyList.includes(speciality))
   }
});

step("Verify the patient visit is added in my patient queue and the <speciality> queue",async function(speciality){

    await click("My Patients", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
    var fullName = firstName+' '+lastName
    assert.ok(await text(fullName).exists())
    waitFor(500)
    await click(speciality, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    waitFor(500)
    assert.ok(await text(fullName).exists())
})