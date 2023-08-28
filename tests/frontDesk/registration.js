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
var update='Update'
var phoneNumberValue='//input[@name="mobilePhone"]'
var registration='Registration'
var overlay='#overlay'
var save='Save'
var prePatientCheckbox='input#pre-registration-attribute'
var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
var middleName = gauge.dataStore.scenarioStore.get("patientMiddleName")
var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
var patientGender = users.getRandomPatientGender();
var years='Years'
var isNewPatient='isNewPatient'
var estimated='Estimated'
var dob='Date of Birth'
var primaryContact='Primary Contact'
var phoneNumber='Phone Number'
var years='Years'
var mobilePhone='Mobile Phone'
var createNew='Create New'
var patientIdValue='#patientIdentifierValue'
var enter='Enter'
var backBtn='.back-btn'
var userInfo='.btn-user-info'
var login='Login'
var logout='Logout'
var userName='Username'
var passWord='password'
var locationDropDown='Location'
var loginText='BAHMNI EMR LOGIN'
var fee='//*[text()="Registration Fee"]/following::input[@type="number"]'
var registrationFee='Registration Fee'
var createNew='Create New'
var enterVisitDetails='Enter Visit page Details'
var closeVisit='Close Visit'
var registration='Registration'
var homeBtn='//i[@class="fa fa-home"]'
var activePatientList=process.env.bahmniActivePatientList
var inputRegistrationNumber='input#registrationNumber'
var village='Village'
var idElement='#patientIdentifierValue'
var noResultsFound='No results found'
var id='ID'
var bahmni='Bahmni'
var name='Name'
var gender='Gender'
var phone='Phone'
var yob='Year Of Birth'
var patientADTpage='Patient ADT Page'
var visitAttributes='Visit Attributes'
var closePopupText='Are you sure you want to close this visit?'
var uploadPopup='[ng-click="launchPhotoUploadPopup()"]'
var confirmPhoto='Confirm Photo'
var kebele = gauge.dataStore.scenarioStore.get("kebele")
var woreda =  gauge.dataStore.scenarioStore.get("woreda")
var kebeleElement='Kebele'
var worderElement='Woreda'
var email='Email'
var registratioDropDown='Registration Location'
var location=process.env.Registration_location
var emailAddress = faker.internet.email()
var relationShips='Relationships'
var selectPerson='Select Person'
var registerNewPerson='Register New Person'
var register='Register'
var relationName=gauge.dataStore.scenarioStore.get("relationName")

step("Open <moduleName> module", async function (moduleName) {
    await waitFor(async () => (await link(registration).exists()),{timeout: process.env.actionTimeout, interval: 1000})
    await scrollTo(moduleName)
    await click(moduleName, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click on <type> patient",async function(type){
    if("cure"==type)
    {
        await taikoHelper.repeatUntilNotFound($(overlay))
        await waitFor(async () => (button(save)).exists())
        await waitFor(3000)
        await taikoHelper.repeatUntilNotFound($(overlay))
        await click($(prePatientCheckbox))
    }
})


step("Enter patient random first name", async function () {
    if (!firstName) {
        firstName = faker.name.firstName(patientGender).replace(" ", "");
        gauge.dataStore.scenarioStore.put("patientFirstName", firstName)
    }
    gauge.message(`firstName ${firstName}`)
    await write(firstName, into(textBox({ "placeholder": "First Name" })));
});

step("Enter patient random middle name", async function () {
    if (!middleName) {
        middleName = faker.name.middleName(patientGender).replace(" ", "");
        gauge.dataStore.scenarioStore.put("patientMiddleName", middleName)
    }
    gauge.message(`middleName ${middleName}`)
    await write(middleName, into(textBox({ "placeholder": "Middle Name" })));
});

step("Enter patient random last name", async function () {
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
    if (gauge.dataStore.scenarioStore.get(isNewPatient)) {
        await write(age, into(textBox(toRightOf(years))));
        await click(checkBox(toLeftOf(estimated)));
    }
    gauge.dataStore.scenarioStore.put("patientAge", age)
    var birthDate = await timeField(toRightOf(dob)).value();
    gauge.dataStore.scenarioStore.put("patientBirthYear", birthDate.split("-")[0])
});

step("Enter patient mobile number <mobile>", async function (mobile) {
    if (await text(primaryContact).exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get(isNewPatient))
            await write(mobile, into(textBox(toRightOf(primaryContact))));
    }
    else if (await text(phoneNumber).exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get(isNewPatient))
            await write(mobile, into(textBox(toRightOf(phoneNumber))));
    }
    gauge.dataStore.scenarioStore.put("patientMobileNumber", mobile)
});

