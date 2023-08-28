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

var orderCompleted='Order is Completed'

step("Click the order <order>", async function (order) {
    var orderFile = `./bahmni-e2e-common-flows/data/${order}.json`;
    var radiologyOrder = JSON.parse(fileExtension.parseContent(orderFile))
    await click(text(radiologyOrder.test))
 });

 step("Select the Radiologist",async function(){
    var radiologist=process.env.radiologist
    await waitFor(async () => (await text(orderCompleted).exists()))
    await dropDown(below(orderCompleted)).select(radiologist)
 })

 step("Verify the Radiologist Name",async function(){  
    var radiologist=process.env.radiologist
    assert.ok(await text(radiologist).exists())
 })
