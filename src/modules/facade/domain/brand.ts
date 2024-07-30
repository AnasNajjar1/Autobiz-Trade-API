import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

export interface BrandProps {
  id: number;
  name: string;
}

export class Brand extends AggregateRoot<BrandProps> {
  constructor(props: BrandProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  public static create(props: BrandProps): Result<Brand> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: 'id' },
      { argument: props.name, argumentName: 'name' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Brand>(guardResult.message);
    }

    const brand = new Brand({
      ...props,
    });

    return Result.ok<Brand>(brand);
  }
}
