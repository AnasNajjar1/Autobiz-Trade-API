import * as dynamoDbLib from '../../infra/dynamodb/dynamodb-lib';

async function main(event, type) {
  const { body } = event;

  const configData = {
    TableName: process.env.configTableName,
    Item: {
      type,
      body,
    },
  };
  await dynamoDbLib.call('put', configData);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ id: type }),
  };
}

export default main;
