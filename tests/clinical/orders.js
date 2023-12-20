"use strict";
const {text,$,below} = require('taiko');
var fileExtension = require("../util/fileExtension");
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoassert = require('../../../components/taikoAssert.js');
const gaugeHelper = require('../util/gaugeHelper');
const taikoElement = require('../../../components/taikoElement.js');
const taikoBrowserAction=require('../../../components/taikobrowserActions.js');
const taikoAssert = require('../../../components/taikoAssert.js');
const taikoHelper = require('../util/taikoHelper');
var overlay='//div[@id="overlay" and @style="display: block;"]'
const implicitWaitTime=parseInt(process.env.implicitTimeOut)
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
    await taikoElement.waitToExists(text(radiologist))
    await taikoassert.assertExists(text(radiologist))
 })

 step("Verify the drug orders",async function(){
   var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
   await taikoInteraction.Click('Drug Orders','text')
   await taikoElement.isExists(text(patientIdentifierValue))
 })

 step("Click on Lab order",async function(){
    await taikoInteraction.Click('Laboratory Orders','text')
 })

 step("Verify the lab order <order>",async function(order){
   var orderFile = `./bahmni-e2e-common-flows/data/${order}.json`;
    var labOrder = JSON.parse(fileExtension.parseContent(orderFile))
   var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
   var patientFirstName = gaugeHelper.get("patientFirstName");
   await taikoInteraction.Click(patientIdentifierValue,'link')
   await taikoHelper.wait(1000)
   await taikoBrowserAction.switchTab(/lab/)
   await taikoBrowserAction.switchTab(/Lab Entry/)
   await taikoBrowserAction.reloadPage()
   await taikoElement.waitToExists(text(patientFirstName))
   await taikoAssert.assertExists(text(labOrder.test))
 })

 step("Switch back to bahmni",async function(){
   await taikoBrowserAction.switchTab(/Orders/)
   await taikoBrowserAction.switchTab(/orders/)
 })
