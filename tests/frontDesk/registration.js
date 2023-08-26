const {
    $,
    dropDown,
    button,
    within,
    highlight,
    toRightOf,
    write,
    goto,
    above,
    click,
    checkBox,
    toLeftOf,
    text,
    into,
    textBox,
    waitFor,
    confirm,
    accept,
    scrollDown,
    link,
    below,
    press,
    scrollTo,
    reload,
    timeField,
    attach,
    fileField,
    switchTo,
    title,
    closeBrowser,
    doubleClick
} = require('taiko');
var users = require("../util/users");
var date = require("../util/date");
const taikoHelper = require("../util/taikoHelper")
const { faker } = require('@faker-js/faker/locale/en_IND');
const alert=require("../../../components/taikoalert")
var assert = require("assert");
const { closeTab } = require('taiko');
const { ClientRequest } = require('http');

step("Open <moduleName> module", async function (moduleName) {
    await waitFor(async () => (await link("Registration").exists()),{timeout: process.env.actionTimeout, interval: 1000})
    await scrollTo(moduleName)
    await click(moduleName, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Click on <type> patient",async function(type){
    if("cure"==type)
    {
        await taikoHelper.repeatUntilNotFound($("#overlay"))
        await waitFor(async () => (button("Save")).exists())
        await waitFor(3000)
        await taikoHelper.repeatUntilNotFound($("#overlay"))
        await click($('input#pre-registration-attribute'))
    }
})
step("Enter patient random first name", async function () {
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    var patientGender = users.getRandomPatientGender();
    if (!firstName) {
        firstName = faker.name.firstName(patientGender).replace(" ", "");
        gauge.dataStore.scenarioStore.put("patientFirstName", firstName)
    }
    gauge.message(`firstName ${firstName}`)
    await write(firstName, into(textBox({ "placeholder": "First Name" })));
});

step("Enter patient random middle name", async function () {
    var middleName = gauge.dataStore.scenarioStore.get("patientMiddleName")
    var patientGender = users.getRandomPatientGender()
    if (!middleName) {
        middleName = faker.name.middleName(patientGender).replace(" ", "");
        gauge.dataStore.scenarioStore.put("patientMiddleName", middleName)
    }
    gauge.message(`middleName ${middleName}`)
    await write(middleName, into(textBox({ "placeholder": "Middle Name" })));
});

step("Enter patient random last name", async function () {
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    var middleName = gauge.dataStore.scenarioStore.get("patientMiddleName")
    var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
    var patientGender = users.getRandomPatientGender()
    if (!lastName) {
        lastName = faker.name.lastName(patientGender).replace(" ", "");
        gauge.dataStore.scenarioStore.put("patientLastName", lastName)
    }
    gauge.message(`lastName ${lastName}`)
    gauge.dataStore.scenarioStore.put("patientFullName", `${firstName} ${middleName} ${lastName}`)
    await write(lastName, into(textBox({ "placeholder": "Last Name" })));
});

step("Enter patient gender <gender>", async function (gender) {
    if (gauge.dataStore.scenarioStore.get("isNewPatient"))
        await dropDown("Gender *").select(gender);
    gauge.dataStore.scenarioStore.put("patientGender", gender)
});

step("Enter age of the patient <age>", async function (age) {
    if (gauge.dataStore.scenarioStore.get("isNewPatient")) {
        await write(age, into(textBox(toRightOf("Years"))));
        await click(checkBox(toLeftOf("Estimated")));
    }
    gauge.dataStore.scenarioStore.put("patientAge", age)
    var birthDate = await timeField(toRightOf("Date of Birth")).value();
    gauge.dataStore.scenarioStore.put("patientBirthYear", birthDate.split("-")[0])
});

step("Enter patient mobile number <mobile>", async function (mobile) {
    if (await text("Primary Contact").exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get("isNewPatient"))
            await write(mobile, into(textBox(toRightOf("Primary Contact"))));
    }
    else if (await text("Phone Number").exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get("isNewPatient"))
            await write(mobile, into(textBox(toRightOf("Phone Number"))));
    }
    gauge.dataStore.scenarioStore.put("patientMobileNumber", mobile)
});

step("Enter patient random gender", async function () {
    if (gauge.dataStore.scenarioStore.get("isNewPatient"))
        await dropDown("Gender *").select(users.getRandomPatientGender());
    gauge.dataStore.scenarioStore.put("patientGender", users.getRandomPatientGender())
    gauge.message(`patientGender ${users.getRandomPatientGender()}`)
});

