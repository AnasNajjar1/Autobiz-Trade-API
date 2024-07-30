import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleProfileCostsProps {
  value?: string;
}

export class VehicleProfileCosts extends ValueObject<VehicleProfileCostsProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: VehicleProfileCostsProps) {
    super(props);
  }

  public static create(value: string): Result<VehicleProfileCosts> {
    if (typeof value === 'string') {
      value = value.trim();
      value = value.toUpperCase();
    }

    const rule = Joi.string()
      .allow(null)
      .valid('A', 'B', 'C', 'D', 'E')
      .label(this.name);
    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<VehicleProfileCosts>(validate.error.message);
    }

    return Result.ok<VehicleProfileCosts>(new VehicleProfileCosts({ value }));
  }
}
