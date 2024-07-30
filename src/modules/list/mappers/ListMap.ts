import { Mapper } from '../../../core/infra/Mapper';
import { Sale } from '../../catalog/domain/sale';
import { SaleMap } from '../../catalog/mappers/SaleMap';
import { List } from '../domain/list';
import { ListPicture } from '../domain/listPicture';
import { ListAdminDto, ListPublicDto } from '../dtos/listDto';

export class ListMap implements Mapper<List> {
  public static toDomain(raw: any): List {
    const listOrError = List.create(
      {
        uuid: raw.uuid,
        name: raw.name,
        picture: ListPicture.create(raw.picture).getValue(),
        startDateTime: raw.startDateTime,
        endDateTime: raw.endDateTime,
        groupId: raw.groupId,
        sales: raw.sales ? raw.sales.map((s) => SaleMap.toDomain(s)) : [],
      },
      raw.id,
    );

    listOrError.isFailure ? console.warn(listOrError.error) : '';

    return listOrError.isSuccess ? listOrError.getValue() : null;
  }

  public static toAdminDto(list: List): ListAdminDto {
    return {
      id: list.id,
      uuid: list.uuid,
      name: list.name,
      picture: list.picture?.value,
      startDateTime: list.startDateTime,
      endDateTime: list.endDateTime,
      groupId: list.groupId,
      sales: list.sales ? list.sales.map((s) => SaleMap.toAdminDto(s)) : null,
    };
  }

  public static toPublicDto(list: List): ListPublicDto {
    return {
      id: list.id,
      uuid: list.uuid,
      name: list.name,
      picture: list.picture?.value,
      startDateTime: list.startDateTime,
      endDateTime: list.endDateTime,
      sales: list.sales
        ? list.sales.map((s) => SaleMap.toPublicShortDto(s))
        : null,
    };
  }

  public static async toPersistence(list: List): Promise<any> {
    return {
      uuid: list.uuid,
      name: list.name,
      picture: list.picture.value,
      startDateTime: list.startDateTime,
      endDateTime: list.endDateTime,
      groupId: list.groupId,
    };
  }
}
