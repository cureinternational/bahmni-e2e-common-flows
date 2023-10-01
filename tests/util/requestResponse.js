const path = require('path');
const axios = require('axios')
var date = require("./date");
const assert = require("assert");
var users = require("./users");
const { log } = require('console');
const logHelper = require('./logHelper');

async function getOpenMRSResponse(request) {
    logHelper.info(request)
    gauge.message(request)

    return await axios.get(request
        , {
            headers: {
                'Authorization': `token ${process.env.receptionist}`
            }
        })
}

async function makeOpenVisitCall(patientUUID, visitType, URL) {
    var yesterday = date.getyyyymmddFormattedDate(date.yesterday())
    var tomorrow = date.getyyyymmddFormattedDate(date.tomorrow())

    var request_URL = process.env.bahmniHost + URL
        .replace("<patientId>", patientUUID)
        .replace("<fromDate>", yesterday)
        .replace("<toDate>", tomorrow)
        .replace("<visitType>", visitType)

    logHelper.info(request_URL)
    gauge.message(request_URL)
    var prescriptionsVisitResponse = await getOpenMRSResponse(request_URL)

    assert.ok(prescriptionsVisitResponse.status == 200)
    gauge.message(prescriptionsVisitResponse.data);
    gauge.message(prescriptionsVisitResponse.headers);
    gauge.message(prescriptionsVisitResponse.config);

    return prescriptionsVisitResponse.data;
}

async function makeOpenProgramCall(patientUUID, programName, programEnrollmentId, URL) {
    var yesterday = date.getyyyymmddFormattedDate(date.yesterday())
    var tomorrow = date.getyyyymmddFormattedDate(date.tomorrow())

    var request_URL = process.env.bahmniHost + URL
        .replace("<patientId>", patientUUID)
        .replace("<fromDate>", yesterday)
        .replace("<toDate>", tomorrow)
        .replace("<programName>", programName)
        .replace("<programEnrollmentId>", programEnrollmentId)

    logHelper.info(request_URL)
    gauge.message(request_URL)
    var prescriptionsVisitResponse = await getOpenMRSResponse(request_URL)

    assert.ok(prescriptionsVisitResponse.status == 200)

    gauge.message(prescriptionsVisitResponse.data);
    gauge.message(prescriptionsVisitResponse.headers);
    gauge.message(prescriptionsVisitResponse.config);

    return prescriptionsVisitResponse.data;
}

async function setRoles() {
    await updateRoles(users.getUserNameFromEncoding(process.env.receptionist), process.env.receptionist_roles)
    await updateRoles(users.getUserNameFromEncoding(process.env.doctor), process.env.doctor_roles)
}

async function updateRoles(username, strRoles) {
    var userData = await axios({
        url: process.env.bahmniHost + process.env.getUser.replace("<userName>", username),
        method: 'get',
        headers: {
            'accept': `application/json`,
            'Content-Type': `application/json`,
            'Authorization': `Basic ${process.env.admin}`
        }
    });
    userset = userData.data.results.filter(users => users.username == username);
    assert.equal(userset.length, 1, "Prerequisite Failed - User not Found. User: " + username)

    userUUID = userset[0].uuid;

    listRoles = strRoles.split(",");

    var rolesData = await axios({
        url: process.env.bahmniHost + process.env.getRoles,
        method: 'get',
        headers: {
            'accept': `application/json`,
            'Content-Type': `application/json`,
            'Authorization': `Basic ${process.env.admin}`
        }
    });

    let body = {};
    var arrRoles = [];
    listRoles = strRoles.split(",");
    for (role of listRoles) {
        fileteredRoles = rolesData.data.results.filter(roles => roles.name == role)
        assert.equal(fileteredRoles.length, 1, "Prerequisite Failed - Role not Found. Role: " + role)
        arrRoles.push({ "uuid": fileteredRoles[0].uuid });
    }
    body.roles = arrRoles;
    let updateUser = await axios({
        url: process.env.bahmniHost + process.env.updateUser.replace("<userUUID>", userUUID),
        method: 'post',
        data: body,
        headers: {
            'accept': `application/json`,
            'Content-Type': `application/json`,
            'Authorization': `Basic ${process.env.admin}`
        }
    });
    assert.equal(updateUser.status, 200, "Prerequisite Failed - User Role not updated")
}

module.exports = {
    getOpenMRSResponse: getOpenMRSResponse,
    makeOpenVisitCall: makeOpenVisitCall,
    makeOpenProgramCall: makeOpenProgramCall,
    setRoles: setRoles
}