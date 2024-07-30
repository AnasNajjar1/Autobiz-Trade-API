import { Result } from '../../../core/logic/Result';
import { ValueObject } from '../../../core/domain/ValueObject';
import * as Joi from 'joi';
import countries from '../../../shared/lists/countries';

interface PointofsaleCountryProps {
  value?: string;
}

export class PointofsaleCountry extends ValueObject<PointofsaleCountryProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PointofsaleCountryProps) {
    super(props);
  }

  public static create(value: string): Result<PointofsaleCountry> {
    if (typeof value === 'string') {
      value = value.trim();
      value = value.toLowerCase();
    }

    const rule = Joi.string()
      .allow(null, '')
      .label(this.name)
      .valid(...Object.values(countries).map((c) => c.toLowerCase()));

    const validate = rule.validate(value);

    if (validate.error) {
      return Result.fail<PointofsaleCountry>(validate.error.message);
    }

    return Result.ok<PointofsaleCountry>(new PointofsaleCountry({ value }));
  }
}
