import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleFileNumberProps {
  value?: string;
}

export class VehicleFileNumber extends ValueObject<VehicleFileNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: VehicleFileNumberProps) {
    super(props);
  }

  public static create(value: string): Result<VehicleFileNumber> {
    const rule = Joi.string().min(2).max(50).allow(null, '').label(this.name);
    const validate = rule.validate(value);

    if (validate.error) {
      return Result.fail<VehicleFileNumber>(validate.error.message);
    }

    return Result.ok<VehicleFileNumber>(new VehicleFileNumber({ value }));
  }
}
