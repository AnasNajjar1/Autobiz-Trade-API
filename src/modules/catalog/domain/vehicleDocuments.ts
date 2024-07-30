import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface VehicleDocumentsProps {
  value?: any;
}

export class VehicleDocuments extends ValueObject<VehicleDocumentsProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: VehicleDocumentsProps) {
    super(props);
  }

  public static create(value: any): Result<VehicleDocuments> {
    if (typeof value === 'string' && value !== '') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return Result.fail<VehicleDocuments>(error);
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
      return Result.fail<VehicleDocuments>(validate.error.message);
    }

    return Result.ok<VehicleDocuments>(new VehicleDocuments({ value }));
  }
}
