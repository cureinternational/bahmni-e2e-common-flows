"use strict"
const { fileField, click, attach, button,evaluate, $, highlight, image, toLeftOf, below, text, waitFor,dropDown } = require('taiko');
const path = require('path');
const taikoHelper = require("../util/taikoHelper")
const taikoElement=require('../../../components/taikoElement')
const taikoInteraction=require('../../../components/taikoInteraction')
const taikoassert=require('../../../components/taikoAssert')
var assert = require("assert")

var overlay='//div[@id="overlay" and @style="display: block;"]'
var save='SAVE'
var img='//select/../img'
var imgElement='//div[@class="image-container"]//img'
var imgConcept='//a[@class="img-concept"]'
var slide='//img[@class="slide"]'
var closeBtn='.dialog-close-btn'

step("Add a report <labReport> to <module>", async function (labReport, module) {
	await taikoInteraction.Attach(path.join("./bahmni-e2e-common-flows/data/reports", `${labReport}.jpg`), fileField({ 'name': 'image-document-upload' }));
	await taikoHelper.repeatUntilNotFound($(overlay))
	await taikoInteraction.Dropdown({ id: 'file0' },module)
	await taikoHelper.repeatUntilEnabled(button(save))
});

step("Save the report", async function () {
	await taikoInteraction.Click(save,'button')
	await taikoHelper.repeatUntilNotFound($(overlay))
	await taikoInteraction.Click(img,'xpath')
	await taikoassert.assertExists($(imgElement))
	await taikoInteraction.Click({"class":"dialog-close-btn"},'button')
	await taikoElement.waitNotToPresent($(imgElement))
});

step("validate patient document in patient dashboard", async function() {
	await taikoInteraction.Click(imgConcept,'xpath')
	await taikoassert.assertExists($(slide))
	await taikoElement.waitToPresent($(closeBtn))
	const closeButton = $(closeBtn);
	await taikoInteraction.EvaluateClick(closeButton)
});
