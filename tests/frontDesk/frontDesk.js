"use strict";
const {waitFor,dropDown,$,text, switchTo, closeTab,toRightOf} = require('taiko');
var assert = require("assert");
var taikoHelper = require("./../util/taikoHelper");
const gaugeHelper = require("./../util/gaugeHelper")
var fileExtension = require("../util/fileExtension");
const taikoElement = require('../../../components/taikoElement.js');
const taikoAssert = require('../../../components/taikoAssert.js');
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoBrowserAction=require('../../../components/taikobrowserActions.js')

var expectedLocationsList = process.env.registrationLocations.split(",")
var locationOption = '//select[@id="location"]/option'
var visitLocationOption = '//select[@ng-model="selectedLocationUuid"]/option'
var expectedLocationsList = process.env.registrationLocations.split(",")
var overlay = '//div[@id="overlay" and @style="display: block;"]'
var patientMovementDropdown = 'Patient Movement:'
var admitPatient = 'Admit Patient'
var admit = 'Admit'
var continueText = 'Continue with current Visit'
var yes = 'Yes'
var patientIdentifierElement = '//input[@id="patientIdentifier"]'
var availableBed = '//ward-layout//descendant::li[@class="col available"]'
var assign = 'Assign'
var ipd= 'IPD'
var ipdElement = '//a[@ng-click="showDashboard(dashboard)"]'
var diagnosisElement = '//span[contains(text(),"Diagnosis")]'
var eq5d = 'EQ-5D'
var noResultsFound = 'No results found'
var implicitTimeOut = parseInt(process.env.implicitTimeOut)
var yesBtn = 'button#modal-revise-button1'
var continueBtn = 'button#modal-revise-button3'
var ipdToggle=process.env.enableIPDfeature


step("Verify the login locations in login page", async function () {
    var actualLocationsList = []
    var actualLocationLength = (await $(locationOption).elements()).length
    for (let i = 1; i <= actualLocationLength; i++) {
        var element = `//select[@id="location"]/option[${i}]`
        actualLocationsList.push(await $(element).text())
    }
    expectedLocationsList.forEach((location) => {
        taikoAssert.assertArrayPresence(actualLocationsList, location)
    })

})

step("Verify the visit locations", async function () {
    var actualLocationsList = []
    var actualLocationLength = (await $(visitLocationOption).elements()).length
    for (let i = 1; i <= actualLocationLength; i++) {
        var element = `//select[@ng-model="selectedLocationUuid"]/option[${i}]`
        var cleanValue = (await $(element).text()).replace("\n", "").trim()
        actualLocationsList.push(cleanValue)
    }
    expectedLocationsList.forEach((location) => {
        taikoAssert.assertArrayPresence(actualLocationsList, location)
    })
})

step("Verify the appointments in grid view", async function () {
    await taikoHelper.wait(implicitTimeOut)
    await verifyGrid('Specialities')
    await verifyGrid('Providers')
    await verifyGrid('Services')
    await verifyGrid('Locations')
})

async function verifyGrid(gridName) {
    var table = `//h3[text()="${gridName}"]//parent::div//table`
    await taikoHelper.wait(2000)
    await taikoAssert.assertExists($(table))
}

step("Click on <wardType>", async function (wardType) {

    var ward = `//span[contains(text(),'${wardType}')]`
    await taikoInteraction.Click(`${ward}`, 'xpath')
})

step("Enter the patient id in search box", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue, 'into', { "placeholder": "Search..." })
})

step("Verify the patient presence in the <wardType>", async function (wardType) {
    var ward = `//span[contains(text(),'${wardType}')]`
    if (!await taikoElement.isPresent($('//input[@ng-model="searchText"]'))) {
        await taikoInteraction.Click(`${ward}`, 'xpath')
    }
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue, 'xpath', '//input[@ng-model="searchText"]')
    await taikoElement.isExists(text(patientIdentifierValue))
})

step("Admit the patient to ipd in <visitType> visit", async function (visitType) {

    await taikoElement.waitToExists(dropDown(patientMovementDropdown))
    await taikoHelper.wait(2000)
    await taikoInteraction.Dropdown(patientMovementDropdown, admitPatient)
    await taikoHelper.wait(2000)
    await taikoInteraction.Click(admit, 'text')
    if (visitType == 'OPD') {
        await taikoInteraction.EvaluateClick($(continueBtn))
    }
})

step("Search and select patient", async function () {
    var firstName = gaugeHelper.get("patientFirstName")
    var lastName = gaugeHelper.get("patientLastName")
    var patientName = `${firstName} ${lastName}`
    await taikoInteraction.Write(patientName, 'xpath', patientIdentifierElement)
    var patientNameElement = `//div[contains(text(),"${patientName}")]`
    await taikoElement.waitToPresent($(patientNameElement))
    await taikoInteraction.EvaluateClick($(patientNameElement))
})
step("Select a bed from <wardType>", async function (wardType) {
    var ward = `//span[contains(text(),'${wardType}')]`
    if(await taikoElement.isNotExists(text('General Ward -ICU')))
    {
        await taikoInteraction.Click(`${ward}`, 'xpath')
    }
    await taikoInteraction.Click(availableBed, 'xpath')
    await taikoInteraction.Click(assign, 'text')
    await taikoHelper.wait(2000)
})

step("Select the patient", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Click(patientIdentifierValue, 'link')
})

