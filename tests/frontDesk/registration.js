const {$,button,toRightOf,toLeftOf,text,link,below,press,timeField,fileField} = require('taiko');
var users = require("../util/users");
const taikoHelper = require("../util/taikoHelper")
const gaugeHelper=require("../util/gaugeHelper")
const { faker } = require('@faker-js/faker/locale/en_IND');
const taikoInteraction=require("../../../components/taikoInteraction.js")
const taikoElement = require('../../../components/taikoElement.js');
const taikobrowserActions = require('../../../components/taikobrowserActions.js');
const taikoAssert = require('../../../components/taikoAssert.js');


var update='Update'
var phoneNumberValue='//input[@name="mobilePhone"]'
var registration='Registration'
var overlay='//div[@id="overlay" and @style="display: block;"]'
var save='Save'
var saveElement ='//button[@type="submit"]'
var prePatientCheckbox='input#pre-registration-attribute'
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
var homeBtn='//a[contains(@class,"back-btn")]/i[@class="fa fa-home"]'
var activePatientList='(//a[contains(@class,"back-btn")]/i[@class="fa fa-users"])[2]'
var activePatientList2='(//a[contains(@class,"back-btn")]/i[@class="fa fa-users"])[1]'
var inputRegistrationNumber='input#registrationNumber'
var inputPatientIdentifier='input#patientIdentifier'
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
var nutrionalPage='Nutritional Values'
var visitAttributes='Visit Attributes'
var closePopupText='Are you sure you want to close this visit?'
var uploadPopup='[ng-click="launchPhotoUploadPopup()"]'
var confirmPhoto='Confirm Photo'
var patientID='Patient ID'
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
var relationFirstNameElement="//input[@name='firstName']"
var relationLastNameElement="//input[@name='lastName']"
var relationBirthDateElement='//input[@name="birthdate"]'
var closeRelationPopup='//div[@class="add-person-iframe"]/child::span[@class="close"]'
var implicitTimeOut=parseInt(process.env.implicitTimeOut)
var relation=process.env.relationName
var relationNameElement='//input[@name="name"]'
var search='Search'
var name='Name'

step("Open <moduleName> module", async function (moduleName) {
    await taikoInteraction.Click(moduleName,'text')
});

step("Click on <type> patient",async function(type){
    if("cure"==type)
    {
        await taikoHelper.repeatUntilNotFound($(overlay))
        await taikoElement.waitToPresent($(prePatientCheckbox))
        await taikoHelper.repeatUntilNotFound($(overlay))
        await taikoInteraction.EvaluateClick($(prePatientCheckbox))
    }
})


step("Enter patient random first name", async function () {
    var firstName = gaugeHelper.get("patientFirstName")
    if (!firstName) {
        firstName = faker.name.firstName(patientGender).replace(" ", "");
        gaugeHelper.save("patientFirstName", firstName)
    }
    gauge.message(`firstName ${firstName}`)
    await taikoInteraction.Write(firstName,'into',{ "placeholder": "First Name" })
});

step("Enter patient random middle name", async function () {
    var middleName = gaugeHelper.get("patientMiddleName")
    if (!middleName) {
        middleName = faker.name.middleName(patientGender).replace(" ", "");
        gaugeHelper.save("patientMiddleName", middleName)
    }
    gauge.message(`middleName ${middleName}`)
    await taikoInteraction.Write(middleName,'into',{ "placeholder": "Middle Name" })
});

step("Enter patient random last name", async function () {
    var firstName = gaugeHelper.get("patientFirstName")
    var lastName = gaugeHelper.get("patientLastName")
    var middleName = gaugeHelper.get("patientMiddleName")
    if (!lastName) {
        lastName = faker.name.lastName(patientGender).replace(" ", "");
        gaugeHelper.save("patientLastName", lastName)
    }
    gauge.message(`lastName ${lastName}`)
    gaugeHelper.save("patientFullName", `${firstName} ${middleName} ${lastName}`)
    await taikoInteraction.Write(lastName,'into',{ "placeholder": "Last Name" })
});

