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

step("View all appointments", async function () {
    var list=process.env.appointmentList
    await click(list);
});

step("Click Add New appointment", async function () {
    await click("Add new appointment");
});

step("Select Patient id", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue, into(textBox({ placeHolder: "Patient Name or ID" })));
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    await click(firstName);
});

step("Select patient", async function () {
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    var patientName = `${firstName} ${lastName} (${patientIdentifierValue})`
    await write(firstName, into($("//input[@role='searchbox']")))
    await waitFor(async () => (await $(`//a[text()='${patientName}']`).exists()));
    await waitFor(200);
    await evaluate($(`//a[text()='${patientName}']`), (el) => el.click());
});

step("Select service <service>", async function (service) {
    await dropDown(toRightOf("Service")).select(service);
});

step("Search and select category", async function () {
    await selectDropDown('appointment-category-search',process.env.category)
});

step("Search and select speciality", async function () {
    await selectDropDown('speciality-search',process.env.speciality)
});

step("Search and select speciality as <speciality>", async function (speciality) {
    await selectDropDown('speciality-search',speciality)
});

step("Search and select service", async function () {
    await selectDropDown('service-search',process.env.service)
});

step("Search and select service as <service>", async function (service) {
    await selectDropDown('service-search',service)
});

step("Search and select provider", async function () {
    await selectDropDown('provider-search',process.env.provider)
});

step("Search and select provider as <provider>", async function (provider) {
    await selectDropDown('provider-search',provider)
});
step("Search and select location", async function () {
    await selectDropDown('location-search',process.env.location)
});

async function selectDropDown(locator,value){
    var element=`//div[@data-testid='${locator}']//input`
    await write(value, into($(element)))
    await waitFor(async () => (await $("//div[text()='" + value + "']").exists()));
    await waitFor(200);
    await evaluate($("//div[text()='" + value + "']"), (el) => el.click());
}
step("Search and select appointment location", async function () {
    await click("Location");
    await click(process.env.appointmentLocation);
});

step("Select appointment date <date>", async function (date) {
    //await timeField({ type: "date" }, below("Appointment date")).select(date.tomorrow());
    await clear(textBox(below("Appointment date")))
    await write(date,into(textBox(below("Appointment date"))))
});

step("Select location <location>", async function (location) {
    await dropDown("Location").select(location)
});

step("Enter appointment time into Start time", async function () {
    var time= gauge.dataStore.scenarioStore.get("startTime")
    await write(time,into(textBox({placeholder:"hh:mm"})))});

step("Close the appointment popup",async function(){
    await click("Add new appointment")
    await click("Summary")
    await click("Yes")


})

step("Open calender at time <appointmentTime>", async function (appointmentTime) {
    await click($(".fc-widget-content"), toRightOf(`${appointmentTime}`));
    await taikoHelper.repeatUntilNotFound($("#overlay"))
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
    await click("Save")
    taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Click Update", async function () {
    await click("Update")
    await waitFor(2000)
    await click("Yes, I confirm")
});

step("Check and Save", async function () {
    await click("Check and Save");
});

step("Goto tomorrow's date", async function () {
    await click(button({ type: 'button' }, within($('[ng-click="goToNext()"]'))));
});

step("Goto appointments's date", async function () {
    var appointmentStartDate = gauge.dataStore.scenarioStore.get("appointmentStartDate")
    await timeField(toRightOf("Week")).select(new Date(appointmentStartDate));
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Goto Next week", async function () {
    await click("Week");
    var month = date.getShortNameOfMonth(date.today())
    await click(button(), toRightOf(month));
});

step("Goto day view of the calendar", async function () {
    await click("Day");
    var month = date.getShortNameOfMonth(date.today())
    await click(button(), toRightOf(month));
});


step("Click Close", async function () {
    await click($('//div[@class="AddAppointment_close__2kahG"]'))
    if(await text("Discar").exists())
    {
    await click('Discard')
    }
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Goto List view", async function () {
    await click(link("List view"));
});

step("select the Regular appointment option", async function () {
    await click('Regular Appointment')
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
    await click("Recurring Appointment");
});

step("select the Start date as <appointmentDate>", async function (appointmentDate) {
    await write(appointmentDate, below("Appointment start date"));
    gauge.dataStore.scenarioStore.put("appointmentStartDate", new Date())
});

step("select the End date as after <times> occurances", async function (times) {
    await write(times,$('input#occurrences'))
});

step("select Repeats every <numberOfDays> days", async function (numberOfDays) {
    await write(numberOfDays, into(textBox(below("Repeats every"))));
});

step("Click Cancel all", async function () {
    await scrollTo("Cancel All")
    await click("Cancel All")
});

step("Click yes", async function () {
    await waitFor(async () => (await $("button#yes").exists()));
    await evaluate($("button#yes"), (el) => el.click())
    await waitFor(1000)
});

step("Click Cancel", async function () {
    await scrollTo('Cancel')
    await click('Cancel')
});

