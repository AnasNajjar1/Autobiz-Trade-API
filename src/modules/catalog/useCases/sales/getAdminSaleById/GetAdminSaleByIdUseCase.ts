import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { ISaleRepo } from '../../../repos/saleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetAdminSaleByIdRequestDto } from './GetAdminSaleByIdRequestDto';
import { Sale } from '../../../domain/sale';

type Response = Either<AppError.UnexpectedError, Result<Sale>>;

export class GetAdminSaleByIdUseCase
  implements UseCase<GetAdminSaleByIdRequestDto, Promise<Response>> {
  private saleRepo: ISaleRepo;

  constructor(saleRepo: ISaleRepo) {
    this.saleRepo = saleRepo;
  }

  public async execute(request: GetAdminSaleByIdRequestDto): Promise<Response> {
    try {
      const sale = await this.saleRepo.getSaleById(Number(request.id));

      return right(Result.ok<Sale>(sale));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
