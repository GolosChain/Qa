function ilog(message, object = {}) {
    let logMessage = '['+new Date().toLocaleString() + ']' + ' [' + message + '] ' + JSON.stringify(object);

    console.log(logMessage);
};

function oklog(message, object = {}) {
    let logMessage = '['+new Date().toLocaleString() + ']' + ' [OK]\t[' + message + '] ' + JSON.stringify(object);

    console.log(logMessage);
};

function wlog(message, object = {}) {
    let logMessage = '['+new Date().toLocaleString() + ']' + ' [Warning]\t[' + message + '] ' + JSON.stringify(object);

    console.log(logMessage);
};

function elog(message, object = {}) {
    let logMessage = '['+new Date().toLocaleString() + ']' + ' [Error]\t[' + message + '] ' + JSON.stringify(object);

    console.log(logMessage);
};

module.exports.oklog = oklog;
module.exports.wlog = wlog;
module.exports.elog = elog;
module.exports.log = ilog;
