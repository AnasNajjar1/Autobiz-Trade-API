const request = require('supertest');
const { v1: uuidv1 } = require('uuid');
const moment = require('moment');
const { token } = require('../jwtAuthorizer');

describe('test list routes', () => {
  const server = request(`http://localhost:4000`);

  let newList;
  let updatedList;

  let newListId;
  let countListInAdmin;

  beforeAll(() => {
    const today = moment();
    const tomorrow = moment().add(1, 'days');

    newList = {
      name: uuidv1(),
      picture: 'http://lorempixel.com/400/200/',
      startDateTime: today,
      endDateTime: today,
      groupId: 1,
    };

    updatedList = {
      name: uuidv1(),
      picture: 'http://lorempixel.com/800/400/',
      startDateTime: tomorrow,
      endDateTime: tomorrow,
      groupId: 3,
    };
  });

  it('[ADMIN][GET] should return a list of all lists', async () => {
    const res = await server
      .get('/admin/list/')
      .set('Authorization', `Bearer ${token}`);
    countListInAdmin = res.body.length;
    expect(res.statusCode).toEqual(200);
  });

  it('[ADMIN][GET] should return not found when I try to get a non existing list', async () => {
    const resGet = await server
      .get('/admin/list/99999999')
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(404);
  });

  it('[ADMIN][POST] should create a list with, and retrieve it with the new inserted id', async () => {
    const resPost = await server
      .post('/admin/list/')
      .send(newList)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(resPost.statusCode).toEqual(201);
    newListId = resPost.body.id;
    expect(newListId).toBeTruthy();
  });

  it('[ADMIN][GET] should return a list of all lists', async () => {
    const res = await server
      .get('/admin/list/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.length).toBe(countListInAdmin + 1);
    expect(res.statusCode).toEqual(200);
  });

  it('[ADMIN][GET] should get a existing list from id', async () => {
    const resGet = await server
      .get('/admin/list/' + newListId)
      .set('Authorization', `Bearer ${token}`);
    const createdList = resGet.body;
    expect(resGet.statusCode).toEqual(200);
  });

  it('[ADMIN][PUT] should update a existing list from id', async () => {
    updatedList.id = newListId;
    const resPut = await server
      .put('/admin/list/' + newListId)
      .send(updatedList)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(resPut.statusCode).toEqual(201);
  });

  it('[ADMIN][DELETE] should delete an existing list', async () => {
    const resDelete = await server
      .delete('/admin/list/' + newListId)
      .set('Authorization', `Bearer ${token}`);
    expect(resDelete.statusCode).toEqual(200);
    const resGet = await server
      .get('/admin/list/' + newListId)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.statusCode).toEqual(404);
  });
});
