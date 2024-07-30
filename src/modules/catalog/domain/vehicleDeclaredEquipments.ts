import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleDeclaredEquipmentsProps {
  value?: any;
}

export class VehicleDeclaredEquipments extends ValueObject<VehicleDeclaredEquipmentsProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: VehicleDeclaredEquipmentsProps) {
    super(props);
  }

  public static create(value: any): Result<VehicleDeclaredEquipments> {
    if (typeof value === 'string' && value !== '') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return Result.fail<VehicleDeclaredEquipments>(error);
      }
    }
    //const rule = Joi.array().items(Joi.string()).allow(null, '');
    const rule = Joi.array().allow(null, '');

    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<VehicleDeclaredEquipments>(validate.error.message);
    }

    return Result.ok<VehicleDeclaredEquipments>(
      new VehicleDeclaredEquipments({ value }),
    );
  }
}
