import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface PointofsaleLatitudeProps {
  value: number;
}

export class PointofsaleLatitude extends ValueObject<PointofsaleLatitudeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: PointofsaleLatitudeProps) {
    super(props);
  }

  public static create(value: number): Result<PointofsaleLatitude> {
    const rule = Joi.number().allow(null).min(-90).max(90).label(this.name);

    const validate = rule.validate(value);

    if (validate.error) {
      return Result.fail<PointofsaleLatitude>(validate.error.message);
    }

    return Result.ok<PointofsaleLatitude>(new PointofsaleLatitude({ value }));
  }
}
