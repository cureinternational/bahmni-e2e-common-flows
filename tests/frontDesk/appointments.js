const {$,dropDown,button,within,toRightOf,write,click,toLeftOf,text,into,textBox,waitFor,below} = require('taiko');
var date = require("../util/date");
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
var assert = require("assert");
const { stat } = require('fs');
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoElement = require('../../../components/taikoElement.js');
const taikoassert = require('../../../components/taikoAssert.js');
const taikoAssert = require('../../../components/taikoAssert.js');
const taikoBrowserAction=require('../../../components/taikobrowserActions.js')

var addNewAppointment = 'Add new appointment'
var patientNameId='Patient Name or ID'
var lastName = gaugeHelper.get("patientLastName")
var searchbox='//input[@id="PatientSearch"]'
var service='Service'
var appointmentCategorySearch='appointment-category-search'
var specialitySearch='speciality-search'
var serviceSearch='service-search'
var providerSearch='provider-search'
var locationSearch='location-search'
var location = 'Location'
var appointmentDateElement = 'Appointment date'
var summary='Summary'
var yes='Yes'
var fcwidgetcontent='.fc-widget-content'
var overlay='//div[@id="overlay" and @style="display: block;"]'
var save='Save'
var update='Update'
var yesIConfirm='Yes, I confirm'
var checkAndSave='Check and Save'
var btn='button'
var goNext='[ng-click="goToNext()"]'
var week='Week'
var day='Day'
var closeBtn='//div[@class="AddAppointment_close__2kahG"]'
var discard='Discard'
var listView='List view'
var regularAppointment='Regular Appointment'
var recurringAppointment='Recurring Appointment'
var appointmentStartDate='Appointment start date'
var inputOccurences='input#occurrences'
var repeatsEvery='Repeats every'
var cancelAll='Cancel All'
var btnYes='button#yes'
var btnYesAll='button#yes_all'
var cancel='Cancel'
var cancelBtn='//button[contains(text(),"Cancel")]'
var patientDropdown='Patient:'
var edit='Edit'
var startTime='Start time'
var endTime='End time'
var admin='Admin'
var awaitingAppointments='Awaiting Appointments'
var addNewService='Add New Service'
var save='Save'
var manageLocations='Manage Locations'
var today='Today'
var listView='List view'
let appointmentStartTime = gaugeHelper.get("appointmentStartTime");
let appointmentEndTime = gaugeHelper.get("appointmentEndTime");
var locationSearchInput="//div[@data-testid='location-search']//input"
var locationSearchBtn="//div[@data-testid='location-search']//button[1]"
var specialitySearchInput="//div[@data-testid='speciality-search']//input"
var speciality=process.env.specialityList.split(',')
var locations=process.env.registrationLocations.split(',')
var providers=process.env.providersList.split(',')
var providerSearchInput="//div[@data-testid='provider-search']//input"
var providerSearchBtn="//div[@data-testid='provider-search']//button[1]"
var conflictMessage='You have an overlapping conflict'
var saveAnyway='Save Anyway'
var holidayDateElement='div.bx--form-requirement'
var holidayText='Date selected is a Public Holiday'

step("View all appointments", async function () {
    var list=process.env.appointmentList
    await taikoInteraction.Click(list,'text')
    await taikoBrowserAction.reloadPage()
});

step("Click Add New appointment", async function () {
    await taikoInteraction.Click(addNewAppointment,'text')
});

step("Select Patient id", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    var firstName = gaugeHelper.get("patientFirstName")
    await taikoInteraction.Write(patientIdentifierValue,"into",{ placeHolder: patientNameId })
    await taikoInteraction.Click(firstName,'text')
});

step("Select patient", async function () {
    var firstName = gaugeHelper.get("patientFirstName")
    var lastName = gaugeHelper.get("patientLastName")
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    var patientName = `${firstName} ${lastName} (${patientIdentifierValue})`
    var patientNameElement=`//div[text()='${patientName}']`
        await taikoInteraction.Write(patientIdentifierValue,"xpath",searchbox)
        await taikoInteraction.ScrollTo($(patientNameElement))
        if(await taikoElement.isExists($(patientNameElement)))
        {
            await taikoInteraction.EvaluateClick($(patientNameElement))
        }
});

