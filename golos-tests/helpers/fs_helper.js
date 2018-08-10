const fs      = require('fs');
const logger  = require('@logger');

// The hell section containing work with time in JS 
function getCurrentUtcTime() {
    let date = new Date(); 
    let now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

    return new Date(now_utc);
}

// God bless SO for this. (Link)[https://stackoverflow.com/questions/439630/how-do-you-create-a-javascript-date-object-with-a-set-timezone-without-using-a-s]
function parseISO8601String(dateString) {
    var timebits = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(?::([0-9]*)(\.[0-9]*)?)?(?:([+-])([0-9]{2})([0-9]{2}))?/;
    var m = timebits.exec(dateString);
    var resultDate;
    if (m) {
        var utcdate = Date.UTC(parseInt(m[1]),
                               parseInt(m[2])-1, // months are zero-offset (!)
                               parseInt(m[3]),
                               parseInt(m[4]), parseInt(m[5]), // hh:mm
                               (m[6] && parseInt(m[6]) || 0),  // optional seconds
                               (m[7] && parseFloat(m[7])*1000) || 0); // optional fraction
        // utcdate is milliseconds since the epoch
        if (m[9] && m[10]) {
            var offsetMinutes = parseInt(m[9]) * 60 + parseInt(m[10]);
            utcdate += (m[8] === '+' ? -1 : +1) * offsetMinutes * 60000;
        }
        resultDate = new Date(utcdate);
    } else {
        resultDate = null;
    }
    return resultDate;
}

// 3 sec. Its needed to give golosd enough time to handle time time-bounded processes
const minTimeDelta = 3 * 1000;

function compareDates(a, b) {
  return a - b > minTimeDelta;
};

const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

async function waitConditionChange(cond, ts = 1000 * 3) {
    while(true) {
        await delay(ts)

        let nowCondition = await cond();
        if (nowCondition == true) {
            break;
        }
    }
}

function toUpperCase( string ){
    return string[1].toUpperCase();
}

// Need enhancement !!!
const toCamel = (str) => {
    str = str.toLowerCase().replace(/(_|-)([a-z1-9])/g, toUpperCase);
    return str.replace(/_/g, "");
}


module.exports.getCurrentUtcTime = getCurrentUtcTime;
module.exports.parseUtcString = parseISO8601String;
module.exports.compareDates = compareDates;
module.exports.delay = delay;
module.exports.waitConditionChange = waitConditionChange;
module.exports.toCamel = toCamel;
