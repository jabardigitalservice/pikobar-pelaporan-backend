const request = require('supertest');
const dummyUrl = 'https://github.com/jabardigitalservice/pikobar-pelaporan-backend'

// eslint-disable-next-line no-undef
describe('api/v1/user ', () => {
  // eslint-disable-next-line no-undef
  it('not found page', (done) => {
    request(dummyUrl)
      .get('/users')
      .expect(404, done);
  });
});
