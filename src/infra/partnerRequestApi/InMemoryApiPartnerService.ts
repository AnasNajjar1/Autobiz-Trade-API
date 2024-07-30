import { left, Result, right } from '../../core/logic/Result';
import { IApiPartnerRequestService } from './IApiPartnerService';

export class InMemoryApiPartnerService implements IApiPartnerRequestService {
  private mocked;
  constructor(mocked = []) {
    this.mocked = mocked;
  }
  public async sendPartnerRequest(partner, vehicle, schema, url) {
    return right('Partner request sended');
  }
}