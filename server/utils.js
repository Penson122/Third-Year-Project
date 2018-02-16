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

const isPositiveInteger = (n) => {
  return n % (!isNaN(parseFloat(n)) && ~~n >= 0) === 0;
};

const handleError = (err, res) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.status(err.status).json({ msg: err.body });
};

module.exports = { checkYear, isPositiveInteger, handleError };
