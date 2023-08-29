const { goto, click, waitFor, button, write, evaluate, into, textBox, below, scrollTo, above, toLeftOf, toRightOf, $, text, doubleClick, press, link, client, scrollUp } = require("taiko");
var fileExtension = require("./util/fileExtension")
var assert = require("assert")
var users = require("./util/users");
var fs = require('fs')
var path = require('path')
const console = require("console");
const pdf = require('pdf-parse');
const axios = require('axios')
const gaugeHelper=require("./util/gaugeHelper")

step("Goto paymentlite", async function () {
	await goto(process.env.paymentLiteurl + '/login', { waitForNavigation: true })
});

step("Click Login", async function () {
	await click("Login", { waitForNavigation: true })
});

step("Open Customers", async function () {
	await click("Customers", { waitForNavigation: true })
	await waitFor(async () => (await button("New Customer").exists()))
	await click(button("New Customer"))
	await waitFor("Basic Info")
});

step("Enter patient details in paymentLite", async function () {
	var firstName = gaugeHelper.get("patientFirstName")
	var middleName = gaugeHelper.get("patientMiddleName")
	var lastName = gaugeHelper.get("patientLastName")

	await write(`${firstName} ${middleName} ${lastName}`, into(textBox(below("Display Name"))))
});

step("Select currency as <currency>", async function (currency) {
	await click(textBox(below("Primary Currency")))
	await scrollTo(currency)
	await click(currency)
});

step("Save customer", async function () {
	await click(button("Save customer", { waitForNavigation: true }))
});

step("Click Items", async function () {
	await click("Items", { waitForNavigation: true })
	await waitFor(async () => (await button("Add Item").exists()))
});

step("Add doctor with fees <fees>", async function (fees) {
	var doctorFirstName = gaugeHelper.get("doctorFirstName");
	var doctorMiddleName = gaugeHelper.get("doctorMiddleName");
	var doctorLastName = gaugeHelper.get("doctorLastName");
	if (! await link(`${doctorFirstName} ${doctorMiddleName} ${doctorLastName}`).exists(500, 1000)) {
		await click(button("Add Item"));
		await waitFor("New Item")
		await write(`${doctorFirstName} ${doctorMiddleName} ${doctorLastName}`, into(textBox(below("Name"))))
		await write(fees, into(textBox(below("Price"))))
		await click("Save Item")
	}
});

step("Add a drug with price <price>", async function (price) {
	var prescriptionCount = gaugeHelper.get("prescriptionsCount")
	for (var i = 0; i < prescriptionCount; i++) {
		var prescriptionFile = gaugeHelper.get("prescriptions" + i)
		var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
		var drugName = medicalPrescriptions.drug_name;
		if (! await link(drugName).exists(500, 1000)) {
			await click(button("Add Item"));
			await waitFor("New Item")
			await write(drugName, into(textBox(below("Name"))))
			await write(price + "00", into(textBox(below("Price"))))
			await click("Save Item")
		}
	}
});

step("Click Invoices", async function () {
	await click("Invoices", { waitForNavigation: true })
	await waitFor(async () => (await button("New Invoice").exists()))
});

step("Choose the patient", async function () {
	await waitFor("New Customer")
	await click("New Customer")
	var firstName = gaugeHelper.get("patientFirstName")

	await scrollTo(firstName)
	await waitFor(200)
	await click(firstName)
});

step("Choose the doctor in paymentlite", async function () {
	await click(textBox(above("Add New Item"), below("Items")))
	var doctorFirstName = gaugeHelper.get("doctorFirstName");
	await write(doctorFirstName);
	await waitFor(async () => (await $(`//span[starts-with(text(),'${doctorFirstName}')]`).isVisible()))
	await waitFor(200)
	await evaluate($(`//span[starts-with(text(),'${doctorFirstName}')]`), (el) => el.click())
});


step("Add a new Item", async function () {
	await click("Add New Item")
});

step("Choose the prescibed medicines in paymentlite", async function () {
	var prescriptionCount = gaugeHelper.get("prescriptionsCount")
	for (var i = 0; i < prescriptionCount; i++) {
		await click(textBox(toLeftOf("1", toLeftOf("$ 0.00"))));
		var prescriptionFile = gaugeHelper.get("prescriptions" + i)
		var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
		var drugName = medicalPrescriptions.drug_name;
		await scrollTo("Add New Item")
		await write(drugName);
		await waitFor(async () => (await $(`//span[text()='${drugName}']`).isVisible()))
		await waitFor(200)
		await evaluate($(`//span[text()='${drugName}']`), (el) => el.click())
		if (i < prescriptionCount - 1) {
			await click("Add New Item")
		}
	}
});

step("Save Invoice", async function () {
	await evaluate(button("Save Invoice"), (el) => el.click())
});

step("Click Payments", async function () {
	await click("payments", { waitForNavigation: true })
	await waitFor(async () => (await button("Add Payment").exists()))
	await click("Add Payment")
	await waitFor("New Payment")
});

