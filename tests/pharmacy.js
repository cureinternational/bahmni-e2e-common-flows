const { click, below } = require("taiko");
const gaugeHelper = require("./util/gaugeHelper");

step("Mark the drug as dispensible", async function() {
    var drugName = gaugeHelper.get("Drug Name")
    await click(drugName,below("Recent"))
	await click(".dispense-btn");
});