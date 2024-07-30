import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface GroupNameProps {
  value?: string;
}

export class GroupName extends ValueObject<GroupNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: GroupNameProps) {
    super(props);
  }

  public static create(value: string): Result<GroupName> {
    const rule = Joi.string().required().min(2).max(255).label(this.name);
    const validate = rule.validate(value);

    if (validate.error) {
      return Result.fail<GroupName>(validate.error.message);
    }

    return Result.ok<GroupName>(new GroupName({ value }));
  }
}
