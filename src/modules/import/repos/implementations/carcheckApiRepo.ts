import { IImportRecordRepo } from '../../../import/repos/importRecordRepo';
import { ApiCarcheckService } from '../../../../infra/autobizApi/ApiCarcheckService';

export class CarcheckApiRepo implements IImportRecordRepo {
  async getRecordsList(filter) {
    const API = new ApiCarcheckService();

    const response = await API.searchRecords(filter);

    if (response.isRight()) {
      const list = response.value.getValue();

      const result = {
        limit: list.length,
        offset: 0,
        rows: list,
        count: list.length,
      };

      return Promise.resolve(result);
    }

    throw new Error("Can't resolve Autobiz Carcheck API");
  }
  async getRecordDetail(recordId: number) {
    const API = new ApiCarcheckService();

    const response = await API.getRecordDetail(recordId);

    if (response.isRight()) {
      const record = response.value.getValue();
      return Promise.resolve(record);
    }

    throw new Error("Can't resolve Autobiz Carcheck API");
  }

  async getSource(sourceId: number) {
    const API = new ApiCarcheckService();

    const response = await API.getSource(sourceId);

    if (response.isRight()) {
      const record = response.value.getValue();
      return Promise.resolve(record);
    }

    throw new Error("Can't resolve Autobiz Carcheck API");
  }

  async getInspection(inspectionId: number) {
    const API = new ApiCarcheckService();

    const response = await API.getInspection(inspectionId);

    if (response.isRight()) {
      const record = response.value.getValue();
      return Promise.resolve(record);
    }

    throw new Error("Can't resolve Autobiz Carcheck API");
  }
}
