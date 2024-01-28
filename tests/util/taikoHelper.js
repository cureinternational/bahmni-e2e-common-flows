const { button, toRightOf, textBox, into, write, press, click, timeField, below, scrollTo, text, evaluate, $, checkBox, waitFor, image, within, dropDown, above } = require('taiko');
var date = require("./date");
var assert = require("assert");
const { time, log } = require('console');
const taikoAssert = require('../../../components/taikoAssert.js');
const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoElement = require('../../../components/taikoElement.js');
const logHelper = require('./logHelper');


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
    for (var configuration of configurations) {
        switch (configuration.type) {
            case 'Group':
                await executeConfigurations(configuration.value, observationFormName, isNotObsForm)
                break;
            case 'TextArea':
                if(configuration.below!==undefined)
                {
                await scrollTo(textBox(toRightOf(configuration.label),below(configuration.below)))
                await write(configuration.value, into(textBox(toRightOf(configuration.label),below(configuration.below))))
                }
                else if(configuration.above!==undefined)
                {
                await scrollTo(textBox(toRightOf(configuration.label),below(configuration.above)))
                await write(configuration.value, into(textBox(toRightOf(configuration.label),above(configuration.above))))
                }
                else
                {
                await scrollTo(textBox(toRightOf(configuration.label)))
                await write(configuration.value, into(textBox(toRightOf(configuration.label))))
                }
                break;
            case 'Input':
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
                var dateValue=date.addDaysAndReturnDateInDDMMYYYY(configuration.value.split(",")[0])
                var timeValue=configuration.value.split(",")[1]
                await write(dateValue, into(timeField(toRightOf(configuration.label))))
                await write(timeValue,$('//input[@type="time"]'))
                break;
            case 'TypeDropdown':
                var dropDownLabel=configuration.label
                var dropDownValue=configuration.value
                await selectDropDown(dropDownLabel, dropDownValue)
                break;
            case 'CustomDropdown':
                var dropDownLabel=configuration.label
                var dropDownValue=configuration.value
                await selectCustomDropDown(dropDownLabel, dropDownValue)
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
async function selectDropDown(locator,value){
    await taikoInteraction.Click('//div[contains(text(),"Select")]','xpath',toRightOf(locator))
    await taikoInteraction.Write(value,'into',toRightOf(locator))
    var element=`//div[contains(text(),"${value}")]`
    await taikoElement.waitToExists($(element))
    await wait(1000)
    await taikoInteraction.Click(element,'xpath')
}

async function selectCustomDropDown(locator,value){
    var selectElement='//div[contains(text(),"Select...")]'
    await taikoInteraction.Click(selectElement,'xpath',toRightOf(locator))
    var element=`//div[contains(text(),"${value}")]`
    await taikoInteraction.Click(element,'xpath',toRightOf(locator))
}
async function clearConfigurations(configurations){
    for (var configuration of configurations) {
        await wait(1000)
        switch (configuration.type) {
            case 'TextArea':
                if(configuration.below!==undefined)
                {
                    await click(textBox(toRightOf(configuration.label),below(configuration.below)))
                    await taikoInteraction.Clear(toRightOf(configuration.label),below(configuration.below))
                }
                else if(configuration.above!==undefined)
                {
                    await click(textBox(toRightOf(configuration.label),above(configuration.above)))
                    await taikoInteraction.Clear(toRightOf(configuration.label),above(configuration.above))
                }
                else
                {
                    await taikoInteraction.Click((toRightOf(configuration.label),'textbox'))
                    await taikoInteraction.Clear(toRightOf(configuration.label))
                }
            break;
            case 'Input':
                await taikoInteraction.Clear(toRightOf(configuration.label))
            break;
            case 'TextBox':
                if (configuration.unit === undefined)
                    await taikoInteraction.Clear(toRightOf(configuration.label))
                else
                    await taikoInteraction.Clear(toRightOf(configuration.label + " " + configuration.unit))
            break;
            case 'Button':
            break;
            case 'Date':

            break;
            case 'DateTime':

            break;
            case 'TypeDropdown':
                var dropDownLabel=configuration.label
                await unselectDropDown(dropDownLabel)
            break;
            case 'CustomDropdown':
                var dropDownLabel=configuration.label
                await taikoInteraction.Click('//span[@title="Clear value"]','xpath',toRightOf(dropDownLabel))
                var selectElement='//div[contains(text(),"Select")]'
                await taikoInteraction.Click(selectElement,'xpath',toRightOf(dropDownLabel))
            break;
            case 'Dropdown':
            break;
            default:
            logHelper.info("Unhandled " + configuration.label + ":" + configuration.value)
        }
    }
}

async function unselectDropDown(locator){
    await taikoInteraction.Click('//span[@class="Select-clear"]','xpath',toRightOf(locator))
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
    clearConfigurations:clearConfigurations,
    repeatUntilNotFound: repeatUntilNotFound,
    repeatUntilFound: repeatUntilFound,
    repeatUntilEnabled: repeatUntilEnabled,
    validateFormFromFile: validateFormFromFile,
    validateNewFormFromFile:validateNewFormFromFile,
    wait:wait
}