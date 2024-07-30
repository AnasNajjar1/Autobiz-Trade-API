import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { ISaleRepo } from '../../../repos/saleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetSaleInfoRequestDto } from './GetSaleInfoRequestDto';
import { Sale } from '../../../domain/sale';
import { GetSaleInfoErrors } from './GetSaleInfoErrors';

type Response = Either<
  AppError.UnexpectedError | GetSaleInfoErrors.SaleNotFoundError,
  Result<Sale>
>;

export class GetSaleInfoUseCase
  implements UseCase<GetSaleInfoRequestDto, Promise<Response>> {
  private saleRepo: ISaleRepo;

  constructor(saleRepo: ISaleRepo) {
    this.saleRepo = saleRepo;
  }

  public async execute(request: GetSaleInfoRequestDto): Promise<Response> {
    try {
      const sale = await this.saleRepo.getSaleInfo(
        request.uuid,
        request.userId,
      );
      return right(Result.ok<Sale>(sale));
    } catch (err) {
      return left(
        new GetSaleInfoErrors.SaleNotFoundError(request.uuid),
      ) as Response;
    }
  }
}
