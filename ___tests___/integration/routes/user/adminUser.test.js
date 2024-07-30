const request = require('supertest');
const { token } = require('../jwtAuthorizer');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

describe('test user routes', () => {
  const server = request(`http://localhost:4000`);

  let newUser;
  let newUserId;

  const randomAutobizUserId = 'FR_' + getRandomInt(99999);

  beforeAll(() => {
    newUser = {
      autobizUserId: randomAutobizUserId,
      notificationDaily: false,
      notificationNewPush: true,
      notificationAuction: true,
      inGroups: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
      hasGroups: [
        {
          id: 3,
        },
      ],
    };
  });

  it('[GET] should return not found when I try to get a non existing user', async () => {
    const resGet = await server
      .get('/admin/groupUser/99999999')
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(404);
  });

  it('[POST] should create a user with an autobizUserId, and retrieve it with the new inserted id', async () => {
    const resPost = await server
      .post('/admin/groupUser/')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(resPost.statusCode).toEqual(201);
    newUserId = resPost.body.id;
    expect(newUserId).toBeTruthy();
  });

  it('[POST] should return a conflit response when i tried to insert a user who already exists', async () => {
    const resPost = await server
      .post('/admin/groupUser/')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(resPost.statusCode).toEqual(409);
  });

  it('[GET] should return a list of all users', async () => {
    const res = await server
      .get('/admin/groupUser/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].autobizUserId).toBe(randomAutobizUserId);
    expect(res.statusCode).toEqual(200);
  });

  it('[GET] should get a existing user from id', async () => {
    const resGet = await server
      .get('/admin/groupUser/' + newUserId)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.autobizUserId).toBe(newUser.autobizUserId);
  });

  it('[PUT] should update a existing user from id', async () => {
    const resPut = await server
      .put('/admin/groupUser/' + newUserId)
      .send({
        id: newUserId,
        notificationDaily: true,
        notificationNewPush: false,
        notificationAuction: false,
        inGroups: [
          {
            id: 2,
          },
          {
            id: 3,
          },
        ],
        hasGroups: [
          {
            id: 2,
          },
        ],
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(resPut.statusCode).toEqual(201);

    const resGet = await server
      .get('/admin/groupUser/' + newUserId)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.notificationDaily).toBe(true);
    expect(resGet.body.notificationNewPush).toBe(false);
    expect(resGet.body.notificationAuction).toBe(false);
    expect(resGet.body.inGroups[0].id).toBe(2);
    expect(resGet.body.inGroups[1].id).toBe(3);
    expect(resGet.body.hasGroups[0].id).toBe(2);
  });

  it('[DELETE] should delete an existing user', async () => {
    const resDelete = await server
      .delete('/admin/groupUser/' + newUserId)
      .set('Authorization', `Bearer ${token}`);
    expect(resDelete.statusCode).toEqual(200);
    const resGet = await server
      .get('/admin/groupUser/' + newUserId)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(404);
  });
});
