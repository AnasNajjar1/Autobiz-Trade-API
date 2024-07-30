import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleWheelsDimensionProps {
  value?: any;
}

export class VehicleWheelsDimension extends ValueObject<VehicleWheelsDimensionProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: VehicleWheelsDimensionProps) {
    super(props);
  }

  public static create(value: any): Result<VehicleWheelsDimension> {
    if (typeof value === 'string' && value !== '') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return Result.fail<VehicleWheelsDimension>(error);
      }
    }
    //TODO: Change with number and min max for each keys
    const rule = Joi.object({
      // diameter: Joi.string().required(),
      // width: Joi.string().required(),
      // height: Joi.string().required(),
      diameter: Joi.string().allow(''),
      width: Joi.string().allow(''),
      height: Joi.string().allow(''),
    })
      .allow(null)
      .label(this.name);

    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<VehicleWheelsDimension>(validate.error.message);
    }

    return Result.ok<VehicleWheelsDimension>(
      new VehicleWheelsDimension({ value }),
    );
  }
}
