const { goto, $, below, write, textBox, into, click, text, waitFor} = require('taiko');
var assert = require("assert")
const gaugeHelper = require("./util/gaugeHelper")
const taikobrowserActions = require("../../components/taikobrowserActions")
step("enter odoo username", async function () {
    await write(process.env.odooUsername, into(textBox(below("Email"))));
});

step("enter odoo password", async function () {
    await write(process.env.odooPassword, into(textBox(below("Password"))));
});

step("Log in to odoo", async function () {
    await click("Log in", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
});

step("Click Sales", async function () {
    await click("Sales", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("View Quotations below direct sales", async function () {
    await click("Quotations", below("Direct Sales"));
});

step("select Customer", async function () {
    let fullName = gaugeHelper.get("patientFullName")
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    let oddoCustomerName = `${fullName} [${patientIdentifierValue}]`;
    var maxRetry = 5
    while (maxRetry > 0) {
        await waitFor(1000);
        if (await $("//TD[@data-field='partner_id' and text()='" + oddoCustomerName + "']").exists(500, 5000)) {
            maxRetry = 0
            await click(oddoCustomerName);
        }
        else {
            maxRetry = maxRetry - 1;
            assert.ok(maxRetry > 0, "Quotation not found in Odoo for patient - " + oddoCustomerName)
            console.log("Waiting for 5 seconds and reload the Quotations page to wait for Patient - " + oddoCustomerName + ". Remaining attempts " + maxRetry)
            await waitFor(4000);
            await taikobrowserActions.reloadTab()
        }
    }
});

step("Confirm sale", async function () {
    await waitFor(async () => (await text("Confirm Sale").exists()))
    await click("Confirm Sale");
    await waitFor(async () => (await text("Quotation confirmed").exists()))
    assert.ok(await text("Quotation confirmed").exists());
});

step("Goto Odoo", async function () {
    await goto(process.env.odooURL, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Click Quotations", async function () {
    await click("Quotations", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
});