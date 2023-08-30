"use strict";
const {
    click,
    waitFor,
    focus,
    toRightOf,
    textBox,
    text,
    into,
    write,
    $,
    dropDown,
    fileField,
    attach,
    scrollTo,
    reload,
    highlight,
    below,
    button,
    near,
    to,
    link,
    timeField,
    evaluate
} = require('taiko');
var assert = require("assert");
var fileExtension = require("../util/fileExtension");
const taikoInteraction = require('../../../components/taikoInteraction');
const taikoElement = require('../../../components/taikoElement');
const taikoassert = require('../../../components/taikoassert');

var orderCompleted='Order is Completed'

step("Click the order <order>", async function (order) {
    var orderFile = `./bahmni-e2e-common-flows/data/${order}.json`;
    var radiologyOrder = JSON.parse(fileExtension.parseContent(orderFile))
    await taikoInteraction.Click(radiologyOrder.test,'text')
 });

 step("Select the Radiologist",async function(){
    var radiologist=process.env.radiologist
    await taikoElement.waitToPresent(orderCompleted)
    await taikoInteraction.Dropdown(below(orderCompleted),radiologist)
 })

 step("Verify the Radiologist Name",async function(){  
    var radiologist=process.env.radiologist
    await taikoassert.assertExists(text(radiologist))
 })
