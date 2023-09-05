const {
    $,
    dropDown,
    button,
    within,
    highlight,
    timeField,
    toRightOf,
    write,
    goto,
    above,
    click,
    checkBox,
    toLeftOf,
    text,
    into,
    textBox,
    waitFor,
    confirm,
    accept,
    scrollDown,
    link,
    below,
    press,
    scrollTo,
    evaluate,
    clear
} = require('taiko');
var date = require("../util/date");
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper = require("../util/gaugeHelper")
var assert = require("assert");
const { stat } = require('fs');
const taikoInteraction = require('../../../components/taikoInteraction');
const taikoElement = require('../../../components/taikoElement');
const taikoassert = require('../../../components/taikoAssert');

var addNewAppointment = 'Add new appointment'
var patientNameId='Patient Name or ID'
var lastName = gaugeHelper.get("patientLastName")
var searchbox='//input[@role="searchbox"]'
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

step("View all appointments", async function () {
    var list=process.env.appointmentList
    await taikoInteraction.Click(list,'text')
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
    var patientNameElement=`//a[text()='${patientName}']`
    var firstNameArr=firstName.split("")
    for(let i=0;i<firstNameArr.length;i++)
    {
        await taikoInteraction.Write(firstNameArr[i],"xpath",searchbox)
        if(await taikoElement.isPresent($(patientNameElement)))
        {
            await taikoInteraction.EvaluateClick($(patientNameElement))
            break;
        }
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
    await taikoInteraction.Clear(appointmentDateElement,'below')
    //await clear(textBox(below(appointmentDateElement)))
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
    await taikoHelper.repeatUntilNotFound($(overlay))
})

step("Open calender at time <appointmentTime>", async function (appointmentTime) {
    await taikoInteraction.Click(fcwidgetcontent,'xpath',toRightOf(`${appointmentTime}`))
    await taikoHelper.repeatUntilNotFound($(overlay))
    gaugeHelper.save("appointmentStartDate", date.getDateFrommmddyyyy(await textBox({ placeHolder: "mm/dd/yyyy" }).value()))
    gaugeHelper.save("startDate", await textBox({ placeHolder: "mm/dd/yyyy" }).value())
    gaugeHelper.save("startTime", await textBox({ placeHolder: "hh:mm" }).value())
    gaugeHelper.save("AM", await dropDown(below('Start Time')).value())
    gauge.message(`Appointment start date ${gaugeHelper.get("startDate")}`)
    gauge.message(`Appointment start time ${gaugeHelper.get("startTime")}`) 
    gauge.message(`Appointment AM/PM ${gaugeHelper.get("AM")}`)  
});

step("put <appointmentDate> as appointment date", async function (appointmentDate) {
    gaugeHelper.save("appointmentStartDate", date.getDateFrommmddyyyy(appointmentDate))
});


step("Compute end time", async function () {
    await waitFor(2000)
});
step("Click Save", async function () {
    await taikoInteraction.Click(save,'text')
    taikoHelper.repeatUntilNotFound($(overlay))
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
    await taikoHelper.repeatUntilNotFound($(overlay))
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
    await taikoInteraction.Click(closeBtn,'xpath')
    if(await taikoElement.isPresent(text(discard)))
    {
    await taikoInteraction.Click(discard,'text')
    }
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Goto List view", async function () {
    await taikoInteraction.Click(listView,'link')
});

step("select the Regular appointment option", async function () {
    await taikoInteraction.Click(regularAppointment,'text')
});

step("select appointment status as <status>",async function(status){
    var appointMentStatus=`//span[text()="${status}"]`
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
    await taikoInteraction.Clear(startTime,'below')
    await taikoInteraction.Clear(endTime,'below')
    await taikoInteraction.Write(value[0],'into',below(startTime))
})

step("Open admin tab of Appointments", async function () {
    await taikoInteraction.Click(admin,'text')
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Select awaiting appointments", async function () {
    await taikoInteraction.Click(awaitingAppointments,'text')
});

step("Create a service if it does not exist", async function () {
    if (await taikoElement.isPresent(text(process.env.service)))
        return
    await taikoInteraction.Click(addNewService,'text')
    await taikoInteraction.Write(process.env.service,"into",{ placeHolder: "Enter a service name" })
    await taikoInteraction.Write("For test automation","into",{ placeHolder: "Enter description" })
    await taikoInteraction.Click(save,'text')
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Verify the appointment is present in waitlist", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    var patientIdElement="//A[text()='" +patientIdentifierValue+ "']"
    await taikoassert.assertExists($(patientIdElement))
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
        if(speciality[i]!='Active' && speciality[i]!='My Patients' && speciality[i]!='All') {
            var specialityElement="//div[text()='" + speciality[i] + "']"
            await write(speciality[i], into($(specialitySearchInput)))
            assert.ok(await $(specialityElement).exists());
            await taikoInteraction.Click(specialitySearchInput,'xpath')
        }
        
    }
    
})

step("Verify if all the providers are present",async function(){

    for(let i=0;i<providers.length;i++)
    {
        var providerElement="//div[text()='" + providers[i] + "']"
        await write(providers[i], into($(providerSearchInput)))
        assert.ok(await $(providerElement).exists());
        await taikoInteraction.Click(providerSearchBtn,'xpath')
    }
    
})

step("Verify the patient appointment is re-scheduled at <appointmentTime>", async function (appointmentTime){
    let appointmentStartTime = appointmentTime.split(" ")[0];
    let appointmentEnd = appointmentTime.split(" ")[1];
    assert.ok(text(`${appointmentStartTime}:00 ${appointmentEnd} - ${appointmentStartTime}:30 ${appointmentEnd}`, toRightOf('Slot:')).exists())
 });

 step('Enter the appointment date',async function(){
    let appointmentDate = gaugeHelper.get("startDate");
    await taikoInteraction.Write(appointmentDate,"into",{placeholder:"mm/dd/yyyy"})
 })
 step("Verify the conflict message",async function(){
    await taikoassert.assertExists(text(conflictMessage))
 }) 

 step("Check and Save anyway",async function(){
    await taikoInteraction.Click(saveAnyway,'text')
 })


