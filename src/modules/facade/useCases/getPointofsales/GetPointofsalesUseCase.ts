import { Result, Either, right, left } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetPointofsalesRequestDto } from './GetPointofsalesRequestDto';
import { AutobizDealerImporter } from '../../../../infra/import/dealer/AutobizDealerImporter';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class GetPointofsalesUseCase
  implements UseCase<GetPointofsalesRequestDto, Promise<Response>> {
  constructor() {}

  public async execute(dto: GetPointofsalesRequestDto): Promise<Response> {
    try {
      const autobizDealerImport = new AutobizDealerImporter();

      let id;
      if (dto.ids && dto.ids.length > 0) {
        id = dto.ids[0].toString();
      } else {
        id = dto.id.toString();
      }

      const pointofsales = await autobizDealerImport.getDealer(id, dto.country);

      const result = {
        limit: 1,
        offset: 0,
        rows: [pointofsales],
        count: 1,
      };

      return right(Result.ok<any>(result));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
