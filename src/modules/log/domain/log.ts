import { Entity } from '../../../core/domain/Entity';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface LogProps {
  id?: number;
  referenceTable: string;
  referenceId: number;
  data: string;
  user: string;
  action: string;
  createdAt: Date;
}

export class Log extends Entity<LogProps> {
  constructor(props: LogProps, id?: number) {
    super(props, id);
  }

  get logId(): number {
    return this._id;
  }

  get referenceTable(): string {
    return this.props.referenceTable;
  }

  get referenceId(): number {
    return this.props.referenceId;
  }

  get data(): string {
    return this.props.data;
  }

  get action(): string {
    return this.props.action;
  }

  get user(): string {
    return this.props.user;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(props: LogProps, id?: number): Result<Log> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.referenceTable, argumentName: 'referenceTable' },
      { argument: props.referenceId, argumentName: 'referenceId' },
      { argument: props.action, argumentName: 'action' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Log>(guardResult.message);
    }

    return Result.ok<Log>(
      new Log(
        {
          ...props,
        },
        id,
      ),
    );
  }
}
