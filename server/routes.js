/** @module Routes */
const express = require('express');
const router = express.Router();

const util = require('./utils.js');
const models = require('./models.js');

// JSON API
router.use(express.json());

/**
 * @routeparam {String} name the name of an observational or model dataset.
 */
router.param('name', (req, res, next, name) => {
  req.name = name;
  next();
});

/**
 * Must be a positive integer
 * @routeparam {Number} fromYear lower bound for fetching data set
 */
router.param('fromYear', (req, res, next, fromYear) => {
  if (util.isPositiveInteger(fromYear)) {
    req.fromYear = parseInt(fromYear);
    next();
  } else {
    res.status(400).send({ error: 'fromYear must be a positive integer' });
  }
});

/**
 * Must be a positive integer
 * @routeparam {Number} toYear upperbound for fetching data set
 */
router.param('toYear', (req, res, next, toYear) => {
  if (util.isPositiveInteger(toYear)) {
    req.toYear = parseInt(toYear);
    next();
  } else {
    res.status(400).send({ error: 'toYear must be a positive integer' });
  }
});

/**
 * Must be a positive integer
 * @routeparam {Number} baselineFrom lowerbound for baselining a dataset
 */
router.param('baseLineFrom', (req, res, next, baseLineFrom) => {
  if (util.isPositiveInteger(baseLineFrom)) {
    req.baseLineFrom = parseInt(baseLineFrom);
    next();
  } else {
    res.status(400).send({ error: 'baseLineFrom must be a positive integer' });
  }
});

/**
 * Must be a positve integer
 * @routeparam {Number} baseelineTo upperbound for baselining a dataset
 */
router.param('baseLineTo', (req, res, next, baseLineTo) => {
  if (util.isPositiveInteger(baseLineTo)) {
    req.baseLineTo = parseInt(baseLineTo);
    next();
  } else {
    res.status(400).send({ error: 'baseLineTo must be a positive integer' });
  }
});

/**
 * Get the names for all observational data sets
 * @name  ListObservations
 * @route {GET} /api/list/observations
 */
router.get('/list/observations', (req, res, next) => {
  models.observation.find().distinct('name', (err, list) => {
    if (err) {
      util.handleError({
        status: 400, body: 'Error connecting to database'
      }, res);
    } else res.json(list);
  });
});

/**
 * Get the names of all model data sets
 * @name ListModels
 * @route {GET} /api/list/models
 */
router.get('/list/models', (req, res, next) => {
  models.model.find().distinct('name', (err, list) => {
    if (err) {
      util.handleError({
        status: 400, body: 'Error connecting to database'
      }, res);
    } else res.json(list);
  });
});

/**
 * Get observation by its name
 * @name GetObservation
 * @route {GET} /api/observations/:name
 * @routeparam {String} name of the observation
 */
router.get('/observations/:name', (req, res, next) => {
  models.observation.findOne({ name : req.name }, (err, obs) => {
    if (err) {
      util.handleError({
        status: 400, message: `Error reading from database`
      }, res);
    }
    if (obs) res.json(obs.data);
    else {
      util.handleError({
        status: 400, body: `No observation found for ${req.name}`
      }, res);
    }
  });
});

/**
 * Get observation by name for all years after parameter
 * @name GetObservationByYear
 * @route      {GET}    /api/observations/:name/:fromYear
 * @routeparam {String} name     of the observation
 * @routeparam {Number} fromYear lowebound to fetch data
 */
router.get('/observations/:name/:fromYear', (req, res, next) => {
  models.observation.aggregate(
    { $match : { name: req.name } },
    { $unwind : '$data' },
    { $match : { 'data.year': { $gte: req.fromYear } } },
    (err, obs) => {
      if (err) {
        util.handleError({
          status: 400, body: `No observation found for ${req.name}`
        }, res);
      } else {
        res.json(obs.map((e) => e.data));
      }
    });
});