step("Select service <service>", async function (serviceName) {
    await taikoInteraction.Dropdown(toRightOf(service),serviceName)
});

step("Search and select category", async function () {
    await selectDropDown(appointmentCategorySearch,process.env.category)
});

step("Search and select speciality", async function () {
    await selectDropDown(specialitySearch,process.env.speciality)
});

step("Search and select speciality as <speciality>", async function (speciality) {
    await selectDropDown(specialitySearch,speciality)
});

step("Search and select service", async function () {
    await selectDropDown(serviceSearch,process.env.service)
});

step("Search and select service as <service>", async function (service) {
    await selectDropDown(serviceSearch,service)
});

step("Search and select provider", async function () {
    await selectDropDown(providerSearch,process.env.provider)
});

step("Search and select provider as <provider>", async function (provider) {
    await selectDropDown(providerSearch,provider)
});
step("Search and select location", async function () {
    await selectDropDown(locationSearch,process.env.location)
});

async function selectDropDown(locator,value){
    var element=`//div[@data-testid='${locator}']//input`
    await taikoInteraction.Write(value,"xpath",element)
    var selectableElement="//div[text()='" + value + "']"
    await taikoElement.waitToPresent($(selectableElement))
    await taikoInteraction.EvaluateClick($(selectableElement))
}
step("Search and select appointment location", async function () {
    await taikoInteraction.Click(location,'text')
    await taikoInteraction.Click(process.env.appointmentLocation,'text')
});

step("Select appointment date <date>", async function (date) {
    await taikoInteraction.Clear(below(appointmentDateElement))
    await taikoInteraction.Write(date,"into",below(appointmentDateElement))
});

step("Select location <location>", async function (locationName) {
    await taikoInteraction.Dropdown(location,locationName)
});

step("Enter appointment time into Start time", async function () {
    var time= gaugeHelper.get("startTime")
    await taikoInteraction.Write(time,"into",{placeholder:"hh:mm"})
    await taikoInteraction.Dropdown(below('Start Time'),gaugeHelper.get("AM"))
});
step("Close the appointment popup",async function(){
    await taikoInteraction.Click(addNewAppointment,'text')
    await taikoInteraction.Click(summary,'text')
    await taikoInteraction.Click(yes,'text')
})

step("Open calender at time <appointmentTime>", async function (appointmentTime) {
    await taikoInteraction.Click(fcwidgetcontent,'xpath',toRightOf(`${appointmentTime}`))
    gaugeHelper.save("appointmentStartDate", date.getDateFromddmmyyyy(await textBox({ placeHolder: "dd/mm/yyyy" }).value()))
    gaugeHelper.save("startDate", await textBox({ placeHolder: "dd/mm/yyyy" }).value())
    gaugeHelper.save("startTime", await textBox({ placeHolder: "hh:mm" }).value())
    gaugeHelper.save("AM", await dropDown(below('Start Time')).value())
    gauge.message(`Appointment start date ${gaugeHelper.get("startDate")}`)
    gauge.message(`Appointment start time ${gaugeHelper.get("startTime")}`)
    gauge.message(`Appointment AM/PM ${gaugeHelper.get("AM")}`)
});

step("put <appointmentDate> as appointment date", async function (appointmentDate) {
    gaugeHelper.save("appointmentStartDate", date.getDateFromddmmyyyy(appointmentDate))
});


step("Compute end time", async function () {
    await waitFor(2000)
});
step("Click Save", async function () {
    await taikoInteraction.Click(save,'text')
});

step("Click Update", async function () {
    await taikoInteraction.Click(update,'text')
    await taikoInteraction.Click(yesIConfirm,'text')
});

step("Check and Save", async function () {
    await taikoInteraction.Click(checkAndSave,'text')
});

step("Goto tomorrow's date", async function () {
    await taikoInteraction.Click({ type: btn },'button',within($(goNext)))
});

step("Goto appointments's date", async function () {
    var appointmentStartDate = gaugeHelper.get("appointmentStartDate")
    await taikoInteraction.Timefield(toRightOf(week),new Date(appointmentStartDate))
});

step("Goto Next week", async function () {
    await taikoInteraction.Click(week,'text')
    var month = date.getShortNameOfMonth(date.today())
    await click(button(), toRightOf(month));
});

