import { IModelRepo } from '../modelRepo';
import { ModelMap } from '../../mappers/ModelMap';
import { Model, ModelProps } from '../../domain/model';

export class InMemoryModelRepo implements IModelRepo {
  private mockedModels;

  public constructor(mock?: any) {
    if (mock) {
      this.mockedModels = mock;
    } else {
      this.mockedModels = [
        {
          id: 1,
          name: 'MODEL XXX',
        },
        {
          id: 2,
          name: 'MODEL YYY',
        },
      ];
    }
  }

  public getModels(brandLabel) {
    const models = this.mockedModels;

    const result = {
      limit: 24,
      offset: 0,
      rows: models.map((p) => ModelMap.toDomain(p)),
      count: this.mockedModels.length,
    };

    return Promise.resolve(result);
  }
}
