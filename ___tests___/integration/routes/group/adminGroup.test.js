const request = require('supertest');
const { token } = require('../jwtAuthorizer');

describe('test group routes', () => {
  const server = request(`http://localhost:4000`);

  let newGroup;

  let newGroupId;

  beforeEach(() => {
    newGroup = {
      name: 'XXX',
    };
  });

  it('[GET] should return not found when I try to get a non existing group', async () => {
    const resGet = await server
      .get('/admin/group/99999999')
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(404);
  });

  it('[POST] should create a group with a name, and retrieve it with the new inserted id', async () => {
    const resPost = await server
      .post('/admin/group/')
      .send(newGroup)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(resPost.statusCode).toEqual(201);
    newGroupId = resPost.body.id;
    expect(newGroupId).toBeTruthy();
  });

  it('[GET] should return a list of all groups', async () => {
    const res = await server
      .get('/admin/group/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.statusCode).toEqual(200);
  });

  it('[GET] should get a existing group from id', async () => {
    const resGet = await server
      .get('/admin/group/' + newGroupId)
      .set('Authorization', `Bearer ${token}`);

    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.name).toBe(newGroup.name);
  });

  it('[PUT] should update a existing group from id', async () => {
    const resPut = await server
      .put('/admin/group/' + newGroupId)
      .send({
        id: newGroupId,
        name: 'YYY',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(resPut.statusCode).toEqual(201);

    const resGet = await server
      .get('/admin/group/' + newGroupId)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.name).toBe('YYY');
  });

  it('[DELETE] should delete an existing group', async () => {
    const resDelete = await server
      .delete('/admin/group/' + newGroupId)
      .set('Authorization', `Bearer ${token}`);
    expect(resDelete.statusCode).toEqual(204);
    const resGet = await server
      .get('/admin/group/' + newGroupId)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(404);
  });
});