step("Cancel <type> appointment", async function (type) {
    var btnstatus= await button("Cancel").isDisabled()
    if(btnstatus)
    {
        var patientid=gauge.dataStore.scenarioStore.get("patientIdentifier")
        var patientName=gauge.dataStore.scenarioStore.get("patientFullName")
        await dropDown("Patient:").select(patientName+" ("+patientid+")")
        await scrollTo(text("Cancel"))
        await click($('//button[contains(text(),"Cancel")]'))
        await waitFor(1000)
        if("regular"==type)
        {

            await evaluate($("button#yes"), (el) => el.click())  
        }

        else if("recurring"==type)
        {
            await evaluate($("button#yes_all"), (el) => el.click())        
        }
    }
    else
    {
        await scrollTo(text("Cancel"))
        await click($('//button[contains(text(),"Cancel")]'))
        await waitFor(1000)
        if("regular"==type)
        {
            await evaluate($("button#yes"), (el) => el.click())
        }
        else if("recurring"==type)
        {
            await evaluate($("button#yes_all"), (el) => el.click())
        }
        
    }
});

step("Click Edit <type> appointment", async function (type) {
    var btnstatus= await button("Edit").isDisabled()
    if(!btnstatus)
    {
        await scrollTo(button("Edit"))
        await click(button("Edit"))
    }

});

step("Update the time as <time>",async function(time){
    var value=time.split(" ")
    await clear(textBox(below("Start time")))
    await clear(textBox(below("End time")))
    await write(value[0], into(textBox(below("Start time"))));
})

step("Open admin tab of Appointments", async function () {
    await click("Admin")
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Select awaiting appointments", async function () {
    await click("Awaiting Appointments")
});

step("Create a service if it does not exist", async function () {
    if (await text(process.env.service).exists())
        return
    await click("Add New Service")
    await write(process.env.service, into(textBox({ placeHolder: "Enter a service name" })))
    await write("For test automation", into(textBox({ placeHolder: "Enter description" })))
    await click("Save", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Verify the appointment is present in waitlist", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    assert.ok(await $("//A[text()='" +patientIdentifierValue+ "']").exists());
});

step("Manage locations", async function () {
    await click("Manage Locations")
});

step("Goto Today", async function () {
    await click("Today")
});

step("Select List View in Appointments", async function () {
    await click("List view")
});

step("Get Apointmnet Date and Time", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    let appointmentDate = await $("//A[text()='" + patientIdentifierValue + "']/../../TD[3]").text();
    let appointmentStartTime = await $("//A[text()='" + patientIdentifierValue + "']/../../TD[4]").text();
    let appointmentEndTime = await $("//A[text()='" + patientIdentifierValue + "']/../../TD[5]").text();
    gauge.dataStore.scenarioStore.put("appointmentDate", appointmentDate)
    gauge.dataStore.scenarioStore.put("appointmentStartTime", appointmentStartTime)
    gauge.dataStore.scenarioStore.put("appointmentEndTime", appointmentEndTime)
});

step("Verify the details in Appointments display control with status <status>", async function (status) {
    let appointmentDate = gauge.dataStore.scenarioStore.get("appointmentDate");
    let appointmentStartTime = gauge.dataStore.scenarioStore.get("appointmentStartTime");
    let appointmentEndTime = gauge.dataStore.scenarioStore.get("appointmentEndTime");
    assert.ok(text(`${appointmentStartTime} - ${appointmentEndTime}`, toRightOf(appointmentDate, toLeftOf(status))).exists())
});

step("Verify the appointment locations",async function(){
 
    var locations=process.env.registrationLocations.split(',')

    for(let i=0;i<locations.length;i++)
    {
        await write(locations[i], into($("//div[@data-testid='location-search']//input")))
        assert.ok(await $("//div[text()='" + locations[i] + "']").exists());
        await click($("//div[@data-testid='location-search']//button[1]"))
    }
    
})

step("Verify the appointment specialitis list",async function(){
 
    var speciality=process.env.specialityList.split(',')

    for(let i=0;i<speciality.length;i++)
    {
        if(speciality[i]!='Active' && speciality[i]!='My Patients' && speciality[i]!='All') {
            await write(speciality[i], into($("//div[@data-testid='speciality-search']//input")))
            assert.ok(await $("//div[text()='" + speciality[i] + "']").exists());
            await click($("//div[@data-testid='speciality-search']//input"))
        }
        
    }
    
})

step("Verify if all the providers are present",async function(){
 
    var providers=process.env.providersList.split(',')

    for(let i=0;i<providers.length;i++)
    {
        await write(providers[i], into($("//div[@data-testid='provider-search']//input")))
        assert.ok(await $("//div[text()='" + providers[i] + "']").exists());
        await click($("//div[@data-testid='provider-search']//button[1]"))
    }
    
})

step("Verify the patient appointment is re-scheduled at <appointmentTime>", async function (appointmentTime){
    let appointmentStartTime = appointmentTime.split(" ")[0];
    let appointmentEnd = appointmentTime.split(" ")[1];
    assert.ok(text(`${appointmentStartTime}:00 ${appointmentEnd} - ${appointmentStartTime}:30 ${appointmentEnd}`, toRightOf('Slot:')).exists())
 });

 step('Enter the appointment date',async function(){
    var appointmentDate=gauge.dataStore.scenarioStore.get("startDate")
    await write(appointmentDate,into(textBox({placeholder:"mm/dd/yyyy"})))
 })
 step("Verify the conflict message",async function(){
    assert.ok(await text("You have an overlapping conflict").exists())
 }) 

 step("Check and Save anyway",async function(){
    await click("Save Anyway")
 })


