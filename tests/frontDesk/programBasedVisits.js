const {
    $,
    click,
    button,
    toRightOf,
    focus,
    dropDown,
    write,
    textBox,
    into,
    timeField,
    waitFor,
    attach,
    fileField,
    below,
    link,
    text,
    within,
    scrollTo,
    highlight
} = require('taiko');
var date = require("../util/date");
var fileExtension = require("../util/fileExtension");
var path = require("path")
const taikoHelper = require("../util/taikoHelper")
var startOpdVisit='Start OPD Visit'
var submitBtn=".submit-btn-container"
var startSpecialOpdVisit='Start Special OPD Visit'
var overlay='#overlay'
var newProgramEnrollment='New Program Enrollment'
var dob='Date of birth'
var programDropdown='Program :'
var program='Program'
var startDate='Start Date'
var treatmentDate='Treatment Date'
var doctorInCharge='Doctor-In-Charge'
var idNumber='ID Number'
var patientStage='Patient Stage'
var enroll='Enroll'
var saved='Saved'
var messageText='.message-text'
var dashboardLink='#dashboard-link'
var all='All'

step("Click Start Special OPD Visit", async function() {
    await scrollTo(startOpdVisit)
    await click(button(toRightOf(startOpdVisit), within($(submitBtn))));
    await click(startSpecialOpdVisit,{waitForNavigation:true,navigationTimeout:process.env.actionTimeout});
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Begin new program enrollment", async function() {
    await waitFor(newProgramEnrollment,below(dob))
    await highlight(newProgramEnrollment,below(dob))
    await scrollTo(newProgramEnrollment,below(dob))
    await click(newProgramEnrollment,below(dob))
});

step("Create a program <program>", async function(programName) {
    await waitFor(programDropdown)
    await highlight(dropDown(toRightOf(program)))
    await dropDown(toRightOf(program)).select(programName)
});

step("Select program starting <numberOfYearsAgo_startDate> years ago with treatment start <numberOfYearsAgo_treatmentDate> years ago", async function(numberOfYearsAgo_startDate, numberOfYearsAgo_treatmentDate) {
    var startDateValue = date.getDateYearsAgo(numberOfYearsAgo_startDate);
    await timeField({type:"date"},toRightOf(startDate)).select(startDateValue);

    var treatmentDateValue = date.getDateYearsAgo(numberOfYearsAgo_treatmentDate);
    await timeField({type:"date"},toRightOf(treatmentDate)).select(treatmentDateValue);
});

step("Select other details id <id>, dr incharge <doctor> and treatment stage <stage>", async function (id, doctor, stage) {
    await write(id, into(textBox(toRightOf(idNumber))))
    await write(doctor, into(textBox(toRightOf(doctorInCharge))))
    await dropDown(toRightOf(patientStage)).select(stage)
});

step("Enroll in program", async function() {
    await click(button(enroll),{waitForNavigation:true,navigationTimeout:process.env.actionTimeout})
    await taikoHelper.repeatUntilNotFound($(overlay))
    await waitFor(async () => !(await text(saved,within(messageText)).exists()));
});

step("Open the program dashboard <program>", async function(program) {
    await waitFor(text(`${program} Dashboard`,within($(dashboardLink))))
    await click(text(`${program} Dashboard`,within($(dashboardLink))),{waitForNavigation:true,navigationTimeout:480000});
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Goto All sections", async function () {
    await taikoHelper.repeatUntilFound(link(all))
    await click(link(all),{force:true,waitForNavigation:true,navigationTimeout:process.env.actionTimeout})    
});