step("Enter patient random gender", async function () {
    if (gauge.dataStore.scenarioStore.get(isNewPatient))
        await dropDown("Gender *").select(users.getRandomPatientGender());
    gauge.dataStore.scenarioStore.put("patientGender", users.getRandomPatientGender())
    gauge.message(`patientGender ${users.getRandomPatientGender()}`)
});

step("Enter random age of the patient", async function () {
    var age = faker.random.numeric(2);
    if (gauge.dataStore.scenarioStore.get(isNewPatient)) {
        await write(age, into(textBox(toRightOf(years))));
        await click(checkBox(toLeftOf(estimated)));
    }
    gauge.dataStore.scenarioStore.put("patientAge", age)
    var birthDate = await timeField(toRightOf(dob)).value();
    gauge.dataStore.scenarioStore.put("patientBirthYear", birthDate.split("-")[0])
    gauge.message(`age ${age}`)
});

step("Enter patient random mobile number", async function () {
    var mobile = faker.phone.number('+919#########')
    if (await text(primaryContact).exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get(isNewPatient))
            await write(mobile, into(textBox(toRightOf(primaryContact))));
    }
    else if (await text(phoneNumber).exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get(isNewPatient))
            await write(mobile, into(textBox(toRightOf(phoneNumber))));
    }
    else if (await text(mobilePhone).exists(500, 1000)) {
        if (gauge.dataStore.scenarioStore.get(isNewPatient))
            await write(mobile, into(textBox(toRightOf(mobilePhone))));
    }
    gauge.dataStore.scenarioStore.put("patientMobileNumber", mobile)
    gauge.message(`mobile ${mobile}`)
});

