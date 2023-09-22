"use strict";
const {text,$,below} = require('taiko');
var fileExtension = require("../util/fileExtension");
const taikoInteraction = require('../../../components/taikoInteraction');
const taikoassert = require('../../../components/taikoAssert');

var orderCompleted='Order is Completed'

step("Click the order <order>", async function (order) {
    var orderFile = `./bahmni-e2e-common-flows/data/${order}.json`;
    var radiologyOrder = JSON.parse(fileExtension.parseContent(orderFile))
    await taikoInteraction.Click(radiologyOrder.test,'text')
 });

 step("Select the Radiologist",async function(){
    var radiologist=process.env.radiologist
    await taikoInteraction.Dropdown(below(orderCompleted),radiologist)
 })

 step("Verify the Radiologist Name",async function(){  
    var radiologist=process.env.radiologist
    await taikoassert.assertExists(text(radiologist))
 })
