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
const taikoHelper = require("../util/taikoHelper");
const taikoInteraction = require('../../../components/taikoInteraction');
const taikoElement = require('../../../components/taikoElement');
var startOpdVisit='Start OPD Visit'
var submitBtn=".submit-btn-container"
var startSpecialOpdVisit='Start Special OPD Visit'
var overlay='//div[@id="overlay" and @style="display: block;"]'
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
    await taikoInteraction.Click(startOpdVisit,'button',within($(submitBtn)))
    await taikoInteraction.Click(startSpecialOpdVisit,'button',within($(submitBtn)))
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Begin new program enrollment", async function() {
    await taikoElement.waitToPresent(newProgramEnrollment)
    await taikoInteraction.Click(newProgramEnrollment,'text',below(dob))
});

step("Create a program <program>", async function(programName) {
    await taikoElement.waitToPresent(programDropdown)
    await taikoInteraction.Dropdown(toRightOf(program),programName)
});

step("Select program starting <numberOfYearsAgo_startDate> years ago with treatment start <numberOfYearsAgo_treatmentDate> years ago", async function(numberOfYearsAgo_startDate, numberOfYearsAgo_treatmentDate) {
    var startDateValue = date.getDateYearsAgo(numberOfYearsAgo_startDate);
    await taikoInteraction.Timefield({type:"date"},startDateValue)
    var treatmentDateValue = date.getDateYearsAgo(numberOfYearsAgo_treatmentDate);
    await taikoInteraction.Timefield({type:"date"},treatmentDateValue)
   // await timeField({type:"date"},toRightOf(treatmentDate)).select(treatmentDateValue);
});

step("Select other details id <id>, dr incharge <doctor> and treatment stage <stage>", async function (id, doctor, stage) {
    await taikoInteraction.Write(id,'into',toRightOf(idNumber))
    await taikoInteraction.Write(doctor,'into',toRightOf(doctorInCharge))
    await taikoInteraction.Dropdown(toRightOf(patientStage),stage)
});

step("Enroll in program", async function() {
    await taikoInteraction.Click(enroll,'button')
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoElement.waitToPresent(saved)
});

step("Open the program dashboard <program>", async function(program) {
    await taikoElement.waitToPresent(text(`${program} Dashboard`))
    await taikoInteraction.Click(`${program} Dashboard`,'text',within($(dashboardLink)))
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Goto All sections", async function () {
    await taikoHelper.repeatUntilFound(link(all))
    await taikoInteraction.Click(all,'link')
    await taikoHelper.repeatUntilFound(link(all))
});