step("Goto day view of the calendar", async function () {
    await taikoInteraction.Click(day,'text')
    var month = date.getShortNameOfMonth(date.today())
    await click(button(), toRightOf(month));
});

step("Click Close", async function () {
 //await taikoInteraction.Click(closeBtn,'xpath')
   // if(await taikoElement.isExists(text(discard)))
    //{
    //await taikoInteraction.Click(discard,'text')
    //}
//await taikoHelper.wait(8000)
})

step("Goto List view", async function () {
    await taikoInteraction.Click(listView,'link')
});

step("select the Regular appointment option", async function () {
    await taikoInteraction.Click(regularAppointment,'text')
});

step("select appointment status as <status>",async function(status){
    var appointMentStatus=`//span[text()="${status}"]`
    await taikoInteraction.ScrollTo($(appointMentStatus))
    await taikoInteraction.Click(appointMentStatus,'xpath')
})

step("select the teleconsultation appointment option", async function () {
    /*will enable once the teleconsultation is enabled */
   // await click(checkBox(toLeftOf("Teleconsultation")))
});

step("select the recurring appointment option", async function () {
    await taikoInteraction.Click(recurringAppointment,'text')
});

step("select the Start date as <appointmentDate>", async function (appointmentDate) {
    var appointmentStartDate = gaugeHelper.get("appointmentStartDate")
    await taikoInteraction.Write(appointmentDate,"into",below(appointmentStartDate))
    gaugeHelper.save("appointmentStartDate", new Date())
});

step("select the End date as after <times> occurances", async function (times) {
    await taikoInteraction.Write(times,"xpath",inputOccurences)
});

step("select Repeats every <numberOfDays> days", async function (numberOfDays) {
    await taikoInteraction.Write(numberOfDays,"into",below(repeatsEvery))
});

step("Click Cancel all", async function () {
    await taikoInteraction.Click(cancelAll,'text')
});

step("Click yes", async function () {
    await taikoElement.waitToPresent($(btnYes))
    await taikoInteraction.EvaluateClick($(btnYes))
});

step("Click Cancel", async function () {
    await taikoInteraction.Click(cancel,'text')
});

step("Cancel <type> appointment", async function (type) {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    var patientName=gaugeHelper.get("patientFullName")
    var btnstatus=taikoElement.elementDisabled(button(cancel))

    if(btnstatus)
    {
        await taikoInteraction.Dropdown(patientDropdown,patientName+" ("+patientIdentifierValue+")")
        await taikoInteraction.Click(cancelBtn,'xpath')
        if("regular"==type)
        {
            await taikoInteraction.EvaluateClick($(btnYes))
        }

        else if("recurring"==type)
        {
            await taikoInteraction.EvaluateClick($(btnYesAll))
        }
    }
    else
    {
        await taikoInteraction.Click(cancelBtn,'xpath')
        if("regular"==type)
        {
            await taikoInteraction.EvaluateClick($(btnYes))
        }
        else if("recurring"==type)
        {
            await taikoInteraction.EvaluateClick($(btnYesAll))
        }

    }
});

step("Click Edit <type> appointment", async function (type) {
    await taikoElement.isExists(text(edit))
    await taikoInteraction.Click(edit,'button')
});

step("Update the time as <time>",async function(time){
    var value=time.split(" ")
    await taikoInteraction.Clear(below(startTime))
    await taikoInteraction.Clear(below(endTime))
    await taikoInteraction.Write(value[0],'into',below(startTime))
})

step("Open admin tab of Appointments", async function () {
    await taikoInteraction.Click(admin,'text')
});

step("Select awaiting appointments", async function () {
    await taikoInteraction.Click(awaitingAppointments,'text')
});

step("Create a service if it does not exist", async function () {
    if (await taikoElement.isExists(text(process.env.service)))
        return
    await taikoInteraction.Click(addNewService,'text')
    await taikoInteraction.Write(process.env.service,"into",{ placeHolder: "Enter a service name" })
    await taikoInteraction.Write("For test automation","into",{ placeHolder: "Enter description" })
    await taikoInteraction.Click(save,'text')
});

