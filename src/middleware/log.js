const logger = require("../utils/logger");

// middleware to log incoming requests
const log = (req, res, next) => {
  logger.info({
    incoming_request: req.url,
    method: req.method,
  });
  next();
};

module.exports = log;
