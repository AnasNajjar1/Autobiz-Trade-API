import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface PointofsalePictureProps {
  value?: string;
}

export class PointofsalePicture extends ValueObject<PointofsalePictureProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PointofsalePictureProps) {
    super(props);
  }

  public static create(value: string): Result<PointofsalePicture> {
    const rule = Joi.string().allow(null).label(this.name).uri();

    const validate = rule.validate(value);

    if (validate.error) {
      return Result.fail<PointofsalePicture>(validate.error.message);
    }

    return Result.ok<PointofsalePicture>(new PointofsalePicture({ value }));
  }
}
