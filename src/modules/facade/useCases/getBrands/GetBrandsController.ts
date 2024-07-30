import { BaseController } from '../../../../core/infra/BaseController';
import { GetBrandsUseCase } from './GetBrandsUseCase';
import { BrandMap } from '../../mappers/BrandMap';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { BrandDto } from '../../dtos/brandDto';

interface Request {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
  filter?: {};
}

interface Response {
  limit: number;
  offset: number;
  rows: Array<BrandDto>;
  count: number;
}

export class GetBrandsController extends BaseController {
  private useCase: GetBrandsUseCase;

  constructor(useCase: GetBrandsUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const brands = result.value.getValue();

        return this.paginate<Response>(
          brands.rows.map((p) => BrandMap.toDto(p)),
          {
            limit: brands.limit,
            offset: brands.offset,
            count: brands.count,
          },
        );
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
