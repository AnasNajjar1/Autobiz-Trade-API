import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { ISaleRepo } from '../../../repos/saleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetAggregationsRequestDto } from './GetAggregationsRequestDto';
import { GetAggregationsResponseDto } from './GetAggregationsResponsetDto';

type Response = Either<
  AppError.UnexpectedError,
  Result<GetAggregationsResponseDto>
>;

export class GetAggregationsUseCase
  implements UseCase<GetAggregationsRequestDto, Promise<Response>>
{
  private saleRepo: ISaleRepo;

  constructor(saleRepo: ISaleRepo) {
    this.saleRepo = saleRepo;
  }

  public async execute(request: GetAggregationsRequestDto): Promise<Response> {
    try {
      const { list } = request.filter || {};
      let sales;
      switch (list) {
        case 'my_bookmarked_sales':
          sales = await this.saleRepo.getBookmarkedSales(request);
          break;
        case 'my_purchases':
          sales = await this.saleRepo.getPurchasedSales(request);
          break;

        case 'my_dealers':
          sales = await this.saleRepo.getBookmarkedPointofsalesSales(request);
          break;

        case 'my_offers':
          sales = await this.saleRepo.getUserOffersSales(request);
          break;

        default:
          sales = await this.saleRepo.getOnlineSalesList(request);
          break;
      }

      const countries = {};
      sales.rows.map((sale) => {
        const country =
          sale.vehicle.pointofsale?.country?.value ||
          sale.vehicle.pointofsale?.country;
        countries[country] = (countries[country] || 0) + 1;
      });

      const countOfferToPrivate = await this.countOfferToPrivate({
        ...request,
        filter: { supplyType: 'OFFER_TO_PRIVATE' },
      });
      const res: GetAggregationsResponseDto = {
        countries,
        countOfferToPrivate,
      };
      return right(Result.ok(res));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }

  private async countOfferToPrivate(request: any) {
    let countOfferToPrivateString = null;
    const offerToPrivateList = await this.saleRepo.getOnlineSalesList(request);
    const countOfferToPrivate = offerToPrivateList.rows?.length;
    if (countOfferToPrivate !== 0)
      countOfferToPrivateString = String(
        countOfferToPrivate <= 50 ? countOfferToPrivate : '+50',
      );
    return countOfferToPrivateString;
  }
}
