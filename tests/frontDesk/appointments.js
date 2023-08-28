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
var assert = require("assert");
const { stat } = require('fs');

var addNewAppointment = 'Add new appointment'
var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
var patientNameId='Patient Name or ID'
var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
var searchbox='//input[@role="searchbox"]'
var service='Service'
var appointmentCategorySearch='appointment-category-search'
var specialitySearch='speciality-search'
var serviceSearch='service-search'
var providerSearch='provider-search'
var locationSearch='location-search'
var time= gauge.dataStore.scenarioStore.get("startTime")
var location = 'Location'
var appointmentDate = 'Appointment date'
var summary='Summary'
var yes='Yes'
var fcwidgetcontent='.fc-widget-content'
var overlay='#overlay'
var save='Save'
var update='Update'
var yesIConfirm='Yes, I confirm'
var checkAndSave='Check and Save'
var btn='button'
var goNext='[ng-click="goToNext()"]'
var appointmentStartDate = gauge.dataStore.scenarioStore.get("appointmentStartDate")
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
var patientid=gauge.dataStore.scenarioStore.get("patientIdentifier")
var patientName=gauge.dataStore.scenarioStore.get("patientFullName")
var cancelBtn='//button[contains(text(),"Cancel")]'
var patientDropdown='Patient:'
var edit='Edit'
var startTime='Start time'
var endTime='End time'
var admin='Admin'
var awaitingAppointments='Awaiting Appointments'
var addNewService='Add New Service'
var save='Save'
var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
var manageLocations='Manage Locations'
var today='Today'
var listView='List view'
let appointmentDate = gauge.dataStore.scenarioStore.get("appointmentDate");
let appointmentStartTime = gauge.dataStore.scenarioStore.get("appointmentStartTime");
let appointmentEndTime = gauge.dataStore.scenarioStore.get("appointmentEndTime");
var locationSearchInput="//div[@data-testid='location-search']//input"
var locationSearchBtn="//div[@data-testid='location-search']//button[1]"
var specialitySearchInput="//div[@data-testid='speciality-search']//input"
var speciality=process.env.specialityList.split(',')
var locations=process.env.registrationLocations.split(',')
var providers=process.env.providersList.split(',')
var providerSearchInput="//div[@data-testid='provider-search']//input"
var providerSearchBtn="//div[@data-testid='provider-search']//button[1]"
var appointmentDate=gauge.dataStore.scenarioStore.get("startDate")
var conflictMessage='You have an overlapping conflict'
var saveAnyway='Save Anyway'

step("View all appointments", async function () {
    var list=process.env.appointmentList
    await click(list);
});

step("Click Add New appointment", async function () {
    await click(addNewAppointment);
});

step("Select Patient id", async function () {
    await write(patientIdentifierValue, into(textBox({ placeHolder: patientNameId })));
    await click(firstName);
});

step("Select patient", async function () {
    var patientName = `${firstName} ${lastName} (${patientIdentifierValue})`
    await write(firstName, into($(searchbox)))
    var patientNameElement=`//a[text()='${patientName}']`
    await waitFor(async () => (await $(patientNameElement).exists()));
    await waitFor(200);
    await evaluate($(patientNameElement), (el) => el.click());
});

