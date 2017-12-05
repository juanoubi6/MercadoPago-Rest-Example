const config = require("../config/config");
const status = require("../status");

module.exports = function errorHandling(err, req, res, next) {
  let stack = null;
  let message = null;

  if (config.ENV === 'development') {
    message = err.message;
    stack = err.stack.split("\n");
  }

  res.dispatch(err.status || status.SERVER_ERROR, message, stack);
};
