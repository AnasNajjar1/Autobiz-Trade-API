import { Entity } from '../../../core/domain/Entity';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

export interface NotificationProps {
  id?: number;
  userId: number;
  type: string;
  data: any;
  referenceTable?: string;
  referenceId?: number;
  viaMail?: boolean;
  viaApp?: boolean;
  mailSentAt?: Date;
  mailSentError?: string;
}

export class Notification extends Entity<NotificationProps> {
  constructor(props: NotificationProps, id?: number) {
    super(props, id);
  }

  get userId(): number {
    return this.props.userId;
  }

  get type(): string {
    return this.props.type;
  }

  get data(): any {
    return this.props.data;
  }

  get referenceTable(): string {
    return this.props.referenceTable;
  }

  get referenceId(): number {
    return this.props.referenceId;
  }

  get viaMail(): boolean {
    return this.props.viaMail;
  }

  get viaApp(): boolean {
    return this.props.viaApp;
  }

  get mailSentAt(): Date {
    return this.props.mailSentAt;
  }

  get mailSentError(): string {
    return this.props.mailSentError;
  }

  public static create(
    props: NotificationProps,
    id?: number,
  ): Result<Notification> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.type, argumentName: 'type' },
      { argument: props.data, argumentName: 'data' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Notification>(guardResult.message);
    }

    const notification = new Notification(
      {
        ...props,
      },
      id,
    );

    return Result.ok<Notification>(notification);
  }
}
