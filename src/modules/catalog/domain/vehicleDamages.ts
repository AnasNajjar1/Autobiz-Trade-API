import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleDamagesProps {
  value?: any;
}

export class VehicleDamages extends ValueObject<VehicleDamagesProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: VehicleDamagesProps) {
    super(props);
  }

  public static create(value: any): Result<VehicleDamages> {
    if (typeof value === 'string' && value !== '') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return Result.fail<VehicleDamages>(error);
      }
    }

    const rule = Joi.array()
      .allow(null, '')
      .items(
        Joi.object({
          element: Joi.string().required(),
          damage: Joi.alternatives()
            .try(Joi.array().items(Joi.string()), Joi.string())
            .allow(''),
          damage_picture: Joi.string().uri().allow(''),
          damage_picture2: Joi.string().uri().allow(''),
          custom_damage: Joi.string().allow(''),
          is_custom: Joi.allow(''),
          reconditionning: Joi.string().allow(''),
          zone: Joi.string().allow(''),
        }),
      )
      .label(this.name);

    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<VehicleDamages>(validate.error.message);
    }

    return Result.ok<VehicleDamages>(new VehicleDamages({ value }));
  }
}
