import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleCarPicturesOthersProps {
  value?: any;
}

export class VehicleCarPicturesOthers extends ValueObject<VehicleCarPicturesOthersProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: VehicleCarPicturesOthersProps) {
    super(props);
  }

  public static create(value: any): Result<VehicleCarPicturesOthers> {
    if (typeof value === 'string' && value !== '') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return Result.fail<VehicleCarPicturesOthers>(error);
      }
    }

    const rule = Joi.array()
      .allow(null, '')
      .items(
        Joi.object({
          title: Joi.string(),
          link: Joi.string().uri().required(),
        }),
      )
      .label(this.name);

    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<VehicleCarPicturesOthers>(validate.error.message);
    }

    return Result.ok<VehicleCarPicturesOthers>(
      new VehicleCarPicturesOthers({ value }),
    );
  }
}
