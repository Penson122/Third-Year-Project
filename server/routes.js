const express = require('express');
const router = express.Router();

router.param('name', (req, res, next, name) => {
  //check that the name is available in mongo
  if(typeof name === 'string'){
    req.name = name;
    next();
  } else {
    res.status(400).send('Name not valid');
  }
})

router.param('fromYear', (req, res, next, fromYear) => {
  req.fromYear = parseInt(fromYear)
  next();
});

router.param('toYear', (req, res, next, toYear) => {
  req.toYear = parseInt(toYear)
  next();
});

router.param('baseLineTo', (req, res, next, baseLineTo) => {
  req.baseLineTo = parseInt(baseLineTo)
  next();
});

router.param('baseLineFrom', (req, res, next, baseLineFrom) => {
  req.baseLineFrom = parseInt(baseLineFrom)
  next();
});

router.get('/api/observations/:name', (req, res, next) => {
  res.send('/api/observations/' + req.name);
});

router.get('/api/observations/:name/:fromYear/:toYear', (req, res, next) => {
  res.send('/api/observations/' + req.name + '/' + req.fromYear + '/' + req.toYear);
});

router.get('/api/observations/:name/:fromYear/:toYear/:baseLineFrom/:baseLineTo', (req, res, next) => {
  res.send('/api/observations/' + req.name + '/' + req.fromYear + '/' + req.toYear + '/' + req.baseLineFrom + '/' + req.baseLineTo);
});

router.get('/api/model/:name/', (req, res, next) => {
  res.send('/api/model/' + req.name);
});

router.get('/api/model:name/:fromYear/:toYear', (req, res, next) => {
  res.send('/api/model/' + req.name + '/' + req.fromYear + '/' + req.toYear);
});

router.get('/api/model/:name/:fromYear/:toYear', (req, res, next) => {
  res.send('/api/model/' + req.name + '/' + req.fromYear + '/' + req.toYear);
});

router.get('/api/model/:name/:fromYear/:toYear/:baseLineFrom/:baseLineTo', (req, res, next) => {
  res.send('/api/model/' + req.name + '/' + req.fromYear + '/' + req.toYear + '/' + req.baseLineFrom + '/' + req.baseLineTo);
});

module.exports = router;