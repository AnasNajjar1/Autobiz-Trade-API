import * as dynamoDbLib from '../../infra/dynamodb/dynamodb-lib';

async function main(type) {
  const config = await getConfig(type);
  config.id = type;
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(config),
  };
}

export default main;

export async function getConfig(type) {
  const configRequest = {
    TableName: process.env.configTableName,
    Key: {
      type,
    },
  };
  const result = await dynamoDbLib.call('get', configRequest);

  const { body } = result.Item || {};

  if (body === undefined) throw new Error('can not get config.');
  return JSON.parse(result.Item.body);
}
