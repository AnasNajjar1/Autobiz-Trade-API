import { Mapper } from '../../../core/infra/Mapper';
import { PartnerRequest } from '../domain/partnerRequest';
import { PartnerRequestDto } from '../dtos/partnerRequestDto';
import { decodeString } from '../../../shared/helpers/others/StringDecoder';
import { VehicleMap } from '../../catalog/mappers/VehicleMap';

export class PartnerRequestMap implements Mapper<PartnerRequest> {
  public static toDomain(raw: any): PartnerRequest {
    const partnerRequestOrError = PartnerRequest.create(
      {
        uuid: raw.uuid,
        vehicleId: raw.vehicleId,
        partnerId: raw.partnerId,
        partnerName: raw.partner?.name,
        statusId: raw.statusId,
        comment: raw.comment,
        saleComment: decodeString(raw.saleComment),
        statusName: raw.partnerrequeststatus?.name,
        lastOfferCreatedAt: raw.partnerlastoffer?.createdAt,
        value: raw.partnerlastoffer?.value,
        offerComment: raw.partnerlastoffer?.comment,
        createdAt: raw.createdAt,
        createdBy: raw.createdBy,
        vehicle: raw.vehicle ? VehicleMap.toDomain(raw.vehicle) : undefined,
      },
      raw.id,
    );

    partnerRequestOrError.isFailure
      ? console.warn(partnerRequestOrError.error)
      : '';

    return partnerRequestOrError.isSuccess
      ? partnerRequestOrError.getValue()
      : null;
  }

  public static toDto(partnerRequest: PartnerRequest): PartnerRequestDto {
    return {
      id: partnerRequest.partnerRequestId,
      uuid: partnerRequest.uuid,
      vehicleId: partnerRequest.vehicleId,
      partnerId: partnerRequest.partnerId,
      partnerName: partnerRequest.partnerName,
      statusId: partnerRequest.statusId,
      statusName: partnerRequest.statusName,
      comment: partnerRequest.comment,
      saleComment: partnerRequest.saleComment,
      lastOfferCreatedAt: partnerRequest.lastOfferCreatedAt,
      value: partnerRequest.value,
      offerComment: partnerRequest.offerComment,
      createdAt: partnerRequest.createdAt,
      vehicle: partnerRequest.vehicle? VehicleMap.toAdminShortDto(partnerRequest.vehicle) : null,
      createdBy: partnerRequest.createdBy,
    };
  }

  public static toPersistence(partnerRequest: PartnerRequest): any {
    return {
      uuid: partnerRequest.uuid,
      vehicleId: partnerRequest.vehicleId,
      partnerId: partnerRequest.partnerId,
      statusId: partnerRequest.statusId,
      comment: partnerRequest.comment,
      saleComment: partnerRequest.saleComment,
      createdBy: partnerRequest.createdBy,
    };
  }
}
