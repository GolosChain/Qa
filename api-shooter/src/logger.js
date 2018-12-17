let loggerDepth = 0;
const tabSize = 4;

const log = (message, object = '') => {
  let offsetString = new String('-').repeat(loggerDepth);
  let logMessage = '['+new Date().toLocaleString() + '] [    ]\t';

  if (typeof(offsetString) === 'string') {
    logMessage += offsetString;
  }
  
  logMessage += message;

  if (!isEmpty(object) && object != "") {
    logMessage += ' ' + JSON.stringify(object);
  }

  console.log('\x1b[32m', logMessage,'\x1b[0m');
};

const ilog = (message, object = {}) => {
  let offsetString = new String(' ').repeat(loggerDepth);
  let logMessage = '['+new Date().toLocaleString() + '] [INFO]\t';

  if (typeof(offsetString) === 'string') {
    logMessage += offsetString;
  }
  
  logMessage += message;

  if (!isEmpty(object) && object != "") {
    logMessage += ' ' + JSON.stringify(object);
  }

  console.log('\x1b[1m', logMessage, '\x1b[0m');
  // console.log('\x1b[1m');
};

const oklog = (message, object = {}) => {
  new String('-').repeat(loggerDepth);
  let logMessage = '['+new Date().toLocaleString() + '] [ OK ]\t';

  if (typeof(offsetString) === 'string') {
    logMessage += offsetString;
  }

  logMessage += message;

  if (!isEmpty(object) && object != "") {
    logMessage += ' ' + JSON.stringify(object);
  }

  console.log('\x1b[32m', logMessage, '\x1b[0m');
  // console.log('\x1b[0m');
};

const wlog = (message, object = {}) => {
  let offsetString = '-' * loggerDepth;
  let logMessage = '['+new Date().toLocaleString() + '] [Warn]\t'

  if (typeof(offsetString) === 'string') {
    logMessage += offsetString;
  }

  logMessage += message;

  if (!isEmpty(object) && object != "") {
    logMessage += ' ' + JSON.stringify(object);
  }

  console.log('\x1b[35m', logMessage);
};

const elog = (message, object = {}) => {
  let offsetString = '' * loggerDepth;
  let logMessage = '['+new Date().toLocaleString() + '] [ Err]\t'

  if (typeof(offsetString) === 'string') {
    logMessage += offsetString;
  }

  logMessage += message;

  if (!isEmpty(object) && object != "") {
    logMessage += ' ' + JSON.stringify(object);
  }

  console.log('\x1b[31m', logMessage);
};


const down = () => {
  loggerDepth -= tabSize;
};

const up = () => {
  loggerDepth += tabSize;
};

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

module.exports.oklog = oklog;
module.exports.wlog = wlog;
module.exports.elog = elog;
module.exports.log = log;
module.exports.offset = {};
module.exports.offset.down = down;
module.exports.offset.up = up;
