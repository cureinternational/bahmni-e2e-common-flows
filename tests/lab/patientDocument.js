"use strict"
const { fileField, click, attach, button,evaluate, $, highlight, image, toLeftOf, below, text, waitFor,dropDown } = require('taiko');
const path = require('path');
const taikoHelper = require("../util/taikoHelper")
var assert = require("assert")

var overlay='//div[@id="overlay" and @style="display: block;"]'
var save='SAVE'
var img='//select/../img'
var imgElement='//div[@class="image-container"]//img'
var imgConcept='//a[@class="img-concept"]'
var slide='//img[@class="slide"]'
var closeBtn='.dialog-close-btn'
step("Add a report <labReport> to <module>", async function (labReport, module) {
	await attach(path.join("./bahmni-e2e-common-flows/data/reports", `${labReport}.jpg`), fileField({ 'name': 'image-document-upload' }), { waitForEvents: ['DOMContentLoaded'] });
	await taikoHelper.repeatUntilNotFound($(overlay))
	await dropDown({id:'file0'}).select(module)
	await taikoHelper.repeatUntilEnabled(button(save))
});

step("Save the report", async function () {
	await highlight(save)
	await click(button(save), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
	await taikoHelper.repeatUntilNotFound($(overlay))
	await click($(img));
	assert.ok(await $(imgElement).exists());
	await waitFor(3000)
	await click(button({"class":"dialog-close-btn"}))
	await waitFor(async () => !(await $(imgElement).exists()))
});

step("validate patient document in patient dashboard", async function() {
	await click($(imgConcept));
	assert.ok(await $(slide).exists());
	await waitFor(async () => (await $(closeBtn).exists()))
	const closeButton = $(closeBtn);
	await evaluate(closeButton, (el) => el.click());
});
