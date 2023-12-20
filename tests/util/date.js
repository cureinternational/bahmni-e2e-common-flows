const logHelper = require('./logHelper');

function yesterday() {
    const today = new Date()
    const yesterday = new Date(today)

    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday;
}

function getAgeByYears(yearOfBirth) {
    const today = new Date()
    const dateYearsAgo = new Date(yearOfBirth)

    return (today.getFullYear() - dateYearsAgo.getFullYear())
}

function getAge(yearOfBirth) {
    const today = new Date()
    const dateYearsAgo = new Date(today)

    dateYearsAgo.setFullYear(today.getFullYear() - yearOfBirth.getFullYear())
    dateYearsAgo.setMonth(today.getMonth() - yearOfBirth.getMonth())
    dateYearsAgo.setDate(today.getDate() - yearOfBirth.getDate())
    return dateYearsAgo;
}
function calculate_age(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}



function getDateAgo(dateAgo) {
    var days = dateAgo.split("/")[0]
    var months = dateAgo.split("/")[1]
    var years = dateAgo.split("/")[2]

    const today = new Date()
    const dateYearsAgo = new Date(today)

    dateYearsAgo.setFullYear(dateYearsAgo.getFullYear() - parseInt(years))
    dateYearsAgo.setMonth(dateYearsAgo.getMonth() - parseInt(months))
    dateYearsAgo.setDate(dateYearsAgo.getDate() - parseInt(days))
    return dateYearsAgo;
}
function addDaysAndReturnDateInDDMMYYYY(intDays) {
    return ddmmyyyy(new Date().setDate(new Date().getDate() + parseInt(intDays)))
}


function getDateYearsAgo(numberOfYearsAgo) {
    const today = new Date()
    const dateYearsAgo = new Date(today)

    dateYearsAgo.setFullYear(dateYearsAgo.getFullYear() - numberOfYearsAgo)
    return dateYearsAgo;
}
function today() {
    const today = new Date()
    return today
}

function tomorrow() {
    const today = new Date()
    const tomorrow = new Date(today)

    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow;
}

function ddmmyyyy(dateToBeFormatted) {
    const date = (dateToBeFormatted == null) ? new Date() : new Date(dateToBeFormatted);

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    return `${dd.toString()}${mm.toString()}${yyyy.toString()}`;
}

function ddmmyyyyHHMM(dateToBeFormatted) {
    const date = (dateToBeFormatted == null) ? new Date() : dateToBeFormatted;

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    var newDate = new Date()
    return `${dd.toString()}/${mm.toString()}/${yyyy.toString()} ${newDate.getHours()}:${newDate.getMinutes()}`;
}

function getyyyymmddFormattedDate(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return `${yyyy.toString()}-${mm.toString()}-${dd.toString()}`;
}
function getDateFrommmddyyyy(dateString) {
    logHelper.info(dateString)
    var dateParts = dateString.split("/");//mm/dd/yyyy

    // month is 0-based, that's why we need dataParts[0] - 1
    return new Date(+dateParts[2], dateParts[0] - 1, +dateParts[1]);
}
function getDateFromddmmyyyy(dateString) {
    logHelper.info(dateString)
    var dateParts = dateString.split("/");//dd/mm/yyyy
    // month is 0-based, that's why we need dataParts[1] - 1

     return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
     ;
}
function nextYear() {
    var nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear;
}

function getShortNameOfMonth(date) {
    const month = date.toLocaleString('default', { month: 'short' });
    return month.slice(0, 3);
}

function minusMinutes(date, minutes) {
    return new Date(date.getTime() - minutes * 60000);
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function getDateInLongFromat(date) {
    return `${date.toLocaleString('en-us', { month: 'long' })} ${("0" + date.getDate()).slice(-2)}, ${date.getFullYear()}`
}

function getddmmmyyyyFormattedDate(date) {
    return `${date.getDate()}-${date.toLocaleString('en-us', { month: 'short' })}-${date.getFullYear()}`
}

function getDateInShortFormat(date) {
    date = new Date(date)
    return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('en-us', { month: 'short' })} ${date.getFullYear().toString().slice(2, 4)}`
}

function addDaysAndReturnDateInShortFormat(intDays) {
    return getDateInShortFormat(new Date().setDate(new Date().getDate() + parseInt(intDays)))
}

module.exports = {
    today: today,
    yesterday: yesterday,
    ddmmyyyy: ddmmyyyy,
    tomorrow: tomorrow,
    nextYear: nextYear,
    getDateFrommmddyyyy: getDateFrommmddyyyy,
    getDateFromddmmyyyy:getDateFromddmmyyyy,
    getShortNameOfMonth: getShortNameOfMonth,
    getyyyymmddFormattedDate: getyyyymmddFormattedDate,
    getDateYearsAgo: getDateYearsAgo,
    getDateAgo: getDateAgo,
    getAge: getAge,
    getAgeByYears: getAgeByYears,
    ddmmyyyyMMSS: ddmmyyyyHHMM,
    minusMinutes: minusMinutes,
    addMinutes: addMinutes,
    getDateInLongFromat: getDateInLongFromat,
    getddmmmyyyyFormattedDate: getddmmmyyyyFormattedDate,
    addDaysAndReturnDateInDDMMYYYY: addDaysAndReturnDateInDDMMYYYY,
    getDateInShortFormat: getDateInShortFormat,
    addDaysAndReturnDateInShortFormat: addDaysAndReturnDateInShortFormat,
    calculate_age: calculate_age
}