"use strict";
const { text, $ } = require('taiko');
const gaugeHelper = require("../util/gaugeHelper.js");
const taikoInteraction = require("../../../components/taikoInteraction.js");
const taikoassert = require("../../../components/taikoAssert.js");
const taikoElement = require('../../../components/taikoElement.js');
const taikoHelper = require('../util/taikoHelper.js');
const { waitFor, evaluate, press, scrollTo, highlight } = require('taiko');
var assert = require("assert");

// --- General Shared XPaths ---
var saveBtnXpath = "//button[normalize-space()='Save']";
var dashboardLinkSecondXpath = '(//a[contains(@class,"bx--link") and contains(@href,"/dashboard")])[2]';
var dashboardLinkIdXpath = '//a[@id="dashboard-link"]';
var errorMsgXpath = '//div[contains(@class,"error-message")]//div[contains(@class,"msg")]';
var okBtnXpath = '//button[contains(@class,"show-btn") and text()="OK"]';

// --- Add Allergy Dialog XPaths ---
var addBtnXpath = '//div[normalize-space()="Add +"]';
var allergenSearchXpath = '//*[@placeholder="Type to search Allergen"]';
var allergenOptionXpath = '//span[@class="allergen"]';
var reactionSearchXpath = '//*[@placeholder="Type to search Reactions"]';
var mentalStatusLabelXpath = '//label[span[@class="bx--checkbox-label-text" and text()="Mental status change"]]';
var severityRadioBtnXpath = '//span[@class="bx--radio-button__appearance"]';

// --- No Known Allergy Specific XPaths ---
var legendNoAllergyXpath = "//legend[text()='Does the patient have any known allergies?']";
var noRadioBtnXpath = "//label[span='No']";
var noKnownAllergyTextXpath = "//div[contains(text(),'No Known Allergy')]";

// --- Clinical Dashboard Validation XPaths ---
var noKnownAllergyDashboardRedXpath = "//div[contains(text(),'No Known Allergy')]";
var noKnownAllergyDashboardStrikedXpath = "//div[contains(@class,'allergies-row') and contains(@class,'no-known-allergy')]/div[text()='No Known Allergy']";

// --- Visit Page Validation XPaths ---
var visitPageAllergyRowXpath = "//tr[@data-testid='table-body-row']/td[contains(text(),'No Known Allergy')]";
var visitPageAllergyCellStrikedXpath = "//td[contains(@class,'no-known-allergy') and text()='No Known Allergy']";

// --- Medication Page Navigation & Validation XPaths ---
var consultationTabXpath = '//a[contains(@ng-click,"openConsultation")]';
var medicationsTabXpath = '//a[contains(@ng-click,"showBoard") and contains(text(),"Medications")]';
var medicationPageAllergyRowRedXpath = "//div[contains(@class,'allergies-row') and contains(@class,'red-text')]/div[text()='No Known Allergy']";
var medicationPageAllergyRowStrikedXpath = "//div[contains(@class,'allergies-row') and contains(@class,'no-known-allergy')]//div[text()='No Known Allergy']";


step("Add Allergy <allergy>", async function (allergy) {
    await taikoElement.waitToExists($(addBtnXpath));
    await highlight($(addBtnXpath));
    await scrollTo($(addBtnXpath));
    await evaluate($(addBtnXpath), el => el.click());

    // Wait for the input to appear before clicking/writing
    await taikoElement.waitToExists($(allergenSearchXpath), 10000);
    await taikoInteraction.Click(allergenSearchXpath, 'xpath');
    await taikoInteraction.Write(
        allergy,
        'into',
        { placeholder: 'Type to search Allergen' }
    );

    await taikoInteraction.Click(allergenOptionXpath, 'xpath');
    await taikoElement.waitToExists($(reactionSearchXpath), 10000);
    await taikoInteraction.Click(reactionSearchXpath, 'xpath');
    await taikoInteraction.Write(
        "Mental status change",
        'into',
        { placeholder: 'Type to search Reactions' }
    );
    await taikoElement.waitToExists($(mentalStatusLabelXpath), 10000);
    await scrollTo($(mentalStatusLabelXpath));
    await taikoInteraction.Click(mentalStatusLabelXpath, 'xpath');
    
    await taikoElement.waitToExists($(severityRadioBtnXpath), 10000);
    await scrollTo($(severityRadioBtnXpath));
    await taikoInteraction.Click(severityRadioBtnXpath, 'xpath');
    
    await taikoInteraction.Click(saveBtnXpath, 'xpath');
});


