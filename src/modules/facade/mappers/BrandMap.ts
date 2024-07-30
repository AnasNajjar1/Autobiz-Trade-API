import { Mapper } from '../../../core/infra/Mapper';
import { Brand } from '../domain/brand';
import { BrandDto } from '../dtos/brandDto';

export class BrandMap implements Mapper<Brand> {
  public static toDomain(raw: any): Brand {
    const brandOrError = Brand.create({
      id: raw.id,
      name: raw.name,
    });

    brandOrError.isFailure ? console.warn(brandOrError.error) : '';

    return brandOrError.isSuccess ? brandOrError.getValue() : null;
  }

  public static toDto(brand): BrandDto {
    return {
      id: brand.name,
      name: brand.name,
    };
  }
}
