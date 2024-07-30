import { Mapper } from '../../../core/infra/Mapper';
import { PartnerOffer } from '../domain/partnerOffer';
import { PartnerOfferDto } from '../dtos/partnerOfferDto';

export class PartnerOfferMap implements Mapper<PartnerOffer> {
  public static toDomain(raw: any): PartnerOffer {
    const partnerOfferOrError = PartnerOffer.create(
      {
        value: raw.value,
        comment: raw.comment,
        partnerRequestId: raw.partnerRequestId,
        ipSource: raw.ipSource,
      },
      raw.id,
    );

    partnerOfferOrError.isFailure
      ? console.warn(partnerOfferOrError.error)
      : '';

    return partnerOfferOrError.isSuccess
      ? partnerOfferOrError.getValue()
      : null;
  }

  public static toDto(partnerOffer: PartnerOffer): PartnerOfferDto {
    return {
      id: partnerOffer.partnerOfferId,
      value: partnerOffer.value,
      comment: partnerOffer.comment,
      partnerRequestId: partnerOffer.partnerRequestId,
      ipSource: partnerOffer.ipSource,
    };
  }

  public static toPersistence(partnerOffer: PartnerOffer): any {
    return {
      value: partnerOffer.value,
      comment: partnerOffer.comment,
      partnerRequestId: partnerOffer.partnerRequestId,
      ipSource: partnerOffer.ipSource,
    };
  }
}
