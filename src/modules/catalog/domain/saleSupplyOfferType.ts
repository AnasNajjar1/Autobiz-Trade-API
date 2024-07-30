import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';

interface SaleSupplyTypeProps {
  value?: string;
}

export class SaleSupplyType extends ValueObject<SaleSupplyTypeProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: SaleSupplyTypeProps) {
    super(props);
  }

  public static create(value: string): Result<SaleSupplyType> {
    const rule = Joi.string().valid('stock', 'offerToPrivate').label(this.name);
    const validate = rule.validate(value);

    if (validate.error) {
      console.warn(validate.error.message);
      return Result.fail<SaleSupplyType>(validate.error.message);
    }

    return Result.ok<SaleSupplyType>(new SaleSupplyType({ value }));
  }
}
