import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleConstructorEquipmentsProps {
  value?: any;
}

export class VehicleConstructorEquipments extends ValueObject<VehicleConstructorEquipmentsProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: VehicleConstructorEquipmentsProps) {
    super(props);
  }

  public static create(value: any): Result<VehicleConstructorEquipments> {
    if (typeof value === 'string' && value !== '') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return Result.fail<VehicleConstructorEquipments>(error);
      }
    }
    const rule = Joi.array().items(Joi.string()).allow(null, '');

    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<VehicleConstructorEquipments>(validate.error.message);
    }

    return Result.ok<VehicleConstructorEquipments>(
      new VehicleConstructorEquipments({ value }),
    );
  }
}
