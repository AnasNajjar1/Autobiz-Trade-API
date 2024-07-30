const axios = require('axios');
import * as dynamoDbLib from '../dynamodb/dynamodb-lib';

export async function getUserInfos(userId) {
  const regex = new RegExp('^[a-zA-Z]+_([0-9]+)$');

  if (!regex.test(userId)) {
    return false;
  }

  const userInfos = userId.split('_');
  const country = userInfos[0];
  const idCrm = userInfos[1];

  const autobizUser = await axios.get(
    `${process.env.autobizApiPath}/users/v1/users/${idCrm}?country=${country}`,
    {
      headers: {
        Authorization: `Basic ${process.env.autobizApiSecretKey}`,
      },
    },
  );

  const userData = autobizUser.data;
  userData.country = country;
  return userData;
}

export async function getAllUsers() {
  const params = {
    TableName: process.env.userLoginTableName,
    ProjectionExpression: 'userId',
  };
  const result = await dynamoDbLib.call('scan', params);
  return result.Items;
}

export async function getCarcheckSource(sourceId) {
  const res = await axios.get(
    `${process.env.carcheckApiPath}/sources/${sourceId}`,
    {
      headers: {
        Authorization: `Basic ${process.env.autobizApiSecretKey}`,
      },
    },
  );
  return res.data.source;
}
