import { ILoggerService, LogRequest } from '../LoggerService';

export class InMemoryLoggerService implements ILoggerService {
  private logs = [];

  async log(log: LogRequest) {
    this.logs.push({
      createdAt: new Date().toISOString(),
      ...log,
    });
    return true;
  }
}
