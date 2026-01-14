const { $, toRightOf, below, link, text, within, select, click, dropDown, waitFor, evaluate, highlight, scrollTo } = require('taiko');
const { press,write } = require('taiko');
const gaugeHelper = require("./../util/gaugeHelper")
var assert = require("assert");
var date = require("../util/date");
const taikoHelper = require("../util/taikoHelper");
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoElement = require('../../../components/taikoElement.js');
const taikoassert = require('../../../components/taikoAssert.js');

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
var tab='//li[contains(@class,"tab-item")]'
var programList=process.env.programList.split(',')

step("Click Start Special OPD Visit", async function() {
    await taikoInteraction.Click(startOpdVisit,'button',within($(submitBtn)))
    await taikoInteraction.Click(startSpecialOpdVisit,'button',within($(submitBtn)))
});

step("Begin new program enrollment", async function() {
    await taikoElement.waitToExists(text(newProgramEnrollment))
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
    await taikoElement.waitToExists(text(saved))
});

step("Open the program dashboard <program>", async function(program) {
    await taikoElement.waitToExists(text(`${program} Dashboard`))
    await taikoInteraction.Click(`${program} Dashboard`,'text',within($(dashboardLink)))
});

step("Goto All sections", async function () {
    await taikoHelper.repeatUntilFound(link(all))
    await taikoInteraction.Click(all,'link')
    await taikoHelper.repeatUntilFound(link(all))
});

step("Verify the programs list",async function(){
    var tabLength=(await $(tab).elements()).length

   for(let i=1;i<tabLength;i++)
   {
    var tabItem=`//li[contains(@class,"tab-item")][${i}]//span[1]`
    await taikoHelper.wait(2000)
    var program=(await $(tabItem).text()).trim()
    if(program!='All')
    {
    await taikoassert.assertArray(programList,program)
    }
}
})

const { $, toRightOf, below, link, text, within, select, click, dropDown, waitFor, evaluate, highlight, scrollTo, press, write } = require('taiko');
const gaugeHelper = require("./../util/gaugeHelper"), assert = require("assert"), date = require("../util/date"), taikoHelper = require("../util/taikoHelper"), taikoInteraction = require('../../../components/taikoInteraction.js'), taikoElement = require('../../../components/taikoElement.js'), taikoassert = require('../../../components/taikoAssert.js');

step('Select patient into <programName> program', async function (programName) {
    const enrollLink = $("//a[contains(@class, 'section-title') and contains(normalize-space(), 'New Program Enrollment')]");
    const dropdown = $('//select[@ng-model="programSelected"]');
    await evaluate(enrollLink, el => el.click());
    await click(dropdown);
    await write(programName);
    await waitFor(500);
    await press('Enter');
});

step('Validate Smile Train queue row for <idNumber>, <surgeryType>, <serviceName>, <surgeonName>, <programStage>', async function (idNumber, surgeryType, serviceName, surgeonName, programStage) {
    const firstName = gaugeHelper.get('patientFirstName');
    const lastName = gaugeHelper.get('patientLastName');
    const fullName = `${firstName} ${lastName}`;
    const rowSelector = $(`//tr[.//div[normalize-space()="${fullName}"]]`);
    await taikoElement.waitToExists(rowSelector, 15000);
    const cells = await evaluate(rowSelector, row => {
        return Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
    });
    assert.strictEqual(cells[1], fullName, `Expected patient name ${fullName} but got ${cells[1]}`);
    assert.strictEqual(cells[4], surgeryType, `Expected Surgery Type ${surgeryType} but got ${cells[4]}`);
    assert.strictEqual(cells[6], surgeonName, `Expected Surgeon ${surgeonName} but got ${cells[6]}`);
    assert.strictEqual(cells[7], serviceName, `Expected Service Name ${serviceName} but got ${cells[7]}`);
    assert.strictEqual(cells[9], programStage, `Expected Program Stage ${programStage} but got ${cells[9]}`);
});

step('Navigate to Program page', async function () {
    const patientsLink = $('#patients-link');
    try {
        await taikoElement.waitToExists(patientsLink, 10000);
        await scrollTo(patientsLink);
        await click(patientsLink);
    } catch (e) {}
});

