import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

export interface ModelProps {
  id: number;
  name: string;
}

export class Model extends AggregateRoot<ModelProps> {
  constructor(props: ModelProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  public static create(props: ModelProps): Result<Model> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.id, argumentName: 'id' },
      { argument: props.name, argumentName: 'name' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Model>(guardResult.message);
    }

    const model = new Model({
      ...props,
    });

    return Result.ok<Model>(model);
  }
}
