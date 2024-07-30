import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleKeyPointsProps {
  value?: any;
}

export class VehicleKeyPoints extends ValueObject<VehicleKeyPointsProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: VehicleKeyPointsProps) {
    super(props);
  }

  public static create(value: any): Result<VehicleKeyPoints> {
    if (typeof value === 'string' && value !== '') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return Result.fail<VehicleKeyPoints>(error);
      }
    }
    const rule = Joi.array().items(Joi.string()).allow(null, '');

    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<VehicleKeyPoints>(validate.error.message);
    }

    return Result.ok<VehicleKeyPoints>(new VehicleKeyPoints({ value }));
  }
}
