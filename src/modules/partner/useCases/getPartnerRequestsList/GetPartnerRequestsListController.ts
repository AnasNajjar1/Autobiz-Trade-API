import { BaseController } from '../../../../core/infra/BaseController';
import { GetPartnerRequestsListUseCase } from './GetPartnerRequestsListUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { GetPartnerRequestsListRequestDto } from './GetPartnerRequestsListRequestDto';
import { PartnerRequestMap } from '../../mappers/PartnerRequestMap';

export class GetPartnerRequestsListController extends BaseController {
  private useCase: GetPartnerRequestsListUseCase;

  constructor(useCase: GetPartnerRequestsListUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const filter = {
      id: request.q?.filter?.id,
      vehicleId: request.q?.filter?.vehicleId,
      statusId: request.q?.filter?.statusId,
      partnerId: request.q?.filter?.partnerId,
      fileNumber: request.q?.filter?.fileNumber,
      registrationLike: request.q?.filter?.registrationLike,
      createdBy: request.q?.filter?.createdBy,
      pointOfSaleId: request.q?.filter?.pointOfSaleId,
    };

    try {
      const dto: GetPartnerRequestsListRequestDto = {
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
          partners.rows.map((p) => PartnerRequestMap.toDto(p)),
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