step("Click create new patient", async function () {
    await waitFor(2000)
    await click(link(createNew), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($(overlay))
    gauge.dataStore.scenarioStore.put(isNewPatient, true)
});

step("Save the patient data", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await click(save, { navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoHelper.repeatUntilFound($(patientIdValue))
    var patientIdentifier = await $(patientIdValue).text();
    gauge.dataStore.scenarioStore.put("patientIdentifier", patientIdentifier);
    console.log(`patient Identifier ${patientIdentifier}`)
    gauge.message(`patient Identifier ${patientIdentifier}`)
});

step("Select the newly created patient", async function () {
    await write(patientIdentifierValue)
    await press(enter, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))
})

step(["Log out if still logged in", "Receptionist logs out"], async function () {
    while (await $(backBtn).exists(0, 0)) {
        await taikoHelper.repeatUntilNotFound($(overlay))
        await click($(backBtn), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
        await taikoHelper.repeatUntilNotFound($(overlay))
    }

    try {
        await highlight($(userInfo))
        await click($(userInfo))
        await click(logout, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
        await taikoHelper.repeatUntilNotFound($(overlay))
    } catch (e) {
        gauge.message(e.message)
    }
})

step("Login as user <user> with location <location>", async function (user, location) {
    if (!textBox(toRightOf(userName)).exists(0, 0)) {
        await reload()
    }
    await write(users.getUserNameFromEncoding(process.env[user]), into(textBox(toRightOf(userName))));
    await write(users.getPasswordFromEncoding(process.env[user]), into(textBox(toRightOf(passWord))));
    await dropDown(locationDropDown).select(location);
    await click(button(login), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound(text(loginText))
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Login as user <user>", async function (user) {
    if (!textBox(toRightOf(userName)).exists(0, 0)) {
        await reload()
    }
    await write(users.getUserNameFromEncoding(process.env[user]), into(textBox(toRightOf(userName))));
    await write(users.getPasswordFromEncoding(process.env[user]), into(textBox(toRightOf(passWord))));
    await dropDown(locationDropDown).select(process.env.loginLocation);
    await click(button(login), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound(text(loginText))
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Check login <location>", async function (location) {
    try {
        await taikoHelper.repeatUntilNotFound($(overlay))
        if (await await button($(userInfo)).exists()) {
            await click(button($(userInfo)))
            await click(logout, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
            await taikoHelper.repeatUntilNotFound($(overlay))
        }
        await write(users.getUserNameFromEncoding(process.env.receptionist), into(textBox({ placeholder: "Enter your username" })));
        await write(users.getPasswordFromEncoding(process.env.receptionist), into(textBox({ placeholder: "Enter your password" })));
        await dropDown(locationDropDown).select(location);
        await click(button(login), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
        await taikoHelper.repeatUntilNotFound(text(loginText))
        await taikoHelper.repeatUntilNotFound($(overlay))
    }
    catch (err) { }
});


step("Enter registration fees <arg0>", async function (arg0) {
    if (await $(fee).exists(500, 2000)) {
        await write("100", into(textBox(toRightOf(registrationFee))));
    }
});

step("Click back button", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await waitFor(async () => (await $(backBtn).exists()),{timeout: process.env.actionTimeout, interval: 1000})
    await click($(backBtn), { force: true, waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click back button next to Create new", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await highlight($(backBtn), toLeftOf(link(createNew)));
    await click($(backBtn), toLeftOf(link(createNew)));
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Enter visit details", async function () {
    await scrollTo(button(enterVisitDetails))
    await highlight(button(enterVisitDetails))
    await click(button(enterVisitDetails), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Close visit", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await waitFor(async () => (await text(closeVisit).exists()),{timeout: 5000, interval: 1000})
    await scrollTo(button(closeVisit))
    await highlight(button(closeVisit))
    await click(button(closeVisit), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await waitFor(2000)
    await taikoHelper.repeatUntilNotFound($(overlay))
    await waitFor(2000)
    await switchTo(/OPD/)
});


step("Click on home page and goto registration module", async function () {
    await click($(backBtn), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))
    await click(registration, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click on home page", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await click($(homeBtn), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click on active patients list", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await goto(activePatientList)
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Open newly created patient details by search", async function () {

    console.log(`patient Identifier ${patientIdentifierValue}`)
    gauge.message(`patient Identifier ${patientIdentifierValue}`)

    await write(patientIdentifierValue, into($(inputRegistrationNumber)))
    await press(enter, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($(overlay))

if(await link(patientIdentifierValue).exists()){ await click(link(patientIdentifierValue), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })}       

});

step("Verify correct patient form is open", async function () {
    assert.ok(await text(patientIdentifierValue).exists());
});

step("Enter random village", async function () {
    var villageValue = faker.address.cityName();
    if (gauge.dataStore.scenarioStore.get(isNewPatient))
        await write(villageValue, into(textBox(toRightOf(village))))
    gauge.message(`village ${villageValue}`)

});

step("Check if patient <firstName> <middleName> <lastName> with mobile <mobileNumber> exists", async function (firstName, middleName, lastName, arg2) {
    await write(`${firstName} ${middleName} ${lastName}`, into(textBox({ "placeholder": "Enter Name" })));
    await press(enter);
});

step("Should fetch record with similar details", async function () {
    throw 'Unimplemented Step';
});

step("Save the newly created patient data", async function () {
    if (gauge.dataStore.scenarioStore.get(isNewPatient)) {
        await click(save, { waitForEvents: ['networkIdle'] });
        await taikoHelper.repeatUntilNotFound($(overlay))
    }
    var patientIdentifier = await $(idElement).text();
    gauge.dataStore.scenarioStore.put("patientIdentifier", patientIdentifier);
});

step("Click create new patient if patient does not exist", async function () {
    if (await text(noResultsFound).exists()) {
        await waitFor(2000)
        await click(link(createNew), { waitForNavigation: true, waitForEvents: ['networkIdle'], navigationTimeout: process.env.actionTimeout })
        gauge.dataStore.scenarioStore.put(isNewPatient, true)
        await taikoHelper.repeatUntilNotFound($(overlay))
    }
    else
        await click(link(below(id)))
});

step("Enter patient first name <firstName>", async function (firstName) {
    if (gauge.dataStore.scenarioStore.get(isNewPatient)) {
        await write(firstName, into(textBox({ "placeholder": "First Name" })));
    }
    gauge.message(`firstName ${firstName}`)
    gauge.dataStore.scenarioStore.put("patientFirstName", firstName)
});

step("Enter patient middle name <middleName>", async function (middleName) {
    if (gauge.dataStore.scenarioStore.get(isNewPatient)) {
        await write(middleName, into(textBox({ "placeholder": "Middle Name" })));
    }
    gauge.message(`middleName ${middleName}`)
    gauge.dataStore.scenarioStore.put("patientMiddleName", middleName)
});

step("Enter patient last name <lastName>", async function (lastName) {
    if (gauge.dataStore.scenarioStore.get(isNewPatient)) {
        await write(lastName, into(textBox({ "placeholder": "Last Name" })));
    }
    gauge.message(`lastName ${lastName}`)
    gauge.dataStore.scenarioStore.put("patientLastName", lastName)
});

step("Should display Bahmni record with firstName <firstName> lastName <lastName> gender <gender> age <age> with mobile number <mobileNumber>", async function (firstName, lastName, gender, age, mobileNumber) {
    assert.ok(async () => (await $(bahmni).exists()))
    assert.ok(await (await text(`${firstName} ${lastName}`, below(bahmni), toRightOf(name))).exists())
    assert.ok(await (await text(gender, below(bahmni), toRightOf(gender))).exists())
    var _yearOfBirth = date.getDateYearsAgo(age)
    var yearOfBirth = _yearOfBirth.getFullYear();
    assert.ok(await (await text(yearOfBirth.toString(), below(bahmni), toRightOf(yob))).exists())
    assert.ok(await (await text(mobileNumber, below(bahmni), toRightOf(phone))).exists())
});

step("wait for <timeInMilliSeconds>", async function (timeInMilliSeconds) {
    await waitFor(timeInMilliSeconds)
});

step("Choose newly created patient", async function () {
    await write(firstName);
    await click(`${firstName} ${lastName}`, {
        waitForNavigation: true,
        navigationTimeout: process.env.actionTimeout
    })
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("wait for create new button", async function () {
    await waitFor(link(createNew))
});

step("Open Patient ADT page",async function(){
    await taikoHelper.repeatUntilFound(link(patientADTpage))
    await taikoHelper.repeatUntilNotFound($(overlay))
    await click(patientADTpage, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await waitFor(4000)
    await reload()
    await switchTo(/ADT/)
}
)

step("Open Visit attributes",async function()
{
    await taikoHelper.repeatUntilFound(link(visitAttributes))
    await taikoHelper.repeatUntilNotFound($(overlay))
    await click(visitAttributes, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
    await waitFor(4000)
    await reload()
    await switchTo(/Patient Registration/)
})

step("Confirm if you want to close the visit", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await confirm(closePopupText, async () => await accept())
});


step("Upload patient image", async function () {
    await click($(uploadPopup))
    await attach(await users.downloadAndReturnImage(), fileField({ "class": "fileUpload" }));
    await click(button(confirmPhoto))
});

step("Enter random kebele", async function () {
    await users.randomZipCodeStateAndDistrict();
    await write(kebele, into(textBox(toRightOf(kebeleElement))));
    gauge.message(`kebele ${kebele}`)
});

step("Enter random Woreda", async function () {
    await write(woreda, into(textBox(toRightOf(worderElement))));
    gauge.message(`wordea ${woreda}`)
    await click(link(woreda))
});

step("Enter random email address", async function () {
    await write(emailAddress, into(textBox(toRightOf(email))));
    gauge.message(`emailAddress ${emailAddress}`)
});

step("Select registration location",async function(){
    await dropDown(toRightOf(registratioDropDown)).select(location);
})

step("click on Relationships", async function () {
await click(text(relationShips))
})

step("Select the RelationType as <type>", async function (type) {
    await dropDown(below(relationShips)).select(type);
})

step("Click on select person", async function () {
    await click(text(selectPerson))
})

step("Create a new relation", async function () {
    await click(text(registerNewPerson))
    await waitFor(2000)
    var firstName = users.randomName(8)
    gauge.message(`Relation firstName ${firstName}`)
    await write(firstName, into($("//input[@name='firstName']")))
    var lastName = users.randomName(8)
    gauge.message(`Relation lastName ${lastName}`)
    gauge.dataStore.scenarioStore.put("relationName", firstName+' '+lastName)
    await write(lastName, into($("//input[@name='lastName']")))
    await write('01/01/1970', into($('//input[@name="birthdate"]')))
    await dropDown(below(gender)).select('Male');
    await write(firstName, into(textBox(below("First name"))))
    await click(text(register))
})

step('Click on the newly added relation',async function(){
    await click(text(relationName))
})

step('Add the phone number',async function(){
    await waitFor(2000)
    var phoneNumber=faker.phone.number('+919#########')
    await write(phoneNumber,into($(phoneNumberValue)))
})

step('Update the relation',async function(){
    await click(text(update))
})