step('Add <allergy> for the patient', async function () {
    // Wait for and highlight the "Add +" button
    await taikoElement.waitToExists($(addBtnXpath));
    await highlight($(addBtnXpath));
    await scrollTo($(addBtnXpath));
    await evaluate($(addBtnXpath), el => el.click());

    // Wait for the radio button question to appear
    await taikoElement.waitToExists($(legendNoAllergyXpath), 10000);

    // Scroll to and click the "No" radio button
    await scrollTo($(noRadioBtnXpath));
    await taikoInteraction.Click(noRadioBtnXpath, 'xpath');
    
    await taikoElement.waitToExists($(noKnownAllergyTextXpath), 10000);
    assert.ok(await text('No Known Allergy').exists());
    
    // Click Save
    await taikoInteraction.Click(saveBtnXpath, 'xpath');
});

step('Validate <allergy> is added in patient clinical dashboard', async function () {
    // Wait for the "No Known Allergy" text to appear on the dashboard
    await taikoElement.waitToExists($(noKnownAllergyDashboardRedXpath), 10000);

    // Assert its presence
    assert.ok(await text('No Known Allergy').exists());

    // Assert the font color is red
    const color = await evaluate($(noKnownAllergyDashboardRedXpath), el => getComputedStyle(el).color);
    // Accept both rgb and hex for red
    assert.ok(color === 'rgb(255, 0, 0)' || color.toLowerCase() === '#ff0000', `Expected red, got ${color}`);
});

step('Validate <allergy> is added in patient visit page', async function () {
    // Wait for the allergy row to appear in the table
    await taikoElement.waitToExists($(visitPageAllergyRowXpath), 10000);

    // Get all <td> elements in the row
    const cells = await evaluate($(visitPageAllergyRowXpath), el => {
        const row = el.parentElement;
        return Array.from(row.children).map(td => ({
            text: td.textContent.trim(),
            color: getComputedStyle(td).color
        }));
    });

    // Validate the first cell is exactly "No Known Allergy" and is red
    assert.strictEqual(cells[0].text, "No Known Allergy", 'Allergy cell text does not match');
    assert.ok(
        cells[0].color === 'rgb(255, 0, 0)' || cells[0].color.toLowerCase() === '#ff0000',
        `Expected red color for allergy cell, got ${cells[0].color}`
    );

    // Validate other cells have some value (except empty ones are allowed for middle columns)
    assert.ok(cells[4].text.length > 0, 'Nurse name cell is empty');
    assert.ok(cells[5].text.length > 0, 'Date cell is empty');

    await taikoElement.waitToExists($(dashboardLinkSecondXpath), 10000);
    await scrollTo($(dashboardLinkSecondXpath));
    await taikoInteraction.Click(dashboardLinkSecondXpath, 'xpath');
});

step('Navigate to medication from patient clinical dashboard', async function () {
    // Click Consultation tab
    await taikoInteraction.Click(consultationTabXpath, 'xpath');

    // Click Medications tab
    await taikoElement.waitToExists($(medicationsTabXpath), 10000);
    await scrollTo($(medicationsTabXpath));
    await taikoInteraction.Click(medicationsTabXpath, 'xpath');

    // If error message is present, click OK button to dismiss
    if (await $(errorMsgXpath).exists()) {
        await taikoInteraction.Click(okBtnXpath, 'xpath');
    }
});

