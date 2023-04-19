"use strict";
var Buffer = require('buffer/').Buffer
const { faker } = require('@faker-js/faker/locale/en_IND');
const fs = require('fs');
const Axios = require('axios')
const { csv } = require('csvtojson');
const path = require('path')
const assert = require("assert")
const fileExtension = require("./fileExtension")
const { waitFor } = require("taiko");
function getUserNameFromEncoding(encodedUser) {
    let user = new Buffer(encodedUser, 'base64');
    let decodedUser = user.toString('ascii');
    return decodedUser.split(":")[0]
}

function getPasswordFromEncoding(encodedUser) {
    let user = new Buffer(encodedUser, 'base64');
    let decodedUser = user.toString('ascii');
    return decodedUser.split(":")[1]
}

function randomName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getGender(gender) {
    if (gender == 'M')
        return "Male"
    if (gender == 'F')
        return "Female"
    if (gender == 'O')
        return "Other"
    if (gender == 'U')
        return "Undisclosed"
}

function getRegID() {
    return "BAH-".concat(randomNumber(10000, 1000000));
}
function getRandomPatientGender() {
    var patientGender = gauge.dataStore.scenarioStore.get("patientGender")
    if (!patientGender) {
        patientGender = faker.name.sexType()
        patientGender = patientGender.charAt(0).toUpperCase() + patientGender.slice(1);
    }
    gauge.dataStore.scenarioStore.put("patientGender", patientGender);
    return patientGender;
}

async function downloadAndReturnImage() {
    fileExtension.createDirIfNotPresent("temp");
    var filepath = "temp/image" + faker.datatype.number({ min: 1, max: 100 }) + ".jpg"
    var response = "";
    let max_Retry = 5
    while (max_Retry > 0) {
        try {
            response = await Axios({
                url: faker.image.avatar(),
                method: 'GET',
                responseType: 'stream'
            });
            await response.data.pipe(fs.createWriteStream(filepath));
            await waitFor(500);
            await waitFor(() => fileExtension.exists(filepath));
            assert.ok(fileExtension.exists(filepath), "Patient image not downloaded.");
            max_Retry = 0;
        } catch (e) {
            console.log("Image download failed - " + e.message + ". Retrying...")
            max_Retry = max_Retry - 1;
        }
    }
    return filepath;
}
async function downloadAndReturnBase64Image() {
    let image = await Axios.get(faker.image.avatar(), { responseType: 'arraybuffer' });
    let strB64Image = Buffer.from(image.data).toString('base64');
    return strB64Image;
}


async function randomZipCodeStateAndDistrict() {
    let jsonfile = await csv().fromFile(path.resolve(__dirname, "../../data/", process.env.addresshierarchyPath));
    var randomRow = faker.datatype.number({ min: 1, max: jsonfile.length });
    var pincode = jsonfile[randomRow]["ZIP"]
    gauge.dataStore.scenarioStore.put("pincode", pincode)
    var state = jsonfile[randomRow]["STATE"]
    gauge.dataStore.scenarioStore.put("state", state)
    var district = jsonfile[randomRow]["DISTRICT"]
    gauge.dataStore.scenarioStore.put("district", district)
}
module.exports = {
    getRegID: getRegID,
    randomName: randomName,
    getUserNameFromEncoding: getUserNameFromEncoding,
    getPasswordFromEncoding: getPasswordFromEncoding,
    getGender: getGender,
    getRandomPatientGender: getRandomPatientGender,
    randomNumber: randomNumber,
    downloadAndReturnImage: downloadAndReturnImage,
    randomZipCodeStateAndDistrict: randomZipCodeStateAndDistrict,
    downloadAndReturnBase64Image: downloadAndReturnBase64Image

}