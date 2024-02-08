const {$} = require('taiko');

const taikoInteraction = require('../../../components/taikoInteraction.js');
const taikoElement = require('../../../components/taikoElement.js');
const taikoAssert = require('../../../components/taikoAssert.js');
const taikoHelper = require('../util/taikoHelper.js');
const taikoBrowserAction=require('../../../components/taikobrowserActions.js')

var calendarElement='//input[contains(@class,"calendar-day-input")]'
var notesTabElement='//div[@class="notesTab"]'
var textAreaElement='textArea#notesID'
var saveBtnElement='//button[@class="save-button"]'
var savedNotesElement='//div[@class="notes-text"]/div'
var deleteNotesElement='//div[@class="notes-text"]/span'
var overlay='//div[@id="overlay" and @style="display: block;"]'
var deleteNotesYes='//button[@class="delete-button"]'

step("Verify the presence of calendar", async function () {
    await taikoElement.waitToPresent($(calendarElement))
    await taikoAssert.assertExists($(calendarElement))
});

step('Add OT note',async function(){
    await taikoBrowserAction.reloadPage()
    var textFound=await taikoElement.isNotExists($(deleteNotesElement))
    if(textFound)
    {
    await taikoInteraction.Click(notesTabElement,'xpath')
    await taikoInteraction.Write('automation test notes','xpath',textAreaElement)
    await taikoInteraction.Click(saveBtnElement,'xpath')
    }
});

step('Delete the note',async function(){
    if(await taikoElement.isExists($(deleteNotesElement)))
    {
    await taikoInteraction.EvaluateClick($(deleteNotesElement))
    await taikoInteraction.EvaluateClick($(deleteNotesYes))
    }
})

step('Verify the OT note',async function(){
    await taikoBrowserAction.reloadPage()
    var text=await taikoElement.getText($(savedNotesElement))
    taikoAssert.assertEquals(text,'automation test notes')
})