import { Log } from '../../logger/LoggerService';
import { call as dynamodb } from '../../dynamodb/dynamodb-lib';
import { UuidUniqueEntityId } from '../../uniqueIdentifier/uuidV4-uniqueIdentifier';
import { ISaveJsonService } from '../SaveJsonService';

export class DynamoDBService implements ISaveJsonService {
  async saveLog(log: Log) {
    const { userId, saleId, requestPath, details, createdAt } = log;
    const Item = {
      createdAt,
      userId,
      uuid: new UuidUniqueEntityId().generate(),
      saleId,
      requestPath,
      details,
      date: createdAt.substr(0, 10),
    };

    const logDynamo = {
      TableName: process.env.logTableName,
      Item,
    };

    await dynamodb('put', logDynamo);
  }
}
