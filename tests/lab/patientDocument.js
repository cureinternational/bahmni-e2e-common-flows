"use strict"
const { fileField,button,$ } = require('taiko');
const path = require('path');
const taikoHelper = require("../util/taikoHelper")
const taikoElement=require('../../../components/taikoElement.js')
const taikoInteraction=require('../../../components/taikoInteraction.js')
const taikoAssert=require('../../../components/taikoAssert.js')
var save='SAVE'
var img='//select/../img'
var imgElement='//div[@class="file"]//img'
var image='a.img-concept'
var datapath=process.env.dataPath

step("Add a report <labReport> to <module>", async function (labReport, module) {
	await taikoInteraction.Attach(path.join(`./bahmni-e2e-common-flows/data/${datapath}/reports`, `${labReport}.jpg`), fileField({ 'name': 'image-document-upload' }));
	await taikoInteraction.Dropdown({ id: 'file0' },module)
	await taikoHelper.repeatUntilEnabled(button(save))
});

step("Save the report", async function () {
	await taikoInteraction.Click(save,'button')
	await taikoInteraction.Click(img,'xpath')
	await taikoAssert.assertExists($(imgElement))
	await taikoInteraction.Click({"class":"dialog-close-btn"},'button')
	await taikoElement.waitNotToPresent($(imgElement))
});

step("validate patient document in patient dashboard", async function() {
	await taikoInteraction.ScrollTo($(image))
	await taikoAssert.assertExists($(image))
});
