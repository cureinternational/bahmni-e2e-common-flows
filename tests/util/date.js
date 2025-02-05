const logHelper = require('./logHelper');
const dateFormat=process.env.dateFormat
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
function addDaysAndReturnDate(intDays) {
    var tz=process.env.testTimeZone || 'Asia/Kolkata'
    const options = { timeZone: tz };
    const istDate = new Date().toLocaleString('en-US', options);
    var currentDate=new Date(istDate).setDate(new Date(istDate).getDate()+parseInt(intDays));
    if(dateFormat=='mmddyyyy')
        return mmddyyyy(currentDate)
    else
        return ddmmyyyy(currentDate)
}

function getCurrentTimeFormatted() {
    var tz=process.env.testTimeZone || 'Asia/Kolkata'
    const options = { timeZone: tz };
    const istDate = new Date().toLocaleString('en-US', options);
    const currentDate = new Date(istDate)
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    // Pad single-digit hours and minutes with leading zeros
    const finalformattedHours=(hours < 12) ? hours : hours-12;
    const formattedHours = (finalformattedHours < 10) ? `0${finalformattedHours}` : finalformattedHours;
    const formattedMinutes = (minutes < 10) ? `0${minutes}` : minutes;

    // Determine if it's AM or PM
    const period = (hours < 12) ? 'AM' : 'PM';

    // Format the time as "hh:mmAM/PM"
    const formattedTime = `${formattedHours}:${formattedMinutes}${period}`;

    return formattedTime;
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

function mmddyyyy(dateToBeFormatted) {
    const date = (dateToBeFormatted == null) ? new Date() : new Date(dateToBeFormatted);

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    return `${mm.toString()}${dd.toString()}${yyyy.toString()}`;
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

function printCurrentDate()
{
    var currentDate = new Date();

    // Get the current date components
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    var day = currentDate.getDate();

    // Get the current time components
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();

    // Format the date and time as strings
    var currentDateStr = year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
    var currentTimeStr = hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    // Print the current date and time
    console.log("Current Date: " + currentDateStr);
    console.log("Current Time: " + currentTimeStr);
    return "Current Date: " + currentDateStr + "Current Time: " + currentTimeStr
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
    getDateInShortFormat: getDateInShortFormat,
    addDaysAndReturnDateInShortFormat: addDaysAndReturnDateInShortFormat,
    calculate_age: calculate_age,
    getCurrentTimeFormatted,getCurrentTimeFormatted,
    printCurrentDate:printCurrentDate,
    addDaysAndReturnDate:addDaysAndReturnDate
}