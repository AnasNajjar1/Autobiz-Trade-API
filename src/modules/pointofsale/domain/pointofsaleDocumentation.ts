import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface PointofsaleDocumentationProps {
  value?: any;
}

export class PointofsaleDocumentation extends ValueObject<PointofsaleDocumentationProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: PointofsaleDocumentationProps) {
    super(props);
  }

  public static create(value: any): Result<PointofsaleDocumentation> {
    if (typeof value === 'string' && value !== '') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return Result.fail<PointofsaleDocumentation>(error);
      }
    }

    const rule = Joi.array()
      .allow(null, '')
      .items(
        Joi.object({
          title: Joi.string().allow(null, ''),
          pdf: Joi.string().uri().required(),
          text: Joi.string().allow(null, ''),
          // title: Joi.string().required(),
          // pdf: Joi.string().required().uri(),
          // text: Joi.string().allow(null, ''),
        }),
      )
      .label(this.name);

    const validate = rule.validate(value);

    if (validate.error) {
      return Result.fail<PointofsaleDocumentation>(validate.error.message);
    }

    return Result.ok<PointofsaleDocumentation>(
      new PointofsaleDocumentation({ value }),
    );
  }
}
