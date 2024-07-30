import { IImportQuotationRepo } from '../../../import/repos/importQuotationRepo';
import { ApiQuotationService } from '../../../../infra/autobizApi/ApiQuotationService/ApiQuotationService';

export class QuotationApiRepo implements IImportQuotationRepo {
  async getQuotationByVersion(filter) {
    const API = new ApiQuotationService();

    const response = await API.getQuotationByVersion(filter);

    if (response.isRight()) {
      const result = response.value.getValue();

      return Promise.resolve(result);
    }

    throw new Error(
      response ? response.value : "Can't resolve Autobiz Quotation API",
    );
  }

  async getQuotationByReference(filter) {
    const API = new ApiQuotationService();

    const response = await API.getQuotationByReference(filter);

    if (response.isRight()) {
      const result = response.value.getValue();
      return Promise.resolve(result);
    }

    throw new Error(
      response ? response.value : "Can't resolve Autobiz Quotation API",
    );
  }
}
