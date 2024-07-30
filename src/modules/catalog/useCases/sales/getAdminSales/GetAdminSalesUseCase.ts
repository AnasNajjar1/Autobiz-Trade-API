import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { ISaleRepo } from '../../../repos/saleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetAdminSalesRequestDto } from './GetAdminSalesRequestDto';
import { Sale } from '../../../domain/sale';
import { IApiUserService } from '../../../../../infra/autobizApi/ApiUserService';
import _ from 'lodash';
import { bestOffererDetailsMap } from '../../../mappers/bestOffererDetailsMap';
interface PaginatedSale {
  count: number;
  limit: number;
  offset: number;
  rows: Sale[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedSale>>;

export class GetAdminSalesUseCase
  implements UseCase<GetAdminSalesRequestDto, Promise<Response>>
{
  private saleRepo: ISaleRepo;
  private apiUserService: IApiUserService;

  constructor(saleRepo: ISaleRepo, apiUserService: IApiUserService) {
    this.saleRepo = saleRepo;
    this.apiUserService = apiUserService;
  }

  public async execute(request: GetAdminSalesRequestDto): Promise<Response> {
    try {
      const paginatedSales = await this.saleRepo.getAdminSalesList(request);
      return right(
        Result.ok<PaginatedSale>({
          ...paginatedSales,
          rows: request.filter.id
            ? await this.loadBestOffrerInfo(paginatedSales.rows)
            : paginatedSales.rows,
        }),
      );
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }

  private async loadBestOffrerInfo(sales: Sale[]) {
    const salesFilter = await Promise.all(
      sales.map(async (sale: Sale) => {
        let offererDetails = null;
        if (sale.bestOfferer) {
          try {
            const response = await this.apiUserService.getUserInfos(
              sale.bestOfferer,
            );
            if (response.isRight()) {
              const result = response.value.getValue();
              const { firstname, lastname, email, phoneNumber } = result;
              offererDetails = {
                fullName: firstname + ' ' + lastname,
                email,
                phoneNumber: phoneNumber,
              };
            }
          } catch (err) {
            console.log(err);
          }
        }
        sale.bestOffererDetails = offererDetails;
        return sale;
      }),
    );
    return salesFilter;
  }
}
