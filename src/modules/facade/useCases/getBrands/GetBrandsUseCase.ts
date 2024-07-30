import { Result, Either, right, left } from '../../../../core/logic/Result';
import { IBrandRepo } from '../../repos/brandRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetBrandsErrors } from './GetBrandsErrors';

type Response = Either<GetBrandsErrors.CantResolveReferentialApi, Result<any>>;

export class GetBrandsUseCase implements UseCase<void, Promise<Response>> {
  private brandRepo: IBrandRepo;

  constructor(brandRepo: IBrandRepo) {
    this.brandRepo = brandRepo;
  }

  public async execute(): Promise<Response> {
    try {
      const brands = await this.brandRepo.getBrands();

      return right(Result.ok<any>(brands));
    } catch (err) {
      return left(new GetBrandsErrors.CantResolveReferentialApi());
    }
  }
}