step("Enter patient gender <gender>", async function (gender) {
    if (gaugeHelper.get("isNewPatient"))
        await taikoInteraction.Dropdown("Gender *",gender)
    gaugeHelper.save("patientGender", gender)
});

step("Enter age of the patient <age>", async function (age) {
    if (gaugeHelper.get(isNewPatient)) 
    {
        await taikoInteraction.Write(age,'into',toRightOf(years))
        await taikoInteraction.Click(estimated,'checkbox')
    }
    gaugeHelper.save("patientAge", age)
    var birthDate = await timeField(toRightOf(dob)).value();
    gaugeHelper.save("patientBirthYear", birthDate.split("-")[0])
});

step("Enter patient mobile number <mobile>", async function (mobile) {
    if (await taikoElement.isExists(text(primaryContact))) 
    {
        if (gaugeHelper.get(isNewPatient))
            await taikoInteraction.Write(mobile,'into',toRightOf(primaryContact))
    }
    else if (await taikoElement.isExists(text(phoneNumber))) {
        if (gaugeHelper.get(isNewPatient))
            await taikoInteraction.Write(mobile,'into',toRightOf(phoneNumber))
    }
    gaugeHelper.save("patientMobileNumber", mobile)
});

step("Enter patient random gender", async function () {
    if (gaugeHelper.get(isNewPatient))
        await taikoInteraction.Dropdown("Gender *",users.getRandomPatientGender())
});

step("Enter random age of the patient", async function () {
    var age = faker.random.numeric(2);
    if (gaugeHelper.get(isNewPatient)) {
        await taikoInteraction.Write(age,'into',toRightOf(years))
        await taikoInteraction.Click(estimated,'checkbox')
    }
    gaugeHelper.save("patientAge", age)
    var birthDate = await timeField(toRightOf(dob)).value();
    gaugeHelper.save("patientBirthYear", birthDate.split("-")[0])
    gauge.message(`age ${age}`)
});

step("Enter patient random mobile number", async function () {
    var mobile = faker.phone.number('+919#########')
    if(await taikoElement.isExists(text(mobilePhone))) {
        if (gaugeHelper.get(isNewPatient))
        await taikoInteraction.Write(mobile,'into',toRightOf(mobilePhone))
    }
    gaugeHelper.save("patientMobileNumber", mobile)
    gauge.message(`mobile ${mobile}`)
});

step("Click create new patient", async function () {
    await taikoInteraction.Click(createNew,'link')
    await taikoHelper.repeatUntilNotFound($(overlay))
    gaugeHelper.save(isNewPatient, true)
});

step("Save the patient data", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoInteraction.Click(save,'text')
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoHelper.repeatUntilFound($(patientIdValue))
    var patientIdentifier = await $(patientIdValue).text();
    gaugeHelper.save("patientIdentifier", patientIdentifier);
    gauge.message(`patient Identifier ${patientIdentifier}`)
});

step("Select the newly created patient", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'into',below(registration))
    await taikoInteraction.pressEnter()
    await taikoHelper.repeatUntilNotFound($(overlay))
})

step("Select the newly created patient from all section", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoInteraction.Write(patientIdentifierValue,'xpath',inputPatientIdentifier)
    await taikoInteraction.pressEnter()
    await taikoHelper.repeatUntilNotFound($(overlay))
})

step(["Log out if still logged in", "Receptionist logs out"], async function () {
    try {
        if(!taikoElement.isExists(text('Registration')))
        {
            taikoInteraction.Click(homeBtn,'xpath')
        }
        await taikoInteraction.Click(userInfo,'xpath')
        await taikoInteraction.Click(logout,'text')
        await taikoHelper.repeatUntilNotFound($(overlay))
    } catch (e) {
        gauge.message(e.message)
    }
})

