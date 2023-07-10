"use strict"
const { fileField, click, attach, button,evaluate, $, highlight, image, toLeftOf, below, text, waitFor,dropDown } = require('taiko');
const path = require('path');
const taikoHelper = require("../util/taikoHelper")
var assert = require("assert")

step("Add a report <labReport> to <module>", async function (labReport, module) {
	await attach(path.join("./bahmni-e2e-common-flows/data/reports", `${labReport}.jpg`), fileField({ 'name': 'image-document-upload' }), { waitForEvents: ['DOMContentLoaded'] });
	await taikoHelper.repeatUntilNotFound($("#overlay"))
	await dropDown({id:'file0'}).select(module)
	await taikoHelper.repeatUntilEnabled(button('SAVE'))
});

step("Save the report", async function () {
	await highlight('SAVE')
	await click(button('SAVE'), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
	await taikoHelper.repeatUntilNotFound($("#overlay"))
	await click($("//select/../img"));
	assert.ok(await $("//div[@class='image-container']//img").exists());
	await waitFor(3000)
	await click(button({"class":"dialog-close-btn"}))
	await waitFor(async () => !(await $("//div[@class='image-container']//img").exists()))
});

step("validate patient document in patient dashboard", async function() {
	await click($("//a[@class='img-concept']"));
	assert.ok(await $("//img[@class='slide']").exists());
	await waitFor(async () => (await $(".dialog-close-btn").exists()))
	const closeButton = $(".dialog-close-btn");
	await evaluate(closeButton, (el) => el.click());
});
