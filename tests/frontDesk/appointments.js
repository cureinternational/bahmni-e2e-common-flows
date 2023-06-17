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

step("Begin capturing appointment details", async function () {
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
    await write(patientIdentifierValue, into($("//input[@role='searchbox']")))
    await waitFor(async () => (await $(`//a[text()='${patientName}']`).exists()));
    await waitFor(200);
    await evaluate($(`//a[text()='${patientName}']`), (el) => el.click());
});

step("Select service <service>", async function (service) {
    await dropDown(toRightOf("Service")).select(service);
});

step("Search and select category", async function () {
    await write(process.env.category, into($("//div[@data-testid='appointment-category-search']//input")))
    await waitFor(async () => (await $("//div[text()='" + process.env.category + "']").exists()));
    await waitFor(200);
    await evaluate($("//div[text()='" + process.env.category + "']"), (el) => el.click());
});

step("Search and select speciality", async function () {
    await write(process.env.speciality, into($("//div[@data-testid='speciality-search']//input")))
    await waitFor(async () => (await $("//div[text()='" + process.env.speciality + "']").exists()));
    await waitFor(200);
    await evaluate($("//div[text()='" + process.env.speciality + "']"), (el) => el.click());
});


step("Search and select service", async function () {
    await write(process.env.service, into($("//div[@data-testid='service-search']//input")))
    await waitFor(async () => (await $("//div[text()='" + process.env.service + "']").exists()));
    await waitFor(200);
    await evaluate($("//div[text()='" + process.env.service + "']"), (el) => el.click());
});
step("Search and select provider", async function () {
    await write(process.env.provider, into($("//div[@data-testid='provider-search']//input")))
    await waitFor(async () => (await $("//div[text()='" + process.env.provider + "']").exists()));
    await waitFor(200);
    await evaluate($("//div[text()='" + process.env.provider + "']"), (el) => el.click());
});
step("Search and select location", async function () {
    await write(process.env.location, into($("//div[@data-testid='location-search']//input")))
    await waitFor(async () => (await $("//div[text()='" + process.env.location + "']").exists()));
    await waitFor(200);
    await evaluate($("//div[text()='" + process.env.location + "']"), (el) => el.click());
});
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

step("Enter appointment time <appointmentTime> into Start time", async function (appointmentTime) {
    await write(appointmentTime, into(textBox(below("From"))));
    //await click(`${appointmentTime}`)
});

step("Close the appointment popup",async function(){
    await click("Add new appointment")
    await click("Summary")
    await click("Yes")


})

step("Open calender at time <appointmentTime>", async function (appointmentTime) {
    await click($(".fc-widget-content"), toRightOf(`${appointmentTime}`));
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    gauge.dataStore.scenarioStore.put("appointmentStartDate", date.getDateFrommmddyyyy(await textBox({ placeHolder: "mm/dd/yyyy" }).value()))
});

step("put <appointmentDate> as appointment date", async function (appointmentDate) {
    gauge.dataStore.scenarioStore.put("appointmentStartDate", date.getDateFrommmddyyyy(appointmentDate))
});


step("Compute end time", async function () {
    await waitFor(2000)
});

step("Click Save", async function () {
    await click("Save")
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

step("Click Cancel", async function () {
    await scrollTo('Cancel')
    await click('Cancel')
});

step("Cancel appointment", async function () {
    var btnstatus=await button("Cancel").isDisabled()
    if(btnstatus)
    {
        var patientid=gauge.dataStore.scenarioStore.get("patientIdentifier")
        var patientName=gauge.dataStore.scenarioStore.get("patientFullName")
        await dropDown("Patient:").select(patientName+" ("+patientid+")")
        await scrollTo(text("Cancel"))
        await click("Cancel")
        var yesBtn=await button("Yes").exists()
        if(yesBtn)
        {
            await click("Yes")
        }
        var cancelallBtn=await button("Cancel All").exists()
        if(cancelallBtn)
        {
            await click("Cancel All")
        }
    }
    else if(!btnstatus)
    {
        await click("Cancel")
        var yesBtn=await button("Yes").exists()
        if(yesBtn)
        {
            await click("Yes")
        }
        var cancelallBtn=await button("Cancel All").exists()
        if(cancelallBtn)
        {
            await click("Cancel All")
        }
        
    }
});

step("Open admin tab of Appointments", async function () {
    await click("Admin")
    await taikoHelper.repeatUntilNotFound($("#overlay"))
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