step("Login as user <user> with location <location>", async function (user, location) {
    await taikoInteraction.Write(users.getUserNameFromEncoding(process.env[user]),'into',toRightOf(userName))
    await taikoInteraction.Write(users.getPasswordFromEncoding(process.env[user]),'into',toRightOf(passWord))
    await taikoInteraction.Dropdown(locationDropDown,location)
    await taikoInteraction.Click(login,'button')
})

step("Login as user <user>", async function (user) {
    await taikoInteraction.Write(users.getUserNameFromEncoding(process.env[user]),"into",toRightOf(userName))
    await taikoInteraction.Write(users.getPasswordFromEncoding(process.env[user]),"into",toRightOf(passWord))
    await taikoInteraction.Dropdown(locationDropDown,process.env.loginLocation)
    await taikoInteraction.Click(login,'button');
});

step("Check login <location>", async function (location) {
    try {
        await taikoHelper.repeatUntilNotFound($(overlay))
        await taikoElement.isPresent($(userInfo))
        if (await taikoElement.isPresent($(userInfo))) {
            await taikoInteraction.Click(userInfo,'xpath')
            await taikoInteraction.Click(logout,'text')
            await taikoHelper.repeatUntilNotFound($(overlay))
        }
        await taikoInteraction.Write(users.getUserNameFromEncoding(process.env[user]),"into",{ placeholder: "Enter your username" })
        await taikoInteraction.Write(users.getPasswordFromEncoding(process.env[user]),"into",{ placeholder: "Enter your password" })
        await taikoInteraction.Dropdown(locationDropDown,location)
        await taikoInteraction.Click(login,'button');
        await taikoHelper.repeatUntilNotFound(text(loginText))
        await taikoHelper.repeatUntilNotFound($(overlay))
    }
    catch (err) { }
});


step("Enter registration fees <arg0>", async function (arg0) {
    await taikoElement.isPresent($(fee))
    if (await taikoElement.isPresent($(fee))) {
        await taikoInteraction.Write('100','into',toRightOf(registrationFee))
    }
});

step("Click back button", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoElement.waitToPresent($(backBtn))
    await taikoInteraction.Click(backBtn,'xpath')
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click back button next to Create new", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoInteraction.Click(backBtn,'xpath',toLeftOf(link(createNew)))
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Enter visit details", async function () {
    await taikoInteraction.Click(enterVisitDetails,'button')
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Close visit", async function () {
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoHelper.wait(implicitTimeOut)
    await taikoInteraction.AlertClick(closeVisit,'button',closePopupText)
    await taikoHelper.wait(implicitTimeOut)
    await taikobrowserActions.switchTab(/default/)
});


step("Click on home page and goto registration module", async function () {
    await taikoInteraction.Click(backBtn,'xpath')
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoInteraction.Click(registration,'text')
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Click on home page", async function () {
    await taikoHelper.wait(implicitTimeOut)
    await taikoInteraction.Click(homeBtn,'xpath')
});

