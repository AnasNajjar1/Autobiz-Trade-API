import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { GroupName } from './groupName';

export interface GroupProps {
  id?: number;
  name: GroupName;
}

export class Group extends AggregateRoot<GroupProps> {
  constructor(props: GroupProps, id?: number) {
    super(props, id);
  }

  get name(): GroupName {
    return this.props.name;
  }

  public updateName(name: GroupName): Result<void> {
    this.props.name = name;
    return Result.ok<void>();
  }

  public static create(props: GroupProps, id?: number): Result<Group> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Group>(guardResult.message);
    }

    const group = new Group(
      {
        ...props,
      },
      id,
    );

    return Result.ok<Group>(group);
  }
}
