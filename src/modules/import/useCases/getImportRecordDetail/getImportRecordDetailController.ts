import { BaseController } from '../../../../core/infra/BaseController';
import { GetImportRecordDetailUseCase } from './getImportRecordDetailUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

export class GetImportRecordDetailController extends BaseController {
  private useCase: GetImportRecordDetailUseCase;

  constructor(useCase: GetImportRecordDetailUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const filter = request.queryString?.filter
      ? JSON.parse(request.queryString.filter)
      : {};

    const importRecordId: number = request.path.any?.split('/').pop();
    try {
      const result = await this.useCase.execute(importRecordId);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const detail = result.value.getValue();

        const mappedVehicle = {
          id: Number(importRecordId),
          brandLabel: detail.vehicle?.brandLabel,
          modelLabel: detail.vehicle?.modelLabel,
          fileNumber: detail.record?.refHexaId,
          mileage: detail.vehicleExpertise?.mileage,
          pointofsale: {
            name: detail.pointOfSale.pointOfSaleName,
            zipCode: detail.pointOfSale.zipCode,
            city: detail.pointOfSale.city,
          },
        };

        return this.ok(mappedVehicle);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
