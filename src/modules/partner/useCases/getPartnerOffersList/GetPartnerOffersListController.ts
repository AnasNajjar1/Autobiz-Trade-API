import { BaseController } from '../../../../core/infra/BaseController';
import { GetPartnerOffersListUseCase } from './GetPartnerOffersListUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { GetPartnerOffersListRequestDto } from './GetPartnerOffersListRequestDto';
import { PartnerOfferMap } from '../../mappers/PartnerOfferMap';

export class GetPartnerOffersListController extends BaseController {
  private useCase: GetPartnerOffersListUseCase;

  constructor(useCase: GetPartnerOffersListUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const filter = {
      id: request.q?.filter?.id,
      value: request.q?.filter?.value,
      partnerRequestId: request.q?.filter?.partnerRequestId,
    };

    try {
      const dto: GetPartnerOffersListRequestDto = {
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
          partners.rows.map((p) => PartnerOfferMap.toDto(p)),
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
