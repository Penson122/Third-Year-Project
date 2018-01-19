const express = require('express');
const router = express.Router();

const util = require('./utils.js');
const models = require('./models.js');

// JSON API
router.use(express.json());

router.param('name', (req, res, next, name) => {
  req.name = name;
  next();
});

router.param('fromYear', (req, res, next, fromYear) => {
  if (util.isPositiveInteger(fromYear)) {
    req.fromYear = parseInt(fromYear);
    next();
  } else {
    res.status(400).send({ error: 'fromYear must be a positive integer' });
  }
});

router.param('toYear', (req, res, next, toYear) => {
  if (util.isPositiveInteger(toYear)) {
    req.toYear = parseInt(toYear);
    next();
  } else {
    res.status(400).send({ error: 'toYear must be a positive integer' });
  }
});

router.param('baseLineTo', (req, res, next, baseLineTo) => {
  if (util.isPositiveInteger(baseLineTo)) {
    req.baseLineTo = parseInt(baseLineTo);
    next();
  } else {
    res.status(400).send({ error: 'baseLineTo must be a positive integer' });
  }
});

router.param('baseLineFrom', (req, res, next, baseLineFrom) => {
  if (util.isPositiveInteger(baseLineFrom)) {
    req.baseLineFrom = parseInt(baseLineFrom);
    next();
  } else {
    res.status(400).send({ error: 'baseLineFrom must be a positive integer' });
  }
});

router.get('/observations/:name', (req, res, next) => {
  models.observation.findOne({ name : req.name }, (err, obs) => {
    if (err) util.handleError({ status: 400, message: `No observation found for ${req.name}` });
    if (obs) res.json(obs.data);
    else res.json([]);
  });
});

router.get('/observations/:name/:fromYear', (req, res, next) => {
  models.observation.aggregate(
    { $match : { name: req.name } },
    { $unwind : '$data' },
    { $match : { 'data.year': { $gte: req.fromYear } } },
    (err, obs) => {
      if (err) util.handleError({ status: 400, body: `No observation found for ${req.name}` });
      else res.json(obs.map((e) => e.data));
    });
});

router.get('/observations/:name/:fromYear/:toYear', util.checkYear, (req, res, next) => {
  models.observation.aggregate(
    { $match: { name: req.name } },
    { $unwind: '$data' },
    { $match: { 'data.year': { $gte : req.fromYear, $lte: req.toYear } } },
    (err, obs) => {
      if (err) util.handleError({ status: 400, body: `No observation found for ${req.name}` });
      else res.json(obs.map((e) => e.data));
    });
});

router.get('/observations/:name/:fromYear/:toYear/:baseLineFrom/:baseLineTo', util.checkYear, (req, res, next) => {
  res.send('/observations/' + req.name + '/' +
    req.fromYear + '/' +
    req.toYear + '/' +
    req.baseLineFrom + '/' +
    req.baseLineTo);
});

router.get('/models/:name', (req, res, next) => {
  models.model.findOne({ name: req.name }, (err, obs) => {
    if (err) util.handleError({ status: 400, message: `No model found for ${req.name}` });
    if (obs) res.json(obs.data);
    else res.json([]);
  });
});

router.get('/models/:name/:fromYear', (req, res, next) => {
  models.model.aggregate(
    { $match : { name: req.name } },
    { $unwind : '$data' },
    { $match : { 'data.year': { $gte: req.fromYear } } },
    (err, mod) => {
      if (err) util.handleError({ status: 400, body: `No observation found for ${req.name}` });
      else res.json(mod);
    });
});

router.get('/models/:name/:fromYear/:toYear', util.checkYear, (req, res, next) => {
  models.model.aggregate(
    { $match: { name: req.name } },
    { $unwind: '$data' },
    { $match: { 'data.year': { $gte : req.fromYear, $lte: req.toYear } } },
    (err, mod) => {
      if (err) util.handleError({ status: 400, body: `No observation found for ${req.name}` });
      else res.json(mod);
    });
});

router.get('/model/:name/:fromYear/:toYear/:baseLineFrom/:baseLineTo', util.checkYear, (req, res, next) => {
  // eslint-disable-next-line max-len
  res.send('/model/' + req.name + '/' + req.fromYear + '/' + req.toYear + '/' + req.baseLineFrom + '/' + req.baseLineTo);
});

module.exports = router;
