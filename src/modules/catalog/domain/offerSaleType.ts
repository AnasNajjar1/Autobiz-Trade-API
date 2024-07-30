import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface OfferSaleTypeProps {
  value?: string;
}

export class OfferSaleType extends ValueObject<OfferSaleTypeProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: OfferSaleTypeProps) {
    super(props);
  }

  public static create(value: string): Result<OfferSaleType> {
    const rule = Joi.string()
      .valid('auction', 'submission', 'immediatePurchase')
      .required()
      .label(this.name);
    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<OfferSaleType>(validate.error.message);
    }

    return Result.ok<OfferSaleType>(new OfferSaleType({ value }));
  }
}