step("Select service <service>", async function (serviceName) {
    await dropDown(toRightOf(service)).select(serviceName);
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
    await write(value, into($(element)))
    var selectableElement="//div[text()='" + value + "']"
    await waitFor(async () => (await $(selectableElement).exists()));
    await waitFor(200);
    await evaluate($(selectableElement), (el) => el.click());
}
step("Search and select appointment location", async function () {
    await click(location);
    await click(process.env.appointmentLocation);
});

step("Select appointment date <date>", async function (date) {
    await clear(textBox(below(appointmentDate)))
    await write(date,into(textBox(below(appointmentDate))))
});

step("Select location <location>", async function (locationName) {
    await dropDown(location).select(locationName)
});

step("Enter appointment time into Start time", async function () {
    await write(time,into(textBox({placeholder:"hh:mm"})))});

step("Close the appointment popup",async function(){
    await click(addNewAppointment)
    await click(summary)
    await click(yes)
})

step("Open calender at time <appointmentTime>", async function (appointmentTime) {
    await click($(fcwidgetcontent), toRightOf(`${appointmentTime}`));
    await taikoHelper.repeatUntilNotFound($(overlay))
    gauge.dataStore.scenarioStore.put("appointmentStartDate", date.getDateFrommmddyyyy(await textBox({ placeHolder: "mm/dd/yyyy" }).value()))
    gauge.dataStore.scenarioStore.put("startDate", await textBox({ placeHolder: "mm/dd/yyyy" }).value())
    gauge.dataStore.scenarioStore.put("startTime", await textBox({ placeHolder: "hh:mm" }).value())
    gauge.message(`Appointment start date ${gauge.dataStore.scenarioStore.get("startDate")}`)
    gauge.message(`Appointment start time ${gauge.dataStore.scenarioStore.get("startTime")}`)   
});

step("put <appointmentDate> as appointment date", async function (appointmentDate) {
    gauge.dataStore.scenarioStore.put("appointmentStartDate", date.getDateFrommmddyyyy(appointmentDate))
});


step("Compute end time", async function () {
    await waitFor(2000)
});
step("Click Save", async function () {
    await click(save)
    taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click Update", async function () {
    await click(update)
    await waitFor(2000)
    await click(yesIConfirm)
});

step("Check and Save", async function () {
    await click(checkAndSave);
});

step("Goto tomorrow's date", async function () {
    await click(button({ type: btn }, within($(goNext))));
});

step("Goto appointments's date", async function () {
    await timeField(toRightOf(week)).select(new Date(appointmentStartDate));
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Goto Next week", async function () {
    await click(week);
    var month = date.getShortNameOfMonth(date.today())
    await click(button(), toRightOf(month));
});

step("Goto day view of the calendar", async function () {
    await click(day);
    var month = date.getShortNameOfMonth(date.today())
    await click(button(), toRightOf(month));
});

step("Click Close", async function () {
    await click($(closeBtn))
    if(await text(discard).exists())
    {
    await click(discard)
    }
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Goto List view", async function () {
    await click(link(listView));
});

step("select the Regular appointment option", async function () {
    await click(regularAppointment)
});

step("select appointment status as <status>",async function(status){
    var appointMentStatus=`//span[text()="${status}"]`
    await click($(appointMentStatus))
})

step("select the teleconsultation appointment option", async function () {
    /*will enable once the teleconsultation is enabled */
   // await click(checkBox(toLeftOf("Teleconsultation")))
});

step("select the recurring appointment option", async function () {
    await click(recurringAppointment);
});

step("select the Start date as <appointmentDate>", async function (appointmentDate) {
    await write(appointmentDate, below(appointmentStartDate));
    gauge.dataStore.scenarioStore.put("appointmentStartDate", new Date())
});

step("select the End date as after <times> occurances", async function (times) {
    await write(times,$(inputOccurences))
});

step("select Repeats every <numberOfDays> days", async function (numberOfDays) {
    await write(numberOfDays, into(textBox(below(repeatsEvery))));
});

step("Click Cancel all", async function () {
    await scrollTo(cancelAll)
    await click(cancelAll)
});

step("Click yes", async function () {
    await waitFor(async () => (await $(btnYes).exists()));
    await evaluate($(btnYes), (el) => el.click())
    await waitFor(1000)
});

step("Click Cancel", async function () {
    await scrollTo(cancel)
    await click(cancel)
});

step("Cancel <type> appointment", async function (type) {
    var btnstatus= await button(cancel).isDisabled()
    if(btnstatus)
    {
        await dropDown(patientDropdown).select(patientName+" ("+patientid+")")
        await scrollTo(text(cancel))
        await click($(cancelBtn))
        await waitFor(1000)
        if("regular"==type)
        {

            await evaluate($(btnYes), (el) => el.click())  
        }

        else if("recurring"==type)
        {
            await evaluate($(btnYesAll), (el) => el.click())        
        }
    }
    else
    {
        await scrollTo(text(cancel))
        await click($(cancelBtn))
        await waitFor(1000)
        if("regular"==type)
        {
            await evaluate($(btnYes), (el) => el.click())
        }
        else if("recurring"==type)
        {
            await evaluate($(btnYesAll), (el) => el.click())
        }
        
    }
});

step("Click Edit <type> appointment", async function (type) {
    var btnstatus= await button(edit).isDisabled()
    if(!btnstatus)
    {
        await scrollTo(button(edit))
        await click(button(edit))
    }

});

step("Update the time as <time>",async function(time){
    var value=time.split(" ")
    await clear(textBox(below(startTime)))
    await clear(textBox(below(endTime)))
    await write(value[0], into(textBox(below(startTime))));
})

step("Open admin tab of Appointments", async function () {
    await click(admin)
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Select awaiting appointments", async function () {
    await click(awaitingAppointments)
});

step("Create a service if it does not exist", async function () {
    if (await text(process.env.service).exists())
        return
    await click(addNewService)
    await write(process.env.service, into(textBox({ placeHolder: "Enter a service name" })))
    await write("For test automation", into(textBox({ placeHolder: "Enter description" })))
    await click(save, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Verify the appointment is present in waitlist", async function () {
    var patientIdElement="//A[text()='" +patientIdentifierValue+ "']"
    assert.ok(await $(patientIdElement).exists());
});

step("Manage locations", async function () {
    await click(manageLocations)
});

step("Goto Today", async function () {
    await click(today)
});

step("Select List View in Appointments", async function () {
    await click(listView)
});

step("Get Apointmnet Date and Time", async function () {
    let appointmentDate = await $("//A[text()='" + patientIdentifierValue + "']/../../TD[3]").text();
    let appointmentStartTime = await $("//A[text()='" + patientIdentifierValue + "']/../../TD[4]").text();
    let appointmentEndTime = await $("//A[text()='" + patientIdentifierValue + "']/../../TD[5]").text();
    gauge.dataStore.scenarioStore.put("appointmentDate", appointmentDate)
    gauge.dataStore.scenarioStore.put("appointmentStartTime", appointmentStartTime)
    gauge.dataStore.scenarioStore.put("appointmentEndTime", appointmentEndTime)
});

step("Verify the details in Appointments display control with status <status>", async function (status) {
    assert.ok(text(`${appointmentStartTime} - ${appointmentEndTime}`, toRightOf(appointmentDate, toLeftOf(status))).exists())
});

step("Verify the appointment locations",async function(){
    for(let i=0;i<locations.length;i++)
    {
        var location="//div[text()='" + locations[i] + "']"
        await write(locations[i], into($(locationSearchInput)))
        assert.ok(await $(location).exists());
        await click($(locationSearchBtn))
    }
    
})

step("Verify the appointment specialitis list",async function(){
    for(let i=0;i<speciality.length;i++)
    {
        if(speciality[i]!='Active' && speciality[i]!='My Patients' && speciality[i]!='All') {
            var specialityElement="//div[text()='" + speciality[i] + "']"
            await write(speciality[i], into($(specialitySearchInput)))
            assert.ok(await $(specialityElement).exists());
            await click($(specialitySearchInput))
        }
        
    }
    
})

step("Verify if all the providers are present",async function(){

    for(let i=0;i<providers.length;i++)
    {
        var providerElement="//div[text()='" + providers[i] + "']"
        await write(providers[i], into($(providerSearchInput)))
        assert.ok(await $(providerElement).exists());
        await click($(providerSearchBtn))
    }
    
})

step("Verify the patient appointment is re-scheduled at <appointmentTime>", async function (appointmentTime){
    let appointmentStartTime = appointmentTime.split(" ")[0];
    let appointmentEnd = appointmentTime.split(" ")[1];
    assert.ok(text(`${appointmentStartTime}:00 ${appointmentEnd} - ${appointmentStartTime}:30 ${appointmentEnd}`, toRightOf('Slot:')).exists())
 });

 step('Enter the appointment date',async function(){
    await write(appointmentDate,into(textBox({placeholder:"mm/dd/yyyy"})))
 })
 step("Verify the conflict message",async function(){
    assert.ok(await text(conflictMessage).exists())
 }) 

 step("Check and Save anyway",async function(){
    await click(saveAnyway)
 })


