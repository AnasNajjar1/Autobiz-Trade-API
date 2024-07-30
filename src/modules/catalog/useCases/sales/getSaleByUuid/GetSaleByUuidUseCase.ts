import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { ISaleRepo } from '../../../repos/saleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetSaleByUuidRequestDto } from './GetSaleByUuidRequestDto';
import { Sale } from '../../../domain/sale';
import { SaleService } from '../../../domain/services/saleService';
import { GetSaleByUuidErrors } from './GetSaleByUuidErrors';

type Response = Either<
  AppError.UnexpectedError | GetSaleByUuidErrors.SaleNotFoundError,
  Result<Sale>
>;

export class GetSaleByUuidUseCase
  implements UseCase<GetSaleByUuidRequestDto, Promise<Response>> {
  private saleRepo: ISaleRepo;
  private saleService: SaleService;

  constructor(saleRepo: ISaleRepo, saleService: SaleService) {
    this.saleRepo = saleRepo;
    this.saleService = saleService;
  }

  public async execute(request: GetSaleByUuidRequestDto): Promise<Response> {
    try {
      let sale = await this.saleRepo.getSaleByUuid(
        request.uuid,
        request.userId,
      );

      const saleOrError = await this.saleService.filterSale(sale);

      if (saleOrError.isRight()) {
        sale = saleOrError.value;
        return right(Result.ok<Sale>(sale));
      } else {
        return left(
          new GetSaleByUuidErrors.SaleCanNotBeFiltered(request.uuid),
        ) as Response;
      }
    } catch (err) {
      return left(
        new GetSaleByUuidErrors.SaleNotFoundError(request.uuid),
      ) as Response;
    }
  }
}
