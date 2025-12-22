"use strict";
const { text, $ } = require('taiko');
const gaugeHelper = require("../util/gaugeHelper");
const taikoInteraction = require("../../../components/taikoInteraction.js");
const taikoassert = require("../../../components/taikoAssert.js");
const taikoElement = require('../../../components/taikoElement.js');
const taikoHelper = require('../util/taikoHelper.js');
const { waitFor, evaluate, press } = require('taiko');
const { scrollTo } = require('taiko');
var assert = require("assert");

var tabXpath = '//li[contains(@class,"tab-item")]';
var tabItemXpath = i => `//li[contains(@class,"tab-item")][${i}]//span[1]`;
var noteIconXpath = '(//div[@class="note-icon-container"])[1]';
var incrementBtnXpath = '//button[@title="Increment number"]';
var providerInputXpath = '//input[@id="Provider-info"]';
var noteTitleXpath = '//input[@placeholder="Note title"]';
var noteContentXpath = '//textarea[@placeholder="Note content"]';
var maxCharTextareaXpath = '//*[@placeholder="Enter a maximum of 250 characters"]';
var amendTextareaXpath = '//*[@placeholder="Enter amendment notes"]';
var amendReasonSelectCss = 'select[data-testid="amendment-reason-select"]';
var ackTextareaCss = 'textarea[placeholder="Enter Notes"]';
var saveBtnXpath = "//button[normalize-space()='Save']";
var saveBtnSecondXpath = "(//button[text()='Save'])[2]";
var dashboardLinkXpath = '//a[contains(@class,"bx--link") and @href="/bahmni/home/#/dashboard"]';
var amendNoteBtnXpath = "//button[normalize-space()='Amend Note']";
var historyBtnXpath = "//button[normalize-space()='History']";

var speciliatyList = process.env.specialityList.split(',');
var implementationspecialitylist = process.env.implementationSpecialityList.split(',');
var implicitWaitTime = parseInt(process.env.implicitTimeOut);

step("Administer medication <medication>", async function (medication) {
  await taikoInteraction.Click('Add Task', 'text');
  await taikoInteraction.Click('Drug Name (Emergency / Ad hoc', 'text');
  await taikoInteraction.Write('Paracetamol', 'into', 'Drug Name (Emergency / Ad hoc');
  await waitFor(700);
  await press('ArrowDown');
  await press('Enter');
  await taikoInteraction.Click(incrementBtnXpath, 'xpath');
  await taikoInteraction.Click(providerInputXpath, 'xpath');
  await press('ArrowDown');
  await press('Enter');
  await taikoInteraction.Click(maxCharTextareaXpath, 'xpath');
  await taikoInteraction.Write(
    'test amend notes feature',
    'into',
    { placeholder: 'Enter a maximum of 250 characters' }
  );
  await taikoInteraction.Click(saveBtnSecondXpath, 'xpath');
  await taikoInteraction.Click(saveBtnXpath, 'xpath');
});

step("Create clinical note <notePath> with content <content>", async function (notePath, content) {
  gauge.message(`Creating note ${notePath}`);
  await taikoInteraction.Click('Add Note', 'text');
  await taikoInteraction.WaitFor(500);
  await taikoInteraction.Write(notePath, 'into', noteTitleXpath);
  await taikoInteraction.Write(content, 'into', noteContentXpath);
  await taikoInteraction.Click(saveBtnXpath, 'xpath');
  await taikoInteraction.WaitFor(1000);
});

step("Amend the note as nurse", async function () {
  await scrollTo($(noteIconXpath));
  await taikoInteraction.Click(noteIconXpath, 'xpath');
  await taikoInteraction.Click(amendNoteBtnXpath, 'xpath');
  await taikoInteraction.Click(amendTextareaXpath, 'xpath');
  await taikoInteraction.Write(
    'test ammend notes feature',
    'into',
    { placeholder: 'Enter amendment notes' }
  );
  await evaluate(selector => {
    const select = document.querySelector(selector);
    select.value = "Incorrect Time";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }, amendReasonSelectCss);
  await taikoInteraction.Click(saveBtnXpath, 'xpath');
});

step("Navigate to home page", async function () {
  await taikoInteraction.Click(dashboardLinkXpath, 'xpath');
});

step("Acknowledge note as nurseadmin", async function () {
  await taikoInteraction.Click(noteIconXpath, 'xpath');
  await taikoInteraction.Click('Acknowledge Note', 'text');
  await taikoInteraction.Click('Acknowledge', 'text');
  await taikoInteraction.Click(ackTextareaCss, 'css');
  await taikoInteraction.Write(
    'test amend notes feature',
    'into',
    { placeholder: 'Enter Notes' }
  );
  await taikoInteraction.Click(saveBtnXpath, 'xpath');
});

step("Validate the history of amended note", async function () {
  await waitFor(700);
  await taikoInteraction.Click(noteIconXpath, 'xpath');
  await taikoInteraction.Click(historyBtnXpath, 'xpath');
  assert.ok(await text('Notes History').exists());
  assert.ok(await text('Acknowledged').exists());
  assert.ok(await text('Original').exists());
});

step("Verify the specialitis list", async function () {
  var tabLength = (await $(tabXpath).elements()).length;
  for (let i = 1; i < tabLength; i++) {
    var speciality = (await $(tabItemXpath(i)).text()).trim();
    if (!implementationspecialitylist.includes(speciality)) {
      await taikoassert.assertArray(speciliatyList, speciality);
    }
  }
});

step("Verify the patient visit is added in my patient queue and the <speciality> queue",async function(speciality){
    var firstName = gaugeHelper.get("patientFirstName")
    var lastName = gaugeHelper.get("patientLastName")
    var fullName = firstName+' '+lastName
    await taikoInteraction.Click(myPatients,'text')
    await taikoElement.waitToExists(text(identifer))
    await taikoassert.assertExists(text(fullName))
    await taikoInteraction.Click(process.env.speciality,'text')
    await taikoElement.waitToExists(text(identifer))
    await taikoassert.assertExists(text(fullName))
})
