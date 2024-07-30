import { AWSLoggerService } from './implementations/AWSLoggerService';
import { messengerService } from '../messenger';

const loggerService = new AWSLoggerService(messengerService);

export { loggerService };
