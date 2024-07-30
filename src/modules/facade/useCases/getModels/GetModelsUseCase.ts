import { Result, Either, right, left } from '../../../../core/logic/Result';
import { IModelRepo } from '../../repos/modelRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetModelsErrors } from './GetModelsErrors';

type Response = Either<GetModelsErrors.CantResolveReferentialApi, Result<any>>;

export class GetModelsUseCase implements UseCase<string, Promise<Response>> {
  private modelRepo: IModelRepo;

  constructor(modelRepo: IModelRepo) {
    this.modelRepo = modelRepo;
  }

  public async execute(brandLabel: string): Promise<Response> {
    try {
      const models = await this.modelRepo.getModels(brandLabel);

      return right(Result.ok<any>(models));
    } catch (err) {
      return left(new GetModelsErrors.CantResolveReferentialApi());
    }
  }
}
