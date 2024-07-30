import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { ISaleRepo } from '../../../repos/saleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetOnlineSalesRequestDto } from './GetOnlineSalesRequestDto';
import { Sale } from '../../../domain/sale';

interface PaginatedSale {
  count: number;
  limit: number;
  offset: number;
  rows: Sale[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedSale>>;

export class GetOnlineSalesUseCase
  implements UseCase<GetOnlineSalesRequestDto, Promise<Response>> {
  private saleRepo: ISaleRepo;

  constructor(saleRepo: ISaleRepo) {
    this.saleRepo = saleRepo;
  }

  public async execute(request: GetOnlineSalesRequestDto): Promise<Response> {
    try {
      const { list } = request.filter || {};
      let paginatedSales;
      switch (list) {
        case 'my_bookmarked_sales':
          paginatedSales = await this.saleRepo.getBookmarkedSales(request);
          break;
        case 'my_purchases':
          paginatedSales = await this.saleRepo.getPurchasedSales(request);
          break;

        case 'my_dealers':
          paginatedSales = await this.saleRepo.getBookmarkedPointofsalesSales(
            request,
          );
          break;

        case 'my_offers':
          paginatedSales = await this.saleRepo.getUserOffersSales(request);
          break;

        default:
          paginatedSales = await this.saleRepo.getOnlineSalesList(request);
          break;
      }

      return right(Result.ok<PaginatedSale>(paginatedSales));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
