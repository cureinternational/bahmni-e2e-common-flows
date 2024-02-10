const { button, toRightOf, textBox, into, write, press, click, timeField, below, scrollTo, text, evaluate, $, checkBox, waitFor, image, within, dropDown, above } = require('taiko');
var date = require("./date");
var assert = require("assert");
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoElement = require('../../../components/taikoElement.js');
const logHelper = require('./logHelper');
const gaugeHelper = require('./gaugeHelper.js');


async function Click(type, value, relativeLocator) {
    const selector = getSelector(type, value);

    if (typeof relativeLocator === 'undefined') {
      await click(selector);
    } else {
      await click(selector, relativeLocator);
    }
  }

  function getSelector(type, value) {
    switch (type) {
      case 'link':
        return link(value);
      case 'text':
        return text(value);
      case 'button':
        return button(value);
      case 'near':
        return near(value);
      default:
        throw new Error('Invalid type: ' + type);
    }
  }
async function repeatUntilEnabled(element) {
    var isDisabled = true;
    do {
        isDisabled = await element.isDisabled()
    } while (!isDisabled)
}

async function repeatUntilFound(element) {
    var isFound = false;
    do {
        isFound = await element.exists(500, 1000)
    } while (!isFound)
}

async function repeatUntilNotFound(element) {
    var isFound = true;
    do {
        isFound = await !element.exists(500, 1000)
    } while (isFound)
}

async function repeatUntilNotVisible(element) {
    var isFound = true;
    do {
        try {
            if (await element.exists(500,1000)) {
                isFound = await element.isVisible()
            }
            else {
                isFound = false;
            }
        }
        catch (e) { isFound = false; }
    } while (isFound)
}

async function verifyConfigurations(configurations, observationFormName) {
    for (var configuration of configurations) {
        switch (configuration.type) {
            case 'Group':
                await verifyConfigurations(configuration.value, observationFormName)
                break;
            default:
                if (configuration.label != "Date of Sample Collection")
                    assert.ok(await text(configuration.value, toRightOf(configuration.label)).exists())
                break;
        }
    }
}

function getDate(dateValue) {
    if (dateValue == 'Today')
        return date.today();
    else {
        return date.getDateAgo(dateLessThan[1]);
    }
    throw "Unexpected date"
}

