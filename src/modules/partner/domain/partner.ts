import { Entity } from '../../../core/domain/Entity';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

interface PartnerProps {
  id?: number;
  name: string;
}

export class Partner extends Entity<PartnerProps> {
  constructor(props: PartnerProps, id?: number) {
    super(props, id);
  }

  get partnerId(): number {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  public static create(props: PartnerProps, id?: number): Result<Partner> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Partner>(guardResult.message);
    }

    return Result.ok<Partner>(
      new Partner(
        {
          ...props,
        },
        id,
      ),
    );
  }
}
