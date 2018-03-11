const chai = require('chai');
chai.use(require('chai-http'));
const { App } = require('../index.js');
require('dotenv').config();
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

describe('List', () => {
  it('Get list of observations', async () => {
    expect.assertions(3);
    const res = await chai.request(App).get('/api/list/observations');
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(4);
  });
  it('Get list of models', async () => {
    expect.assertions(3);
    const res = await chai.request(App).get('/api/list/models');
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
  });
});

describe('Observations', () => {
  const name = 'hadcrut4Annual';
  it('Get observation by name', async () => {
    expect.assertions(3);
    const res = await chai.request(App).get(`/api/observations/${name}`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(Object.keys(res.body[0]).sort()).toEqual(dataKeys.sort());
  });
  it('Get observations invalid name', async () => {
    expect.assertions(2);
    try {
      await chai.request(App).get('/api/observations/foobarbaz');
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.response.body.msg).toEqual('No observation found for foobarbaz');
    }
  });
  it('Get observations by name after year', async () => {
    expect.assertions(4);
    const res = await chai.request(App).get(`/api/observations/${name}/1900`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    // inclusive date ranges
    expect(res.body[0].year).toEqual(1900);
    expect(Object.keys(res.body[0]).sort()).toEqual(dataKeys.sort());
  });
  it('Get observations by name invalid year', async () => {
    expect.assertions(3);
    const res = await chai.request(App).get(`/api/observations/${name}/2100`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });
  it('Get observations by name after year and until year', async () => {
    expect.assertions(4);
    const res = await chai.request(App).get(`/api/observations/${name}/1900/1920`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].year).toEqual(1900);
    expect(res.body[res.body.length - 1].year).toEqual(1920);
  });
  it('Get obsersavations by name reversed year range', async () => {
    expect.assertions(4);
    try {
      await chai.request(App).get(`/api/observations/${name}/1920/1900`);
    } catch (res) {
      expect(res.status).toEqual(400);
      expect(typeof res.response.body).toEqual('object');
      expect(Array.isArray(res.response.body.errors)).toBeTruthy();
      expect(res.response.body.errors).toContain('fromYear and toYear are out of order');
    }
  });
  it('Get observations by name zero range', async () => {
    expect.assertions(4);
    const res = await chai.request(App).get(`/api/observations/${name}/1900/1900`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].year).toEqual(1900);
    expect(Object.keys(res.body[0]).sort()).toEqual(dataKeys.sort());
  });
  it('Get observation with data period and baselined', async () => {
    expect.assertions(4);
    const res = await chai.request(App).get(`/api/observations/${name}/1900/2000/1900/1900`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].year).toEqual(1900);
    expect(res.body[0].mean).toEqual(0);
  });
});

describe('Models', () => {
  const modelName = 'cmip3';
  it('Get a model', async () => {
    expect.assertions(2);
    const res = await chai.request(App).get(`/api/models/${modelName}`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
  it('Gets a model from year', async () => {
    expect.assertions(3);
    const fromYear = 1960;
    const res = await chai.request(App).get(`/api/models/${modelName}/${fromYear}`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].year).toEqual(fromYear);
  });
  it('Gets a model from year to year', async () => {
    expect.assertions(4);
    const fromYear = 1960;
    const toYear = 2018;
    const res = await chai.request(App).get(`/api/models/${modelName}/${fromYear}/${toYear}`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].year).toEqual(fromYear);
    expect(res.body[res.body.length - 1].year).toEqual(toYear);
  });
  it('Gets a model from year to year, baselined', async () => {
    expect.assertions(4);
    const fromYear = 1960;
    const toYear = 2018;
    const baseLineFrom = 1961;
    const baseLineTo = 1999;
    const res = await chai.request(App)
      .get(`/api/models/${modelName}/${fromYear}/${toYear}/${baseLineFrom}/${baseLineTo}`);
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].year).toEqual(fromYear);
    expect(res.body[res.body.length - 1].year).toEqual(toYear);
  });
  it('Get model with boundaries', async () => {
    expect.assertions(60);
    const fromYear = 1960;
    const toYear = 2018;
    const res = await chai.request(App)
      .get(`/api/models/${modelName}/${fromYear}/${toYear}?upperBound=95&lowerBound=5`);
    expect(Array.isArray(res.body)).toBeTruthy();
    res.body.forEach(x => {
      expect(x.data.length).toEqual(2);
    });
  });
});

describe('Params', () => {
  it('Sends error on bad fromYear', async () => {
    expect.assertions(2);
    try {
      await chai.request(App).get(`/api/observations/hadcrut4Annual/-1990`);
    } catch (res) {
      expect(res.status).toEqual(400);
      expect(res.response.body.error).toEqual('fromYear must be a positive integer');
    }
  });
  it('Sends error on bad toYear', async () => {
    expect.assertions(2);
    try {
      await chai.request(App).get(`/api/observations/hadcrut4Annual/1990/-1992`);
    } catch (res) {
      expect(res.status).toEqual(400);
      expect(res.response.body.error).toEqual('toYear must be a positive integer');
    }
  });
  it('Sends error on bad baselineFrom', async () => {
    try {
      await chai.request(App).get(`/api/observations/hadcrut4Annual/1960/2000/-1994/1990`);
    } catch (res) {
      expect(res.status).toEqual(400);
      expect(res.response.body.error).toEqual('baseLineFrom must be a positive integer');
    }
  });
  it('Sends error on base baselineTo', async () => {
    try {
      await chai.request(App).get(`/api/observations/hadcrut4Annual/1960/2000/1994/-1990`);
    } catch (res) {
      expect(res.status).toEqual(400);
      expect(res.response.body.error).toEqual('baseLineTo must be a positive integer');
    }
  });
});
