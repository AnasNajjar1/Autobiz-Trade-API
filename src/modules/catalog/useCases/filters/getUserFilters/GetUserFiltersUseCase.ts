import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetUserFiltersRequestDto } from './GetUserFiltersRequestDto';
import { ISaleRepo } from '../../../repos/saleRepo';
import { GetUserFiltersResponseDto } from './GetUserFiltersResponsetDto';
import { IListRepo } from '../../../../list/repos/listRepo';
import { ListMap } from '../../../../list/mappers/ListMap';
import vehicle from '../../../../../infra/sequelize/models/vehicle';

type Response = Either<
  AppError.UnexpectedError,
  Result<GetUserFiltersResponseDto>
>;

export class GetUserFiltersUseCase
  implements UseCase<GetUserFiltersRequestDto, Promise<Response>> {
  private saleRepo: ISaleRepo;
  private listRepo: IListRepo;

  constructor(saleRepo: ISaleRepo, listRepo: IListRepo) {
    this.saleRepo = saleRepo;
    this.listRepo = listRepo;
  }

  public async execute(request: GetUserFiltersRequestDto): Promise<Response> {
    try {
      const { list } = request.filter || {};
      let brandModelFilter;
      switch (list) {
        case 'my_bookmarked_sales':
          brandModelFilter = await this.saleRepo.getBookmarkedSales(request);
          break;
        case 'my_purchases':
          brandModelFilter = await this.saleRepo.getPurchasedSales(request);
          break;

        case 'my_dealers':
          brandModelFilter = await this.saleRepo.getBookmarkedPointofsalesSales(
            request,
          );
          break;

        case 'my_offers':
          brandModelFilter = await this.saleRepo.getUserOffersSales(request);
          break;

        default:
          brandModelFilter = await this.saleRepo.getOnlineSalesList(request);
          break;
      }
      const [brandModelList, listList] = await Promise.all([
        brandModelFilter.rows.length != 0 ? brandModelFilter.rows : [],
        this.listRepo.getOnlineListsByUser(request.userId),
      ]);
      const brands = [];
      const models = {};

      brandModelList.map((sale) => {
        const brand = sale.vehicle.brandLabel;
        const model = sale.vehicle.modelLabel;
        if (brands.indexOf(brand) === -1) {
          brands.push(brand);
          models[brand] = [];
        }
        if (models[brand].indexOf(model) === -1) {
          models[brand].push(model);
        }
      });
      const res: GetUserFiltersResponseDto = {
        brands,
        models,
        lists: listList.rows.map((l) => ListMap.toPublicDto(l)),
      };

      return right(Result.ok(res));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
