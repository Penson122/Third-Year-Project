const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));

const { App } = require('../index.js');

const dataKeys = [
  'year',
  'mean',
  'lowerBoundBias',
  'upperBoundBias',
  'lowerBoundMeasurement',
  'upperBoundMeasurement',
  'lowerBoundCoverage',
  'upperBoundCoverage',
  'lowerBoundCombination',
  'upperBoundCombination',
  'lowerBoundCombinedAll',
  'upperBoundCombinedAll'
];

const name = 'hadcrut4Annual';

describe('Observations', function () {
  it('Get observation by name', function (done) {
    chai.request(App).get(`/api/observations/${name}`).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      res.body.forEach(d => {
        expect(d).to.have.all.keys(...dataKeys);
      });
      done();
    });
  });
  it('Get observations invalid name', function (done) {
    chai.request(App).get('/api/observations/foobarbaz').end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(0);
      done();
    });
  });
  it('Get observations by name after year', function (done) {
    chai.request(App).get(`/api/observations/${name}/1900`).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      // inclusive date ranges
      expect(res.body[0].year).to.equal(1900);
      res.body.forEach(d => {
        expect(d).to.have.all.keys(...dataKeys);
      });
      done();
    });
  });
  it('Get observations by name invalid year', function (done) {
    chai.request(App).get(`/api/observations/${name}/2100`).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(0);
      done();
    });
  });
  it('Get observations by name after year and until year', function (done) {
    chai.request(App).get(`/api/observations/${name}/1900/1920`).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(21);
      expect(res.body[0].year).to.equal(1900);
      expect(res.body[res.body.length - 1].year).to.equal(1920);
      done();
    });
  });
  it('Get obsersavations by name reversed year range', function (done) {
    chai.request(App).get(`/api/observations/${name}/1920/1900`).end((_, res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.include('fromYear and toYear are out of order');
      done();
    });
  });
  it('Get observations by name zero range', function (done) {
    chai.request(App).get(`/api/observations/${name}/1900/1900`).end((_, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0].year).to.equal(1900);
      expect(res.body[0]).to.have.all.keys(...dataKeys);
      done();
    });
  });
});
