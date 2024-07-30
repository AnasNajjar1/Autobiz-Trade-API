import { Mapper } from '../../../core/infra/Mapper';
import { Model } from '../domain/model';
import { ModelDto } from '../dtos/modelDto';

export class ModelMap implements Mapper<Model> {
  public static toDomain(raw: any): Model {
    const modelOrError = Model.create({
      id: raw.id,
      name: raw.name,
    });

    modelOrError.isFailure ? console.warn(modelOrError.error) : '';

    return modelOrError.isSuccess ? modelOrError.getValue() : null;
  }

  public static toDto(model): ModelDto {
    return {
      id: model.name,
      name: model.name,
    };
  }
}
