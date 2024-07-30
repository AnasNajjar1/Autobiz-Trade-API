import { Log } from '../logger/LoggerService';

export interface ISaveJsonService {
  saveLog(log: Log): Promise<void>;
}
