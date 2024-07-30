const request = require('supertest');
const { token } = require('../jwtAuthorizer');

describe('test pointofsale routes', () => {
  const server = request(`http://localhost:4000`);

  let newPointofsale;
  let newPointofsaleId;

  beforeEach(() => {
    newPointofsale = {
      name: 'XXX',
    };
  });

  it('[GET] should return not found when I try to get a non existing pointofsale', async () => {
    const resGet = await server
      .get('/admin/pointOfSale/99999999')
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(404);
  });

  it('[POST] should create a pointofsale with a name, and retrieve it with the new inserted id', async () => {
    const resPost = await server
      .post('/admin/pointOfSale/')
      .send(newPointofsale)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(resPost.statusCode).toEqual(201);
    newPointofsaleId = resPost.body.id;
    expect(newPointofsaleId).toBeTruthy();
  });

  it('[GET] should return a list of all pointofsales', async () => {
    const res = await server
      .get('/admin/pointOfSale/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.length).toBeGreaterThan(2);
    expect(res.statusCode).toEqual(200);
  });

  it('[GET] should return a empty list of point of sale when filtering an country without point of sale', async () => {
    const res = await server
      .get('/admin/pointOfSale?filter={"country":"jp"}')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.length).toEqual(0);
    expect(res.statusCode).toEqual(200);
  });

  it('[GET] should return a list of point of sale filtered by country germany', async () => {
    const res = await server
      .get('/admin/pointOfSale?filter={"country":"de"}')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  it('[GET] should return a paginated list of point of sale from 2 point of sale', async () => {
    const res = await server
      .get('/admin/pointOfSale?range=[0,1]')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.length).toEqual(2);
    expect(res.headers['content-range']).toContain('paginate 2-0/');
    expect(res.statusCode).toEqual(200);
  });

  it('[GET] should get a existing pointofsale from id', async () => {
    const resGet = await server
      .get('/admin/pointOfSale/' + newPointofsaleId)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.name).toBe(newPointofsale.name);
  });

  it('[PUT] should update a existing pointofsale from id', async () => {
    const resPut = await server
      .put('/admin/pointOfSale/' + newPointofsaleId)
      .send({
        id: newPointofsaleId,
        name: 'YYY',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(resPut.statusCode).toEqual(201);

    const resGet = await server
      .get('/admin/pointOfSale/' + newPointofsaleId)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.name).toBe('YYY');
  });

  it('[DELETE] should delete an existing pointofsale', async () => {
    const resDelete = await server
      .delete('/admin/pointOfSale/' + newPointofsaleId)
      .set('Authorization', `Bearer ${token}`);
    expect(resDelete.statusCode).toEqual(204);
    const resGet = await server
      .get('/admin/pointOfSale/' + newPointofsaleId)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(404);
  });
});
