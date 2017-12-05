const config = require("./config");

module.exports = {
  count: config.WEB_CONCURRENCY,
  verbose: config.ENV === 'development'
};
