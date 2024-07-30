import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface OfferAmountProps {
  value?: number;
}

export class OfferAmount extends ValueObject<OfferAmountProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: OfferAmountProps) {
    super(props);
  }

  public static create(value: number): Result<OfferAmount> {
    const rule = Joi.number().min(1).label(this.name);
    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<OfferAmount>(validate.error.message);
    }

    return Result.ok<OfferAmount>(new OfferAmount({ value }));
  }
}
