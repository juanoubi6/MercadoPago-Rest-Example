const RateLimit = require("express-rate-limit");

const status = require("../status");

const MINUTES = 60 * 1000;

module.exports = new RateLimit({
  windowMs: 5 * MINUTES,
  max: 1000,
  delayMs: 0,
  delayAfter: 0,
  handler: (req, res) => {
    res.dispatch(status.TOO_MANY_REQUESTS);
  }
});