/**
 * Get observation by name for years between bound
 * @name GetObservationBoundedByYear
 * @route      {GET}    /api/observations/:name/:fromYear/:toYear
 * @routeparam {String} name     of the observation
 * @routeparam {Number} fromYear lowebound to fetch data
 * @routeparam {Number} toYear   upperbound to fetch data
 */
router.get('/observations/:name/:fromYear/:toYear',
  util.checkYear, (req, res, next) => {
    models.observation.aggregate(
      { $match: { name: req.name } },
      { $unwind: '$data' },
      { $match: { 'data.year': { $gte : req.fromYear, $lte: req.toYear } } },
      (err, obs) => {
        if (err) {
          util.handleError({
            status: 400, body: `No observation found for ${req.name}`
          }, res);
        } else {
          res.json(obs.map((e) => e.data));
        }
      });
  });

/**
 * Get observation by name with a baseline
 * @name GetObservationBaselined
 * @route {GET} /api/observations/:name/:fromYear/:toYear/:baselineFrom/:baselineTo
 * @routeparam {String} name         of the observation
 * @routeparam {Number} fromYear     lowebound to fetch data
 * @routeparam {Number} toYear       upperbound to fetch data
 * @routeparam {Number} baseLineFrom lowebound to baseline
 * @routeparam {Number} baseLineTo   upperbound to baseline
 */
router.get('/observations/:name/:fromYear/:toYear/:baseLineFrom/:baseLineTo',
  util.checkYear, (req, res, next) => {
    models.observation.aggregate(
      { $match: { name: req.name } },
      { $unwind: '$data' },
      { $match: { 'data.year': { $gte : req.fromYear, $lte: req.toYear } } },
      (err, obs) => {
        if (err) {
          util.handleError({
            status: 400, body: `No observation found for ${req.name}`
          }, res);
        } else {
          const formatted = obs.map(o => o.data);
          const result = observationBaseline(
            req.baseLineFrom, req.baseLineTo, formatted);
          res.json(result);
        }
      });
  });

/**
 * Get model by its name
 * @name GetModel
 * @route      {GET}    /api/model/:name
 * @routeparam {String} name of the observation
 */
router.get('/models/:name', (req, res, next) => {
  models.model.findOne({ name: req.name }, (err, obs) => {
    if (err) {
      util.handleError({
        status: 400, message: 'error reading from database'
      }, res);
    }
    if (obs) res.json(obs.data);
    else {
      util.handleError({
        status: 400, body: `No observation found for ${req.name}`
      }, res);
    }
  });
});

/**
 * Get model by name after a lower bound year
 * @name GetModelByYear
 * @route      {GET}    /api/models/:name/:fromYear
 * @routeparam {String} name         of the observation
 * @routeparam {Number} fromYear     lowebound to fetch data
 */
router.get('/models/:name/:fromYear', (req, res, next) => {
  models.model.aggregate(
    { $match : { name: req.name } },
    { $unwind : '$data' },
    { $match : { 'data.year': { $gte: req.fromYear } } },
    (err, mod) => {
      if (err) {
        util.handleError({
          status: 400, body: `No observation found for ${req.name}`
        }, res);
      } else {
        res.json(mod.map((e) => e.data));
      }
    });
});

/**
 * Get model by name between two years
 * @name GetModelBoundedByYear
 * @route      {GET}    /api/models/:name/:fromYear/:toYear
 * @routeparam {String} name         of the observation
 * @routeparam {Number} fromYear     lowebound to fetch data
 */
router.get('/models/:name/:fromYear/:toYear',
  util.checkYear, (req, res, next) => {
    const upperBound = req.query.upperBound;
    const lowerBound = req.query.lowerBound;
    models.model.aggregate(
      { $match: { name: req.name } },
      { $unwind: '$data' },
      { $match: { 'data.year': { $gte : req.fromYear, $lte: req.toYear } } },
      (err, mod) => {
        if (err) {
          util.handleError({
            status: 400, body: `No model found for ${req.name}`
          }, res);
        } else {
          const formatted = mod.map(m => m.data);
          const result = getBounds(upperBound, lowerBound, formatted);
          res.json(result);
        }
      });
  });

