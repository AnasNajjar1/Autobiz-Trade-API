import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface PointofsaleLongitudeProps {
  value: number;
}

export class PointofsaleLongitude extends ValueObject<PointofsaleLongitudeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: PointofsaleLongitudeProps) {
    super(props);
  }

  public static create(value: number): Result<PointofsaleLongitude> {
    const rule = Joi.number()
      .allow(null, '')
      .min(-180)
      .max(180)
      .label(this.name);

    const validate = rule.validate(value);

    if (validate.error) {
      return Result.fail<PointofsaleLongitude>(validate.error.message);
    }

    return Result.ok<PointofsaleLongitude>(new PointofsaleLongitude({ value }));
  }
}
