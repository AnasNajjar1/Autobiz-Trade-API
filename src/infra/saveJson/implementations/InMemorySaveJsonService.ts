import { ISaveJsonService } from '../SaveJsonService';

export class InMemorySaveJsonService implements ISaveJsonService {
  private logs = [];
  async saveLog(request) {
    this.logs.push(request);
  }
}