step("Click on active patients list", async function () {
    await taikoHelper.wait(implicitTimeOut)
    if(await taikoElement.isPresent($(activePatientList)))
    {
     await taikoInteraction.Click(activePatientList,'xpath')
    }
    if(await taikoElement.isPresent($(activePatientList2)))
    {
     await taikoInteraction.Click(activePatientList2,'xpath')
    }
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("Open newly created patient details by search", async function () {

    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    gauge.message(`patient Identifier ${patientIdentifierValue}`)
    await taikoInteraction.Write(patientIdentifierValue,'xpath',inputRegistrationNumber)
    await taikoInteraction.pressEnter()
    await taikoHelper.repeatUntilNotFound($(overlay))
if(await taikoElement.isPresent(link(patientIdentifierValue)))
{ 
    await taikoInteraction.Click(patientIdentifierValue,'link')
}       
});

step("Verify correct patient form is open", async function () {
    var patientIdentifierValue = gaugeHelper.get("patientIdentifier");
    await taikoAssert.assertExists(text(patientIdentifierValue))
});

step("Enter random village", async function () {
    var villageValue = faker.address.cityName();
    if (gaugeHelper.get(isNewPatient))
        await taikoInteraction.Write(villageValue,'into',toRightOf(village))
    gauge.message(`village ${villageValue}`)

});

step("Check if patient <firstName> <middleName> <lastName> with mobile <mobileNumber> exists", async function (firstName, middleName, lastName, arg2)
{
    await taikoInteraction.Write(`${firstName} ${middleName} ${lastName}`,'into',{ "placeholder": "Enter Name" })
    await press(enter);
});

step("Should fetch record with similar details", async function () {
    throw 'Unimplemented Step';
});

step("Save the newly created patient data", async function () {
    if (gaugeHelper.get(isNewPatient)) {
        await taikoInteraction.Click(save,'text')
        await taikoHelper.repeatUntilNotFound($(overlay))
    }
    var patientIdentifier = await $(idElement).text();
    gaugeHelper.save("patientIdentifier", patientIdentifier);
});

step("Click create new patient if patient does not exist", async function () {
    if (await taikoElement.isExists(text(noResultsFound))) {
        await taikoInteraction.Click(createNew,'link')
        gaugeHelper.save(isNewPatient, true)
        await taikoHelper.repeatUntilNotFound($(overlay))
    }
    else
        await taikoInteraction.Click(id,'link')
});

step("Enter patient first name <firstName>", async function (firstName) {
    if (gaugeHelper.get(isNewPatient)) {
        await taikoInteraction.Write(firstName,'into',{ "placeholder": "First Name" })
    }
    gauge.message(`firstName ${firstName}`)
    gaugeHelper.save("patientFirstName", firstName)
});

step("Enter patient middle name <middleName>", async function (middleName) {
    if (gaugeHelper.get(isNewPatient)) {
        await taikoInteraction.Write(middleName,'into',{ "placeholder": "Middle Name" })
    }
    gauge.message(`middleName ${middleName}`)
    gaugeHelper.save("patientMiddleName", middleName)
});

step("Enter patient last name <lastName>", async function (lastName) {
    if (gaugeHelper.get(isNewPatient)) {
        await taikoInteraction.Write(lastName,'into',{ "placeholder": "Last Name" })
    }
    gauge.message(`lastName ${lastName}`)
    gaugeHelper.save("patientLastName", lastName)
});

step("wait for <timeInMilliSeconds>", async function (timeInMilliSeconds) {
    await taikoHelper.wait(timeInMilliSeconds)
});

step("Choose newly created patient", async function () {
    var firstName = gaugeHelper.get("patientFirstName")
    var lastName = gaugeHelper.get("patientLastName")
    await taikoInteraction.Write(firstName,'xpath',inputPatientIdentifier)
    await taikoInteraction.Click(`${firstName} ${lastName}`,'text')
    await taikoHelper.repeatUntilNotFound($(overlay))
});

step("wait for create new button", async function () {
    await taikoElement.waitToExists(link(createNew))
});

step("Open Patient ADT page",async function(){
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoElement.waitToExists(link(patientADTpage))
    await taikoHelper.wait(2000)
    await taikoInteraction.Click(patientADTpage,'text')
    await taikoHelper.wait(3000)
    await taikobrowserActions.switchTab(/adt/)
    await taikobrowserActions.switchTab(/ADT/)
}
)

step("Open Visit attributes",async function()
{
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoHelper.repeatUntilFound(link(visitAttributes))
    await taikoInteraction.Click(visitAttributes,'text')
    await taikoElement.waitToExists(button(save))
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikobrowserActions.switchTab(/registration/)
    await taikobrowserActions.switchTab(/Patient Registration/)
})
step("Open Nutritional page",async function(){
    await taikoHelper.repeatUntilFound(link(nutrionalPage))
    await taikoHelper.repeatUntilNotFound($(overlay))
    await taikoInteraction.Click(nutrionalPage,'link')
    await taikoHelper.wait(implicitTimeOut)
    await taikobrowserActions.switchTab(/registration/)
    await taikoElement.waitToExists(button(save))

})

step("Confirm if you want to close the visit", async function () {
    await taikobrowserActions.acceptAlert(closePopupText)
});


step("Upload patient image", async function () {
    await taikoInteraction.Click(uploadPopup,'xpath')
    await taikoInteraction.Attach(await users.downloadAndReturnImage(), fileField({ "class": "fileUpload" }));
    await taikoInteraction.Click(confirmPhoto,'button')
});

step("Enter random kebele", async function () {
    await users.randomZipCodeStateAndDistrict();
    var kebele = gaugeHelper.get('kebele')
    await taikoInteraction.Write(kebele,'into',toRightOf(kebeleElement))
});

step("Enter random Woreda", async function () {
    var woreda =  gaugeHelper.get('woreda')
    await taikoInteraction.Write(woreda,'into',toRightOf(worderElement))
    await taikoElement.waitToExists(link(woreda))
    await taikoInteraction.Click(woreda,'link')
});

step("Enter random email address", async function () {
    await taikoInteraction.Write(emailAddress,'into',toRightOf(email))
    gaugeHelper.print("emailAddress", emailAddress)
});

step("Select registration location",async function(){
    await taikoInteraction.Dropdown(toRightOf(registratioDropDown),location)
})

step("click on Relationships", async function () {
    await taikoInteraction.Click(relationShips,'text')
})

step("Select the RelationType as <type>", async function (type) {
    await taikoInteraction.Dropdown(below(relationShips),type)
})

step("Click on select person", async function () {
    await taikoInteraction.Click(selectPerson,'text')
})

step("Create a new relation", async function () {
    await taikoInteraction.Click(registerNewPerson,'text')
    var firstName = users.randomName(8)
    gaugeHelper.print('Relation firstName', firstName)
    await taikoInteraction.Write(firstName,'default',relationFirstNameElement)
    var lastName = users.randomName(8)
    gaugeHelper.save("relationName", firstName+' '+lastName)
    await taikoInteraction.Write(lastName,'default',relationLastNameElement)
    await taikoInteraction.Write('01/01/1980','default',relationBirthDateElement)
    await taikoInteraction.Dropdown(below(gender),'Male')
    await taikoInteraction.Click(register,'text')
    await taikoHelper.wait(1000)
})

step('Click on the newly added relation',async function(){
    var relationName=gaugeHelper.get("relationName")
    await taikoInteraction.Click(relationName,'text')
})

step('Add the phone number',async function(){
    await taikoHelper.wait(2000)
    var phoneNumber=faker.phone.number('+919#########')
    await taikoInteraction.Write(phoneNumber,'default',phoneNumberValue)
})

step("Select the relation",async function(){
    gaugeHelper.save('relationName',relation)
    await taikoInteraction.Write(relation,'xpath',relationNameElement)
    await taikoInteraction.Click(search,'button')
    await taikoInteraction.Click(relation,'text',below(name))
})
step('Update the relation',async function(){
    await taikoInteraction.Click(update,'text')
})

step("Close the relation popup", async function () {
    await taikoInteraction.Click(closeRelationPopup,'xpath')

})

step("Verify the relation is added", async function () {
    var relationName=gaugeHelper.get("relationName")
    await taikoHelper.wait(1000)
    await taikoElement.waitToExists(link(relationName))
})

step("Search the patient by phone number", async function () {
    var phoneNumber=gaugeHelper.get("patientMobileNumber")
    await taikoInteraction.Write(phoneNumber,'below','Phone Number')
    await taikoInteraction.pressEnter()
})

step("Verify the patient present in search results", async function () {
    var patientId=gaugeHelper.get("patientIdentifier")
    await taikoElement.isExists(text(patientId))
})
