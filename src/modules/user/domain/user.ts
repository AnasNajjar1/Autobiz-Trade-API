import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { UserAutobizUserId } from './userAutobizUserId';
import { Group } from '../../group/domain/group';

export interface UserProps {
  id?: number;
  autobizUserId: UserAutobizUserId;
  notificationDaily: boolean;
  notificationNewPush: boolean;
  notificationAuction: boolean;
  inGroups?: Group[];
  hasGroups?: Group[];
}

export class User extends AggregateRoot<UserProps> {
  constructor(props: UserProps, id?: number) {
    super(props, id);
  }

  get autobizUserId(): UserAutobizUserId {
    return this.props.autobizUserId;
  }

  public updateAutobizUserId(autobizUserId: UserAutobizUserId): Result<void> {
    this.props.autobizUserId = autobizUserId;
    return Result.ok<void>();
  }

  get notificationDaily(): boolean {
    return this.props.notificationDaily;
  }

  public updateNotificationDaily(notificationDaily: boolean): Result<void> {
    this.props.notificationDaily = notificationDaily;
    return Result.ok<void>();
  }

  get notificationNewPush(): boolean {
    return this.props.notificationNewPush;
  }

  public updateNotificationNewPush(notificationNewPush: boolean): Result<void> {
    this.props.notificationNewPush = notificationNewPush;
    return Result.ok<void>();
  }

  get notificationAuction(): boolean {
    return this.props.notificationAuction;
  }

  public updateNotificationAuction(notificationAuction: boolean): Result<void> {
    this.props.notificationAuction = notificationAuction;
    return Result.ok<void>();
  }

  get inGroups(): Group[] {
    return this.props.inGroups;
  }

  public updateInGroups(groups: Group[]): Result<void> {
    this.props.inGroups = groups;
    return Result.ok<void>();
  }

  get hasGroups(): Group[] {
    return this.props.hasGroups;
  }

  public updateHasGroups(groups: Group[]): Result<void> {
    this.props.hasGroups = groups;
    return Result.ok<void>();
  }

  public static create(props: UserProps, id?: number): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.autobizUserId, argumentName: 'autobizUserId' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    }

    const user = new User(
      {
        ...props,
      },
      id,
    );

    return Result.ok<User>(user);
  }

  get country(): string {
    const autobizUserId = this.props.autobizUserId.value;
    return [
      'offlineContext_cognitoAuthenticationProvider',
      'offlineContext_authorizer_principalId',
    ].includes(autobizUserId)
      ? 'FR'
      : autobizUserId.split('_')[0];
  }
}
