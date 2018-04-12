/** @module Routes */
/**
 * Middleware to check the from and years of a request
 * Years must be positive numbers in chronological order in YYYY format.
 * @name checkYear
 * @routeparam {Number} toYear   YYYY format
 * @routeparam {Number} fromYear YYYY format
 */
const checkYear = (req, res, next) => {
  let message = { errors: [] };
  let status;
  if (req.fromYear !== undefined && req.toYear !== undefined) {
    if (req.fromYear > req.toYear) {
      status = 400;
      message.errors.push('fromYear and toYear are out of order');
    }
    if (req.baseLineTo !== undefined && req.baseLineFrom !== undefined) {
      if (req.baseLineFrom > req.baseLineTo) {
        status = 400;
        message.errors.push('baseLineTo and baseLineFrom are out of order');
      }
      if (req.baseLineFrom < req.fromYear) {
        status = 400;
        message.errors.push('baseLineFrom before fromYear');
      }
      if (req.baseLineTo > req.toYear) {
        status = 400;
        message.errors.push('baseLineTo is after toYear');
      }
    }
  }
  if (message.errors.length > 0) {
    res.status(status).send(message);
  } else {
    next();
  }
};

/**
 * Utility function for checking if it's a positive number
 * @param   {Number}  n Number to check
 * @returns {boolean} true if it is, false otherwise
 */
const isPositiveInteger = (n) => {
  return n % (!isNaN(parseFloat(n)) && ~~n >= 0) === 0;
};

/**
 * Log the error and send it to the client
 * @param {Object}   err error to send to client
 * @param {Response} res the express response
 */
const handleError = (err, res) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.status(err.status).json({ msg: err.body });
};

module.exports = { checkYear, isPositiveInteger, handleError };
