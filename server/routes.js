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
  models.observation.aggregate(
    { $match: { name: req.name } },
    { $unwind: '$data' },
    { $match: { 'data.year': { $gte : req.fromYear, $lte: req.toYear } } },
    (err, obs) => {
      if (err) util.handleError({ status: 400, body: `No observation found for ${req.name}` });
      else {
        const formatted = obs.map(o => o.data);
        const result = observationBaseline(req.baseLineFrom, req.baseLineTo, formatted);
        res.json(formatted);
      }
    });
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
      else res.json(mod.map((e) => e.data));
    });
});

router.get('/models/:name/:fromYear/:toYear', util.checkYear, (req, res, next) => {
  const upperBound = req.query.upperBound;
  const lowerBound = req.query.lowerBound;
  models.model.aggregate(
    { $match: { name: req.name } },
    { $unwind: '$data' },
    { $match: { 'data.year': { $gte : req.fromYear, $lte: req.toYear } } },
    (err, mod) => {
      if (err) util.handleError({ status: 400, body: `No model found for ${req.name}` });
      else {
        const formatted = mod.map(m => m.data);
        const result = getBounds(upperBound, lowerBound, formatted);
        res.json(result);
      }
    });
});

router.get('/models/:name/:fromYear/:toYear/:baseLineFrom/:baseLineTo', util.checkYear, (req, res, next) => {
  const upperBound = req.query.upperBound;
  const lowerBound = req.query.lowerBound;
  models.model.aggregate(
    { $match: { name: req.name } },
    { $unwind: '$data' },
    { $match: { 'data.year': { $gte : req.fromYear, $lte: req.toYear } } },
    (err, mod) => {
      if (err) util.handleError({ status: 400, body: `No model found for ${req.name}` });
      else {
        const formatted = mod.map(m => m.data);
        const baselined = modelBaseline(req.baseLineFrom, req.baseLineTo, formatted);
        const result = getBounds(upperBound, lowerBound, baselined);
        res.json(result);
      }
    });
});

const modelBaseline = (from, to, data) => {
  const total = data.reduce((acc, cur) => {
    if (cur.year >= from && cur.year <= to) {
      const yearTotal = cur.data.reduce((acc, cur) => acc + cur.mean, 0);
      const yearAverage = yearTotal / cur.data.length;
      acc += yearAverage;
    }
    return acc;
  }, 0);
  const average = total / Math.abs(from - to);
  return data.map(d => {
    d.data = d.data.map(p => {
      p.mean -= average;
      return p;
    });
    return d;
  });
};

const observationBaseline = (from, to, data) => {
  const total = data.reduce((acc, cur) => {
    if (cur.year >= from && cur.year <= to) {
      acc += cur.mean;
    }
    return acc;
  }, 0);
  const average = total / Math.abs(from - to);
  return data.map(d => {
    d.mean -= average;
    return d;
  });
};

const getBounds = (upperBound, lowerBound, data) => {
  let result = data;
  if (upperBound <= 100 && lowerBound > 0) {
    result = result.map(m => {
      m.data = m.data.sort((a, b) => a.mean - b.mean);
      let max, min;
      if (upperBound) {
        max = m.data[Math.floor(m.data.length * (upperBound / 100))];
      }
      if (lowerBound) {
        min = m.data[Math.floor(m.data.length * (lowerBound / 100))];
      }
      if (!!max && !!min) {
        m.data = [min, max];
      }
      return m;
    });
  }
  return result;
};

module.exports = router;