step("Search patient in appointment list", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    var patientFirstName = gaugeHelper.get("patientFirstName")
    var patientLastName = gaugeHelper.get("patientLastName")
    var patientName = `${patientFirstName} ${patientLastName} (${patientIdentifierValue})`
    var patientNameElement=`//a[text()='${patientName}']`
    await taikoInteraction.Write(patientIdentifierValue,"into",{ placeHolder: "Patient Name or ID" })
    await taikoInteraction.Click(patientNameElement,'xpath')
})
step("Verify the appointment is present in waitlist", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    var patientIdElement="//A[text()='" +patientIdentifierValue+ "']"
    await taikoElement.waitToExists($(patientIdElement))
});

step("Manage locations", async function () {
    await taikoInteraction.Click(manageLocations,'text')
});

step("Goto Today", async function () {
    await taikoInteraction.Click(today,'text')
});

step("Select List View in Appointments", async function () {
    await taikoInteraction.Click(listView,'text')
});

step("Get Apointmnet Date and Time", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    let appointmentDate = await $("//A[text()='" + patientIdentifierValue + "']/../../TD[4]").text();
    let appointmentStartTime = await $("//A[text()='" + patientIdentifierValue + "']/../../TD[5]").text();
    let appointmentEndTime = await $("//A[text()='" + patientIdentifierValue + "']/../../TD[6]").text();
    gaugeHelper.save("appointmentDate", appointmentDate)
    gaugeHelper.save("appointmentStartTime", appointmentStartTime)
    gaugeHelper.save("appointmentEndTime", appointmentEndTime)
});

step("Verify the details in Appointments display control with status <status>", async function (status) {
    let appointmentDate = gaugeHelper.get("appointmentDate");
    assert.ok(text(`${appointmentStartTime} - ${appointmentEndTime}`, toRightOf(appointmentDate, toLeftOf(status))).exists())
});

step("Verify the appointment locations",async function(){
    for(let i=0;i<locations.length;i++)
    {
        var location="//div[text()='" + locations[i] + "']"
        await write(locations[i], into($(locationSearchInput)))
        assert.ok(await $(location).exists());
        await taikoInteraction.Click(locationSearchBtn,'xpath')
    }

})

step("Verify the appointment specialitis list",async function(){
    for(let i=0;i<speciality.length;i++)
    {
        if(speciality[i]!='Active' && speciality[i]!='My Patients' && speciality[i]!='All'&& speciality[i]!='Anaesthesia') {
            var specialityElement="//div[text()='" + speciality[i] + "']"
            await taikoInteraction.Write(speciality[i],"xpath",specialitySearchInput)
            await taikoAssert.assertExists($(specialityElement))
            await taikoInteraction.Click(specialitySearchInput,'xpath')
        }

    }

})

step("Verify if all the providers are present",async function(){

    for(let i=0;i<providers.length;i++)
    {
        var providerElement="//div[text()='" + providers[i] + "']"
        await taikoInteraction.Write(providers[i],"xpath",providerSearchInput)
        await taikoAssert.assertExists($(providerElement))
        await taikoInteraction.Click(providerSearchBtn,'xpath')
    }

})

step("Verify the patient appointment is re-scheduled at <appointmentTime>", async function (appointmentTime){
    let appointmentStartTime = appointmentTime.split(" ")[0];
    let appointmentEnd = appointmentTime.split(" ")[1];
    await taikoAssert.assertExists(text(`${appointmentStartTime}:00 ${appointmentEnd} - ${appointmentStartTime}:30 ${appointmentEnd}`, toRightOf('Slot:')))
 });

 step('Enter the appointment date',async function(){
    let appointmentDate = gaugeHelper.get("startDate");
    await taikoInteraction.Write(appointmentDate,"into",{placeholder:"dd/mm/yyyy"})
 })

 step("check the date for holiday on <holidayDate>",async function(holidayDate){
    await taikoInteraction.Write(holidayDate,"into",{placeholder:"dd/mm/yyyy"})
    await taikoInteraction.pressEnter()
    var text=await taikoElement.getText($(holidayDateElement))
    taikoAssert.assertEquals(text,holidayText)
    await taikoInteraction.Write('','into',below(startTime))
 })
 step("Verify the conflict message",async function(){
    var conflictMessageElement=`//span[contains(text(),"${conflictMessage}")]`
    await taikoElement.waitToExists($(conflictMessageElement))
 })

 step("Check and Save anyway",async function(){
    await taikoInteraction.Click(saveAnyway,'text')
 })
