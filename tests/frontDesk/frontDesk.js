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
    link,evaluate, switchTo, closeTab
} = require('taiko');
var assert = require("assert");
var taikoHelper = require("./../util/taikoHelper");
var fileExtension = require("../util/fileExtension");

var expectedLocationsList=process.env.registrationLocations.split(",")
   var locationOption='//select[@id="location"]/option'
   var visitLocationOption='//select[@ng-model="selectedLocationUuid"]/option'
   var expectedLocationsList=process.env.registrationLocations.split(",")
   var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
   var overlay='#overlay'
   var patientMovementDropdown='Patient Movement:'
   var admitPatient='Admit Patient'
   var admit='Admit'
   var continueText='Continue with current Visit'
   var yes='Yes'
   var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
   var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
   var patientIdentifierElement='//input[@id="patientIdentifier"]'
   var availableBed='//ward-layout//descendant::li[@class="col available"]'
   var assign='Assign'
   var ipd='IPD'
   var eq5d='EQ-5D'
   var noResultsFound='No results found'
   
step("Verify the login locations in login page",async function(){
    var actualLocationsList=[]
    var actualLocationLength=(await $(locationOption).elements()).length
    for(let i=1;i<=actualLocationLength;i++){
        var element=`//select[@id="location"]/option[${i}]`
        actualLocationsList.push(await $(element).text())
    }
    expectedLocationsList.forEach((location)=>{
        assert.ok(actualLocationsList.includes(location))
    })
    
})

step("Verify the visit locations",async function(){
    var actualLocationsList=[]
    var actualLocationLength=(await $(visitLocationOption).elements()).length
    for(let i=1;i<=actualLocationLength;i++){
        var element=`//select[@ng-model="selectedLocationUuid"]/option[${i}]`
        var cleanValue=(await $(element).text()).replace("\n","").trim()
        actualLocationsList.push(cleanValue)
    }
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
 assert.ok(await $(`${table}`).exists())
}

step("Click on <wardType>",async function(wardType){

    var ward=`//span[contains(text(),'${wardType}')]`
    await scrollTo($(`${ward}`))
    await click($(`${ward}`))
})

step("Enter the patient id in search box",async function(){
    await write(patientIdentifierValue,into(textBox({ "placeholder": "Search..." })))
})

step("Verify the patient presence in the <wardType>",async function(wardType){
    var ward=`//span[contains(text(),'${wardType}')]`
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    if(!await textBox({ "placeholder": "Search..." }).exists())
    {
    await scrollTo($(`${ward}`))
    await click($(`${ward}`))
    }
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await write(patientIdentifierValue,into(textBox({ "placeholder": "Search..." })))
    assert.ok(text(patientIdentifierValue).exists())
})

step("Admit the patient to ipd in <visitType> visit",async function(visitType){

    taikoHelper.repeatUntilNotFound($(overlay))
    await waitFor(() => dropDown(patientMovementDropdown).exists(), 8000)
    await waitFor(4000)
    await dropDown(patientMovementDropdown).select(admitPatient);
    await waitFor(1000)
    await click(admit)
    await waitFor(1000)
    if(visitType=='OPD')
    {
        await click(continueText)
    }
    else
    {
        await click(yes)

    }
})

step("Search and select patient",async function(){
  
    var patientName = `${firstName} ${lastName}`
    await write(patientName, into($(patientIdentifierElement)))
    var patientNameElement=`//div[contains(text(),'${patientName}')]`
    await waitFor(async () => (await $(patientNameElement).exists()));
    await waitFor(200);
    await evaluate($(patientNameElement), (el) => el.click());
})
step("Select a bed from <wardType>",async function(wardType){
    var ward=`//span[contains(text(),'${wardType}')]`
    await scrollTo($(`${ward}`))
    await click($(`${ward}`))
    await click($(availableBed))
    await waitFor(1000)
    await click(assign)
})

step("Select the patient",async function(){
    await taikoHelper.repeatUntilNotFound($(overlay))
    await click(link(`${patientIdentifierValue}`))
})

step("Click on IPD", async function(){
    await taikoHelper.repeatUntilNotFound($(overlay))
    await waitFor(3000)
    await waitFor(async () => (await text(ipd).exists()),{interval: 1000})
    await click(text(ipd))
    await waitFor(async () => (await text(eq5d).exists()))
})

step("Verify the ipd dashboard",async function(){
    await verifyDisplayControl('Allergies')
    await verifyDisplayControl('Diagnosis')
    await verifyDisplayControl('Nutritional Values')
    await verifyDisplayControl('Forms')
    await verifyDisplayControl('Vitals')
    await verifyDisplayControl('Lab Results')
    await verifyDisplayControl('SF-12 WHODAS Score')
    await verifyDisplayControl('EQ-5D')
    await verifyDisplayControl('Recent Radiology Orders')

})

async function verifyDisplayControl(controlName){
    assert.ok(await text(controlName).exists())
   }
   
step('Close the ADT page',async function(){
    await switchTo(/ADT/)
    await closeTab(/ADT/)
    await waitFor(2000)})

step("Verify the patient is not appearing",async function(){
    await taikoHelper.repeatUntilNotFound($(overlay))
    assert.ok(text(noResultsFound).exists())
})

step("Verify the columns in the table <tableFile>",async function(tableFile){
    var tableFile = `./bahmni-e2e-common-flows/data/${tableFile}.json`;
    gauge.dataStore.scenarioStore.put("tableFile", tableFile)
    var table = JSON.parse(fileExtension.parseContent(tableFile))
    var tableHeaders = table.columns
    var tableElement=`//table[@class='${table.class}']`
    var headers=(await $(`${tableElement}//th`).elements()).length
    for(let i=1;i<headers;i++)
    {
     var element=`${tableElement}//th[${i}]`
     var columnHeader=(await $(element).text()).trim()
     assert.ok(tableHeaders.includes(columnHeader))
    }
})

step("Verify the sorting in the table <tableFile>",async function(tableFile){
    var tableFile = `./bahmni-e2e-common-flows/data/${tableFile}.json`;
    gauge.dataStore.scenarioStore.put("tableFile", tableFile)
    var table = JSON.parse(fileExtension.parseContent(tableFile))
    var tableElement=`//table[@class='${table.class}']`
    var sortByColumn=table.sortBy.column
    var sortByType=table.sortBy.type
    var sortByOrder=table.sortBy.order
    var columnId=table.columns.indexOf(sortByColumn)+1
    var rows=(await $(`//tbody//tr//td[${columnId}]`).elements()).length
    var sortByData=[]
    for(let i=1;i<=rows;i++)
    {
        var element=`${tableElement}//tbody//tr[${i}]//td[${columnId}]`
        var value=await (await $(element).text()).trim()
        if(value=='')
        {
            value=await $(element).text()
        }
        sortByData.push(value)
    }
    verifyColumnSorting(sortByData,sortByType,sortByOrder)
})

function verifyColumnSorting(sortByData,sortByType,sortByOrder){
    var unsortedDates=[...sortByData]
    var sortedDates=[]
    if('date'==sortByType)
    {
    if('asc'==sortByOrder)
    {
        sortedDates=sortDates(sortByData)
    }
    else
   {
    sortedDates=sortDates(sortByData).reverse()
   }
   }
   assert.ok(JSON.stringify(sortedDates) === JSON.stringify(unsortedDates))
}

function sortDates(datesArray) {
    return datesArray.sort((date1, date2) => new Date(date1) - new Date(date2));
  }
