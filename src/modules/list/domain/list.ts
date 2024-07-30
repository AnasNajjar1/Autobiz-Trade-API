import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { Sale } from '../../catalog/domain/sale';
import { ListPicture } from './listPicture';

export interface ListProps {
  id?: number;
  uuid?: string;
  name: string;
  picture?: ListPicture;
  startDateTime: Date;
  endDateTime: Date;
  groupId?: number;
  sales?: Sale[];
  vehicles?: any[];
}

export class List extends AggregateRoot<ListProps> {
  constructor(props: ListProps, id?: number) {
    super(props, id);
    if (!id) {
      props.uuid = uuidv4();
    }
  }

  get uuid(): string {
    return this.props.uuid;
  }

  get name(): string {
    return this.props.name;
  }

  public updateName(name: string): Result<void> {
    this.props.name = name;
    return Result.ok<void>();
  }

  get picture(): ListPicture {
    return this.props.picture;
  }

  public updatePicture(picture: ListPicture): Result<void> {
    this.props.picture = picture;
    return Result.ok<void>();
  }

  get startDateTime(): Date {
    return this.props.startDateTime;
  }

  public updateStartDateTime(startDateTime: Date): Result<void> {
    this.props.startDateTime = startDateTime;
    return Result.ok<void>();
  }

  get endDateTime(): Date {
    return this.props.endDateTime;
  }

  public updateEndDateTime(endDateTime: Date): Result<void> {
    this.props.endDateTime = endDateTime;
    return Result.ok<void>();
  }

  get groupId(): number {
    return this.props.groupId;
  }

  public updateGroupId(groupId: number): Result<void> {
    this.props.groupId = groupId;
    return Result.ok<void>();
  }

  get sales(): Sale[] {
    return this.props.sales;
  }

  get vehicles(): any[] {
    return this.props.vehicles;
  }

  public static create(props: ListProps, id?: number): Result<List> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<List>(guardResult.message);
    }

    const list = new List(
      {
        ...props,
      },
      id,
    );

    return Result.ok<List>(list);
  }
}
