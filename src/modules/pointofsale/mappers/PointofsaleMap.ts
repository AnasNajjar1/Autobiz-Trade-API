import { Mapper } from '../../../core/infra/Mapper';
import { PointofsalePicture } from '../domain/pointofsalePicture';
import { Pointofsale } from '../domain/pointofsale';
import { PointofsaleCountry } from '../domain/pointofsaleCountry';
import { PointofsaleDocumentation } from '../domain/pointofsaleDocumentation';
import { PointofsaleLatitude } from '../domain/pointofsaleLatitude';
import { PointofsaleLongitude } from '../domain/pointofsaleLongitude';
import {
  PointofsaleAdminFullDto,
  PointofsaleAdminShortDto,
  PointofsalePublicFullDto,
  PointofsalePublicShortDto,
} from '../dtos/pointofsaleDto';

export class PointofsaleMap implements Mapper<Pointofsale> {
  public static toDomain(raw: any): Pointofsale {
    const pointofsaleOrError = Pointofsale.create(
      {
        uuid: raw.uuid,
        autobizPosId: raw.autobizPosId,
        city: raw.city,
        comments: raw.comments,
        country: PointofsaleCountry.create(raw.country).getValue(),
        documentation: PointofsaleDocumentation.create(
          raw.documentation,
        ).getValue(),
        info: raw.info,
        latitude: PointofsaleLatitude.create(raw.latitude).getValue(),
        longitude: PointofsaleLongitude.create(raw.longitude).getValue(),
        name: raw.name,
        picture: PointofsalePicture.create(raw.picture).getValue(),
        paymentDeadline: raw.paymentDeadline,
        pickupDeadline: raw.pickupDeadline,
        zipCode: raw.zipCode,
        brandsOnline: raw.brandsOnline ? raw.brandsOnline : null,
        isBookmarkedByUser: raw.pointofsalebookmarks?.length > 0 ? true : false,
        countVehicles: raw.vehicles ? raw.vehicles.length : null,
        company: raw.company,
        commentsInt: raw.commentsInt,
        paymentDeadlineInt: raw.paymentDeadlineInt,
        pickupDeadlineInt: raw.pickupDeadlineInt,
      },
      raw.id,
    );

    pointofsaleOrError.isFailure ? console.warn(pointofsaleOrError.error) : '';

    return pointofsaleOrError.isSuccess ? pointofsaleOrError.getValue() : null;
  }

  public static toAdminShortDto(
    pointofsale: Pointofsale,
  ): PointofsaleAdminShortDto {
    return {
      id: pointofsale.id,
      name: pointofsale.name,
      city: pointofsale.city,
      zipCode: pointofsale.zipCode,
      country: pointofsale.country.value,
    };
  }

  public static toPublicShortDto(
    pointofsale: Pointofsale,
  ): PointofsalePublicShortDto {
    return {
      uuid: pointofsale.uuid,
      name: pointofsale.name,
      picture: pointofsale.picture.value,
      city: pointofsale.city,
      zipCode: pointofsale.zipCode,
      country: pointofsale.country.value,
      isBookmarkedByUser: pointofsale.isBookmarkedByUser,
      brandsOnline: pointofsale.brandsOnline ? pointofsale.brandsOnline : null,
      countVehicles: pointofsale.countVehicles,
    };
  }

  public static toPublicFullDto(
    pointofsale: Pointofsale,
  ): PointofsalePublicFullDto {
    return {
      uuid: pointofsale.uuid,
      city: pointofsale.city,
      comments: pointofsale.comments,
      country: pointofsale.country.value,
      documentation: pointofsale.documentation.value,
      info: pointofsale.info,
      latitude: pointofsale.latitude.value,
      longitude: pointofsale.longitude.value,
      name: pointofsale.name,
      picture: pointofsale.picture.value,
      paymentDeadline: pointofsale.paymentDeadline,
      pickupDeadline: pointofsale.pickupDeadline,
      zipCode: pointofsale.zipCode,
      brandsOnline: pointofsale.brandsOnline ? pointofsale.brandsOnline : null,
      isBookmarkedByUser: pointofsale.isBookmarkedByUser,
      countVehicles: pointofsale.countVehicles,
      company: pointofsale.company,
      commentsInt: JSON.parse(pointofsale.commentsInt),
      paymentDeadlineInt: JSON.parse(pointofsale.paymentDeadlineInt),
      pickupDeadlineInt: JSON.parse(pointofsale.pickupDeadlineInt),
    };
  }

  public static toAdminFullDto(
    pointofsale: Pointofsale,
  ): PointofsaleAdminFullDto {
    return {
      id: pointofsale.id,
      uuid: pointofsale.uuid,
      autobizPosId: pointofsale.autobizPosId,
      city: pointofsale.city,
      comments: pointofsale.comments,
      country: pointofsale.country.value,
      documentation: pointofsale.documentation.value,
      info: pointofsale.info,
      latitude: pointofsale.latitude.value,
      longitude: pointofsale.longitude.value,
      name: pointofsale.name,
      picture: pointofsale.picture.value,
      paymentDeadline: pointofsale.paymentDeadline,
      pickupDeadline: pointofsale.pickupDeadline,
      zipCode: pointofsale.zipCode,
      company: pointofsale.company,
    };
  }

  public static async toPersistence(pointofsale: Pointofsale): Promise<any> {
    return {
      uuid: pointofsale.uuid,
      autobizPosId: pointofsale.autobizPosId,
      city: pointofsale.city,
      comments: pointofsale.comments,
      country: pointofsale.country.value,
      documentation: JSON.stringify(pointofsale.documentation.value),
      info: pointofsale.info,
      latitude: pointofsale.latitude.value,
      longitude: pointofsale.longitude.value,
      name: pointofsale.name,
      picture: pointofsale.picture.value,
      paymentDeadline: pointofsale.paymentDeadline,
      pickupDeadline: pointofsale.pickupDeadline,
      zipCode: pointofsale.zipCode,
      company: pointofsale.company,
      paymentDeadlineInt: pointofsale.paymentDeadlineInt,
      pickupDeadlineInt: pointofsale.pickupDeadlineInt,
      commentsInt: pointofsale.commentsInt,
    };
  }
}
