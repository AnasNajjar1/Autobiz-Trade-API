import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleCarPicturesProps {
  value?: any;
}

export class VehicleCarPictures extends ValueObject<VehicleCarPicturesProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: VehicleCarPicturesProps) {
    super(props);
  }

  public static create(value: any): Result<VehicleCarPictures> {
    if (typeof value === 'string' && value !== '') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return Result.fail<VehicleCarPictures>(error);
      }
    }

    if (value === null) {
      value = {};
    }

    const rule = Joi.object()
      .pattern(/.*/, [Joi.string().uri().allow(null)])
      .label(this.name)
      .allow(null, '');
    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<VehicleCarPictures>(validate.error.message);
    }

    return Result.ok<VehicleCarPictures>(new VehicleCarPictures({ value }));
  }
}