step('Validate <allergy> is added in medication page', async function () {
    // Wait for the allergy row to appear
    await taikoElement.waitToExists($(medicationPageAllergyRowRedXpath), 10000);

    // Assert presence
    assert.ok(await text('No Known Allergy').exists());

    // Assert the color is red
    const color = await evaluate($(medicationPageAllergyRowRedXpath), el => getComputedStyle(el).color);
    assert.ok(
        color === 'rgb(255, 0, 0)' || color.toLowerCase() === '#ff0000',
        `Expected red color for allergy text, got ${color}`
    );

    await taikoElement.waitToExists($(dashboardLinkIdXpath), 10000);
    await scrollTo($(dashboardLinkIdXpath));
    await taikoInteraction.Click(dashboardLinkIdXpath, 'xpath');
});

step('Validate No known Allergy is striked through in patient clinical dashboard', async function () {
    await waitFor($(noKnownAllergyDashboardStrikedXpath), 10000);

    const isStriked = await evaluate($(noKnownAllergyDashboardStrikedXpath), (element) => {
        let current = element;
        // Walk up 3 levels to find the style
        for (let i = 0; i < 3; i++) {
            if (!current) break;
            
            const style = window.getComputedStyle(current);
            const before = window.getComputedStyle(current, '::before');
            const after = window.getComputedStyle(current, '::after');

            // 1. Check Standard CSS
            if ((style.textDecorationLine || style.textDecoration).includes('line-through')) return true;

            // 2. Check Pseudo-elements
            if ((before.textDecorationLine || before.textDecoration).includes('line-through')) return true;
            if ((after.textDecorationLine || after.textDecoration).includes('line-through')) return true;

            // Move to parent
            current = current.parentElement;
        }
        return false;
    });

    assert.ok(isStriked, "Assertion Failed: 'line-through' style not found on element or its parents.");
});

step('Validate No known Allergy is striked through in medication page', async function () {
    // Wait for the element
    await taikoElement.waitToExists($(medicationPageAllergyRowStrikedXpath), 10000);
    assert.ok(await $(medicationPageAllergyRowStrikedXpath).exists());

    const isStriked = await evaluate($(medicationPageAllergyRowStrikedXpath), (element) => {
        let current = element;
        // Traverse up 3 levels
        for (let i = 0; i < 3; i++) {
            if (!current) break;
            
            const style = window.getComputedStyle(current);
            const decoration = style.textDecorationLine || style.textDecoration;

            if (decoration.includes('line-through')) {
                return true; 
            }
            current = current.parentElement;
        }
        return false;
    });

    assert.ok(
        isStriked,
        `Expected "No Known Allergy" to be striked through, but 'line-through' was not found on the text or its parent containers.`
    );

    // Navigate back to dashboard
    await taikoElement.waitToExists($(dashboardLinkIdXpath), 10000);
    await scrollTo($(dashboardLinkIdXpath));
    await taikoInteraction.Click(dashboardLinkIdXpath, 'xpath');
});

step('Validate No known Allergy is striked through in patient visit page', async function () {
    // Wait and Assert Existence
    await taikoElement.waitToExists($(visitPageAllergyCellStrikedXpath), 10000);
    assert.ok(await $(visitPageAllergyCellStrikedXpath).exists(), "The 'No Known Allergy' cell was not found in the table.");

    // Robust Strikethrough Check (Checks TD and parent TR)
    const isStriked = await evaluate($(visitPageAllergyCellStrikedXpath), (element) => {
        const style = window.getComputedStyle(element);
        
        // Check 1: Is the style on the <td> itself?
        if ((style.textDecorationLine || style.textDecoration).includes('line-through')) {
            return true;
        }

        // Check 2: Is the style on the parent <tr>? 
        const parent = element.parentElement;
        if (parent && parent.tagName === 'TR') {
            const parentStyle = window.getComputedStyle(parent);
            if ((parentStyle.textDecorationLine || parentStyle.textDecoration).includes('line-through')) {
                return true;
            }
        }
        return false;
    });

    assert.ok(
        isStriked,
        `Expected "No Known Allergy" to be striked through, but 'line-through' was not found on the cell or the table row.`
    );
});