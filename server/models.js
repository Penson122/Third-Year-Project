const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const observationDataSchema = new Schema({
  year: Number,
  month: Number,
  mean: Number,
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

const observationModel = mongoose.model('observations', observationSchema);

module.exports = {
  observation: observationModel
};
