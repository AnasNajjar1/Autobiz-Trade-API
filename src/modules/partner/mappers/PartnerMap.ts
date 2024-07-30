import { Mapper } from '../../../core/infra/Mapper';
import { Partner } from '../domain/partner';
import { PartnerDto } from '../dtos/partnerDto';

export class PartnerMap implements Mapper<Partner> {
  public static toDomain(raw: any): Partner {
    const partnerOrError = Partner.create(
      {
        name: raw.name,
      },
      raw.id,
    );

    partnerOrError.isFailure ? console.warn(partnerOrError.error) : '';

    return partnerOrError.isSuccess ? partnerOrError.getValue() : null;
  }

  public static toDto(partner: Partner): PartnerDto {
    return {
      id: partner.partnerId,
      name: partner.name,
    };
  }

  public static toPersistence(partner: Partner): any {
    return {
      name: partner.name,
    };
  }
}