step("Enter random age of the patient", async function () {
    var age = faker.random.numeric(2);
    if (gauge.dataStore.scenarioStore.get("isNewPatient")) {
        await write(age, into(textBox(toRightOf("Years"))));
        await click(checkBox(toLeftOf("Estimated")));
    }
    gauge.dataStore.scenarioStore.put("patientAge", age)
    var birthDate = await timeField(toRightOf("Date of Birth")).value();
    gauge.dataStore.scenarioStore.put("patientBirthYear", birthDate.split("-")[0])
    gauge.message(`age ${age}`)
});

step("Enter patient random mobile number", async function () {
    var mobile = faker.phone.number('+919#########')
    if (await text("Primary Contact").exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get("isNewPatient"))
            await write(mobile, into(textBox(toRightOf("Primary Contact"))));
    }
    else if (await text("Phone Number").exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get("isNewPatient"))
            await write(mobile, into(textBox(toRightOf("Phone Number"))));
    }
    else if (await text("Mobile Phone").exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get("isNewPatient"))
            await write(mobile, into(textBox(toRightOf("Mobile Phone"))));
    }
    gauge.dataStore.scenarioStore.put("patientMobileNumber", mobile)
    gauge.message(`mobile ${mobile}`)
});

step("Click create new patient", async function () {
    await waitFor(2000)
    //   await click(link("Create New"),{waitForNavigation:true,waitForEvents:['networkIdle'],navigationTimeout:process.env.actionTimeout})
    await click(link("Create New"), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    gauge.dataStore.scenarioStore.put("isNewPatient", true)
});

step("Save the patient data", async function () {
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await click("Save", { navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await taikoHelper.repeatUntilFound($("#patientIdentifierValue"))
    var patientIdentifier = await $('#patientIdentifierValue').text();
    gauge.dataStore.scenarioStore.put("patientIdentifier", patientIdentifier);
    console.log(`patient Identifier ${patientIdentifier}`)
    gauge.message(`patient Identifier ${patientIdentifier}`)
});

step("Select the newly created patient", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue)
    await press('Enter', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
})

step(["Log out if still logged in", "Receptionist logs out"], async function () {
    while (await $('.back-btn').exists(0, 0)) {
        await taikoHelper.repeatUntilNotFound($("#overlay"))
        await click($('.back-btn'), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
        await taikoHelper.repeatUntilNotFound($("#overlay"))
    }

    try {
        await highlight($(".btn-user-info"))
        await click($(".btn-user-info"))
        await click('Logout', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
        await taikoHelper.repeatUntilNotFound($("#overlay"))
    } catch (e) {
        gauge.message(e.message)
    }
})

step("Login as user <user> with location <location>", async function (user, location) {
    if (!textBox(toRightOf("Username")).exists(0, 0)) {
        await reload()
    }
    await write(users.getUserNameFromEncoding(process.env[user]), into(textBox(toRightOf("Username"))));
    await write(users.getPasswordFromEncoding(process.env[user]), into(textBox(toRightOf("Password"))));
    await dropDown("Location").select(location);
    await click(button("Login"), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound(text("BAHMNI EMR LOGIN"))
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Login as user <user>", async function (user) {
    if (!textBox(toRightOf("Username")).exists(0, 0)) {
        await reload()
    }
    await write(users.getUserNameFromEncoding(process.env[user]), into(textBox(toRightOf("Username"))));
    await write(users.getPasswordFromEncoding(process.env[user]), into(textBox(toRightOf("Password"))));
    await dropDown("Location").select(process.env.loginLocation);
    await click(button("Login"), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound(text("BAHMNI EMR LOGIN"))
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Check login <location>", async function (location) {
    try {
        await taikoHelper.repeatUntilNotFound($("#overlay"))
        if (await await button({ "class": "btn-user-info" }).exists()) {
            await click(button({ "class": "btn-user-info" }))
            await click('Logout', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
            await taikoHelper.repeatUntilNotFound($("#overlay"))
        }
        await write(users.getUserNameFromEncoding(process.env.receptionist), into(textBox({ placeholder: "Enter your username" })));
        await write(users.getPasswordFromEncoding(process.env.receptionist), into(textBox({ placeholder: "Enter your password" })));
        await dropDown("Location").select(location);
        await click(button("Login"), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
        await taikoHelper.repeatUntilNotFound(text("BAHMNI EMR LOGIN"))
        await taikoHelper.repeatUntilNotFound($("#overlay"))
    }
    catch (err) { }
});

step("Enter registration fees <arg0>", async function (arg0) {
    if (await $("//*[text()='Registration Fee']/following::input[@type='number']").exists(500, 2000)) {
        await write("100", into(textBox(toRightOf("Registration Fee"))));
    }
});

step("Click back button", async function () {
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await waitFor(async () => (await $('.back-btn').exists()),{timeout: process.env.actionTimeout, interval: 1000})
    await click($('.back-btn'), { force: true, waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Click back button next to Create new", async function () {
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await highlight($(".back-btn"), toLeftOf(link("Create New")));
    await click($(".back-btn"), toLeftOf(link("Create New")));
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});
step("Enter visit details", async function () {
    await scrollTo(button("Enter Visit page Details"))
    await highlight(button("Enter Visit page Details"))
    await click(button("Enter Visit page Details"), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Close visit", async function () {
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await waitFor(async () => (await text('Close Visit').exists()),{timeout: 5000, interval: 1000})
    await scrollTo(button("Close Visit"))
    await highlight(button("Close Visit"))
    await click(button("Close Visit"), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await waitFor(2000)
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await waitFor(2000)
    await switchTo(/OPD/)
});

step("Click on home page and goto registration module", async function () {
    await click($('.back-btn'), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await click('Registration', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Click on home page", async function () {
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await click($('//i[@class="fa fa-home"]'), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Click on active patients list", async function () {
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await goto(process.env.bahmniActivePatientList)
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Open newly created patient details by search", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");

    console.log(`patient Identifier ${patientIdentifierValue}`)
    gauge.message(`patient Identifier ${patientIdentifierValue}`)

    await write(patientIdentifierValue, into($('input#registrationNumber')))
    await press('Enter', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))

if(await link(patientIdentifierValue).exists()){ await click(link(patientIdentifierValue), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })}       

});

step("Verify correct patient form is open", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    assert.ok(await text(patientIdentifierValue).exists());
});

step("Enter random village", async function () {
    var village = faker.address.cityName();
    if (gauge.dataStore.scenarioStore.get("isNewPatient"))
        await write(village, into(textBox(toRightOf("Village"))))
    gauge.message(`village ${village}`)

});

step("Check if patient <firstName> <middleName> <lastName> with mobile <mobileNumber> exists", async function (firstName, middleName, lastName, arg2) {
    await write(`${firstName} ${middleName} ${lastName}`, into(textBox({ "placeholder": "Enter Name" })));
    await press("Enter");
});

step("Should fetch record with similar details", async function () {
    throw 'Unimplemented Step';
});

step("Save the newly created patient data", async function () {
    if (gauge.dataStore.scenarioStore.get("isNewPatient")) {
        await click("Save", { waitForEvents: ['networkIdle'] });
        await taikoHelper.repeatUntilNotFound($("#overlay"))
    }
    var patientIdentifier = await $('#patientIdentifierValue').text();
    gauge.dataStore.scenarioStore.put("patientIdentifier", patientIdentifier);
});

step("Click create new patient if patient does not exist", async function () {
    if (await text("No results found").exists()) {
        await waitFor(2000)
        await click(link("Create New"), { waitForNavigation: true, waitForEvents: ['networkIdle'], navigationTimeout: process.env.actionTimeout })
        gauge.dataStore.scenarioStore.put("isNewPatient", true)
        await taikoHelper.repeatUntilNotFound($("#overlay"))
    }
    else
        await click(link(below("ID")))
});

step("Enter patient first name <firstName>", async function (firstName) {
    if (gauge.dataStore.scenarioStore.get("isNewPatient")) {
        await write(firstName, into(textBox({ "placeholder": "First Name" })));
    }
    gauge.message(`firstName ${firstName}`)
    gauge.dataStore.scenarioStore.put("patientFirstName", firstName)
});

step("Enter patient middle name <middleName>", async function (middleName) {
    if (gauge.dataStore.scenarioStore.get("isNewPatient")) {
        await write(middleName, into(textBox({ "placeholder": "Middle Name" })));
    }
    gauge.message(`middleName ${middleName}`)
    gauge.dataStore.scenarioStore.put("patientMiddleName", middleName)
});

step("Enter patient last name <lastName>", async function (lastName) {
    if (gauge.dataStore.scenarioStore.get("isNewPatient")) {
        await write(lastName, into(textBox({ "placeholder": "Last Name" })));
    }
    gauge.message(`lastName ${lastName}`)
    gauge.dataStore.scenarioStore.put("patientLastName", lastName)
});

step("Should display Bahmni record with firstName <firstName> lastName <lastName> gender <gender> age <age> with mobile number <mobileNumber>", async function (firstName, lastName, gender, age, mobileNumber) {
    assert.ok(async () => (await $("Bahmni").exists()))
    assert.ok(await (await text(`${firstName} ${lastName}`, below("Bahmni"), toRightOf("Name"))).exists())
    assert.ok(await (await text(gender, below("Bahmni"), toRightOf("Gender"))).exists())
    var _yearOfBirth = date.getDateYearsAgo(age)
    var yearOfBirth = _yearOfBirth.getFullYear();
    assert.ok(await (await text(yearOfBirth.toString(), below("Bahmni"), toRightOf("Year Of Birth"))).exists())
    assert.ok(await (await text(mobileNumber, below("Bahmni"), toRightOf("Phone"))).exists())
});

step("wait for <timeInMilliSeconds>", async function (timeInMilliSeconds) {
    await waitFor(timeInMilliSeconds)
});

step("Choose newly created patient", async function () {
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    var lastName = gauge.dataStore.scenarioStore.get("patientLastName")

    await write(firstName);
    await click(`${firstName} ${lastName}`, {
        waitForNavigation: true,
        navigationTimeout: process.env.actionTimeout
    })
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("wait for create new button", async function () {
    await waitFor(link("Create New"))
});

step("Open Patient ADT page",async function(){
    await taikoHelper.repeatUntilFound(link('Patient ADT Page'))
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await click('Patient ADT Page', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await waitFor(4000)
    await reload()
    await switchTo(/ADT/)
}
)

step("Open Visit attributes",async function()
{
    await taikoHelper.repeatUntilFound(link('Visit Attributes'))
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await click('Visit Attributes', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await waitFor(4000)
    await reload()
    await switchTo(/Patient Registration/)
})
step("Confirm if you want to close the visit", async function () {
    await taikoHelper.repeatUntilNotFound($("#overlay"))
    await confirm('Are you sure you want to close this visit?', async () => await accept())
});

step("Upload patient image", async function () {
    await click($('[ng-click="launchPhotoUploadPopup()"]'))
    await attach(await users.downloadAndReturnImage(), fileField({ "class": "fileUpload" }));
    await click(button("Confirm Photo"))
});

step("Enter random kebele", async function () {
    await users.randomZipCodeStateAndDistrict();
    var kebele = gauge.dataStore.scenarioStore.get("kebele")
    await write(kebele, into(textBox(toRightOf("Kebele"))));
    gauge.message(`kebele ${kebele}`)
});

step("Enter random Woreda", async function () {
    var woreda =  gauge.dataStore.scenarioStore.get("woreda")
    await write(woreda, into(textBox(toRightOf("Woreda"))));
    gauge.message(`wordea ${woreda}`)
    await click(link(woreda))
});


step("Enter random email address", async function () {
    var emailAddress = faker.internet.email()
    await write(emailAddress, into(textBox(toRightOf("Email"))));
    gauge.message(`emailAddress ${emailAddress}`)
});

step("Select registration location",async function(){
    var location=process.env.Registration_location
    await dropDown(toRightOf("Registration Location")).select(location);
})

step("click on Relationships", async function () {
await click(text("Relationships"))
})

step("Select the RelationType as <type>", async function (type) {
    await dropDown(below("Relationships")).select(type);
})

step("Click on select person", async function () {
    await click(text("Select Person"))
})

step("Create a new relation", async function () {
    await click(text("Register New Person"))
    await waitFor(2000)
    var firstName = users.randomName(8)
    gauge.message(`Relation firstName ${firstName}`)
    await write(firstName, into($("//input[@name='firstName']")))
    var lastName = users.randomName(8)
    gauge.message(`Relation lastName ${lastName}`)
    gauge.dataStore.scenarioStore.put("relationName", firstName+' '+lastName)
    await write(lastName, into($("//input[@name='lastName']")))
    await write('01/01/1970', into($('//input[@name="birthdate"]')))
    await dropDown(below("Gender")).select('Male');
    await write(firstName, into(textBox(below("First name"))))
    await click(text("Register"))
})

step('Click on the newly added relation',async function(){
    var relationName=gauge.dataStore.scenarioStore.get("relationName")
    await click(text(relationName))
})

step('Add the phone number',async function(){
    await waitFor(2000)
    var phoneNumber=faker.phone.number('+919#########')
    await write(phoneNumber,into($('//input[@name="mobilePhone"]')))
})

step('Update the relation',async function(){
    await click(text("Update"))
})