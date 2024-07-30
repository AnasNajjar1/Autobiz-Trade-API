import { ILoggerService, LogRequest, Log } from '../LoggerService';
import { UuidUniqueEntityId } from '../../uniqueIdentifier/uuidV4-uniqueIdentifier';
import { IMessengerService } from '../../messenger/MessengerService';

export class AWSLoggerService implements ILoggerService {
  private messengerService: IMessengerService;

  constructor(messengerService: IMessengerService) {
    this.messengerService = messengerService;
  }

  async log(log: LogRequest) {
    const { userId, saleId, requestPath, details, uuid } = log;

    const now = new Date().toISOString();

    const logFormated: Log = {
      createdAt: now,
      userId,
      uuid,
      saleId,
      requestPath,
      details,
    };

    await this.messengerService.publishMessage('logCall', logFormated);
    return true;
  }
}
