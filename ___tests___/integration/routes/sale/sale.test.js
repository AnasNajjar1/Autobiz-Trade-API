const request = require('supertest');
const { token } = require('../jwtAuthorizer');

describe('test sale routes', () => {
  const server = request('http://localhost:4000');

  it('[GET] should get list of online sales', async () => {
    const res = await server
      .get('/sale')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