async function selectEntriesTillIterationEnds(entrySequence) {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier" + (entrySequence));
    await write(patientIdentifierValue)
    await press('Enter', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
}


async function executeConfigurations(configurations, observationFormName, isNotObsForm) {
    try{
    for (var configuration of configurations) {
        await taikoElement.waitToExists(text(configuration.label))
        switch (configuration.type)
        {
            case 'Group':
                await executeConfigurations(configuration.value, observationFormName, isNotObsForm)
                break;
            case 'TextArea':
                if(configuration.below!==undefined)
                {
                await scrollTo(text(configuration.label))
                await write(configuration.value, into(textBox(toRightOf(configuration.label),below(configuration.below))))
                }
                else if(configuration.above!==undefined)
                {
                 await scrollTo(text(configuration.label))
                await write(configuration.value, into(textBox(toRightOf(configuration.label),above(configuration.above))))
                }
                else
                {
                await scrollTo(text(configuration.label))
                await write(configuration.value, into(textBox(toRightOf(configuration.label))))
                }
                break;
            case 'Input':
                await scrollTo(textBox(toRightOf(configuration.label)))
                await write(configuration.value, into(textBox(toRightOf(configuration.label))))
                break;
            case 'TextBox':
                if (configuration.unit === undefined)
                    await write(configuration.value, into(textBox(toRightOf(configuration.label))))
                else
                    await write(configuration.value, into(textBox(toRightOf(configuration.label + " " + configuration.unit))))
                break;
            case 'Button':
                if(configuration.below!==undefined)
                {
                    await scrollTo(text(configuration.label))
                    await click(button(configuration.value), toRightOf(configuration.label),below(configuration.below))
                }
                else if(configuration.above!==undefined)
                {
                    await scrollTo(text(configuration.label))
                    await click(button(configuration.value), toRightOf(configuration.label),above(configuration.above))
                }
                else
                {
                    await scrollTo(text(configuration.label))
                    await click(button(configuration.value), toRightOf(configuration.label))
                }
                break;
            case 'Date':
                var dateValue = date.addDaysAndReturnDateInDDMMYYYY(configuration.value)
                await write(dateValue, into(timeField(toRightOf(configuration.label))))
                break;
            case 'DateTime':
                if(configuration.above!=undefined)
                {
                    var dateValue=date.addDaysAndReturnDateInDDMMYYYY(configuration.value.split(",")[0])
                    var timeValue=date.getCurrentTimeFormatted()
                    await write(dateValue, into(timeField(toRightOf(configuration.label))),above(configuration.above))
                    await write(timeValue,$(`(//input[@type="time"])[${configuration.count}]`),toRightOf(configuration.label),above(configuration.above))
                }
                else if(configuration.below!=undefined)
                {
                    var dateValue=date.addDaysAndReturnDateInDDMMYYYY(configuration.value.split(",")[0])
                    var timeValue=date.getCurrentTimeFormatted()
                    await write(dateValue, into(timeField(toRightOf(configuration.label))),below(configuration.below))
                    await write(timeValue,$(`(//input[@type="time"])[${configuration.count}]`),toRightOf(configuration.label),below(configuration.below))
                }
                else
                {
                    var dateValue=date.addDaysAndReturnDateInDDMMYYYY(configuration.value.split(",")[0])
                    var timeValue=date.getCurrentTimeFormatted()
                    await wait(2000)
                    await write(timeValue,$(`(//input[@type="time"])[${configuration.count}]`),toRightOf(configuration.label))
                    gauge.screenshot();
                    await write(dateValue, into(timeField(toRightOf(configuration.label))))
                    gauge.screenshot();
                    logHelper.info(date.printCurrentDate())
                }
                break;
            case 'TypeDropdown':
                await selectTypeDropDown(configuration)
                break;
            case 'CustomDropdown':
                await selectCustomDropDown(configuration)
                break;
            case 'Dropdown':
                var dropDownLabel=configuration.label
                var dropDownValue=configuration.value
                await dropDown(toRightOf(dropDownLabel)).select(dropDownValue)
                break;
            default:
                logHelper.info("Unhandled " + configuration.label + ":" + configuration.value)
        }
    }
}
catch(err){
logHelper.error('Error in filling forms',configuration.label)
}
}
async function selectTypeDropDown(configuration){
    var selectElement='//div[@class="Select-input"]/preceding-sibling::div'
    if(configuration.above!=undefined)
    {
    await taikoInteraction.ScrollTo(text(configuration.label))
    gauge.screenshot();
    await taikoInteraction.Click(selectElement,'xpath',toRightOf(configuration.label),above(configuration.above))
    gauge.screenshot();
    await taikoInteraction.Write(configuration.value,'into',toRightOf(configuration.label),above(configuration.above))
    gauge.screenshot();
    var element=`//div[contains(text(),"${configuration.value}")]`
    await taikoElement.waitToExists($(element))
    gauge.screenshot();
    await wait(1000)
    await taikoInteraction.Click(element,'xpath')
    gauge.screenshot();
    }
   else if(configuration.below!=undefined)
    {
    await taikoInteraction.ScrollTo(text(configuration.label))
    await taikoInteraction.Click(selectElement,'xpath',toRightOf(configuration.label),below(configuration.below))
    await taikoInteraction.Write(configuration.value,'into',toRightOf(configuration.label),below(configuration.below))
    var element=`//div[contains(text(),"${configuration.value}")]`
    await taikoElement.waitToExists($(element))
    await wait(1000)
    await taikoInteraction.Click(element,'xpath')
    }
    else(configuration==undefined)
    {
    await taikoInteraction.ScrollTo(text(configuration.label))
    await taikoInteraction.Click(selectElement,'xpath',toRightOf(configuration.label))
    await taikoInteraction.Write(configuration.value,'into',toRightOf(configuration.label))
    var element=`//div[contains(text(),"${configuration.value}")]`
    await taikoElement.waitToExists($(element))
    await wait(1000)
    await taikoInteraction.Click(element,'xpath')
    }
}

async function selectCustomDropDown(configuration){
    var selectElement='//div[contains(text(),"Select...")]'
    if(configuration.above!=undefined)
    {
    await taikoInteraction.ScrollTo(text(configuration.label))
    await taikoInteraction.Click(selectElement,'xpath',toRightOf(configuration.label),above(configuration.above))
    var element=`//div[contains(text(),"${configuration.value}")]`
    await taikoInteraction.Click(element,'xpath',toRightOf(configuration.label),above(configuration.above))
    }
    else if(configuration.below!=undefined)
    {
        var selectElement='//div[contains(text(),"Select...")]'
        await taikoInteraction.ScrollTo(text(configuration.label))
        await taikoInteraction.Click(selectElement,'xpath',toRightOf(configuration.label),below(configuration.below))
        var element=`//div[contains(text(),"${configuration.value}")]`
        await taikoInteraction.Click(element,'xpath',toRightOf(configuration.label),below(configuration.below))
    }
    else if(configuration==undefined)
    {
        var selectElement='//div[contains(text(),"Select...")]'
        await taikoInteraction.ScrollTo(text(configuration.label))
        await taikoInteraction.Click(selectElement,'xpath',toRightOf(configuration.label))
        var element=`//div[contains(text(),"${configuration.value}")]`
        await taikoInteraction.Click(element,'xpath',toRightOf(configuration.label))
    }
}

async function validateFormFromFile(configurations) {
    for (var configuration of configurations) {
        var label = configuration.label
        var value = configuration.value
        if (configuration.short_name !== undefined)
            label = configuration.short_name.trim();
        if (configuration.value_view !== undefined)
            value = configuration.value_view.trim();
        switch (configuration.type) {
            case 'Group':
                await validateFormFromFile(value)
                break;
            case 'Date':
                var dateFormatted = date.addDaysAndReturnDateInShortFormat(value)
                assert.ok(await $(`//LABEL[contains(normalize-space(), "${label}")]/../following-sibling::SPAN/PRE[normalize-space() = "${dateFormatted}"]`).exists(), dateFormatted + " To Right of " + label + " is not exist.")
                break;
            case 'DateTime':
                var dateFormatted = date.addDaysAndReturnDateInShortFormat(value.split(",")[0])
                assert.ok((text(`${dateFormatted}]`)).exists(), dateFormatted + " To Right of " + label + " is not exist.")
                break;
            case 'TypeDropdown':
                var dropDownLabel=configuration.label
                var dropDownValue=configuration.value
                await verifyDropDown(dropDownLabel, dropDownValue)
                break;

            default:
                assert.ok(await text(value).exists())
        }
    }
}

async function validateNewFormFromFile(configurations) {
    for (var configuration of configurations) {
        var label = configuration.label
        var value = configuration.value
        if (configuration.short_name !== undefined)
            label = configuration.short_name.trim();
        if (configuration.value_view !== undefined)
            value = configuration.value_view.trim();
        switch (configuration.type) {
            case 'Group':
                await validateNewFormFromFile(value)
                break;
            case 'Date':
                var dateFormatted = date.addDaysAndReturnDateInShortFormat(value)
                assert.ok((text(`${dateFormatted}]`)).exists(), dateFormatted + " To Right of " + label + " is not exist.")
                break;
            case 'DateTime':
                var dateFormatted = date.addDaysAndReturnDateInShortFormat(value.split(",")[0])
                assert.ok((text(`${dateFormatted}]`)).exists(), dateFormatted + " To Right of " + label + " is not exist.")
                break;
            case 'TypeDropdown':
                await verifyDropDown(label, value)
                break;

            default:
                assert.ok(await text(value).exists())
        }
    }
}

async function verifyDropDown(label,value){
    assert.ok(await text(value).exists(),toRightOf(label))
}
async function wait(time) {
    await waitFor(time)
}

module.exports = {
    selectEntriesTillIterationEnds: selectEntriesTillIterationEnds,
    verifyConfigurations: verifyConfigurations,
    executeConfigurations: executeConfigurations,
    repeatUntilNotFound: repeatUntilNotFound,
    repeatUntilFound: repeatUntilFound,
    repeatUntilEnabled: repeatUntilEnabled,
    validateFormFromFile: validateFormFromFile,
    validateNewFormFromFile:validateNewFormFromFile,
    wait:wait
}