import { BaseController } from '../../../../core/infra/BaseController';
import { GetPartnersListUseCase } from './GetPartnersListUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { GetPartnersListRequestDto } from './GetPartnersListRequestDto';
import { PartnerMap } from '../../mappers/PartnerMap';

export class GetPartnersListController extends BaseController {
  private useCase: GetPartnersListUseCase;

  constructor(useCase: GetPartnersListUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const filter = {
      id: request.q?.filter?.id,
      name: request.q?.filter?.name,
    };

    try {
      const dto: GetPartnersListRequestDto = {
        limit: Number(request.q?.limit),
        offset: Number(request.q?.offset),
        sortBy: request.q?.sortBy,
        sortOrder: request.q?.sortOrder,
        filter,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const partners = result.value.getValue();

        return this.paginate(
          partners.rows.map((p) => PartnerMap.toDto(p)),
          {
            limit: partners.limit,
            offset: partners.offset,
            count: partners.count,
          },
        );
      } else {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
