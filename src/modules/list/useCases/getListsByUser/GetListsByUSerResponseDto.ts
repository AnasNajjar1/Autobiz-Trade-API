import { ListByUserDto } from '../../dtos/listByUserDto';

export interface GetListsByUserResponseDto {
  limit: number;
  offset: number;
  rows: Array<ListByUserDto>;
  count: number;
}
