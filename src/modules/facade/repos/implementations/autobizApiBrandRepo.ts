import { IBrandRepo } from '../brandRepo';
import { BrandMap } from '../../mappers/BrandMap';
import { ApiReferentialService } from '../../../../infra/autobizApi/ApiReferentialService/ApiReferentialService';

export class AutobizApiBrandRepo implements IBrandRepo {
  async getBrands() {
    const API = new ApiReferentialService();

    const response = await API.getMakes();

    if (response.isRight()) {
      const brands = response.value.getValue();

      const result = {
        limit: brands.length,
        offset: 0,
        rows: brands.map((p) => BrandMap.toDomain(p)),
        count: brands.length,
      };

      return Promise.resolve(result);
    }

    throw new Error("Can't resolve Autobiz API");
  }
}
