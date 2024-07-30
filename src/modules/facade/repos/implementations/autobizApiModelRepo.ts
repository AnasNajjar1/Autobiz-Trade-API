import { IModelRepo } from '../modelRepo';
import { ModelMap } from '../../mappers/ModelMap';
import { ApiReferentialService } from '../../../../infra/autobizApi/ApiReferentialService/ApiReferentialService';

interface Make {
  id: number;
  name: string;
}

export class AutobizApiModelRepo implements IModelRepo {
  async getModels(brandLabel) {
    const API = new ApiReferentialService();

    const responseMakes = await API.getMakes();

    if (responseMakes.isRight()) {
      const makes: any = responseMakes.value.getValue();
      const selectedMake = makes.find((m) => m.name == brandLabel);

      if (selectedMake) {
        const response = await API.getModels(selectedMake.id);

        if (response.isRight()) {
          const models = response.value.getValue();

          const result = {
            limit: models.length,
            offset: 0,
            rows: models.map((p) => ModelMap.toDomain(p)),
            count: models.length,
          };

          return Promise.resolve(result);
        } else {
          console.info(response);
        }
      } else {
        const result = {
          limit: 0,
          offset: 0,
          rows: [],
          count: 0,
        };

        return Promise.resolve(result);
      }
    } else {
      console.info(responseMakes);
    }
  }
}