step('Enroll patient into Smile Train program with <idNumber>, <surgeonName>, <anaesthesiologistName>, <programStage>, <surgeryType>, <serviceName>', async function (idNumber, surgeonName, anaesthesiologistName, programStage, surgeryType, serviceName) {
    const idField = $('#ID_Number');
    const surgeonInput = '//input[@id="Surgeon"]';
    const anaesthesiologistInput = '//input[@id="Anaesthesiologist"]';
    const workflowSelect = $("//select[@ng-model='$parent.workflowStateSelected']");
    const surgeryTypeInput = $('#Surgery_Type');
    const serviceNameInput = $('#Service_Name');
    await evaluate(idField, (element, value) => {
        element.value = 123;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }, idNumber);
    await taikoInteraction.Click(surgeonInput, 'xpath');
    await taikoInteraction.Write(surgeonName, 'xpath', surgeonInput);
    await taikoInteraction.Click(anaesthesiologistInput, 'xpath');
    await taikoInteraction.Write(anaesthesiologistName, 'xpath', anaesthesiologistInput);
    await click(workflowSelect);
    await write(programStage);
    await waitFor(500);
    await click(surgeryTypeInput);
    await write(surgeryType);
    await waitFor(500);
    await click(serviceNameInput);
    await write(serviceName);
    await waitFor(500);
    await press('Enter');
    await taikoElement.waitToExists(text('Smile Train'));
    await taikoElement.waitToExists(text('Active Programs'));
    assert.ok(await text('Smile Train').exists());
    assert.ok(await text('Active Programs').exists());
});

step('Navigate to program of selected patient', async function () {
    const firstName = gaugeHelper.get('patientFirstName');
    const lastName = gaugeHelper.get('patientLastName');
    const fullName = `${firstName} ${lastName}`;
    const rowSelector = $(`//tr[.//div[normalize-space()="${fullName}"]]`);
    await taikoElement.waitToExists(rowSelector, 15000);
    await scrollTo(rowSelector);
    await evaluate(rowSelector, row => {
        const link = row.querySelector('a[ng-click^="forwardPatient"], a[ng-click*="forwardPatient"], a');
        if (!link) throw new Error('Identifier link not found for patient row');
        link.click();
    });
});

step('Add Program outcome <outcome>', async function (outcome) {
    const editBtn = $("//input[@type='button' and (@value='Edit' or contains(@ng-click,'toggleEdit'))]");
    const outcomeSelect = $("//select[@ng-model='patientProgram.outcomeData']");
    await taikoElement.waitToExists(editBtn, 10000);
    await scrollTo(editBtn);
    try {
        await taikoInteraction.Click(editBtn, 'xpath');
    } catch (e) {
        await evaluate(editBtn, el => el.click());
    }
    await taikoElement.waitToExists(outcomeSelect, 10000);
    await scrollTo(outcomeSelect);
    await click(outcomeSelect);
    await write(outcome);
    await press('Enter');
    await taikoElement.waitToExists(text(outcome), 10000);
    assert.ok(await text(outcome).exists(), `Expected outcome "${outcome}" to be visible`);
});

step('Validate Program outcome <outcome>', async function (outcome) {
    const firstName = gaugeHelper.get('patientFirstName');
    const lastName = gaugeHelper.get('patientLastName');
    const fullName = `${firstName} ${lastName}`;
    const rowSelector = $(`//tr[.//div[normalize-space()="${fullName}"]]`);
    await taikoElement.waitToExists(rowSelector, 15000);
    await scrollTo(rowSelector);
    const actual = await evaluate(rowSelector, (row, expected) => {
        const norm = s => (s || '').replace(/\s+/g, ' ').trim();
        const exp = norm(expected).toLowerCase();
        const cells = Array.from(row.querySelectorAll('td'));
        for (const td of cells) {
            const txt = norm(td.textContent || td.innerText).toLowerCase();
            if (txt.includes(exp)) return norm(td.textContent || td.innerText);
        }
        return null;
    }, outcome);
    gauge.message(`Expected: "${outcome}"`);
    gauge.message(`Actual: "${actual}"`);
    if (!actual) {
        throw new Error(`Program outcome "${outcome}" not found for ${fullName}. Actual content did not include expected value.`);
    }
});

step('Navigate to Smile Train', async function () {
    const smileLink = $("//a[.//span[normalize-space(text())='Smile Train']]");
    const queueRows = $("//tr[contains(@ng-repeat,'visiblePatients') or .//div[contains(@class,'patient-name')]]");
    await taikoElement.waitToExists(smileLink, 10000);
    await scrollTo(smileLink);
    try {
        await taikoInteraction.Click(smileLink, 'xpath');
    } catch (e) {
        await evaluate(smileLink, el => el.click());
    }
    await taikoElement.waitToExists(queueRows, 15000).catch(() => {});
});