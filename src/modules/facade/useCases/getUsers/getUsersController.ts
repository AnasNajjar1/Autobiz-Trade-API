import Axios from 'axios';
import { get, set, filter, map } from 'lodash';
import models from '../../../../infra/sequelize/models';

export default async function getUsersController(event) {
  const { queryStringParameters } = event;
  let filter = get(queryStringParameters, 'filter', false);
  filter = JSON.parse(filter);
  const { id: appIds } = filter;

  try {
    let data = [];
    if (appIds) {
      //case we search for an id list, we need to search each country
      const autobizIds = {};

      appIds.forEach(function (id) {
        const { id: userId, country } = transformUserId(id);
        const array = get(autobizIds, country, []);
        array.push(userId);
        set(autobizIds, country, array);
      });
      for (const country of Object.keys(autobizIds)) {
        const result = await getUsersByIds(autobizIds[country], country);
        data = [...data, ...result];
      }
    } else {
      data = await getUsers(filter);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Expose-Headers': 'Content-Range',
        'Content-Range': `users 0-${data.length}/${data.length}`,
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Expose-Headers': 'Content-Range',
        'Content-Range': 'users 0-0/0',
      },
      body: error.message,
    };
  }
}

function transformUserId(userIdWithCountry) {
  if (
    [
      'offlineContext_cognitoAuthenticationProvider',
      'offlineContext_authorizer_principalId',
    ].includes(userIdWithCountry)
  ) {
    return { id: '1630593', country: 'FR' }; // test user offline -> replace to Marceau user
  }
  const splited = userIdWithCountry.split('_');
  const country = splited[0];
  const id = splited[1];
  return { id, country };
}

async function getUsersByIds(ids, country) {
  const autobizIdsString = ids.join(',');
  const response = await Axios.get(
    `${process.env.autobizApiPath}/users/v1/users?filter={"country":"${country}","ids":[${autobizIdsString}]}&country=${country}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.autobizApiSecretKey}`,
      },
    },
  );

  const data = [];
  let name = '';
  let id = '';

  if (!Array.isArray(response.data)) response.data = [response.data];
  response.data.map((user) => {
    const {
      firstname,
      lastname,
      email,
      companyId,
      phoneNumber,
      userId,
      dealershipId,
    } = user;
    name = `${firstname} ${lastname}`;
    id = `${country}_${userId.toString()}`;
    data.push({
      id,
      firstName: user.firstname,
      lastName: user.lastname,
      name,
      email,
      companyId,
      phoneNumber,
      dealershipId,
    });
  });

  return data;
}

async function getUsers(params) {
  const { country, autobizUserId } = params;

  if (!country) {
    return [];
  }
  if (autobizUserId) {
    const { id } = transformUserId(autobizUserId);
    params = { ...params, userId: id };
  }
  const path = `${
    process.env.autobizApiPath
  }/users/v1/users?country=${country}&filter=${JSON.stringify(params)}`;

  const response = await Axios.get(path, {
    headers: {
      Authorization: `Bearer ${process.env.autobizApiSecretKey}`,
    },
  });

  let data = [];
  let name = '';
  let id = '';

  if (!Array.isArray(response.data)) response.data = [response.data];
  filter(response.data, (u) => u.userId).map((user, key) => {
    name = user.firstname + ' ' + user.lastname;
    id = `${country}_${user.userId.toString()}`;
    data.push({
      ...user,
      id,
      firstName: user.firstname,
      lastName: user.lastname,
      name,
      email: user.email,
      companyId: user.companyId,
      dealershipId: user.dealershipId,
    });
  });
  data = await getUserAt(data);

  return data;
}

async function getUserAt(data) {
  let usersAt = await models.user.findAll({
    where: { autobizUserId: map(data, (u) => u.id) },
  });
  usersAt = map(usersAt, (u) => u.dataValues);

  const users = {};
  data.forEach((u) => (users[u.id] = u));
  usersAt.forEach((u) => set(users, `${u.autobizUserId}.groupUserId`, u.id));

  return Object.values(users);
}
