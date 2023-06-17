"use strict";
const {
    click,
    waitFor,
    timeField,
    toRightOf,
    textBox,
    into,
    write,
    dropDown,
    highlight,
    below,
    within,
    scrollTo,
    $,
    text,
    confirm,
    accept,
    button,
    link
} = require('taiko');
var assert = require("assert");

step("Verify the login locations in login page",async function(){
    var actualLocationsList=[]
    var actualLocationLength=(await $('//select[@id="location"]/option').elements()).length
    for(let i=1;i<actualLocationLength;i++){
        var element=`//select[@id="location"]/option[${i}]`
        actualLocationsList.push(await $(element).text())
    }
    var expectedLocationsList=process.env.registrationLocations.split(",")
    expectedLocationsList.forEach((location)=>{
        assert.ok(actualLocationsList.includes(location))
    })
    
})

step("Verify the visit locations",async function(){
    var actualLocationsList=[]
    var actualLocationLength=(await $('//select[@ng-model="selectedLocationUuid"]/option').elements()).length
    for(let i=1;i<actualLocationLength;i++){
        var element=`//select[@ng-model="selectedLocationUuid"]/option[${i}]`
        var cleanValue=(await $(element).text()).replace("\n","").trim()
        actualLocationsList.push(cleanValue)
    }
    var expectedLocationsList=process.env.registrationLocations.split(",")
    expectedLocationsList.forEach((location)=>{
        assert.ok(actualLocationsList.includes(location))
    })
})