step("Click on IPD", async function () {
    await taikoElement.waitToExists($(ipdElement))
    await taikoHelper.wait(1000)
    await taikoInteraction.Click(ipd, 'text')
    await taikoHelper.wait(1000)
    await taikoElement.waitToExists($(diagnosisElement))
})

step("Verify the ipd dashboard", async function () {
    await taikoHelper.wait(implicitTimeOut)
    await taikoElement.waitToExists(text('EQ-5D'))
    await verifyDisplayControl('Allergies')
    await verifyDisplayControl('Diagnosis')
    await verifyDisplayControl('Nutritional Values')
    await verifyDisplayControl('Observation Forms (Previous Version)')
    await verifyDisplayControl('Vitals')
    await verifyDisplayControl('Lab Results')
    await verifyDisplayControl('SF-12 WHODAS Score')
    await verifyDisplayControl('EQ-5D')
    await verifyDisplayControl('Recent Radiology Orders (The past 4 visits)')

})

async function verifyDisplayControl(controlName) {
    await taikoAssert.assertExists(text(controlName))
}

step('Close the ADT page', async function () {
    await switchTo(/ADT/)
    await switchTo(/adt/)
    await closeTab(/ADT/)
    await waitFor(2000)
})

step("Verify the patient is not appearing", async function () {
    assert.ok(text(noResultsFound).exists())
})

step("Verify the columns in the table <tableFile>", async function (tableFile) {
    var tableFile = `./bahmni-e2e-common-flows/data/${tableFile}.json`;
    gaugeHelper.save("tableFile", tableFile)
    var table = JSON.parse(fileExtension.parseContent(tableFile))
    var tableHeaders = table.columns
    var tableElement = `//table[@class='${table.class}']`
    if(await taikoElement.isExists($(tableElement)))
    {
    var headers = (await $(`${tableElement}//th`).elements()).length
    for (let i = 1; i <= headers; i++) {
        var element = `${tableElement}//th[${i}]`
        var columnHeader = (await $(element).text()).trim()
        await taikoAssert.assertArray(tableHeaders, columnHeader)
    }
}
})

step("Verify the sorting in the table <tableFile>", async function (tableFile) {
    var tableFile = `./bahmni-e2e-common-flows/data/${tableFile}.json`;
    gaugeHelper.save("tableFile", tableFile)
    var table = JSON.parse(fileExtension.parseContent(tableFile))
    var tableElement = `//table[@class='${table.class}']`
    var sortByColumn = table.sortBy.column
    var sortByType = table.sortBy.type
    var sortByOrder = table.sortBy.order
    var columnId = table.columns.indexOf(sortByColumn) + 1
    var rows = (await $(`//tbody//tr//td[${columnId}]`).elements()).length
    var sortByData = []
    for (let i = 1; i <= rows; i++) {
        var element = `${tableElement}//tbody//tr[${i}]//td[${columnId}]`
        var value = await (await $(element).text()).trim()
        if (value == '') {
            value = await $(element).text()
        }
        sortByData.push(value)
    }
    verifyColumnSorting(sortByData, sortByType, sortByOrder)
})

function verifyColumnSorting(sortByData, sortByType, sortByOrder) {
    var unsortedDates = [...sortByData]
    var sortedDates = []
    if ('date' == sortByType) {
        if ('asc' == sortByOrder) {
            sortedDates = sortDates(sortByData)
        }
        else {
            sortedDates = sortDates(sortByData).reverse()
        }
    }
    assert.ok(JSON.stringify(sortedDates) === JSON.stringify(unsortedDates))
}

function sortDates(datesArray) {
    return datesArray.sort((date1, date2) => new Date(date1) - new Date(date2));
}

step("Click on Add to drug chart link for the medication <drug>", async function (drug) {
   if(ipdToggle=='true')
    {
    var prescriptionFile = `./bahmni-e2e-common-flows/data/${drug}.json`
    var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
    var drugName = medicalPrescriptions.drug_name
    await taikoInteraction.Click('Add to Drug Chart', 'text', toRightOf(drugName))
    }
})

step("Enter the start time for the medication <drug>", async function (drug) {
    if(ipdToggle=='true')
{
    var prescriptionFile = `./bahmni-e2e-common-flows/data/${drug}.json`
    var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
    var startTime = medicalPrescriptions.startTime
    var element = `//div[@class="bx--time-picker__input"]`
    await taikoInteraction.Click(`${element}`, 'xpath')
    await taikoInteraction.Write(startTime,'into',{"placeholder":"hh:mm"})
}
})

step("Click on drug chart save", async function () {
    if(ipdToggle=='true')
    {
    var element = '//button[contains(text(),"Save")]'
    await taikoInteraction.Click(element, 'xpath')
    }
})

step("Click on <tabType> tab", async function (tabType) {
    //var tab = `//a[contains(text(),"${tabType}") and @ng-click="showDashboard(dashboard)"]`
   // await taikoInteraction.Click(`${tab}`,'xpath')
    //await taikoHelper.wait(5000)
})

step("Verify if the medication <medicine> is present", async function (medicine) {
   // var prescriptionFile = `./bahmni-e2e-common-flows/data/${medicine}.json`
   // var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
   // var drugName = medicalPrescriptions.drug_name
   // await taikoElement.isPresent(text(drugName))
})

step("Click on Patient Dashboard",async function(){
    await taikoInteraction.Click('Patient Dashboard','link')
})

step("Click on IPD back button",async function(){
    await taikoBrowserAction.navigateBack()
})