const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const observationDataSchema = new Schema({
  year: Number,
  month: Number,
  mean: Number,
  totalUncertainty: Number,
  coverageUncertainty: Number,
  ensembleUncertainty: Number,
  lowerBoundBias: Number,
  upperBoundBias: Number,
  lowerBoundMeasurement: Number,
  upperBoundMeasurement: Number,
  lowerBoundCoverage: Number,
  upperBoundCoverage: Number,
  lowerBoundCombination: Number,
  upperBoundCombination: Number,
  lowerBoundCombinedAll: Number,
  upperBoundCombinedAll: Number
});

const observationSchema = new Schema({
  name: String,
  data: [observationDataSchema]
});

const modelDataSchema = new Schema({
  year: Number,
  data: [{
    ensembleNumber: Number,
    mean: Number
  }]
});

const modelSchema = new Schema({
  name: String,
  data: [modelDataSchema]
});

const observationModel = mongoose.model('observations', observationSchema);

const modelModel = mongoose.model('models', modelSchema);

module.exports = {
  observation: observationModel,
  model: modelModel
};
