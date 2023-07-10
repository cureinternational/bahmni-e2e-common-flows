"use strict";
const {
    click,
    waitFor,
    timeField,
    toRightOf,
    textBox,
    into,
    write,
    dropDown,
    highlight,
    below,
    within,
    scrollTo,
    $,
    text,
    confirm,
    accept,
    button,
    link,evaluate
} = require('taiko');
var assert = require("assert");
const { getDefaultHighWaterMark } = require('stream');

step("Verify the login locations in login page",async function(){
    var actualLocationsList=[]
    var actualLocationLength=(await $('//select[@id="location"]/option').elements()).length
    for(let i=1;i<actualLocationLength;i++){
        var element=`//select[@id="location"]/option[${i}]`
        actualLocationsList.push(await $(element).text())
    }
    var expectedLocationsList=process.env.registrationLocations.split(",")
    expectedLocationsList.forEach((location)=>{
        assert.ok(actualLocationsList.includes(location))
    })
    
})

step("Verify the visit locations",async function(){
    var actualLocationsList=[]
    var actualLocationLength=(await $('//select[@ng-model="selectedLocationUuid"]/option').elements()).length
    for(let i=1;i<actualLocationLength;i++){
        var element=`//select[@ng-model="selectedLocationUuid"]/option[${i}]`
        var cleanValue=(await $(element).text()).replace("\n","").trim()
        actualLocationsList.push(cleanValue)
    }
    var expectedLocationsList=process.env.registrationLocations.split(",")
    expectedLocationsList.forEach((location)=>{
        assert.ok(actualLocationsList.includes(location))
    })
})

step("Verify the appointments in grid view",async function(){
    await verifyGrid('Specialities')
    await verifyGrid('Providers')
    await verifyGrid('Services')
    await verifyGrid('Locations')
})

async function verifyGrid(gridName){
 var table=`//h3[text()='${gridName}']//parent::div//table`
 var bool=await $(`${table}`).exists()
 assert.ok(await $(`${table}`).exists())
}

step("Click on <wardType>",async function(wardType){

    var ward=`//span[contains(text(),'${wardType}')]`
    await scrollTo($(`${ward}`))
    await click($(`${ward}`))
})

step("Enter the patient id in search box",async function(){
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue,into(textBox({ "placeholder": "Search..." })))
})

step("Verify the patient presence in the <wardType>",async function(wardType){
    var ward=`//span[contains(text(),'${wardType}')]`
    await scrollTo($(`${ward}`))
    await click($(`${ward}`))
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue,into(textBox({ "placeholder": "Search..." })))
    assert.ok(text(patientIdentifierValue).exists())
})

step("Admit the patient to ipd in <visitType> visit",async function(visitType){

    await dropDown("Patient Movement:").select("Admit Patient");
    await click("Admit")
    await waitFor(1000)
    if(visitType=='OPD')
    {
        await click('Continue with current Visit')
    }
    else
    {
        await click('Yes')

    }
})
step("Search and select patient",async function(){
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
    var patientName = `${firstName} ${lastName}`
    await write(patientName, into($("//input[@id='patientIdentifier']")))
    await waitFor(async () => (await $(`//div[contains(text(),'${patientName}')]`).exists()));
    await waitFor(200);
    await evaluate($(`//div[contains(text(),'${patientName}')]`), (el) => el.click());
})
step("Select a bed from <wardType>",async function(wardType){
    var ward=`//span[contains(text(),'${wardType}')]`
    await scrollTo($(`${ward}`))
    await click($(`${ward}`))
    await click($('//ward-layout//descendant::li[@class="col available"]'))
    await waitFor(1000)
    await click("Assign")
})