import { Mapper } from '../../../core/infra/Mapper';
import { Pointofsale } from '../domain/pointofsale';
import { PointofsaleCountry } from '../domain/pointofsaleCountry';
import { PointofsaleLatitude } from '../domain/pointofsaleLatitude';
import { PointofsaleLongitude } from '../domain/pointofsaleLongitude';
import { PointofsaleDto } from '../dtos/pointofsaleDto';

export class PointofsaleSimpleMap implements Mapper<Pointofsale> {
  public static toDomain(raw: any): Pointofsale {
    const pointofsaleOrError = Pointofsale.create(
      {
        uuid: raw.uuid,
        autobizPosId: raw.autobizPosId,
        city: raw.city,
        country: PointofsaleCountry.create(raw.country).getValue(),
        latitude: PointofsaleLatitude.create(raw.latitude).getValue(),
        longitude: PointofsaleLongitude.create(raw.longitude).getValue(),
        name: raw.name,
        zipCode: raw.zipCode,
      },
      raw.id,
    );

    pointofsaleOrError.isFailure ? console.warn(pointofsaleOrError.error) : '';

    return pointofsaleOrError.isSuccess ? pointofsaleOrError.getValue() : null;
  }

  public static toDto(pointofsale: Pointofsale): PointofsaleDto {
    return {
      id: pointofsale.id,
      uuid: pointofsale.uuid,
      autobizPosId: pointofsale.autobizPosId,
      city: pointofsale.city,
      country: pointofsale.country.value,
      latitude: pointofsale.latitude.value,
      longitude: pointofsale.longitude.value,
      name: pointofsale.name,
      zipCode: pointofsale.zipCode,
      company: pointofsale.company,
    };
  }
}