step("Enter patient name for payment", async function () {
	var firstName = gaugeHelper.get("patientFirstName")
	var middleName = gaugeHelper.get("patientMiddleName")
	var lastName = gaugeHelper.get("patientLastName")

	await write(`${firstName} ${middleName} ${lastName}`, into(textBox(above("Amount"), below("Customer"))))
	await waitFor(async () => (await $(`//span[text()='${firstName} ${middleName} ${lastName}']`).isVisible()))
	await waitFor(200)
	await evaluate($(`//span[text()='${firstName} ${middleName} ${lastName}']`), (el) => el.click())
});

step("Enter amount <amount> the patient is willing to pay", async function (amount) {
	await write(amount, into(textBox(below("Amount"))))
});

step("Select the payment mode as <paymentMode>", async function (paymentMode) {
	await click(textBox(below("Payment Mode")))
	await click(paymentMode)
});

step("Create a new invoice", async function () {
	await click("New Invoice", { waitForNavigation: true })
});

step("Enter Exchange Rate <rate>", async function (rate) {
	await doubleClick(textBox(below("Exchange Rate", above("Enter exchange rate to convert from INR to USD", toRightOf("1 INR =", toLeftOf("USD"))))))
	await write(rate, into(textBox(below("Exchange Rate", above("Enter exchange rate to convert from INR to USD", toRightOf("1 INR =", toLeftOf("USD")))))));
});

step("Click Customers", async function () {
	await click("Customers", { waitForNavigation: true })
});

step("Select customer", async function () {
	let fullName = gaugeHelper.get("patientFullName")
	await click("Customers", { waitForNavigation: true })
	let maxRetry = 5
	while (maxRetry > 0) {
		await waitFor(1000);
		if (await $("//SPAN[@title='" + fullName + "']").exists(500, 1000)) {
			maxRetry = 0
			await click($("//SPAN[@title='" + fullName + "']"));
		}
		else {
			maxRetry = maxRetry - 1;
			assert.ok(maxRetry > 0, "Patient not found in Payment lite. Patient - " + fullName)
			console.log("Waiting for 5 seconds and reload the customers page to wait for Patient - " + fullName + ". Remaining attempts " + maxRetry)
			await waitFor(4000);
			await click("Customers", { waitForNavigation: true })
		}
	}
});

step("Click New Transaction", async function () {
	await click("New Transaction")
});

step("New Payment", async function () {
	await click("New Payment", { waitForNavigation: true })
});

step("Save payment", async function () {
	await click("Save payment", { waitForNavigation: true })
});

step("Goto the tab Draft", async function () {
	await click("Draft", { waitForNavigation: true })
});

step("Goto the tab All", async function () {
	await click("All", { waitForNavigation: true })
});

step("Note the Date", async function () {
	var fullName = gaugeHelper.get("patientFullName")
	var invoiceDate = await evaluate($("//DIV[@title='" + fullName + "']/../preceding::TD[2]"), (element) => element.innerText)
	gaugeHelper.save("invoiceDate", invoiceDate)
});

step("Note the Invoice Number", async function () {
	var fullName = gaugeHelper.get("patientFullName")
	var invoiceNumber = await evaluate($("//DIV[@title='" + fullName + "']/../preceding::TD/A"), (element) => element.innerText)
	gaugeHelper.save("invoiceNumber", invoiceNumber)
});

step("Note the Amount", async function () {
	var fullName = gaugeHelper.get("patientFullName")
	var invoiceAmount = await evaluate($("//DIV[@title='" + fullName + "']/../following::TD[3]/SPAN"), (element) => element.innerText)
	gaugeHelper.save("invoiceAmount", invoiceAmount)
});

step("Associate the invoice to the payment", async function () {
	var invoiceNumber = gaugeHelper.get("invoiceNumber")
	await click($(".bg-multiselect-caret", toRightOf("Select Invoice")))
	await click(invoiceNumber, { waitForNavigation: true })
});

step("open the invoice", async function () {
	var invoiceNumber = gaugeHelper.get("invoiceNumber")
	await click(link(invoiceNumber), { waitForNavigation: true })
});

step("verify the payment is complete", async function () {
	var invoiceNumber = gaugeHelper.get("invoiceNumber")
	assert.ok(await text("COMPLETED", below(invoiceNumber)).exists())
});

step("Add Payment", async function () {
	await click("Add Payment")
});

step("Enter crater Password for <user>", async function (user) {
	await write(users.getPasswordFromEncoding(process.env['paymentLite' + user]), into(textBox(below("Password"))));
});

step("Enter crater Email for <user>", async function (user) {
	await waitFor(async () => (await $("//input[@name='email']")))
	await click($("//input[@name='email']"));
	await write(users.getUserNameFromEncoding(process.env['paymentLite' + user]));
});

step("Click Logout", async function () {
	await click(text('Logout'));
});

step("Click on user menu", async function () {
	await click(button(toRightOf(textBox({ "placeholder": "Search..." }))));
});

step("goto reports in payment lite", async function () {
	await click(link("Reports"), { waitForNavigation: true });
});

step("Validate Report is displayed", async function () {
	await waitFor(async () => (await $("//embed[@type='application/pdf']").exists()))
	assert.ok(await $("//embed[@type='application/pdf']").exists());
});