/**
 * Get model by name after a lower bound year
 * @name GetModelBaselined
 * @route  {GET} /api/models/:name/:fromYear/:toYear/:baselineFrom/:baselineTo
 * @routeparam {String} name         of the observation
 * @routeparam {Number} fromYear     lowebound to fetch data
 * @routeparam {Number} toYear       upperbound to fetch data
 * @routeparam {Number} baseLineFrom lowebound to baseline
 * @routeparam {Number} baseLineTo   upperbound to baseline
 */
router.get('/models/:name/:fromYear/:toYear/:baseLineFrom/:baseLineTo',
  util.checkYear, (req, res, next) => {
    const upperBound = req.query.upperBound;
    const lowerBound = req.query.lowerBound;
    models.model.aggregate(
      { $match: { name: req.name } },
      { $unwind: '$data' },
      { $match: { 'data.year': { $gte : req.fromYear, $lte: req.toYear } } },
      (err, mod) => {
        if (err) {
          util.handleError({
            status: 400, body: `No model found for ${req.name}`
          }, res);
        } else {
          const formatted = mod.map(m => m.data);
          const baselined = modelBaseline(
            req.baseLineFrom, req.baseLineTo, formatted);
          const result = getBounds(upperBound, lowerBound, baselined);
          res.json(result);
        }
      });
  });

/**
 * Calculate the baseline for a model dataset
 * @param  {Number}      from
 * @param  {Number}      to
 * @param  {ModelData[]} data
 * @return {Array}       Baselined data
 */
const modelBaseline = (from, to, data) => {
  let averages = { ...data[0].data };
  // calculate totals
  Object.keys(averages).forEach(x => { averages[x] = 0; });
  data.forEach(year => {
    if (year.year >= from && year.year <= to) {
      year.data.forEach(x => {
        averages[x.ensembleNumber] += x.mean;
      });
    }
  });
  // calculate average
  const period = (to - from) + 1;
  Object.keys(averages).forEach(x => { averages[x] = averages[x] / period; });
  // subtract average
  data.forEach(year => {
    year.data.forEach(x => {
      x.mean = x.mean - averages[x.ensembleNumber];
    });
  });
  return data;
};

/**
 * Calculate the baseline for an observational data set
 * @param   {Number}            from YYYY lower bound
 * @param   {Number}            to   YYYY upper bound
 * @param   {ObservationData[]} data Array of observations
 * @returns {Array}             baselined data set
 */
const observationBaseline = (from, to, data) => {
  const total = data.reduce((acc, cur) => {
    if (cur.year >= from && cur.year <= to) {
      acc += cur.mean;
    }
    return acc;
  }, 0);
  const period = (to - from) + 1;
  const average = total / period;
  return data.map(d => {
    d.mean -= average;
    return d;
  });
};

/**
 * Apply an envolope to a data set i.e.
 * remove the top and bottom 5% of a data set.
 * @param   {Number} upperBound an integer less than or equal to 100
 * @param   {Number} lowerbound an integer greater than or equal to 0.
 * @param   {Array}  data       an array of data that contains a mean
 * @returns {Array}             The inner data object replaced with [min, max]
 */
const getBounds = (upperBound, lowerBound, data) => {
  let result = data;
  if (upperBound <= 100 && lowerBound >= 0) {
    result = result.map(m => {
      m.data = m.data.sort((a, b) => a.mean - b.mean);
      let max, min;
      if (upperBound) {
        const maxIndex = Math.floor(m.data.length * (upperBound / 100));
        max = m.data[maxIndex];
      }
      if (lowerBound) {
        const mIndex = Math.floor(m.data.length * (lowerBound / 100));
        min = m.data[mIndex];
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
