import { DynamoDBService } from './implementations/DynamoDBService';

const saveJsonService = new DynamoDBService();

export { saveJsonService };
