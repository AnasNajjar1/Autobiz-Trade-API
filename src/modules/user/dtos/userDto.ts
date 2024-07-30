import { GroupDto } from '../../group/dtos/groupDto';

export interface UserDto {
  id?: number;
  autobizUserId: string;
  notificationDaily: boolean;
  notificationNewPush: boolean;
  notificationAuction: boolean;
  inGroups?: GroupDto[];
  hasGroups?: GroupDto[];
}
