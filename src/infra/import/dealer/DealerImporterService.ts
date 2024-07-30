export interface IDealerImporterService {
  getDealer(code: string, country?: string): Promise<any>;
}

export class DealerImporterService implements IDealerImporterService {
  private dealerImporterService: IDealerImporterService;

  constructor(dealerImporterService: IDealerImporterService) {
    this.dealerImporterService = dealerImporterService;
  }

  async getDealer(code: string, country?: string) {
    return this.dealerImporterService.getDealer(code, country);
  }
}
