const request = require('supertest');
const { token } = require('../jwtAuthorizer');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

describe('test user routes', () => {
  const server = request(`http://localhost:4000`);

  let newVehicle;
  let newVehicleId;

  beforeAll(() => {
    newVehicle = {
      fileNumber: 'test_' + getRandomInt(9999),
      statusId: 1,
    };
  });

  it('[POST] should create a vehicle and retrieve it with the new inserted id', async () => {
    const resPost = await server
      .post('/admin/vehicle/')
      .send(newVehicle)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(resPost.statusCode).toEqual(201);

    newVehicleId = resPost.body.id;
    expect(newVehicleId).toBeTruthy();
  });
});
