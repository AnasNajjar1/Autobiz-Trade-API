import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { ISaleRepo } from '../../../repos/saleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { DeleteSaleRequestDto } from './DeleteSaleRequestDto';
import { DeleteSaleErrors } from './DeleteSaleErrors';
import { Sale } from '../../../domain/sale';

type Response = Either<
  AppError.UnexpectedError | AppError.UnexpectedError,
  Result<void>
>;

export class DeleteSaleUseCase
  implements UseCase<DeleteSaleRequestDto, Promise<Response>> {
  private saleRepo: ISaleRepo;

  constructor(saleRepo: ISaleRepo) {
    this.saleRepo = saleRepo;
  }

  public async execute(request: DeleteSaleRequestDto): Promise<Response> {
    const dto: DeleteSaleRequestDto = {
      id: request.id,
      user: request.user,
    };

    try {
      const sale = await this.saleRepo.getSaleById(dto.id);

      if (sale.validationStatus === 'VALIDATED') {
        return left(new DeleteSaleErrors.SaleIsValidatedError(dto.id));
      }
      try {
        await this.saleRepo.delete(dto.id, dto.user);
      } catch (error) {
        return left(new AppError.UnexpectedError(error));
      }
    } catch (error) {
      return left(new DeleteSaleErrors.SaleNotFoundError(dto.id));
    }

    return right(Result.ok<void>());
  }
}