step("Download the report", async function () {
	var downloadPath = path.resolve(__dirname, '../data', 'downloaded');
	var FilePath = path.join(downloadPath, 'document.pdf');
	fileExtension.removeDir(downloadPath);
	await client().send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: downloadPath,
	});
	await click(button("Download PDF"));
	await waitFor(() => fileExtension.exists(FilePath))
	await waitFor(1000)
	assert.ok(fileExtension.exists(FilePath))
	gaugeHelper.save("pdfReportPath", FilePath)
});

step("Validate the downloaded report", async function () {
	try {
		var firstName = gaugeHelper.get("patientFirstName")
		var middleName = gaugeHelper.get("patientMiddleName")
		var lastName = gaugeHelper.get("patientLastName")
		var invoiceNumber = gaugeHelper.get("invoiceNumber")
		var invoiceAmount = gaugeHelper.get("invoiceAmount").replace(" ", "")
		var invoiceDate = gaugeHelper.get("invoiceDate")
		let dataBuffer = fs.readFileSync(gaugeHelper.get("pdfReportPath"));
		gauge.message(`Invoice - ${invoiceNumber} Amount - ${invoiceAmount} Date - ${invoiceDate}`)
		pdf(dataBuffer).then(function (data) {
			var pdfText = data.text
			assert.ok(pdfText.includes("Sales Report: By Customer"));
			assert.ok(pdfText.includes(`${firstName} ${middleName} ${lastName}\n${invoiceDate} (${invoiceNumber})${invoiceAmount}\n${invoiceAmount}`));
		});
	}
	catch (e) {
		console.log(e);
		gauge.message(e.message)
	}
});

step("create Login Users for paymentlite", async function () {
	console.log("Creating users if not exists.")
	let company = "1";
	let max_Retry = 3
	while (max_Retry > 0) {
		try {
			await waitFor(1000);
			var loginData = await axios({
				url: process.env.paymentLiteurl + process.env.paymentLiteLogin,
				method: 'post',
				data: {
					"username": users.getUserNameFromEncoding(process.env.paymentLiteAdmin),
					"password": users.getPasswordFromEncoding(process.env.paymentLiteAdmin),
					"device_name": "mobile_app"
				},
				headers: {
					'accept': `application/json`,
					'Content-Type': `application/json`,
					"Company": company
				}
			});

			frontdesk = users.getUserNameFromEncoding(process.env.paymentLiteFrontDesk)
			doctor = users.getUserNameFromEncoding(process.env.paymentLiteDoctor)

			var userData = await axios({
				url: process.env.paymentLiteurl + process.env.paymentLiteListUsers,
				method: 'get',
				headers: {
					'accept': `application/json`,
					'Content-Type': `application/json`,
					'Authorization': `${loginData.data.type} ${loginData.data.token}`,
					"Company": company
				}
			});
			frontDeskData = userData.data.data.filter(users => users.email == frontdesk);
			if (frontDeskData.length == 0) {
				let createFrontDeskUserData = await axios({
					url: process.env.paymentLiteurl + process.env.paymentLiteListUsers,
					method: 'post',
					data: {
						"name": "Front Desk",
						"email": frontdesk,
						"password": users.getPasswordFromEncoding(process.env.paymentLiteFrontDesk),
						"companies": [
							{
								"id": "1",
								"role": "front desk"
							}
						]
					},
					headers: {
						'accept': `application/json`,
						'Content-Type': `application/json`,
						'Authorization': `${loginData.data.type} ${loginData.data.token}`,
						"Company": company
					}
				});
				assert.equal(createFrontDeskUserData.status, 201, "Front Desk user not created.")
			}
			doctorData = userData.data.data.filter(users => users.email == doctor);
			if (doctorData.length == 0) {
				let createDoctorData = await axios({
					url: process.env.paymentLiteurl + process.env.paymentLiteListUsers,
					method: 'post',
					data: {
						"name": "Doctor",
						"email": doctor,
						"password": users.getPasswordFromEncoding(process.env.paymentLiteDoctor),
						"companies": [
							{
								"id": "1",
								"role": "Doctor"
							}
						]
					},
					headers: {
						'accept': `application/json`,
						'Content-Type': `application/json`,
						'Authorization': `${loginData.data.type} ${loginData.data.token}`,
						"Company": company
					}
				});
				assert.equal(createDoctorData.status, 201, "Doctor user not created.")
			}
			max_Retry = 0;
		}
		catch (e) {
			max_Retry = max_Retry - 1
			console.log(e.message);
			console.log("Request to Payment Lite Failed, attempting again after 2 seconds, attempts left - " + max_Retry);
			await waitFor(1000);
		}

	}
});

step("Logout of Payment Lite if logged in", async function () {
	if (await $("//DIV[@placeholder='Search...']/preceding::LI/following-sibling::LI//BUTTON").exists()) {
		gauge.message("User is logged in... Logging out")
		await click(button(toRightOf(textBox({ "placeholder": "Search..." }))));
		await click(text('Logout'));
	} else {
		gauge.message("User is not logged in...")
	}
});