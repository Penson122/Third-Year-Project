const express = require('express');
const router = express.Router();

const checkYearMiddleWare = (req, res, next) => {
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

router.param('name', (req, res, next, name) => {
  // check that the name is available in mongo`
  // if(name not in model){
  req.name = name;
  next();
  // } else {
  //   res.status(400);
  //   res.send({error: 'Name not valid'});
  // }
});

router.param('fromYear', (req, res, next, fromYear) => {
  if (isPositiveInteger(fromYear)) {
    req.fromYear = parseInt(fromYear);
    next();
  } else {
    res.status(400).send({ error: 'fromYear must be a positive integer' });
  }
});

router.param('toYear', (req, res, next, toYear) => {
  if (isPositiveInteger(toYear)) {
    req.toYear = parseInt(toYear);
    next();
  } else {
    res.status(400).send({ error: 'toYear must be a positive integer' });
  }
});

router.param('baseLineTo', (req, res, next, baseLineTo) => {
  if (isPositiveInteger(baseLineTo)) {
    req.baseLineTo = parseInt(baseLineTo);
    next();
  } else {
    res.status(400).send({ error: 'baseLineTo must be a positive integer' });
  }
});

router.param('baseLineFrom', (req, res, next, baseLineFrom) => {
  if (isPositiveInteger(baseLineFrom)) {
    req.baseLineFrom = parseInt(baseLineFrom);
    next();
  } else {
    res.status(400).send({ error: 'baseLineFrom must be a positive integer' });
  }
});

router.get('/api/observations/:name', (req, res, next) => {
  res.send('/api/observations/' + req.name);
});

router.get('/api/observations/:name/:fromYear/:toYear', checkYearMiddleWare, (req, res, next) => {
  res.send('/api/observations/' + req.name + '/' + req.fromYear + '/' + req.toYear);
});

router.get('/api/observations/:name/:fromYear/:toYear/:baseLineFrom/:baseLineTo', checkYearMiddleWare, (req, res, next) => {
  res.send('/api/observations/' + req.name + '/' +
    req.fromYear + '/' +
    req.toYear + '/' +
    req.baseLineFrom + '/' +
    req.baseLineTo);
});

router.get('/api/model/:name/', (req, res, next) => {
  res.send('/api/model/' + req.name);
});

router.get('/api/model:name/:fromYear/:toYear', checkYearMiddleWare, (req, res, next) => {
  res.send('/api/model/' + req.name + '/' + req.fromYear + '/' + req.toYear);
});

router.get('/api/model/:name/:fromYear/:toYear', checkYearMiddleWare, (req, res, next) => {
  res.send('/api/model/' + req.name + '/' + req.fromYear + '/' + req.toYear);
});

router.get('/api/model/:name/:fromYear/:toYear/:baseLineFrom/:baseLineTo', checkYearMiddleWare, (req, res, next) => {
  res.send('/api/model/' + req.name + '/' + req.fromYear + '/' + req.toYear + '/' + req.baseLineFrom + '/' + req.baseLineTo);
});

module.exports = router;
