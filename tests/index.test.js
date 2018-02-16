const chai = require('chai');
chai.use(require('chai-http'));

const { App } = require('../index.js');

describe('App loads', () => {
  it('index available', async () => {
    expect.assertions(1);
    const res = await chai.request(App).get('/');
    expect(res.status).toEqual(200);
  });
});
